// Cliente mínimo de Chrome DevTools Protocol (sin dependencias; Node >= 22).
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export async function launchChrome(port = 9333, profile = '/tmp/medla-chrome-profile') {
  const proc = spawn(CHROME, [
    '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
    '--window-size=1440,900', '--hide-scrollbars', '--disable-gpu', '--no-first-run',
    '--no-default-browser-check', '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', 'about:blank',
  ], { stdio: 'ignore' });
  let ws = null;
  for (let i = 0; i < 120; i += 1) {  // hasta 30 s: con el equipo cargado Chrome tarda en arrancar
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      ws = (await res.json()).webSocketDebuggerUrl;
      break;
    } catch { await sleep(250); }
  }
  if (!ws) throw new Error('Chrome no arrancó');
  const sock = new WebSocket(ws);
  await new Promise((resolve, reject) => { sock.onopen = resolve; sock.onerror = reject; });
  let id = 0;
  const pending = new Map();
  const listeners = [];
  sock.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(`${msg.error.message}`)); else resolve(msg.result);
    } else if (msg.method) {
      listeners.forEach((fn) => fn(msg));
    }
  };
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    id += 1;
    pending.set(id, { resolve, reject });
    sock.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const on = (fn) => listeners.push(fn);
  const close = async () => { try { sock.close(); } catch {} proc.kill('SIGTERM'); };
  return { send, on, close };
}

export async function newPage(cdp, width = 1440, height = 900) {
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  const s = (m, p) => cdp.send(m, p, sessionId);
  await s('Page.enable'); await s('Runtime.enable');
  await s('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  return {
    targetId, sessionId, send: s,
    async goto(url, waitMs = 1500) {
      let loaded;
      const p = new Promise((r) => { loaded = r; });
      const fn = (msg) => { if (msg.sessionId === sessionId && msg.method === 'Page.loadEventFired') loaded(); };
      cdp.on(fn);
      await s('Page.navigate', { url });
      await Promise.race([p, sleep(30000)]);
      await sleep(waitMs);
    },
    async eval(expression, awaitPromise = true) {
      const r = await s('Runtime.evaluate', { expression, awaitPromise, returnByValue: true, timeout: 120000 });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
      return r.result.value;
    },
    async screenshot(path, opts = {}) {
      const { data } = await s('Page.captureScreenshot', { format: 'png', ...opts });
      const fs = await import('node:fs'); fs.writeFileSync(path, Buffer.from(data, 'base64'));
    },
    async close() { await cdp.send('Target.closeTarget', { targetId }); },
  };
}

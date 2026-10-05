// QA por CDP: recorre la landing por paradas con el motion real y captura cada vista.
//   node tools/qa.mjs <ancho> [reduce]      → $OUT/<ancho>-<n>-<parada>.png
import fs from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import { launchChrome, newPage } from './cdp.mjs';

const W = Number(process.argv[2]) || 1440;
const reduce = process.argv[3] === 'reduce';
const H = W < 600 ? 812 : W < 1000 ? 1024 : 900;
const out = process.env.OUT || '/tmp/medla-ext-qa';
fs.mkdirSync(out, { recursive: true });
const cdp = await launchChrome(9341 + (W % 7), `/tmp/medla-ext-chrome-${W}`);
const page = await newPage(cdp, W, H);
const logs = [];
cdp.on((m) => {
  if (m.sessionId !== page.sessionId) return;
  if (m.method === 'Runtime.exceptionThrown') logs.push('EXC ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
  if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) logs.push(m.params.type + ' ' + m.params.args.map((a) => a.value ?? a.description).join(' '));
});
await page.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: W < 600 });
if (W < 600) await page.send('Emulation.setTouchEmulationEnabled', { enabled: true });
await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' }] });
await page.goto(process.env.URL || 'http://localhost:4325/', 3600);

const stops = [
  ['hero', '0'],
  ['hero-scroll', 'innerHeight*0.45'],
  ['cases', "document.querySelector('#situaciones').offsetTop - 40"],
  ['cases-2', "document.querySelector('.case--c').getBoundingClientRect().top + scrollY - 120"],
  ['urgent', "document.querySelector('.case--urgent').getBoundingClientRect().top + scrollY - 200"],
  ['stats', "document.querySelector('.stats').getBoundingClientRect().top + scrollY - 100"],
  ['how', "document.querySelector('#como-funciona').getBoundingClientRect().top + scrollY + innerHeight*0.6"],
  ['zoom-0', "(window.ScrollTrigger?.getAll().find(t=>t.pin)?.start ?? document.querySelector('.zoom').offsetTop)"],
  ['zoom-50', "(()=>{const t=window.ScrollTrigger?.getAll().find(t=>t.pin); return t? t.start+(t.end-t.start)*0.45 : document.querySelector('.zoom').offsetTop})()"],
  ['zoom-100', "(()=>{const t=window.ScrollTrigger?.getAll().find(t=>t.pin); return t? t.end-10 : document.querySelector('.zoom').offsetTop+200})()"],
  ['takeaway', "document.querySelector('.takeaway').getBoundingClientRect().top + scrollY + 60"],
  ['pillars', "document.querySelector('.pillars').getBoundingClientRect().top + scrollY - 200"],
  ['reviews', "document.querySelector('#opiniones').getBoundingClientRect().top + scrollY + 40"],
  ['booking', "document.querySelector('#reserva').getBoundingClientRect().top + scrollY - 40"],
  ['booking-2', "document.querySelector('.calendar').getBoundingClientRect().top + scrollY + 300"],
  ['faq', "document.querySelector('#preguntas').getBoundingClientRect().top + scrollY + 40"],
  ['finale', "document.querySelector('.finale').getBoundingClientRect().top + scrollY - innerHeight*0.15"],
  ['footer', 'document.documentElement.scrollHeight'],
];
let i = 0;
for (const [name, expr] of stops) {
  // llegar por pasos para que los ScrollTrigger se disparen en orden
  await page.eval(`(async()=>{const target=Math.max(0, ${expr}); let y=scrollY; const step=(target-y)/8; for(let k=0;k<8;k++){y+=step; scrollTo(0,y); await new Promise(r=>setTimeout(r,70));} scrollTo(0,target); return 1})()`);
  await sleep(name.startsWith('zoom') ? 2200 : 1600);
  i += 1;
  await page.screenshot(`${out}/${W}${reduce ? 'r' : ''}-${String(i).padStart(2, '0')}-${name}.png`, { captureBeyondViewport: false });
}
const info = await page.eval(`({ overflowX: document.documentElement.scrollWidth - innerWidth, st: window.ScrollTrigger ? ScrollTrigger.getAll().length : -1, h: document.documentElement.scrollHeight,
  wide: [...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect(); return r.right>innerWidth+1 && getComputedStyle(e).position!=='fixed' && !e.closest('.marquee,.reviews__track,.zoom,.finale,.hero__orbits,.finder__chips')}).slice(0,8).map(e=>e.tagName+'.'+e.className+':'+Math.round(e.getBoundingClientRect().right)) })`);
console.log(JSON.stringify(info));
console.log(logs.length ? logs.join('\n') : 'consola limpia');
await page.close(); await cdp.close();

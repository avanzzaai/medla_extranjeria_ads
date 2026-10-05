import { launchChrome, newPage } from './cdp.mjs';
const cdp = await launchChrome(9361, '/tmp/medla-ext-chrome-og');
const page = await newPage(cdp, 1200, 630);
await page.goto('http://localhost:4325/tools/og.html', 2500);
await page.eval('document.fonts.ready.then(()=>1)');
const { data } = await page.send('Page.captureScreenshot', { format: 'jpeg', quality: 86 });
(await import('node:fs')).writeFileSync('assets/img/og-image.jpg', Buffer.from(data, 'base64'));
await page.close(); await cdp.close();

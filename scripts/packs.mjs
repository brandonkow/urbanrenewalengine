// Exports every owner briefing pack (site × language × scenario) to PDF in out/packs/.
//
//   npm run packs
//   npm run packs -- --contact my-contact.json   prints your contact block instead of placeholders
//                                                ({"name","phone","email","meet"}; your own details only)
//
// Each PDF must fit on two A4 pages, and Chinese packs must render with a CJK font. On Linux without
// one, install Noto Sans CJK (for example `sudo apt install fonts-noto-cjk`); macOS and Windows ship one.
import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { ROOT, launch, openEngine } from '../tests/lib.mjs';

const OUT = path.join(ROOT, 'out', 'packs');
const ci = process.argv.indexOf('--contact');
const contact = ci > 0 ? JSON.parse(readFileSync(path.resolve(process.argv[ci + 1]), 'utf8')) : null;
const CJK = /CJK|Hei|Song|Ming|Kai|PingFang|Hiragino|YaHei|SimSun|Source Han|Noto Sans SC|Droid Sans Fallback/i;

rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT, { recursive: true });
const browser = await launch();
const { page, errors } = await openEngine(browser, '#/watchlist');
const cdp = await page.context().newCDPSession(page);
await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
if (contact) await page.evaluate((c) => { PACKC = { name: c.name || '', phone: c.phone || '', email: c.email || '', meet: c.meet || '' }; }, contact);

const sites = await page.evaluate(() => packSites());
const rows = []; let fails = 0;
for (const sc of ['base', 'g26']) for (const lang of ['en', 'ms', 'zh']) for (const id of sites) {
  await page.evaluate((h) => { location.hash = h; }, `#/pack/${id}/${lang}/${sc}`);
  await page.waitForTimeout(120);
  const ready = await page.evaluate(() => document.querySelector('.pack').dataset.ready === 'true');
  let font = '';
  if (lang === 'zh') {
    const { root } = await cdp.send('DOM.getDocument', { depth: 1 });
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '.pack h2' });
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
    font = fonts.map((f) => f.familyName).join(', ');
    if (!fonts.some((f) => CJK.test(f.familyName))) { fails++; font += '  ← no CJK font: Chinese will not render'; }
  }
  const file = path.join(OUT, `${id}_${sc}_${lang}.pdf`);
  await page.pdf({ path: file, format: 'A4', printBackground: true, preferCSSPageSize: true });
  const pages = (readFileSync(file, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  if (pages > 2) fails++;
  rows.push(`${pages > 2 ? 'FAIL' : '    '} ${path.relative(ROOT, file).padEnd(44)} ${String(pages).padStart(2)} page${pages > 1 ? 's' : ' '}  ${ready ? 'full pack' : 'not ready yet'}${font ? '  font: ' + font : ''}`);
}
await browser.close();
console.log(`\nOwner briefing packs → ${path.relative(ROOT, OUT)}/`);
for (const r of rows) console.log('  ' + r);
for (const e of errors) { fails++; console.log('  page error: ' + e); }
console.log(`  ${fails ? 'FAILED' : 'OK'}: ${rows.length} PDFs${fails ? `, ${fails} problems` : ''}${contact ? '' : '; contact block shows placeholders (use --contact file.json)'}`);
process.exit(fails ? 1 : 0);

// UI sweep: opens every route for every site and fails on broken text (NaN, undefined,
// Infinity, [object …], null), page errors, or horizontal overflow at phone width.
//
//   npm run test:sweep
//   npm run shots        also saves screenshots to screenshots/ for a visual check
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { ROOT, launch, openEngine, report } from './lib.mjs';

const SHOTS = process.argv.includes('--shots');
const BAD = /\bNaN\b|\bundefined\b|Infinity|\[object|RMNaN|\bnull\b/;

const browser = await launch();
const { page, errors } = await openEngine(browser);
const ids = await page.evaluate(() => SITES.map((s) => s.id));
const modelled = await page.evaluate(() => MODELLED);
const owned = await page.evaluate(() => MODELLED.filter((i) => st(i).owner));
const inc = await page.evaluate(() => MODELLED.filter((i) => INC_DEFAULT[i]));
const routes = ['watchlist', 'board', 'incentive', 'map', 'triggers', 'sources', 'universe', 'method', 'calibration',
  ...ids.map((i) => `site/${i}`), ...modelled.map((i) => `lab/${i}`), ...owned.map((i) => `deal/${i}`),
  ...owned.map((i) => `assembly/${i}`), ...inc.map((i) => `incentive/${i}`),
  ...owned.flatMap((i) => ['en/base', 'ms/g26', 'zh/g26'].map((v) => `pack/${i}/${v}`))];

const lines = []; let fails = 0;
for (const r of routes) {
  await page.evaluate((h) => { location.hash = '#/' + h; }, r);
  await page.waitForTimeout(120);
  const t = await page.innerText('main');
  const mt = t.match(BAD);
  if (mt) { fails++; lines.push(`FAIL ${r}: "…${t.slice(Math.max(0, mt.index - 60), mt.index + 40).replace(/\n/g, ' | ')}…"`); }
}
lines.push(`${routes.length} routes rendered`);

await page.setViewportSize({ width: 390, height: 844 });
const PHONE = ['watchlist', 'board', 'incentive/taiping', 'incentive/salak', 'map', 'site/taiping', 'lab/taiping', 'deal/taiping', 'assembly/taiping', 'calibration', 'triggers', 'sources', 'universe', 'method', 'pack/taiping/zh/g26', 'pack/pantai/ms/g26'];
for (const r of PHONE) {
  await page.evaluate((h) => { location.hash = '#/' + h; }, r);
  await page.waitForTimeout(150);
  const [sw, w] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  if (sw > w + 1) { fails++; lines.push(`FAIL ${r}: horizontal overflow at 390 px (${sw} > ${w})`); }
}
lines.push(`phone-width overflow checked on ${PHONE.length} views`);

if (SHOTS) {
  const dir = path.join(ROOT, 'screenshots'); mkdirSync(dir, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const r of ['watchlist', 'board', 'incentive/taiping', 'incentive/salak', 'site/taiping', 'lab/taiping', 'map', 'calibration', 'pack/taiping/en/g26', 'pack/salak/zh/g26']) {
    await page.evaluate((h) => { location.hash = '#/' + h; }, r); await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(dir, r.replaceAll('/', '_') + '.png'), fullPage: true });
  }
  await page.evaluate(() => { document.documentElement.setAttribute('data-theme', 'dark'); location.hash = '#/incentive/taiping'; }); await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(dir, 'incentive_taiping_dark.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => { document.documentElement.removeAttribute('data-theme'); location.hash = '#/board'; }); await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(dir, 'board_phone.png'), fullPage: true });
  lines.push(`screenshots saved to ${dir}`);
}
await browser.close();
const ok = report('UI sweep', lines, fails, errors, routes.length + PHONE.length);
process.exit(ok ? 0 : 1);

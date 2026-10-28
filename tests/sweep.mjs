// UI sweep: opens every route for every site and fails on broken text (NaN, undefined,
// Infinity, [object …], null), page errors, or horizontal overflow at phone width.
//
//   npm run test:sweep
//   npm run shots        also saves screenshots to screenshots/ for a visual check
import { parcelFixture } from './fixtures/parcels.mjs';
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
const routes = [...ids.map(i=>'versions/'+i),...ids.map(i=>'memo/'+i),...ids.map(i=>'diligence/'+i),...modelled.map(i=>'cashflow/'+i),'compare','transactions/taiping','review','land','land/ms-corus','land/param-ampang','land/ms-mira','land/ayer-seed','watchlist', 'board', 'incentive', 'map', 'triggers', 'sources', 'universe', 'method', 'calibration',
  ...ids.map((i) => `site/${i}`), ...modelled.map((i) => `lab/${i}`), ...owned.map((i) => `deal/${i}`),
  ...owned.map((i) => `assembly/${i}`), ...inc.map((i) => `incentive/${i}`),
  ...owned.flatMap((i) => ['en/base', 'ms/g26', 'zh/g26'].map((v) => `pack/${i}/${v}`)), ...owned.map((i) => `odds/${i}`), ...modelled.map((i) => `massing/${i}`)];

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
const PHONE = ['versions/taiping','memo/taiping','diligence/taiping','cashflow/taiping','compare','transactions/taiping','review','land','watchlist', 'board', 'incentive/taiping', 'incentive/salak', 'map', 'site/taiping', 'lab/taiping', 'deal/taiping', 'assembly/taiping', 'calibration', 'triggers', 'sources', 'universe', 'method', 'pack/taiping/zh/g26', 'pack/pantai/ms/g26', 'odds/taiping', 'massing/taiping', 'massing/salak'];
for (const r of PHONE) {
  await page.evaluate((h) => { location.hash = '#/' + h; }, r);
  await page.waitForTimeout(150);
  const [sw, w] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  if (sw > w + 1) { fails++; lines.push(`FAIL ${r}: horizontal overflow at 390 px (${sw} > ${w})`); }
}
lines.push(`phone-width overflow checked on ${PHONE.length} views`);

if (SHOTS) {
  await page.evaluate(()=>{LD={...LD,q:'',buyer:'',status:'',legacy:false,sel:'sime-unirazak'};location.hash='#/land/sime-unirazak'});await page.waitForTimeout(150);
  const dir = path.join(ROOT, 'screenshots'); mkdirSync(dir, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const r of ['review','land','land/ms-corus','land/param-ampang','watchlist', 'board', 'incentive/taiping', 'incentive/salak', 'site/taiping', 'lab/taiping', 'map', 'calibration', 'pack/taiping/en/g26', 'pack/salak/zh/g26', 'odds/taiping', 'massing/taiping', 'massing/salak']) {
    await page.evaluate((h) => { location.hash = '#/' + h; }, r); await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(dir, r.replaceAll('/', '_') + '.png'), fullPage: true });
  }
  await page.evaluate(() => { document.documentElement.setAttribute('data-theme', 'dark'); location.hash = '#/incentive/taiping'; }); await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(dir, 'incentive_taiping_dark.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => { document.documentElement.removeAttribute('data-theme'); location.hash = '#/board'; }); await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(dir, 'board_phone.png'), fullPage: true });
  await page.evaluate(() => { document.documentElement.setAttribute('data-theme','dark'); location.hash='#/massing/taiping'; }); await page.waitForTimeout(250);
  await page.setViewportSize({width:1440,height:1000});
  await page.screenshot({path:path.join(dir,'massing_taiping_dark.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.join(dir,'massing_taiping_phone.png'),fullPage:true});
  await page.evaluate(() => { document.documentElement.setAttribute('data-theme','dark'); location.hash='#/land'; }); await page.waitForTimeout(250);
  await page.setViewportSize({width:1440,height:1000});
  await page.screenshot({path:path.join(dir,'land_dark.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.join(dir,'land_phone.png'),fullPage:true});
  await page.evaluate(()=>{location.hash='#/review'});await page.waitForTimeout(250);
  await page.screenshot({path:path.join(dir,'review_phone.png'),fullPage:true});
  await page.setViewportSize({width:1440,height:1000});
  await page.screenshot({path:path.join(dir,'review_dark.png'),fullPage:true});
  
  // Synthetic fixture only in the ephemeral screenshot browser, never seed evidence.
  await page.evaluate(()=>{
    TX.taiping=[{date:'2024-01-01',scheme:'SYNTHETIC EXAMPLE ONLY',size:1000,price:500000,tenure:'freehold',propertyType:'apartment',basis:'built-up',unit:'sqft',sqft:1000,psf:500,source:'Synthetic screenshot fixture',url:'https://example.com',checked:'2026-01-01',type:'TRANSACTION',conf:'PROVISIONAL'}];
    document.documentElement.removeAttribute('data-theme');location.hash='#/transactions/taiping';
  });await page.waitForTimeout(250);
  await page.screenshot({path:path.join(dir,'transactions.png'),fullPage:true});
  await page.evaluate(()=>document.documentElement.setAttribute('data-theme','dark'));
  await page.screenshot({path:path.join(dir,'transactions_dark.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.join(dir,'transactions_phone.png'),fullPage:true});
  
  await page.setViewportSize({width:1440,height:1000});
  await page.evaluate(()=>{document.documentElement.removeAttribute('data-theme');location.hash='#/compare'});await page.waitForTimeout(250);
  await page.screenshot({path:path.join(dir,'compare.png'),fullPage:true});
  await page.evaluate(()=>document.documentElement.setAttribute('data-theme','dark'));
  await page.screenshot({path:path.join(dir,'compare_dark.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.join(dir,'compare_phone.png'),fullPage:true});

  await page.setViewportSize({width:1440,height:1000});
  await page.evaluate(()=>{document.documentElement.removeAttribute('data-theme');location.hash='#/cashflow/taiping'});await page.waitForTimeout(250);
  await page.screenshot({path:path.join(dir,'cashflow.png'),fullPage:true});
  await page.evaluate(()=>document.documentElement.setAttribute('data-theme','dark'));
  await page.screenshot({path:path.join(dir,'cashflow_dark.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.join(dir,'cashflow_phone.png'),fullPage:true});

  await page.setViewportSize({width:1440,height:1000});
  await page.evaluate(()=>{
    DD.salak={boundary:ddAppend(null,{...ddEmpty(),status:'working',role:'planner',note:'SYNTHETIC SCREENSHOT EXAMPLE ONLY. Awaiting a parcel-specific document.',url:'https://example.com',reference:'Example only'},new Date().toISOString(),reviewToday())};
    document.documentElement.removeAttribute('data-theme');location.hash='#/diligence/salak';
  });await page.waitForTimeout(250);
  await page.locator('.dd-history').first().evaluate(e=>e.open=true);
  await page.screenshot({path:path.join(dir,'diligence.png'),fullPage:true});
  await page.evaluate(()=>document.documentElement.setAttribute('data-theme','dark'));
  await page.screenshot({path:path.join(dir,'diligence_dark.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.join(dir,'diligence_phone.png'),fullPage:true});

  await page.setViewportSize({width:1440,height:1000});
  await page.evaluate(()=>{delete TX.taiping;document.documentElement.removeAttribute('data-theme');MEMO.snapshot=null;location.hash='#/memo/salak'});await page.waitForTimeout(250);
  await page.screenshot({path:path.join(dir,'memo.png'),fullPage:true});
  await page.evaluate(()=>document.documentElement.setAttribute('data-theme','dark'));
  await page.screenshot({path:path.join(dir,'memo_dark.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.join(dir,'memo_phone.png'),fullPage:true});

  await page.setViewportSize({width:1440,height:1000});
  await page.evaluate(()=>{
    document.documentElement.removeAttribute('data-theme');
    const a=svCapture('taiping','base','SYNTHETIC EXAMPLE — earlier','hold','Awaiting reviewed parcel and ownership records.');
    const b=svCopy(a);b.id='sv_screenshot_later';b.label='SYNTHETIC EXAMPLE — revised';b.input.asp+=100;b.input.owner.n+=2;b.funding.rate+=1;b.outcome=svOutcome(b.input,b.funding);b.decision='investigate';b.rationale='Illustrative change only; evidence gates remain unresolved.';
    b.evidence[0].v+=' — SYNTHETIC CHANGE ONLY';
    SV=[a,b];SVUI={site:'taiping',left:a.id,right:b.id,basis:'live',label:'',decision:'unreviewed',rationale:'',current:null};location.hash='#/versions/taiping';
  });await page.waitForTimeout(250);
  await page.locator('.sv-detail').first().evaluate(e=>e.open=true);
  await page.screenshot({path:path.join(dir,'versions.png'),fullPage:true});
  await page.evaluate(()=>document.documentElement.setAttribute('data-theme','dark'));
  await page.screenshot({path:path.join(dir,'versions_dark.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.join(dir,'versions_phone.png'),fullPage:true});

  await page.setViewportSize({width:1440,height:1000});
  await page.evaluate(()=>{document.documentElement.setAttribute('data-theme','dark');MAP.sel='taiping';location.hash='#/map'});await page.waitForTimeout(250);
  await page.screenshot({path:path.join(dir,'map_dark.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.join(dir,'map_phone.png'),fullPage:true});
  await page.setViewportSize({width:1440,height:1000});
  await page.evaluate(x=>{PARCELS=URECore.validateParcelRegistry(x,SITES.map(s=>s.id));MAP.boundaries=true;MAP.focus=true;render()},parcelFixture());
  await page.locator('.parcel-record summary').click();
  await page.screenshot({path:path.join(dir,'map_synthetic_focus.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.join(dir,'map_synthetic_phone.png'),fullPage:true});
  lines.push(`screenshots saved to ${dir}`);




}
await browser.close();
const ok = report('UI sweep', lines, fails, errors, routes.length + PHONE.length);
process.exit(ok ? 0 : 1);

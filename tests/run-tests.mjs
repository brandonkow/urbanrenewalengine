// Formula tests: the engine must keep reproducing the workbook, the handoff and the
// DBKL 2026 guideline numbers. Golden values live in tests/expected.json; the checks
// that compare two engine results with each other (relational checks) live below.
//
//   npm run test:numbers            failures only
//   npm run test:numbers -- --verbose   every check
//
// Change tests/expected.json only on purpose, with a note in docs/CHANGELOG.md saying why.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT, launch, openEngine, report } from './lib.mjs';

const expected = JSON.parse(readFileSync(path.join(ROOT, 'tests', 'expected.json'), 'utf8')).checks;
const verbose = process.argv.includes('--verbose');

// Runs inside the page, against the engine's own globals.
function compute() {
  const abs = []; const rel = [];
  const A = (n, v) => abs.push([n, typeof v === 'boolean' ? (v ? 1 : 0) : v]);
  const R = (n, a, b, t) => rel.push([n, a, b, t]);
  GLOB.dc = 0;

  // 1. Workbook RLV Model sheet (normalised to 1 acre)
  for (const id of ['taiping', 'jujur', 'rejang', 'keramat', 'angkasa']) {
    for (const k of ['down', 'base', 'up']) {
      const x = { ...presetState(SITE[id], k), area: 1, owner: null }; const m = calcRLV(x);
      A(`wb ${id} ${k} RLV/ac (m)`, m.rlv / 1e6); A(`wb ${id} ${k} breakeven ASP`, m.be);
    }
  }
  // 2. Handoff Taiping numbers
  const x = presetState(SITE.taiping, 'base'), m = model(x), o = x.owner;
  A('taiping total RLV (m)', m.rlv / 1e6); A('taiping weighted value', m.own.w); A('taiping package', m.own.per);
  A('taiping max interests', m.own.maxN); A('taiping required ASP @40', m.own.reqASP); A('taiping required PR @40', m.own.reqPR);
  A('taiping premium @40', m.own.premium); A('taiping required ASP @60', requiredASP(x, m, 60, o)); A('taiping required PR @60', requiredPR(x, m, 60, o));
  A('taiping required ASP @20', requiredASP(x, m, 20, o)); A('taiping required PR @30', requiredPR(x, m, 30, o));
  A('taiping max interests per acre (workbook)', m.rlvAc / m.own.per); A('taiping area for 40 interests (workbook)', m.own.reqArea);
  A('taiping workbook premium, 1.5 ac / 40', m.rlvAc * 1.5 / (40 * m.own.w) - 1);
  // 3. Development-charge round trips
  for (const d of [0, 0.3, 0.6]) {
    GLOB.dc = d;
    const x2 = { ...presetState(SITE.taiping, 'base') }; const m2 = model(x2);
    const m3 = model({ ...x2, prUp: m2.own.reqPR / x2.pr - 1 }); A(`dc ${d}: required PR gives coverage 1`, m3.own.coverage);
    const x4 = { ...x2, prUp: 0.25 }; const m4 = model(x4); const m5 = model({ ...x4, asp: m4.own.reqASP }); A(`dc ${d}: required ASP gives coverage 1`, m5.own.coverage);
    const hc = requiredHC(x4, m4, m4.own.reqTotal / m4.land); A(`dc ${d}: required hard cost gives coverage 1`, model({ ...x4, hc }).own.coverage);
    R(`dc ${d}: charge equals rate x value of incentive GFA`, model({ ...x4, dc: 0 }).rlv - m4.rlv, d * m4.incGFA * m4.per, 1);
  }
  GLOB.dc = 0;
  // 4. Landed sites
  const ms = model(presetState(SITE.salak, 'base')); A('salak payable lot psf', ms.own.payLpsf); A('salak required ASP', ms.own.reqASP); A('salak coverage', ms.own.coverage);
  const mp = model(presetState(SITE.pantai, 'base')); A('pantai payable lot psf', mp.own.payLpsf); A('pantai required PR', mp.own.reqPR);
  // 5. Deal structures
  const D = dealCalc(x, m, { ...DEAL_DEFAULT, ...DEAL_SITE.taiping });
  A('deal A surplus (m)', D.A.surplus / 1e6); A('deal B surplus (m)', D.B.surplus / 1e6); A('deal C surplus (m)', D.C.surplus / 1e6);
  // 6. Calibration
  const t = calcComp(COMPS[0]); A('tuan straits implied PR', t.pr); A('tuan straits RLV psf land', t.rlv); A('tuan straits land share of GDV', t.share);
  // 7. Every single-lever move, applied alone, gives coverage 1
  let worst = 0, n = 0;
  for (const id of ['taiping', 'salak', 'pantai', 'jinjang_aman']) {
    const L = levers(SITE[id]);
    for (const it of L.items) {
      if (it.floor || !isFinite(it.v)) continue;
      const y = { ...L.x, owner: { ...L.x.owner } };
      if (it.k === 'asp') y.asp = it.target; if (it.k === 'hc') y.hc = it.target; if (it.k === 'pkg') y.owner.up = (1 + y.owner.up) * (1 + it.v) - 1;
      applyOwnerDerived(y); worst = Math.max(worst, Math.abs(model(y).own.coverage - 1)); n++;
    }
  }
  A('levers: worst |coverage - 1|', worst); A('levers: reachable moves checked', n);
  // 8. Export and import round trip
  const before = JSON.parse(JSON.stringify(STATE.taiping || presetState(SITE.taiping, 'base'))).asp;
  const ex = JSON.stringify(exportObj()); st('taiping').asp = 1500; importWorkspace(ex); R('import restores ASP', st('taiping').asp, before, 1e-9);
  A('csv rows (header + 21 sites)', resultsCSV().split('\n').length);
  // 9. DBKL 2026 guideline
  const ex1 = g26Share({ redev: .5, res: .3, open: .1, tpz: .15, elig: .5 }), ex2 = g26Share({ redev: .5, res: .3, open: .1, tpz: .15, elig: 1 });
  A('guideline worked example, 50% eligibility: final PR', 6 * (1 + ex1.share)); A('guideline worked example, 100% eligibility: final PR', 6 * (1 + ex2.share)); A('guideline worked example 2 is capped', ex2.capped);
  const keep = JSON.stringify(INC); INC = {};
  A('incB taiping share as read', incB('taiping').share); A('incB taiping effective PR', incB('taiping').pr);
  A('incB taiping + open space 10%', incB('taiping', { open: .1 }).share); A('incB taiping + open 10% + transit 20% (capped)', incB('taiping', { open: .1, tpz: .2 }).share);
  A('incB capped flag', incB('taiping', { open: .1, tpz: .2 }).capped); A('incB residing ignored in an R3 zone', incB('taiping', { residing: .3 }).share);
  A('incB half eligibility halves components, not transit', incB('taiping', { elig: .5, tpz: .1 }).share); A('incB clamps open space at 10%', incB('taiping', { open: .5 }).open);
  A('incB salak share as read', incB('salak').share); A('lab DBKL 2026 preset PR uplift (taiping)', presetState(SITE.taiping, 'g26').prUp);
  A('incEdited false at the reading', incEdited('taiping')); incP('taiping').open = .05; A('incEdited true after a change', incEdited('taiping')); A('incTag says as set', incTag('taiping') === 'as set'); INC = {};
  const gT = g26Row('taiping', true), zT = modelB('taiping', 0);
  R('taiping Category B coverage = base x 1.5', gT.mb.own.coverage, zT.own.coverage * 1.5, 1e-9);
  A('taiping Category B coverage (PR 6.0)', gT.mb.own.coverage); A('taiping coverage at the 70% cap (PR 6.8)', gT.mc.own.coverage);
  A('incMax taiping reaches the cap', incMax('taiping').share); A('incMax salak tops out at 60% (R3, 30% tier)', incMax('salak').share);
  INC.salak = { ...incDefault('salak'), elig: .5 }; A('incMax salak at 50% eligibility', incMax('salak').share); INC = {};
  R('salak most-reachable coverage = base x 1.6', g26Row('salak').mc.own.coverage, modelB('salak', 0).own.coverage * 1.6, 1e-9);
  A('prBand: beyond this classification', prBand(.65, SITE.salak)[0] === 'Beyond this classification'); A('prBand: beyond the 70% cap', prBand(.75, SITE.salak)[0] === 'Beyond the 70% cap');
  R('salak Category B coverage = base x 1.3', g26Row('salak', true).mb.own.coverage, modelB('salak', 0).own.coverage * 1.3, 1e-9);
  const a4 = catA('taiping', 'IV');
  A('catA taiping IV units', a4.U); A('catA taiping IV controlled units needed', a4.need); A('catA taiping IV MADANI units', a4.M); A('catA taiping IV RMM units', a4.R); A('catA taiping IV free-market units', a4.F);
  A('catA taiping IV equivalent PR', a4.epr); A('catA taiping IV RLV (m)', a4.rlv / 1e6); A('catA taiping IV coverage', a4.cov);
  A('catA taiping III RLV (m)', catA('taiping', 'III').rlv / 1e6); A('catA taiping II RLV (m)', catA('taiping', 'II').rlv / 1e6);
  A('catA taiping IV at 1,200 sf coverage', catA('taiping', 'IV', { unitSf: 1200 }).cov); A('catA taiping best tier is IV', catAAll('taiping').best.k === 'IV');
  const ppu = 1200 * st('taiping').area / 400, q = catA('taiping', 'II', { ppu }), qb = catA('taiping', 'II', { ppu, big: true });
  A('catA split under 10 acres: units', q.U); A('catA split under 10 acres: MADANI share', q.M / q.U); A('catA split under 10 acres: RMM share', q.R / q.U); A('catA split: free-market share', q.F / q.U);
  A('catA split at 10 acres or more: MADANI share', qb.M / qb.U); A('catA split at 10 acres or more: RMM share', qb.R / qb.U);
  GLOB.dc = .3; const aD = catA('taiping', 'IV'); const xT = st('taiping');
  R('catA charge only on the free-market share', aD.dc, .3 * Math.max(0, aD.gfa - xT.area * SF_PER_ACRE * xT.pr) * (aD.F * aD.p.unitSf / aD.nfa) * (xT.asp * xT.eff * (1 - (xT.stat + xT.sm + xT.fin + xT.demo + xT.profit)) - xT.hc * (1 + xT.pf + xT.cont)), 1); GLOB.dc = 0;
  A('transit read: keramat is a possible TPZ', tpzRead(nearestStation(SITE.keramat).km)[0] === 'Possible TPZ');
  A('transit read: pantai is a possible TIZ', tpzRead(nearestStation(SITE.pantai).km)[0] === 'Possible TIZ');
  A('prBand: taiping within the guideline', prBand(levers(SITE.taiping).prUp, SITE.taiping)[0] === 'Within the guideline');
  A('prBand: pantai needs more components', prBand(levers(SITE.pantai).prUp, SITE.pantai)[0] === 'Needs more components');
  A('trigger count', TRIGGERS.length);
  const rT = siteResults().find((r) => r.id === 'taiping'); A('export: taiping dbkl2026 share', rT.dbkl2026.share); A('export: taiping best Category A tier is IV', rT.dbkl2026.catA.tier === 'IV');
  A('csv has the g26MaxCoverage column', resultsCSV().split('\n')[0].split(',').includes('g26MaxCoverage'));
  INC = JSON.parse(keep);
  return { abs, rel };
}

const browser = await launch();
const { page, errors } = await openEngine(browser);
const { abs, rel } = await page.evaluate(compute);
await browser.close();

const lines = []; let fails = 0;
const seen = new Set();
for (const [name, got] of abs) {
  seen.add(name);
  const e = expected[name];
  if (!e) { fails++; lines.push(`FAIL ${name}: no golden value in tests/expected.json (got ${got})`); continue; }
  const [want, tol] = e; const pass = typeof got === 'number' && Math.abs(got - want) <= tol;
  if (!pass) fails++;
  if (!pass || verbose) lines.push(`${pass ? 'PASS' : 'FAIL'} ${name}: got ${typeof got === 'number' ? +got.toFixed(6) : got}, expected ${want} ± ${tol}`);
}
for (const name of Object.keys(expected)) if (!seen.has(name)) { fails++; lines.push(`FAIL ${name}: golden value never checked (renamed or removed?)`); }
for (const [name, a, b, tol] of rel) {
  const pass = Math.abs(a - b) <= tol; if (!pass) fails++;
  if (!pass || verbose) lines.push(`${pass ? 'PASS' : 'FAIL'} ${name}: ${+a.toFixed(6)} vs ${+b.toFixed(6)} (± ${tol})`);
}
const total = abs.length + rel.length;
const ok = report('Formula tests', lines.length ? lines : [`all ${total} checks pass`], fails, errors, total);
process.exit(ok ? 0 : 1);

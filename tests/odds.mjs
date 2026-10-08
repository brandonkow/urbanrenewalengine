// Owner-test odds (Monte Carlo): reproducible with a seed, consistent with the engine at degenerate
// ranges, sensible in direction, and never touching the base case.
//   npm run test:odds
import { launch, openEngine, report } from './lib.mjs';

const browser = await launch();
const { page, errors } = await openEngine(browser, '#/watchlist');
const lines = []; let fails = 0, total = 0;
const chk = (name, cond) => { total++; lines.push(`${cond ? 'PASS' : 'FAIL'} ${name}`); if (!cond) fails++; };
const ev = (fn, a) => page.evaluate(fn, a);

const sites = await ev(() => packSites());
const baseCov = await ev(() => Object.fromEntries(packSites().map((id) => [id, model(st(id)).own.coverage])));

// 1. Same seed, same answer; another seed lands close by.
const a = await ev(() => packSites().map((id) => { const r = mcRun(id); return [r.p, r.q10, r.q50, r.q90]; }));
const b = await ev(() => packSites().map((id) => { const r = mcRun(id); return [r.p, r.q10, r.q50, r.q90]; }));
chk('same seed gives identical results for every site', JSON.stringify(a) === JSON.stringify(b));
const c = await ev(() => { const cfg = mcCfg({ seed: 7 }); return packSites().map((id) => mcRun(id, cfg).p); });
chk(`another seed stays within 5 points (${a.map((x) => x[0].toFixed(3))} vs ${c.map((x) => x.toFixed(3))})`, a.every((x, i) => Math.abs(x[0] - c[i]) <= 0.05));

// 2. Collapse every range to the base case: the answer must be the engine's own coverage test.
const flat = await ev(() => {
  const site = {}; for (const id of packSites()) { const o = SITE[id].owner, v = SITE[id].rlv.asp[1]; site[id] = { asp: [v, v, v], n: [o.n, o.n, o.n], lpsf: [o.lpsf, o.lpsf, o.lpsf] }; }
  const one = (k) => mcCfg({ seed: 3, n: 200, dc: [0, 0, 0], hc: [1, 1, 1], out: { read: k === 'read' ? 1 : 0, half: 0, none: k === 'none' ? 1 : 0, dbl: 0 }, site });
  return packSites().map((id) => ({ id, read: mcRun(id, one('read')).p, none: mcRun(id, one('none')).p, g26: modelB(id, incB(id).share, 0).own.coverage, base: model(presetState(SITE[id], 'base')).own.coverage }));
});
for (const f of flat) {
  chk(`${f.id}: flat ranges, DBKL as set → ${f.read} matches coverage ${f.g26.toFixed(3)}`, f.read === (f.g26 >= 1 ? 1 : 0));
  chk(`${f.id}: flat ranges, no incentive → ${f.none} matches base coverage ${f.base.toFixed(3)}`, f.none === (f.base >= 1 ? 1 : 0));
}

// 3. Tornado centre equals the engine at the middle values; rows sorted by swing.
const tor = await ev(() => packSites().map((id) => { const cfg = mcCfg(), R = cfg.site[id], t = mcTornado(id, cfg);
  const x = presetState(SITE[id], 'base'); x.asp = R.asp[1]; x.hc *= cfg.hc[1]; x.dc = cfg.dc[1]; x.prUp = incB(id).share;
  if (x.owner.mode === 'landed') x.owner.lpsf = R.own[1]; else x.owner.n = Math.round(R.own[1]); applyOwnerDerived(x);
  return { id, centre: t.centre, eng: model(x).own.coverage, sorted: t.rows.every((r, i) => i === 0 || t.rows[i - 1].swing >= r.swing), n: t.rows.length }; }));
for (const t of tor) {
  chk(`${t.id}: tornado centre ${t.centre.toFixed(4)} equals the engine ${t.eng.toFixed(4)}`, Math.abs(t.centre - t.eng) < 1e-9);
  chk(`${t.id}: tornado has five inputs sorted by swing`, t.sorted && t.n === 5);
}

// 4. Direction: a likelier DBKL grant raises the odds; a higher price range raises them; more owners lower them.
const dir = await ev(() => {
  const lo = mcCfg({ out: { read: 0.1, half: 0.1, none: 0.7, dbl: 0.1 } }), hi = mcCfg({ out: { read: 0.8, half: 0.1, none: 0.05, dbl: 0.05 } });
  const up = mcCfg({ site: { salak: { asp: [650, 720, 800] } } }), many = mcCfg({ site: { taiping: { n: [60, 70, 90] } } });
  return { lo: mcRun('taiping', lo).p, hi: mcRun('taiping', hi).p, base: mcRun('salak').p, up: mcRun('salak', up).p, tBase: mcRun('taiping').p, many: mcRun('taiping', many).p };
});
chk(`likelier DBKL grant raises Taiping's odds (${dir.lo.toFixed(3)} → ${dir.hi.toFixed(3)})`, dir.hi > dir.lo);
chk(`higher end prices raise Salak's odds (${dir.base.toFixed(3)} → ${dir.up.toFixed(3)})`, dir.up > dir.base);
chk(`more owners lower Taiping's odds (${dir.tBase.toFixed(3)} → ${dir.many.toFixed(3)})`, dir.many < dir.tBase);

// 5. Conditional odds add back up to the total; probabilities stay in [0, 1].
const cons = await ev(() => packSites().map((id) => { const r = mcRun(id); let s = 0; for (const k in r.byOut) if (r.byOut[k].n) s += r.byOut[k].p * r.byOut[k].n; return { id, p: r.p, s: s / r.N, n: Object.values(r.byOut).reduce((x, y) => x + y.n, 0), N: r.N }; }));
for (const q of cons) chk(`${q.id}: odds by DBKL decision add up to the total (${q.p.toFixed(4)})`, Math.abs(q.p - q.s) < 1e-12 && q.n === q.N && q.p >= 0 && q.p <= 1);
const jin = await ev(() => mcRun('jinjang_aman').p);
chk('Jinjang Aman: negative residual never clears', jin === 0);

// 6. The base case is untouched.
const after = await ev(() => Object.fromEntries(packSites().map((id) => [id, model(st(id)).own.coverage])));
chk('running the simulation leaves every base-case coverage unchanged', sites.every((id) => after[id] === baseCov[id]));
chk(`Taiping base coverage still 70.5% (${(after.taiping * 100).toFixed(2)}%)`, Math.abs(after.taiping - 0.705) < 5e-4);

// 7. The page: renders, edits ranges, resets, and persists in the workspace.
await ev(() => { location.hash = '#/odds/salak'; }); await page.waitForTimeout(250);
const t1 = await page.innerText('main');
chk('page renders without broken text', !/\bNaN\b|\bundefined\b|Infinity|\[object/.test(t1));
chk('page names the selected site', t1.includes('Kampung Baru Salak Selatan') && /chance of clearing/i.test(t1));
const p0 = await ev(() => mcRun('salak').p);
await page.fill('[data-mc="site.salak.asp.2"]', '800'); await page.dispatchEvent('[data-mc="site.salak.asp.2"]', 'change'); await page.waitForTimeout(250);
const p1 = await ev(() => mcRun('salak').p);
chk(`editing a range re-runs the odds (${p0.toFixed(3)} → ${p1.toFixed(3)})`, p1 > p0);
chk('ranges saved in the workspace', await ev(() => !!(workspaceBody().mc && workspaceBody().mc.site && workspaceBody().mc.site.salak)));
const exported = await ev(() => JSON.stringify(exportObj()));
await page.click('#mcReset'); await page.waitForTimeout(200);
chk('reset restores the default odds', Math.abs((await ev(() => mcRun('salak').p)) - p0) < 1e-12);
await ev((t) => importWorkspace(t), exported); await page.waitForTimeout(200);
chk('import restores the ranges', Math.abs((await ev(() => mcRun('salak').p)) - p1) < 1e-12);
await ev(() => { MC = {}; store.set('mc', MC); });
await page.selectOption('#mcSel', 'pantai'); await page.waitForTimeout(200);
chk('site picker changes the route', (await ev(() => location.hash)) === '#/odds/pantai');

await browser.close();
const ok = report('Owner-test odds', fails ? lines.filter((l) => l.startsWith('FAIL')) : [`${total} checks across ${sites.length} sites`], fails, errors, total);
process.exit(ok ? 0 : 1);

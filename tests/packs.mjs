// Owner briefing packs: every figure in every pack must equal the engine's own value, no language may
// show broken text, and owners must never see payment figures the project cannot fund.
//   npm run test:packs
import { launch, openEngine, report } from './lib.mjs';

const browser = await launch();
const { page, errors } = await openEngine(browser, '#/watchlist');
const lines = []; let fails = 0, total = 0;
const chk = (name, cond) => { total++; if (!cond) { fails++; lines.push('FAIL ' + name); } };
const BAD = /\bNaN\b|\bundefined\b|Infinity|\[object|\bnull\b/;
const PROV = ['OFFICIAL_PLANNING', 'TRANSACTION', 'ASKING_LISTING', 'PUBLIC_MAP', 'INFERRED', 'UNDERWRITING_ASSUMPTION', 'MODEL_OUTPUT'];

// Expected values, restated from the engine's functions (not from the pack's own helpers).
function expected([id, sc]) {
  const x = presetState(SITE[id], 'base');
  if (sc === 'g26') x.prUp = incB(id, incDefault(id)).share;
  const m = model(x), d = { ...DEAL_DEFAULT, ...(DEAL_SITE[id] || {}) }, D = dealCalc(x, m, d), o = x.owner;
  const e = { years: d.T, basePR: x.pr, share: x.prUp, effPR: m.epr, n: o.n, lot: o.lot, lpsf: o.lpsf, jvShare: D.C.e,
    todayR: o.res, todayC: o.com, homeR: d.oldRes, homeC: d.oldCom, areaR: D.B.aR, areaC: D.B.aC, ratioR: D.B.ratioR, ratioC: D.B.ratioC,
    lev_be: m.be, lev_asp: x.asp, lev_hc: x.hc, lev_prCur: m.epr, lev_pr: m.own.reqPR, lev_aspTo: m.own.reqASP, lev_aspPct: m.own.reqASP / x.asp - 1 };
  for (const K of ['A', 'B', 'C']) for (const R of ['R', 'C']) { e['val' + K + R] = D[K]['per' + R]; e['up' + K + R] = D[K]['up' + R]; }
  for (const R of ['R', 'C']) { e['rentB' + R] = e['rentC' + R] = R === 'R' ? d.resRent : d.comRent; }
  const hcStar = requiredHC(x, m, m.own.reqTotal / m.land); e.lev_hcTo = hcStar; e.lev_hcPct = -(hcStar / x.hc - 1);
  return { e, cov: m.own.coverage, ok: { A: D.A.surplus >= 0, B: D.B.surplus >= 0 && D.B.fits, C: D.C.surplus >= 0 } };
}
const fmt = {
  rm: (v) => 'RM' + Math.round(Math.abs(v)).toLocaleString('en-MY'), pct: (v) => (v * 100).toFixed(0) + '%', pct1: (v) => (v * 100).toFixed(1) + '%',
  spct: (v) => (v >= 0 ? '+' : '−') + Math.abs(v * 100).toFixed(0) + '%', sf: (v) => Math.round(v).toLocaleString('en-MY'),
  int: (v) => Math.round(v).toLocaleString('en-MY'), x2: (v) => v.toFixed(2), yrs: (v) => (Number.isInteger(v) ? String(v) : v.toFixed(1)),
};

const sites = await page.evaluate(() => packSites());
chk('five sites have owner models', sites.length === 5);
const ready = {};
for (const sc of ['base', 'g26']) for (const lang of ['en', 'ms', 'zh']) for (const id of sites) {
  const tag = `${id} ${sc} ${lang}`;
  await page.evaluate((h) => { location.hash = h; }, `#/pack/${id}/${lang}/${sc}`);
  await page.waitForTimeout(60);
  const exp = await page.evaluate(expected, [id, sc]);
  const got = await page.evaluate(() => {
    const p = document.querySelector('.pack');
    return { text: p.innerText, lang: p.getAttribute('lang'), ready: p.dataset.ready === 'true',
      figs: [...p.querySelectorAll('[data-fig]')].map((el) => ({ k: el.dataset.fig, v: +el.dataset.v, f: el.dataset.f, src: el.dataset.src, kind: el.dataset.kind, t: el.textContent })),
      notes: [...p.querySelectorAll('[data-note]')].map((el) => el.dataset.note) };
  });
  const mt = got.text.match(BAD);
  chk(`${tag}: no broken text${mt ? ` ("${got.text.slice(Math.max(0, mt.index - 40), mt.index + 20)}")` : ''}`, !mt);
  chk(`${tag}: ready flag matches coverage ≥ 100% (${(exp.cov * 100).toFixed(1)}%)`, got.ready === exp.cov >= 1);
  ready[`${id} ${sc}`] = got.ready;
  for (const f of got.figs) {
    const want = exp.e[f.k];
    chk(`${tag}: ${f.k} equals the engine (${f.v} vs ${want})`, want !== undefined && Math.abs(f.v - want) <= 1e-6 * Math.max(1, Math.abs(want)));
    chk(`${tag}: ${f.k} prints as ${fmt[f.f] ? fmt[f.f](f.v) : '?'} ("${f.t}")`, !!fmt[f.f] && f.t.includes(fmt[f.f](f.v)));
    chk(`${tag}: ${f.k} carries a provenance type`, PROV.includes(f.src));
    if (f.kind === 'pay') chk(`${tag}: payment figure ${f.k} is labelled a model estimate or evidence, never official`, !/^OFFICIAL/.test(f.src));
  }
  const pay = got.figs.filter((f) => f.kind === 'pay');
  if (!got.ready) {
    chk(`${tag}: no payment figures below 100% coverage`, pay.length === 0);
    chk(`${tag}: "not ready yet" note shown`, got.notes.includes('notready'));
    chk(`${tag}: lists at least one change`, got.figs.some((f) => f.kind === 'lever') || /floors|tingkat|楼层/.test(got.text));
  } else {
    chk(`${tag}: no "not ready" note at full coverage`, !got.notes.includes('notready'));
    for (const K of ['A', 'B', 'C']) {
      const shown = pay.some((f) => f.k.startsWith('val' + K));
      chk(`${tag}: option ${K} figures shown only if the project can fund it (${exp.ok[K]})`, shown === exp.ok[K]);
      if (!exp.ok[K]) chk(`${tag}: option ${K} marked not offered`, got.notes.includes('notoffered-' + K));
    }
    if (sc === 'g26') chk(`${tag}: says the figures depend on DBKL approval`, got.notes.includes('g26'));
  }
  if (lang !== 'en') chk(`${tag}: marked for native-speaker review`, got.notes.includes('review'));
  chk(`${tag}: lang attribute`, got.lang === { en: 'en', ms: 'ms', zh: 'zh-Hans' }[lang]);
  if (lang === 'zh') chk(`${tag}: Chinese text present`, /[一-鿿]/.test(got.text));
  if (lang === 'ms') chk(`${tag}: Malay text present`, /pemilik/.test(got.text));
  chk(`${tag}: keeps the official term Rumah Ganti or explains the gap`, !got.ready || got.text.includes('Rumah Ganti'));
}
// The roadmap's acceptance cases.
chk('DBKL 2026: Taiping full pack', ready['taiping g26']);
chk('DBKL 2026: Salak Selatan full pack', ready['salak g26']);
for (const id of ['pantai', 'jinjang_aman', 'jinjang_selatan']) chk(`DBKL 2026: ${id} not ready`, !ready[`${id} g26`]);
for (const id of sites) chk(`base case: ${id} not ready`, !ready[`${id} base`]);

// Lab edits and guideline settings must not leak into packs.
await page.evaluate(() => { st('taiping').asp = 1500; saveState(); INC.taiping = { ...incDefault('taiping'), open: 0.1 }; store.set('inc', INC); location.hash = '#/pack/taiping/en/g26'; });
await page.waitForTimeout(80);
const iso = await page.evaluate(() => ({ cash: +document.querySelector('[data-fig="valAR"]').dataset.v, pr: +document.querySelector('[data-fig="effPR"]').dataset.v }));
chk(`lab edits do not change the pack (cash ${iso.cash})`, Math.abs(iso.cash - 611000) < 1e-6);
chk(`edited guideline settings do not change the pack (PR ${iso.pr})`, Math.abs(iso.pr - 6) < 1e-9);
await page.evaluate(() => { delete STATE.taiping; saveState(); INC = {}; store.set('inc', INC); });

// Contact block: placeholders by default, the user's own details once entered, and no owner fields anywhere.
await page.evaluate(() => { location.hash = '#/pack/salak/en/g26'; });
await page.waitForTimeout(80);
chk('contact placeholders by default', (await page.innerText('.pk-contactbox')).includes('[Phone]'));
await page.click('#packContact summary');
await page.fill('[data-pc="phone"]', '03-0000 0000'); await page.dispatchEvent('[data-pc="phone"]', 'change'); await page.waitForTimeout(80);
chk('contact details print once entered', (await page.innerText('.pk-contactbox')).includes('03-0000 0000'));
await page.evaluate(() => { PACKC = {}; store.set('packc', PACKC); });
const inputs = await page.evaluate(() => [...document.querySelectorAll('main input')].map((i) => i.dataset.pc));
chk('only the user’s own contact fields are editable', inputs.every((k) => ['name', 'phone', 'email', 'meet'].includes(k)));

// Switches and navigation.
await page.click('[data-pl="zh"]'); await page.waitForTimeout(80);
chk('language switch changes the route', (await page.evaluate(() => location.hash)) === '#/pack/salak/zh/g26');
await page.click('[data-ps="base"]'); await page.waitForTimeout(80);
chk('scenario switch changes the route', (await page.evaluate(() => location.hash)) === '#/pack/salak/zh/base');
await page.click('#nav button[data-p="watchlist"]'); await page.waitForTimeout(60);
await page.click('#nav button[data-p="pack"]'); await page.waitForTimeout(80);
chk('navigation remembers the last pack', (await page.evaluate(() => location.hash)) === '#/pack/salak/zh/base');
await page.evaluate(() => { store.set('plang', 'en'); store.set('psc', 'base'); PLANG = 'en'; PSC = 'base'; });

await browser.close();
lines.unshift(`${sites.length} sites × 3 languages × 2 scenarios checked`);
const ok = report('Owner briefing packs', fails ? lines : [lines[0]], fails, errors, total);
process.exit(ok ? 0 : 1);


// Build 5.4: data parity, independently worked arithmetic, provenance and UI behaviour.
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {ROOT,launch,openEngine,report} from './lib.mjs';
const browser=await launch();
const {page,errors}=await openEngine(browser,'#/land');
const lines=[];let fails=0;
const chk=(n,c)=>{if(!c)fails++;lines.push((c?'PASS ':'FAIL ')+n)};
// Minimal RFC4180 reader supports quoted commas, escaped quotes and CRLF.
function csvRead(text){
 const rows=[];let row=[],v='',quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i];
  if(c==='"'){if(quoted&&text[i+1]==='"'){v+='"';i++}else quoted=!quoted}
  else if(c===','&&!quoted){row.push(v);v=''}
  else if(c==='\n'&&!quoted){row.push(v.replace(/\r$/,''));rows.push(row);row=[];v=''}
  else v+=c;
 }
 if(v||row.length){row.push(v);rows.push(row)}
 if(quoted)throw new Error('Unclosed CSV quote');
 const keys=rows.shift(),nums=['acres','price_rm','land_psf','gdv_rm','land_share_of_gdv'];
 return {keys,rows:rows.filter(r=>r.length>1).map(r=>{if(r.length!==keys.length)throw new Error('CSV column count');return Object.fromEntries(keys.map((k,i)=>[k,nums.includes(k)?r[i]===''?null:Number(r[i]):r[i]]))})};
}
const csv=csvRead(readFileSync(path.join(ROOT,'data/land-deals.csv'),'utf8'));
const meta=JSON.parse(readFileSync(path.join(ROOT,'data/land-deals-meta.json'),'utf8'));
const embedded=await page.evaluate(()=>({rows:LAND_DEAL_DATA,meta:LAND_DEAL_META}));
chk('CSV header preserves seed schema',csv.keys.join(',')===readFileSync(path.join(ROOT,'data/land-deals-seed.csv'),'utf8').split(/\r?\n/)[0]);
chk('embedded data equals canonical CSV',JSON.stringify(csv.rows)===JSON.stringify(embedded.rows));
chk('embedded metadata equals canonical JSON',JSON.stringify(meta)===JSON.stringify(embedded.meta));
const results=await page.evaluate(()=>{
 const out=[],ck=(n,c)=>out.push([n,!!c]),near=(a,b,t=1e-6)=>Math.abs(a-b)<t;
 const before=JSON.stringify({STATE,CAL,GLOB,INC});
 ck('15 scoped sourced deals',LAND_DEALS.filter(ldEligible).length>=15);
 ck('unique deal IDs',new Set(LAND_DEALS.map(d=>d.id)).size===LAND_DEALS.length);
 for(const d of LAND_DEALS){
  ck(d.id+' safe public source',/^https:\/\//.test(d.url)&&!!SRC[d.source_type]);
  ck(d.id+' provenance and notes',d.checked==='2026-10-13'&&['LOW','MEDIUM','HIGH'].includes(d.confidence)&&d.notes.length>20&&!!d.status&&!!d.dateBasis);
  ck(d.id+' psf recomputes',near(d.land_psf,d.price_rm/(d.acres*43560),.0001));
  ck(d.id+' GDV share is valid',d.land_share_of_gdv===null||near(d.land_share_of_gdv,d.price_rm/d.gdv_rm,.000001));
  ck(d.id+' evidence register',EVIDENCE.some(e=>e.url===d.url&&e.chk===d.checked));
 }
 const seed=LAND_DEALS.find(d=>d.id==='sdb-penaga');
 ck('hectares converted once',near(seed.acres,12140/4046.8564224));
 ck('partial GDV ratio withheld',LAND_DEALS.find(d=>d.id==='ms-legasi').land_share_of_gdv===null);
 ck('lower-bound GDV flagged',LAND_DEALS.find(d=>d.id==='param-brunsfield').gdvLowerBound);
 ck('legacy rows excluded from buyer summaries',!landDealStats(LAND_DEALS).some(b=>['AYER Holdings','Malton'].includes(b.buyer)));
 ck('Mah Sing six deals total RM831m',landDealStats(LAND_DEALS).some(b=>b.buyer==='Mah Sing'&&b.count===6&&b.total===831e6));
 ck('median handles even and odd',ldMedian([9,1,4,2])===3&&ldMedian([9,1,4])===4&&ldMedian([])===null);
 const oldCal=JSON.stringify(CAL);
 // 1 acre, RM4,356,000 land => RM100/sf. At ASP1000, eff0.8,
 // 20% profit + original stat/sm/fin/demo = 0.33, so residual per GFA
 // = 1000*0.8*0.67 - 200*1.13 = 310; PR = 100/310.
 const saved={...CAL,asp:{...CAL.asp}};CAL={hc:200,eff:.8,share:.11,asp:{}};
 const d={...LAND_DEALS[0],id:'hand',acres:1,price_rm:4356000};
 const fees=FIXED.pf+FIXED.cont,gdvCosts=FIXED.stat+FIXED.sm+FIXED.fin+FIXED.demo+.2;
 ck('fixed fee and GDV stack known',near(fees,.13)&&near(gdvCosts,.33));
 ck('implied PR hand arithmetic',near(ldImplied(d,1000),100/310));
 ck('no positive residual has no PR',ldImplied(d,100)===null);
 ck('township PR withheld',ldImplied({...d,product:'township'},1000)===null);
 CAL=saved;ck('PR test restores calibration',JSON.stringify(CAL)===oldCal);
 // Same area (40), identical RM100m ticket (30), high-rise product (30) =100.
 const example={...LAND_DEALS[0],id:'fixture',buyer:'Buyer A',pin:[3.1,101.7],price_rm:100e6};
 const site={lat:3.1,lon:101.7};
 ck('buyer score hand arithmetic',near(landBuyerFit(site,[example],100e6)[0].score,100));
 ck('half-sized ticket earns 15 of30',near(landBuyerFit(site,[example],50e6)[0].score,85));
 ck('unknown ticket omitted not fabricated',near(landBuyerFit(site,[example],null)[0].score,100)&&!landBuyerFit(site,[example],null)[0].hasTicket);
 ck('zero coordinates distance is zero',ldDistance(3.1,101.7,[3.1,101.7])===0);
 for(const s of SITES){
  const fits=landBuyerFit(s,LAND_DEALS,ldSiteTicket(s));
  ck(s.id+' three distinct sourced candidates',fits.length===3&&new Set(fits.map(b=>b.buyer)).size===3&&fits.every(b=>ldEligible(b.deal)&&b.score>=0&&b.score<=100));
  if(!s.area)ck(s.id+' no invented site ticket',ldSiteTicket(s)===null);
 }
 const sub=landDealBand(LAND_DEALS,'suburban'),prime=landDealBand(LAND_DEALS,'prime');
 ck('suburban proposed sample independently expected',sub.deals.length===5&&near(sub.lo,44/427,.000001)&&near(sub.hi,113/660,.000001));
 ck('prime sample is transparently one deal',prime.deals.length===1);
 ck('assets and partial GDV excluded from proposed bands',[...sub.deals,...prime.deals].every(d=>!d.asset&&!d.partialGDV&&!d.gdvLowerBound));
 const sorted=landDealFiltered(LAND_DEALS,{q:'',buyer:'',legacy:true,sort:'date',dir:-1});
 ck('unknown dates sorted last',sorted.slice(-2).every(d=>!d.date));
 ck('text filters combine with buyer',landDealFiltered(LAND_DEALS,{q:'SETAPAK',buyer:'Mah Sing',legacy:false,sort:'date',dir:-1}).length===1);
 ck('all calculations leave base state untouched',JSON.stringify({STATE,CAL,GLOB,INC})===before);
 return out;
});
results.forEach(([n,c])=>chk(n,c));
const before=await page.evaluate(()=>JSON.stringify({STATE,CAL,GLOB,INC}));
await page.fill('#ld-search','SETAPAK');
await page.locator('#ld-filter button[type=submit]').click();
chk('search renders one matching row',await page.locator('[data-deal]').count()===1);
await page.fill('#ld-search','no matching place 123');
await page.locator('#ld-filter button[type=submit]').click();
chk('empty results explain recovery',(await page.innerText('main')).includes('No matching deals'));
await page.click('#ld-reset');
chk('reset restores scoped sample',await page.locator('[data-deal]').count()===15);
await page.click('[data-ldsort="price_rm"]');
chk('ascending numeric sort starts RM32m',await page.locator('[data-deal]').first().getAttribute('data-deal')==='ms-aria');
await page.selectOption('#ld-buyer','OSK Holdings');
await page.locator('#ld-filter button[type=submit]').click();
chk('buyer filter returns two deals',await page.locator('[data-deal]').count()===2);
await page.evaluate(()=>location.hash='#/land/ms-mira');await page.waitForTimeout(120);
chk('deep link clears incompatible filter',(await page.innerText('#ld-detail')).includes('M Mira'));
await page.fill('#ld-asp','100');
await page.locator('#ld-filter button[type=submit]').click();
chk('loss-making ASP renders no PR',(await page.innerText('#ld-detail')).includes('Not available'));
await page.click('#ld-reset');await page.waitForTimeout(120);
await page.check('#ld-legacy');await page.locator('#ld-filter button[type=submit]').click();
chk('legacy toggle retains two audit rows',await page.locator('[data-deal]').count()===17);
await page.click('#ld-reset');await page.waitForTimeout(120);
await page.locator('[data-ldpin="ms-aspira"]').focus();await page.keyboard.press('Enter');await page.waitForTimeout(120);
chk('map pins support keyboard selection',(await page.innerText('#ld-detail')).includes('M Aspira'));
await page.selectOption('#ld-site','rejang');
chk('site selector updates buyer explanation',(await page.innerText('.ld-fit')).includes('Sri Rampai'));
chk('UI actions never apply calibration or change base',await page.evaluate(()=>JSON.stringify({STATE,CAL,GLOB,INC}))===before);
await browser.close();
process.exit(report('Land deals',lines,fails,errors,lines.length)?0:1);

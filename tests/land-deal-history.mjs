// Build 5.5: event ledger parity, status chronology and filtering/isolation.
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {ROOT,launch,openEngine,report} from './lib.mjs';
const browser=await launch();
const {page,errors}=await openEngine(browser,'#/land/sime-unirazak');
const lines=[];let fails=0;
const ck=(n,c)=>{if(!c)fails++;lines.push((c?'PASS ':'FAIL ')+n)};
const ledger=JSON.parse(readFileSync(path.join(ROOT,'data/land-deal-events.json'),'utf8'));
ck('embedded event ledger matches canonical file',JSON.stringify(ledger)===await page.evaluate(()=>JSON.stringify(LAND_DEAL_EVENTS)));
const results=await page.evaluate(()=>{
 const out=[],ck=(n,c)=>out.push([n,!!c]),before=JSON.stringify({STATE,CAL,GLOB,INC,LAND_DEALS});
 const ids=new Set(LAND_DEALS.map(d=>d.id));
 ck('20 uniquely identified events',LAND_DEAL_EVENTS.length===20&&new Set(LAND_DEAL_EVENTS.map(e=>e.id)).size===20);
 const validDate=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
 for(const e of LAND_DEAL_EVENTS){
  ck(e.id+' valid deal and state',ids.has(e.dealId)&&Object.hasOwn(LAND_STATUS_LABELS,e.state));
  ck(e.id+' safe source and provenance',/^https:\/\//.test(e.url)&&!!SRC[e.sourceType]&&['LOW','MEDIUM','HIGH'].includes(e.confidence));
  ck(e.id+' date and check basis',validDate(e.checked)&&e.checked<='2026-10-23'&&(!e.date||validDate(e.date)&&e.date<=e.checked)&&e.dateBasis.length>5);
  if(e.kind==='notice')ck(e.id+' traceable filing mirror',!!e.reference&&e.originalUrl.startsWith('https://www.bursamalaysia.com/')&&e.note.includes('403')&&EVIDENCE.some(x=>x.url===e.url&&x.chk===e.checked));
 }
 ck('all17 baselines retain original check date',LAND_DEAL_EVENTS.filter(e=>e.kind==='baseline').length===17&&LAND_DEAL_EVENTS.filter(e=>e.kind==='baseline').every(e=>e.checked==='2026-10-13'));
 ck('two completion reports, not all announcements',LAND_DEALS.filter(d=>ldStatus(d)==='completed').map(d=>d.id).sort().join(',')==='ms-corus,param-ampang');
 const sime=LAND_DEALS.find(d=>d.id==='sime-unirazak'),corus=LAND_DEALS.find(d=>d.id==='ms-corus'),param=LAND_DEALS.find(d=>d.id==='param-ampang');
 ck('offer advances to signed, never assumed completed',ldStatus(sime)==='signed'&&ldCurrent(sime).date==='2026-08-19');
 ck('Corus report date is not fabricated completion day',ldCurrent(corus).dateBasis.includes('exact completion day not stated'));
 ck('Paramount completion day explicit',ldCurrent(param).date==='2026-06-16'&&ldCurrent(param).dateBasis.includes('explicitly'));
 ck('only sourced parcel reference added',ldCurrent(param).parcelReference.includes('Lot 20009')&&ldCurrent(param).parcelReference.includes('not verified'));
 ck('completion consideration uses unchanged rounded records',LAND_DEALS.filter(d=>ldStatus(d)==='completed').reduce((n,d)=>n+d.price_rm,0)===518e6);
 const fixture={id:'fixture'},ev=[
 {id:'c',dealId:'fixture',date:'2026-02-01',kind:'notice',state:'completed',checked:'2026-03-01'},
 {id:'a',dealId:'fixture',date:'2025-01-01',kind:'baseline',state:'announced',checked:'2026-10-23'},
 {id:'z',dealId:'another',date:'2026-12-01',kind:'notice',state:'terminated'},
 {id:'b',dealId:'fixture',date:'2026-02-01',kind:'baseline',state:'announced'}
 ];
 const raw=JSON.stringify(ev);
 ck('chronology ignores array order and newer check date',ldStatus(fixture,ev)==='completed');
 ck('timeline does not mutate input',JSON.stringify(ev)===raw);
 ck('missing history stays unverified',ldStatus({id:'missing'},ev)==='unverified'&&ldCurrent({id:'missing'},ev)===null);
 ck('older baseline cannot overrule same-day notice',ldCurrent(fixture,ev).id==='c');
 // Simulate a later termination of one existing comparable, then remove the fixture.
 const aurora=LAND_DEALS.find(d=>d.id==='ms-aurora');
 LAND_DEAL_EVENTS.push({id:'termination-fixture',dealId:aurora.id,date:'2026-10-23',kind:'notice',state:'terminated'});
 try{
  ck('termination stays visible in historical table',landDealFiltered([aurora],{q:'',buyer:'',status:'terminated',legacy:false,sort:'date',dir:-1}).length===1);
  ck('termination excluded from buyer totals',landDealStats([aurora]).length===0);
  ck('termination excluded from buyer matches',landBuyerFit(SITE.taiping,[aurora],null).length===0);
  ck('termination excluded from proposed bands',landDealBand([aurora],'suburban').deals.length===0);
  ck('termination has no implied PR',ldImplied(aurora,750)===null);
  ck('termination excluded from locality pins',!landDealMap([aurora],aurora.id).includes('data-ldpin='));
 }finally{LAND_DEAL_EVENTS.pop()}
 ck('all checks preserve financial and acquisition data',JSON.stringify({STATE,CAL,GLOB,INC,LAND_DEALS})===before);
 return out;
});
results.forEach(([n,c])=>ck(n,c));
const before=await page.evaluate(()=>JSON.stringify({STATE,CAL,GLOB,INC,LAND_DEALS,LAND_DEAL_EVENTS}));
ck('signed timeline rendered',(await page.innerText('.ld-history')).includes('GA1-19082026-00039'));
await page.selectOption('#ld-status','completed');await page.locator('#ld-filter button[type=submit]').click();
ck('completion filter shows exactly two records',await page.locator('[data-deal]').count()===2);
ck('completion summary uses RM518m',(await page.innerText('.ld-completion')).includes('RM518.00m'));
await page.selectOption('#ld-buyer','Mah Sing');await page.locator('#ld-filter button[type=submit]').click();
ck('buyer and stage filters combine',await page.locator('[data-deal]').count()===1&&(await page.locator('[data-deal]').getAttribute('data-deal'))==='ms-corus');
ck('Corus history displays report date boundary',(await page.innerText('.ld-history')).includes('exact completion day not stated'));
await page.selectOption('#ld-status','terminated');await page.locator('#ld-filter button[type=submit]').click();
ck('empty termination filter does not invent a deal',(await page.innerText('main')).includes('No matching deals'));
await page.evaluate(()=>location.hash='#/land/param-ampang');await page.waitForTimeout(150);
ck('deep link clears incompatible filters',await page.inputValue('#ld-status')===''&&await page.inputValue('#ld-buyer')==='');
ck('completion and parcel reference visible',(await page.innerText('.ld-history')).includes('Lot 20009')&&(await page.innerText('.ld-history')).includes('2026-06-16'));
await page.click('#ld-reset');await page.waitForTimeout(150);
ck('reset returns15 scoped rows and all stages',await page.locator('[data-deal]').count()===15&&await page.inputValue('#ld-status')==='');
await page.selectOption('#ld-status','unverified');await page.check('#ld-legacy');await page.locator('#ld-filter button[type=submit]').click();
ck('legacy records retain unverified status',await page.locator('[data-deal]').count()===2);
await page.setViewportSize({width:390,height:844});
await page.evaluate(()=>location.hash='#/land/sime-unirazak');await page.waitForTimeout(150);
ck('history fits phone width',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
ck('status UI never changes inputs or ledger',await page.evaluate(()=>JSON.stringify({STATE,CAL,GLOB,INC,LAND_DEALS,LAND_DEAL_EVENTS}))===before);
await browser.close();
process.exit(report('Land deal history',lines,fails,errors,lines.length)?0:1);

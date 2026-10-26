
import {launch,openEngine,report} from './lib.mjs';
const browser=await launch(),{page,errors}=await openEngine(browser,'#/compare');
const lines=[];let fails=0;const ck=(n,c)=>{if(!c)fails++;lines.push((c?'PASS ':'FAIL ')+n)};
const out=await page.evaluate(()=>{
 const out=[],ck=(n,c)=>out.push([n,!!c]);MODELLED.forEach(st);
 const before=JSON.stringify({STATE,INC,CAL,GLOB,EVIDENCE,TX});
 for(const basis of ['base','g26','live']){
  CMP.basis=basis;
  for(const s of SITES){
   const x=comparisonInput(s.id,basis),r=comparisonResult(s,x,EVIDENCE.filter(e=>e.site===s.id),txRows(s.id),LAND_DEALS);
   ck(s.id+' / '+basis+' missing models honest',!!x||r.coverage===null&&r.m===null);
   if(x){
    const direct=model(x);
    ck(s.id+' / '+basis+' residual and coverage exact',r.m.rlv===direct.rlv&&r.coverage===(direct.own?.coverage??null));
    ck(s.id+' / '+basis+' normalized residual',Math.abs(r.m.rlvAc*x.area-r.m.rlv)<1e-6);
    if(direct.own)ck(s.id+' / '+basis+' gap and surplus',Math.abs(r.gap-Math.max(0,direct.own.reqTotal-direct.rlv))<1e-6&&Math.abs(r.surplus-(direct.rlv-direct.own.reqTotal))<1e-6);
   }
   if(!s.area)ck(s.id+' no invented total buyer ticket',r.ticket===null);
  }
 }
 ck('comparison preserves financial/evidence state',JSON.stringify({STATE,INC,CAL,GLOB,EVIDENCE,TX})===before);
 const b=comparisonInput('taiping','base'),g=comparisonInput('taiping','g26');
 ck('base PR4 vs as-read PR6',b.pr*(1+b.prUp)===4&&g.pr*(1+g.prUp)===6);
 // Independent compact arithmetic: one acre, PR1, 50% saleable, RM1000/sf, RM100/GFA;
 // no other costs: revenue21.78m, cost4.356m, residual17.424m; 10 interests ×1m =10m.
 const x={area:1,pr:1,prUp:0,eff:.5,asp:1000,hc:100,pf:0,cont:0,stat:0,sm:0,fin:0,demo:0,profit:0,dc:0,owner:{res:1000000,com:0,cs:0,up:0,n:10,hold:0}};
 const r=comparisonResult(SITE.taiping,x,[],[],[]);
 ck('independent residual17.424m',Math.abs(r.m.rlv-17424000)<1e-6);
 ck('independent coverage1.7424',Math.abs(r.coverage-1.7424)<1e-9);
 ck('independent surplus7.424m and zero gap',r.surplus===7424000&&r.gap===0);
 CMP={ids:['taiping','salak','pantai'],basis:'base'};render();return out;
});out.forEach(([n,c])=>ck(n,c));
ck('three selected columns',await page.locator('#cmp-results thead th').count()===4);
await page.selectOption('[data-cmp="1"]','taiping');await page.click('#cmp-form button');
ck('duplicate site rejected',(await page.innerText('#cmp-error')).includes('different'));
await page.selectOption('[data-cmp="1"]','salak');await page.selectOption('[data-cmp="3"]','jujur');await page.selectOption('#cmp-basis','g26');await page.click('#cmp-form button');
ck('four-site guideline comparison',await page.locator('#cmp-results thead th').count()===5&&(await page.innerText('main')).includes('Discretionary approval'));
await page.selectOption('[data-cmp="2"]','');await page.selectOption('[data-cmp="3"]','');await page.click('#cmp-form button');
ck('two-site minimum supported',await page.locator('#cmp-results thead th').count()===3);
await page.selectOption('[data-cmp="1"]','');await page.click('#cmp-form button');
ck('one site rejected',(await page.innerText('#cmp-error')).includes('two to four'));
await page.setViewportSize({width:390,height:844});ck('comparison fits phone',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
ck('wide table scrolls within labelled region',await page.locator('[aria-label="Site comparison"]').evaluate(e=>e.scrollWidth>e.clientWidth));
await page.evaluate(()=>document.documentElement.setAttribute('data-theme','dark'));ck('dark controls have themed background',await page.locator('#cmp-basis').evaluate(e=>getComputedStyle(e).backgroundColor!=='rgb(255, 255, 255)'));
await page.evaluate(()=>{window.__export=null;saveText=(name,text,mime)=>{window.__export={name,data:JSON.parse(text),mime}}});await page.click('#cmp-export');
ck('export captures selected scenario and evidence gaps',await page.evaluate(()=>__export.data.basis==='g26'&&__export.data.sites.length===2&&__export.data.sites[0].gaps.length>0));
await browser.close();process.exit(report('Site comparison',lines,fails,errors,lines.length)?0:1);

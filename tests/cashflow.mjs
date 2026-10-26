import {launch,openEngine,report} from './lib.mjs';
const browser=await launch(),{page,errors}=await openEngine(browser,'#/cashflow/taiping');
const lines=[];let fails=0;const ck=(n,c)=>{if(!c)fails++;lines.push((c?'PASS ':'FAIL ')+n)};
const results=await page.evaluate(()=>{
 const out=[],ck=(n,c)=>out.push([n,!!c]),near=(a,b,t=.01)=>Math.abs(a-b)<t;
 const x={area:1,pr:1,prUp:0,eff:.5,asp:1000,hc:100,pf:0,cont:0,stat:0,sm:0,fin:0,demo:0,profit:0,dc:0,owner:null};
 const p={quarters:4,land:10000000,structure:'cash',upfront:100,debt:50,facility:20000000,rate:8,target:12,deposit:0,retention:0,lag:0,rent:0,extra:0,construction:[25,25,25,25],sales:[0,0,0,100]};
 // Hand calculation: GDV21.78m, build4.356m (1.089m each quarter).
 // Initial debt5m. Q1 interest100k, draw594500; Q2 interest111890,
 // draw600445; Q3 interest123898.90, draw606449.45. Q4 interest136027.889.
 const r=cfModel(x,p);
 ck('independent GDV21.78m and static residual17.424m',near(r.m.gdv,21780000)&&near(r.m.rlv,17424000));
 ck('independent total interest471816.789',near(r.interestTotal,471816.789));
 ck('independent peak debt6801394.45',near(r.peakDebt,6801394.45));
 ck('independent final distribution13753577.661',near(r.distributions,13753577.661));
 ck('independent profit6952183.211',near(r.profit,6952183.211));
 ck('equity and static bridge reconcile',near(r.bridgeError,0)&&near(r.staticEquivalent,r.m.rlv));
 ck('10 percent annual IRR, quarterly periods',near(cfIRR([-100,0,0,0,110]).value,.10,1e-10));
 ck('negative annual IRR retained',near(cfIRR([-100,0,0,0,90]).value,-.10,1e-10));
 ck('multiple IRR sign changes withheld',cfIRR([-100,230,-132]).value===null);
 ck('no investment IRR withheld',cfIRR([0,0,10]).value===null);
 ck('all loss IRR withheld',cfIRR([-100,-10,0]).value===null);
 ck('long horizon IRR numerical stability',near(cfIRR([-100,...Array(47).fill(0),200]).value,Math.pow(2,1/12)-1,1e-10));
 ck('annual NPV independent',near(cfNPV([-100,0,0,0,110],.10),0,1e-10));
 const target=cfTarget(x,p);
 ck('target return solved against independent NPV',target.land>0&&near(cfNPV(cfModel(x,p,target.land).equity,.12),0)&&near(target.irr,.12,1e-8));
 const capped=cfModel(x,{...p,facility:1000000});
 ck('facility cap and equity shortfall',capped.rows.every(q=>q.debt<=1000000+.01)&&near(capped.peakDebt,1000000)&&near(capped.interestTotal,80000));
 ck('independent peak equity12327000',near(capped.peakEquity,12327000));
 const noDebt=cfModel(x,{...p,debt:0});
 ck('no debt means zero interest',noDebt.peakDebt===0&&noDebt.interestTotal===0&&near(noDebt.profit,7424000));
 const flat=cfModel({...x,fin:.05,profit:.2},{...p,quarters:1,construction:[100],sales:[100],debt:0,rate:0});
 ck('flat timing reverses to static RLV within cent',near(flat.staticEquivalent,flat.m.rlv));
 const s={...p,quarters:2,construction:[50,50],sales:[50,50],deposit:10,retention:10,lag:1};
 const bill=cfReceipts(s).receipts;
 ck('independent deposits/progress/retention25-65-10',near(bill[1],.25,1e-12)&&near(bill[2],.65,1e-12)&&near(bill[3],.10,1e-12));
 const late=cfReceipts({...s,quarters:3,construction:[50,50,0],sales:[0,0,100]});
 ck('late sale catches up to all billed progress',near(late.receipts[3],1,1e-12));
 const repl=cfModel({...x,sm:.03},{...p,land:5000000,structure:'replacement',debt:0});
 ck('replacement units reduce receipts, not duplicate cash land',near(repl.salesGDV,16780000)&&repl.rows.every(q=>q.owner===0)&&near(repl.replacementSF,5000));
 ck('independent replacement profit11.9206m',near(repl.profit,11920600));
 for(const structure of ['deferred','jv']){
  const d=cfModel(x,{...p,structure,debt:0});
  ck(structure+' pays only at completion',d.rows[0].owner===0&&d.rows[4].owner===p.land&&near(d.profit,7424000));
 }
 const loss=cfModel({...x,hc:1000},p);
 ck('terminal deficit requires equity and clears debt',loss.terminalEquity>0&&loss.rows.at(-1).debt===0&&loss.equityIRR.value===null&&near(loss.bridgeError,0));
 ck('unviable target has no fabricated price',cfTarget({...x,hc:1000},p).land===null);
 ck('invalid profiles rejected',cfValidate({...p,sales:[25,25,25,24]}).length>0);
 ck('negative rates rejected',cfValidate({...p,rate:-1}).length>0);
 ck('deposit plus retention above100 rejected',cfValidate({...p,deposit:90,retention:20}).length>0);
 ck('unknown cash-flow fields stripped',!Object.hasOwn(cfClean({taiping:{...p,ownerName:'forbidden'}}).taiping,'ownerName'));
 ck('invalid workspace config discarded',!cfClean({taiping:{...p,quarters:900}}).taiping);
 ck('prototype-shaped keys discarded',Object.keys(cfClean(JSON.parse('{"__proto__":{}}'))).length===0);
 MODELLED.forEach(st);const before=JSON.stringify({STATE,INC,CAL,GLOB,TX,DEAL});
 for(const id of MODELLED)for(const basis of ['base','g26','live']){
  const input=comparisonInput(id,basis);if(!input)continue;
  const cfg=cfDefaults(input);
  for(const structure of ['cash','deferred','replacement','jv']){
   const config={...cfg,structure,land:Math.min(cfg.land,model(input).gdv)};
   const a=cfModel(input,config);
   ck(id+'/'+basis+'/'+structure+' bridge and debt conservation',near(a.bridgeError,0)&&near(a.staticEquivalent,a.m.rlv)&&near(a.rows.reduce((s,q)=>s+q.draw-q.repay,0),0));
   ck(id+'/'+basis+'/'+structure+' full sales collection',near(a.rows.reduce((s,q)=>s+q.receipt,0),a.salesGDV));
  }
 }
 ck('cash flow preserves existing scenario/evidence state',before===JSON.stringify({STATE,INC,CAL,GLOB,TX,DEAL}));
 return out;
});results.forEach(([n,c])=>ck(n,c));
ck('cash flow reachable with metrics',await page.locator('#cf-results .metric').count()===7);
await page.fill('#cf-construction','50, 50');await page.click('#cf-form button[type=submit]');
ck('profile length rejected',(await page.innerText('#cf-error')).includes('per quarter'));
await page.fill('#cf-quarters','4');await page.click('#cf-profiles');
await page.selectOption('#cf-structure','deferred');await page.fill('#cf-rate','7');await page.click('#cf-form button[type=submit]');
ck('explicit settings saved',await page.evaluate(()=>CF.taiping.rate===7&&CF.taiping.structure==='deferred'&&CF.taiping.quarters===4));
await page.reload();ck('settings survive reload',await page.inputValue('#cf-rate')==='7');
ck('workspace includes validated cash flow',await page.evaluate(()=>workspaceBody().cashflow.taiping.rate===7));
await page.evaluate(()=>{applyRemote({cashflow:{taiping:{...CF.taiping,rate:9}}})});
ck('remote settings apply',await page.inputValue('#cf-rate')==='9');
await page.evaluate(()=>{window.__cfExport=null;saveText=(name,text)=>{window.__cfExport=JSON.parse(text)}});await page.click('#cf-export');
ck('export contains ledger and scenario input',await page.evaluate(()=>__cfExport.result.rows.length>1&&__cfExport.input.asp>0&&__cfExport.target));
await page.selectOption('#cf-site','salak');await page.waitForTimeout(150);
ck('per-site isolation',await page.inputValue('#cf-rate')==='6');
await page.evaluate(()=>{location.hash='#/lab/taiping'});await page.waitForTimeout(150);
ck('lab shows live IRR and peak debt',(await page.innerText('.cf-summary')).includes('Peak debt'));
await page.evaluate(()=>{location.hash='#/cashflow/taiping'});await page.waitForTimeout(150);
await page.setViewportSize({width:390,height:844});
ck('cash flow fits phone',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
ck('ledger scrolls inside its region',await page.locator('[aria-label="Quarterly cash-flow ledger"]').evaluate(e=>e.scrollWidth>e.clientWidth));
await page.evaluate(()=>document.documentElement.setAttribute('data-theme','dark'));
ck('cash controls themed',await page.locator('#cf-structure').evaluate(e=>getComputedStyle(e).backgroundColor!=='rgb(255, 255, 255)'));
await page.click('#cf-reset');ck('reset removes saved override',await page.evaluate(()=>!CF.taiping));
await browser.close();process.exit(report('Cash flow',lines,fails,errors,lines.length)?0:1);

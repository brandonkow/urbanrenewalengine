// Build 5.3: independent arithmetic, isolation, persistence and massing UI.
import { launch, openEngine, report } from './lib.mjs';
const browser=await launch();
const {page,errors}=await openEngine(browser,'#/massing/taiping');
const lines=[];let fails=0;
const chk=(n,c)=>{if(!c)fails++;lines.push((c?'PASS ':'FAIL ')+n)};
const results=await page.evaluate(()=>{
 const out=[], ck=(n,c)=>out.push([n,!!c]), near=(a,b)=>Math.abs(a-b)<1e-6;
 // Hand calculation: 1 acre, PR2, 50% efficiency, 1,000sf/unit.
 // GFA=87,120sf; saleable=43,560sf; ceil(units)=44; ceil(44*1.1)=49 bays.
 // At 300sf/bay: 14,700sf. 25% tower plate=10,890sf => 8 storeys.
 // 20% parking plate=8,712sf => 2 full floors=17,424sf.
 // Parking hard cost=17,424*100=1,742,400; +10% fees +5% contingency=2,003,760.
 // Tower height=8*3.2=25.6m; podium adds 2*3=6m =>31.6m.
 const x={area:1,pr:2,prUp:0,eff:.5,asp:1000,hc:100,pf:.1,cont:.05,stat:0,sm:0,fin:0,demo:0,profit:.2,dc:0,owner:{res:100000,com:0,cs:0,up:0,hold:0,n:10}};
 const p={...massingDefaults('taiping'),area:1,aspect:1,front:0,rear:0,side:0,coverage:.25,parkingCoverage:.2,unitSf:1000,bays:1,visitor:.1,bayArea:300,podiumCost:100,basementCost:200,included:false,heightLimit:32};
 const before=JSON.stringify({x,p}), r=massingCalc(x,p);
 for(const [k,v] of Object.entries({units:44,bays:49,parkingArea:14700,footprint:10890,parkPlate:8712,storeys:8,parkingLevels:2,builtParkingArea:17424,parkingHard:1742400,extraCost:2003760,height:31.6}))ck('worked '+k,near(r[k],v));
 // Base RLV=43,560,000 - 8,712,000 - 871,200 - 435,600 - 8,712,000=24,829,200.
 ck('worked engine RLV',near(r.m.rlv,24829200));
 ck('worked adjusted RLV',near(r.adjustedRLV,22825440));
 ck('worked owner coverage',near(r.adjustedCoverage,22.82544));
 ck('pure inputs unchanged',before===JSON.stringify({x,p}));
 ck('assumed height passes',r.heightOK===true);
 ck('lower height fails',massingCalc(x,{...p,heightLimit:30}).heightOK===false);
 ck('unknown height never passes',massingCalc(x,{...p,heightLimit:0}).heightOK===null);
 const inc=massingCalc(x,{...p,included:true});
 ck('included parking not charged twice',inc.extraCost===0&&near(inc.adjustedRLV,24829200));
 const basement=massingCalc(x,{...p,mode:'basement'});
 ck('basement doubles cost at double unit rate',near(basement.parkingHard,3484800));
 ck('basement does not add to above-ground height',near(basement.height,25.6));
 const zero=massingCalc(x,{...p,bays:0,visitor:0});
 ck('zero parking yields zero floors and cost',zero.parkingLevels===0&&zero.extraCost===0);
 const blocked=massingCalc(x,{...p,side:50});
 ck('blocked footprint has no fabricated output',!blocked.geometryOK&&blocked.adjustedRLV===null&&blocked.storeys===null);
 ck('invalid number rejected',!massingCalc(x,{...p,area:NaN}).valid);
 ck('invalid ratio rejected',!massingCalc(x,{...p,coverage:0}).valid);
 ck('explicit DC required for pure calculation',!massingCalc({...x,dc:undefined},p).valid);
 const land={...x,owner:{...x.owner,mode:'landed',net:.5,lot:1000,lpsf:100}};
 ck('landed owners scale with parcel size',massingCalc(land,{...p,area:5}).m.own.n===109);
 ck('strata interests do not scale automatically',massingCalc(x,{...p,area:5}).m.own.n===10);
 ck('no owner model shows unassessed coverage',massingCalc({...x,owner:null},p).adjustedCoverage===null);
 const saved=JSON.stringify(STATE), olds=MODELLED.map(id=>model(presetState(SITE[id],'base')).rlv);
 for(const id of MODELLED){const rows=massingScenarios(id,massingConfig(id));ck(id+' renders four valid scenarios',rows.length===4&&rows.every(q=>q.valid&&Number.isFinite(q.m.rlv)));}
 ck('massing does not mutate scenario state',saved===JSON.stringify(STATE));
 ck('all golden base residuals unaffected',MODELLED.every((id,i)=>near(model(presetState(SITE[id],'base')).rlv,olds[i])));
 const tt=massingScenarios('taiping',massingConfig('taiping'));
 ck('Taiping PR4 / PR6 / PR6.8',near(tt[0].pr,4)&&near(tt[1].pr,6)&&near(tt[2].pr,6.8));
 st('taiping').asp=1; INC.taiping={...incDefault('taiping'),redev:0};
 ck('lab and incentive edits cannot leak',near(massingScenarios('taiping',massingConfig('taiping'))[1].m.rlv,tt[1].m.rlv));
 STATE=JSON.parse(saved);INC={};
 MASS={taiping:{area:-100,aspect:'bad',coverage:0,mode:'<img>',included:'no',customPR:null}};
 const safe=massingConfig('taiping');
 ck('imported bad settings sanitised',safe.area===.01&&safe.aspect===1.5&&safe.coverage===.05&&safe.mode==='podium'&&safe.included===true&&safe.customPR===4);
 MASS={};render();
 return out;
});
results.forEach(([n,c])=>chk(n,c));
await page.fill('#mass_customPR','6');
await page.locator('#mass_customPR').dispatchEvent('change');
chk('PR edit persists',await page.evaluate(()=>massingConfig('taiping').customPR===6));
await page.uncheck('#massIncluded');
chk('parking exclusion lowers residual',await page.evaluate(()=>{const q=massingScenarios('taiping',massingConfig('taiping'))[3];return q.adjustedRLV<q.m.rlv}));
await page.selectOption('#massMode','basement');
chk('parking mode persists',await page.evaluate(()=>massingConfig('taiping').mode==='basement'));
await page.reload();await page.waitForTimeout(150);
chk('settings survive reload',await page.evaluate(()=>massingConfig('taiping').customPR===6&&!massingConfig('taiping').included));
chk('saved settings in workspace',await page.evaluate(()=>workspaceBody().massing.taiping.customPR===6));
chk('workspace export / import restores massing',await page.evaluate(()=>{const json=JSON.stringify(exportObj());MASS={};importWorkspace(json);return massingConfig('taiping').customPR===6}));
await page.fill('#mass_side','50');await page.locator('#mass_side').dispatchEvent('change');
chk('impossible footprint explained', (await page.innerText('main')).includes('No buildable footprint'));
chk('no broken numeric text',!/\bNaN\b|\bundefined\b|Infinity/.test(await page.innerText('main')));
await page.click('#massReset');
chk('reset restores defaults',await page.evaluate(()=>massingConfig('taiping').side===6&&massingConfig('taiping').included));
await page.selectOption('#massSel','salak');await page.waitForTimeout(150);
chk('site selection changes route',await page.evaluate(()=>location.hash==='#/massing/salak'));
chk('village starts at five acres',await page.evaluate(()=>massingConfig('salak').area===5));
await page.click('#nav button[data-p="watchlist"]');await page.waitForTimeout(150);
await page.click('#nav button[data-p="massing"]');await page.waitForTimeout(150);
chk('navigation remembers massing site',await page.evaluate(()=>location.hash==='#/massing/salak'));
for(const theme of ['light','dark']){
 await page.evaluate(t=>document.documentElement.setAttribute('data-theme',t),theme);
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});
  chk(theme+' '+width+'px has no page overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 }
}
await browser.close();
process.exit(report('Massing checks',lines,fails,errors)?0:1);

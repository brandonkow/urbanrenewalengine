import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateParcelRegistry,validateParcelGeometry,parcelPublication} from '../src/parcel-validator.js';
import {parcelFixture} from './fixtures/parcels.mjs';
import {launch,openEngine,report} from './lib.mjs';
let n=0,fails=0;const lines=[];const copy=x=>JSON.parse(JSON.stringify(x));
function check(name,fn){n++;try{fn();lines.push('PASS '+name)}catch(e){fails++;lines.push('FAIL '+name+': '+e.message)}}
const today=new Date().toISOString().slice(0,10),fixture=parcelFixture(today),seed=JSON.parse(await readFile(new URL('../data/parcel-registry.json',import.meta.url),'utf8'));
check('empty production registry remains explicit',()=>assert.deepEqual(validateParcelRegistry(seed).features,[]));
check('valid fixture cloned',()=>{const x=validateParcelRegistry(fixture,['taiping']);x.features[0].properties.label='changed';assert.notEqual(x.features[0].properties.label,fixture.features[0].properties.label)});
check('reviewed permitted geometry visible',()=>assert.equal(parcelPublication(fixture.features[0],today).visible,true));
const reject=(name,edit)=>check(name,()=>{const x=copy(fixture);edit(x.features[0],x);assert.throws(()=>validateParcelRegistry(x,['taiping']))});
reject('unknown site rejected',f=>f.properties.site='unknown');
reject('duplicate ID rejected',(f,x)=>x.features.push(copy(f)));
reject('unknown private field rejected',f=>f.properties.ownerName='Not allowed');
reject('unknown geometry field rejected',f=>f.geometry.ownerName='Not allowed');
reject('incorrect schema rejected',(f,x)=>x.schema='v9');
reject('wrong coordinate order rejected',f=>f.geometry.coordinates[0][0]=[3.165,101.705]);
reject('nonfinite coordinate rejected',f=>f.geometry.coordinates[0][1][0]=Infinity);
reject('open ring rejected',f=>f.geometry.coordinates[0].pop());
reject('repeated vertex rejected',f=>f.geometry.coordinates[0].splice(1,0,[101.705,3.165]));
reject('collinear polygon rejected',f=>f.geometry.coordinates=[[[101.7,3.1],[101.71,3.11],[101.72,3.12],[101.7,3.1]]]);
reject('crossing polygon rejected',f=>f.geometry.coordinates=[[[101.7,3.1],[101.72,3.12],[101.7,3.12],[101.72,3.1],[101.7,3.1]]]);
reject('hole rejected without silently discarding it',f=>f.geometry.coordinates.push(copy(f.geometry.coordinates[0])));
reject('multipolygon rejected without simplification',f=>{f.geometry.type='MultiPolygon';f.geometry.coordinates=[f.geometry.coordinates]});
reject('out-of-region coordinates rejected',f=>f.geometry.coordinates[0][1]=[100,3]);
reject('source mismatch rejected',f=>f.properties.sourceType='PUBLIC_MAP');
reject('unsafe URL rejected',f=>f.properties.sourceUrl='javascript:alert(1)');
reject('credential URL rejected',f=>f.properties.sourceUrl='https://secret@example.com');
reject('invalid date rejected',f=>f.properties.checked='2026-02-30');
reject('invalid confidence rejected',f=>f.properties.confidence='VERIFIED');
reject('negative source area rejected',f=>f.properties.sourceAreaSqm=-1);
reject('review without confirmed match rejected',f=>f.properties.review.siteMatch='unconfirmed');
reject('review without role rejected',f=>f.properties.review.role='unassigned');
reject('cadastral review needs surveyor role',f=>f.properties.review.role='planner');
check('planning review uses planner role',()=>{const x=copy(fixture),p=x.features[0].properties;p.kind='planning';p.sourceType='OFFICIAL_PLANNING';p.review.role='planner';validateParcelRegistry(x,['taiping']);assert.equal(parcelPublication(x.features[0],today).visible,true)});
reject('geometry without reuse permission rejected',f=>f.properties.rights.status='unknown');
reject('missing permission reference rejected',f=>f.properties.rights.reference='');
reject('control unsafe link rejected',f=>f.properties.controls[0].sourceUrl='data:text/html,evil');
reject('control scope required',f=>delete f.properties.controls[0].scope);
reject('overlong label rejected',f=>f.properties.label='x'.repeat(201));
reject('position limit enforced',f=>f.geometry.coordinates=[Array.from({length:1001},()=>[101.7,3.1])]);
for(const [label,edit] of [
 ['missing geometry',f=>f.geometry=null],
 ['pending review',f=>{f.properties.review={status:'pending',date:'',role:'unassigned',siteMatch:'unconfirmed',note:''}}],
 ['stale source',f=>f.properties.checked='2020-01-01'],
 ['stale review',f=>f.properties.review.date='2020-01-01'],
 ['future review',f=>f.properties.review.date='2099-01-01'],
 ['future source',f=>f.properties.checked='2099-01-01']
])check(label+' withheld',()=>{const x=copy(fixture);edit(x.features[0]);validateParcelRegistry(x,['taiping']);assert.equal(parcelPublication(x.features[0],today).visible,false)});
check('pending metadata without geometry allowed',()=>{const x=copy(fixture),f=x.features[0];f.geometry=null;f.properties.rights={status:'unknown',reference:''};f.properties.review={status:'pending',date:'',role:'unassigned',siteMatch:'unconfirmed',note:''};validateParcelRegistry(x);assert.equal(parcelPublication(f,today).visible,false)});
check('90-day boundary is explicit',()=>{const f=copy(fixture.features[0]);f.properties.checked='2026-01-01';f.properties.review.date='2026-01-01';assert.equal(parcelPublication(f,'2026-04-01').visible,true);assert.equal(parcelPublication(f,'2026-04-02').visible,false)});
const browser=await launch(),{page,errors}=await openEngine(browser,'#/map');
const before=await page.evaluate(()=>JSON.stringify({STATE,INC}));
try{
 assert.match(await page.innerText('main'),/No reviewed boundary records/);
 assert.equal(await page.locator('.parcel-shape').count(),0);
 assert.equal(await page.locator('#map-focus').isDisabled(),true);n+=3;
 await page.evaluate(x=>{PARCELS=URECore.validateParcelRegistry(x,SITES.map(s=>s.id));MAP.sel='taiping';render()},fixture);
 assert.equal(await page.locator('.parcel-shape').count(),1);n++;
 await page.locator('.parcel-record summary').click();
 assert.match(await page.innerText('main'),/Area context only; parcel applicability unresolved/);n++;
 await page.locator('#map-focus').check();
 assert.notEqual(await page.locator('#mapsvg').getAttribute('viewBox'),'0 0 800 881'); // also test actual focus below
 const box=await page.locator('#mapsvg').getAttribute('viewBox');assert.ok(Number(box.split(' ')[2])<20);n++;
 assert.equal(await page.locator('.pin').count(),0);n++;
 await page.locator('[data-layer="spec"]').uncheck();assert.equal(await page.locator('.parcel-shape').count(),1);n++;
 await page.locator('[data-layer="spec"]').check();
 await page.locator('#map-site').selectOption('salak');assert.match(await page.innerText('main'),/No reviewed boundary records/);assert.equal(await page.locator('#map-focus').isDisabled(),true);n+=2;
 await page.locator('#map-site').selectOption('taiping');
 await page.locator('[data-layer="boundaries"]').uncheck();assert.equal(await page.locator('.parcel-shape').count(),0);n++;
 await page.locator('[data-layer="boundaries"]').check();assert.equal(await page.locator('.parcel-shape').count(),1);n++;
 await page.evaluate(()=>{PARCELS.features[0].properties.checked='2020-01-01';render()});assert.equal(await page.locator('.parcel-shape').count(),0);assert.match(await page.innerText('main'),/Withheld from map/);n+=2;
 await page.evaluate(x=>{x.features[0].properties.label='<img src=x onerror=alert(1)>';PARCELS=URECore.validateParcelRegistry(x,SITES.map(s=>s.id));MAP.focus=false;render()},fixture);
 assert.equal(await page.locator('.parcel-panel img').count(),0);n++;
 for(const width of [390,1440]){await page.setViewportSize({width,height:900});await page.evaluate(()=>document.documentElement.setAttribute('data-theme','dark'));const dim=await page.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);assert.ok(dim[0]<=dim[1]+1);n++;}
 assert.equal(await page.evaluate(()=>JSON.stringify({STATE,INC})),before);n++;
 lines.push('PASS empty state, review gate, source context, focus, site selection, layers, escaping, responsive layout and economic isolation');
}catch(e){fails++;lines.push('FAIL browser parcel workflow: '+e.message)}
await browser.close();
process.exit(report('Parcel registry and map',lines,fails,errors,n)?0:1);

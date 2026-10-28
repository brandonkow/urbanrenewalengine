import {describe,it,expect} from 'vitest';
import {calcRLV,calcOwner,model,requiredPR,requiredASP,ownerBudgetPer,applyOwnerDerived,dealCalc} from '../../src/engine.js';
const base={area:1,pr:1,prUp:0,eff:.5,asp:1000,hc:100,pf:0,cont:0,stat:0,sm:0,fin:0,demo:0,profit:0,owner:null};
describe('pure residual engine',()=>{
 it('reproduces hand arithmetic without a browser',()=>{
  const r=calcRLV(base);expect(r.land).toBe(43560);expect(r.gdv).toBe(21780000);expect(r.hard).toBe(4356000);expect(r.rlv).toBe(17424000);expect(r.psf).toBe(400);expect(r.be).toBe(200);
 });
 it('charges only positive value from incentive GFA',()=>{
  const r=calcRLV({...base,prUp:.5,dc:.3});
  expect(r.dc).toBeCloseTo(2613600,6);expect(r.rlv).toBeCloseTo(23522400,6);
  expect(calcRLV({...base,dc:.3}).dc).toBe(0);
  expect(calcRLV({...base,asp:100,prUp:.5,dc:.3}).dc).toBe(0);
 });
 it('is independent of global state and does not mutate input',()=>{
  const x=Object.freeze({...base,owner:Object.freeze({res:1000000,com:0,cs:0,up:.3,n:2,hold:0})});
  globalThis.GLOB={dc:.9};
  const r=model(x);expect(r.dc).toBe(0);expect(r.own.reqTotal).toBe(2600000);expect(r.own.coverage).toBeCloseTo(17424000/2600000,10);
  expect(calcOwner(base,r)).toBeNull();delete globalThis.GLOB;
 });
 it('prices owner mix, holdout buffer and required inputs',()=>{
  const owner={res:400000,com:800000,cs:.25,up:.3,n:40,hold:.1};
  expect(ownerBudgetPer(owner)).toBeCloseTo(715000,6);
  const x={...base,owner},r=model(x);
  const asp=requiredASP(x,r,40,owner);expect(model({...x,asp}).own.coverage).toBeCloseTo(1,10);
  const pr=requiredPR(x,r,40,owner);expect(model({...x,pr}).own.coverage).toBeCloseTo(1,10);
 });
 it('withholds impossible density fixes',()=>{
  const x={...base,asp:100,owner:{res:1e6,com:0,cs:0,up:.3,n:40}},r=model(x);
  expect(r.own.reqPR).toBe(Infinity);expect(r.own.maxN).toBe(0);
 });
 it('derives landed counts only from passed inputs',()=>{
  const x={...base,area:2,owner:{mode:'landed',net:.5,lot:2000,lpsf:300}};
  applyOwnerDerived(x);expect(x.owner.n).toBe(22);expect(x.owner.res).toBe(600000);expect(x.owner.cs).toBe(0);
 });
 it('derives enabled building form explicitly',()=>{
  const x={...base,owner:{mode:'strata',form:{on:true,bays:10,levels:4}}};
  applyOwnerDerived(x);expect(x.owner.n).toBe(40);expect(x.owner.cs).toBe(.25);
 });
 it('keeps deal consideration and fee arithmetic',()=>{
  const x={...base,owner:{res:1000000,com:0,cs:0,up:.3,n:2,hold:0}};
  const d={T:4,r:.06,resRent:1000,comRent:0,reloc:0,sizing:'value',matchPV:false,ratio:1,oldRes:1000,oldCom:0,waive:false,e:null,feeBasis:'owner',feeRate:.02,promote:.2};
  const r=dealCalc(x,model(x),d);
  expect(r.A.consid).toBe(2600000);expect(r.A.fee).toBe(52000);expect(r.A.after).toBe(14772000);
  expect(r.B.R).toBe(2600);expect(r.rent).toBe(96000);expect(r.C.consid).toBeCloseTo(2600000,6);
 });
});

import {describe,it,expect} from 'vitest';
import {g26Share,categoryB,categoryA} from '../../src/guideline.js';
const p={redev:.5,residing:.3,open:.1,tpz:.2,elig:1,ppu:4,unitSf:1000,big:false};
const x={area:1,pr:1,eff:.5,asp:1000,hc:100,pf:0,cont:0,stat:0,sm:0,fin:0,demo:0,profit:0,owner:null};
describe('pure guideline calculations',()=>{
 it('caps Category B at 70 percent',()=>{
  const r=g26Share({redev:.5,res:.3,open:.1,tpz:.2,elig:1});expect(r.raw).toBeCloseTo(1.1,12);expect(r.share).toBe(.7);expect(r.capped).toBe(true);
 });
 it('applies eligibility before adding transit share',()=>{
  const r=g26Share({redev:.5,res:.3,open:.1,tpz:.2,elig:.5});expect(r.share).toBeCloseTo(.65,12);expect(r.capped).toBe(false);
 });
 it('keeps residential residing component excluded',()=>{
  const r=categoryB({pr:4,zone:'R3'},{...p,open:0,tpz:0});expect(r.res).toBe(0);expect(r.pr).toBe(6);
  expect(categoryB({pr:4,zone:'Commercial'},p).pr).toBe(6.8);
 });
 it('does not invent missing base intensity',()=>expect(categoryB({pr:null},p)).toBeNull());
 it('reproduces independently worked Category A controlled housing',()=>{
  const r=categoryA(x,p,'I');
  // 1400 persons / 4 = 350 units; 30% MADANI => 105, remainder245.
  // Sale receipts21m+73.5m=94.5m; GFA(105*750+245*900)/.5=598500sf.
  expect(r.U).toBe(350);expect(r.G).toBe(0);expect(r.M).toBe(105);expect(r.R).toBe(245);
  expect(r.gdv).toBe(94500000);expect(r.gfa).toBe(598500);expect(r.rlv).toBe(34650000);expect(r.cov).toBeNull();
 });
 it('counts replacement units toward the controlled share',()=>{
  const r=categoryA({...x,owner:{n:20,res:1e6,com:0,cs:0,up:0}},p,'I');
  expect(r.G).toBe(20);expect(r.aff).toBe(330);expect(r.M).toBe(99);expect(r.R).toBe(231);expect(r.ctlActual).toBe(1);
 });
 it('uses the large-site MADANI split and guards unknown tiers',()=>{
  expect(categoryA(x,{...p,big:true},'I').M).toBe(175);expect(categoryA(x,p,'unknown')).toBeNull();
 });
 it('never changes the supplied scenario',()=>{
  const frozen=Object.freeze({...x}),before=JSON.stringify(frozen);categoryA(frozen,Object.freeze({...p}),'IV');expect(JSON.stringify(frozen)).toBe(before);
 });
});

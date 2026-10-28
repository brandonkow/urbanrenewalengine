/* ---------- assembly tracker ---------- */
const ASM_ST=[['Not contacted','u'],['Contacted','c'],['Interested','i'],['Signed','s'],['Refused','r']];
let ASM=store.get('asm',{});
function asm(id,n){
  if(!ASM[id]) ASM[id]={items:[],sel:0};
  const a=ASM[id]; while(a.items.length<n) a.items.push({s:0,l:''});
  return a;
}


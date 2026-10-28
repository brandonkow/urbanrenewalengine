/* ---------- formatting ---------- */
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function fmt0(v){return isFinite(v)?Math.round(v).toLocaleString('en-MY'):'n/a'}
function fmt1(v){return isFinite(v)?v.toLocaleString('en-MY',{minimumFractionDigits:1,maximumFractionDigits:1}):'n/a'}
function fmt2(v){return isFinite(v)?v.toLocaleString('en-MY',{minimumFractionDigits:2,maximumFractionDigits:2}):'n/a'}
function fmtRM(v){return isFinite(v)?(v<0?'−':'')+'RM'+Math.round(Math.abs(v)).toLocaleString('en-MY'):'n/a'}
function fmtM(v,d=2){return isFinite(v)?(v<0?'−':'')+'RM'+(Math.abs(v)/1e6).toFixed(d)+'m':'n/a'}
function fmtK(v){if(!isFinite(v))return 'n/a';const a=Math.abs(v);return a>=1e6?fmtM(v,2):(v<0?'−':'')+'RM'+Math.round(a/1e3).toLocaleString('en-MY')+'k'}
function fmtPct(v,d=1){return isFinite(v)?(v*100).toFixed(d)+'%':'n/a'}
function fmtSPct(v,d=1){return isFinite(v)?(v>=0?'+':'−')+Math.abs(v*100).toFixed(d)+'%':'n/a'}
function sgnCls(v){return v<0?'neg':''}


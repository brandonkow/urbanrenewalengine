/* ---------- in-page confirmation (sandboxed pages may block browser dialogs) ---------- */
function armConfirm(btn,fn){
  if(!btn) return; const label=btn.textContent;
  btn.onclick=()=>{
    if(btn.dataset.armed){delete btn.dataset.armed;btn.textContent=label;fn();return}
    btn.dataset.armed='1';btn.textContent='Click again to confirm';
    setTimeout(()=>{if(btn.dataset.armed){delete btn.dataset.armed;btn.textContent=label}},4000);
  };
}


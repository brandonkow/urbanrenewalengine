/* ---------- map ---------- */
const MB={lat0:3.075,lat1:3.240,lon0:101.625,lon1:101.775};
const KX=Math.cos(3.1575*Math.PI/180), MW=800, MSC=MW/((MB.lon1-MB.lon0)*KX), MH=Math.round((MB.lat1-MB.lat0)*MSC);
const PX=(la,lo)=>[(lo-MB.lon0)*KX*MSC,(MB.lat1-la)*MSC];
const RAIL=[
 {n:'LRT Kelana Jaya line',st:[['Gombak',3.2312,101.7244],['Taman Melati',3.2194,101.7219],['Wangsa Maju',3.2058,101.7318],['Sri Rampai',3.1994,101.7373],['Setiawangsa',3.1757,101.7358],['Jelatek',3.1673,101.7355],['Dato’ Keramat',3.1648,101.7317],['Damai',3.1644,101.7244],['Ampang Park',3.1598,101.7196],['KLCC',3.1590,101.7134],['Kampung Baru',3.1613,101.7068],['Dang Wangi',3.1569,101.7019],['Masjid Jamek',3.1496,101.6964],['Pasar Seni',3.1425,101.6954],['KL Sentral',3.1345,101.6863],['Bangsar',3.1277,101.6793],['Abdullah Hukum',3.1187,101.6729],['Kerinchi',3.1153,101.6685],['Universiti',3.1147,101.6620]]},
 {n:'MRT Kajang line',st:[['Semantan',3.1510,101.6655],['Muzium Negara',3.1375,101.6879],['Pasar Seni',3.1425,101.6954],['Merdeka',3.1419,101.7019],['Bukit Bintang',3.1466,101.7110],['TRX',3.1424,101.7197],['Cochrane',3.1331,101.7231],['Maluri',3.1233,101.7279],['Taman Pertama',3.1128,101.7299],['Taman Midah',3.1045,101.7324],['Taman Mutiara',3.0914,101.7404]]},
 {n:'MRT Putrajaya line',st:[['Jinjang',3.2094,101.6557],['Kampung Batu',3.2053,101.6751],['Kentonmen',3.1958,101.6798],['Jalan Ipoh',3.1891,101.6846],['Sentul Barat',3.1797,101.6897],['Titiwangsa',3.1735,101.6953],['Hospital KL',3.1715,101.7023],['Raja Uda',3.1664,101.7108],['Ampang Park',3.1598,101.7196],['Conlay',3.1510,101.7185],['TRX',3.1424,101.7197],['Chan Sow Lin',3.1284,101.7155],['Taman Naga Emas',3.0869,101.6904]]},
 {n:'LRT Ampang / Sri Petaling line',st:[['Sentul Timur',3.1856,101.6953],['Sentul',3.1787,101.6955],['Titiwangsa',3.1735,101.6953],['PWTC',3.1665,101.6936],['Sultan Ismail',3.1611,101.6942],['Bandaraya',3.1557,101.6943],['Masjid Jamek',3.1496,101.6964],['Plaza Rakyat',3.1447,101.7018],['Hang Tuah',3.1401,101.7059],['Pudu',3.1349,101.7115],['Chan Sow Lin',3.1284,101.7155],['Cheras',3.1123,101.7143],['Salak Selatan',3.1022,101.7056],['Bandar Tun Razak',3.0896,101.7127],['Bandar Tasik Selatan',3.0765,101.7117]]},
 {n:'LRT Ampang branch',st:[['Chan Sow Lin',3.1284,101.7155],['Miharja',3.1209,101.7179],['Maluri',3.1236,101.7276],['Pandan Jaya',3.1305,101.7392]]}
];
let MAP = store.get('map',{boundaries:true,rail:true,stn:false,tpz:true,spec:true,jwp:true,lab:true,sel:'taiping'});
if(MAP.boundaries===undefined)MAP.boundaries=true;
function viewMap(){
  const selected=SITE[MAP.sel]?MAP.sel:'taiping';
  let g=parcelShapes();
  for(let la=3.08;la<=3.2401;la+=0.02){const y=PX(la,MB.lon0)[1];g+=`<line class="grat" x1="0" x2="${MW}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"/><text class="grat-l" x="4" y="${(y-3).toFixed(1)}">${la.toFixed(2)}°N</text>`}
  for(let lo=101.64;lo<=101.7701;lo+=0.02){const x=PX(MB.lat0,lo)[0];g+=`<line class="grat" y1="0" y2="${MH}" x1="${x.toFixed(1)}" x2="${x.toFixed(1)}"/><text class="grat-l" x="${(x+3).toFixed(1)}" y="${MH-5}">${lo.toFixed(2)}°E</text>`}
  if(MAP.tpz){const kz=MSC/111.32, seenZ=new Set();RAIL.forEach(r=>r.st.forEach(p=>{if(seenZ.has(p[0]))return;seenZ.add(p[0]);const[x,y]=PX(p[1],p[2]);g+=`<circle class="tiz" r="${(.6*kz).toFixed(1)}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}"/><circle class="tpz" r="${(.4*kz).toFixed(1)}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}"/>`}))}
  if(MAP.rail){
    RAIL.forEach(r=>{g+=`<path class="railln" d="${r.st.map((p,i)=>{const[x,y]=PX(p[1],p[2]);return (i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)}).join('')}"><title>${r.n} (approximate alignment)</title></path>`});
    const seen=new Set();
    RAIL.forEach(r=>r.st.forEach(p=>{if(seen.has(p[0]))return;seen.add(p[0]);const[x,y]=PX(p[1],p[2]);g+=`<circle class="stn" r="2.6" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}"><title>${p[0]}</title></circle>`;if(MAP.stn)g+=`<text class="stn-l" x="${(x+4).toFixed(1)}" y="${(y-3).toFixed(1)}">${p[0]}</text>`}));
  }
  const km=MSC/111.32;
  g+=`<g transform="translate(${MW-150} ${MH-34})"><rect x="0" y="0" width="${(2*km).toFixed(1)}" height="5" fill="var(--ink)"/><rect x="0" y="0" width="${km.toFixed(1)}" height="5" fill="var(--panel)" stroke="var(--ink)"/><text class="grat-l" x="0" y="-4">0</text><text class="grat-l" x="${(2*km).toFixed(1)}" y="-4" text-anchor="end">2 km</text></g>`;
  SITES.forEach(s=>{
    if(s.group==='specific'&&!MAP.spec)return; if(s.group==='jwp'&&!MAP.jwp)return;
    const[x,y]=PX(s.lat,s.lon), e=econState(s), sel=MAP.sel===s.id;
    g+=`<g class="pin${sel?' sel':''}" data-id="${s.id}" tabindex="0" role="button" aria-label="${esc(s.name)}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
      ${s.group==='specific'?'<circle class="ring" r="10.5"/>':''}<circle class="core f-${e}" r="6.5"/>
      ${MAP.lab?`<text ${s.labL?'x="-13" text-anchor="end"':'x="13"'} y="4">${esc(s.name.replace(/^(Flat|Apartmen|Perumahan) /,''))}</text>`:''}
      <title>${esc(s.name)}: approximate pin</title></g>`;
  });
  if(MAP.focus&&MAP.boundaries!==false&&parcelVisible(selected).length)g=parcelShapes(selected);
  const s=SITE[MAP.sel]||SITE.taiping, x=s.rlv?st(s.id):null, m=x?model(x):null, os=ownerStatus(m,x);
  const side=`<div class="side">
    <h2 style="margin-bottom:2px">${esc(s.name)}</h2>
    <p class="small muted">${esc(s.place)}, ${esc(s.ref)} ${badge('INFERRED','Pin position is approximate')}</p>
    <p><a href="#/diligence/${s.id}">Open site due-diligence workspace</a></p><p>${stageTag(s.stage)} ${verdictTag(s.verdict)}</p>
    <dl class="kv small">
     <dt>Plot ratio</dt><dd>${s.pr?fmt2(s.pr)+'× ':'Not confirmed '}${badge(s.prType)}</dd>
     ${(()=>{const ns=nearestStation(s),tz=tpzRead(ns.km);return `<dt>Nearest station</dt><dd>${esc(ns.n)}, about ${fmt0(ns.km*1000)} m <span class="chip ${tz[1]}">${tz[0]}</span></dd>`})()}
     ${m?`<dt>RLV / acre</dt><dd class="${sgnCls(m.rlv)}">${fmtM(m.rlvAc)} ${badge('MODEL_OUTPUT')}</dd><dt>Breakeven ASP</dt><dd>${fmtRM(m.be)} vs ${fmtRM(x.asp)}</dd>`:'<dt>RLV</dt><dd class="muted">Not underwritten</dd>'}
     <dt>Owner density</dt><dd><span class="chip ${os.c}">${os.l}</span></dd>
     <dt>Gating variable</dt><dd>${esc(s.gating)}</dd>
    </dl>
    <p style="margin-top:12px"><a class="btn" href="#/site/${s.id}" style="text-decoration:none;display:inline-block">Open dossier</a></p>
  </div>`;
  const L=(k,l,dis)=>`<label><input type="checkbox" data-layer="${k}" ${MAP[k]?'checked':''} ${dis?'disabled':''}>${l}</label>`;
  return `<div class="page">
   ${head('Map','Approximate watchlist locations with a separate, source-reviewed boundary layer. Pin colour shows project economics.')}
   <div class="parcel-tools"><label for="map-site">Select site <select id="map-site">${SITES.map(s=>`<option value="${s.id}" ${s.id===selected?'selected':''}>${esc(s.name)}</option>`).join('')}</select></label><label><input type="checkbox" id="map-focus" ${MAP.focus&&MAP.boundaries!==false&&parcelVisible(selected).length?'checked':''} ${MAP.boundaries!==false&&parcelVisible(selected).length?'':'disabled'}> Focus on reviewed boundaries</label></div>
   ${MAP.focus&&MAP.boundaries!==false&&parcelVisible(selected).length?'<p class="note small">Focused boundary view: north is up. Only this site’s reviewed outlines are shown; schematic pins, rail and overview group filters are hidden here. Turn off focus to return to the overview. This is not a survey plan.</p>':''}
   <div class="map-wrap">
    <div class="map-box"><svg viewBox="${parcelViewBox(selected,MAP.focus&&MAP.boundaries!==false)}" id="mapsvg" role="group" aria-label="Schematic map of Kuala Lumpur redevelopment sites">${g}</svg></div>
    <div>
     ${side}
     ${parcelPanel(selected)}
     <div class="sec" style="margin-top:22px"><div class="sec-head"><h2>Layers</h2></div>
      <div class="layers">${L('boundaries','Reviewed boundary records')}${L('rail','Rail lines and stations')}${L('stn','Station names')}${L('tpz','Draft transit zones (400 m and 600 m)')}${L('spec','8 specific incentive sites')}${L('jwp','JWP exact-lot sites on the watchlist')}${L('lab','Site labels')}
      <label class="muted"><input type="checkbox" disabled>139-site PTKL framework (geometry not ingested)</label>
      <label class="muted"><input type="checkbox" disabled>New-launch ASP heatmap (no data yet)</label></div>
     </div>
     <div class="sec" style="margin-top:22px"><div class="sec-head"><h2>Legend</h2></div>
      <div class="legend-row"><span class="sw" style="background:var(--ok)"></span>Base economics work</div>
      <div class="legend-row"><span class="sw" style="background:var(--warn)"></span>Sensitive: trigger band or owner shortfall</div>
      <div class="legend-row"><span class="sw" style="background:var(--bad)"></span>Base case fails</div>
      <div class="legend-row"><span class="sw" style="background:var(--na)"></span>Not underwritten</div>
      <div class="legend-row"><span class="sw" style="border:2px solid var(--official)"></span>Official specific incentive site</div>
      <div class="legend-row"><span class="sw" style="background:color-mix(in srgb,var(--rail) 30%,transparent);border-radius:50%"></span>Draft transit zones around mapped LRT and MRT stations: TPZ within 400 m, TIZ 400–600 m</div>
      <p class="note small">Pins and rail alignments are approximate and inferred for orientation only. They are not cadastral or survey positions and must not be used to define site boundaries.</p>
     </div>
    </div>
   </div>
  </div>`;
}
function bindMap(root){
  root.querySelector('#map-site').onchange=e=>{MAP.sel=e.target.value;store.set('map',MAP);render()};
  root.querySelector('#map-focus').onchange=e=>{MAP.focus=e.target.checked;store.set('map',MAP);render()};
  root.querySelectorAll('.pin').forEach(p=>{const f=()=>{MAP.sel=p.dataset.id;store.set('map',MAP);render()};p.onclick=f;p.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f()}}});
  root.querySelectorAll('[data-layer]').forEach(c=>c.onchange=()=>{MAP[c.dataset.layer]=c.checked;store.set('map',MAP);render()});
}


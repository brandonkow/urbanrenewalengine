/* ---------- owner briefing packs ----------
   One- to two-page A4 briefings for owners, in three languages. Every number comes from the engine at
   run time: the site's base preset (not lab edits), the default deal assumptions and, for the DBKL 2026
   scenario, the guideline share as read (not as set in DBKL incentives). Payment figures appear only when
   the scenario pays every owner in full, and each payment option only when the project can fund it. */
const PACK_LANGS=[['en','English','en'],['ms','Bahasa Malaysia','ms'],['zh','简体中文','zh-Hans']];
const PACK_REVIEWED={ms:false,zh:false}; // set true once a native speaker has checked that translation
const PACK_SC=['base','g26'];
let PSEL=store.get('psel','taiping'), PLANG=store.get('plang','en'), PSC=store.get('psc','base'), PACKC=store.get('packc',{}), PKOPEN=false;
function packSites(){return MODELLED.filter(i=>SITE[i].owner)}
function packAsRead(id){return incB(id,incDefault(id))}
function packMaxRead(id){return incB(id,{...incDefault(id),residing:G26.residing,open:G26.openMax,tpz:G26.tpzMax})}
function packState(id,sc){
  const s=SITE[id]; if(!s||!s.owner) return null;
  const x=presetState(s,'base');
  if(sc==='g26'){x.sc='g26';x.prUp=packAsRead(id).share}
  return x;
}
function packBand(id,up){
  if(up===null||!isFinite(up)) return 'none';
  if(up<=1e-9) return 'base';
  const a=packAsRead(id), mx=packMaxRead(id);
  if(a&&up<=a.share+1e-9) return 'guide';
  if(mx&&up<=mx.share+1e-9) return 'more';
  if(up<=G26.cap+1e-9) return 'class';
  return 'cap';
}
function packData(id,sc){
  const s=SITE[id], x=packState(id,sc); if(!x) return null;
  const m=model(x), d={...DEAL_DEFAULT,...(DEAL_SITE[id]||{})}, D=dealCalc(x,m,d), o=x.owner;
  const ok={A:D.A.surplus>=0,B:D.B.surplus>=0&&D.B.fits,C:D.C.surplus>=0};
  return {s,x,m,d,D,o,sc,landed:o.mode==='landed',ready:m.own.coverage>=1,ok,g:sc==='g26'?packAsRead(id):null,L:leversFor(s,x)};
}

const PK_MON={en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],ms:['Jan','Feb','Mac','Apr','Mei','Jun','Jul','Ogo','Sep','Okt','Nov','Dis']};
const PK={
 en:{
  sf:'sf', psf:v=>`${v} per sf`, date:t=>`${t.getDate()} ${PK_MON.en[t.getMonth()]} ${t.getFullYear()}`,
  kicker:'Owner briefing', review:'Draft translation for native-speaker review',
  scen:{base:'Base case: no incentive',g26:'DBKL 2026 incentive, as we read the guideline'},
  made:(dt,sc,dc)=>`Figures calculated by the KL Urban Renewal Engine (build 5) on ${dt}. Scenario: ${sc}.${dc?` Includes a ${dc} development charge on the extra floor area.`:''}`,
  ref:n=>`PTKL2040 Specific Site ${n}`,
  h1:'What redevelopment could mean here',
  p1S:(nm,n)=>`${nm} is one of the sites the Kuala Lumpur Local Plan 2040 (PTKL2040) names for redevelopment (Specific Site ${n}). Redevelopment would mean replacing the existing buildings with a new residential project on the same land. It can only happen if every owner is paid fairly and agrees.`,
  p1L:(nm,n)=>`${nm} is one of the areas the Kuala Lumpur Local Plan 2040 (PTKL2040) names for redevelopment (Specific Site ${n}). Redevelopment would mean combining village lots into one site and building new homes on it. It can only happen if every lot owner is paid fairly and agrees.`,
  why:'<b>Why now:</b> in 2026 Kuala Lumpur City Hall (DBKL) published a guideline on incentives for redevelopment (in force 15 June 2026, amended 1 October 2026). It lets DBKL approve more floor area for schemes like this one. Every approval is at DBKL’s discretion, and none has been given for this site.',
  basisBase:pr=>`The figures below assume no incentive: today’s plot ratio of ${pr}.`,
  basisG26:(pr,sh,ep)=>`The figures below assume DBKL approves the incentive as we read the guideline: ${sh} more floor area (plot ratio ${pr} → ${ep}). DBKL has not decided, and may not.`,
  assumeS:(n,nr,nc)=>`They assume ${n} ownership interests (${nr} homes and ${nc} shops). The real number, from the strata title records, has not been checked yet; if there are more, these figures may not hold.`,
  assumeL:(lot,lp,ask)=>`They assume a typical lot of ${lot} sf worth about ${lp} per sf of land, based on ${ask?'current asking prices':'our own estimate'}. Lot values have not been verified.`,
  h2:'Three ways owners could be paid',
  dep:'These figures depend on DBKL approving the incentive. Without it, the project cannot pay them.',
  opt:{A:'Cash',B:'A new home',C:'A share of the new project'},
  optSub:{A:'Paid when the sale completes, before construction starts',B:'“Rumah Ganti”: a replacement home in the new project',C:'A joint venture: owners share the sales'},
  how:{A:'You are paid in full and move out.',B:'A new unit at completion, with a rent allowance until then.',C:e=>`Owners together receive ${e} of the project’s sales value at completion, with a rent allowance until then.`},
  grpR:'Per home (residential interest)', grpC:'Per shop (commercial interest)', grpL:lot=>`Per typical lot (${lot} sf)`,
  today:v=>`today’s estimated value ${v}`,
  rows:{val:'Value',up:'Above today’s value',home:'New home size',rent:'Rent allowance',when:'Timing'},
  atComp:'at completion',
  homeTxt:(a,p,b)=>`${a} sf, ${p} of today’s ${b} sf`,
  rentTxt:(r,y)=>`${r} a month for about ${y} years`,
  whenA:'When the sale completes', whenBC:y=>`About ${y} years of construction, after approvals`,
  notOff:'Not offered at these figures: the project cannot yet pay this option in full.',
  sizeNote:'New homes sell for more per square foot than older ones, so a new home of equal value is smaller.',
  nr:{title:'Not ready yet',
   body:'At today’s figures this project cannot yet pay every owner a fair price, so this briefing shows no payment figures. We will only put figures in front of owners when the numbers work. Any one of these changes could make it work:',
   asp:(f,t,p)=>`New homes here selling for about ${t} per sf instead of ${f} (${p} higher).`,
   hc:(f,t,p)=>`Building costs about ${p} lower (${t} per sf of floor area instead of ${f}).`,
   pr:(nd,cur,band)=>`More floor area: a plot ratio of about ${nd} instead of ${cur}. ${band}`,
   neg:(be,asp)=>`New homes here would need to sell for at least ${be} per sf, against about ${asp} today, before redevelopment even covers its own costs.`,
   noDen:'Building more floors would not help: at today’s prices each extra floor costs more to build than it sells for.',
   band:{base:'Today’s plot ratio would be enough.',guide:'That is within what DBKL’s guideline allows here, as we read it, but DBKL would have to approve it.',more:'That is more than our reading of the guideline gives this site; it would need extra components, such as surrendering public open space or a transit zone.',class:'That is more than the guideline allows for this kind of site.',cap:'That is beyond the 70% limit in DBKL’s guideline.',none:''},
   g26:'Even with the DBKL incentive as we read it, the figures do not work yet.',base:'This scenario assumes no incentive from DBKL.'},
  rights:{h:'Your rights',items:['Under current law, every owner must agree. Nothing happens unless you sign, and no one can make you sell.','A bill that would have let a majority of owners (75–80%) decide for everyone was withdrawn in January 2026. It is not law.','Take your own legal and valuation advice before signing anything.']},
  steps:{h:'The main steps and a rough timeline',list:y=>[['Briefings and questions','Now, over a few months'],['Owners choose a committee, a lawyer and a valuer','About 3–6 months'],['Every owner signs an agreement','Nothing proceeds until all have signed'],['DBKL planning approval: public objections (Kaedah 3), technical studies, JKPS (DBKL’s one-stop approval committee) and the Mayor','About 1–2 years'],['Owners move out; demolition and construction',`About ${y} years`],['Completion: new homes handed over and project shares paid','']],note:'A rough guide only; real timings vary.'},
  faq:{h:'Common questions',list:[
   ['Will I pay tax?','Selling, or swapping your home for a new one, can count as a disposal for Real Property Gains Tax (RPGT). Owners who have held their property for many years often pay little or none, but get advice on your own case before signing.'],
   ['Where would I live during construction?','With a new home or a project share, you would receive a monthly rent allowance from when you move out until completion. With cash, you are paid before you move out, so you can buy or rent elsewhere.'],
   ['What about elderly owners?','Family members are welcome at every meeting, documents can be explained in your preferred language, and an owner who cannot attend can appoint someone they trust under a power of attorney. Cash may suit owners who do not want to wait for completion.'],
   ['What if some owners say no?','Then, under current law, the project does not go ahead. There is no penalty for saying no.']]},
  contact:{h:'Contact',name:'Name and role',phone:'Phone',email:'Email',meet:'Next briefing (date, time and place)'},
  disc:{h:'Please note.',body:'This briefing is an indicative illustration for discussion. It is not a valuation, an offer to buy, or legal or financial advice. Every figure is an estimate from a screening model and will change as information is checked. Take independent advice before signing anything.'},
  legend:'Labels show where each figure comes from: “Model estimate” is calculated by our model; “Assumption” is our working assumption; “Past sale” and “Asking price” are market evidence; “Official plan” is from PTKL2040.',
  src:{MODEL_OUTPUT:'Model estimate',UNDERWRITING_ASSUMPTION:'Assumption',TRANSACTION:'Past sale',ASKING_LISTING:'Asking price',INFERRED:'Our estimate',OFFICIAL_PLANNING:'Official plan',PUBLIC_MAP:'Map estimate'}
 },
 ms:{
  sf:'kaki persegi', psf:v=>`${v} sekaki persegi`, date:t=>`${t.getDate()} ${PK_MON.ms[t.getMonth()]} ${t.getFullYear()}`,
  kicker:'Taklimat untuk pemilik', review:'Draf terjemahan untuk semakan penutur asli',
  scen:{base:'Kes asas: tanpa insentif',g26:'Insentif DBKL 2026, mengikut tafsiran kami terhadap garis panduan'},
  made:(dt,sc,dc)=>`Angka dikira oleh KL Urban Renewal Engine (binaan 5) pada ${dt}. Senario: ${sc}.${dc?` Termasuk caj pemajuan ${dc} ke atas keluasan lantai tambahan.`:''}`,
  ref:n=>`Tapak Khusus ${n} PTKL2040`,
  h1:'Apakah maksud pembangunan semula di sini',
  p1S:(nm,n)=>`${nm} ialah salah satu tapak yang dinamakan dalam Pelan Tempatan Kuala Lumpur 2040 (PTKL2040) untuk pembangunan semula (Tapak Khusus ${n}). Pembangunan semula bermaksud bangunan sedia ada digantikan dengan projek kediaman baharu di atas tanah yang sama. Ia hanya boleh berlaku jika setiap pemilik dibayar dengan adil dan bersetuju.`,
  p1L:(nm,n)=>`${nm} ialah salah satu kawasan yang dinamakan dalam Pelan Tempatan Kuala Lumpur 2040 (PTKL2040) untuk pembangunan semula (Tapak Khusus ${n}). Pembangunan semula bermaksud lot-lot kampung digabungkan menjadi satu tapak dan rumah baharu dibina di atasnya. Ia hanya boleh berlaku jika setiap pemilik lot dibayar dengan adil dan bersetuju.`,
  why:'<b>Mengapa sekarang:</b> pada tahun 2026, Dewan Bandaraya Kuala Lumpur (DBKL) menerbitkan garis panduan insentif untuk pembangunan semula (berkuat kuasa 15 Jun 2026, dipinda 1 Oktober 2026). Garis panduan ini membolehkan DBKL meluluskan keluasan lantai tambahan bagi skim seperti ini. Setiap kelulusan tertakluk kepada budi bicara DBKL, dan belum ada kelulusan untuk tapak ini.',
  basisBase:pr=>`Angka di bawah menganggap tiada insentif: nisbah plot semasa ${pr}.`,
  basisG26:(pr,sh,ep)=>`Angka di bawah menganggap DBKL meluluskan insentif mengikut tafsiran kami terhadap garis panduan: keluasan lantai ${sh} lebih (nisbah plot ${pr} → ${ep}). DBKL belum membuat keputusan, dan mungkin tidak meluluskannya.`,
  assumeS:(n,nr,nc)=>`Angka ini menganggap ${n} kepentingan pemilikan (${nr} kediaman dan ${nc} kedai). Bilangan sebenar daripada rekod hakmilik strata belum disemak; jika bilangannya lebih, angka ini mungkin tidak lagi tepat.`,
  assumeL:(lot,lp,ask)=>`Angka ini menganggap lot biasa seluas ${lot} kaki persegi bernilai kira-kira ${lp} sekaki persegi tanah, berdasarkan ${ask?'harga tawaran semasa':'anggaran kami sendiri'}. Nilai lot belum disahkan.`,
  h2:'Tiga cara pemilik boleh dibayar',
  dep:'Angka ini bergantung pada kelulusan insentif oleh DBKL. Tanpanya, projek tidak mampu membayarnya.',
  opt:{A:'Tunai',B:'Rumah baharu',C:'Bahagian dalam projek baharu'},
  optSub:{A:'Dibayar apabila jualan selesai, sebelum pembinaan bermula',B:'“Rumah Ganti”: rumah gantian untuk pemilik asal dalam projek baharu',C:'Usaha sama: pemilik berkongsi hasil jualan'},
  how:{A:'Anda dibayar sepenuhnya dan berpindah keluar.',B:'Unit baharu apabila projek siap, dengan elaun sewa sehingga itu.',C:e=>`Pemilik bersama-sama menerima ${e} daripada nilai jualan projek apabila projek siap, dengan elaun sewa sehingga itu.`},
  grpR:'Bagi setiap rumah (kepentingan kediaman)', grpC:'Bagi setiap kedai (kepentingan komersial)', grpL:lot=>`Bagi setiap lot biasa (${lot} kaki persegi)`,
  today:v=>`anggaran nilai semasa ${v}`,
  rows:{val:'Nilai',up:'Melebihi nilai semasa',home:'Saiz rumah baharu',rent:'Elaun sewa',when:'Masa'},
  atComp:'apabila projek siap',
  homeTxt:(a,p,b)=>`${a} kaki persegi, ${p} daripada ${b} kaki persegi sekarang`,
  rentTxt:(r,y)=>`${r} sebulan selama kira-kira ${y} tahun`,
  whenA:'Apabila jualan selesai', whenBC:y=>`Kira-kira ${y} tahun pembinaan, selepas kelulusan`,
  notOff:'Tidak ditawarkan pada angka ini: projek belum mampu membayar pilihan ini sepenuhnya.',
  sizeNote:'Rumah baharu dijual pada harga sekaki persegi yang lebih tinggi daripada rumah lama, jadi rumah baharu yang sama nilainya adalah lebih kecil.',
  nr:{title:'Belum sedia',
   body:'Pada angka semasa, projek ini belum mampu membayar harga yang adil kepada setiap pemilik, jadi taklimat ini tidak menunjukkan sebarang angka bayaran. Kami hanya akan membentangkan angka kepada pemilik apabila angkanya munasabah. Mana-mana satu perubahan ini boleh menjadikannya berdaya maju:',
   asp:(f,t,p)=>`Rumah baharu di sini dijual pada kira-kira ${t} sekaki persegi, bukan ${f} (${p} lebih tinggi).`,
   hc:(f,t,p)=>`Kos pembinaan kira-kira ${p} lebih rendah (${t} sekaki persegi keluasan lantai, bukan ${f}).`,
   pr:(nd,cur,band)=>`Keluasan lantai yang lebih besar: nisbah plot kira-kira ${nd}, bukan ${cur}. ${band}`,
   neg:(be,asp)=>`Rumah baharu di sini perlu dijual sekurang-kurangnya ${be} sekaki persegi, berbanding kira-kira ${asp} sekarang, sebelum pembangunan semula dapat menampung kosnya sendiri.`,
   noDen:'Menambah tingkat tidak membantu: pada harga semasa, kos membina setiap tingkat tambahan lebih tinggi daripada nilai jualannya.',
   band:{base:'Nisbah plot semasa sudah memadai.',guide:'Ini dalam had yang dibenarkan garis panduan DBKL untuk tapak ini, mengikut tafsiran kami, tetapi DBKL perlu meluluskannya.',more:'Ini melebihi tafsiran kami bagi tapak ini; ia memerlukan komponen tambahan seperti penyerahan kawasan lapang awam atau zon transit.',class:'Ini melebihi had garis panduan bagi jenis tapak ini.',cap:'Ini melebihi had 70% dalam garis panduan DBKL.',none:''},
   g26:'Walaupun dengan insentif DBKL mengikut tafsiran kami, angkanya belum mencukupi.',base:'Senario ini menganggap tiada insentif daripada DBKL.'},
  rights:{h:'Hak anda',items:['Di bawah undang-undang semasa, setiap pemilik mesti bersetuju. Tiada apa-apa berlaku tanpa tandatangan anda, dan tiada sesiapa boleh memaksa anda menjual.','Rang undang-undang yang akan membenarkan majoriti pemilik (75–80%) membuat keputusan bagi semua telah ditarik balik pada Januari 2026. Ia bukan undang-undang.','Dapatkan nasihat guaman dan penilaian anda sendiri sebelum menandatangani apa-apa.']},
  steps:{h:'Langkah utama dan anggaran masa',list:y=>[['Taklimat dan sesi soal jawab','Sekarang, dalam beberapa bulan'],['Pemilik memilih jawatankuasa, peguam dan penilai','Kira-kira 3–6 bulan'],['Setiap pemilik menandatangani perjanjian','Tiada apa-apa diteruskan sehingga semua menandatangani'],['Kelulusan perancangan DBKL: bantahan awam (Kaedah 3), kajian teknikal, JKPS (Jawatankuasa Pusat Setempat) dan Datuk Bandar','Kira-kira 1–2 tahun'],['Pemilik berpindah; perobohan dan pembinaan',`Kira-kira ${y} tahun`],['Projek siap: rumah baharu diserahkan dan bahagian projek dibayar','']],note:'Panduan kasar sahaja; masa sebenar mungkin berbeza.'},
  faq:{h:'Soalan lazim',list:[
   ['Adakah saya perlu membayar cukai?','Menjual, atau menukar rumah anda dengan rumah baharu, boleh dikira sebagai pelupusan bagi Cukai Keuntungan Harta Tanah (CKHT). Pemilik yang telah memegang hartanah mereka bertahun-tahun lazimnya membayar sedikit atau tiada cukai, tetapi dapatkan nasihat tentang kes anda sendiri sebelum menandatangani.'],
   ['Di mana saya akan tinggal semasa pembinaan?','Jika memilih rumah baharu atau bahagian projek, anda akan menerima elaun sewa bulanan dari tarikh berpindah sehingga projek siap. Jika memilih tunai, anda dibayar sebelum berpindah, jadi anda boleh membeli atau menyewa di tempat lain.'],
   ['Bagaimana dengan pemilik warga emas?','Ahli keluarga dialu-alukan ke setiap mesyuarat, dokumen boleh diterangkan dalam bahasa pilihan anda, dan pemilik yang tidak dapat hadir boleh melantik orang yang dipercayai melalui surat kuasa wakil. Pilihan tunai mungkin sesuai bagi pemilik yang tidak mahu menunggu projek siap.'],
   ['Bagaimana jika sebahagian pemilik tidak bersetuju?','Di bawah undang-undang semasa, projek tidak akan diteruskan. Tiada penalti jika anda tidak bersetuju.']]},
  contact:{h:'Hubungi',name:'Nama dan jawatan',phone:'Telefon',email:'E-mel',meet:'Taklimat seterusnya (tarikh, masa dan tempat)'},
  disc:{h:'Sila ambil perhatian:',body:'Taklimat ini ialah ilustrasi indikatif untuk tujuan perbincangan. Ia bukan penilaian, tawaran untuk membeli, atau nasihat guaman atau kewangan. Setiap angka ialah anggaran daripada model saringan dan akan berubah apabila maklumat disemak. Dapatkan nasihat bebas sebelum menandatangani apa-apa.'},
  legend:'Label menunjukkan sumber setiap angka: “Anggaran model” dikira oleh model kami; “Andaian” ialah andaian kerja kami; “Transaksi lepas” dan “Harga tawaran” ialah bukti pasaran; “Pelan rasmi” daripada PTKL2040.',
  src:{MODEL_OUTPUT:'Anggaran model',UNDERWRITING_ASSUMPTION:'Andaian',TRANSACTION:'Transaksi lepas',ASKING_LISTING:'Harga tawaran',INFERRED:'Anggaran kami',OFFICIAL_PLANNING:'Pelan rasmi',PUBLIC_MAP:'Anggaran peta'}
 },
 zh:{
  sf:'平方尺', psf:v=>`每平方尺${v}`, date:t=>`${t.getFullYear()}年${t.getMonth()+1}月${t.getDate()}日`,
  kicker:'业主简报', review:'译稿，待母语人士审阅',
  scen:{base:'基本情境：没有奖励',g26:'市政局2026年奖励（按我们对指南的解读）'},
  made:(dt,sc,dc)=>`数字由吉隆坡城市更新引擎（KL Urban Renewal Engine，第5版）于${dt}计算。情境：${sc}。${dc?`已计入额外楼面面积的${dc}发展费。`:''}`,
  ref:n=>`PTKL2040特定地段${n}`,
  h1:'重建对这里意味着什么',
  p1S:(nm,n)=>`${nm}是《2040年吉隆坡地方图》（PTKL2040）列明的重建地段之一（特定地段${n}）。重建是指拆除现有建筑，在同一块土地上兴建新的住宅项目。只有在每一位业主都获得公平补偿并同意的情况下，重建才能进行。`,
  p1L:(nm,n)=>`${nm}是《2040年吉隆坡地方图》（PTKL2040）列明的重建地区之一（特定地段${n}）。重建是指把村里的地段合并成一块土地，再在上面兴建新住宅。只有在每一位地段业主都获得公平补偿并同意的情况下，重建才能进行。`,
  why:'<b>为什么是现在：</b>吉隆坡市政局（DBKL）于2026年发布了重建奖励指南（2026年6月15日生效，2026年10月1日修订），允许市政局为这类计划批准额外的楼面面积。每一项批准都由市政局酌情决定，而这个地段至今尚未获得任何批准。',
  basisBase:pr=>`以下数字假设没有任何奖励，即沿用目前${pr}的容积率。`,
  basisG26:(pr,sh,ep)=>`以下数字假设市政局按我们对指南的解读批准奖励：楼面面积增加${sh}（容积率由${pr}增至${ep}）。市政局尚未作出决定，也可能不批准。`,
  assumeS:(n,nr,nc)=>`这些数字假设共有${n}个产权单位（${nr}个住宅、${nc}个店铺）。实际数目须以分层地契记录为准，目前尚未核实；如果单位更多，这些数字可能不再成立。`,
  assumeL:(lot,lp,ask)=>`这些数字假设一块标准地段面积为${lot}平方尺，土地价值约每平方尺${lp}，依据是${ask?'目前的挂牌价':'我们自己的估算'}。地段价值尚未核实。`,
  h2:'业主获得补偿的三种方式',
  dep:'这些数字取决于市政局是否批准奖励。若没有奖励，项目无法支付这些金额。',
  opt:{A:'现金',B:'新屋',C:'分享新项目的收益'},
  optSub:{A:'买卖完成时支付，在动工之前',B:'“Rumah Ganti”：在新项目中为原业主提供的置换屋',C:'联营方式：业主分享销售收益'},
  how:{A:'您获得全额付款后搬出。',B:'项目竣工时获得一个新单位，期间提供租金津贴。',C:e=>`全体业主在项目竣工时共同获得项目销售总值的${e}，期间提供租金津贴。`},
  grpR:'每个住宅单位（住宅产权）', grpC:'每个店铺单位（商业产权）', grpL:lot=>`每块标准地段（${lot}平方尺）`,
  today:v=>`目前估值${v}`,
  rows:{val:'补偿价值',up:'比目前估值高',home:'新屋面积',rent:'租金津贴',when:'时间'},
  atComp:'竣工时',
  homeTxt:(a,p,b)=>`${a}平方尺，相当于目前${b}平方尺的${p}`,
  rentTxt:(r,y)=>`每月${r}，为期约${y}年`,
  whenA:'买卖完成时', whenBC:y=>`获批后约${y}年的建筑期`,
  notOff:'按目前的数字不提供此方案：项目尚无法全额支付此方案。',
  sizeNote:'新屋每平方尺的售价高于旧屋，因此同等价值的新屋面积会较小。',
  nr:{title:'尚未成熟',
   body:'按目前的数字，这个项目还无法向每一位业主支付公平的价格，因此本简报不列出任何补偿金额。只有在数字可行时，我们才会向业主提出具体金额。以下任何一项改变都可能使项目可行：',
   asp:(f,t,p)=>`这里的新屋售价约每平方尺${t}，而不是${f}（高出${p}）。`,
   hc:(f,t,p)=>`建筑成本降低约${p}（每平方尺楼面${t}，而不是${f}）。`,
   pr:(nd,cur,band)=>`更多楼面面积：容积率约${nd}，而不是${cur}。${band}`,
   neg:(be,asp)=>`这里的新屋售价至少要达到每平方尺${be}（目前约${asp}），重建才能收回自身成本。`,
   noDen:'加建楼层也无济于事：按目前价格，每多建一层的成本都高于它的售价。',
   band:{base:'目前的容积率已经足够。',guide:'按我们的解读，这在市政局指南允许的范围内，但仍须市政局批准。',more:'这超出了我们对该地段的解读，需要额外条件，例如交出公共休憩空间或位于交通区。',class:'这超出了指南对这类地段的上限。',cap:'这超出了市政局指南70%的上限。',none:''},
   g26:'即使按我们的解读获得市政局奖励，数字仍然不足。',base:'此情境假设市政局不给予任何奖励。'},
  rights:{h:'您的权利',items:['根据现行法律，必须每一位业主都同意。没有您的签名，什么都不会发生，也没有人能强迫您出售。','一项原本允许多数业主（75%至80%）替全体作决定的法案，已于2026年1月撤回，并非现行法律。','签署任何文件之前，请先寻求您自己的法律和估价意见。']},
  steps:{h:'主要步骤和大约时间',list:y=>[['说明会和问答','现在起，为期数个月'],['业主推选委员会，并委任律师和估价师','约3至6个月'],['每一位业主签署协议','全体签署之前不会进行下一步'],['市政局规划批准：公众异议程序（Kaedah 3）、技术研究、JKPS（一站式中心委员会）及市长批准','约1至2年'],['业主搬出；拆除及建筑',`约${y}年`],['竣工：交付新屋，并支付项目分成','']],note:'仅供粗略参考，实际时间可能不同。'},
  faq:{h:'常见问题',list:[
   ['我需要缴税吗？','出售房屋，或以旧屋换新屋，都可能被视为产业脱售而须缴付产业盈利税（RPGT）。持有产业多年的业主通常只需缴付很少的税或无需缴税，但签署前请先就您的个人情况咨询专业意见。'],
   ['建筑期间我住在哪里？','若选择新屋或项目分成，您从搬出之日起至竣工，每月可获得租金津贴。若选择现金，您会在搬出前获得付款，可以在别处购屋或租屋。'],
   ['年长业主怎么办？','欢迎家人陪同出席每一次会议，文件可以用您习惯的语言解释；无法出席的业主可通过授权书委托信任的人代为处理。不想等到竣工的业主，可以考虑现金方案。'],
   ['如果有业主不同意怎么办？','根据现行法律，项目将不会进行。不同意不会受到任何惩罚。']]},
  contact:{h:'联系方式',name:'姓名及职位',phone:'电话',email:'电邮',meet:'下一场说明会（日期、时间和地点）'},
  disc:{h:'请注意：',body:'本简报仅为供讨论的示意说明，并非估价、收购要约，也不构成法律或财务建议。所有数字均为筛选模型的估算，会随着资料核实而改变。签署任何文件之前，请先寻求独立意见。'},
  legend:'标签显示每个数字的来源：“模型估算”由我们的模型计算；“假设”是我们的工作假设；“过往成交”和“挂牌价”是市场证据；“官方规划”来自PTKL2040。',
  src:{MODEL_OUTPUT:'模型估算',UNDERWRITING_ASSUMPTION:'假设',TRANSACTION:'过往成交',ASKING_LISTING:'挂牌价',INFERRED:'我们的估算',OFFICIAL_PLANNING:'官方规划',PUBLIC_MAP:'地图估算'}
 }
};

/* formats a figure the way the pack prints it; tests re-check every [data-fig] against the engine */
const PK_F={rm:fmtRM,pct:v=>fmtPct(v,0),pct1:v=>fmtPct(v,1),spct:v=>(v>=0?'+':'−')+Math.abs(v*100).toFixed(0)+'%',sf:fmt0,x2:fmt2,int:fmt0,yrs:v=>Number.isInteger(v)?String(v):fmt1(v)};
function packHTML(id,lang,sc){
  const P=packData(id,sc), T=PK[lang]||PK.en; if(!P) return '';
  const {s,x,m,d,D,o,landed,ready,ok,g,L}=P, hl=(PACK_LANGS.find(l=>l[0]===lang)||PACK_LANGS[0])[2];
  const tag=src=>{const t=SRC[src]||SRC.INFERRED;return `<span class="src ${t.t==='edit'?'edit':'t'+t.t}">${esc(T.src[src]||t.l)}</span>`};
  const fig=(k,v,f,src,kind='pay',noTag)=>`<span class="pk-fig" data-fig="${k}" data-kind="${kind}" data-v="${v}" data-f="${f}" data-src="${src}">${PK_F[f](v)}</span>${noTag?'':tag(src)}`;
  const n=(/Specific Site (\d+)/.exec(s.ref||'')||[])[1]||'';
  const dc=dcRate(x), y=fig('years',d.T,'yrs','UNDERWRITING_ASSUMPTION','info',true);
  const epr=m.epr;
  const basis=sc==='g26'?T.basisG26(fig('basePR',x.pr,'x2',s.prType,'info',true),fig('share',x.prUp,'pct','INFERRED','info',true),fig('effPR',epr,'x2','MODEL_OUTPUT','info',true)):T.basisBase(fig('basePR',x.pr,'x2',s.prType,'info',true));
  const nr=o.n*(1-o.cs), nc=o.n*o.cs;
  const assume=landed?T.assumeL(fig('lot',o.lot,'sf',(s.ownerSrc||{}).lot||'INFERRED','info',true),fig('lpsf',o.lpsf,'rm',(s.ownerSrc||{}).lpsf||'INFERRED','info',true),((s.ownerSrc||{}).lpsf)==='ASKING_LISTING')
    :T.assumeS(fig('n',o.n,'int','UNDERWRITING_ASSUMPTION','info',true),fmt0(nr),fmt0(nc));
  let pay='';
  if(ready){
    const groups=landed?[{k:'R',h:T.grpL(fmt0(o.lot)),today:o.res,todaySrc:(s.ownerSrc||{}).lpsf||'INFERRED',home:d.oldRes,homeSrc:'UNDERWRITING_ASSUMPTION',rent:d.resRent,rentSrc:'UNDERWRITING_ASSUMPTION'}]
      :[{k:'R',h:T.grpR,today:o.res,todaySrc:'TRANSACTION',home:d.oldRes,homeSrc:'ASKING_LISTING',rent:d.resRent,rentSrc:'UNDERWRITING_ASSUMPTION'}].concat(o.com&&o.cs>0?[{k:'C',h:T.grpC,today:o.com,todaySrc:'MODEL_OUTPUT',home:d.oldCom,homeSrc:'ASKING_LISTING',rent:d.comRent,rentSrc:'ASKING_LISTING'}]:[]);
    const keys=['A','B','C'], cell=(K,html)=>ok[K]?`<td>${html}</td>`:'<td class="off">–</td>';
    const how=keys.map(K=>ok[K]?`<td class="how">${K==='C'?T.how.C(fig('jvShare',D.C.e,'pct1','MODEL_OUTPUT')):T.how[K]}</td>`:`<td class="off" data-note="notoffered-${K}">${T.notOff}</td>`).join('');
    const body=groups.map(G=>{
      const R=G.k, per={A:D.A['per'+R],B:D.B['per'+R],C:D.C['per'+R]}, up={A:D.A['up'+R],B:D.B['up'+R],C:D.C['up'+R]};
      const area=R==='R'?D.B.aR:D.B.aC, ratio=R==='R'?D.B.ratioR:D.B.ratioC;
      return `<tr class="grp"><td colspan="4">${G.h} <span>· ${T.today(fig('today'+R,G.today,'rm',G.todaySrc))}</span></td></tr>
       <tr><td>${T.rows.val}</td>${keys.map(K=>cell(K,`${fig('val'+K+R,per[K],'rm','MODEL_OUTPUT')}${K==='A'?'':`<span class="pk-sub">${T.atComp}</span>`}`)).join('')}</tr>
       <tr><td>${T.rows.up}</td>${keys.map(K=>cell(K,fig('up'+K+R,up[K],'spct','MODEL_OUTPUT',undefined,true))).join('')}</tr>
       ${!ok.B?'':`<tr><td>${T.rows.home}</td><td class="off">–</td>${cell('B',T.homeTxt(fig('area'+R,area,'sf','MODEL_OUTPUT',undefined,true),fig('ratio'+R,ratio,'pct','MODEL_OUTPUT',undefined,true),fig('home'+R,G.home,'sf',G.homeSrc,undefined,true))+tag('MODEL_OUTPUT'))}<td class="off">–</td></tr>`}
       ${!ok.B&&!ok.C?'':`<tr><td>${T.rows.rent}</td><td class="off">–</td>${['B','C'].map(K=>cell(K,T.rentTxt(fig('rent'+K+R,G.rent,'rm',G.rentSrc,undefined,true),y)+tag(G.rentSrc))).join('')}</tr>`}`;
    }).join('');
    pay=`${g?`<p class="pk-dep" data-note="g26">${T.dep}</p>`:''}
     <div class="pk-tw"><table class="pk-t"><thead><tr><th></th>${keys.map((K,i)=>`<th>${i+1}. ${T.opt[K]}<small>${T.optSub[K]}</small></th>`).join('')}</tr></thead>
      <tbody><tr><td></td>${how}</tr>${body}
       <tr><td>${T.rows.when}</td>${cell('A',T.whenA)}${['B','C'].map(K=>cell(K,T.whenBC(y))).join('')}</tr></tbody></table></div>
     ${ok.B&&Math.min(D.B.ratioR,o.com?D.B.ratioC:1)<1?`<p class="small" style="margin-top:6px">${T.sizeNote}</p>`:''}`;
  } else {
    const it=[];
    if(m.per<=0){
      it.push(T.nr.neg(fig('lev_be',m.be,'rm','MODEL_OUTPUT','lever',true),fig('lev_asp',x.asp,'rm','UNDERWRITING_ASSUMPTION','lever',true)));
      it.push(T.nr.noDen);
    } else {
      const a=L.items.find(i=>i.k==='asp'), h=L.items.find(i=>i.k==='hc');
      if(a&&isFinite(a.v)) it.push(T.nr.asp(fig('lev_asp',x.asp,'rm','UNDERWRITING_ASSUMPTION','lever',true),fig('lev_aspTo',a.target,'rm','MODEL_OUTPUT','lever',true),fig('lev_aspPct',a.v,'pct1','MODEL_OUTPUT','lever',true)));
      if(h&&!h.floor&&isFinite(h.v)) it.push(T.nr.hc(fig('lev_hc',x.hc,'rm','UNDERWRITING_ASSUMPTION','lever',true),fig('lev_hcTo',h.target,'rm','MODEL_OUTPUT','lever',true),fig('lev_hcPct',-h.v,'pct1','MODEL_OUTPUT','lever',true)));
      if(isFinite(L.prNeed)) it.push(T.nr.pr(fig('lev_pr',L.prNeed,'x2','MODEL_OUTPUT','lever',true),fig('lev_prCur',epr,'x2','MODEL_OUTPUT','lever',true),T.nr.band[packBand(id,L.prUp)]));
      else it.push(T.nr.noDen);
    }
    pay=`<div class="pk-nr pk-keep" data-note="notready"><h3>${T.nr.title}</h3><p>${T.nr.body}</p><ul>${it.map(t=>`<li>${t}</li>`).join('')}</ul><p class="small" style="margin:6px 0 0">${sc==='g26'?T.nr.g26:T.nr.base}</p></div>`;
  }
  const cv=k=>PACKC[k]?esc(PACKC[k]):`<span class="ph">[${T.contact[k]}]</span>`;
  const stamp=lang!=='en'&&!PACK_REVIEWED[lang]?`<div class="pk-stamp" data-note="review">${T.review} · for native-speaker review</div>`:'';
  return `<article class="pack" lang="${hl}" data-site="${id}" data-lang="${lang}" data-sc="${sc}" data-ready="${ready}">
   <header class="pk-head"><div><div class="pk-kick">${T.kicker}</div><div class="pk-title">${esc(s.name)}</div><div class="pk-place">${esc(s.place)} · ${T.ref(n)}</div></div>
    <div class="pk-scen"><b>${T.scen[sc]}</b>${stamp?'<br>'+stamp:''}</div></header>
   <p class="pk-made">${T.made(T.date(new Date()),T.scen[sc],dc>0?fmtPct(dc,0):'')}</p>
   <section class="pk-keep"><h2>${T.h1}</h2><p>${(landed?T.p1L:T.p1S)(esc(s.name),n)}</p><p>${T.why}</p></section>
   <section><h2>${T.h2}</h2><div class="pk-basis pk-keep"><p>${basis}</p>${ready?`<p>${assume}</p>`:''}</div>${pay}</section>
   <section class="pk-keep"><h2>${T.rights.h}</h2><div class="pk-cols"><ul class="pk-rights">${T.rights.items.map(t=>`<li>${t}</li>`).join('')}</ul>
    <div><h3 style="margin-top:0">${T.steps.h}</h3><ol class="pk-steps">${T.steps.list(y).map(([a,b])=>`<li><span>${a}</span><span>${b}</span></li>`).join('')}</ol><p class="small muted" style="margin:0">${T.steps.note}</p></div></div></section>
   <section><h2>${T.faq.h}</h2><dl class="pk-faq">${T.faq.list.map(([q,a])=>`<div><dt>${q}</dt><dd>${a}</dd></div>`).join('')}</dl></section>
   <section class="pk-keep"><h2>${T.contact.h}</h2><div class="pk-contactbox">${['name','phone','email','meet'].map(k=>`<div>${cv(k)}</div>`).join('')}</div></section>
   <footer class="pk-disc pk-keep"><b>${T.disc.h}</b> ${T.disc.body}<div class="pk-legend">${T.legend}</div></footer>
  </article>`;
}
function viewPack(id,lang,sc){
  const list=packSites();
  const sid=list.includes(id)?id:(list.includes(PSEL)?PSEL:list[0]);
  const lg=PK[lang]?lang:(PK[PLANG]?PLANG:'en'), sk=PACK_SC.includes(sc)?sc:(PACK_SC.includes(PSC)?PSC:'base');
  PSEL=sid;PLANG=lg;PSC=sk;store.set('psel',sid);store.set('plang',lg);store.set('psc',sk);
  const P=packData(sid,sk), cov=P.m.own.coverage, offered=['A','B','C'].filter(K=>P.ok[K]).length;
  const status=P.ready?`<p class="note info small pk-status">Ready to share in this scenario: the residual covers ${fmtPct(cov,0)} of the owner budget. ${offered<3?`${3-offered} of the three payment options cannot be funded at these figures, so the pack marks ${offered===2?'it':'them'} “not offered”.`:'All three payment options can be funded.'} ${sk==='g26'?'Figures depend on DBKL approving the incentive, and the pack says so.':''}</p>`
    :`<p class="note bad small pk-status">Not ready: the residual covers ${fmtPct(Math.max(0,cov),0)} of the owner budget, below 100%, so the pack shows no payment figures and lists what would have to change instead.</p>`;
  const seg=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button type="button" ${attr}="${v}" aria-pressed="${v===cur}">${esc(l)}</button>`).join('')}</div>`;
  return `<div class="page">
   <div class="no-print">${head('Owner briefing packs','One- to two-page A4 briefings for owners. Numbers come from the engine at run time: the base preset (not your lab edits), default deal assumptions and the guideline as read. Payment figures appear only when the scenario pays every owner in full.')}
    <div class="pk-bar">
     <div class="grp">${siteSelect(sid,list.map(i=>SITE[i]),'packSel')}</div>
     <div class="grp"><span>Language</span>${seg('data-pl',PACK_LANGS.map(l=>[l[0],l[1]]),lg)}</div>
     <div class="grp"><span>Scenario</span>${seg('data-ps',[['base','Base case'],['g26','DBKL 2026 as read']],sk)}</div>
     <div class="grp"><span>&nbsp;</span><button type="button" class="btn" id="packPrint">Print or save as PDF</button></div>
    </div>
    ${status}
    <details class="pk-contact" id="packContact" ${PKOPEN?'open':''}><summary>Contact details printed on the pack ${Object.values(PACKC).some(Boolean)?'(filled in)':'(placeholders)'}</summary>
     <div class="row">${['name','phone','email','meet'].map(k=>`<label>${PK.en.contact[k]}<input type="text" data-pc="${k}" value="${esc(PACKC[k]||'')}" autocomplete="off"></label>`).join('')}</div>
     <p class="small muted" style="margin:6px 0 0">Your own contact details only, saved in this browser. Never put owners’ names or contact details in a pack. <code>npm run packs</code> exports every site, language and scenario to PDF.</p>
    </details>
   </div>
   ${packHTML(sid,lg,sk)}
  </div>`;
}
function bindPack(root){
  const sel=root.querySelector('#packSel'); if(sel) sel.onchange=()=>go(`#/pack/${sel.value}/${PLANG}/${PSC}`);
  root.querySelectorAll('[data-pl]').forEach(b=>b.onclick=()=>go(`#/pack/${PSEL}/${b.dataset.pl}/${PSC}`));
  root.querySelectorAll('[data-ps]').forEach(b=>b.onclick=()=>go(`#/pack/${PSEL}/${PLANG}/${b.dataset.ps}`));
  root.querySelector('#packPrint').onclick=()=>window.print();
  const cd=root.querySelector('#packContact'); cd.ontoggle=()=>{PKOPEN=cd.open};
  // redraw only the sheet: a full render here would replace the input while it is losing focus
  root.querySelectorAll('[data-pc]').forEach(inp=>inp.onchange=()=>{PACKC={...PACKC,[inp.dataset.pc]:inp.value.trim()};store.set('packc',PACKC);const a=root.querySelector('.pack');if(a)a.outerHTML=packHTML(PSEL,PLANG,PSC)});
}


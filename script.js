/* ═══════════════ API ═══════════════ */
var API_BASE = '';

function apiToken() { return localStorage.getItem('gp5_apiToken') || ''; }

function apiHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': 'Token ' + apiToken() };
}

function apiFetch(method, path, body, callback) {
  var opts = { method: method, headers: apiHeaders() };
  if (body) opts.body = JSON.stringify(body);
  fetch(API_BASE + path, opts)
    .then(function(r) { return r.json(); })
    .then(callback || function(){})
    .catch(function(e) { console.warn('API error', path, e); if(callback) callback({ok:false}); });
}

/* ═══════════════ DATA ═══════════════ */
var EQUIP_TAGS=['bar','dumbbell','pulley','accessory'];
var GYM_NAMES={arkady:'Arkády',pankrac:'Pankrác',chodov:'Chodov'};
var GYM_COLORS={arkady:'#E6F1FB',pankrac:'#EAF3DE',chodov:'#FAEEDA'};
var GYM_TEXT={arkady:'#185FA5',pankrac:'#3B6D11',chodov:'#854F0B'};

var LIBRARY=[
  {name:'Bench Press',tag:'bar'},{name:'Deadlift',tag:'bar'},
  {name:'Lat Pulldown',tag:'pulley'},{name:'Leg Press',tag:'accessory'},
  {name:'Shoulder Press',tag:'bar'},{name:'Chest / Pec Press',tag:'accessory'},
  {name:'Squat / Hack Squat',tag:'bar'},{name:'Incline Bench Press',tag:'bar'},
  {name:'Decline Press',tag:'bar'},{name:'Pec Fly',tag:'accessory'},
  {name:'Seated / Low Row',tag:'pulley'},{name:'Leg Extension',tag:'accessory'},
  {name:'Leg Curl',tag:'accessory'},{name:'Lateral Raise',tag:'dumbbell'},
  {name:'Calves',tag:'accessory'},{name:'Biceps Curl',tag:'dumbbell'},
  {name:'Biceps (machine)',tag:'accessory'},{name:'Triceps',tag:'pulley'},
  {name:'Hip Abduction',tag:'accessory'},{name:'Hip Adduction',tag:'accessory'}
];

var DATA={
  a:{sections:[
    {label:'Chest — push',ex:[
      {id:'a1',name:'Bench Press',        tag:'bar',      sets:4,reps:'5–6',  w:80, pr:'100×2', prGym:'pankrac'},
      {id:'a2',name:'Incline Bench Press',tag:'bar',      sets:3,reps:'8',    w:55, pr:'70×6',  prGym:'chodov'},
      {id:'a3',name:'Pec Fly',            tag:'accessory',sets:3,reps:'10–12',w:55, pr:'73×10', prGym:'chodov'}
    ]},
    {label:'Back — pull',ex:[
      {id:'a4',name:'Lat Pulldown',       tag:'pulley',   sets:4,reps:'8',    w:85, pr:'110×8', prGym:'pankrac'},
      {id:'a5',name:'Seated / Low Row',   tag:'pulley',   sets:3,reps:'8',    w:80, pr:'100×8', prGym:'arkady'}
    ]},
    {label:'Shoulders & arms',ex:[
      {id:'a6',name:'Shoulder Press',     tag:'bar',      sets:3,reps:'8',    w:55, pr:'70×8',  prGym:'pankrac'},
      {id:'a7',name:'Lateral Raise',      tag:'dumbbell', sets:3,reps:'12',   w:24, pr:'32×10', prGym:'pankrac'},
      {id:'a8',name:'Biceps Curl',        tag:'dumbbell', sets:3,reps:'10',   w:38, pr:'50×6',  prGym:'pankrac'},
      {id:'a9',name:'Triceps',            tag:'pulley',   sets:3,reps:'10',   w:55, pr:'70×6',  prGym:'chodov'}
    ]}
  ]},
  b:{sections:[
    {label:'Quads & glutes',ex:[
      {id:'b1',name:'Squat / Hack Squat',tag:'bar',      sets:4,reps:'6',    w:80,  pr:'100×2', prGym:'chodov'},
      {id:'b2',name:'Leg Press',         tag:'accessory',sets:4,reps:'8',    w:175, pr:'225×6', prGym:'arkady'},
      {id:'b3',name:'Leg Extension',     tag:'accessory',sets:3,reps:'12',   w:72,  pr:'95×8',  prGym:'arkady'}
    ]},
    {label:'Hamstrings',ex:[
      {id:'b4',name:'Deadlift',          tag:'bar',      sets:4,reps:'5',    w:85,  pr:'106×5', prGym:'arkady'},
      {id:'b5',name:'Leg Curl',          tag:'accessory',sets:3,reps:'10–12',w:55,  pr:'73×8',  prGym:'chodov'}
    ]},
    {label:'Hips & calves',ex:[
      {id:'b6',name:'Hip Abduction',     tag:'accessory',sets:3,reps:'12',   w:60,  pr:'80×10', prGym:'pankrac'},
      {id:'b7',name:'Hip Adduction',     tag:'accessory',sets:3,reps:'12',   w:60,  pr:'80×10', prGym:'pankrac'},
      {id:'b8',name:'Calves',            tag:'accessory',sets:4,reps:'15',   w:90,  pr:'120×10',prGym:'arkady'}
    ]}
  ]},
  c:{fbNote:true,sections:[
    {label:'Lower body',ex:[
      {id:'c1',name:'Leg Press',         tag:'accessory',sets:3,reps:'10',  w:160, pr:'225×6', prGym:'arkady'},
      {id:'c2',name:'Leg Curl',          tag:'accessory',sets:3,reps:'12',  w:50,  pr:'73×8',  prGym:'chodov'},
      {id:'c3',name:'Calves',            tag:'accessory',sets:3,reps:'15',  w:90,  pr:'120×10',prGym:'arkady'}
    ]},
    {label:'Upper — push',ex:[
      {id:'c4',name:'Chest / Pec Press', tag:'accessory',sets:3,reps:'10',  w:65,  pr:'85×8',  prGym:'arkady'},
      {id:'c5',name:'Shoulder Press',    tag:'bar',      sets:3,reps:'10',  w:50,  pr:'70×8',  prGym:'pankrac'},
      {id:'c6',name:'Decline Press',     tag:'bar',      sets:3,reps:'10',  w:55,  pr:'70×6',  prGym:'pankrac'}
    ]},
    {label:'Upper — pull',ex:[
      {id:'c7',name:'Seated / Low Row',  tag:'pulley',   sets:3,reps:'10',  w:75,  pr:'100×8', prGym:'arkady'},
      {id:'c8',name:'Lat Pulldown',      tag:'pulley',   sets:3,reps:'10',  w:80,  pr:'110×8', prGym:'pankrac'},
      {id:'c9',name:'Biceps Curl',       tag:'dumbbell', sets:3,reps:'12',  w:35,  pr:'50×6',  prGym:'pankrac'}
    ]}
  ]}
};

// Extra exercises added by user
var extraExercises=[];

var WK_DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
var WK_TYPES=['—','Upper','Lower','Full Body','Cardio','Rest'];

/* ═══════════════ STORAGE ═══════════════ */
function ls(k,d){try{var v=localStorage.getItem('gp5_'+k);return v!==null?JSON.parse(v):d;}catch(e){return d;}}
function ss(k,v){try{localStorage.setItem('gp5_'+k,JSON.stringify(v));}catch(e){}}

function tagClass(t){return 'etag tag-'+t;}
function tagLabel(t){return t==='bar'?'Bar':t==='dumbbell'?'Dumbbell':t==='pulley'?'Pulley':'Accessory';}
function gymBadge(g){
  if(!g||!GYM_NAMES[g]) return '';
  return '<span class="gym-badge" style="background:'+GYM_COLORS[g]+';color:'+GYM_TEXT[g]+';border-color:'+GYM_COLORS[g]+';">'+GYM_NAMES[g]+'</span>';
}

/* ═══════════════ MAIN TAB ═══════════════ */
function mainSw(id,el){
  document.querySelectorAll('.main-panel').forEach(function(p){p.classList.remove('on');});
  document.querySelectorAll('.main-tab').forEach(function(t){t.classList.remove('on');});
  var panel=document.getElementById('main-'+id);if(panel)panel.classList.add('on');
  if(el)el.classList.add('on');
  if(id==='weights') buildWeightsTab();
  if(id==='gyms') buildGymsTab();
  if(id==='plans') buildPlanTab();
  if(id==='history') buildHistory();
}

/* ═══════════════ GYM ═══════════════ */
(function(){document.getElementById('gym-select').value=ls('gym','arkady');})();

/* ═══════════════ DAY SWITCH ═══════════════ */
var currentDay='a';
function swDay(id,el){
  ['a','b','c','d'].forEach(function(d){
    document.getElementById('p'+d).classList.remove('on');
    var sm=document.getElementById('sm-'+d);
    if(sm) sm.style.display='none';
  });
  document.querySelectorAll('.day-tab').forEach(function(t){t.classList.remove('on');});
  document.getElementById('p'+id).classList.add('on');
  el.classList.add('on');
  currentDay=id;
  if(id==='d'){
    var smd=document.getElementById('sm-d');if(smd)smd.style.display='flex';
    loadMeta('d');
    loadCardio();
  } else {
    var sm=document.getElementById('sm-'+id);if(sm)sm.style.display='flex';
    loadMeta(id);
  }
}

/* ═══════════════ SESSION META ═══════════════ */
function saveMeta(dk){
  ss('meta-'+dk,{
    time:document.getElementById('sm-'+dk+'-time').value,
    sv:document.getElementById('sm-'+dk+'-sv').value,
    sm:document.getElementById('sm-'+dk+'-sm').value
  });
}
function loadMeta(dk){
  var m=ls('meta-'+dk,{});
  var f=function(id,val){var el=document.getElementById(id);if(el&&val!==undefined&&val!=='')el.value=val;};
  f('sm-'+dk+'-time',m.time);f('sm-'+dk+'-sv',m.sv);f('sm-'+dk+'-sm',m.sm);
}

/* ═══════════════ SAVE TRAINING ═══════════════ */
function saveTraining(dk){
  saveMeta(dk);
  var day=DATA[dk];
  var exercises=[];
  if(day){
    day.sections.forEach(function(sec){
      sec.ex.forEach(function(ex){
        exercises.push({
          id:ex.id,
          name:ls('name-'+ex.id,ex.name),
          tag:ls('tag-'+ex.id,ex.tag),
          sets:ls('s-'+ex.id,ex.sets),
          reps:ls('r-'+ex.id,ex.reps),
          weight:ls('w-'+ex.id,ex.w),
          done:ls('done-'+ex.id,false)
        });
      });
    });
  }
  var meta=ls('meta-'+dk,{});
  var gymId=ls('gym','');
  var gymName=GYM_NAMES[gymId]||gymId;
  var today=new Date();
  var dateIso=today.getFullYear()+'-'+(today.getMonth()+1<10?'0':'')+(today.getMonth()+1)+'-'+(today.getDate()<10?'0':'')+today.getDate();

  /* Save to localStorage */
  var log=ls('trainlog',[]);
  log.unshift({
    date:today.toLocaleDateString('en-GB'),
    day:dk.toUpperCase(),
    gym:gymId,
    time:meta.time||'',
    saunaReps:meta.sv||'',
    saunaMin:meta.sm||'',
    exercises:exercises
  });
  if(log.length>100)log=log.slice(0,100);
  ss('trainlog',log);

  /* Save to Django backend */
  apiFetch('POST', '/api/sessions/', {
    date: dateIso,
    gym: gymName,
    notes: (meta.time?'Time: '+meta.time+' min':'')+
           (meta.sv?' | Sauna: '+meta.sv+' × '+meta.sm+' min':''),
    entries: exercises
  });

  var btn=document.querySelector('.save-training-btn[onclick*="saveTraining(\''+dk+'\')"]');
  if(btn){
    var orig=btn.textContent;
    btn.textContent='✓ Saved!';
    btn.style.background='#1D9E75';
    setTimeout(function(){btn.textContent=orig;btn.style.background='';},2000);
  }
}

/* ═══════════════ CARDIO ═══════════════ */
var selectedCardio=null;
function selCardio(type){
  selectedCardio=type;
  ss('cardio-type',type);
  document.querySelectorAll('.cardio-card').forEach(function(c){c.classList.remove('selected');});
  var el=document.getElementById('cc-'+type);if(el)el.classList.add('selected');
  document.getElementById('cardio-fields').style.display='flex';
  loadCardio();
}
function saveCardio(){
  ss('cardio-log',{type:selectedCardio,time:document.getElementById('cardio-time').value,
    kcal:document.getElementById('cardio-kcal').value});
}
function loadCardio(){
  var c=ls('cardio-log',{});
  var type=ls('cardio-type',null);
  if(type){selCardio(type);}
  if(c.time) document.getElementById('cardio-time').value=c.time;
  if(c.kcal) document.getElementById('cardio-kcal').value=c.kcal;

}

/* ═══════════════ BUILD DAY ═══════════════ */
function buildDay(dk){
  var day=DATA[dk],panel=document.getElementById('p'+dk);
  var allEx=[];day.sections.forEach(function(s){s.ex.forEach(function(e){allEx.push(e);});});
  var total=allEx.length,h='';

  h+='<div class="prog-wrap"><div class="prog-top">';
  h+='<span class="prog-label" id="pl-'+dk+'">0 / '+total+' done</span>';
  h+='<button class="reset-btn" onclick="resetDay(\''+dk+'\')">Reset</button>';
  h+='</div><div class="prog-bar"><div class="prog-fill" id="pf-'+dk+'" style="width:0%"></div></div></div>';
  if(day.fbNote) h+='<div class="fb-note">Full body = one compound per group, slightly lighter. Frequency day, not max effort.</div>';

  day.sections.forEach(function(sec){
    h+='<div class="slabel">'+sec.label+'</div>';
    h+='<div class="thead"><div></div><div>Exercise</div><div style="text-align:center">Sets</div><div style="text-align:center">Reps</div><div style="text-align:right">Weight</div><div></div></div>';
    sec.ex.forEach(function(ex){
      var done=ls('done-'+ex.id,false);
      var wVal=ls('w-'+ex.id,ex.w),sVal=ls('s-'+ex.id,ex.sets),rVal=ls('r-'+ex.id,ex.reps);
      var nameVal=ls('name-'+ex.id,ex.name),tagVal=ls('tag-'+ex.id,ex.tag);
      var wc=tagVal==='bar'?'#2a6b3a':tagVal==='dumbbell'?'#185FA5':tagVal==='pulley'?'#7a4a0a':'#888';

      h+='<div class="erow'+(done?' done':'')+'" id="row-'+ex.id+'">';
      h+='<div class="cb'+(done?' checked':'')+'" id="cb-'+ex.id+'" onclick="toggleEx(\''+ex.id+'\',\''+dk+'\')">';
      h+='<svg class="ck-svg" width="10" height="8" viewBox="0 0 10 8" fill="none"><polyline points="1,4 3.8,7 9,1" stroke="white" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';

      h+='<div class="ename-wrap">';
      h+='<div class="ename-line"><span class="ename-text" id="en-'+ex.id+'">'+nameVal+'</span>';
      h+='<span class="'+tagClass(tagVal)+'" id="etag-'+ex.id+'">'+tagLabel(tagVal)+'</span>';
      h+='<button class="swap-btn" onclick="toggleSwap(event,\''+ex.id+'\')">swap ⇄</button></div>';
      h+='<div class="epr" id="epr-'+ex.id+'">PR: '+ls('pr-'+ex.id,ex.pr)+' kg &nbsp;'+gymBadge(ls('prGym-'+ex.id,ex.prGym||''))+'</div>';
      h+=buildSwapPanel(ex.id,dk);
      h+='</div>';

      h+=mkCell(ex.id,'s',sVal,'num','text-align:center');
      h+=mkCell(ex.id,'r',rVal,'txt','text-align:center');
      h+=mkCellW(ex.id,wVal,wc);
      h+='<div style="text-align:center"><button class="remove-ex-btn" onclick="removeExFromPlan(\''+ex.id+'\',\''+dk+'\')" title="Remove">✕</button></div>';
      h+='</div>';
    });
    h+='<div class="add-ex-row"><button class="add-ex-btn" onclick="openAddExModal(\''+dk+'\',\''+sec.label+'\')" >+ Add exercise</button></div>';
  });
  panel.innerHTML=h;
  updateProg(dk);
}

function buildSwapPanel(id,dk){
  var h='<div class="swap-panel" id="sp-'+id+'">';
  h+='<input class="swap-search" type="text" placeholder="Search..." oninput="filterSwap(this,\''+id+'\')">';
  h+='<div class="swap-divider">From your gym CSV</div>';
  h+='<div class="swap-list" id="sl-'+id+'">';
  LIBRARY.forEach(function(lib){
    h+='<div class="swap-opt" onclick="applySwap(\''+id+'\',\''+escQ(lib.name)+'\',\''+lib.tag+'\',\''+dk+'\')">'+lib.name+'<span style="font-size:9px;color:#aaa;margin-left:5px">'+tagLabel(lib.tag)+'</span></div>';
  });
  h+='</div><div class="swap-custom-row">';
  h+='<input class="swap-custom-input" id="sci-'+id+'" type="text" placeholder="Custom name...">';
  h+='<button class="swap-custom-btn" onclick="applyCustomSwap(\''+id+'\',\''+dk+'\')">Add</button>';
  h+='</div></div>';
  return h;
}

function mkCell(id,field,val,inputType,align){
  var inp=inputType==='num'
    ?'<input class="cell-input num-input" data-id="'+id+'" data-field="'+field+'" id="ci-'+id+'-'+field+'" type="number" min="0" step="1" value="'+val+'" onblur="saveCell(this)" onkeydown="cellKey(event,this)">'  
    :'<input class="cell-input txt-input" data-id="'+id+'" data-field="'+field+'" id="ci-'+id+'-'+field+'" type="text" value="'+val+'" onblur="saveCell(this)" onkeydown="cellKey(event,this)">';
  return '<div class="editable-cell" style="'+align+';">'+inp+'</div>';
}
function mkCellW(id,wVal,wc){
  return '<div class="editable-cell weight-cell">'
    +'<input class="cell-input num-input" data-id="'+id+'" data-field="w" id="ci-'+id+'-w" type="number" min="0" step="2.5" value="'+wVal+'" style="color:'+wc+';font-weight:600;" onblur="saveCell(this)" onkeydown="cellKey(event,this)">'
    +'</div>';
}

/* ═══════════════ CELL EDITING ═══════════════ */
function saveCell(el){
  var id=el.dataset.id,field=el.dataset.field;
  var raw=el.value.trim();if(raw==='')return;
  if(field==='w'){var n=parseFloat(raw);if(isNaN(n)||n<0)n=0;el.value=n;ss('w-'+id,n);
    var tEl=document.getElementById('etag-'+id);var t=tEl?tEl.dataset.tag||tEl.textContent.toLowerCase():'';
    var wc=t.indexOf('bar')>=0?'#2a6b3a':t.indexOf('dumb')>=0?'#185FA5':t.indexOf('pul')>=0?'#7a4a0a':'#888';
    el.style.color=wc;
  } else if(field==='s'){var n2=parseInt(raw);if(isNaN(n2)||n2<0)n2=0;el.value=n2;ss('s-'+id,n2);}
  else{ss('r-'+id,raw);}
}
function cellKey(e,el){
  if(e.key==='Enter')el.blur();
}

/* ═══════════════ CHECKBOX ═══════════════ */
function toggleEx(id,dk){
  var done=ls('done-'+id,false);done=!done;ss('done-'+id,done);
  var row=document.getElementById('row-'+id),cb=document.getElementById('cb-'+id);
  if(done){row.classList.add('done');cb.classList.add('checked');}
  else{row.classList.remove('done');cb.classList.remove('checked');}
  updateProg(dk);
}
function updateProg(dk){
  var done=0,total=0;
  DATA[dk].sections.forEach(function(s){s.ex.forEach(function(e){total++;if(ls('done-'+e.id,false))done++;});});
  var pct=total?Math.round(done/total*100):0;
  var f=document.getElementById('pf-'+dk);if(f)f.style.width=pct+'%';
  var l=document.getElementById('pl-'+dk);if(l)l.textContent=done+' / '+total+' done';
}
function resetDay(dk){
  DATA[dk].sections.forEach(function(s){s.ex.forEach(function(e){ss('done-'+e.id,false);});});
  buildDay(dk);
}

/* ═══════════════ SWAP ═══════════════ */
var openSwapId=null;
function escQ(s){return s.replace(/'/g,"\\'");}
function toggleSwap(e,id){
  e.stopPropagation();
  if(openSwapId&&openSwapId!==id){var pp=document.getElementById('sp-'+openSwapId);if(pp)pp.classList.remove('open');}
  var panel=document.getElementById('sp-'+id);panel.classList.toggle('open');
  openSwapId=panel.classList.contains('open')?id:null;
  if(panel.classList.contains('open')){var inp=panel.querySelector('.swap-search');if(inp){inp.value='';filterSwap(inp,id);}}
}
document.addEventListener('click',function(){if(openSwapId){var p=document.getElementById('sp-'+openSwapId);if(p)p.classList.remove('open');openSwapId=null;}});
function filterSwap(inp,id){
  var q=inp.value.toLowerCase();var list=document.getElementById('sl-'+id);if(!list)return;
  list.querySelectorAll('.swap-opt').forEach(function(o){o.style.display=o.textContent.toLowerCase().indexOf(q)>=0?'':'none';});
}
function applySwap(id,name,tag,dk){
  ss('name-'+id,name);ss('tag-'+id,tag);
  var nEl=document.getElementById('en-'+id),tEl=document.getElementById('etag-'+id);
  if(nEl)nEl.textContent=name;
  if(tEl){tEl.textContent=tagLabel(tag);tEl.className=tagClass(tag);}
  var wv=document.getElementById('cv-'+id+'-w');
  if(wv){var wc=tag==='bar'?'#2a6b3a':tag==='dumbbell'?'#185FA5':tag==='pulley'?'#7a4a0a':'#888';wv.style.color=wc;}
  var p=document.getElementById('sp-'+id);if(p)p.classList.remove('open');openSwapId=null;
}
function applyCustomSwap(id,dk){
  var inp=document.getElementById('sci-'+id);var name=inp.value.trim();if(!name)return;
  var tEl=document.getElementById('etag-'+id);var tag=tEl?getTagKey(tEl.textContent):'accessory';
  applySwap(id,name,tag,dk);inp.value='';
}
function getTagKey(label){
  if(label.toLowerCase().indexOf('bar')>=0)return'bar';
  if(label.toLowerCase().indexOf('dumb')>=0)return'dumbbell';
  if(label.toLowerCase().indexOf('pul')>=0)return'pulley';
  return'accessory';
}

/* ═══════════════ WEEKLY GRID (week navigation) ═══════════════ */
var weekOffset=0;
var WK_MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getWeekStart(offset){
  var now=new Date();now.setHours(0,0,0,0);
  var day=now.getDay();
  var mon=new Date(now);
  mon.setDate(now.getDate()-(day===0?6:day-1)+offset*7);
  return mon;
}
function getWeekDates(offset){
  var mon=getWeekStart(offset);var dates=[];
  for(var i=0;i<7;i++){var d=new Date(mon);d.setDate(mon.getDate()+i);d.setHours(0,0,0,0);dates.push(d);}
  return dates;
}
function dateKey(d){
  var m=String(d.getMonth()+1).padStart(2,'0');
  var dd=String(d.getDate()).padStart(2,'0');
  return d.getFullYear()+'-'+m+'-'+dd;
}
function fmtDate(d){return WK_MONTHS[d.getMonth()]+' '+d.getDate();}

var WK_TYPE_COLORS={
  'Upper':  {bg:'#E6F1FB',text:'#185FA5'},
  'Lower':  {bg:'#F3E8F8',text:'#6B2D8B'},
  'Full Body':{bg:'#EAF3DE',text:'#3B6D11'},
  'Cardio': {bg:'#FDE8E8',text:'#9B1C1C'},
  'Rest':   {bg:'#F0F0EE',text:'#666666'}
};

function buildWeekGrid(){
  var grid=document.getElementById('wk-grid');if(!grid)return;
  var dates=getWeekDates(weekOffset);
  var todayMs=new Date();todayMs.setHours(0,0,0,0);todayMs=todayMs.getTime();
  var nl=document.getElementById('wk-nav-label');
  if(nl)nl.textContent=fmtDate(dates[0])+' \u2013 '+fmtDate(dates[6]);
  var h='';
  WK_DAYS.forEach(function(day,i){
    var d=dates[i];var dk=dateKey(d);
    var isToday=(d.getTime()===todayMs);
    var checked=ls('wkd-'+dk,false);
    var type=ls('wkd-type-'+dk,'—');
    var hasType=(type!=='—');
    var col=hasType&&WK_TYPE_COLORS[type]?WK_TYPE_COLORS[type]:null;
    h+='<div class="wk-day'+(checked?' wk-checked':'')+(isToday?' wk-today':'')+'" id="wkd-'+i+'">';
    h+='<div class="wk-name">'+day+'</div>';
    h+='<div class="wk-date-sub">'+fmtDate(d)+'</div>';
    /* Dropdown — compact, always shown to allow changing */
    h+='<select class="wk-type-sel'+(hasType?' wk-type-sel-set':'')+'" id="wkt-'+i+'" onchange="saveWkTypeDate(\''+dk+'\',this.value)" onclick="event.stopPropagation()" style="'+(col?'border-color:'+col.bg+';color:'+col.text+';background:'+col.bg+';':'')+'">';
    WK_TYPES.forEach(function(t){h+='<option value="'+t+'"'+(t===type?' selected':'')+'>'+t+'</option>';});
    h+='</select>';
    /* Training label — only when a type is chosen */
    if(hasType){
      /* Circle checkbox */
      h+='<div class="wk-circle'+(checked?' wk-circle-done':'')+'" id="wkc-'+i+'" onclick="toggleWkDate(\''+dk+'\','+i+')" title="Mark as done">';
      if(checked)h+='<svg width="11" height="9" viewBox="0 0 11 9" fill="none"><polyline points="1,4.5 4,7.5 10,1" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      h+='</div>';
    }
    h+='</div>';
  });
  grid.innerHTML=h;
}
function toggleWkDate(dk,i){
  var checked=ls('wkd-'+dk,false);checked=!checked;ss('wkd-'+dk,checked);
  var el=document.getElementById('wkd-'+i);
  var circle=document.getElementById('wkc-'+i);
  if(checked){
    el.classList.add('wk-checked');
    if(circle){circle.classList.add('wk-circle-done');circle.innerHTML='<svg width="11" height="9" viewBox="0 0 11 9" fill="none"><polyline points="1,4.5 4,7.5 10,1" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';}
  } else {
    el.classList.remove('wk-checked');
    if(circle){circle.classList.remove('wk-circle-done');circle.innerHTML='';}
  }
}
function saveWkTypeDate(dk,val){
  ss('wkd-type-'+dk,val);
  /* If clearing back to —, also clear done state */
  if(val==='—') ss('wkd-'+dk,false);
  buildWeekGrid();
}
function prevWeek(){weekOffset--;buildWeekGrid();}
function nextWeek(){weekOffset++;buildWeekGrid();}
function goToday(){weekOffset=0;buildWeekGrid();}
function resetWeek(){
  var dates=getWeekDates(weekOffset);
  dates.forEach(function(d){var dk=dateKey(d);ss('wkd-'+dk,false);ss('wkd-type-'+dk,'—');});
  buildWeekGrid();
}

/* ═══════════════ WEIGHTS TAB ═══════════════ */
function allExercises(){
  var seen={},rows=[];
  ['a','b','c'].forEach(function(dk){
    DATA[dk].sections.forEach(function(sec){
      sec.ex.forEach(function(ex){
        if(!seen[ex.id]){seen[ex.id]=true;
          rows.push({id:ex.id,name:ls('name-'+ex.id,ex.name),tag:ls('tag-'+ex.id,ex.tag),
            w:ls('w-'+ex.id,ex.w),pr:ls('pr-'+ex.id,ex.pr),prGym:ls('prGym-'+ex.id,ex.prGym||''),day:dk.toUpperCase()});
        }
      });
    });
  });
  extraExercises.forEach(function(ex){
    if(!seen[ex.id]){seen[ex.id]=true;rows.push(ex);}
  });
  return rows;
}

function buildWeightsTab(){
  var rows=allExercises();
  var h='<table class="w-table"><thead><tr>';
  h+='<th>Exercise</th><th>Split</th><th class="r">Working kg</th><th class="r">PR &amp; gym</th><th></th>';
  h+='</tr></thead><tbody>';
  rows.forEach(function(r){
    h+='<tr id="wtr-'+r.id+'">';
    // Name + editable tag
    h+='<td><div class="w-name-cell">';
    h+='<span id="wname-'+r.id+'" style="font-size:13px;">'+r.name+'</span>';
    h+='<select class="w-tag-sel '+tagClass(r.tag)+'" id="wtag-'+r.id+'" onchange="saveWTag(\''+r.id+'\',this)">';
    EQUIP_TAGS.forEach(function(t){h+='<option value="'+t+'"'+(t===r.tag?' selected':'')+'>'+tagLabel(t)+'</option>';});
    h+='</select>';
    h+='</div></td>';
    // Day
    h+='<td style="font-size:11px;color:#aaa;">'+(!r.day||r.day==='custom'?'Custom':(r.day==='A'?'Upper':(r.day==='B'?'Lower':(r.day==='C'?'Fullbody':r.day))))+'</td>';
    // Working weight — inline editable
    h+='<td class="w-val-cell">';
    h+='<div class="w-disp" id="wwd-'+r.id+'" onclick="openWW(\''+r.id+'\')">';
    h+='<span id="wwv-'+r.id+'" style="font-size:13px;font-weight:500;color:#1a1a1a;">'+r.w+' kg</span>';
    h+='<span style="font-size:9px;color:#ccc;">✎</span></div>';
    h+='<div class="w-form" id="wwe-'+r.id+'">';
    h+='<input class="w-inp wshort" id="wwi-'+r.id+'" type="number" min="0" step="2.5" value="'+r.w+'" onkeydown="wwKey(event,\''+r.id+'\')">';
    h+='<button class="w-ok" onclick="saveWW(\''+r.id+'\')">✓</button></div></td>';
    // PR + gym — inline editable
    h+='<td class="w-val-cell">';
    h+='<div style="display:flex;align-items:center;gap:5px;justify-content:flex-end;flex-wrap:wrap;">';
    h+='<div class="w-disp" id="prd-'+r.id+'" onclick="openPR(\''+r.id+'\')">';
    h+='<span id="prv-'+r.id+'" style="font-size:13px;font-weight:500;color:#1D9E75;">'+r.pr+'</span>';
    h+='<span style="font-size:9px;color:#ccc;">✎</span></div>';
    h+=gymBadge(r.prGym);
    h+='</div>';
    h+='<div class="w-form" id="pre-'+r.id+'" style="margin-top:4px;">';
    h+='<input class="w-inp wmed" id="pri-'+r.id+'" type="text" value="'+r.pr+'" placeholder="e.g. 100×2" onkeydown="prKey(event,\''+r.id+'\')">';
    h+='<select class="w-inp" style="width:100px;font-size:11px;" id="prg-'+r.id+'">';
    ['arkady','pankrac','chodov'].forEach(function(g){h+='<option value="'+g+'"'+(g===r.prGym?' selected':'')+'>'+GYM_NAMES[g]+'</option>';});
    h+='</select>';
    h+='<button class="w-ok" onclick="savePR(\''+r.id+'\')">✓</button></div></td>';
    // Delete (only custom)
    h+='<td><button class="delete-ex" onclick="deleteEx(\''+r.id+'\')">✕</button></td>';
    h+='</tr>';
  });
  h+='</tbody></table>';
  document.getElementById('weights-table-wrap').innerHTML=h;
}

function saveWTag(id,sel){
  var tag=sel.value;ss('tag-'+id,tag);
  sel.className='w-tag-sel '+tagClass(tag);
  // sync in plan tab if visible
  var tEl=document.getElementById('etag-'+id);
  if(tEl){tEl.className=tagClass(tag);tEl.textContent=tagLabel(tag);}
}
function openWW(id){document.getElementById('wwd-'+id).style.display='none';var f=document.getElementById('wwe-'+id);f.classList.add('open');var i=document.getElementById('wwi-'+id);i.focus();i.select();}
function saveWW(id){
  var val=parseFloat(document.getElementById('wwi-'+id).value);if(isNaN(val)||val<0)val=0;
  ss('w-'+id,val);document.getElementById('wwv-'+id).textContent=val+' kg';
  document.getElementById('wwe-'+id).classList.remove('open');document.getElementById('wwd-'+id).style.display='';
  // sync plan tab
  var cv=document.getElementById('cv-'+id+'-w');if(cv)cv.textContent=val+' kg';
}
function wwKey(e,id){if(e.key==='Enter')saveWW(id);if(e.key==='Escape'){document.getElementById('wwe-'+id).classList.remove('open');document.getElementById('wwd-'+id).style.display='';}}

function openPR(id){document.getElementById('prd-'+id).style.display='none';var f=document.getElementById('pre-'+id);f.classList.add('open');var i=document.getElementById('pri-'+id);i.focus();i.select();}
function savePR(id){
  var val=document.getElementById('pri-'+id).value.trim();if(!val)return;
  var gym=document.getElementById('prg-'+id).value;
  ss('pr-'+id,val);ss('prGym-'+id,gym);
  document.getElementById('prv-'+id).textContent=val;
  // update gym badge in the display row
  var row=document.getElementById('wtr-'+id);
  if(row){var badges=row.querySelectorAll('.gym-badge');badges.forEach(function(b){b.remove()});}
  document.getElementById('prd-'+id).insertAdjacentHTML('afterend',gymBadge(gym));
  document.getElementById('pre-'+id).classList.remove('open');document.getElementById('prd-'+id).style.display='';
  // sync plan tab epr
  var eprEl=document.getElementById('epr-'+id);if(eprEl)eprEl.innerHTML='PR: '+val+' kg &nbsp;'+gymBadge(gym);
}
function prKey(e,id){if(e.key==='Enter')savePR(id);if(e.key==='Escape'){document.getElementById('pre-'+id).classList.remove('open');document.getElementById('prd-'+id).style.display='';}}

function deleteEx(id){
  extraExercises=extraExercises.filter(function(e){return e.id!==id;});
  ss('extraExercises',extraExercises);
  buildWeightsTab();
}

/* ═══════════════ ADD EXERCISE MODAL ═══════════════ */
function openAddModal(){
  extraExercises=ls('extraExercises',[]);
  document.getElementById('modal-name').value='';
  document.getElementById('modal-w').value='';
  document.getElementById('modal-pr').value='';
  document.getElementById('add-modal').classList.add('open');
  document.getElementById('modal-name').focus();
}
function closeAddModal(){document.getElementById('add-modal').classList.remove('open');}
function confirmAddEx(){
  var name=document.getElementById('modal-name').value.trim();if(!name)return;
  var tag=document.getElementById('modal-tag').value;
  var w=parseFloat(document.getElementById('modal-w').value)||0;
  var pr=document.getElementById('modal-pr').value.trim()||'—';
  var gym=document.getElementById('modal-gym').value;
  var id='ex-'+Date.now();
  var ex={id:id,name:name,tag:tag,w:w,pr:pr,prGym:gym,day:'custom'};
  extraExercises=ls('extraExercises',[]);
  extraExercises.push(ex);
  ss('extraExercises',extraExercises);
  ss('name-'+id,name);ss('tag-'+id,tag);ss('w-'+id,w);ss('pr-'+id,pr);ss('prGym-'+id,gym);
  closeAddModal();
  buildWeightsTab();
}
document.getElementById('add-ex-plan-modal').addEventListener('click',function(e){if(e.target===this)closeAddExModal();});

/* ═══════════════ ADD EX TO PLAN ═══════════════ */
var _aepDk='',_aepSec='';
function openAddExModal(dk,secLabel){
  _aepDk=dk;_aepSec=secLabel;
  var dayLabel={a:'Upper',b:'Lower',c:'Full Body'}[dk]||dk.toUpperCase();
  document.getElementById('aep-title').textContent='Add to '+dayLabel+' — '+secLabel;
  document.getElementById('aep-name').value='';
  document.getElementById('aep-sets').value='3';
  document.getElementById('aep-reps').value='10';
  document.getElementById('aep-w').value='';
  document.getElementById('aep-pr').value='';
  document.getElementById('aep-search').value='';
  buildAepPickList('');
  document.getElementById('add-ex-plan-modal').classList.add('open');
  document.getElementById('aep-search').focus();
}

function buildAepPickList(q){
  var list=document.getElementById('aep-pick-list');if(!list)return;
  // Collect all exercises: from weights data + LIBRARY, deduped by name
  var seen={},items=[];
  allExercises().forEach(function(ex){
    var key=ex.name.toLowerCase();
    if(!seen[key]){seen[key]=true;items.push({name:ex.name,tag:ex.tag,w:ex.w,pr:ex.pr,prGym:ex.prGym||''});}
  });
  LIBRARY.forEach(function(lib){
    var key=lib.name.toLowerCase();
    if(!seen[key]){seen[key]=true;items.push({name:lib.name,tag:lib.tag,w:0,pr:'—',prGym:'arkady'});}
  });
  var filtered=q?items.filter(function(it){return it.name.toLowerCase().indexOf(q.toLowerCase())>=0;}):items;
  var h='';
  filtered.forEach(function(it){
    var wc=it.tag==='bar'?'#2a6b3a':it.tag==='dumbbell'?'#185FA5':it.tag==='pulley'?'#7a4a0a':'#888';
    h+='<div class="aep-pick-opt" onclick="selectAepExercise(\''+escQ(it.name)+'\',\''+it.tag+'\','+it.w+',\''+escQ(it.pr)+'\',\''+it.prGym+'\')">'
      +'<span style="font-size:12px;color:#222;">'+it.name+'</span>'
      +'<span class="'+tagClass(it.tag)+'" style="margin-left:6px;font-size:9px;padding:1px 5px;">'+tagLabel(it.tag)+'</span>'
      +(it.w?'<span style="margin-left:auto;font-size:11px;font-weight:600;color:'+wc+';">'+it.w+' kg</span>':'')
      +'</div>';
  });
  if(!filtered.length) h='<div style="padding:10px 12px;font-size:11px;color:#bbb;">No exercises found</div>';
  list.innerHTML=h;
}

function filterAepList(){
  buildAepPickList(document.getElementById('aep-search').value);
}

function selectAepExercise(name,tag,w,pr,prGym){
  document.getElementById('aep-name').value=name;
  document.getElementById('aep-tag').value=tag;
  if(w) document.getElementById('aep-w').value=w;
  if(pr&&pr!=='—') document.getElementById('aep-pr').value=pr;
  if(prGym) document.getElementById('aep-gym').value=prGym;
  // Highlight selected
  document.querySelectorAll('.aep-pick-opt').forEach(function(o){o.classList.remove('aep-pick-sel');});
  event.currentTarget.classList.add('aep-pick-sel');
}

function closeAddExModal(){document.getElementById('add-ex-plan-modal').classList.remove('open');}
function confirmAddExPlan(){
  var name=document.getElementById('aep-name').value.trim();if(!name)return;
  var tag=document.getElementById('aep-tag').value;
  var sets=parseInt(document.getElementById('aep-sets').value)||3;
  var reps=document.getElementById('aep-reps').value.trim()||'10';
  var w=parseFloat(document.getElementById('aep-w').value)||0;
  var pr=document.getElementById('aep-pr').value.trim()||'—';
  var gym=document.getElementById('aep-gym').value;
  var id='ep-'+Date.now();
  var ex={id:id,name:name,tag:tag,sets:sets,reps:reps,w:w,pr:pr,prGym:gym};
  /* Find the correct data source */
  var isBuiltIn=(_aepDk==='a'||_aepDk==='b'||_aepDk==='c');
  var dataSource=isBuiltIn?DATA[_aepDk]:getPlanData(_aepDk);
  if(!dataSource)return;
  var sec=dataSource.sections.find(function(s){return s.label===_aepSec;});
  if(!sec){dataSource.sections.push({label:_aepSec,ex:[]});sec=dataSource.sections[dataSource.sections.length-1];}
  sec.ex.push(ex);
  /* Persist individual fields */
  ss('name-'+id,name);ss('tag-'+id,tag);ss('w-'+id,w);ss('pr-'+id,pr);ss('prGym-'+id,gym);
  if(isBuiltIn){
    var addedKey='added-plan-ex-'+_aepDk;
    var added=ls(addedKey,[]);ex._sec=_aepSec;added.push(ex);ss(addedKey,added);
  } else {
    saveCustomPlans();
  }
  closeAddExModal();
  if(isBuiltIn) buildDay(_aepDk);
  /* If plan tab is visible, refresh it */
  if(document.getElementById('main-plans').classList.contains('on')){
    buildPlanTab();
    setTimeout(function(){
      var c=document.getElementById('plancard-'+_aepDk);
      if(c) c.classList.add('open');
    },40);
  }
}
/* Restore added plan exercises on init */
function restoreAddedPlanEx(){
  ['a','b','c'].forEach(function(dk){
    var added=ls('added-plan-ex-'+dk,[]);
    added.forEach(function(ex){
      var day=DATA[dk];
      var exists=false;
      day.sections.forEach(function(s){s.ex.forEach(function(e){if(e.id===ex.id)exists=true;});});
      if(!exists){
        var sec=ex._sec?day.sections.find(function(s){return s.label===ex._sec;}):null;
        if(!sec)sec=day.sections[day.sections.length-1];
        sec.ex.push(ex);
      }
    });
  });
}



/* ═══════════════ REMOVE EX FROM PLAN ═══════════════ */
function removeExFromPlan(id,dk){
  /* Remove from in-memory DATA */
  DATA[dk].sections.forEach(function(sec){
    sec.ex=sec.ex.filter(function(e){return e.id!==id;});
  });
  /* Persist: user-added exercises go from added list, built-ins go to a removed list */
  if(id.indexOf('ep-')===0){
    var addedKey='added-plan-ex-'+dk;
    var added=ls(addedKey,[]).filter(function(e){return e.id!==id;});
    ss(addedKey,added);
  } else {
    var removedKey='removed-plan-ex-'+dk;
    var removed=ls(removedKey,[]);
    if(removed.indexOf(id)<0){removed.push(id);ss(removedKey,removed);}
  }
  buildDay(dk);
}

/* ═══════════════ GYMS TAB ═══════════════ */
var GYM_PRESETS=[
  {bg:'#E6F1FB',text:'#185FA5'},{bg:'#EAF3DE',text:'#3B6D11'},
  {bg:'#FAEEDA',text:'#854F0B'},{bg:'#F3E8F8',text:'#6B2D8B'},
  {bg:'#FDE8E8',text:'#9B1C1C'},{bg:'#E8F8F5',text:'#0E6655'},
  {bg:'#FDF6E3',text:'#7D6608'},{bg:'#F0F0EE',text:'#555555'},
];
var _editGymId=null;
var _selGymBg=GYM_PRESETS[0].bg;
var _selGymText=GYM_PRESETS[0].text;

var GYM_DEFAULTS=[
  {id:'arkady', name:'Form Factory Arkády', bg:'#E6F1FB', text:'#185FA5', fixed:true},
  {id:'pankrac', name:'Maxfitness Pankrác',  bg:'#EAF3DE', text:'#3B6D11', fixed:true},
  {id:'chodov',  name:'Maxfitness Chodov',   bg:'#FAEEDA', text:'#854F0B', fixed:true},
];

function getAllGyms(){
  var custom=ls('customGyms',[]);
  var overrides=ls('gymOverrides',{});
  return GYM_DEFAULTS.concat(custom).map(function(g){
    var ov=overrides[g.id]||{};
    return {id:g.id,name:ov.name||g.name,bg:ov.bg||g.bg,text:ov.text||g.text,fixed:!!g.fixed};
  });
}

function loadGyms(){
  getAllGyms().forEach(function(g){
    GYM_NAMES[g.id]=g.name;
    GYM_COLORS[g.id]=g.bg;
    GYM_TEXT[g.id]=g.text;
  });
}

function buildGymsTab(){
  var gyms=getAllGyms();
  var h='';
  gyms.forEach(function(g){
    h+='<div class="gym-card-item">';
    h+='<div class="gym-color-dot" style="background:'+g.bg+';border-color:'+g.text+';"></div>';
    h+='<span class="gym-card-name">'+g.name+'</span>';
    h+='<button class="gym-edit-btn" onclick="openEditGym(\''+g.id+'\')">✎ Edit</button>';
    if(!g.fixed){
      h+='<button class="gym-del-btn" onclick="deleteGym(\''+g.id+'\')" title="Remove">✕</button>';
    }
    h+='</div>';
  });
  document.getElementById('gym-card-list').innerHTML=h||'<div style="color:#aaa;font-size:12px;">No gyms yet.</div>';
}

function openEditGym(id){
  _editGymId=id;
  var g=getAllGyms().find(function(x){return x.id===id;})||{};
  document.getElementById('add-gym-title').textContent='Edit gym';
  document.getElementById('gym-modal-name').value=g.name||'';
  buildGymColorPicker(g.bg||GYM_PRESETS[0].bg,g.text||GYM_PRESETS[0].text);
  document.getElementById('add-gym-modal').classList.add('open');
  document.getElementById('gym-modal-name').focus();
}

function openAddGymModal(){
  _editGymId=null;
  document.getElementById('add-gym-title').textContent='Add gym';
  document.getElementById('gym-modal-name').value='';
  buildGymColorPicker(GYM_PRESETS[0].bg,GYM_PRESETS[0].text);
  document.getElementById('add-gym-modal').classList.add('open');
  document.getElementById('gym-modal-name').focus();
}

function buildGymColorPicker(selBg,selText){
  _selGymBg=selBg;_selGymText=selText||'#555';
  var h='';
  GYM_PRESETS.forEach(function(p){
    var isSel=p.bg===selBg;
    h+='<div class="gym-color-swatch'+(isSel?' sel':'')+'" style="background:'+p.bg+';border-color:'+(isSel?'#378ADD':'transparent')+'" onclick="pickGymColor(\''+p.bg+'\',\''+p.text+'\',this)"></div>';
  });
  document.getElementById('gym-color-picker').innerHTML=h;
}

function pickGymColor(bg,text,el){
  _selGymBg=bg;_selGymText=text;
  document.querySelectorAll('#gym-color-picker .gym-color-swatch').forEach(function(s){s.classList.remove('sel');s.style.borderColor='transparent';});
  el.classList.add('sel');el.style.borderColor='#378ADD';
}

function closeAddGymModal(){document.getElementById('add-gym-modal').classList.remove('open');}

function confirmAddGym(){
  var name=document.getElementById('gym-modal-name').value.trim();
  if(!name)return;
  if(_editGymId){
    var overrides=ls('gymOverrides',{});
    overrides[_editGymId]=overrides[_editGymId]||{};
    overrides[_editGymId].name=name;
    overrides[_editGymId].bg=_selGymBg;
    overrides[_editGymId].text=_selGymText;
    ss('gymOverrides',overrides);
    /* Sync update to Django */
    apiFetch('POST', '/api/gyms/', {name:name, color:_selGymBg});
  } else {
    var id='gym-'+Date.now();
    var custom=ls('customGyms',[]);
    custom.push({id:id,name:name,bg:_selGymBg,text:_selGymText,fixed:false});
    ss('customGyms',custom);
    /* Sync new gym to Django */
    apiFetch('POST', '/api/gyms/', {name:name, color:_selGymBg});
  }
  loadGyms();
  rebuildGymSelects();
  closeAddGymModal();
  buildGymsTab();
}

function deleteGym(id){
  var custom=ls('customGyms',[]).filter(function(g){return g.id!==id;});
  ss('customGyms',custom);
  delete GYM_NAMES[id];delete GYM_COLORS[id];delete GYM_TEXT[id];
  rebuildGymSelects();
  buildGymsTab();
}

function rebuildGymSelects(){
  var gyms=getAllGyms();
  var opts=gyms.map(function(g){return '<option value="'+g.id+'">'+g.name+'</option>';}).join('');
  ['gym-select','modal-gym','aep-gym'].forEach(function(sid){
    var sel=document.getElementById(sid);if(!sel)return;
    var cur=sel.value;
    sel.innerHTML=opts;
    if(GYM_NAMES[cur])sel.value=cur;
  });
}

/* ═══════════════ PLAN TAB ═══════════════ */
var _customPlans=[];
var _editPlanExId='';
var _editPlanDk='';
var _addSecPlanDk='';

function loadCustomPlans(){_customPlans=ls('customPlans2',[]);}
function saveCustomPlans(){ss('customPlans2',_customPlans);}

function getPlanData(dk){
  if(dk==='a'||dk==='b'||dk==='c') return DATA[dk];
  return _customPlans.find(function(p){return p.id===dk;})||null;
}

function getPlanName(dk){
  if(dk==='a') return 'Upper';
  if(dk==='b') return 'Lower';
  if(dk==='c') return 'Full Body';
  var p=_customPlans.find(function(x){return x.id===dk;});
  return p?p.name:dk;
}

function buildPlanTab(){
  loadCustomPlans();
  var h='';
  [{dk:'a',name:'Upper'},{dk:'b',name:'Lower'},{dk:'c',name:'Full Body'}].forEach(function(p){
    h+=buildPlanCard(p.dk,p.name,false);
  });
  _customPlans.forEach(function(p){h+=buildPlanCard(p.id,p.name,true);});
  var el=document.getElementById('plan-cards');
  if(el) el.innerHTML=h||'<div style="color:#aaa;font-size:12px;padding:10px 0;">No plans yet. Create one above.</div>';
}

function buildPlanCard(dk,name,isDeletable){
  var data=getPlanData(dk);if(!data)return'';
  var totalEx=0;
  data.sections.forEach(function(s){totalEx+=s.ex.length;});
  var h='<div class="plan-card" id="plancard-'+dk+'">';
  h+='<div class="plan-card-header" onclick="togglePlanCard(\''+dk+'\')"> ';
  h+='<span class="plan-card-title">'+name+'</span>';
  h+='<span class="plan-card-badge">'+totalEx+' exercises</span>';
  if(isDeletable){
    h+='<button class="gym-del-btn" onclick="event.stopPropagation();deletePlan(\''+dk+'\')" title="Delete plan">✕</button>';
  }
  h+='<span class="plan-card-chevron">▾</span></div>';
  h+='<div class="plan-card-body">';
  data.sections.forEach(function(sec){
    h+=buildPlanSection(dk,sec);
  });
  h+='<div class="plan-add-sec-row">';
  h+='<button class="plan-add-sec-btn" onclick="openAddSecModal(\''+dk+'\')">+ Add section</button>';
  h+='</div></div></div>';
  return h;
}

function buildPlanSection(dk,sec){
  var secId=sec.label.replace(/[^a-zA-Z0-9]/g,'_');
  var h='<div id="plansec-'+dk+'-'+secId+'">';
  h+='<div class="plan-sec-head">';
  h+='<span class="plan-sec-label">'+sec.label+'</span>';
  h+='<button class="plan-sec-edit-btn" onclick="openEditSecModal(\''+dk+'\',\''+escQ(sec.label)+'\')" title="Rename section">✎</button>';
  h+='<button class="plan-sec-add-btn" onclick="openAddExModal(\''+dk+'\',\''+escQ(sec.label)+'\')">+ Add exercise</button>';
  h+='</div>';
  if(!sec.ex||!sec.ex.length){
    h+='<div class="plan-empty">No exercises. Add one →</div>';
  } else {
    h+='<div id="planexlist-'+dk+'-'+secId+'">';
    sec.ex.forEach(function(ex){h+=buildPlanExRow(dk,ex);});
    h+='</div>';
  }
  h+='</div>';
  return h;
}

function buildPlanExRow(dk,ex){
  var tag=ls('tag-'+ex.id,ex.tag);
  var name=ls('name-'+ex.id,ex.name);
  var sets=ls('s-'+ex.id,ex.sets);
  var reps=ls('r-'+ex.id,ex.reps);
  var w=ls('w-'+ex.id,ex.w);
  var wc=tag==='bar'?'#2a6b3a':tag==='dumbbell'?'#185FA5':tag==='pulley'?'#7a4a0a':'#888';
  var h='<div class="plan-ex-row" id="planexrow-'+ex.id+'">';
  h+='<div class="plan-ex-name-cell">';
  h+='<span class="'+tagClass(tag)+'" style="font-size:8px;padding:1px 4px;flex-shrink:0;">'+tagLabel(tag)+'</span>';
  h+='<span class="plan-ex-name">'+name+'</span>';
  h+='</div>';
  h+='<span class="plan-ex-cell">'+sets+'×</span>';
  h+='<span class="plan-ex-cell">'+reps+'</span>';
  h+='<span class="plan-ex-wt" style="color:'+wc+';">'+w+' kg</span>';
  h+='<button class="gym-edit-btn" style="font-size:10px;padding:2px 7px;" onclick="openEditPlanEx(\''+ex.id+'\',\''+dk+'\')">✎ Edit</button>';
  h+='<button class="plan-del-btn" onclick="removePlanEx(\''+ex.id+'\',\''+dk+'\')">✕</button>';
  h+='</div>';
  return h;
}

function togglePlanCard(dk){
  var c=document.getElementById('plancard-'+dk);
  if(c) c.classList.toggle('open');
}

/* Edit exercise in plan */
function openEditPlanEx(id,dk){
  _editPlanExId=id;_editPlanDk=dk;
  document.getElementById('epe-name').value=ls('name-'+id,'');
  document.getElementById('epe-tag').value=ls('tag-'+id,'accessory');
  document.getElementById('epe-sets').value=ls('s-'+id,3);
  document.getElementById('epe-reps').value=ls('r-'+id,'10');
  document.getElementById('epe-w').value=ls('w-'+id,0);
  document.getElementById('edit-plan-ex-modal').classList.add('open');
  document.getElementById('epe-name').focus();
}
function closeEditPlanExModal(){document.getElementById('edit-plan-ex-modal').classList.remove('open');}
function confirmEditPlanEx(){
  var id=_editPlanExId;
  var name=document.getElementById('epe-name').value.trim();if(!name)return;
  var tag=document.getElementById('epe-tag').value;
  var sets=parseInt(document.getElementById('epe-sets').value)||3;
  var reps=document.getElementById('epe-reps').value.trim()||'10';
  var w=parseFloat(document.getElementById('epe-w').value)||0;
  ss('name-'+id,name);ss('tag-'+id,tag);ss('s-'+id,sets);ss('r-'+id,reps);ss('w-'+id,w);
  closeEditPlanExModal();
  buildPlanTab();
  if(_editPlanDk==='a'||_editPlanDk==='b'||_editPlanDk==='c') buildDay(_editPlanDk);
  // Reopen card
  var c=document.getElementById('plancard-'+_editPlanDk);
  if(c) c.classList.add('open');
}

/* Remove exercise from plan */
function removePlanEx(id,dk){
  var data=getPlanData(dk);if(!data)return;
  data.sections.forEach(function(sec){
    sec.ex=sec.ex.filter(function(e){return e.id!==id;});
  });
  if(dk==='a'||dk==='b'||dk==='c'){
    if(id.indexOf('ep-')===0){
      var addedKey='added-plan-ex-'+dk;
      ss(addedKey,ls(addedKey,[]).filter(function(e){return e.id!==id;}));
    } else {
      var removedKey='removed-plan-ex-'+dk;
      var removed=ls(removedKey,[]);
      if(removed.indexOf(id)<0){removed.push(id);ss(removedKey,removed);}
    }
    buildDay(dk);
  } else {
    saveCustomPlans();
  }
  buildPlanTab();
  var c=document.getElementById('plancard-'+dk);
  if(c) c.classList.add('open');
}

/* Delete entire custom plan */
function deletePlan(id){
  _customPlans=_customPlans.filter(function(p){return p.id!==id;});
  saveCustomPlans();buildPlanTab();
}

/* New Plan modal */
function openNewPlanModal(){
  document.getElementById('np-name').value='';
  document.getElementById('new-plan-modal').classList.add('open');
  document.getElementById('np-name').focus();
}
function closeNewPlanModal(){document.getElementById('new-plan-modal').classList.remove('open');}
function confirmNewPlan(){
  var name=document.getElementById('np-name').value.trim();if(!name)return;
  loadCustomPlans();
  var plan={id:'cp-'+Date.now(),name:name,sections:[]};
  _customPlans.push(plan);saveCustomPlans();
  closeNewPlanModal();buildPlanTab();
  setTimeout(function(){
    var c=document.getElementById('plancard-'+plan.id);
    if(c)c.classList.add('open');
  },50);
}

/* Add section modal */
function openAddSecModal(dk){
  _addSecPlanDk=dk;
  document.getElementById('as-name').value='';
  document.getElementById('add-sec-modal').classList.add('open');
  document.getElementById('as-name').focus();
}
function closeAddSecModal(){document.getElementById('add-sec-modal').classList.remove('open');}
function confirmAddSection(){
  var label=document.getElementById('as-name').value.trim();if(!label)return;
  var data=getPlanData(_addSecPlanDk);if(!data)return;
  data.sections.push({label:label,ex:[]});
  if(_addSecPlanDk!=='a'&&_addSecPlanDk!=='b'&&_addSecPlanDk!=='c') saveCustomPlans();
  closeAddSecModal();buildPlanTab();
  var c=document.getElementById('plancard-'+_addSecPlanDk);
  if(c) c.classList.add('open');
}

/* ═══════════════ EDIT SECTION LABEL ═══════════════ */
var _editSecDk='',_editSecOldLabel='';
function openEditSecModal(dk,oldLabel){
  _editSecDk=dk;_editSecOldLabel=oldLabel;
  document.getElementById('es-name').value=oldLabel;
  document.getElementById('edit-sec-modal').classList.add('open');
  document.getElementById('es-name').focus();
  document.getElementById('es-name').select();
}
function closeEditSecModal(){document.getElementById('edit-sec-modal').classList.remove('open');}
function confirmEditSec(){
  var newLabel=document.getElementById('es-name').value.trim();if(!newLabel)return;
  var data=getPlanData(_editSecDk);if(!data)return;
  var sec=data.sections.find(function(s){return s.label===_editSecOldLabel;});
  if(!sec)return;
  sec.label=newLabel;
  if(_editSecDk!=='a'&&_editSecDk!=='b'&&_editSecDk!=='c') saveCustomPlans();
  closeEditSecModal();buildPlanTab();
  var c=document.getElementById('plancard-'+_editSecDk);
  if(c) c.classList.add('open');
}

/* ═══════════════ INIT ═══════════════ */
extraExercises=ls('extraExercises',[]);
loadGyms();
loadCustomPlans();
rebuildGymSelects();
/* Restore removed built-in exercises */
['a','b','c'].forEach(function(dk){
  var removed=ls('removed-plan-ex-'+dk,[]);
  if(removed.length){
    DATA[dk].sections.forEach(function(sec){
      sec.ex=sec.ex.filter(function(e){return removed.indexOf(e.id)<0;});
    });
  }
});
restoreAddedPlanEx();
/* Init day picker to today */
(function(){
  var dp=document.getElementById('day-picker');
  if(!dp)return;
  var saved=ls('selectedDate','');
  if(!saved){
    var now=new Date();
    var m=String(now.getMonth()+1).padStart(2,'0');
    var d=String(now.getDate()).padStart(2,'0');
    saved=now.getFullYear()+'-'+m+'-'+d;
  }
  dp.value=saved;
})();

/* ══ PROFILE ══ */
function saveProfile(){
  var p={
    name:document.getElementById('pf-name').value,
    surname:document.getElementById('pf-surname').value,
    age:document.getElementById('pf-age').value,
    weight:document.getElementById('pf-weight').value,
    height:document.getElementById('pf-height').value,
    gender:ls('pf-gender','')
  };
  ss('profile',JSON.stringify(p));
  updateProfileDisplay(p);
  /* Sync name/surname to Django */
  apiFetch('POST', '/api/profile/', { name: p.name, surname: p.surname });
}

function setGender(val){
  ss('pf-gender',val);
  document.querySelectorAll('.profile-gender-btn').forEach(function(b){
    b.classList.toggle('profile-gender-active', b.getAttribute('data-val')===val);
  });
  saveProfile();
}

function updateProfileDisplay(p){
  var nameStr=((p.name||'')+ ' '+(p.surname||'')).trim();
  var el=document.getElementById('profile-display-name');
  if(el) el.textContent=nameStr||'Your Profile';

  /* Avatar initial */
  var av=document.getElementById('profile-avatar');
  if(av) av.textContent=p.name?p.name[0].toUpperCase():'🏋️';

  /* Stats cards */
  var sc=document.getElementById('profile-stats');
  if(!sc) return;
  var cards=[];
  if(p.weight&&p.height){
    var bmi=(p.weight/((p.height/100)*(p.height/100))).toFixed(1);
    var cat=bmi<18.5?'Underweight':bmi<25?'Normal':bmi<30?'Overweight':'Obese';
    cards.push({icon:'⚖️',label:'BMI',value:bmi,sub:cat});
  }
  if(p.weight) cards.push({icon:'🏋️',label:'Weight',value:p.weight+' kg',sub:''});
  if(p.height) cards.push({icon:'📏',label:'Height',value:p.height+' cm',sub:''});
  if(p.age)    cards.push({icon:'🎂',label:'Age',value:p.age+' yrs',sub:''});
  sc.innerHTML=cards.map(function(c){
    return '<div class="profile-stat-card"><div class="psc-icon">'+c.icon+'</div><div class="psc-val">'+c.value+'</div><div class="psc-label">'+c.label+(c.sub?' · '+c.sub:'')+'</div></div>';
  }).join('');
}

function loadProfile(){
  try{
    var raw=ls('profile','');
    if(!raw) return;
    var p=JSON.parse(raw);
    if(p.name) document.getElementById('pf-name').value=p.name;
    if(p.surname) document.getElementById('pf-surname').value=p.surname;
    if(p.age) document.getElementById('pf-age').value=p.age;
    if(p.weight) document.getElementById('pf-weight').value=p.weight;
    if(p.height) document.getElementById('pf-height').value=p.height;
    if(p.gender) setGender(p.gender);
    updateProfileDisplay(p);
  }catch(e){}
}

/* ═══════════════ USER DATA ISOLATION ═══════════════ */
var KNOWN_USERS=['suja.jozef@gmail.com','suja.jozef@seznam.cz'];

/* Keys to persist per user (all gp5_ keys except system ones) */
function collectUserData(){
  var data={};
  for(var i=0;i<localStorage.length;i++){
    var k=localStorage.key(i);
    if(k&&k.startsWith('gp5_')&&k!=='gp5_currentUser'&&k!=='gp5_users'&&!k.startsWith('gp5_udata_')){
      data[k]=localStorage.getItem(k);
    }
  }
  return data;
}

function saveUserData(){
  var email=localStorage.getItem('gp5_currentUser');
  if(!email)return;
  localStorage.setItem('gp5_udata_'+email,JSON.stringify(collectUserData()));
}

function clearExerciseData(){
  var keys=[];
  for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.startsWith('gp5_'))keys.push(k);}
  keys.filter(function(k){
    return k.startsWith('gp5_w-')||k.startsWith('gp5_s-')||k.startsWith('gp5_r-')||
           k.startsWith('gp5_done-')||k.startsWith('gp5_pr-')||k.startsWith('gp5_prGym-')||
           k.startsWith('gp5_meta-')||k==='gp5_profile'||k==='gp5_pf-gender';
  }).forEach(function(k){localStorage.removeItem(k);});
}

function seedExerciseData(isKnown){
  Object.keys(DATA).forEach(function(dk){
    DATA[dk].sections.forEach(function(sec){
      sec.ex.forEach(function(ex){
        if(isKnown){
          ss('w-'+ex.id,ex.w);
          ss('s-'+ex.id,ex.sets);
          ss('r-'+ex.id,ex.reps);
          if(ex.pr) ss('pr-'+ex.id,ex.pr);
          if(ex.prGym) ss('prGym-'+ex.id,ex.prGym);
        }else{
          ss('w-'+ex.id,0);
          ss('s-'+ex.id,0);
          ss('r-'+ex.id,'0');
        }
      });
    });
  });
}

function loadUserData(email){
  var stored=localStorage.getItem('gp5_udata_'+email);
  if(stored){
    try{
      clearExerciseData();
      var data=JSON.parse(stored);
      Object.keys(data).forEach(function(k){localStorage.setItem(k,data[k]);});
    }catch(e){}
  }else{
    /* First login — seed data */
    clearExerciseData();
    var isKnown=KNOWN_USERS.indexOf(email)>=0;
    seedExerciseData(isKnown);
    /* Auto-fill profile name from registration */
    var regData=localStorage.getItem('gp5_regdata_'+email);
    if(regData){
      try{
        var rd=JSON.parse(regData);
        var p={name:rd.name||'',surname:'',age:'',weight:'',height:'',gender:''};
        ss('profile',JSON.stringify(p));
      }catch(e){}
    }
    saveUserData();
  }
}

/* ═══════════════ LOGOUT ═══════════════ */
function doLogout(){
  saveUserData();
  /* Always clear local auth — don't wait for network */
  localStorage.removeItem('gp5_currentUser');
  localStorage.removeItem('gp5_apiToken');
  apiFetch('POST', '/api/logout/', null);
  window.location.replace('/');
}

/* ═══════════════ PROFILE MENU ═══════════════ */
function toggleProfileMenu(e){
  e.stopPropagation();
  var m=document.getElementById('profile-menu');
  var isOpen=m.classList.contains('open');
  if(!isOpen){
    /* Set email label */
    var email=localStorage.getItem('gp5_currentUser')||'';
    var el=document.getElementById('profile-menu-email');
    if(el)el.textContent=email;
  }
  m.classList.toggle('open');
}
function closeProfileMenu(){
  var m=document.getElementById('profile-menu');
  if(m)m.classList.remove('open');
}
document.addEventListener('click',function(e){
  if(!e.target.closest('.profile-tab-wrap'))closeProfileMenu();
});

/* ═══════════════ INIT USER SESSION ═══════════════ */
(function(){
  var email=localStorage.getItem('gp5_currentUser');
  if(email){
    loadUserData(email);
    loadProfile();
  }
  /* Build UI AFTER user data is loaded so correct values are shown */
  buildDay('a');buildDay('b');buildDay('c');
  buildWeekGrid();
  buildPlanTab();
  loadMeta('a');
})();

/* ═══════════════ HISTORY / PROGRESS DASHBOARD ═══════════════ */
var _histCharts = {};

function buildHistory() {
  var log = ls('trainlog', []);

  /* ── stat cards ── */
  var statRow = document.getElementById('hist-stat-row');
  if (statRow) {
    var totalSessions = log.length;
    var gymsSet = {};
    var totalVol = 0;
    log.forEach(function(s) {
      if (s.gym) gymsSet[s.gym] = true;
      (s.exercises || []).forEach(function(e) {
        var sets = parseInt(e.sets) || 0;
        var reps = parseInt(e.reps) || 0;
        var wt   = parseFloat(e.weight) || 0;
        totalVol += sets * reps * wt;
      });
    });
    var streak = calcStreak(log);
    statRow.innerHTML =
      statCard('🏋️', 'Total sessions', totalSessions) +
      statCard('🔥', 'Current streak', streak + ' days') +
      statCard('⚡', 'Total volume', Math.round(totalVol / 1000) + 't lifted') +
      statCard('🏟️', 'Gyms visited', Object.keys(gymsSet).length);
  }

  /* ── prepare chart data ── */
  var sessWeekMap  = {};   /* "YYYY-Www" → count */
  var volArr       = [];   /* {label, vol} */
  var durArr       = [];   /* {label, min} */
  var splitCount   = {A:0, B:0, C:0, D:0, Other:0};

  var sorted = log.slice().reverse();   /* oldest first */
  sorted.forEach(function(s) {
    /* sessions per week */
    var d = parseDateStr(s.date);
    if (d) {
      var wk = isoWeek(d);
      sessWeekMap[wk] = (sessWeekMap[wk] || 0) + 1;
    }
    /* volume per session */
    var vol = 0;
    (s.exercises || []).forEach(function(e) {
      vol += (parseInt(e.sets)||0) * (parseInt(e.reps)||0) * (parseFloat(e.weight)||0);
    });
    volArr.push({ label: s.date, vol: Math.round(vol) });
    /* duration */
    var dur = parseInt((s.time||'').replace(/[^0-9]/g,'')) || 0;
    durArr.push({ label: s.date, dur: dur });
    /* split */
    var dayKey = (s.day||'').toUpperCase();
    if (splitCount[dayKey] !== undefined) splitCount[dayKey]++;
    else splitCount['Other']++;
  });

  var wkLabels  = Object.keys(sessWeekMap).slice(-12);
  var wkCounts  = wkLabels.map(function(k){ return sessWeekMap[k]; });

  var recentVol = volArr.slice(-15);
  var recentDur = durArr.slice(-15);

  makeChart('chartSessionsWeek', 'bar',
    wkLabels, wkCounts, 'Sessions', '#378ADD');

  makeChart('chartVolume', 'line',
    recentVol.map(function(x){return x.label;}),
    recentVol.map(function(x){return x.vol;}),
    'Volume (kg)', '#1D9E75');

  makeChart('chartDuration', 'line',
    recentDur.map(function(x){return x.label;}),
    recentDur.map(function(x){return x.dur;}),
    'Duration (min)', '#f0a500');

  makePie('chartSplitPie',
    ['Day A','Day B','Day C','Day D','Other'],
    [splitCount.A, splitCount.B, splitCount.C, splitCount.D, splitCount.Other],
    ['#378ADD','#1D9E75','#f0a500','#E24B4A','#999']);

  /* ── recent sessions list ── */
  var listEl = document.getElementById('hist-session-list');
  if (!listEl) return;
  if (!log.length) {
    listEl.innerHTML = '<div class="hist-empty">No sessions saved yet. Hit the gym! 💪</div>';
    return;
  }
  listEl.innerHTML = log.slice(0, 20).map(function(s) {
    var vol = 0;
    (s.exercises||[]).forEach(function(e){
      vol += (parseInt(e.sets)||0)*(parseInt(e.reps)||0)*(parseFloat(e.weight)||0);
    });
    var exNames = (s.exercises||[]).map(function(e){return e.name;}).join(', ') || '—';
    return '<div class="hist-session-card">' +
      '<div class="hist-sc-head">' +
        '<span class="hist-sc-date">' + (s.date||'') + '</span>' +
        '<span class="hist-sc-badge hist-badge-' + (s.gym||'other') + '">' + (GYM_NAMES[s.gym]||s.gym||'?') + '</span>' +
        (s.day ? '<span class="hist-sc-day">Day ' + s.day.toUpperCase() + '</span>' : '') +
        (s.time ? '<span class="hist-sc-time">⏱ ' + s.time + ' min</span>' : '') +
        (vol ? '<span class="hist-sc-vol">⚡ ' + Math.round(vol) + ' kg</span>' : '') +
      '</div>' +
      '<div class="hist-sc-exlist">' + exNames + '</div>' +
    '</div>';
  }).join('');
}

function statCard(icon, label, value) {
  return '<div class="hist-stat-card">' +
    '<div class="hist-stat-icon">' + icon + '</div>' +
    '<div class="hist-stat-val">' + value + '</div>' +
    '<div class="hist-stat-label">' + label + '</div>' +
  '</div>';
}

function makeChart(id, type, labels, data, label, color) {
  if (_histCharts[id]) { _histCharts[id].destroy(); }
  var ctx = document.getElementById(id);
  if (!ctx) return;
  _histCharts[id] = new Chart(ctx, {
    type: type,
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        backgroundColor: type === 'bar' ? color + '99' : color + '33',
        borderColor: color,
        borderWidth: 2,
        pointRadius: 3,
        tension: 0.35,
        fill: type === 'line'
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { maxRotation: 45, font: { size: 10 } } },
        y: { beginAtZero: true, ticks: { font: { size: 10 } } }
      }
    }
  });
}

function makePie(id, labels, data, colors) {
  if (_histCharts[id]) { _histCharts[id].destroy(); }
  var ctx = document.getElementById(id);
  if (!ctx) return;
  _histCharts[id] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{ data: data, backgroundColor: colors, borderWidth: 2 }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } }
    }
  });
}

function parseDateStr(str) {
  if (!str) return null;
  /* supports DD/MM/YYYY and YYYY-MM-DD */
  var parts = str.split(/[\/-]/);
  if (parts.length !== 3) return null;
  if (parts[0].length === 4) return new Date(parts[0], parts[1]-1, parts[2]);
  return new Date(parts[2], parts[1]-1, parts[0]);
}

function isoWeek(d) {
  var tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  var week = Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
  return tmp.getUTCFullYear() + '-W' + (week < 10 ? '0' : '') + week;
}

function calcStreak(log) {
  if (!log.length) return 0;
  var dates = log.map(function(s){ return parseDateStr(s.date); })
                 .filter(Boolean)
                 .sort(function(a,b){ return b - a; });
  var streak = 0;
  var prev = null;
  for (var i = 0; i < dates.length; i++) {
    var d = new Date(dates[i].getFullYear(), dates[i].getMonth(), dates[i].getDate());
    if (!prev) { streak = 1; prev = d; continue; }
    var diff = (prev - d) / 86400000;
    if (diff <= 2) { streak++; prev = d; } else break;
  }
  return streak;
}

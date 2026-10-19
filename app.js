(function(){
const KEY='petgrowth.v1';
const $=s=>document.querySelector(s);
const today=()=>new Date().toISOString().slice(0,10);
const dayDiff=(a,b)=>Math.round((new Date(a)-new Date(b))/864e5);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const KIND={weight:{n:'体重',c:'w',e:'⚖️'},vaccine:{n:'疫苗',c:'',e:'💉'},deworm:{n:'驱虫',c:'d',e:'🐛'},milestone:{n:'成长瞬间',c:'m',e:'🎉'}};
const EMOJI={猫:'🐱',狗:'🐶',兔子:'🐰',仓鼠:'🐹',其他:'🐾'};

function seed(){
  const d=n=>{const t=new Date();t.setDate(t.getDate()-n);return t.toISOString().slice(0,10)};
  const f=n=>{const t=new Date();t.setDate(t.getDate()+n);return t.toISOString().slice(0,10)};
  return{cur:'p1',tab:'home',filter:'all',pets:[{id:'p1',name:'年糕',type:'猫',breed:'英短蓝猫',gender:'♂',birthday:d(420)}],
  records:[
   {id:1,petId:'p1',kind:'milestone',date:d(420),name:'来到这个世界',note:'出生啦'},
   {id:2,petId:'p1',kind:'milestone',date:d(330),name:'到家第一天',note:'躲在沙发底下不肯出来'},
   {id:3,petId:'p1',kind:'weight',date:d(300),value:1.6},
   {id:4,petId:'p1',kind:'vaccine',date:d(280),name:'猫三联（第1针）',next:d(259)},
   {id:5,petId:'p1',kind:'weight',date:d(240),value:2.8},
   {id:6,petId:'p1',kind:'deworm',date:d(200),name:'体内驱虫',note:'大宠爱',next:d(110)},
   {id:7,petId:'p1',kind:'weight',date:d(150),value:3.9},
   {id:8,petId:'p1',kind:'vaccine',date:d(60),name:'狂犬疫苗',next:f(305)},
   {id:9,petId:'p1',kind:'weight',date:d(30),value:4.4},
   {id:10,petId:'p1',kind:'deworm',date:d(80),name:'体外驱虫',note:'福来恩',next:f(10)},
   {id:11,petId:'p1',kind:'weight',date:d(3),value:4.6}]};
}
let S;try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!S||!S.pets)S=seed();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const pet=()=>S.pets.find(p=>p.id===S.cur)||S.pets[0];
const recsOf=(pid,k)=>S.records.filter(r=>r.petId===pid&&(!k||r.kind===k)).sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id);
const recs=(k)=>recsOf(pet().id,k);
const pad2=n=>String(n).padStart(2,"0");
const ymd=(y,m,d)=>y+"-"+pad2(m+1)+"-"+pad2(d);

function age(b){const d=dayDiff(today(),b);if(d<0)return'未出生';if(d<31)return d+'天';const m=Math.floor(d/30.4);return m<12?m+'个月':Math.floor(m/12)+'岁'+(m%12?m%12+'个月':'')}
function toast(t){const e=$('#toast');e.textContent=t;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>e.hidden=true,1800)}

function reminders(pid){
  return recsOf(pid||pet().id).filter(r=>r.next&&(r.kind==='vaccine'||r.kind==='deworm'))
   .filter(r=>!S.records.some(x=>x.petId===r.petId&&x.kind===r.kind&&x.name===r.name&&x.date>r.date))
   .map(r=>({r,left:dayDiff(r.next,today())})).sort((a,b)=>a.left-b.left);
}
function chart(){
  const w=recs('weight').slice().reverse();
  if(w.length<2)return'<div class="empty">至少记录 2 次体重才能生成曲线</div>';
  const W=420,H=170,p={l:34,r:14,t:14,b:26};
  const t0=new Date(w[0].date),t1=new Date(w[w.length-1].date),vs=w.map(x=>x.value);
  let lo=Math.min.apply(null,vs),hi=Math.max.apply(null,vs);const pad=(hi-lo||1)*.2;lo-=pad;hi+=pad;
  const X=d=>p.l+(t1-t0?(new Date(d)-t0)/(t1-t0):.5)*(W-p.l-p.r);
  const Y=v=>p.t+(1-(v-lo)/(hi-lo))*(H-p.t-p.b);
  const pts=w.map(x=>[X(x.date),Y(x.value),x]);
  const last=pts[pts.length-1];
  let g='';for(let i=0;i<4;i++){const v=lo+(hi-lo)*i/3,y=Y(v);g+=`<line x1="${p.l}" x2="${W-p.r}" y1="${y}" y2="${y}" stroke="#eee"/><text x="${p.l-6}" y="${y+4}" font-size="10" fill="#999" text-anchor="end">${v.toFixed(1)}</text>`}
  const line=pts.map((q,i)=>(i?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)).join('');
  const area=line+`L${last[0]} ${H-p.b}L${pts[0][0]} ${H-p.b}Z`;
  return`<svg class="chart" viewBox="0 0 ${W} ${H}">${g}<path d="${area}" fill="#FFD100" opacity=".22"/><path d="${line}" fill="none" stroke="#FFC300" stroke-width="2.5" stroke-linejoin="round"/>`+
   pts.map(q=>`<circle cx="${q[0]}" cy="${q[1]}" r="4" fill="#fff" stroke="#222" stroke-width="2"/>`).join('')+
   `<text x="${p.l}" y="${H-6}" font-size="10" fill="#999">${w[0].date.slice(2)}</text><text x="${W-p.r}" y="${H-6}" font-size="10" fill="#999" text-anchor="end">${w[w.length-1].date.slice(2)}</text>`+
   `<text x="${last[0]}" y="${last[1]-9}" font-size="11" font-weight="700" text-anchor="end">${w[w.length-1].value}kg</text></svg>`;
}
function recRow(r){
  const k=KIND[r.kind];const main=r.kind==='weight'?`${r.value} kg`:esc(r.name);
  let tag='';if(r.next){const l=dayDiff(r.next,today());tag=l<0?`<span class="tag red">已逾期${-l}天</span>`:l<=14?`<span class="tag y">${l}天后到期</span>`:`<span class="tag green">下次 ${r.next}</span>`}
  return`<div class="row"><div class="grow"><b>${k.e} ${main}</b> ${tag}<br><small>${r.date}${r.note?' · '+esc(r.note):''}</small></div><button class="x" data-del="${r.id}">删除</button></div>`;
}
function petSwitch(){return`<div class="pets">${S.pets.map(p=>`<button class="chip ${p.id===pet().id?'on':''}" data-pet="${p.id}">${EMOJI[p.type]||'🐾'} ${esc(p.name)}</button>`).join('')}<button class="chip" data-act="addpet">＋ 添加宠物</button></div>`}

function coming(ic,t,d,fake){return`<div class="card coming"><div class="ic">${ic}</div><h3 style="justify-content:center">${t}</h3><p>${d}</p><button class="btn" data-soon="${t}">开启后通知我</button>
 <div class="fake">${fake.map(f=>`<div class="row"><div class="avatar" style="width:40px;height:40px;font-size:20px">🐾</div><div class="grow"><b>${f[0]}</b><br><small>${f[1]}</small></div></div>`).join('')}</div></div>`}

function calInit(){const n=new Date();return{y:n.getFullYear(),m:n.getMonth(),sel:today()}}
function streak(pid){
  const days=new Set(S.records.filter(r=>r.petId===pid).map(r=>r.date));
  let n=0;const d=new Date();if(!days.has(today()))d.setDate(d.getDate()-1);
  while(days.has(d.toISOString().slice(0,10))){n++;d.setDate(d.getDate()-1)}
  return n;
}
function calendar(){
  const c=S.cal||(S.cal=calInit());const p=pet();
  const all=recs(),byDay={};all.forEach(r=>{(byDay[r.date]=byDay[r.date]||[]).push(r)});
  const dueDay={};all.forEach(r=>{if(r.next)dueDay[r.next]=r});
  const first=new Date(c.y,c.m,1).getDay(),dim=new Date(c.y,c.m+1,0).getDate();
  let cells='';for(let i=0;i<first;i++)cells+='<span></span>';
  let checked=0;
  for(let d=1;d<=dim;d++){
    const k=ymd(c.y,c.m,d),list=byDay[k]||[];if(list.length)checked++;
    const kinds=[...new Set(list.map(r=>r.kind))];
    cells+=`<button class="day ${k===today()?'today':''} ${k===c.sel?'sel':''} ${list.length?'done':''}" data-day="${k}"><b>${d}</b><em>${kinds.map(x=>`<u class="dot ${x}"></u>`).join('')}${dueDay[k]&&!list.length?'<u class="dot due"></u>':''}</em></button>`;
  }
  const sel=c.sel,sl=byDay[sel]||[],due=dueDay[sel];
  const future=sel>today();
  return petSwitch()+`<div class="card"><div class="calhead"><button class="x" data-calnav="-1">‹</button><b>${c.y}年${c.m+1}月</b><button class="x" data-calnav="1">›</button></div>
  <div class="stats" style="margin:0 0 10px"><div><strong>${streak(p.id)}</strong><span>连续打卡 天</span></div><div><strong>${checked}</strong><span>本月已打卡 天</span></div><div><strong>${all.length}</strong><span>累计记录</span></div></div>
  <div class="week"><span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span></div>
  <div class="grid">${cells}</div>
  <div class="legend"><i class="dot weight"></i>体重 <i class="dot vaccine"></i>疫苗 <i class="dot deworm"></i>驱虫 <i class="dot milestone"></i>瞬间 <i class="dot due"></i>到期日</div></div>
  <div class="card"><h3>${sel}${sel===today()?'（今天）':''}<small>${sl.length?'已打卡 ✓':'未打卡'}</small></h3>
  ${due&&!sl.length?`<div class="row"><div class="grow"><b>${KIND[due.kind].e} ${esc(due.name)} 到期</b><br><small>别忘了今天安排哦</small></div></div>`:''}
  ${sl.map(recRow).join('')||(future?'<div class="empty">未来的日子，还不能打卡</div>':'<div class="empty">这天还没有记录</div>')}
  ${future?'':`<div class="quick" style="margin-top:8px">${['weight','vaccine','deworm','milestone'].map(k=>`<button data-add="${k}" data-date="${sel}"><i>${KIND[k].e}</i>打卡${KIND[k].n}</button>`).join('')}</div>`}</div>`;
}
function spark(pid){
  const w=recsOf(pid,'weight').slice().reverse().slice(-8);if(w.length<2)return'';
  const vs=w.map(x=>x.value),lo=Math.min(...vs),hi=Math.max(...vs);
  const pts=w.map((x,i)=>(i/(w.length-1)*100).toFixed(1)+','+(18-(hi-lo?(x.value-lo)/(hi-lo):.5)*16).toFixed(1)).join(' ');
  return`<svg viewBox="0 0 100 20" width="80" height="24" preserveAspectRatio="none"><polyline points="${pts}" fill="none" stroke="#FFC300" stroke-width="2"/></svg>`;
}
function overview(){
  const rems=[];S.pets.forEach(p=>reminders(p.id).forEach(x=>rems.push(Object.assign({p},x))));
  rems.sort((a,b)=>a.left-b.left);
  const overdue=rems.filter(x=>x.left<0).length,soon=rems.filter(x=>x.left>=0&&x.left<=14).length;
  // 最近 28 天打卡热力
  const cnt={};S.records.forEach(r=>{cnt[r.date]=(cnt[r.date]||0)+1});
  let heat='';for(let i=27;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const k=d.toISOString().slice(0,10),n=cnt[k]||0;heat+=`<i class="h h${Math.min(n,3)}" title="${k} ${n}条"></i>`}
  return`<div class="card"><h3>全局总览<small>${today()}</small></h3><div class="stats" style="margin:0">
   <div><strong>${S.pets.length}</strong><span>宠物</span></div><div><strong>${S.records.length}</strong><span>总记录</span></div><div><strong style="color:${overdue?'var(--red)':'inherit'}">${overdue}</strong><span>已逾期</span></div><div><strong>${soon}</strong><span>14天内到期</span></div></div></div>
  <div class="card"><h3>我的宠物</h3>${S.pets.map(p=>{const w=recsOf(p.id,'weight')[0],nx=reminders(p.id)[0];return`<div class="row" style="cursor:pointer" data-goto="home" data-pet2="${p.id}"><div class="avatar" style="width:44px;height:44px;font-size:24px">${EMOJI[p.type]||'🐾'}</div><div class="grow"><b>${esc(p.name)}</b> <small>${p.birthday?age(p.birthday):''} · 连续打卡${streak(p.id)}天</small><br><small>${w?w.value+'kg':'未记录体重'}${nx?' · 下次'+esc(nx.r.name)+' '+nx.r.next:''}</small></div>${spark(p.id)}</div>`}).join('')}</div>
  <div class="card"><h3>近 28 天打卡<small>全部宠物</small></h3><div class="heat">${heat}</div></div>
  <div class="card"><h3>待办提醒<small>全部宠物</small></h3>${rems.length?rems.slice(0,6).map(x=>`<div class="row"><div class="grow"><b>${KIND[x.r.kind].e} ${esc(x.p.name)} · ${esc(x.r.name)}</b><br><small>${x.r.next}</small></div>${x.left<0?`<span class="tag red">逾期${-x.left}天</span>`:x.left<=14?`<span class="tag y">${x.left}天后</span>`:`<span class="tag green">${x.left}天后</span>`}</div>`).join(''):'<div class="empty">暂无待办 ✅</div>'}</div>`;
}
function community(){
  const seg=S.seg||'friends';
  return`<div class="filters"><button class="chip ${seg==='friends'?'on':''}" data-seg="friends">📍 附近宠友</button><button class="chip ${seg==='share'?'on':''}" data-seg="share">💬 养宠广场</button></div>`+V[seg]();
}

const V={calendar,community,
 home(){
  const p=pet();
  const w=recs('weight'),rem=reminders();
  return petSwitch()+`
  <div class="card"><div class="pet"><div class="avatar">${EMOJI[p.type]||'🐾'}</div><div><b>${esc(p.name)} ${p.gender||''}</b><p>${esc(p.type)} · ${esc(p.breed||'未填品种')}</p><p>生日 ${p.birthday||'-'} · ${p.birthday?age(p.birthday):''}</p></div></div>
   <div class="stats"><div><strong>${w[0]?w[0].value:'-'}</strong><span>当前体重 kg</span></div><div><strong>${recs('vaccine').length}</strong><span>疫苗记录</span></div><div><strong>${recs('deworm').length}</strong><span>驱虫记录</span></div></div></div>
  <div class="card"><div class="quick">
   <button data-add="weight"><i>⚖️</i>记体重</button><button data-add="vaccine"><i>💉</i>打疫苗</button><button data-add="deworm"><i>🐛</i>驱虫</button><button data-add="milestone"><i>🎉</i>成长瞬间</button>
   <button class="soon" data-tab="community"><i>📍</i>附近宠友</button><button class="soon" data-tab="community"><i>📸</i>晒日常</button><button class="soon" data-soon="就医记录"><i>🏥</i>就医</button><button class="soon" data-soon="宠物商城"><i>🛒</i>用品</button></div></div>
  <div class="card"><h3>健康提醒<small>疫苗 / 驱虫到期</small></h3>${rem.length?rem.slice(0,4).map(({r,left})=>`<div class="row"><div class="grow"><b>${KIND[r.kind].e} ${esc(r.name)}</b><br><small>下次：${r.next}</small></div>${left<0?`<span class="tag red">逾期${-left}天</span>`:left<=14?`<span class="tag y">${left}天后</span>`:`<span class="tag green">${left}天后</span>`}</div>`).join(''):'<div class="empty">暂无待办，健康状态良好 ✅</div>'}</div>
  <div class="card"><h3>体重曲线<small><button class="x" data-add="weight">＋记录</button></small></h3>${chart()}</div>
  <div class="card"><h3>疫苗 &amp; 驱虫</h3>${[...recs('vaccine'),...recs('deworm')].sort((a,b)=>b.date.localeCompare(a.date)).map(recRow).join('')||'<div class="empty">还没有记录</div>'}</div>
  <div class="sec">全部宠物总览</div>${overview()}`;
 },
 timeline(){
  const p=pet();const L=recs().filter(r=>S.filter==='all'||r.kind===S.filter);
  const f=[['all','全部'],['weight','体重'],['vaccine','疫苗'],['deworm','驱虫'],['milestone','瞬间']];
  return petSwitch()+`<div class="filters">${f.map(([k,n])=>`<button class="chip ${S.filter===k?'on':''}" data-filter="${k}">${n}</button>`).join('')}</div>
  <div class="card"><h3>${esc(p.name)}的成长时间线<small>共 ${L.length} 条</small></h3>${L.length?`<div class="tl">${L.map(r=>{const k=KIND[r.kind];const d=p.birthday?dayDiff(r.date,p.birthday):null;
   return`<div class="it ${k.c}"><div class="date">${r.date}${d!=null&&d>=0?' · 出生第'+d+'天':''}</div><div class="bd"><b>${k.e} ${r.kind==='weight'?'体重 '+r.value+' kg':esc(r.name)}</b>${r.note?`<br><small style="color:#666">${esc(r.note)}</small>`:''}${r.next?`<br><small style="color:#999">下次 ${r.next}</small>`:''}</div></div>`}).join('')}</div>`:'<div class="empty">暂无内容，去档案页添加记录吧</div>'}</div>`;
 },
 friends(){return coming('📍','附近宠友','按地域匹配同城宠友，交流养宠经验、约遛弯。',[['小橘 · 橘猫','距你 0.8km · 徐汇'],['Coco · 柯基','距你 1.5km · 徐汇'],['布丁 · 金毛','距你 2.3km · 长宁']])},
 share(){return coming('💬','养宠广场','分享养宠日常，图文打卡，评论互动。',[['今天第一次洗澡成功！','年糕的铲屎官 · 12 赞'],['新手养猫避坑指南','猫奴小王 · 86 赞']])}
};

function render(){
  if(!V[S.tab])S.tab='home';
  $('#view').innerHTML=V[S.tab]();
  document.querySelectorAll('.tabbar button').forEach(b=>b.classList.toggle('on',b.dataset.tab===S.tab));
  save();
}
function sheet(html,onsubmit){
  $('#form').innerHTML=html;$('#sheet').hidden=false;
  $('#form').onsubmit=e=>{e.preventDefault();onsubmit(Object.fromEntries(new FormData(e.target)));$('#sheet').hidden=true};
  $('#form').querySelector('[data-close]').onclick=()=>$('#sheet').hidden=true;
}
const acts='<div class="act"><button type="button" class="btn ghost" data-close>取消</button><button class="btn">保存</button></div>';
function addRecord(kind,date){date=date||today();
  const k=KIND[kind];let f='';
  if(kind==='weight')f='<label>体重 (kg)<input name="value" type="number" step="0.01" min="0.01" required></label>';
  else f=`<label>${kind==='vaccine'?'疫苗名称':kind==='deworm'?'驱虫类型':'标题'}<input name="name" required placeholder="${kind==='vaccine'?'如：猫三联':kind==='deworm'?'如：体内驱虫':'如：第一次出门'}"></label>`;
  const nx=(kind==='vaccine'||kind==='deworm')?'<label>下次到期日（可选）<input name="next" type="date"></label>':'';
  const note=kind==='weight'?'':'<label>备注<input name="note" maxlength="60"></label>';
  sheet(`<h4>${k.e} 记录${k.n}</h4><label>日期<input name="date" type="date" value="${date}" max="${today()}" required></label>${f}${nx}${note}${acts}`,d=>{
    const r={id:Date.now(),petId:pet().id,kind,date:d.date};
    if(d.value)r.value=+d.value;if(d.name)r.name=d.name;if(d.next)r.next=d.next;if(d.note)r.note=d.note;
    S.records.push(r);render();toast('已保存');
  });
}
function addPet(){
  sheet(`<h4>添加宠物</h4><label>昵称<input name="name" required maxlength="10"></label><label>种类<select name="type">${Object.keys(EMOJI).map(t=>`<option>${t}</option>`).join('')}</select></label><label>品种<input name="breed" maxlength="12"></label><label>性别<select name="gender"><option>♂</option><option>♀</option></select></label><label>生日<input name="birthday" type="date" max="${today()}"></label>${acts}`,d=>{
    const p=Object.assign({id:'p'+Date.now()},d);S.pets.push(p);S.cur=p.id;render();toast('已添加');
  });
}
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-goto]');if(g){S.cur=g.dataset.pet2;S.tab=g.dataset.goto;render();scrollTo(0,0);return}
  const t=e.target.closest('button');if(!t)return;
  const D=t.dataset;
  if(D.calnav){const c=S.cal||(S.cal=calInit());let m=c.m+ +D.calnav,y=c.y;if(m<0){m=11;y--}if(m>11){m=0;y++}c.y=y;c.m=m;c.sel=null;render()}
  else if(D.day){S.cal.sel=D.day;render()}
  else if(D.seg){S.seg=D.seg;render()}
  else if(D.tab){S.tab=D.tab;render();scrollTo(0,0)}
  else if(D.add)addRecord(D.add,D.date);
  else if(D.pet){S.cur=D.pet;render()}
  else if(D.filter){S.filter=D.filter;render()}
  else if(D.act==='addpet')addPet();
  else if(D.soon)toast('「'+D.soon+'」即将上线');
  else if(D.del&&confirm('确定删除这条记录？')){S.records=S.records.filter(r=>r.id!=D.del);render()}
});
$('#sheet .mask').onclick=()=>{$('#sheet').hidden=true};
render();
})();

// THEME
(function(){const s=localStorage.getItem('theme'),p=matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',(s|| (p?'dark':'light'))==='dark');})();
function toggleTheme(){const d=document.documentElement.classList.toggle('dark');localStorage.setItem('theme',d?'dark':'light');renderThemeIcon();}
function renderThemeIcon(){const b=document.getElementById('themeBtn');if(!b)return;b.innerHTML=`<i data-lucide="${document.documentElement.classList.contains('dark')?'sun':'moon'}" class="w-5 h-5"></i>`;if(window.lucide)lucide.createIcons();}

// PATHS
const inAct=()=>location.pathname.includes('/atividades/'); const rootRel=p=>inAct()?`../${p}`:p;

// AUTH
const isAuth=()=>localStorage.getItem('auth')==='1';
function requireAuth(){const isLogin=/index\.html$|\/$/.test(location.pathname); if(!isLogin && !isAuth()) location.replace(rootRel('index.html'));}
function login(){localStorage.setItem('auth','1'); location.replace(rootRel('home.html'));}
function logout(){localStorage.removeItem('auth'); location.replace(rootRel('index.html'));}

// NAV highlight
function highlightNav(){const f=location.pathname.split('/').pop()||'index.html';document.querySelectorAll('footer.navbar a').forEach(a=>{const d=a.getAttribute('href').split('/').pop();a.classList.toggle('text-primary',d===f||(f==='index.html'&&d==='home.html'));}); if(window.lucide)lucide.createIcons();}

// SPARK
function drawBars(){const el=document.getElementById('bars');if(!el)return;el.innerHTML='';[60,52,70,82,65,90].forEach(v=>{const b=document.createElement('div');b.className='w-2 rounded-full bg-primary/30';b.style.height=(v/100*48)+'px';el.appendChild(b);});}

// HISTÓRICO
const getHistory=()=>{try{return JSON.parse(localStorage.getItem('history')||'[]')}catch(e){return []}};
const setHistory=a=>localStorage.setItem('history',JSON.stringify(a));
const addHistory=e=>{const h=getHistory();h.unshift(e);setHistory(h);};
const fmtTime=s=>{const h=String(Math.floor(s/3600)).padStart(2,'0'),m=String(Math.floor(s%3600/60)).padStart(2,'0'),sec=String(Math.floor(s%60)).padStart(2,'0');return `${h}:${m}:${sec}`;};

class ActivityTimer{
  constructor(tipo){this.tipo=tipo;this.run=false;this.el=0;this.anchor=0;this._t=null;this.$d=document.getElementById('timer');this.$s=document.getElementById('startBtn');this.$p=document.getElementById('pauseBtn');this.$f=document.getElementById('finishBtn');this.bind();this.update();}
  bind(){this.$s&&(this.$s.onclick=()=>this.start());this.$p&&(this.$p.onclick=()=>this.pause());this.$f&&(this.$f.onclick=()=>this.finish());}
  start(){if(this.run)return;this.run=true;this.anchor=Date.now()-this.el*1000;this._t=setInterval(()=>{this.el=Math.floor((Date.now()-this.anchor)/1000);this.update();},250);this.$s.classList.add('hidden');this.$p.classList.remove('hidden');this.$f.classList.remove('hidden');toast('Gravação iniciada');}
  pause(){if(!this.run)return;this.run=false;clearInterval(this._t);this.$s.classList.remove('hidden');this.$p.classList.add('hidden');toast('Gravação pausada');}
  finish(){clearInterval(this._t);addHistory({tipo:this.tipo,inicio:new Date(this.anchor).toISOString(),fim:new Date().toISOString(),duracao:this.el,calorias:Math.round(this.el*6/5)});toast('Atividade salva');setTimeout(()=>location.replace(rootRel('historico.html')),450);}
  update(){this.$d&&(this.$d.textContent=fmtTime(this.el));}
}
function initActivityPage(){const el=document.getElementById('activityRoot'); if(!el)return; window._timer=new ActivityTimer(el.dataset.tipo);}

// Tabela histórico
function renderHistory(){const body=document.getElementById('historyRows'); if(!body) return; const rows=getHistory().map(r=>`<tr>
<td class="px-3 py-2 bg-white dark:bg-neutral-900 rounded-l-xl border border-neutral-200 dark:border-neutral-800">${new Date(r.fim).toLocaleDateString()}</td>
<td class="px-3 py-2 bg-white dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800">${r.tipo}</td>
<td class="px-3 py-2 bg-white dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800">${fmtTime(r.duracao)}</td>
<td class="px-3 py-2 bg-white dark:bg-neutral-900 rounded-r-xl border border-neutral-200 dark:border-neutral-800">${r.calorias} kcal</td>
</tr>`).join(''); body.innerHTML=rows||`<tr><td colspan="4" class="py-6 text-center text-sm text-neutral-500">Sem atividades</td></tr>`; const t=document.getElementById('totalPts'); if(t) t.textContent=getHistory().reduce((a,b)=>a+b.calorias,0);}

// Avatar
function initAvatar(){const i=document.getElementById('avatarInput'), img=document.getElementById('avatarImg'); if(!i||!img) return; const s=localStorage.getItem('avatar'); if(s) img.src=s; i.onchange=e=>{const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{localStorage.setItem('avatar',r.result); img.src=r.result; toast('Foto atualizada');}; r.readAsDataURL(f);}}

// Toast (mobile-like)
function toast(msg){const t=document.createElement('div');t.className='fixed left-1/2 -translate-x-1/2 bottom-24 md:bottom-10 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs shadow-card dark:bg-neutral-800';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>{t.style.opacity='0';t.style.transition='opacity .3s';},1200);setTimeout(()=>t.remove(),1600);}

// SW
if('serviceWorker' in navigator){ addEventListener('load', ()=>{ navigator.serviceWorker.register(rootRel('sw.js')).catch(()=>{}); }); }

// INIT
addEventListener('DOMContentLoaded', ()=>{ requireAuth(); highlightNav(); renderThemeIcon(); drawBars(); initActivityPage(); renderHistory(); });
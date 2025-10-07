
(()=>{const s=localStorage.getItem('theme'),p=matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',(s||(p?'dark':'light'))==='dark')})();
function toggleTheme(){const d=document.documentElement.classList.toggle('dark');localStorage.setItem('theme',d?'dark':'light');try{document.getElementById('themeBtn').innerHTML=`<i data-lucide="${document.documentElement.classList.contains('dark')?'sun':'moon'}" class="w-5 h-5"></i>`;lucide.createIcons()}catch{}}
const inAct=()=>location.pathname.includes('/atividades/'); const rootRel=p=>inAct()?`../${p}`:p;
const isAuth=()=>localStorage.getItem('auth')==='1';
function requireAuth(){const p=location.pathname;const isLogin=/login\.html$/.test(p),isSplash=/index\.html$|\/$/.test(p);if(!isLogin&&!isSplash&&!isAuth())location.replace(rootRel('login.html'));}
function login(){localStorage.setItem('auth','1');location.replace(rootRel('home.html'));}
function logout(){localStorage.removeItem('auth');location.replace(rootRel('login.html'));}
function runSplash(){if(!document.getElementById('splash'))return;setTimeout(()=>location.replace('login.html'),1000);}
function drawBars(){const el=document.getElementById('bars');if(!el)return;el.innerHTML='';[60,52,70,82,65,90].forEach(v=>{const b=document.createElement('div');b.className='w-2 rounded-full bg-primary/30';b.style.height=(v/100*48)+'px';el.appendChild(b);});}
const H=()=>{try{return JSON.parse(localStorage.getItem('history')||'[]')}catch{return []}}, S=a=>localStorage.setItem('history',JSON.stringify(a));
const T=s=>{const h=String(Math.floor(s/3600)).padStart(2,'0'),m=String(Math.floor(s%3600/60)).padStart(2,'0'),c=String(Math.floor(s%60)).padStart(2,'0');return `${h}:${m}:${c}`};
class Timer{constructor(tipo){this.tipo=tipo;this.run=false;this.el=0;this.anchor=0;this._t=null;this.d=document.getElementById('timer');this.s=document.getElementById('startBtn');this.p=document.getElementById('pauseBtn');this.f=document.getElementById('finishBtn');this.bind();this.u();}
bind(){this.s&& (this.s.onclick=()=>this.start());this.p&& (this.p.onclick=()=>this.pause());this.f&& (this.f.onclick=()=>this.finish());}
start(){if(this.run)return;this.run=true;this.anchor=Date.now()-this.el*1000;this._t=setInterval(()=>{this.el=Math.floor((Date.now()-this.anchor)/1000);this.u()},250);this.s.classList.add('hidden');this.p.classList.remove('hidden');this.f.classList.remove('hidden');toast('Gravando...')}
pause(){if(!this.run)return;this.run=false;clearInterval(this._t);this.s.classList.remove('hidden');this.p.classList.add('hidden');toast('Pausado')}
finish(){clearInterval(this._t);const a=H();a.unshift({tipo:this.tipo,duracao:this.el,fim:new Date().toISOString(),calorias:Math.round(this.el*6/5)});S(a);toast('Atividade salva');setTimeout(()=>location.replace(rootRel('historico.html')),400)}
u(){this.d&&(this.d.textContent=T(this.el))}}
function initActivity(){const r=document.getElementById('activityRoot');if(r)window._t=new Timer(r.dataset.tipo);}
function toast(m){const t=document.createElement('div');t.className='fixed left-1/2 -translate-x-1/2 bottom-24 px-3 py-2 rounded-xl bg-neutral-900 text-white text-xs';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),1200);}
function renderHistory(){const b=document.getElementById('historyRows');if(!b)return;const rows=H().map(r=>`<tr><td class='px-3 py-2'>${new Date(r.fim).toLocaleDateString()}</td><td class='px-3 py-2'>${r.tipo}</td><td class='px-3 py-2'>${T(r.duracao)}</td><td class='px-3 py-2'>${r.calorias} kcal</td></tr>`).join('');b.innerHTML=rows||`<tr><td colspan='4' class='py-6 text-center text-sm text-neutral-500'>Sem atividades</td></tr>`;const t=document.getElementById('totalPts');if(t)t.textContent=H().reduce((a,b)=>a+b.calorias,0)}
if('serviceWorker'in navigator){addEventListener('load',()=>navigator.serviceWorker.register(rootRel('sw.js')).catch(()=>{}))}
addEventListener('DOMContentLoaded',()=>{requireAuth();drawBars();initActivity();renderHistory();runSplash();try{lucide.createIcons()}catch{}});

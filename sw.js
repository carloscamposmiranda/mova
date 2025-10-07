const CACHE='movimento-pwa-v5';
const ASSETS=['./','index.html','home.html','historico.html','perfil.html','app.js','manifest.webmanifest','assets/icon-192.png','assets/icon-512.png',
'atividades/corrida.html','atividades/bike.html','atividades/caminhada.html','atividades/cardio.html','atividades/trilha.html','atividades/caminhada-leve.html',
'https://cdn.tailwindcss.com','https://unpkg.com/lucide@latest/dist/umd/lucide.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))); self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE&&caches.delete(k))))); self.clients.claim();});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(x=>{const y=x.clone(); caches.open(CACHE).then(c=>c.put(e.request,y)); return x;}).catch(()=>caches.match('index.html'))));});
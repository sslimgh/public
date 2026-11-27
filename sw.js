/* 바른글 원정대 앱 — 크게 바뀌면 아래 번호를 올려요 (휴대폰이 새 버전을 받아요) */
const CACHE='bareungeul-v2026-11-27-4';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(K=>Promise.all(K.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
/* 게임 화면은 인터넷 먼저(새 버전 바로), 안 되면 저장해 둔 것. 서버(Apps Script) 요청은 건드리지 않아요 */
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
 /* 인터넷이 4초 넘게 느리면 저장해 둔 게임을 먼저 열고, 새 파일은 뒤에서 받아 다음에 써요 */
 const net=fetch(e.request).then(r=>{if(r&&r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return r});e.waitUntil(net.catch(()=>{}));
 e.respondWith((async()=>{const saved=await caches.match(e.request)||(e.request.mode==='navigate'?await caches.match('./index.html'):null);
  if(!saved)return net.catch(()=>caches.match('./index.html'));
  return Promise.race([net.catch(()=>saved),new Promise(ok=>setTimeout(()=>ok(saved),4000))])})())});

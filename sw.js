// 目的: 入口ページを初回に読み込んだらオフラインでも開けるようにする。
// 方針: cache-first。index.html を変えたら CACHE を変える（md5の先頭8桁を使う）。
// ★ scope は '/' なので /java-silver/ への移動もアプリ内に留まる。
//   ただし /java-silver/ 自身は別の Service Worker が持っているので、ここでは取りに行かない。
const CACHE = 'apps-index-8ac5a25c';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  if (u.pathname.startsWith('/java-silver/')) return;   // 別アプリの担当
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});

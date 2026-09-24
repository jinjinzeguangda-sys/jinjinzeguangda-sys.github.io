// 目的: 入口ページを初回に読み込んだらオフラインでも開けるようにする。
// 方針: cache-first。index.html を変えたら CACHE を変える（md5の先頭8桁を使う）。
// ★ scope は '/' なので /<アプリ>/ への移動もインストール済みアプリ内に留まる。
//   ただし各アプリは自前の Service Worker を持つので、ここでは入口の分だけを扱う。
const CACHE = 'apps-index-dd55e573';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
// 入口が担当するパス。これ以外は素通しし、各アプリのSWに任せる
const MINE = new Set(['/', '/index.html', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png']);

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  // ★消してよいのは「入口の古いキャッシュ」だけ。
  //   接頭辞で絞らないと、同じオリジンに同居する各アプリのキャッシュまで巻き添えで消える
  e.waitUntil(
    caches.keys().then(ks => Promise.all(
      ks.filter(k => k.startsWith('apps-index-') && k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  if (!MINE.has(u.pathname)) return;                    // 各アプリのSWの担当
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

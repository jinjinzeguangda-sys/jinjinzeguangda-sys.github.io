// 目的: 入口ページ(/hub/)をオフラインでも開けるようにする。
// ★消してよいのは自分の接頭辞のキャッシュだけ。絞らないと同居する37アプリの分まで消える。
const CACHE = 'hub-index-939a3d2c';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
const MINE = new Set(['/hub/', '/hub/index.html', '/hub/manifest.webmanifest',
                      '/hub/icon-192.png', '/hub/icon-512.png']);

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
const STALE = /^hub-index-[0-9a-f]{8}$/;   // ★接頭辞だけだと java-bronze が java-bronze-drill を消す（2026-09-25 実測）
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(
      ks.filter(k => STALE.test(k) && k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  if (!MINE.has(u.pathname)) return;
  // ページは network-first（cache-first だと直した版が永久に届かない）
  const isPage = e.request.mode === 'navigate' || u.pathname.endsWith('/hub/')
              || u.pathname.endsWith('/hub/index.html');
  if (isPage) {
    e.respondWith(fetch(e.request).then(r => {
      const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r;
    }).catch(() => caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
});

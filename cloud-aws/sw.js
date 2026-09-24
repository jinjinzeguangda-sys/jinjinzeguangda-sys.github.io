// このアプリ1本ぶんのキャッシュ。CACHE名は index.html の md5 から作る
// （名前を上げないと端末に古い版が残り続ける）
const CACHE = 'app-cloud-aws-77b16233';
const ASSETS = ['./', './index.html', './manifest.webmanifest'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== CACHE && k.startsWith('app-cloud-aws-')).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

// 入口は /hub/ へ移した。この scope "/" の Service Worker は自分を解除する。
// ★消すキャッシュは 'apps-index-' の接頭辞だけ（同居する37アプリの分を巻き添えにしない）
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const ks = await caches.keys();
    await Promise.all(ks.filter(k => k.startsWith('apps-index-')).map(k => caches.delete(k)));
    await self.registration.unregister();
  })());
});

# jinjinzeguangda-sys.github.io

自作の問題集アプリの**入口ページ**。`https://jinjinzeguangda-sys.github.io/` で配信される。

- ホーム画面に追加 / インストールすると、ブラウザのバーが無い全画面で起動する
- `scope` がサイトのルートなので、`/java-silver/` への移動も**アプリの中に留まる**
- claude.ai の artifact へのリンクは、ブラウザに切り替わる（あちらは iframe の中なので全画面にできない）
- 作業コピー: `~/.local/share/jinji_maintenance/standalone/site`
- `noindex,nofollow` を入れてある（公開リポジトリだが検索には出さない）

更新したら `sw.js` の `CACHE` を index.html の md5 先頭8桁に合わせて変えること。

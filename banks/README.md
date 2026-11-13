# 問題集フォルダー

問題集は、1つの問題集につき1つのフォルダーに分けて置きます。

| フォルダー | 内容 |
| --- | --- |
| `ccar-f-foundations/` | 内蔵の問題集「CCAR-F Foundations」（144問・英語／日本語／简体中文） |
| `n2-202307/` | 内蔵の問題集「JLPT N2 2023年7月」 |
| `n2-202312/` | 内蔵の問題集「JLPT N2 2023年12月」（元の JSON は `samples/n2-202312.json`） |
| `n2-202407/` | 内蔵の問題集「JLPT N2 2024年7月」（元の JSON は `samples/n2-202407.json`） |

- JLPT N2 の内蔵問題集は `manifest.js` の一覧（`N2_BANK_KEYS`）から自動で読み込まれます。`manifest.js` は `tools/n2-builder.js` が `banks/n2-<yyyymm>/` を走査して自動生成するので、手で編集しないでください。
- N2 の問題集は、`node tools/serve.js` を起動した状態で `http://localhost:8080/import.html` から取り込むと、`samples/` への保存、`question-bank.js` の生成、`manifest.js` の更新まで自動で行われます。サーバーなしの場合は `node tools/build-n2-bank.js` を使います。
- N2 以外の内蔵問題集を追加する場合は、同じ形でフォルダーを作り、`index.html` の `<script>` と `app.js` の読み込み処理を合わせて変更してください。
- JSON 形式の問題集は、フォルダーに置く必要はありません。取り込み画面（`import.html`）から取り込むと、ブラウザー内に保存され、練習画面の「問題集」から選べます。
- 取り込み用の JSON の書き方は、プロジェクト直下の `README.md` と取り込み画面の「ファイルの形式」を参照してください。

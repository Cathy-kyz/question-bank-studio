# CCAR-F Foundations（内蔵問題集）

| ファイル / フォルダー | 役割 |
| --- | --- |
| `questions.js` | 領域（DOMAINS）の定義と、問題の元データ（QUESTIONS、予備） |
| `question-bank.js` | 152問の英語原文（`window.IMPORTED_QUESTIONS`）。`tools/import_questions.py` で生成 |
| `translations/` | 日本語・簡体字中国語の翻訳を分割した JSON（`ja-style-guide.md` は訳語のルール） |
| `translation-bank.js` | 上記翻訳の統合版。`tools/build_translation_bank.py` で生成 |

翻訳を修正したら、`python tools/build_translation_bank.py` を実行して `translation-bank.js` を作り直してください。

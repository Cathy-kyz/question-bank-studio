# 日本語訳スタイルガイド（参照教材反映）

CC英単語対策の「紛らわしいペア」とCCAR-F対策の付録用語集を基準に、設問・選択肢・解説の訳語を統一する。

## 固定訳・概念
- agentic loop: エージェンティックループ
- workflow: ワークフロー（workflow vs agent は、事前定義フローと自律的なエージェントを区別）
- prompt chaining: プロンプトチェイニング
- routing: ルーティング
- parallelization: 並列化
- orchestrator-workers: オーケストレーター・ワーカー
- evaluator-optimizer: 評価者・最適化者
- subagent: サブエージェント
- context window: コンテキストウィンドウ
- context isolation: コンテキスト分離
- context rot: コンテキスト腐敗
- compaction: コンパクション
- structured note-taking: 構造化ノート
- just-in-time retrieval: ジャストインタイム検索
- graceful degradation: 緩やかな劣化（部分的な失敗時も成功分で継続し、欠損を明示）
- transient error / permanent error: 一時的エラー／恒久的エラー
- exponential backoff: 指数バックオフ
- circuit breaker: サーキットブレーカー
- idempotency: べき等性
- provenance: 来歴（出典・根拠の追跡可能性）
- escalation: 人間・上位担当者へのエスカレーション／引き継ぎ
- delegate: 委任（サブエージェント等へタスクを任せる）。escalationと混同しない。
- human-in-the-loop gate: 人間の承認ゲート（不可逆・高影響操作に限定）
- end-state evaluation: 末端結果評価
- first-contact resolution: 初回解決率
- tool use: ツール呼び出し／ツール利用（単なるツール所有と区別）
- structured output: 構造化出力
- few-shot prompting: 少数例（few-shot）プロンプティング。判断基準・形式を例で示すこと。
- explicit criteria: 明示的基準
- fail-closed: 検証・認可を確定できない場合に処理を許可しない（安全側に倒す）
- validate: スキーマ・形式・ルールへの適合を検証する
- verify: 独立した情報源で事実を確認／裏を取る。validateと混同しない。

## 紛らわしい語の区別
- implicit / explicit: 暗黙の／明示的な（explicitは指示・条件が書かれている）
- inclusive / exclusive: 境界値を含む／含まない（以下／未満）
- precede / follow: 先行する／後続する
- converge / diverge: 収束する／発散する（結果がばらける）
- feasible / viable: 実行可能な／継続可能な（コスト面などで持続可能）
- brittle / robust: 壊れやすい／堅牢な
- mitigate / alleviate: リスクを軽減する／負荷・症状を和らげる
- transient / intermittent: 一時的な／断続的な（再試行の可否と再現条件探索を区別）
- deterministic / probabilistic: 決定論的な／確率的な
- omit / discard: 省略する（最初から含めない）／破棄する（保持済みのものを捨てる）
- escalate / delegate: 人間・上位へ引き継ぐ／サブエージェント等へ委任する（方向が逆）

## 設問の限定語
- BEST / MOST / LEAST: 「最も適切」「最多」「最少」など、相対比較の指示として訳す。
- EXCEPT / NOT: 「〜を除き」「該当しないもの」など、否定・反転条件を明示する。
- unless: 「〜でない限り」（if notとして読む）。
- regardless of: 「〜に関わらず／〜を問わず」（条件に左右されない）。
- despite / notwithstanding: 「〜にもかかわらず」（逆接で後半が主張）。
- whenever: 「〜するたびに／必ず」（単なるwhenより反復・例外なしが強い）。
- subsequent: 「それ以降の／後続の」。
- at the expense of: 「〜を犠牲にして」。
- contingent on: 「〜を条件とする／〜次第の」。
- in lieu of: 「〜の代わりに」。

## 文章方針
- 技術・製品名（Claude Code、MCP、Agent SDK、tool名、JSON Schema、CLAUDE.md等）は原則そのまま保持し、必要なら初出で短く説明。
- 日本語として自然で簡潔にしつつ、条件・否定・比較・因果・選択肢間の違いを削らない。
- 正解が変わるような意訳や、原文にない説明を追加しない。選択肢の順番と数は維持（Q78は原文どおり3択）。
- 正答か誤答かの方向を示す訳語、特に「すべて／一部」「必ず／場合によって」「許可／拒否」「保存／破棄」を厳密にする。

## CCAR-F対策 用語集との統一
- agentic loop: エージェンティックループ（「エージェントループ」と混在させない）
- workflow vs agent: 事前定義されたワークフロー／動的に行動を選ぶエージェント
- orchestrator-workers / evaluator-optimizer: オーケストレーター・ワーカー／評価者・最適化者
- ACI (agent-computer interface): エージェントとツールの接点
- poka-yoke: ポカヨケ（ツール仕様でミスを構造的に防ぐ設計）
- tools / resources / prompts (MCP): ツール／リソース／プロンプト。制御主体は model / application / user の順にモデル／アプリケーション／ユーザー
- sampling / elicitation / roots: サンプリング／エリシテーション／ルーツ（ファイルシステム境界）
- stdio / Streamable HTTP: 固有名は英語のまま。ローカルはstdio、リモートはStreamable HTTP
- allowed-tools: 列挙ツールの事前承認（利用禁止ではない。禁止はpermissionsのdeny）
- plan mode: プランモード（読み取り専用の調査・計画提示の後、承認を得て実行）
- hooks: フック（ライフサイクルの指定時点で実行される決定論的処理）
- headless mode: 非対話モード／非対話実行
- effort scaling: 労力スケーリング
- nullable fields: null許容フィールド
- validation-retry loop: 検証リトライループ（具体的な検証エラーを返し、上限付きで再試行）
- Message Batches API / prompt caching / LLM-as-judge / multi-pass review: 製品・機能名は英語のまま保持（必要なら初出で短く説明）
- escalation / handoff package: エスカレーション／引き継ぎパッケージ。確認済み事実・試行済みアクション・推奨する次の対応を含める
- end-state evaluation / first-contact resolution: 末端結果評価／初回解決率

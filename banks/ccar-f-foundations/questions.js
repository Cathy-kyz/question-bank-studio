/* Original practice items inspired by the exam's published topic distribution; not copied from the PDF. */
const DOMAINS = [
  { id: "code", weight: 36, en: "Claude Code Configuration and Workflows", ja: "Claude Codeの設定とワークフロー", zh: "Claude Code 配置与工作流" },
  { id: "prompt", weight: 27, en: "Prompt Engineering and Structured Output", ja: "プロンプト設計と構造化出力", zh: "提示设计与结构化输出" },
  { id: "mcp", weight: 19, en: "Tool Design and MCP Integration", ja: "ツール設計とMCP連携", zh: "工具设计与 MCP 集成" },
  { id: "agent", weight: 31, en: "Agentic Architecture and Orchestration", ja: "エージェントアーキテクチャとオーケストレーション", zh: "智能体架构与编排" },
  { id: "reliability", weight: 39, en: "Context Management and Reliability", ja: "コンテキスト管理と信頼性", zh: "上下文管理与可靠性" }
];

const QUESTIONS = [
  {
    id: 1, domain: "code",
    prompt: {
      en: "A team's CI review repeatedly flags an accepted pattern in test code. Which approach consistently applies the team's conventions in every new review session?",
      ja: "チームのCIレビューで、テストコード内の許容済みパターンが毎回誤検出されます。新しいレビューセッションにも一貫して適用される対策はどれですか？",
      zh: "团队的 CI 代码审查总是误报测试代码中已获准的模式。哪种做法能让后续每次审查都一致地应用团队约定？"
    },
    options: [
      { en: "Document the accepted pattern and its scope in the project's CLAUDE.md", ja: "許容パターンと適用範囲をプロジェクトのCLAUDE.mdに記載する", zh: "将允许的模式及其适用范围写入项目的 CLAUDE.md" },
      { en: "Post-process reviews to remove every finding containing known false-positive keywords", ja: "誤検出語を含むレビュー結果を後処理で一律削除する", zh: "在后处理阶段统一删除包含误报关键词的审查结果" },
      { en: "Ask developers to type a lengthy explanation into every review request", ja: "毎回のレビューで開発者が長い説明を手入力する", zh: "要求开发者在每次审查时手动输入冗长说明" },
      { en: "Remove surrounding code and send only changed lines to the model", ja: "周辺コードを除外し、変更行だけをモデルに渡す", zh: "排除周边代码，只把变更行发送给模型" }
    ], answer: 0,
    explanation: {
      en: "CLAUDE.md provides persistent project conventions and workflow guidance. Defining the scope of an exception helps the model distinguish intentional patterns from real issues. Keyword filtering can hide genuine problems.",
      ja: "CLAUDE.mdはプロジェクトの規約やワークフローを継続的に伝える場所です。例外の適用範囲も明記すれば、モデルが意図的なパターンと問題を区別しやすくなります。キーワード除去は本当の問題まで隠すおそれがあります。",
      zh: "CLAUDE.md 适合持续提供项目规范和工作流。明确例外的适用范围，有助于模型区分有意采用的模式与真实问题。按关键词删除结果可能会掩盖真正的问题。"
    }
  },
  {
    id: 2, domain: "code",
    prompt: {
      en: "A team wants to guarantee mechanically that tests run after changes, rather than merely asking Claude Code to run them. Which design is most appropriate?",
      ja: "Claude Codeに変更後のテスト実行を促すだけでなく、テストが必ず実行されたことを機械的に保証したいと考えています。最も適切な設計はどれですか？",
      zh: "团队不只希望 Claude Code 在修改后主动运行测试，还希望以机械化方式确保测试一定执行。哪种设计最合适？"
    },
    options: [
      { en: "Emphasize 'always run tests' in the prompt", ja: "プロンプトに「必ずテストする」と強調して書く", zh: "在提示中反复强调“必须运行测试”" },
      { en: "Run the test command from an appropriate workflow hook and report failures", ja: "ワークフローの適切なフックでテストコマンドを実行し、失敗を通知する", zh: "在工作流的适当钩子中执行测试命令，并报告失败" },
      { en: "Rely only on the model's self-assessment to decide whether to run tests", ja: "テスト実行の判断をモデルの自己評価だけに任せる", zh: "仅依靠模型自我判断是否运行测试" },
      { en: "Remove testing from CI to avoid failures", ja: "失敗を避けるためCIからテスト工程を外す", zh: "为避免失败，从 CI 中移除测试步骤" }
    ], answer: 1,
    explanation: {
      en: "Mandatory deterministic checks should run in hooks or CI. Prompts can encourage desired behavior, but they are not enforcement mechanisms and cannot guarantee execution.",
      ja: "必須の決定的チェックはフックやCIで実行するのが適切です。プロンプトは望ましい行動を促せますが、実行を保証する制御機構の代わりにはなりません。",
      zh: "强制性、确定性的检查应由钩子或 CI 执行。提示可以引导期望行为，但不能替代能够保证执行的控制机制。"
    }
  },
  {
    id: 3, domain: "prompt",
    prompt: {
      en: "A downstream system accepts only data that strictly conforms to a JSON schema. Which approach most reliably stabilizes the format of extracted content?",
      ja: "下流システムが厳密なJSONスキーマ以外を受け付けません。抽出内容の形式を安定させる方法として最も堅牢なのはどれですか？",
      zh: "下游系统只接受严格符合 JSON Schema 的数据。哪种方法最能可靠地固定抽取结果的格式？"
    },
    options: [
      { en: "Ask for JSON only and store the result without validating it", ja: "JSONのみを返すよう依頼し、結果を検証せずに保存する", zh: "要求只返回 JSON，然后不经验证直接保存" },
      { en: "Prefill an opening brace to force the response format", ja: "回答の先頭に左中括弧を付けて、形式を強制する", zh: "在回答开头预填左花括号，以强制格式" },
      { en: "Define a tool with schema-constrained inputs and validate the result after the call", ja: "スキーマに合う入力を受け取るツールを定義し、呼び出し後も結果を検証する", zh: "定义一个接收符合目标 Schema 的输入的工具，并在调用后验证结果" },
      { en: "Partially repair invalid JSON with regular expressions and use it", ja: "失敗したJSONを正規表現で部分的に修正して使う", zh: "用正则表达式局部修复无效 JSON 后直接使用" }
    ], answer: 2,
    explanation: {
      en: "Defining the schema as tool input encourages a structured call. Validate it in the application too, and use bounded retries or error handling to protect the downstream contract.",
      ja: "スキーマをツール入力として定義すると構造化された呼び出しを促せます。さらにアプリケーション側で検証し、失敗時は限定的に再試行またはエラー処理することで、下流の契約を守れます。",
      zh: "将 Schema 定义为工具输入可引导模型生成结构化调用。应用端仍应验证结果，并在失败时进行有限重试或错误处理，以保障下游契约。"
    }
  },
  {
    id: 4, domain: "prompt",
    prompt: {
      en: "A system extracts meeting times from documents, but some invitations omit the time zone. Which design handles this without inventing a value?",
      ja: "文書から会議日時を抽出するシステムで、タイムゾーンが記載されていない招待状が届くことがあります。誤った値を捏造せずに処理する設計はどれですか？",
      zh: "从文档中提取会议时间的系统有时会收到未注明时区的邀请。哪种设计能避免编造错误值？"
    },
    options: [
      { en: "Always fill in the most common time zone", ja: "最も一般的なタイムゾーンを常に補完する", zh: "始终补入最常见的时区" },
      { en: "Allow an unknown value in the schema and request clarification when needed", ja: "スキーマで不明値を表現できるようにし、必要なら確認を求める", zh: "让 Schema 能表示未知值，并在必要时请求澄清" },
      { en: "Remove the date-time field from the output", ja: "日時フィールドを出力から削除する", zh: "从输出中删除日期时间字段" },
      { en: "Choose a candidate at random and validate only the JSON syntax", ja: "候補をランダムに選んで、JSONの形式だけ検証する", zh: "随机选择一个候选值，只验证 JSON 格式" }
    ], answer: 1,
    explanation: {
      en: "Structured outputs should define explicit representations for uncertainty, such as null or unknown, and conditions that require clarification. Validate format and factual accuracy separately.",
      ja: "構造化出力では、nullやunknownなどの明示的な不確実性表現と、確認が必要な条件を定義します。形式の妥当性と事実の正確さは別々に検証する必要があります。",
      zh: "结构化输出应定义 null 或 unknown 等不确定性表示，以及需要澄清的条件。格式有效性与事实准确性需要分别验证。"
    }
  },
  {
    id: 5, domain: "mcp",
    prompt: {
      en: "An MCP-connected system has a read-only product manual that users consult frequently. Which basic design lets the model access its contents?",
      ja: "MCP接続先に、頻繁に参照する読み取り専用の製品マニュアルがあります。モデルが内容を参照できるようにする基本設計として適切なのはどれですか？",
      zh: "MCP 服务器上有一份经常查阅的只读产品手册。哪种基础设计适合让模型访问其内容？"
    },
    options: [
      { en: "Expose a Resource for reading the content, and use a Tool when an action is needed", ja: "内容の取得・参照にはResourceを公開し、操作が必要な場合にToolを使う", zh: "通过 Resource 提供内容读取；需要执行操作时再使用 Tool" },
      { en: "Expose only a Tool that deletes the document", ja: "文書を削除するToolだけを公開する", zh: "只公开一个删除文档的 Tool" },
      { en: "Use a Resource to read the document because Resources are only for executing actions", ja: "Resourceは実行アクション専用なので、文書の読取に使う", zh: "Resource 专用于执行操作，因此用它读取文档" },
      { en: "Send every file on the server for every request without access controls", ja: "アクセス制御をせず、サーバー内の全ファイルを毎回送る", zh: "不做访问控制，每次发送服务器上的所有文件" }
    ], answer: 0,
    explanation: {
      en: "Resources are suitable for readable context provided to the model. Tools represent actions such as searching or updating. Limit access to what is necessary.",
      ja: "Resourceはモデルに提供する読み取り可能なコンテキストに適しています。Toolは検索や更新などの操作を表します。公開範囲は必要最小限に制限します。",
      zh: "Resource 适合提供可读取的上下文；Tool 用于表示搜索、更新等操作。公开范围应遵循最小权限原则。"
    }
  },
  {
    id: 6, domain: "mcp",
    prompt: {
      en: "An MCP Tool can update customer records. Which combination best limits the impact of mistakes and supports auditing?",
      ja: "MCP Toolで顧客レコードを更新する機能を提供します。誤操作の影響を小さくし、監査可能にする組み合わせはどれですか？",
      zh: "某 MCP Tool 可以更新客户记录。哪种组合最能降低误操作影响并满足审计要求？"
    },
    options: [
      { en: "Grant administrator access to all data and let the model decide the inputs", ja: "全データへの管理者権限を付与し、入力をモデルに任せる", zh: "授予所有数据的管理员权限，并让模型自行处理输入" },
      { en: "Limit update scope, validate inputs, check authorization, keep audit records, and require approval for sensitive actions", ja: "更新対象を限定し、入力検証・権限確認・監査記録を行い、重要操作は承認を求める", zh: "限制可更新范围，执行输入验证、权限检查和审计记录；重要操作需审批" },
      { en: "Always return a success-looking response to hide errors", ja: "エラーを隠すため、成功したように見える応答を常に返す", zh: "为隐藏错误，始终返回看似成功的响应" },
      { en: "Perform updates without informing users and do not keep logs", ja: "ユーザーに見えないまま更新を実行し、ログを残さない", zh: "在用户不知情的情况下执行更新且不留日志" }
    ], answer: 1,
    explanation: {
      en: "Write-capable Tools should enforce least privilege, strict input validation, authorization, and auditability. Add human approval before destructive or high-impact actions.",
      ja: "更新系Toolは最小権限、厳密な入力検証、認可、監査可能性を備えるべきです。破壊的または影響の大きい操作には、実行前の人間による確認を加えます。",
      zh: "写入类 Tool 应具备最小权限、严格输入验证、授权检查和审计能力。对于破坏性或影响重大的操作，应在执行前加入人工确认。"
    }
  },
  {
    id: 7, domain: "agent",
    prompt: {
      en: "A team is considering multiple agents for a low-risk task that only summarizes one document. Which design judgment is most reasonable?",
      ja: "単一の文書を要約するだけの低リスク処理に、検索・分析・執筆を行う複数のエージェント構成を検討しています。設計判断として最も妥当なのはどれですか？",
      zh: "对于仅需总结单份文档的低风险任务，团队正在考虑由搜索、分析和写作多个智能体组成的架构。哪种判断最合理？"
    },
    options: [
      { en: "Always use multiple agents for future extensibility", ja: "将来の拡張性のため、常に複数エージェントを使う", zh: "为了未来扩展，始终使用多智能体" },
      { en: "Start with one agent and split only when clear specialization or quality needs justify it", ja: "まず単一エージェントで実装し、明確な分業や品質上の必要が確認された場合に分割する", zh: "先用单一智能体实现，只有在明确需要分工或提升质量时再拆分" },
      { en: "Launch a separate agent for every sentence", ja: "各文ごとに独立したエージェントを起動する", zh: "为每个句子启动一个独立智能体" },
      { en: "Do not implement summarization to avoid coordination costs", ja: "調整コストを避けるため、要約処理を実装しない", zh: "为避免协调成本，不实现总结功能" }
    ], answer: 1,
    explanation: {
      en: "For simple, well-scoped tasks, a single agent reduces coordination, latency, and failure points. Use multiple agents when benefits such as independent specialization or parallelism justify the added cost.",
      ja: "単純で範囲の明確なタスクでは、単一エージェントの方が調整・遅延・失敗点を抑えられます。複数エージェントは独立した専門作業や並列化など、追加コストに見合う利点がある場合に選びます。",
      zh: "对于简单且边界明确的任务，单一智能体可以减少协调、延迟和故障点。只有当独立专业分工或并行处理带来的收益超过额外成本时，才应采用多智能体。"
    }
  },
  {
    id: 8, domain: "agent",
    prompt: {
      en: "An agent repeatedly searches external sources and summarizes results. Which limits should its stopping conditions include for safe operation?",
      ja: "エージェントが外部検索と要約を繰り返すループを実行します。安全に運用するため、停止条件として含めるべきものはどれですか？",
      zh: "智能体会循环执行外部搜索和总结。为了安全运行，停止条件应包含什么？"
    },
    options: [
      { en: "Continue without limits until the model feels it has done enough", ja: "モデルが十分だと感じるまで無制限に続ける", zh: "一直运行，直到模型认为足够为止，不设上限" },
      { en: "Set iteration, time, and cost limits, with a stop or escalation path if the goal is not met", ja: "最大反復数・時間・コストを設定し、未達時の終了または人への引継ぎを定義する", zh: "设置最大迭代次数、时间和成本，并定义未完成时的终止或升级处理" },
      { en: "Ignore all errors and continue the loop", ja: "すべてのエラーを無視してループを継続する", zh: "忽略所有错误并继续循环" },
      { en: "Always treat the first search result as completion", ja: "最初の検索結果だけで必ず完了とする", zh: "无论如何都以第一次搜索结果作为完成" }
    ], answer: 1,
    explanation: {
      en: "An agent loop needs success criteria plus iteration, time, and cost limits, along with termination or escalation paths for failures and uncertainty.",
      ja: "エージェントループには、成功条件に加えて反復回数、時間、コストなどの上限と、失敗・不確実時の終了やエスカレーション経路が必要です。",
      zh: "智能体循环除了成功条件，还需要迭代次数、时间和成本等上限，以及失败或不确定时的终止与升级路径。"
    }
  },
  {
    id: 9, domain: "reliability",
    prompt: {
      en: "A long-running research task is nearing its context limit. Which approach preserves important evidence while allowing work to continue?",
      ja: "長時間の調査タスクでコンテキスト上限が近づいています。作業を継続しつつ重要な根拠を失わない方法はどれですか？",
      zh: "长时间研究任务即将达到上下文窗口上限。哪种做法能继续工作并尽量保留关键依据？"
    },
    options: [
      { en: "Indiscriminately truncate prior conversation and keep only the conclusion", ja: "過去の会話を無差別に切り捨て、結論だけを残す", zh: "不加区分地截断历史对话，只保留结论" },
      { en: "Save a compact state with verified facts, sources, open questions, and next steps, while keeping key evidence retrievable", ja: "検証済みの事実、引用元、未解決事項、次の手順を要約した状態として保存し、必要な根拠を再取得可能にする", zh: "将已验证事实、来源、未解决事项和下一步压缩为状态，并确保必要依据可重新获取" },
      { en: "Keep appending the entire conversation each time", ja: "すべての会話を毎回追加し続ける", zh: "每次都继续追加完整对话" },
      { en: "Remove citations to minimize token count alone", ja: "出典を削除してトークン数だけを最小化する", zh: "删除来源信息，只追求最少 token 数" }
    ], answer: 1,
    explanation: {
      en: "Good compaction is more than shortening text. Preserve verified information and sources, open questions, and next actions, and make important source material retrievable when needed.",
      ja: "有効な圧縮は単なる短縮ではありません。検証済み情報と出典、未解決事項、次の行動を保持し、重要な原文やデータを必要時に再取得できるようにします。",
      zh: "有效的压缩不只是缩短文本。它应保留已验证信息、来源、未解决事项和下一步，并允许在需要时重新获取关键原文或数据。"
    }
  },
  {
    id: 10, domain: "reliability",
    prompt: {
      en: "A payment API times out, leaving it unclear whether the server completed the transaction. Which recovery design avoids duplicate charges?",
      ja: "決済APIの応答がタイムアウトし、処理がサーバー側で完了したか不明です。二重請求を避けながら回復する設計はどれですか？",
      zh: "支付 API 超时，无法确定服务器端是否已完成处理。哪种设计能在恢复时避免重复扣款？"
    },
    options: [
      { en: "Resend the same request repeatedly without conditions", ja: "同じ要求を無条件に何度も再送する", zh: "不加判断地重复发送相同请求" },
      { en: "Use an idempotency key and status lookup, with bounded retries and backoff", ja: "べき等キーと状態照会を利用し、再試行回数・待機時間を制限する", zh: "使用幂等键和状态查询，并限制重试次数与等待时间" },
      { en: "Treat a timeout as success and keep no record", ja: "タイムアウトを成功と見なし、記録を残さない", zh: "将超时视为成功且不做记录" },
      { en: "Always ask the customer to pay again after a timeout", ja: "タイムアウト後に顧客へ再決済を必ず依頼する", zh: "超时后必定要求客户重新支付" }
    ], answer: 1,
    explanation: {
      en: "For operations with side effects, idempotency prevents duplicate execution and status lookup confirms the outcome. Bound retries, use backoff, and escalate ambiguous states to an operator.",
      ja: "副作用を伴う処理では、べき等性によって同じ要求の重複実行を抑え、状態照会で結果を確認します。再試行には上限とバックオフを設け、曖昧な状態は運用担当へ引き継ぎます。",
      zh: "对于有副作用的操作，应通过幂等性避免重复执行，并查询状态确认结果。重试应设置上限和退避策略；状态仍不明确时应升级给运维人员。"
    }
  }
];

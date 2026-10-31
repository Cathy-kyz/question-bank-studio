// Generated from the user-provided question text by tools/import_questions.py.
// English source text is preserved; translations are not fabricated.
window.IMPORTED_QUESTIONS = [
  {
    "id": 1,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline.\nThe system runs automated code reviews, generates test cases, and provides feedback on pull requests. You\nneed to design prompts that provide actionable feedback and minimize false positives.\n\nThe automated review consistently flags patterns your team uses intentionally—force-unwrapping optionals\nin test files, using large coordinator classes that follow your established architecture, and importing internally\nmaintained modules marked as deprecated in the public SDK. Developers dismiss approximately 30% of all\nfindings as project-specific false positives.\n\nWhich approach prevents the model from generating these findings in the first place by supplying the project’\ns conventions as persistent context during every review?"
    },
    "options": [
      {
        "en": "Document the team’s accepted patterns and intentional conventions in the project’s CLAUDE.md file\nso the model receives this context during every review."
      },
      {
        "en": "Configure the review to analyze only the changed lines in the diff without the surrounding file context,\nreducing the amount of code the model evaluates."
      },
      {
        "en": "Build post-processing keyword filters that suppress findings containing terms such as “force unwrap,”\n“large class,” or “deprecated import” before results reach developers."
      },
      {
        "en": "Have developers add inline suppression comments at flagged lines and preprocess diffs to exclude\nsuppressed lines before sending code to the model."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A supplies the missing project context before Claude evaluates the code. Anthropic’s CLAUDE.md\ndocumentation defines project-level files as persistent, version-controlled instructions for coding standards,\narchitecture, workflows, and conventions. The described exceptions are stable repository facts: force-\nunwrapping is permitted in tests, coordinator classes follow an intentional pattern, and an internally\nmaintained dependency remains approved despite its public deprecation status. Recording these facts\nconcisely allows every review session to interpret the patterns correctly.\n\nOption B removes surrounding evidence and would make architectural and cross-file judgments less reliable.\nOption C hides findings after generation and can suppress genuine bugs containing the same keywords.\n\nOption D adds noise to source files and distributes policy across individual call sites instead of documenting it\ncentrally. The CLAUDE.md entries should be specific and scoped—for example, limiting the force-\nunwrapping exception to test paths rather than approving it globally. Anthropic notes that shorter, precise\ninstructions are followed more consistently, so the file should state the accepted convention, its scope, and\nany conditions that would still make the pattern reportable."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 2,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates\nto specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one\ngenerates reports. The system researches topics and produces comprehensive, cited reports.\n\nA user expands the research system beyond its original web-search agent by adding specialized data sources.\nA financial API agent returns structured JSON containing revenue, margins, and growth rates. A news-\nmonitoring agent returns prose summaries of recent developments. A patent-analysis agent returns structured\nlists of technology areas. The synthesis agent combines these results into executive briefings. Currently, it\nconverts everything into bullet points, causing financial comparisons to lose tabular clarity and news\nsummaries to lose their narrative flow.\n\nWhat change would most improve briefing quality?"
    },
    "options": [
      {
        "en": "Standardize all subagent outputs as prose summaries with inline citations."
      },
      {
        "en": "Add a format-conversion layer that transforms every subagent output into a common intermediate\nrepresentation."
      },
      {
        "en": "Update the synthesis agent to render each content type appropriately—for example, financial data as\ntables, news as prose, and patent areas as structured lists."
      },
      {
        "en": "Standardize all subagent outputs as JSON containing claim , evidence , source , and confidence fields."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C preserves the information structure that makes each source useful. Financial metrics share\ncomparable fields and therefore benefit from rows, columns, aligned units, and reporting periods. News\nfindings require connected prose to preserve chronology and causal relationships, while patent technology\nareas are naturally represented as categorized lists. Anthropic’s output-consistency guidance recommends\nspecifying the exact output format needed for the task rather than relying on an unspecified default. Anthropic’\ns discussion of its multi-agent research system also recognizes specialized output stages for reports, structured\ndata, and visualizations because specialist prompts can produce better results than generic coordinator\nprocessing. Option A destroys the comparative structure of numerical data. Option D can provide a useful\nprovenance contract internally but does not determine how the executive briefing should present\nheterogeneous content. Option B risks creating a lowest-common-denominator representation that discards\nsource-specific advantages. The synthesis contract should preserve normalized facts and provenance\ninternally while directing the report generator to select presentation forms according to the content’s semantic\nstructure and the executive reader’s needs."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 3,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and\nmaintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.\n\nYour system must extract event details from calendar invitations and output JSON that strictly conforms to a\nschema with fields for title, date, time, location, and attendees. Downstream systems reject any malformed or\nnon-conformant JSON.\n\nWhat approach provides the most reliable schema compliance?"
    },
    "options": [
      {
        "en": "Pre-fill Claude’s response with an opening brace to force JSON output, then complete and parse the\nresponse."
      },
      {
        "en": "Append instructions like “Output only valid JSON matching the schema exactly” and implement retry\nlogic to re-prompt when JSON parsing fails."
      },
      {
        "en": "Define a tool with your target schema as input parameters and have Claude call it with the extracted\ndata."
      },
      {
        "en": "Include detailed JSON formatting instructions and the target schema in your prompt, then parse Claude’\ns text response as JSON."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "A tool definition converts the desired extraction structure into an explicit machine-readable contract. Claude\nreturns the event information inside a tool_use block, with the tool arguments corresponding to the properties\ndefined by the tool’s input_schema . Anthropic specifies that custom tool parameters are described using\nJSON Schema, allowing the application to extract the structured arguments directly rather than attempting to\nrecover JSON from ordinary prose. For current implementations, adding strict: true to the tool definition\nprovides guaranteed conformance of tool-call inputs to the declared schema. ( https://docs.anthropic.com/en\n/docs/agents-and-tools/tool-use/implement-tool-use )\n\nOptions A, B, and D remain prompt-based formatting techniques. They may improve the probability of valid\nJSON, but none creates the same schema-enforced interface. Prefilling an opening brace constrains the\nbeginning of the response without guaranteeing valid field names, required properties, or data types. Retry\nlogic detects failures only after generation and adds latency. Detailed formatting instructions can still produce\nmalformed or structurally incorrect output.\n\nAnthropic now also provides Structured Outputs for direct, schema-validated JSON responses. Within the\noptions presented, however, a schema-defined tool is the only approach that establishes an explicit structured-\noutput boundary rather than relying primarily on text-generation compliance. ( https://docs.anthropic.com/en\n/docs/test-and-evaluate/strengthen-guardrails/increase-consistency )\n\nOfficial references/topics: Tool Definitions, JSON Schema Input Contracts, Strict Tool Use, Structured\nOutputs."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 4,
    "domain": "mcp",
    "category": "Tool Design and MCP Integration",
    "prompt": {
      "en": "You have configured the system so that all four subagents have access to the complete set of 18 tools. During\ntesting, agents frequently call tools outside their specialization—the synthesis agent attempts web searches,\nand the report generator tries to analyze documents. What is the primary cause of this poor tool-selection\nbehavior?"
    },
    "options": [
      {
        "en": "The agents’ role descriptions in their system prompts conflict with having access to tools outside those\nroles."
      },
      {
        "en": "The tool definitions consume too much context-window space, leaving insufficient room for task\ncontent."
      },
      {
        "en": "The coordinator cannot track which capabilities each subagent has, leading to misrouted tasks."
      },
      {
        "en": "Choosing from 18 tools instead of four or five relevant tools increases decision complexity beyond\nreliable selection thresholds."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "Option D identifies the primary cause. Every extra tool is another option the model has to rule out on\neach call. With 18 tools, many of them plausible for a given step (web search looks useful to a synthesizer that\nwants more data), selection reliability drops and agents drift outside their specialization. The fix is to scope each\nsubagent’s tools to its role, giving each one the four or five tools it actually needs. This smaller, relevant choice\nset reduces decision complexity and makes irrelevant tool selection less likely.\n\nThe agents’ role descriptions guide behavior, but do not remove unrelated tools from the set available to them.\nCoordinator routing is not the issue described: the misuse happens after agents receive their tasks. The central\nproblem is exposing all 18 tools to every subagent instead of applying role-specific tool access."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 5,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JSON schemas, and maintains high accuracy. It must\nhandle edge cases gracefully and integrate with downstream systems.\n\nAfter implementing tool use with strict schema definitions, JSON syntax errors are eliminated, but 5% of\nextractions still contain empty arrays or null values for required fields such as citations and methodology.\nSpot-checking reveals that the source documents contain this information, but in varied formats—inline\ncitations versus bibliographies, and methodology sections versus details embedded in introductions.\n\nWhat is the most effective way to address these failures?"
    },
    "options": [
      {
        "en": "Implement retry logic that resends requests when validation detects empty required fields."
      },
      {
        "en": "Add few-shot examples demonstrating extractions from documents with varied structures, showing how\nto identify citations in different formats and locate methodology details across section types."
      },
      {
        "en": "Build a regex-based post-processing layer that scans source documents for citation patterns and\nmethodology keywords, populating empty fields when the model fails to extract them."
      },
      {
        "en": "Modify the schema to make citations and methodology optional, and flag incomplete records for\nmanual review instead of failing validation."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B targets the remaining failure mode: semantic recognition across heterogeneous document structures.\nStrict schemas eliminate malformed JSON and can guarantee that tool inputs conform to declared types, but\nthey cannot force Claude to locate evidence that appears under unfamiliar headings or in atypical sections.\nAnthropic’s prompting guidance says that a few relevant, diverse, structured examples are among the most\nreliable ways to improve accuracy and consistency. Examples should therefore show inline citations,\nreference lists, numbered bibliographies, methodology sections, and methods embedded in introductions, each\npaired with the correct extracted structure. This teaches the intended evidence-location and granularity rules\nrather than merely repeating the same request. Option A retries an unchanged prompt and can reproduce the\nsame omission. Option C introduces brittle regex rules that may miss nonstandard citations and mistake\nkeyword mentions for methodology content. Option D suppresses validation failures by weakening the\ncontract, but it does not improve extraction and would convert recoverable omissions into incomplete records.\nThe examples should be drawn from real failure cases, evaluated on a held-out set, and expanded when\nmonitoring reveals new layouts. Schema constraints and few-shot coverage solve different layers of reliability\nand should be used together."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 6,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are using Claude Code to accelerate software development. Your team uses it for code generation,\nrefactoring, debugging, and documentation. You need to integrate it into your development workflow with\ncustom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct\nexecution.\n\nYou need to add a date validation check ensuring event dates are in the future. This requires adding a\nconditional statement to one existing function in a single file.\n\nWhat is the most appropriate approach?"
    },
    "options": [
      {
        "en": "Use direct execution to make the change."
      },
      {
        "en": "Start with extended thinking mode enabled to ensure thorough reasoning about the validation logic."
      },
      {
        "en": "Enter plan mode first to create a detailed implementation strategy before making the change."
      },
      {
        "en": "Enter plan mode to analyze how the validation might impact other parts of the reservation flow."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "This change is narrow, localized, and already defined: add one conditional validation check to an existing\nfunction in a single file. A separate planning phase would introduce process overhead without resolving\nmeaningful architectural uncertainty. Direct execution allows Claude to read the function, implement the\ncondition, and run the relevant focused tests.\n\nAnthropic explicitly states that plan mode adds overhead and should generally be skipped when the scope is\nclear and the fix is small. Planning is most valuable when the approach is uncertain, multiple files are\naffected, or the code is unfamiliar. Anthropic’s practical rule is that when the required diff can be described in\none sentence, direct implementation is appropriate. ( https://code.claude.com/docs/en/best-practices )\n\nOption B allocates unnecessary reasoning effort to straightforward validation logic. Options C and D\nexaggerate the complexity of a single-function change. Broader impact analysis would be justified only if the\nrequirement altered reservation semantics, time-zone rules, persistence behavior, or public interfaces—none\nof which is stated.\n\nThe implementation should still include verification. Claude should add or update tests for a future date, the\ncurrent date, and a past date, then run the narrowest relevant test command. Direct execution does not mean\nunverified execution.\n\nOfficial references/topics: Direct Execution; Plan-Mode Selection; Small Scoped Changes; Focused\nVerification."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 7,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates\nto specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one\ngenerates reports. The system researches topics and produces comprehensive, cited reports.\n\nProduction monitoring shows that the research phase takes longer than expected. Analysis reveals that the\ncoordinator invokes the web-search subagent, waits for its response, and then invokes the document-analysis\nsubagent. These tasks are independent; neither requires the other’s output.\n\nHow should you modify the system to run these subagents concurrently?"
    },
    "options": [
      {
        "en": "Switch both subagents to a Haiku-tier model instead of Sonnet to reduce their individual execution\ntimes."
      },
      {
        "en": "Structure the coordinator to emit both Agent tool calls—formerly Task tool calls—in a single response\nrather than across separate conversation turns."
      },
      {
        "en": "Add instructions explaining the performance benefits of parallel execution and requesting that the\ncoordinator invoke both subagents simultaneously."
      },
      {
        "en": "Create an asynchronous orchestration layer that starts separate coordinator-subagent pairs in parallel\nand aggregates their results."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B expresses both independent delegations in the same orchestration turn, allowing the runtime to\nexecute them concurrently and return their results together. The current Claude Agent SDK calls the subagent-\nspawning capability the Agent tool; Task is its former name. Anthropic’s SDK subagent documentation\nexplicitly identifies parallel analysis as a primary subagent use case. Claude tool responses can also contain\nmultiple tool_use blocks , enabling independent calls to be handled as one parallel group rather than as serial\nmodel turns. Option A shortens each execution but does not remove the unnecessary wait between them and\nmay reduce analysis quality. Option C provides useful behavioral guidance, but instructions alone do not\nestablish the required response structure; the coordinator must actually emit both calls together. Option D\nduplicates coordinator execution, complicates state management, and creates unnecessary aggregation work.\nThe correct flow is parallel fan-out from one coordinator, followed by a synchronization point that validates\nboth results before synthesis begins. Failures should be tracked independently so that only the unsuccessful\nbranch requires retrying."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 8,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "A user expands the research system beyond its original web-search agent by adding specialized data sources.\nA financial API agent returns structured JSON containing revenue, margins, and growth rates. A news-\nmonitoring agent returns prose summaries of recent developments. A patent-analysis agent returns structured\nlists of technology areas. The synthesis agent combines these results into executive briefings. Currently, it\nconverts everything into bullet points, causing financial comparisons to lose tabular clarity and news\nsummaries to lose their narrative flow. What change would most improve briefing quality?"
    },
    "options": [
      {
        "en": "Standardize all subagent outputs as prose summaries with inline citations."
      },
      {
        "en": "Standardize all subagent outputs as JSON containing fields for claim, evidence, source, and confidence."
      },
      {
        "en": "Update the synthesis agent to render each content type appropriately—financial data as tables, news as\nprose, and technology areas as structured lists."
      },
      {
        "en": "Add a format-conversion layer that transforms every subagent result into a common intermediate\nrepresentation before synthesis."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C preserves the semantic strengths of each information type instead of forcing heterogeneous evidence\ninto one presentation structure. Financial values share comparable fields and therefore belong in a table. News\ndevelopments require connected prose to preserve chronology and causality. Patent technology areas are\nnaturally represented as grouped or prioritized lists.\n\nAnthropic’s prompting best practices recommend giving explicit output-format instructions and matching the\nrequested format to the intended communication goal. The synthesis prompt should therefore include\nrendering rules for each recognized content type while maintaining common provenance fields behind the\npresentation.\n\nOption A damages numerical comparability and makes trends harder to scan. Option B can be useful as an\ninternal exchange schema, but presenting the entire briefing as uniform JSON does not produce an effective\nexecutive document. Option D normalizes transport but does not correct the synthesis agent’s bullet-only\nrendering policy; a common representation can still be displayed badly. The correct design separates\nstructured internal interchange from audience-facing presentation. The synthesis agent should preserve\ncitations and metadata while selecting the most legible form for each class of evidence."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 9,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol\n(MCP) servers.\n\nAn engineer asks your agent to identify untested code paths in a legacy payment processing module spanning\n45 files. After reading the first 8 source files, the agent’s responses are becoming noticeably less accurate—it’\ns forgetting previously discussed code patterns and hasn’t yet located all test files or traced critical payment\nflows.\n\nWhat’s the most effective approach to complete this investigation?"
    },
    "options": [
      {
        "en": "Spawn subagents to investigate specific questions (e.g., “find all test files for payment processing,”\n“trace refund flow dependencies”) while the main agent coordinates findings and preserves high-level\nunderstanding."
      },
      {
        "en": "Clear context with /clear , then selectively re-read only the most critical files discovered so far, writing\nkey findings to a scratchpad file that persists between context resets."
      },
      {
        "en": "Switch to using Grep to search for specific function names instead of reading full files, reducing the\ncontent loaded into context for remaining exploration."
      },
      {
        "en": "Document all current findings in a summary report, clear context completely, then use that report as the\nsole reference for continuing the investigation."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "The investigation contains several bounded research questions that can be delegated independently: locating\nthe complete test suite, tracing payment and refund flows, identifying conditional branches, and mapping\nexternal dependencies. Each subagent can read the relevant files in its own context and return a focused\nsummary to the coordinating agent.\n\nAnthropic recommends subagents for codebase exploration because extensive file reading rapidly consumes\nthe main context window. Subagents isolate that volume and return only their conclusions, preserving the\nmain conversation for synthesis and implementation. ( https://docs.anthropic.com/en/docs/claude-code\n/common-workflows ) Anthropic also describes parallel research as appropriate when separate investigation\npaths can proceed independently and the main agent can synthesize the results afterward. ( https://docs.\nanthropic.com/en/docs/claude-code/sub-agents )\n\nOption B sacrifices the current conversational state and requires reconstruction after /clear . Option C may\nreduce token usage, but isolated text matches cannot reliably reveal full execution paths, indirect calls, or test\ncoverage relationships. Option D converts the current analysis into a single lossy summary and risks omitting\ndetails needed later.\n\nOption A directly addresses the demonstrated context degradation while retaining a high-level coordinating\nthread. The subagent prompts should be narrowly scoped and require concrete outputs such as file paths,\nuncovered branches, call-chain evidence, and existing tests associated with each flow.\n\nOfficial references/topics: Subagent Context Isolation; Parallel Research; Context Preservation; Coordinated\nCodebase Analysis."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 10,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "A customer sends: “This is frustrating. I’ve explained my issue twice and nothing is being resolved. I want to\ntalk to a real person NOW.” The agent has not yet called any tools to investigate the customer’s account.\nWhat should the agent do?"
    },
    "options": [
      {
        "en": "Briefly explain what the agent can help with and offer to resolve the issue quickly, escalating only if the\ncustomer repeats the request."
      },
      {
        "en": "First call get_customer and lookup_order to gather account context, and then escalate to a human agent."
      },
      {
        "en": "Immediately call escalate_to_human with the conversation history."
      },
      {
        "en": "Acknowledge the frustration and ask one targeted question to understand the specific issue before\nescalating."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C respects the customer’s explicit request for human assistance. The agent should not attempt to retain\nthe interaction, gather additional account information, or require the customer to repeat the request. Because\nthe escalation decision has already been made by the customer, further autonomous investigation would create\nunnecessary delay and disregard clear human direction.\n\nAnthropic’s trustworthy-agent framework emphasizes maintaining meaningful human control over agent\nautonomy. Anthropic’s customer-support implementation guidance also recommends defining interaction\nbranches and measuring escalation efficiency as part of the system’s success criteria.\n\nOption A deliberately delays escalation despite an unambiguous request. Option B performs unnecessary tool\ncalls and may expose or retrieve account information that is not required before transferring the conversation.\nOption D similarly introduces another conversational barrier. Since the current exchange is short and contains\nno tool-generated evidence, passing the available conversation history gives the human agent the immediate\ncontext—the customer’s frustration, repeated unsuccessful attempts, and explicit transfer request—without\npretending that account investigation has occurred."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 11,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates\nto specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one\ngenerates reports. The system researches topics and produces comprehensive, cited reports.\n\nIn production, you observe that simple fact-checking queries, such as “In what year was the Paris Climate\nAgreement signed?”, traverse all four subagents sequentially, consuming more than 40 seconds and\nsignificant tokens per query. Complex comparative research benefits from the complete pipeline. Your query\ndistribution is diverse and continues to evolve as users discover new applications.\n\nWhat is the most effective approach to optimize for varying query complexity?"
    },
    "options": [
      {
        "en": "Create a fast path for factual questions that bypasses subagents entirely, routing every other query\nthrough the complete pipeline."
      },
      {
        "en": "Train a query-complexity classifier using labeled historical data to predict the optimal subagent\ncombination, retraining it periodically."
      },
      {
        "en": "Implement pattern-based routing that classifies queries as single-fact, comparative, or analytical and\nmaps each category to a predefined subagent combination."
      },
      {
        "en": "Have the coordinator analyze each query and dynamically determine which subagents are required."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "Option D allows orchestration effort to scale with the actual request. A simple factual query may require only\nthe web-search agent and a direct coordinator response, whereas a comparative investigation may require web\nresearch, document analysis, synthesis, and report generation. Anthropic’s Building Effective AI Agents\ndescribes the orchestrator-workers pattern as a central model dynamically identifying subtasks, delegating\nthem, and combining the results. It is specifically appropriate when the required subtasks cannot be predicted\nreliably in advance. Anthropic’s multi-agent research architecture likewise emphasizes varying the number of\nagents and tool calls according to task complexity. Option A introduces an inflexible binary decision and still\nsends every non-factual request through the full pipeline. Option B requires labeled data, ongoing retraining,\nand reliable definitions of the “optimal” agent combination. Option C is easier to implement but will become\nbrittle as new query types appear. A capable coordinator can examine the requested output, necessary\n\nevidence, source requirements, and analytical depth at runtime, then invoke only the specialists that materially\ncontribute to the answer."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 12,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol\n(MCP) servers.\n\nAn engineer asks your agent to add comprehensive tests to a legacy codebase with 200 files and minimal\nexisting test coverage. The engineer hasn’t specified which modules to prioritize.\n\nHow should the agent decompose this open-ended task?"
    },
    "options": [
      {
        "en": "Create a fixed testing schedule upfront based on directory structure, allocating equal effort to each top-\nlevel directory regardless of code complexity or business importance."
      },
      {
        "en": "Use Glob and Grep to map codebase structure, identify heavily-coupled modules, create a prioritized\nplan for high-impact areas, and revise as dependencies are discovered."
      },
      {
        "en": "Systematically read all 200 files to create a complete function inventory before writing any tests,\nensuring the testing plan accounts for every function before beginning."
      },
      {
        "en": "Start writing tests for the first module alphabetically, using test failures and imports to discover related\nfiles organically."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "The task is open-ended because neither the critical modules nor the required testing sequence is known in\nadvance. The agent should first use lightweight discovery tools to map the repository, locate existing tests,\nidentify central modules, and determine which components have high fan-in, business significance, complex\nbranching, or extensive external dependencies. It can then produce an initial risk-based testing plan and refine\nit as new dependency information appears.\n\nAnthropic distinguishes predefined workflows from agents that dynamically control their processes and tool\nusage. Agents are appropriate when the required steps cannot be reliably hardcoded and must adapt to\nenvironmental evidence. During execution, they should obtain ground truth through tool results and use that\nfeedback to determine subsequent actions. ( https://www.anthropic.com/research/building-effective-agents )\nAnthropic also identifies orchestrator-worker designs as suitable for complex coding and search tasks where\nthe necessary subtasks depend on what the investigation reveals. ( https://www.anthropic.com/research\n/building-effective-agents )\n\nOption A assigns effort using directory boundaries rather than risk. Option C exhausts context before\ndelivering value. Option D uses alphabetical order, which has no relationship to impact or coverage priority.\n\nOption B establishes an evidence-driven decomposition: discover, prioritize, test high-impact paths, measure\nresults, and revise the plan as dependencies and uncovered risks emerge.\n\nOfficial references/topics: Dynamic Task Decomposition; Adaptive Agent Loops; Orchestrator-Workers;\nRisk-Based Test Planning."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 13,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-\nambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems\nthrough custom Model Context Protocol (MCP) tools ( get_customer , lookup_order , process_refund ,\nescalate_to_human ). Your target is 80%+ first-contact resolution while knowing when to escalate.\n\nYour agent is handling a billing dispute. After calling get_customer and lookup_order , it identifies that the\ndispute involves a promotional pricing error requiring manager approval—beyond the agent’s authorization\nlevel.\n\nHow should the workflow handle this mid-process escalation?"
    },
    "options": [
      {
        "en": "Call escalate_to_human , passing only the customer’s original message."
      },
      {
        "en": "Compile a structured handoff with customer details, order info, and the identified issue before calling\nescalate_to_human ."
      },
      {
        "en": "Attempt the refund with process_refund anyway, escalating only if the system rejects the transaction."
      },
      {
        "en": "Persist the complete conversation and tool response history to a database, then call escalate_to_human\nwith a reference ID."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "A mid-process escalation should transfer the decision-ready state accumulated by the agent. The human\nreviewer needs the verified customer identity, relevant order information, the promotional-pricing\ndiscrepancy, the reason approval is required, and any actions already attempted. Option B preserves this\ninformation in a concise, structured handoff while avoiding unnecessary repetition of the complete raw\ntranscript.\n\nAnthropic’s tool-design guidance recommends returning high-signal information and stable identifiers\ncontaining only what Claude or the next workflow participant needs to determine the next action. Anthropic’s\ncontext-engineering guidance similarly advocates structured notes that preserve critical state and\ndependencies without retaining every redundant tool result. A structured escalation payload applies both\nprinciples and reduces handling time for the manager. ( https://platform.claude.com/docs/en/agents-and-tools\n/tool-use/define-tools )\n\nOption A discards the investigation already completed. Option C violates the agent’s authorization boundary\nand risks an impermissible financial action. Option D provides auditability, but a reference ID alone forces the\nhuman to reconstruct the case from an excessively broad transcript. Human control must remain meaningful\n\nwhen an agent encounters a decision outside its authority; the agent should pause and hand the decision back\nwith sufficient supporting context. ( https://www.anthropic.com/research/trustworthy-agents )\n\nOfficial references/topics: Structured agent handoffs, high-signal tool results, human-control boundaries,\npersistent structured state."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 14,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol\n(MCP) servers.\n\nAn engineer used Claude Code yesterday to investigate authentication flows in a legacy monolith, building up\nsignificant context over a 2-hour session. Today she wants to continue that specific investigation. She’s\nworked on three other codebases since then and knows the session was named “auth-deep-dive”.\n\nHow should she resume?"
    },
    "options": [
      {
        "en": "Use --session-id with the UUID from yesterday’s session transcript file"
      },
      {
        "en": "Use --continue to pick up where the most recent conversation left off"
      },
      {
        "en": "Start fresh and re-read the same files"
      },
      {
        "en": "Use --resume auth-deep-dive to load that specific session by name"
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "Claude Code supports resuming a specific saved session by either its identifier or its assigned name. Because\nthe engineer knows the target session is named auth-deep-dive , the appropriate command is:\n\nclaude --resume auth-deep-dive\n\nAnthropic’s CLI reference explicitly states that --resume can resume a session by ID or name and gives\nnamed-session usage in the same form. Resuming restores the relevant conversation history and accumulated\ncontext, including the prior analysis and files discussed during the investigation. ( https://docs.anthropic.com\n/en/docs/claude-code/cli-reference )\n\nOption B is incorrect because --continue resumes the most recent session in the current directory. The\nengineer has conducted three subsequent sessions, so it may open an unrelated investigation. Option A uses a\nflag that is not the documented Claude Code mechanism for selecting a prior session; --resume itself accepts\nthe session identifier when an ID is used. Option C discards two hours of established context and\nunnecessarily repeats codebase exploration.\n\nNamed sessions are particularly useful when engineers alternate among multiple projects or parallel\ninvestigations. Assigning descriptive names allows the correct thread to be retrieved deterministically rather\nthan depending on chronological recency.\n\nOfficial references/topics: Claude Code Session Persistence, Named Sessions, --resume , --continue ."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 15,
    "domain": "mcp",
    "category": "Tool Design and MCP Integration",
    "prompt": {
      "en": "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-\nambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems\nthrough custom Model Context Protocol (MCP) tools ( get_customer , lookup_order , process_refund ,\nescalate_to_human ). Your target is 80%+ first-contact resolution while knowing when to escalate.\n\nAnthropic’s tool use documentation states: “Write instructive error messages. Instead of generic errors like\n‘failed’, include what went wrong and what Claude should try next.” A billing dispute agent uses\nlookup_order , which catches all exceptions and returns a tool_result with is_error: true and the message\n“Tool execution failed”. Monitoring shows two failure modes: the agent retries the identical call until hitting\nthe turn limit, or it immediately calls escalate_to_human without trying alternative tools.\n\nWhich change follows the documented recommendation and gives Claude the information it needs to select\nthe correct recovery action for each error type?"
    },
    "options": [
      {
        "en": "Implement retry logic with exponential backoff inside each tool implementation so transient errors are\nresolved transparently within the tool before any failure result is surfaced to Claude in the agentic loop."
      },
      {
        "en": "Return error-type-specific messages with is_error: true , e.g., “Order not found—try get_customer to\nsearch by phone” for data errors and “Database timeout (transient)—retry should succeed” for\ninfrastructure errors."
      },
      {
        "en": "Remove is_error: true and return the error details as normal tool content, so Claude reasons about the\nresponse as data rather than treating it as a flagged failure condition that biases retry behavior."
      },
      {
        "en": "Add an error classification step in the agentic loop that intercepts tool errors before Claude sees them,\nthen routes to hardcoded retry or escalation logic."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B preserves the formal failure indicator while making the returned content operationally useful.\nAnthropic’s tool-use guidance states that when a tool fails, the application should return the error through\ntool_result content and mark it with is_error: true . Claude can then use that information to retry with\ncorrected input, seek clarification, or explain the limitation. ( https://docs.anthropic.com/en/docs/agents-and-\ntools/tool-use/bash-tool )\n\nThe two example messages identify both the cause and the appropriate recovery path. “Order not found”\nindicates that repeating the same identifier will not help and proposes an alternative lookup method.\n“Database timeout” identifies a transient infrastructure condition for which a retry is reasonable. This\neliminates blind repetition without removing Claude’s ability to adapt.\n\nOption A can be useful for tightly bounded low-level retries, but it does not solve permanent errors or tell the\nagent what happened after retries fail. Option C incorrectly disguises a failed operation as successful tool\ncontent. Option D moves semantic knowledge into hardcoded orchestration logic, making the system more\nrigid and duplicating information already known by the tool.\n\nThe most reliable tool interface combines the error flag, a stable error type, a retryability indicator, a concise\ncausal explanation, and a recommended recovery action.\n\nOfficial references/topics: is_error handling, instructive tool results, recovery guidance, resilient MCP tool\ndesign."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 16,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "You built an LLM-powered code-review tool that analyzes pull requests and returns structured findings. Each\nfinding is a JSON object containing file_path, line_number, issue_category—such as security or style—and\ndescription. Developers can dismiss findings they consider unhelpful, and currently 35% of findings are\ndismissed. You want to analyze these dismissals to understand what the system is getting wrong and improve\nthe prompts accordingly. What change to the output structure would best support this analysis?"
    },
    "options": [
      {
        "en": "Add a model_confidence field from 0.0 to 1.0 and filter findings below a threshold calibrated against\nhistorical dismissal rates."
      },
      {
        "en": "Add a detected_pattern field recording the specific code construct that triggered the finding, such as\nsingle-letter loop variable."
      },
      {
        "en": "Expand the description field with more detailed explanations of why each issue matters and how it\nshould be fixed."
      },
      {
        "en": "Remove the issue_category field and track dismissal rates only at the individual-finding level."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B creates the granular error taxonomy needed to understand recurring false-positive patterns. The\nexisting issue_category field is too broad: a high dismissal rate for style does not reveal whether developers\nobject to single-letter variables, line-length warnings, naming conventions, or something else. Recording the\ndetected construct allows dismissal rates to be grouped by trigger and connected to targeted prompt revisions\nor project-specific examples.\n\nAnthropic’s evaluation guidance recommends measurable, task-specific criteria and evaluation cases that\nreflect real production behavior and edge cases. Its structured-output documentation supports schema-\nconstrained, parseable records suitable for this type of downstream analysis.\n\nOption A can help rank findings, but a confidence score does not explain why developers reject them and may\nbe poorly calibrated across issue types. Option C produces more text without adding a stable dimension for\naggregation. Option D removes useful category information and makes systematic analysis harder. A\n\nnormalized detected_pattern field enables dashboards, pattern-level dismissal metrics, representative-example\nsampling, and controlled evaluations of prompt changes while retaining the broader category for higher-level\nreporting."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 17,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-\nambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems\nthrough custom Model Context Protocol (MCP) tools ( get_customer , lookup_order , process_refund ,\nescalate_to_human ). Your target is 80%+ first-contact resolution while knowing when to escalate.\n\nA customer raises three separate issues during one session: a refund inquiry (turns 1–15), a subscription\nquestion (turns 16–30), and a payment method update (turns 31–45). At turn 48, the customer asks “What\nhappened with my refund?” The conversation is approaching context limits.\n\nWhat strategy best maintains the agent’s ability to address all issues throughout the session?"
    },
    "options": [
      {
        "en": "Summarize earlier turns into a narrative description, preserving full message history only for the active\nissue."
      },
      {
        "en": "Implement sliding window context that retains the most recent 30 turns."
      },
      {
        "en": "Rely on MCP tools to re-fetch relevant information on demand when the customer references earlier\nissues."
      },
      {
        "en": "Extract and persist structured issue data (order IDs, amounts, statuses) into a separate context layer."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "The agent must preserve durable state for several concurrently open issues without keeping every\nconversational turn in the active context window. Option D creates a structured issue ledger containing\nidentifiers, issue type, requested action, current status, completed steps, unresolved questions, and relevant\ntool outputs.\n\nAnthropic recommends structured note-taking for long-horizon agents. In this pattern, critical state is written\noutside the context window and retrieved later, allowing the agent to preserve dependencies and progress\nacross dozens of tool calls. Anthropic also describes compaction as retaining critical details while discarding\nredundant raw messages and historical tool output. ( https://www.anthropic.com/engineering/effective-context-\nengineering-for-ai-agents )\n\nOption A is better than retaining the entire transcript, but a narrative summary can merge separate issues or\nobscure exact identifiers and statuses. Option B will discard the refund conversation because it occurred\noutside the most recent 30 turns. Option C may recover current backend facts, but it cannot reconstruct\nconversational commitments, prior explanations, or why a particular action remains pending.\n\nA structured context layer should maintain one record per issue and be updated after every material action.\nThe active prompt can include compact summaries of all open issues and expanded details only for the issue\ncurrently being discussed.\n\nOfficial references/topics: Structured note-taking, external agent memory, context compaction, multi-issue\nstate management."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 18,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol\n(MCP) servers.\n\nA developer asks the agent to investigate why a specific API endpoint intermittently returns 500 errors. The\ncodebase has 200+ files and the developer doesn’t know which components are involved. The agent must\ntrace the error through routing, middleware, business logic, and database layers.\n\nWhat task decomposition approach would be most effective?"
    },
    "options": [
      {
        "en": "Have the agent first create a comprehensive plan mapping all code paths through the endpoint before\nbeginning any file exploration or code reading."
      },
      {
        "en": "Define a fixed sequence of investigation steps upfront—grep for error patterns, then read error handlers,\nthen check database queries, then examine middleware—executing each step regardless of intermediate\nfindings."
      },
      {
        "en": "Run parallel worker agents that simultaneously investigate all four layers, then synthesize their findings\nto identify where the error originates."
      },
      {
        "en": "Have the agent dynamically generate investigation subtasks based on what it discovers at each step,\nadapting its exploration plan as new information about the error path emerges."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "The investigation path cannot be reliably predetermined because the responsible files, components, and\nexecution sequence are unknown. The agent should begin with available evidence—such as route definitions,\nstack traces, logs, or endpoint references—and use each discovery to decide the next search, file read, or\ndiagnostic action.\n\nAnthropic distinguishes predefined workflows from agents that dynamically direct their own processes and\ntool usage. Agents are appropriate for open-ended problems where the required number and nature of the\nsteps cannot be predicted or encoded as a fixed path. During execution, the agent should obtain ground truth\nfrom tool results and adapt its plan based on that environmental feedback. ( https://www.anthropic.com\n/engineering/building-effective-agents )\n\nOption A requires a comprehensive plan before the agent has inspected the code, so the plan would rest on\nunsupported assumptions. Option B forces every investigation through the same sequence even when an early\ndiscovery makes later steps irrelevant or identifies a different dependency path. Option C assumes the four\nlayers can be investigated independently; tracing an intermittent request failure usually involves dependencies\nrevealed sequentially across layers.\n\nOption D implements an adaptive agent loop: inspect, form a hypothesis, use tools, evaluate the evidence, and\ngenerate the next subtask. The workflow should still include stopping conditions, testable hypotheses, and\nescalation when evidence remains inconclusive.\n\nOfficial references/topics: Adaptive Agent Loops, Dynamic Task Decomposition, Tool Feedback, Open-\nEnded Coding Investigations."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 19,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and\nmaintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.\n\nYour extraction pipeline processes contracts that frequently include amendments. When a contract contains\nboth original terms and later amendments (e.g., original clause specifies “30-day payment terms” while\nAmendment 1 changes this to “45 days”), the model inconsistently extracts one value or the other with no\nindication of which applies.\n\nWhat’s the most effective approach to improve extraction accuracy for documents with amendments?"
    },
    "options": [
      {
        "en": "Preprocess documents with a classifier that identifies and removes superseded sections before the main\nextraction step."
      },
      {
        "en": "Redesign the schema so amended fields capture multiple values, each with source location and effective\ndate."
      },
      {
        "en": "Add prompt instructions to always extract the most recent amendment value and ignore superseded\noriginal terms."
      },
      {
        "en": "Implement post-extraction validation using pattern matching to detect amendments and flag those\nextractions for manual review."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "The document contains multiple factually valid values whose applicability depends on chronology and legal\ncontext. Collapsing those values into a single scalar field discards essential provenance. Option B corrects the\ndata model by representing each term as a structured record containing the extracted value, source location,\ndocument or amendment identifier, and effective date.\n\nAnthropic’s Structured Outputs feature is designed for data-extraction use cases in which nested objects and\narrays must conform to a defined JSON Schema. ( https://platform.claude.com/docs/en/build-with-claude\n\n/structured-outputs ) Anthropic also recommends grounding factual outputs in direct source material and\nmaking claims auditable through supporting evidence. ( https://docs.anthropic.com/en/docs/test-and-evaluate\n/strengthen-guardrails/reduce-hallucinations ) A provenance-aware schema applies both principles: it retains\nthe original clause and the amendment instead of forcing Claude to resolve a potentially complex legal\nprecedence question during extraction.\n\nOption A is destructive because removing superseded text prevents auditing and may eliminate terms still\nrelevant to earlier periods. Option C oversimplifies amendment logic; the newest document is not\nautomatically controlling for every date, jurisdiction, or clause. Option D identifies risk but does not improve\nthe extracted representation and unnecessarily sends all amendment cases to manual review.\n\nAfter extraction, deterministic business logic can select the value effective on a requested date while retaining\nthe complete contractual history.\n\nOfficial references/topics: Structured Outputs; Nested Schema Design; Provenance and Source Grounding;\nTemporal Data Modeling."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 20,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "Your pipeline includes a release-notes generation step that classifies and summarizes approximately 200\ncommits at the end of each weekly release cycle. Each commit is currently sent as a separate Messages API\ncall using a Sonnet-tier Claude model. The release notes are not needed until the following morning, so results\nhave approximately 12 hours of acceptable latency. Your team needs to reduce per-token API cost for this\nstep while keeping the same model and prompts, with no change to the model tier or output quality. Which\napproach satisfies all these constraints?"
    },
    "options": [
      {
        "en": "Concatenate all 200 commit messages into a single Messages API request and have the model return all\nsummaries in one response, because fewer requests always reduce total token cost."
      },
      {
        "en": "Issue the 200 Messages API requests in parallel using concurrent connections, because concurrency\nlowers the per-token price charged by the API."
      },
      {
        "en": "Submit the 200 requests to the Message Batches API with unique custom_id values and retrieve the\nresults after the batch finishes, which applies a 50% discount to all input and output tokens."
      },
      {
        "en": "Switch the summarization calls from the Sonnet-tier model to a Haiku-tier model to take advantage of\nHaiku’s lower per-token rates."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C preserves each commit’s existing model, prompt, and independent processing structure while\napplying Anthropic’s reduced batch pricing. The official Message Batches documentation states that batch\nprocessing reduces input and output token costs by 50%. Requests are processed independently and\nasynchronously, and each response can be correlated with its original commit through a unique custom_id.\n\nThis workload is a strong batch candidate because it contains many independent requests and does not require\nan immediate response. Most batches complete within one hour, although processing can continue for up to\n24 hours. The pipeline must therefore tolerate asynchronous completion and retrieve the results when\nprocessing finishes.\n\nOption A changes the request architecture, increases the risk of context or output-limit failures, and makes\nindividual retry and result association more difficult. Reducing request count does not inherently reduce per-\ntoken pricing. Option B improves throughput but concurrency does not change token rates. Option D would\nreduce cost but violates the explicit requirement to retain the same model tier. The Message Batches API is\nthe only option satisfying every stated constraint."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 21,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline.\nThe system runs automated code reviews, generates test cases, and provides feedback on pull requests. You\nneed to design prompts that provide actionable feedback and minimize false positives.\n\nYour automated review jobs take 18 seconds to initialize before Claude begins analyzing code. Profiling\nreveals that the delay results from automatically discovering hooks, MCP servers, plugins, skills, and multiple\nnested CLAUDE.md files throughout the monorepo.\n\nYou need to reduce startup time while ensuring reviews still enforce the coding standards documented in the\nroot-level CLAUDE.md file.\n\nWhat is the most effective approach?"
    },
    "options": [
      {
        "en": "Replace the default prompt using --system-prompt-file ./CLAUDE.md, which bypasses default prompt\nassembly and loads only the project rules."
      },
      {
        "en": "Run in --bare mode and pass --append-system-prompt-file ./CLAUDE.md to load the required project\nstandards explicitly while skipping automatic discovery."
      },
      {
        "en": "Run in --bare mode and repeat all review criteria directly in the -p prompt for every invocation."
      },
      {
        "en": "Keep the default initialization and add --exclude-dynamic-system-prompt-sections to improve prompt-\ncache reuse across CI runners."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B removes the identified startup work while deliberately restoring the one source of project context the\nreviews require. Anthropic documents that --bare skips automatic discovery of hooks, skills, plugins, MCP\nservers, auto memory, and CLAUDE.md files. It is specifically intended for CI and scripted execution where\nfast, reproducible startup behavior is more important than loading every locally configured extension.\n\nBecause bare mode also skips the root CLAUDE.md, the pipeline must supply that content explicitly. --\nappend-system-prompt-file ./CLAUDE.md loads the standards while retaining Claude Code’s default coding-\n\nagent behavior and tool guidance. Option A replaces the default system prompt but does not, by itself,\nestablish the same minimal startup path as --bare; replacement also discards valuable default coding\ninstructions. Option C can work technically but duplicates repository policy inside every pipeline invocation\nand creates configuration drift. Option D improves prompt-cache reuse by relocating machine-specific prompt\nsections, but it does not eliminate discovery of hooks, MCP servers, plugins, skills, and nested instructions.\nBare mode plus an explicitly appended standards file directly addresses both performance and policy\nrequirements. Claude Code bare-mode documentation"
    },
    "sourceLanguage": "en"
  },
  {
    "id": 22,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are using Claude Code to accelerate software development. Your team uses it for code generation,\nrefactoring, debugging, and documentation. You need to integrate it into your development workflow with\ncustom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct\nexecution.\n\nYou’re tasked with adding real-time updates to the application. This could be implemented using\nWebSockets, Server-Sent Events, or polling, each with different complexity, browser support, and\ninfrastructure requirements.\n\nWhat’s the most effective way to begin this task?"
    },
    "options": [
      {
        "en": "Use direct execution to implement polling first, then evaluate whether to upgrade to WebSockets later."
      },
      {
        "en": "Use direct execution with a prompt asking Claude to analyze all approaches and implement the one it\ndetermines is best."
      },
      {
        "en": "Enter plan mode to explore the architecture, evaluate trade-offs, and present options for team approval\nbefore implementing."
      },
      {
        "en": "Start direct execution with WebSockets, then refactor if infrastructure issues arise."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "The implementation approach is unresolved and carries architectural consequences. WebSockets, Server-Sent\nEvents, and polling differ in connection lifecycle, bidirectional communication, proxy compatibility, scaling\nrequirements, deployment topology, reconnection behavior, and operational complexity. Claude should\ntherefore inspect the existing application and infrastructure before modifying code.\n\nAnthropic recommends separating exploration and planning from implementation when the approach is\nuncertain, the work affects multiple files, or the developer is unfamiliar with the relevant architecture. In plan\nmode, Claude can read files and analyze the system without making changes, produce a detailed proposal, and\nallow the developer or team to review the plan before execution. ( https://code.claude.com/docs/en/best-\npractices )\n\nOption A commits to polling before determining whether its latency and load characteristics meet the\nrequirement. Option B delegates a consequential architectural decision and immediate implementation to a\nsingle execution step without a review checkpoint. Option D prematurely selects the most infrastructure-\nsensitive option and assumes later refactoring will be inexpensive.\n\nOption C creates the correct sequence: examine the frontend and backend architecture, document\nrequirements, compare alternatives, identify infrastructure constraints, obtain approval, and only then\nimplement the selected design with appropriate tests and observability.\n\nOfficial references/topics: Plan mode, explore–plan–implement workflow, architectural trade-off analysis,\nreview checkpoints."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 23,
    "domain": "mcp",
    "category": "Tool Design and MCP Integration",
    "prompt": {
      "en": "You are building developer-productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools—Read, Write, Bash, Grep, and Glob—and integrates with Model Context\nProtocol (MCP) servers.\n\nAfter adding an MCP server with specialized code-refactoring tools—extract_function, rename_variable, and\ninline_function—you notice that the agent still uses basic text manipulation through Write and Bash sed\ncommands for refactoring tasks. The MCP server is connected and healthy. Examining the configuration, you\nfind that each MCP tool has a minimal description such as, “extract_function: Extracts a function from code.”\n\nWhat is the most effective way to improve adoption of the MCP refactoring tools?"
    },
    "options": [
      {
        "en": "Implement a request classifier that detects refactoring intent and automatically routes those requests to\nthe MCP server before the agent processes them."
      },
      {
        "en": "Accept this as expected behavior because simpler tools such as sed are more predictable than\nspecialized refactoring tools."
      },
      {
        "en": "Enhance the MCP tool descriptions to explain when each tool is preferable to text manipulation and\nclarify expected inputs and outputs."
      },
      {
        "en": "Remove the Write tool from the agent’s configuration for refactoring sessions so it must use the MCP\ntools for code modifications."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C corrects the weak selection signal presented to the model. Claude chooses among available tools\nusing their names, descriptions, parameter schemas, and the current request. “Extracts a function from code”\ndoes not explain whether the tool understands syntax trees, preserves imports, updates call sites, validates\nscope, or offers advantages over Write and sed. Anthropic identifies prompt-engineering tool descriptions as\none of the most effective ways to improve agent tool use. Descriptions should state what the operation\nperforms, when it should be selected, what inputs are required, what output it returns, and any limitations.\n\nOption A adds a separate probabilistic routing layer without improving the tool contract Claude ultimately\nsees. Option B ignores the server’s intended value. Option D removes a broadly useful capability and may\nprevent unrelated edits without guaranteeing that the MCP tools are used correctly. Each refactoring tool\nshould instead describe its semantic behavior and contrast it with plain text manipulation—for example, that\nrename_variable performs scope-aware symbol renaming and updates references. Clear schemas, concrete\nexamples, and evaluation against real refactoring tasks should accompany the improved descriptions."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 24,
    "domain": "mcp",
    "category": "Tool Design and MCP Integration",
    "prompt": {
      "en": "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol\n(MCP) servers.\n\nYou’ve configured your Claude agent with three MCP servers: one for git operations, one for Jira ticket\nmanagement, and one for documentation search.\n\nWhen a user asks the agent to “create a branch for JIRA-123 and add documentation links to the ticket,” how\ndoes the agent access tools across these servers?"
    },
    "options": [
      {
        "en": "Tools from all configured MCP servers are discovered at connection time and available simultaneously\nto the agent."
      },
      {
        "en": "The agent queries each server sequentially to determine which handles each tool, routing calls based on\ntool name prefixes."
      },
      {
        "en": "The agent automatically selects the most relevant server based on the request and loads only that server’\ns tools."
      },
      {
        "en": "You must specify which MCP server to use for each turn, and the agent can only access one server’s\ntools at a time."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "MCP allows a Claude application to connect to multiple servers and expose their enabled tools within the\nsame agentic interaction. Anthropic’s MCP connector documentation explicitly supports connecting to\nmultiple MCP servers in one request. Once connected, Claude can invoke a server’s tool when the user’s\nrequest corresponds to the capability described by that tool. ( https://docs.anthropic.com/en/docs/agents-and-\ntools/mcp-connector )\n\nIn this scenario, the git server can provide the branch-creation operation, the documentation server can locate\nthe relevant links, and the Jira server can update ticket JIRA-123. The agent can coordinate these capabilities\nwithout requiring a separate conversational turn that restricts it to only one server. Tool descriptions and\nschemas tell Claude what each operation does and what inputs it requires.\n\nOption B incorrectly describes sequential capability discovery. Server identity and tool definitions are\nestablished through the MCP configuration rather than discovered by querying every server for each\n\noperation. Option C is incorrect because connecting several servers does not inherently restrict the agent to a\nsingle selected server. Option D imposes a one-server-per-turn limitation that MCP does not require.\n\nAccess can still be controlled through allowlists, denylists, permissions, and per-tool configuration. Those\ncontrols restrict which tools are enabled; they do not change the fundamental ability to make tools from\nmultiple configured servers available together.\n\nOfficial references/topics: MCP Server Configuration, Multi-Server Tool Access, Tool Discovery, MCP\nTool Permissions."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 25,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JSON schemas, and maintains high accuracy. It must\nhandle edge cases gracefully and integrate with downstream systems.\n\nAfter deployment, you find that 12% of extractions contain semantic errors that pass JSON Schema\nvalidation—for example, a duration such as “30 minutes” is incorrectly placed in an ingredient-quantity field.\nHuman reviewers have the capacity to check only 20% of extractions.\n\nWhich approach most effectively allocates reviewer attention?"
    },
    "options": [
      {
        "en": "Have the model output field-level confidence scores, and then calibrate review thresholds using a\nlabeled validation set."
      },
      {
        "en": "Review all extractions from documents with formatting anomalies, such as unusual layouts or mixed\ncontent types."
      },
      {
        "en": "Randomly sample 20% of extractions for review, using corrections to track accuracy and identify error\npatterns."
      },
      {
        "en": "Prioritize the review of all extractions where required fields are empty or explicitly marked as not found."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A uses the limited review capacity as a risk-ranking mechanism rather than spending it uniformly.\nJSON Schema validation can prove that an output has the expected types and structure, but it cannot detect a\nsemantically misplaced value such as a duration stored as an ingredient quantity. Field-level confidence can\nidentify the exact parts of a record that warrant inspection, provided those scores are calibrated against labeled\nexamples rather than trusted at face value. The labeled validation set must mirror the production distribution\nand include edge cases; Anthropic’s evaluation guidance explicitly recommends task-specific evaluations,\nrepresentative distributions, measurable criteria, and automated grading where possible. Calibration then\nconverts raw confidence into an empirically tested estimate of error risk, allowing reviewers to inspect the\nlowest-confidence records or fields first. Option C, random sampling, is useful for unbiased quality\nmeasurement and discovering new failure modes, but it does not maximize error detection within a fixed 20\npercent review budget. Options B and D target narrow proxies—layout anomalies and missing required\n\nvalues—while the observed errors pass structural validation and may occur in ordinary-looking documents.\nThe operational design should combine calibrated risk-based review with a smaller random audit sample to\ndetect drift and overconfidence."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 26,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "The coordinator provides detailed step-by-step instructions to the web-search subagent, specifying exact\nsearch queries, source priorities, and date filters. Production monitoring reveals three issues: (1) the subagent\nreports “insufficient results” instead of trying alternative approaches when the specified searches fail, (2)\nresearch quality drops for emerging topics that do not match expected patterns, and (3) the subagent rarely\nsurfaces valuable tangential sources. What is the most effective way to improve subagent adaptability?"
    },
    "options": [
      {
        "en": "Specify research objectives and quality criteria—such as coverage breadth, source diversity, and\nrecency—rather than prescribing procedural steps, allowing the subagent to determine its search\nstrategy."
      },
      {
        "en": "Remove procedural details entirely and delegate using simple goals such as “research this topic\nthoroughly,” relying on the subagent’s general capabilities."
      },
      {
        "en": "Add fallback directives requiring alternative query formulations whenever the specified searches\nproduce fewer than a predetermined number of results."
      },
      {
        "en": "Classify each topic as either “well-defined” or “exploratory” and use a different instruction style for\neach category."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A establishes a clear destination without forcing the subagent to follow a brittle route. The prompt\nshould define the research question, boundaries, expected deliverable, acceptable source types, recency\nrequirements, coverage expectations, and verification criteria. The subagent can then broaden, narrow,\nreformulate, or follow emerging leads according to observed search results.\n\nAnthropic’s research-agent guidance emphasizes giving each subagent an objective, output format, source\nguidance, and clear task boundaries. It also describes research as dynamic and path-dependent, requiring\nagents to adapt their strategy as new information emerges.\n\nOption B removes too much structure and may cause duplicated work, incomplete coverage, or inconsistent\noutput. Option C handles only one known failure condition and still restricts the agent to a predetermined\nprocedure. Option D adds classification complexity and creates an artificial boundary between topic types that\nmay change during investigation. Objective-based delegation retains accountability because results can be\nevaluated against explicit quality criteria, while preserving the agent’s ability to discover alternative\nterminology, unexpected sources, and useful adjacent evidence. This is controlled autonomy rather than either\nprocedural micromanagement or unrestricted exploration."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 27,
    "domain": "mcp",
    "category": "Tool Design and MCP Integration",
    "prompt": {
      "en": "The document-analysis agent has a single analyze_document tool that accepts a document and a free-text\ninstruction parameter. During evaluation, requests such as “extract the key financial metrics” often return\nnarrative summaries, while “summarize the methodology” sometimes returns raw data tables. The synthesis\nagent reports that 35% of analysis results require new requests with clarified instructions. What is the most\neffective way to improve reliability?"
    },
    "options": [
      {
        "en": "Split the generic tool into purpose-specific tools—extract_data_points, summarize_content, and\nverify_claim_against_source—each with defined input and output contracts."
      },
      {
        "en": "Retain the single tool but add an analysis_type enum requiring explicit selection among extraction,\nsummarization, and verification modes."
      },
      {
        "en": "Have the coordinator preclassify each analysis request before passing instructions to the document-\nanalysis agent."
      },
      {
        "en": "Enhance the tool description with detailed examples showing how different instruction phrasings should\nmap to different output formats."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A removes the semantic ambiguity created by one generic tool performing three substantially different\noperations. Each replacement tool can have a distinct name, focused description, appropriate required\nparameters, and an output schema designed for its task. For example, extract_data_points can return typed\nrecords, while verify_claim_against_source can return a verdict, supporting excerpt, and source location.\n\nAnthropic’s tool-design guidance recommends thoughtful tools with clear, distinct purposes and natural task\nboundaries. Ambiguous or overlapping capabilities make it harder for agents to select the correct operation\nand interpret its results consistently.\n\nOption B improves the existing interface, but the implementation and result contract remain overloaded,\nincreasing the possibility that the model or tool will mix behavior across modes. Option C adds another\nprobabilistic classification stage without repairing the underlying interface. Option D may reduce some errors,\nbut free-text interpretation remains the principal control mechanism. Purpose-specific tools encode the\nintended operation directly into the callable interface, permit strict schemas tailored to each result type, and\nmake evaluation failures easier to diagnose. This produces a stronger contract between the agent and\ndeterministic document-processing system."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 28,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and\nmaintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.\n\nYour system has been operating with 100% human review for 3 months. Analysis shows that extractions with\nmodel confidence #90% have 97% accuracy overall. To reduce reviewer workload, you plan to automate high-\nconfidence extractions.\n\nBefore deploying, what validation step is most critical?"
    },
    "options": [
      {
        "en": "Analyze accuracy by document type and field to verify high-confidence extractions perform\nconsistently across all segments, not just in aggregate."
      },
      {
        "en": "Compare accuracy at different confidence thresholds (85%, 90%, 95%) to find the optimal cutoff that\nmaximizes automation while minimizing errors."
      },
      {
        "en": "Verify that 97% accuracy meets requirements for all downstream systems that consume the extracted\ndata."
      },
      {
        "en": "Run a two-week pilot routing 25% of high-confidence extractions directly to downstream systems and\nmonitor error reports."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "An aggregate accuracy value can conceal severe performance disparities. A system may achieve 97% overall\naccuracy while performing poorly on a low-volume document type, a critical financial field, or a specific edge\ncase. Automating outputs solely from the aggregate figure could therefore expose downstream systems to\nconcentrated, high-impact errors.\nAnthropic’s evaluation guidance states that evaluations should be task-specific, reflect the real-world task\ndistribution, and explicitly include edge cases. It also emphasizes multidimensional success criteria rather\nthan reliance on a single global metric. ( https://docs.anthropic.com/en/docs/build-with-claude/develop-tests )\nOption A applies those principles by stratifying performance according to document type and field. This\nreveals whether confidence is calibrated consistently and whether the proposed automation threshold remains\nsafe for every operationally significant segment.\n\nOption B is useful only after segment-level performance has been understood. Selecting a global threshold\ncannot correct a subgroup where confidence is systematically overstated. Option C is necessary governance\nwork, but it treats the overall 97% result as though errors were uniformly distributed. Option D places\nunvalidated outputs into downstream systems and depends on passive error reporting, which may fail to detect\nsilent corruption.\n\nThe correct deployment gate is therefore segmented validation, followed by threshold selection, downstream\nacceptance criteria, and a controlled pilot.\n\nOfficial references/topics: Define Success Criteria; Task-Specific Evaluations; Edge-Case Coverage;\nReliability Segmentation."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 29,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are using Claude Code to accelerate software development. Your team uses it for code generation,\nrefactoring, debugging, and documentation. You need to integrate it into your development workflow with\ncustom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct\nexecution.\n\nYou’re implementing a caching layer for API responses to speed up the /products endpoint. You have a rough\nidea—Redis with a 5-minute TTL—but you’re new to production caching and aren’t sure what other\nconsiderations a robust implementation requires.\n\nWhat’s the most effective way to start your iterative workflow?"
    },
    "options": [
      {
        "en": "Ask Claude to interview you about the caching requirements before implementing, surfacing\nconsiderations like invalidation strategies, cache layers, consistency guarantees, and failure modes."
      },
      {
        "en": "Use plan mode to analyze the current /products endpoint implementation, then provide your caching\nrequirements once Claude explains how the existing code is structured."
      },
      {
        "en": "Start with a minimal request: “Add Redis caching to /products with 5-minute TTL.” Add features and\nfix issues through follow-up prompts as problems surface during testing."
      },
      {
        "en": "Write a specification with your known requirements and “TBD” markers for uncertain areas, having\nClaude propose solutions for each TBD as it implements."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "The primary risk is not implementation difficulty but incomplete requirements. Production caching introduces\ndecisions involving invalidation, stale-data tolerance, cache keys, tenant boundaries, serialization, stampede\nprevention, failure behavior, observability, deployment topology, and consistency expectations. Implementing\nRedis with a five-minute TTL before resolving these questions can produce a technically functional but\noperationally unsafe design.\n\nAnthropic recommends having Claude interview the user before beginning a larger feature when important\nrequirements remain uncertain. The AskUserQuestion workflow is intended to surface technical\nimplementation concerns, edge cases, trade-offs, and assumptions the user may not have considered.\nAnthropic further recommends converting the resulting answers into a self-contained specification with\nexplicit scope and an end-to-end verification step. ( https://code.claude.com/docs/en/best-practices )\n\nOption B provides useful codebase context but postpones requirement discovery. Option C creates avoidable\nrework by allowing architecture to emerge from production failures. Option D documents uncertainty but\ndelegates unresolved design choices during implementation, when they may already constrain the code.\n\nAfter the interview produces a caching specification, Claude can enter plan mode to inspect the endpoint and\nmap those requirements onto the existing architecture before implementation.\n\nOfficial references/topics: Requirements Interviewing; AskUserQuestion; Specification Development; Edge-\nCase and Trade-Off Discovery."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 30,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates\nto specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one\ngenerates reports. The system researches topics and produces comprehensive, cited reports.\n\nThe synthesis agent completes its initial pass but flags that three key research questions remain unanswered\nbecause the web-search and document-analysis agents did not find relevant information on those specific\nsubtopics. The coordinator currently proceeds directly to report generation, producing reports with incomplete\ncoverage.\n\nWhat change would most effectively improve research completeness?"
    },
    "options": [
      {
        "en": "Increase the initial breadth of queries sent to web search and document analysis to reduce the\nprobability of missing relevant information."
      },
      {
        "en": "Have the coordinator evaluate the synthesis output for gaps, then re-delegate to web search and\ndocument analysis with targeted queries before invoking synthesis again."
      },
      {
        "en": "Have the report-generation agent note which research questions could not be answered, so users\nunderstand the limitations of the final output."
      },
      {
        "en": "Give the synthesis agent direct access to web-search tools so it can autonomously fill knowledge gaps\nwithout returning control to the coordinator."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B introduces an evaluator-and-refinement loop at the correct orchestration layer. The coordinator\nalready owns the research plan and delegation decisions, so it should inspect the synthesis result against the\nrequired questions, identify coverage gaps, and issue focused follow-up assignments. Anthropic’s description\nof its multi-agent research system follows this pattern: the lead agent synthesizes returned findings,\ndetermines whether additional research is required, and creates new subagents or refines its strategy before\nproducing the final result. Increasing the initial query breadth, option A, may generate additional irrelevant\nmaterial and cannot guarantee that unforeseen gaps will be covered. Option C merely documents the\nincompleteness instead of correcting it. Option D weakens role separation by giving the synthesis agent search\ncapabilities, increasing tool complexity and bypassing the coordinator’s centralized tracking. Targeted re-\ndelegation preserves specialized responsibilities and creates an observable sequence of research, evaluation,\nrefinement, and resynthesis. The coordinator should also maintain explicit coverage criteria and limit the\nnumber of refinement rounds so the system improves completeness without entering an uncontrolled research\nloop."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 31,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building developer-productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools—Read, Write, Bash, Grep, and Glob—and integrates with Model Context\nProtocol (MCP) servers.\n\nAn engineer asks the agent to understand how the caching layer works before adding a new cache-invalidation\ntrigger. Initial Grep searches show that caching logic spans 15 files containing decorators, middleware, and\nservice classes—approximately 8,000 lines in total.\n\nWhat is the most effective next step for building understanding while managing context constraints?"
    },
    "options": [
      {
        "en": "Analyze imports and class hierarchies to identify the base cache class, read that file to understand its\ninterface, and then trace the specific invalidation implementations."
      },
      {
        "en": "Use Glob to find files matching common caching patterns such as *cache*.py or caching/ , read the\nlargest files first, and inspect smaller files afterward."
      },
      {
        "en": "Use Read to load all 15 files sequentially and build a complete understanding of the caching\nimplementation."
      },
      {
        "en": "Use Grep to search for invalidate and expire , and then read only the matching line ranges with minimal\nsurrounding context."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A establishes the caching architecture before consuming thousands of implementation lines. The base\nclass or protocol reveals the supported operations, lifecycle, cache-key rules, and invalidation contract.\nImports, subclasses, registrations, and call sites can then direct the agent toward only those concrete\nimplementations relevant to the proposed trigger. Anthropic’s effective context-engineering guidance explains\nthat context is finite and that recall degrades as irrelevant tokens accumulate. It identifies Glob and Grep as\nmechanisms for retrieving code just in time rather than loading an entire repository upfront. Option B assumes\nfile size or naming determines architectural importance; a small interface may define the system while a large\nservice file contains incidental caching calls. Option C loads approximately 8,000 lines before establishing\nwhich portions matter. Option D is overly lexical and can miss invalidation implemented through event\npublication, key-version changes, inherited methods, or generically named hooks. Dependency-guided\nexploration provides a compact conceptual model first and expands the investigation only when concrete\nrelationships show that additional files are relevant."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 32,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are using Claude Code to accelerate software development. Your team uses it for code generation,\nrefactoring, debugging, and documentation. You need to integrate it into your development workflow with\ncustom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct\nexecution.\n\nYou’re implementing a new payment processing module that must follow your project’s established patterns\nfor database transactions, error handling, and audit logging. You’ve identified three existing modules that\nexemplify these patterns: db_utils.py , error_handlers.py , and audit_logger.py . This is a one-off integration\ntask—these patterns are well-documented in your team wiki and don’t need additional project-level\ndocumentation.\n\nWhat’s the most effective approach?"
    },
    "options": [
      {
        "en": "Use @ references to include the three modules directly in your prompt, giving Claude concrete code\nexamples of the patterns to follow."
      },
      {
        "en": "Add documentation of each pattern to your CLAUDE.md file, establishing them as project conventions\nthat Claude will apply automatically."
      },
      {
        "en": "Describe the patterns from the three modules in natural language in your prompt, explaining the\ntransaction handling approach, error format, and logging conventions Claude should follow."
      },
      {
        "en": "Ask Claude to explore your codebase to find and understand the transaction, error handling, and\nlogging patterns before generating the new module."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Direct @ references provide Claude with the exact implementations it must imitate. Anthropic documents that\nreferencing a file with @ includes the full file content in the conversation, and multiple files can be referenced\nin one message. This gives Claude immediate access to the real transaction boundaries, exception structures,\naudit fields, naming conventions, and helper APIs used by the project. ( https://code.claude.com/docs/en\n/common-workflows )\n\nOption B is inappropriate because the task is explicitly one-off and the conventions are already documented\nelsewhere. CLAUDE.md is loaded into every session and should contain concise information that broadly\napplies to the project. Adding detailed implementation material for a single integration would consume\ncontext unnecessarily. Anthropic recommends moving occasional procedures to skills and keeping CLAUDE.\nmd limited to persistent, widely applicable guidance. ( https://code.claude.com/docs/en/memory )\n\nOption C loses precision because a natural-language summary may omit subtle but important code behavior.\nOption D asks Claude to rediscover files that have already been identified, increasing exploration time and\ncontext usage.\n\nThe most effective prompt should reference all three modules, identify which pattern each demonstrates,\nspecify the new module’s required behavior, and request focused tests proving that the established\nconventions were followed.\n\nOfficial references/topics: @ file references, rich prompt context, CLAUDE.md scope, pattern-based\nimplementation."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 33,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JSON schemas, and maintains high accuracy. It must\nhandle edge cases gracefully and integrate with downstream systems.\n\nYour extraction system processes two document types: standard monthly reports, which are archived after\nprocessing, and urgent exception reports, which must trigger business alerts within 30 minutes of receipt.\nBoth use the same JSON schema. You want to minimize API costs while meeting the latency requirements.\n\nHow should you architect the processing pipeline?"
    },
    "options": [
      {
        "en": "Submit all documents to the Message Batches API with custom_id values for tracking. When results\narrive, immediately process urgent documents and trigger delayed alerts for exceptions."
      },
      {
        "en": "Route standard reports to the Message Batches API for 50% cost savings, and route urgent exception\nreports to the real-time Messages API."
      },
      {
        "en": "Queue all documents and submit hourly batches, flagging urgent documents for expedited handling\nwhen batch results return."
      },
      {
        "en": "Submit all documents to the real-time Messages API to ensure consistent processing latency across\ndocument types."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B correctly separates asynchronous bulk work from latency-sensitive operational work. Anthropic\ndescribes the Message Batches API as a cost-effective asynchronous service for high-volume requests that do\nnot require immediate responses. Batch requests are processed independently, normally finish within an hour,\nmay remain pending for up to 24 hours, and are billed at 50 percent of standard API prices. Those\ncharacteristics fit standard monthly reports because they are archived after processing and have no immediate\nbusiness deadline. Urgent exception reports, however, must trigger an alert within 30 minutes. The batch\nservice cannot guarantee that deadline, even if many batches finish quickly; a workload should not use typical\ncompletion time as a service-level guarantee. Routing exceptions through the synchronous Messages API\nprovides the real-time response path needed for alerting, while the shared JSON schema keeps downstream\nrecords consistent across both routes. Option A knowingly permits delayed alerts. Option C introduces an\nhourly submission delay before processing even begins. Option D meets latency requirements but wastes the\nbatch discount on non-urgent reports. A routing layer based on document priority therefore satisfies both the\ncost objective and the business deadline without changing the extraction contract."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 34,
    "domain": "mcp",
    "category": "Tool Design and MCP Integration",
    "prompt": {
      "en": "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-\nambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems\nthrough custom Model Context Protocol (MCP) tools ( get_customer , lookup_order , process_refund ,\nescalate_to_human ). Your target is 80%+ first-contact resolution while knowing when to escalate.\n\nCompliance requires that refunds exceeding $500 must automatically escalate to a human agent—this rule\ncannot be left to model discretion. Despite clear system prompt instructions, production logs show the agent\noccasionally processes high-value refunds directly (3% failure rate).\n\nHow should you achieve guaranteed compliance?"
    },
    "options": [
      {
        "en": "Add few-shot examples to the prompt showing correct escalation behavior at various refund amounts\n($400, $500, $600)."
      },
      {
        "en": "Strengthen the system prompt with emphatic language: “CRITICAL POLICY: Refunds over $500\nMUST trigger human escalation. NEVER process these directly.”"
      },
      {
        "en": "Modify the refund tool to return an error with message “Amount exceeds policy limit—please escalate”\nwhen the threshold is exceeded."
      },
      {
        "en": "Implement a hook to intercept tool calls, when the refund process amount exceeds $500, block it and\ninvoke human escalation."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "A mandatory compliance threshold must be enforced outside probabilistic model reasoning. A PreToolUse\nhook can inspect every attempted process_refund call before execution, compare its amount with the $500\nthreshold, and deny the call when the limit is exceeded. The host application can then create the human-\nescalation case using the validated customer and order context.\n\nAnthropic describes hooks as deterministic controls that ensure required actions occur instead of relying on\nthe model to choose them. Agent SDK documentation confirms that a single denying PreToolUse hook blocks\nthe tool call, including MCP tools matched through their qualified tool names. ( https://docs.anthropic.com/en\n/docs/claude-code/hooks-guide )\n\nOptions A and B improve expected behavior but cannot guarantee compliance. The stated production failure\nrate demonstrates that prompting alone is insufficient. Option C prevents the refund from completing, but the\nsubsequent escalation still depends on Claude correctly interpreting the returned error and invoking the human\ntool. It therefore enforces the financial block but not the complete escalation requirement.\n\nOption D enforces both sides of the policy at the orchestration boundary: deny the unauthorized action and\nroute the case to an approved human process. The escalation action should be idempotent and auditable.\n\nOfficial references/topics: PreToolUse hooks, deterministic policy enforcement, MCP tool interception,\nhuman-approval controls."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 35,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "When analyzing complex legal cases that cite multiple precedents, the document-analysis subagent processes\neach precedent sequentially. A landmark case citing 12 precedents takes more than three minutes to analyze\ncompletely. What is the most effective way to reduce this latency while preserving the coordinator’s ability to\nmonitor and debug the system?"
    },
    "options": [
      {
        "en": "Have the coordinator spawn parallel document-analysis subagents, each handling a subset of\nprecedents, and then aggregate the results before synthesis."
      },
      {
        "en": "Enable the document-analysis subagent to spawn its own specialized subagents dynamically when it\nencounters cases with many citations."
      },
      {
        "en": "Create a recursive agent hierarchy where analysis agents subdivide work among child agents until\nreaching single-precedent granularity."
      },
      {
        "en": "Implement a message queue where precedent-analysis tasks are processed asynchronously by a pool of\nworker agents."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A parallelizes independent precedent analysis while preserving centralized control. The coordinator\ncan partition the 12 precedents into balanced groups, provide each worker with identical extraction and\ncitation requirements, monitor completion or failure, and aggregate the structured results before invoking\nsynthesis.\n\nAnthropic’s multi-agent research architecture uses an orchestrator-worker pattern in which a lead agent\ncoordinates specialized subagents operating in parallel. Parallel execution is valuable when tasks are\nsubstantially independent, as each precedent can be analyzed without waiting for the preceding case.\nMaintaining the fan-out at the coordinator also produces a clear execution trace showing each assignment,\nstatus, and returned result.\n\nOption B introduces nested delegation and makes tool usage, permissions, failures, and costs harder for the\ncoordinator to observe. Option C compounds those problems through recursive spawning and risks excessive\nagent and token consumption. Option D may be appropriate for a large distributed processing platform, but it\nadds infrastructure without inherently improving the coordinator’s reasoning-level observability or defining\nhow results are associated with the case. Coordinator-managed parallel workers provide the required latency\nreduction with the simplest debuggable architecture."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 36,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol\n(MCP) servers.\n\n1.5An engineer asks the agent to understand how the caching layer works before adding a new cache\ninvalidation trigger. After initial Grep searches, the agent has identified that caching logic spans 15 files\nincluding decorators, middleware, and service classes (~6,000 lines total).\n\nWhat’s the most effective next step for building understanding while managing context constraints?"
    },
    "options": [
      {
        "en": "Use Grep to search for “invalidate” and “expire” patterns across all files, then Read only those specific\nline ranges with minimal surrounding context."
      },
      {
        "en": "Use the Read tool to sequentially load all 15 files, building complete understanding across the full\ncaching implementation."
      },
      {
        "en": "Use Glob to find files matching common caching patterns ( cache*.py , caching/ ), prioritize the largest\nfiles by reading them first, then check smaller files for gaps."
      },
      {
        "en": "Analyze imports and class hierarchies to identify the base cache class. Read that file to understand the\ninterface, then trace specific invalidation implementations."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "The correct objective is to construct an architectural map before consuming the full implementation.\nIdentifying the base cache abstraction, its interface, and the classes that implement or invoke it gives the agent\na dependency-guided path through the code. It can then inspect only the invalidation implementations and\nintegration points relevant to the proposed trigger.\n\nThis approach protects the context window. Anthropic states that every file read occupies context and that\nmodel performance can deteriorate as the window fills. Its Claude Code guidance warns against unbounded\ninvestigation that reads large numbers of files and recommends narrowing the exploration or delegating it. (\nhttps://code.claude.com/docs/en/best-practices )\n\nOption A is too lexical: searching only for invalidate or expire can miss event-driven invalidation, overridden\nmethods, cache-key mutation, and generic interface calls. Option B loads approximately 6,000 lines without\nfirst establishing relevance. Option C assumes that filename patterns and file size correlate with architectural\nimportance; the largest files may contain incidental code while a small interface defines the entire design.\n\nOption D follows control and type relationships rather than arbitrary file order. After reading the base class,\nthe agent can search for subclasses, imports, construction sites, middleware hooks, and calls to the\ninvalidation contract, progressively expanding only where evidence requires it.\n\nOfficial references/topics: Context-Efficient Exploration; Dependency-Guided Reading; Architectural\nInterfaces; Narrowly Scoped Investigation."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 37,
    "domain": "mcp",
    "category": "Tool Design and MCP Integration",
    "prompt": {
      "en": "When implementing your lookup_order MCP tool, the backend sometimes returns errors—for example,\n“Order not found” or temporary database failures. What is the correct pattern for communicating these errors\nback to the agent?"
    },
    "options": [
      {
        "en": "Return the error message in the tool-result content with the isError flag set to true."
      },
      {
        "en": "Return a successful response with a status field indicating the error type."
      },
      {
        "en": "Log the error server-side and return an empty result to avoid confusing the model."
      },
      {
        "en": "Throw an exception from the tool handler so the agent framework can catch and log it."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A follows the MCP error contract. An error originating during execution of a valid tool call—such as\nan API failure, input-validation problem, or business-logic failure—should be returned inside the tool result\nwith isError: true. The content should explain what happened and, where possible, provide actionable\nrecovery guidance.\n\nThe official MCP tools specification distinguishes tool-execution errors from protocol-level errors and\nspecifies that execution failures are reported through tool results using isError: true. Anthropic’s tool-using\n\nagent tutorial provides the equivalent Claude API pattern using is_error: true, allowing Claude to retry with\ncorrected input, request clarification, or explain the limitation.\n\nOption B falsely represents a failed operation as successful, weakening reliable failure detection. Option C\ndeprives the agent of the information required to determine an appropriate recovery action. Option D may be\nconverted into a tool error by some SDK runners, but uncaught exceptions are not the MCP-level response\ncontract. The strongest implementation returns a concise, sanitized, actionable error result and separately\nrecords detailed diagnostics in server logs."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 38,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-\nambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems\nthrough custom Model Context Protocol (MCP) tools ( get_customer , lookup_order , process_refund ,\nescalate_to_human ). Your target is 80%+ first-contact resolution while knowing when to escalate.\n\nDuring a billing dispute resolution, your agent successfully retrieves customer info via get_customer and\norder details via lookup_order , but when attempting to call process_refund , the tool returns a timeout error.\nThe agent has enough information to explain the charges and verify refund eligibility, but cannot actually\nprocess the refund due to the backend failure.\n\nWhat approach best balances first-contact resolution with appropriate error handling?"
    },
    "options": [
      {
        "en": "Implement automatic retries with exponential backoff for process_refund , keeping the conversation\nopen until the refund is successfully processed."
      },
      {
        "en": "Confirm the refund will be processed and close the conversation, since the system has all necessary\ninformation to complete it automatically."
      },
      {
        "en": "Explain the billing, confirm refund eligibility, acknowledge the system issue preventing immediate\nprocessing, and offer escalation or retry later."
      },
      {
        "en": "Escalate immediately to a human agent since the refund action cannot be completed."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "First-contact resolution does not require pretending that every backend operation succeeded. The agent can\nstill resolve the informational portion of the interaction by explaining the charge and confirming eligibility\nusing the successfully retrieved customer and order data. It must then distinguish that verified conclusion\nfrom the uncompleted refund transaction.\n\nAnthropic’s tool-error guidance states that Claude should receive the failure information so it can retry,\nrequest clarification, or explain the limitation. A tool timeout must therefore be surfaced honestly rather than\nconverted into an unsupported success claim. ( https://platform.claude.com/docs/en/agents-and-tools/tool-use\n/build-a-tool-using-agent?utm_source=chatgpt.com ) Anthropic also emphasizes transparent, simple agent\ndesigns and carefully constructed tool interfaces, which support explicit disclosure of tool failure and\ncontrolled escalation. ( https://www.anthropic.com/engineering/building-effective-agents )\n\nOption A can create an unbounded or excessively long interaction; retries should be limited and conditioned\non retryability. Option B falsely represents an incomplete financial operation as completed. Option D discards\nthe useful work already performed and escalates before providing the customer with the available explanation.\n\nOption C preserves trust, delivers the information already established, clearly states what remains incomplete,\nand gives the customer a practical next step through bounded retry or human escalation.\n\nOfficial references/topics: Graceful tool failure, transparent customer communication, bounded retry, human\nescalation."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 39,
    "domain": "mcp",
    "category": "Tool Design and MCP Integration",
    "prompt": {
      "en": "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol\n(MCP) servers.\n\nAfter integrating a local MCP server providing code analysis tools ( analyze_dependencies , find_dead_code ,\ncalculate_complexity ), you verify the server is healthy and tools appear in the tools/list response. However,\nyou observe that the agent consistently uses Grep to search for import statements instead of calling\nanalyze_dependencies —even when users explicitly ask about “code dependencies.” Examining tool\ndefinitions reveals:\n\nMCP analyze_dependencies – “Analyzes dependency graph”\n\nBuilt-in Grep – “Search file contents for a pattern using regular expressions. Returns matching lines\nwith line numbers and surrounding context.”\n\nWhat’s the most effective approach to improve the agent’s selection of MCP tools?"
    },
    "options": [
      {
        "en": "Add routing instructions to the system prompt specifying that dependency-related questions should use\nMCP tools rather than Grep."
      },
      {
        "en": "Expand MCP tool descriptions to detail capabilities and outputs—e.g., “Builds dependency graph\nshowing direct imports, transitive dependencies, and cycles.”"
      },
      {
        "en": "Remove Grep from available tools when the MCP server is connected to eliminate functional overlap."
      },
      {
        "en": "Split analyze_dependencies into granular tools ( list_imports , resolve_transitive_deps ,\ndetect_circular_deps ) so each has a focused purpose less likely to overlap with Grep."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Claude selects tools principally from their names, descriptions, parameter schemas, and the task context. The\ncurrent description—“Analyzes dependency graph”—does not explain why the MCP tool is superior to a\nfamiliar text search. It omits the tool’s scope, the circumstances in which it should be selected, and the\nstructured information it returns.\n\nAnthropic identifies detailed descriptions as the most important factor in tool-use performance. A strong\ndescription should state what the tool does, when it should and should not be used, what its parameters mean,\nand any limitations. Anthropic recommends several sentences for complex tools rather than a short generic\nlabel. ( https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/implement-tool-use ) The MCP\nconnector guidance likewise states that Claude selects among available tools using their names and\ndescriptions and that clear, specific descriptions improve selection accuracy. ( https://docs.anthropic.com/en\n/docs/agents-and-tools/mcp-connector )\n\nOption B makes the functional distinction explicit: Grep locates textual import statements, whereas\nanalyze_dependencies constructs a semantic graph containing direct and transitive dependencies, cycles, and\npotentially unresolved references. Option A is a brittle global override. Option C removes a generally useful\ntool. Option D increases the number of tools and selection ambiguity, contrary to Anthropic’s\nrecommendation to consolidate related operations where practical.\n\nOfficial references/topics: MCP Tool Discovery; Tool Descriptions; Tool Selection Accuracy; Tool-Surface\nDesign."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 40,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JSON schemas, and maintains high accuracy. It must\nhandle edge cases gracefully and integrate with downstream systems.\n\nAfter your daily batch of 10,000 documents completes, 300 documents (3%) fail with\ncontext_length_exceeded errors. The results file identifies each failure by custom_id.\n\nWhat is the most cost-effective approach to process these failures?"
    },
    "options": [
      {
        "en": "Resubmit the entire 10,000-document batch using a model tier with a larger context window."
      },
      {
        "en": "Reprocess the entire batch with prompt caching enabled to reduce the cost of retrying requests with\nidentical system prompts."
      },
      {
        "en": "Increase the max_tokens parameter for the 300 failed documents and resubmit them in a new batch."
      },
      {
        "en": "Resubmit only the 300 failed documents after chunking them into smaller pieces, and then combine the\npartial extractions."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "Option D fixes the actual failure while avoiding needless reprocessing. Anthropic’s Message Batches API\ntreats every request independently, records the result against its unique custom_id, and explicitly states that\none failed request does not affect the others. The 9,700 successful documents therefore require no retry. The\nfailed requests exceeded the available context; increasing max_tokens changes the permitted output budget,\nnot the size of the input context, so option C does not correct the cause. Resubmitting all 10,000 requests\nwould repeat paid work, and prompt caching would only reduce some repeated-input cost without repairing\noversized requests. Chunking each failed document reduces the input presented to Claude so every\nreplacement request fits within the model’s context window . The application can then merge the extracted\n\npartial structures deterministically, retaining the original document identifier and chunk ordering. Anthropic\nrecommends retry logic for failed batch requests and using custom_id to match results because batch results\ncan arrive out of order. Consequently, selective retry plus chunking is both the technically correct recovery\npath and the lowest-cost option."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 41,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline.\nThe system runs automated code reviews, generates test cases, and provides feedback on pull requests. You\nneed to design prompts that provide actionable feedback and minimize false positives.\n\nYour automated code review is missing genuine bugs in pull requests. Investigation reveals that your review\nprompt includes the instruction: “Only flag critical issues that would definitely cause production failures.\nIgnore minor concerns and anything you are uncertain about.” Developers confirm that some missed bugs are\ngenuine logic errors that the model investigated but chose not to report. The team requires the review output\nto remain structured, with each finding tagged with metadata, and actionable.\n\nWhich prompt change both removes the cause of the suppressed findings and preserves structured, tagged\noutput for downstream filtering?"
    },
    "options": [
      {
        "en": "Add a second review pass that rereads the diff using the same prompt, looking for anything the first\npass may have missed."
      },
      {
        "en": "Instruct the model to report all findings with confidence and severity tags, deferring filtering to a\ndownstream step."
      },
      {
        "en": "Remove all severity-related instructions from the prompt and let the model use its default judgment\nabout what to report."
      },
      {
        "en": "Enable extended thinking and instruct the model to reason step by step about every code change before\nproducing its review."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B removes the prompt-level suppression responsible for the false negatives while preserving machine-\nreadable metadata. Anthropic’s current code-review prompting guidance warns that instructions such as “only\nreport high-severity issues” or “be conservative” may be followed literally: Claude can identify genuine\ndefects during analysis but omit them from its output. Anthropic recommends requesting all findings and\napplying filtering separately.\n\nConfidence and severity fields allow downstream code to apply adjustable thresholds without forcing the\nmodel to discard evidence during generation. A schema can require fields such as file, line, description,\nseverity, confidence, evidence, and recommended action; Anthropic’s Structured Outputs documentation\nsupports enforcing such a response contract. Option A repeats the same suppressive instruction and is likely to\nreproduce the same omissions. Option C removes the explicit reporting structure and leaves filtering behavior\n\nundefined. Option D may improve analysis depth, but extended reasoning does not override a direct\ninstruction to suppress uncertain findings. Separating detection from deterministic filtering preserves recall,\nstructure, and operational control."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 42,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "The synthesis agent completes its initial pass but flags that three key research questions remain unanswered\nbecause the web-search and document-analysis agents did not find relevant information on those specific\nsubtopics. The coordinator currently proceeds directly to report generation, producing reports with incomplete\ncoverage. What change would most effectively improve research completeness?"
    },
    "options": [
      {
        "en": "Have the coordinator evaluate the synthesis output for gaps, then redelegate targeted queries to the web-\nsearch and document-analysis agents before invoking synthesis again."
      },
      {
        "en": "Have the report-generation agent identify unanswered research questions so users understand the\nlimitations of the final output."
      },
      {
        "en": "Increase the initial breadth of queries sent to the web-search and document-analysis agents to reduce the\nprobability of missing relevant information."
      },
      {
        "en": "Give the synthesis agent direct access to web-search tools so it can autonomously fill knowledge gaps\nwithout returning control to the coordinator."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A implements an iterative orchestrator-worker loop in which synthesis is treated as an evaluation\ncheckpoint rather than an irreversible transition to report generation. When synthesis identifies missing\nevidence, the coordinator can formulate focused follow-up tasks, send them to the agents with the appropriate\ntools, and repeat synthesis after receiving the additional findings.\n\nAnthropic’s multi-agent research architecture follows this pattern: the lead agent synthesizes subagent\nfindings and determines whether further research is required. If gaps remain, it creates additional subagents or\nrefines the research strategy. This preserves specialization and centralized control.\n\nOption B makes the incompleteness visible but does not improve research coverage. Option C may increase\ninitial cost without guaranteeing that the specific gaps discovered during synthesis will be addressed. Option\nD weakens separation of concerns by giving the synthesis agent search capabilities that belong to the research\nspecialists. Targeted redelegation is more efficient because the second research round is informed by concrete\ndeficiencies rather than speculative breadth. It also allows the coordinator to track completeness explicitly\nbefore authorizing final report generation."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 43,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "Your automated reviewer uses a single prompt covering security issues, API design, and business-logic\ncorrectness. Your evaluation suite shows strong recall for API-design findings at 82% but poor recall for\nbusiness-logic edge cases in quiz scoring at 34%. When you add few-shot examples of logic bugs to the\n\nprompt, logic recall improves to 41%, but API-design recall drops to 68%. How should you address this trade-\noff to improve detection across both categories?"
    },
    "options": [
      {
        "en": "Provide the full repository as context instead of only the changed files and surrounding code, giving the\nmodel deeper visibility into business-logic patterns."
      },
      {
        "en": "Replace the few-shot examples with a detailed checklist of specific logic edge cases to verify, such as\ndivision by zero in score calculations and boundary conditions in grading thresholds."
      },
      {
        "en": "Split the review into separate focused prompts—one for security and API design and another for\nbusiness logic—each with dedicated examples, and then consolidate the findings before posting."
      },
      {
        "en": "Upgrade to a more capable model tier because its stronger reasoning will handle both concern types in a\nsingle prompt and eliminate the recall trade-off."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "The evaluation results demonstrate prompt interference: improving attention to business-logic examples\nreduces performance on API design. Option C isolates the competing objectives so each model call can apply\nfocused terminology, examples, evidence requirements, and evaluation criteria. The resulting structured\nfindings can then be merged, deduplicated, and ranked before being posted.\n\nAnthropic’s Building Effective AI Agents describes parallelization through sectioning, where independent\naspects of a task are handled by separate model calls and subsequently aggregated. This pattern is appropriate\nwhen one prompt must evaluate several distinct considerations and a single call does not handle all of them\nreliably.\n\nOption A increases context volume without resolving competition between the review objectives; irrelevant\nrepository content may further dilute attention. Option B may improve known quiz-scoring cases but can\noverfit the reviewer to an incomplete checklist and does not restore API-design recall. Option D assumes that\nadditional model capability will eliminate prompt interference without supporting evaluation evidence.\nSeparate specialized review passes directly address the measured failure. Each pass should be evaluated\nindependently, followed by an end-to-end evaluation confirming that consolidation preserves recall and does\nnot introduce duplicated findings."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 44,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are building developer-productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools—Read, Write, Bash, Grep, and Glob—and integrates with Model Context\nProtocol (MCP) servers.\n\nAn engineer asks the agent to find every file in a monorepo that imports the @company/auth package to\nunderstand how authentication is used across services.\n\nWhich built-in tool is most appropriate for this task?"
    },
    "options": [
      {
        "en": "Read, beginning with package.json files to trace dependency declarations."
      },
      {
        "en": "Glob, to find files containing auth in their filename or path."
      },
      {
        "en": "Grep, to search file contents for the import-statement pattern."
      },
      {
        "en": "Bash, to execute find . -type d -name \" *auth* \" and explore matching directories."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C directly searches source-file contents for imports of @company/auth . Anthropic’s Claude Code\ntools reference states that Grep locates patterns within files, while Glob matches filenames and paths. The\nsearch can account for the repository’s supported module syntaxes, including static imports, require() calls,\ndynamic imports, and re-exports. It can also restrict results by file type or directory when appropriate. Option\nA identifies packages that declare the dependency but does not prove which source files import or invoke it;\nworkspace-level dependency declarations may cover many packages. Option B finds authentication-related\nfilenames, which are unrelated to whether a file imports the package. Option D searches directory names and\ntherefore has the same limitation. After Grep returns the matching files and line numbers, the agent can read\nthe surrounding code to determine whether each import supports middleware registration, token verification,\nauthorization checks, or re-exporting. This produces an accurate usage inventory while minimizing context\nconsumption and unnecessary file reads."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 45,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "Your automated review generates many findings per pull request, but developer feedback shows that roughly\nhalf are dismissed as “not worth addressing.” Analysis reveals that dismissed findings are often technically\naccurate but involve minor style preferences or patterns that are acceptable in your codebase. Before adding\ninfrastructure complexity, what prompt-design change could most effectively reduce dismissals while\nmaintaining the detection of genuine issues?"
    },
    "options": [
      {
        "en": "Add explicit criteria defining which issues to report, such as bugs and security defects, and which issues\nto skip, such as minor style preferences and accepted local patterns."
      },
      {
        "en": "Implement a secondary classification model that filters Claude’s findings according to predicted\ndeveloper acceptance."
      },
      {
        "en": "Ask Claude to rate every finding’s confidence from 1 to 10 and include only findings rated 8 or higher."
      },
      {
        "en": "Append instructions telling Claude to “only report findings you are highly confident are genuine\nproblems.”"
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "The problem is an undefined relevance threshold. Claude is finding technically valid observations, but the\nprompt does not clearly distinguish actionable defects from acceptable conventions and low-value style\n\npreferences. Option A establishes explicit positive and negative reporting criteria, allowing the model to apply\nthe team’s actual definition of a useful finding during generation.\n\nAnthropic’s prompt-engineering guidance emphasizes clear, specific instructions and well-defined success\ncriteria. The managed Code Review documentation similarly recommends defining skipped categories,\ngenerated paths, severity rules, and evidence requirements. Reporting “bugs affecting correctness or security”\nwhile excluding “formatting handled by CI and documented local conventions” is substantially more precise\nthan asking the model to be generally conservative.\n\nOption B adds cost, latency, another probabilistic decision, and a new evaluation surface before improving the\noriginal prompt. Option C confuses confidence with importance: Claude may be highly confident about a\ntrivial style observation. Option D is dangerously broad because it can suppress legitimate but uncertain bugs,\nreducing recall. Explicit relevance criteria address the demonstrated failure directly while preserving the\nmodel’s ability to investigate and report genuine correctness or security problems."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 46,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "During initial testing of the automated review pipeline, you notice that reviews of large pull requests\ncontaining more than 50 changed files sometimes take over 20 minutes and cost $8–$12 per run because of\nextensive agentic loops—Claude reads files, runs analysis tools, and iterates many times. Your team needs\neach invocation to abort after reaching either a fixed iteration count or a fixed dollar amount. Both limits must\nbe enforced by Claude Code itself rather than by the surrounding job runner. Which configuration change\ndirectly enforces both per-invocation limits?"
    },
    "options": [
      {
        "en": "Add --max-turns 10 --max-budget-usd 2.00 to the claude -p invocation to cap agentic turns and\nexpenditure."
      },
      {
        "en": "Set --permission-mode dontAsk to automatically deny tool-permission requests that are not in the\nexplicitly allowed set."
      },
      {
        "en": "Set timeout-minutes: 5 on the GitHub Actions step and monitor per-run costs through the Anthropic\nConsole usage dashboard."
      },
      {
        "en": "Use the --model flag to select a smaller, less expensive model so that every iteration uses fewer tokens\nand costs less."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A is the only configuration that establishes both required limits inside Claude Code. The official CLI\nreference defines --max-turns as the maximum number of agentic turns permitted in print mode; Claude Code\nexits with an error when that limit is reached. It defines --max-budget-usd as the maximum dollar expenditure\non API calls before execution stops, including applicable subagent expenditure.\n\nThese controls address different failure dimensions. The turn limit prevents an investigation from continuing\nthrough excessive read-search-analyze cycles, while the budget limit stops an invocation whose expensive\nturns consume the monetary allowance before reaching the turn ceiling. Supplying both therefore creates an\neffective per-run boundary.\n\nOption B controls how permission requests are handled; it does not limit the number of already permitted tool\ncalls or API expenditure. Option C applies an external wall-clock timeout and merely observes cost, violating\nthe requirement that Claude Code itself enforce both limits. Option D lowers expected cost per turn but\ncreates no hard ceiling: the agent can still perform many iterations and exceed the intended budget. A cheaper\nmodel also does not guarantee that the review will terminate within a predictable number of turns."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 47,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol\n(MCP) servers.\n\nYour agent has spent 25 minutes exploring a game engine’s rendering subsystem—reading shader code,\nbuffer management, and frame synchronization logic. An engineer now asks it to understand how the physics\nengine integrates with rendering for collision debug overlays. You notice recent responses reference “typical\nrendering patterns” rather than the specific VulkanPipeline and FrameGraph classes it discovered earlier.\n\nWhat’s the most effective approach?"
    },
    "options": [
      {
        "en": "Spawn a sub-agent to explore physics independently, then manually synthesize its findings with the\nrendering knowledge accumulated in the main conversation."
      },
      {
        "en": "Use /clear to reset context completely, then start fresh with physics exploration using file paths from the\nproject’s CLAUDE.md."
      },
      {
        "en": "Summarize key rendering findings, then spawn a sub-agent for physics exploration with that summary\nin its initial context."
      },
      {
        "en": "Continue in the current context with more targeted prompts referencing the specific classes by name."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "The reference to generic rendering patterns indicates that the current context has become saturated or that\nimportant earlier details are no longer receiving sufficient attention. Anthropic documents that performance\ncan degrade as a Claude Code context window fills with conversation history, file contents, and command\noutput; symptoms include forgetting earlier instructions and making less precise responses. ( https://code.\nclaude.com/docs/en/best-practices )\n\nOption C preserves the high-value rendering discoveries while isolating the physics investigation. The\nsummary should identify the relevant rendering classes, synchronization boundaries, debug-overlay\ninterfaces, and unresolved integration questions. A physics-focused subagent can then inspect collision and\nsimulation code in its own context without adding dozens of additional files to the already crowded main\nconversation.\n\nThis explicit summary matters because an ordinary named subagent starts with a fresh, isolated context and\ndoes not automatically receive the parent’s full conversation history or previously read files. Claude\nconstructs a delegation message containing the task context, so the essential rendering findings must be\nsupplied deliberately. ( https://docs.anthropic.com/en/docs/claude-code/sub-agents )\n\nOption A omits the integration context needed to guide the physics search. Option B destroys useful prior\nanalysis. Option D keeps expanding an already degraded context and treats the symptom rather than\ncontrolling context growth.\n\nOfficial references/topics: Context-Window Management; Subagent Isolation; Delegation Summaries;\nCodebase Exploration."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 48,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "Your automated code review is missing genuine bugs in pull requests. Investigation reveals that the review\nprompt includes this instruction: “Only flag critical issues that would definitely cause production failures.\nIgnore minor concerns and anything you are uncertain about.” Developers confirm that some missed findings\nare genuine logic errors that the model investigated but chose not to report. The team requires the review\noutput to remain structured, with every finding tagged with metadata, and actionable. Which prompt change\nboth removes the cause of the suppressed findings and preserves structured, tagged output for downstream\nfiltering?"
    },
    "options": [
      {
        "en": "Enable extended thinking and instruct the model to reason step by step about every code change before\nproducing its review."
      },
      {
        "en": "Instruct the model to report all findings with confidence and severity tags, deferring filtering to a\ndownstream step."
      },
      {
        "en": "Remove all severity-related instructions and allow the model to use its default judgment about which\nfindings to report."
      },
      {
        "en": "Add a second review pass that rereads the diff using the same prompt and looks for anything the first\npass may have missed."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "The prompt explicitly instructs Claude to suppress uncertain and lower-severity findings. Increasing reasoning\ndepth cannot override that reporting policy: Claude may identify a real defect during analysis and still omit it\nfrom the final response. Option B separates comprehensive detection from acceptance filtering, removing the\nsource of the false negatives while retaining metadata needed for automated decisions.\n\nAnthropic’s current code-review prompting guidance recommends reporting every issue, including uncertain\nor lower-severity candidates, and attaching confidence and estimated severity so a separate verification or\nfiltering stage can rank them. A structured schema can additionally require fields such as file path, line\nnumber, category, confidence, severity, evidence, and recommended action.\n\nOption A may improve investigation quality but leaves the suppression instruction intact. Option C removes\nthe problematic threshold but also discards the explicit structured classification needed by downstream\nprocessing. Option D repeats the same review policy, so the second pass can suppress the same findings as the\nfirst. Option B preserves recall and machine-readable output while allowing deterministic, adjustable\ndownstream thresholds. This is more reliable than embedding an overly restrictive acceptance decision inside\nthe model’s initial detection task."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 49,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "The automated review consistently flags patterns your team uses intentionally—force-unwrapping optionals\nin test files, using large coordinator classes that follow your established architecture, and importing internally\nmaintained modules marked as deprecated in the public SDK. Developers are dismissing approximately 30%\nof all findings as project-specific false positives. Which approach prevents the model from generating these\nfindings in the first place by supplying the project’s conventions as persistent context during every review?"
    },
    "options": [
      {
        "en": "Build post-processing keyword filters that suppress findings containing terms such as “force unwrap,”\n“large class,” or “deprecated import” before results reach developers."
      },
      {
        "en": "Configure the review to analyze only the changed lines in the diff without surrounding file context,\nreducing the amount of code the model evaluates during each review."
      },
      {
        "en": "Have developers add inline suppression comments at flagged lines and preprocess diffs to exclude\nsuppressed lines before sending code to the model."
      },
      {
        "en": "Document the team’s accepted patterns and intentional conventions in the project’s CLAUDE.md file\nso the model receives this context during every review."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "Option D supplies the missing repository-specific knowledge before Claude evaluates the code. The project’s\nCLAUDE.md should state that force-unwrapping is permitted within test paths, explain the coordinator-class\narchitecture, and identify the internally maintained deprecated module as an approved dependency. These\ninstructions should be concise and scoped carefully so exceptions do not become global permissions.\n\nAnthropic’s CLAUDE.md documentation defines project CLAUDE.md files as persistent context for coding\nstandards, architecture, workflows, and team conventions. They are loaded at the beginning of applicable\nsessions, preventing the organization from repeatedly supplying the same corrections. Anthropic also\nrecommends recording information that Claude should know whenever it works in the repository.\n\nOption A filters generated findings after tokens have already been consumed and can hide genuine issues\ncontaining similar terminology. Option B removes valuable surrounding context and would likely increase\nfalse positives and missed cross-file defects. Option C distributes project knowledge across individual source\nlines, creates maintenance overhead, and requires custom preprocessing. Centralized, narrowly scoped\nCLAUDE.md instructions address the root cause and improve the initial review judgment instead of repairing\nits output afterward."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 50,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and\nmaintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.\n\nMonitoring shows 12% of extractions fail Pydantic validation with specific errors like “expected float for\nquantity, got ‘2 to 3’”. Retrying these requests without modification produces identical failures.\n\nWhat’s the most effective approach to recover from these validation failures?"
    },
    "options": [
      {
        "en": "Send a follow-up request including the validation error, asking the model to correct its output."
      },
      {
        "en": "Set temperature to 0 to eliminate output variability and ensure consistent formatting."
      },
      {
        "en": "Pre-process source documents to standardize problematic formats before sending them for extraction."
      },
      {
        "en": "Implement a secondary pipeline using a larger model tier to reprocess documents that fail validation."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "An unchanged retry repeats the same task specification and therefore commonly reproduces the same invalid\ninterpretation. The validator has generated precise corrective information— quantity requires a float, but the\nmodel returned the range string 2 to 3 . Supplying that error in a follow-up turn converts a generic retry into\nan iterative repair operation.\n\nAnthropic identifies iterative refinement as a method for detecting and correcting inconsistencies by feeding\nan earlier output back into a subsequent request with targeted instructions. ( https://docs.anthropic.com/en/docs\n/test-and-evaluate/strengthen-guardrails/reduce-hallucinations ) Option A applies that pattern directly. Claude\nreceives the invalid output, the exact Pydantic error, and an instruction to return a schema-compliant\ncorrection. The application should cap retries, retain the original source, and escalate cases that cannot be\nrepresented without information loss.\n\nOption B does not guarantee correct formatting; lower temperature may make the same wrong output more\nrepeatable. Option C can be valuable for systematic OCR or source-format problems, but it is unnecessarily\nbroad when the immediate failure is already described by the validator. Option D increases cost and\ncomplexity without first using the actionable feedback available from the existing validation layer.\n\nFor supported models, native Structured Outputs should also be considered because they guarantee schema-\nconformant JSON and can prevent many Pydantic shape failures before they occur. ( https://platform.claude.\ncom/docs/en/build-with-claude/structured-outputs )\n\nOfficial references/topics: Iterative Refinement; Validation-Error Feedback; Bounded Retry Loops;\nStructured Outputs."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 51,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline.\nThe system runs automated code reviews, generates test cases, and provides feedback on pull requests. You\nneed to design prompts that provide actionable feedback and minimize false positives.\n\nA developer uses Claude Code to refactor a function during a development session. Before committing, the\ndeveloper asks the same Claude session to review the code for issues. Later, a separate automated CI review\ncatches several bugs that the same-session review missed.\n\nWhat best explains this discrepancy?"
    },
    "options": [
      {
        "en": "Claude retains the implementation context and prior decisions in the session, making it less likely to\nchallenge assumptions underlying its own changes."
      },
      {
        "en": "The session’s context window necessarily became full, leaving insufficient capacity for meaningful\nreview."
      },
      {
        "en": "The CI review must have used a more specific prompt, while the developer’s review request was too\ngeneral."
      },
      {
        "en": "The CI environment can access the full repository, while a local Claude Code session can access only\nthe current file."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A describes the principal reason an independent review context is valuable. The implementing session\ncontains the assumptions, interpretations, and reasoning that produced the refactor. When asked to review its\nown work, Claude may continue operating within those same assumptions and therefore overlook defects\ncaused by them. A fresh reviewer evaluates the resulting diff and stated requirements independently, without\ninheriting the implementation narrative.\n\nAnthropic’s Claude Code best-practices guidance explicitly recommends an adversarial review step using a\nfresh subagent or separate context. It explains that the reviewer should see the diff and review criteria rather\nthan the reasoning that produced the change. Option B is possible in an unusually long session, but the\nscenario provides no evidence that the context window was exhausted. Option C could influence review\nquality, but no prompt difference is established. Option D is factually incorrect: a local Claude Code session\ncan inspect the checked-out repository through its filesystem tools. The reliable workflow is therefore a writer\n/reviewer separation in which implementation occurs in one context and correctness review occurs in a fresh\ncontext with explicit evidence and reporting criteria. Claude Code best practices"
    },
    "sourceLanguage": "en"
  },
  {
    "id": 52,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol\n(MCP) servers.\n\nAn engineer asks the agent to find all callers of a function before removing it. The function is defined in a\ncore library but is also exposed through wrapper modules that rename the function for domain-specific use (e.\ng., calculateTax in the library becomes computeOrderTax in the orders module).\n\nWhat exploration strategy will most reliably identify all callers?"
    },
    "options": [
      {
        "en": "Use Grep to find all files that import from the library or wrapper modules, then read each file to check\nwhether it uses the function."
      },
      {
        "en": "Use Grep to search for the function’s original name across the codebase."
      },
      {
        "en": "Read the library and wrapper modules to identify all exposed names for the function, then Grep for each\nname across the codebase."
      },
      {
        "en": "Search for the function name in project documentation to understand intended usage patterns and\nnavigate to documented integration points."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "The search must first establish the function’s complete naming surface. Reading the core definition and every\nwrapper or re-export reveals aliases such as computeOrderTax , names introduced through intermediate\nmodules, and potentially different import paths. Once those names are known, the agent can search the entire\ncodebase for each exposed identifier and inspect the resulting call sites.\n\nClaude Code’s Grep tool searches patterns inside file contents, whereas Read provides the surrounding\nimplementation needed to determine whether a wrapper delegates to, renames, or conditionally invokes the\noriginal function. These tools are complementary: Read establishes semantic identity; Grep provides broad\nreference discovery. ( https://code.claude.com/docs/en/tools-reference?utm_source=chatgpt.com )\n\nOption B misses every caller using a wrapper alias. Option A may find importing files, but import-level\ndiscovery is indirect and can miss re-exports, namespace imports, dependency injection, or calls made\nthrough a locally renamed symbol. It also requires unnecessary manual inspection of every consumer of the\nmodule. Option D relies on documentation, which may be incomplete or stale and cannot prove that all\nexecutable references have been found.\n\nBefore removal, the agent should also inspect tests, dynamic registrations, configuration-driven references,\nand generated code where relevant. The defining requirement is to map the alias chain first and then search all\ndiscovered public names.\n\nOfficial references/topics: Read and Grep Tool Behavior; Symbol and Alias Discovery; Codebase Reference\nTracing."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 53,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline.\nThe system runs automated code reviews, generates test cases, and provides feedback on pull requests. You\nneed to design prompts that provide actionable feedback and minimize false positives.\n\nYour pipeline includes a release-notes generation step that classifies and summarizes approximately 200\ncommits at the end of each weekly release cycle. Each commit is currently sent as a separate Messages API\nrequest using a Sonnet-tier Claude model. The release notes are not needed until the following morning,\nproviding approximately 12 hours of acceptable latency.\n\nYour team must reduce the per-token API cost while retaining the same model, prompts, and output quality.\n\nWhich approach satisfies all these constraints?"
    },
    "options": [
      {
        "en": "Issue the 200 Messages API requests concurrently because parallel execution reduces the per-token\nprice."
      },
      {
        "en": "Submit the 200 requests through the Message Batches API with unique custom_id values and retrieve\nthe results after the batch finishes."
      },
      {
        "en": "Concatenate all 200 commit messages into one Messages API request because reducing the number of\nrequests always reduces token costs."
      },
      {
        "en": "Replace the Sonnet-tier model with a Haiku-tier model to obtain a lower per-token price."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B applies Anthropic’s dedicated asynchronous bulk-processing mechanism while preserving the\nexisting model and prompt for every commit. The Message Batches API accepts independent Messages API\nrequests, each identified by a unique custom_id, and charges both input and output usage at 50% of standard\nAPI prices. The approximately 12-hour latency allowance makes the release-notes workload well suited to\nbatching because immediate results are unnecessary.\n\nOption A may reduce wall-clock completion time, but concurrency does not alter the API’s per-token price.\nOption C changes the task structure and risks exceeding context or output limits, mixing commit-level\nclassifications, complicating retries, and making it harder to associate errors with individual commits. A\nsingle large request also does not automatically consume fewer tokens because the model must still process all\ncommit content. Option D violates the requirement to retain the same model tier and output-quality profile.\nBatch results may arrive in an order different from submission order, so the pipeline must associate every\nresponse with its original commit through custom_id. This provides lower cost without changing the\nindividual review prompts. Anthropic Message Batches documentation"
    },
    "sourceLanguage": "en"
  },
  {
    "id": 54,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "Your multi-agent research pipeline crashed after processing 12 of 28 documents. The web-search agent had\nidentified relevant sources, the document analyzer had partially completed extraction, and the synthesizer had\nbegun identifying patterns. You need to resume processing without repeating work or losing fidelity in the\nprior findings. What state-management approach best balances information fidelity with context efficiency\nwhen restoring agent state?"
    },
    "options": [
      {
        "en": "Have each agent persist a structured export to a known location. On resumption, the coordinator loads\nthe manifest and injects relevant state into agent prompts."
      },
      {
        "en": "Have each agent maintain its own persistent state file and reload it independently at the beginning of\neach session."
      },
      {
        "en": "Persist the coordinator’s conversation log containing all task delegations and responses, and provide\nthis log to the agents when resuming."
      },
      {
        "en": "Index all agent outputs in a shared vector store. When resuming, have each agent query the store using\nsemantic search to retrieve relevant prior findings."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A combines lossless persistence with selective restoration. Each agent should checkpoint structured\nrecords containing completed document identifiers, extracted findings, source provenance, unresolved work,\nverification status, and schema version. A coordinator-level manifest can record which stages completed and\nwhere their artifacts are stored. On recovery, the coordinator skips completed documents and injects only the\nstate required by each restarted agent.\n\nAnthropic’s effective context-engineering guidance recommends structured notes stored outside the active\ncontext window and reloaded when needed. This preserves critical dependencies and progress without\nreplaying an entire execution history.\n\nOption B fragments recovery ownership across agents and makes cross-agent consistency, versioning, and\ndependency validation difficult. Option C preserves extensive logs but wastes context on redundant tool calls,\nobsolete instructions, and intermediate messages. Option D is useful for relevance retrieval but semantic\nsearch can omit exact details and should not serve as the authoritative recovery record. Structured checkpoints\nand a validated manifest provide deterministic recovery, efficient context reconstruction, auditability, and\nprecise provenance. Writes should be atomic so partially produced exports are never mistaken for completed\nwork."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 55,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline.\nThe system runs automated code reviews, generates test cases, and provides feedback on pull requests. You\nneed to design prompts that provide actionable feedback and minimize false positives.\n\nYour automated review calls the Claude API for each pull request, using tool_use with a report_findings tool\nthat returns a JSON array of finding objects. Each object contains file_path, line_number, severity, category,\nand description. During testing on a large pull request touching more than 30 files, the response reaches the\nmax_tokens limit and is truncated in the middle of the JSON, causing your pipeline’s parser to fail.\n\nWhat is the most effective way to handle this?"
    },
    "options": [
      {
        "en": "Split the review into multiple API calls that each analyze a subset of the changed files, and then merge\nthe resulting findings arrays."
      },
      {
        "en": "Increase max_tokens to the model’s maximum and instruct Claude to keep each finding description\nunder 50 words."
      },
      {
        "en": "Switch from tool_use to prompting Claude to return findings as a Markdown list."
      },
      {
        "en": "Add retry logic that detects truncated JSON and resends the request with instructions to report only\ncritical and high-severity findings."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A is correct because the failure results from excessive output volume, not from JSON or tool use.\nAnthropic documents that max_tokens is a hard output ceiling and that a response stopped at this limit reports\nstop_reason: \" max_tokens \" . Its tool-streaming guidance also warns that generation can stop midway\nthrough a tool parameter, leaving partial JSON that must not be treated as complete. Splitting the pull request\ninto bounded file groups limits the number of findings produced by each call, preserves the report_findings\nschema, and allows the pipeline to validate every response independently before merging and deduplicating\nthe arrays. Shared dependency context can still be included when cross-file analysis is required.\n\nOption B only postpones the failure because the model’s output maximum remains finite. Option C abandons\nthe structured contract and makes deterministic parsing less reliable. Option D changes the review\nrequirements by suppressing potentially valuable lower-severity findings, while the retried request could still\nreach the same limit. Controlled partitioning followed by deterministic aggregation is therefore the most\nreliable and scalable design. Anthropic stop-reason guidance and tool-streaming guidance ."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 56,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates\nto specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one\ngenerates reports. The system researches topics and produces comprehensive, cited reports.\n\nAfter the web-search and document-analysis subagents complete their tasks, the coordinator needs to spawn\nthe synthesis subagent to synthesize the findings.\n\nWhat is the correct approach for providing the synthesis subagent with the information it needs?"
    },
    "options": [
      {
        "en": "Provide the subagent with tool definitions that allow it to request outputs from other subagents through\ncallbacks."
      },
      {
        "en": "Include the complete findings from both subagents directly in the synthesis subagent’s prompt."
      },
      {
        "en": "Spawn the subagent with only a brief task description, relying on automatic context inheritance from\nthe coordinator."
      },
      {
        "en": "Pass reference identifiers and configure the subagent with read access to a shared memory store where\nthe other subagents deposited their results."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B follows the Claude Agent SDK’s subagent context model. A normal subagent begins with a fresh\ncontext window and does not inherit the parent agent’s conversation history or prior tool results. Anthropic’s\nSubagents in the SDK documentation states that the information passed from parent to subagent is the\nspawning tool’s prompt string; required file paths, decisions, errors, or findings must therefore be included in\nthat prompt. In this scenario, the coordinator should supply both agents’ relevant findings, source metadata,\nand explicit synthesis instructions. “Complete findings” means the full required result artifacts, not every\nintermediate search trace. Option C incorrectly assumes automatic context inheritance. Option A introduces\ncallbacks that are neither necessary nor the standard handoff mechanism. Option D can be a valid custom\narchitecture when a shared store has deliberately been implemented, but the question does not establish such\ninfrastructure, and identifiers alone do not give the subagent information. The prompt should use clear\nsections or structured objects to distinguish web findings, document findings, sources, unresolved conflicts,\nand expected output. This preserves context isolation while providing everything the synthesis task actually\nrequires."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 57,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline.\nThe system runs automated code reviews, generates test cases, and provides feedback on pull requests. You\nneed to design prompts that provide actionable feedback and minimize false positives.\n\nYour pipeline runs:\n\nPROMPT= ' You are a code reviewer. Analyze the provided diff for bugs, security issues, and style violations.\n'\n\nclaude -p \\\n\n--dangerously-skip-permissions \\\n\n--system-prompt \" $PROMPT \" \\\n\n< diff.txt\n\nThe reviews complete and return feedback, but Claude only comments on the piped diff text—it never reads\nsurrounding files in the checked-out repository to understand broader context, even when the diff modifies a\nfunction called by many other modules.\n\nWhich change to the invocation will cause Claude to inspect related repository files while still applying your\ncustom review instructions?"
    },
    "options": [
      {
        "en": "Remove --system-prompt entirely and place the review instructions in a CLAUDE.md file, because --\nsystem-prompt is incompatible with tool use under -p."
      },
      {
        "en": "Keep --system-prompt and add --allowedTools \" Read,Glob,Grep \" , because non-interactive -p mode\notherwise disables filesystem tools."
      },
      {
        "en": "Stop piping the diff through standard input and embed it inside the prompt, so Claude Code treats the\ninvocation as an agentic session."
      },
      {
        "en": "Replace --system-prompt with --append-system-prompt and explicitly instruct Claude to inspect related\nrepository files whenever broader context is needed."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "Option D preserves Claude Code’s standard coding-agent instructions while adding the specialized review\ncriteria. Anthropic documents that --system-prompt replaces the entire default system prompt, including its\ntool guidance, safety instructions, and coding conventions. It does not technically disable tools, but removing\nthat guidance can make the invocation behave like a narrowly scoped text processor. --append-system-prompt\nretains the default behavior and layers the review instructions on top.\n\nThe prompt should explicitly direct Claude to use Read, Glob, and Grep to inspect definitions, callers, tests,\nand related modules whenever the diff alone is insufficient. Option A is incorrect because --system-prompt is\nnot incompatible with tools. Option B is also inaccurate: --allowedTools pre-approves tool execution; it does\nnot make tools available when -p would otherwise disable them. In this command, --dangerously-skip-\npermissions already bypasses permission prompts. Option C is false because Claude Code officially supports\npiped standard input in non-interactive mode. The repaired invocation should therefore use --append-system-\nprompt and include an explicit repository-exploration requirement. Claude Code programmatic usage , CLI\nsystem-prompt reference"
    },
    "sourceLanguage": "en"
  },
  {
    "id": 58,
    "domain": "mcp",
    "category": "Tool Design and MCP Integration",
    "prompt": {
      "en": "You are using Claude Code to accelerate software development. Your team uses it for code generation,\nrefactoring, debugging, and documentation. You need to integrate it into your development workflow with\ncustom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct\nexecution.\n\nYour team has connected a custom MCP server that provides DevOps workflow templates. The server\nexposes several MCP prompts (such as deploy_checklist and incident_response ) in addition to tools.\n\nHow do these MCP prompts become accessible within Claude Code?"
    },
    "options": [
      {
        "en": "They are automatically prepended to every conversation as additional system-level context, influencing\nClaude’s behavior throughout the session."
      },
      {
        "en": "They are added to Claude Code’s tool registry alongside the server’s tools, invoked automatically by\nthe model when relevant to the task."
      },
      {
        "en": "They are surfaced as @ -mentionable resources alongside files, fetched and attached to your message\nwhen referenced."
      },
      {
        "en": "They appear as slash commands (e.g., /mcp__servername__deploy_checklist ) that you can invoke,\nwith arguments passed after the command name."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "MCP prompts are exposed as user-invoked commands rather than autonomous tools or permanently loaded\nsystem instructions. Claude Code dynamically discovers prompts from connected MCP servers and displays\nthem in the command list using the naming convention /mcp__servername__promptname .\n\nArguments are supplied as space-separated values after the command. When executed, the MCP server\nresolves the prompt and its returned content is injected into the active conversation. Anthropic’s official\ndocumentation provides examples such as /mcp__github__list_prs and /mcp__jira__create_issue \" Bug in\nlogin flow \" high . ( https://code.claude.com/docs/en/mcp )\n\nOption A would consume context continuously and incorrectly treat optional workflow templates as\nmandatory system instructions. Option B confuses MCP prompts with MCP tools: tools are model-callable\noperations, while prompts are reusable prompt templates invoked as commands. Option C describes MCP\nresources, which can be referenced and attached but are a distinct MCP capability.\n\nFor the stated server, the team could invoke commands such as /mcp__devops__deploy_checklist or\n/mcp__devops__incident_response service-name . The exact server segment is derived from the configured\nserver name, with normalization applied where necessary.\n\nOfficial references/topics: MCP Prompts; Dynamic Prompt Discovery; MCP Slash-Command Naming;\nPrompt Arguments."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 59,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "The synthesis agent receives summarized findings from the web-search and document-analysis agents, then\npasses a consolidated summary to the report generator. During testing, you discover that the generated reports\nmake factual claims without proper citations—the report generator cannot attribute statements to their original\nsources because that metadata was lost during the summarization steps. What is the most effective approach\nto ensure proper source attribution in the final reports?"
    },
    "options": [
      {
        "en": "Have the report generator query the web-search agent to relocate sources for claims in the final report."
      },
      {
        "en": "Have each agent output structured data that separates content summaries from source metadata,\nincluding URLs, document names, and page numbers."
      },
      {
        "en": "Skip summarization and pass the complete raw outputs from the web-search and document-analysis\nagents directly to the report generator."
      },
      {
        "en": "Instruct the synthesis agent to embed source references inline within its summary text using a consistent\ncitation format."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B preserves provenance as structured data throughout every handoff. Each finding should include the\nsummarized claim and an associated source record containing its URL or document identifier, page or section\nlocation, relevant excerpt, and possibly retrieval date and confidence. The synthesis agent can combine claims\nwithout destroying this relationship, and the report generator can produce citations deterministically.\n\nAnthropic’s multi-agent research system retains findings until a dedicated citation stage identifies the precise\nsource locations supporting report claims. This demonstrates that citation provenance must remain available\nbeyond initial retrieval and summarization.\n\nOption A attempts to reconstruct provenance after it has been discarded, which is expensive and may\nassociate a claim with a different or weaker source. Option C preserves evidence but wastes context by\ntransferring approximately all raw search and document content. Option D is better than losing references\nentirely, but embedding citations only in prose makes programmatic validation, deduplication, and claim-to-\nsource mapping less reliable. Structured content and source fields maintain both context efficiency and\nauditable attribution while allowing different agents to transform the narrative safely."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 60,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JSON schemas, and maintains high accuracy. It must\nhandle edge cases gracefully and integrate with downstream systems.\n\nYour extraction pipeline occasionally receives responses that cannot be parsed as valid JSON, causing\ndownstream processing failures. The current implementation prompts Claude to return JSON in the response\ntext and then parses it.\n\nWhat is the most reliable approach to ensure Claude returns valid, schema-compliant structured data?"
    },
    "options": [
      {
        "en": "Add explicit formatting instructions to the prompt with JSON examples, emphasizing that Claude must\nreturn only valid JSON with no surrounding text."
      },
      {
        "en": "Use regular expressions to locate and extract JSON from the response text, handling cases where\nClaude includes explanatory text around the JSON block."
      },
      {
        "en": "Define a tool with a JSON schema specifying the expected structure, using tool use to constrain Claude’\ns output to schema-compliant JSON."
      },
      {
        "en": "Implement a retry loop that catches JSON parsing errors and re-prompts Claude with the error details,\nasking it to correct the malformed output."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C is the strongest choice among the listed approaches because it moves structured data generation\nfrom unconstrained response text into a schema-governed interface. Prompt-only JSON instructions, regular-\nexpression extraction, and corrective retries are probabilistic recovery mechanisms: they may reduce failures,\nbut none guarantees that the first response satisfies the contract. Anthropic now provides two schema-\nconstrained mechanisms: JSON Structured Outputs through output_config.format and strict tool use through a\ntool definition with strict: true. Strict tool use uses grammar-constrained sampling so the tool input conforms\nto the declared JSON Schema, including required properties and data types. Therefore, the production\nimplementation represented by option C should define the extraction tool’s input_schema and enable strict\nmode. The application reads the tool_use block as the extracted record; it does not need to scrape prose or\nsearch for braces. Option A remains vulnerable to preambles or malformed output. Option B can select a\nJSON-looking substring but cannot establish schema validity. Option D adds latency and cost and can still fail\nrepeatedly. The schema-constrained tool contract is consequently the most reliable architecture available in\nthese options."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 61,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "Your CI pipeline performs security-focused code reviews on approximately 50 pull requests daily, currently\ncosting $150 per day through the synchronous API. Reviews are non-blocking—developers merge after tests\npass and address findings in follow-up commits. You are evaluating the Message Batches API because it\noffers a 50% cost reduction. What factor most determines whether batch processing is appropriate for this use\ncase?"
    },
    "options": [
      {
        "en": "Whether your result-processing system can handle reviews arriving in a different order from the order\nin which they were submitted."
      },
      {
        "en": "Whether each review can be structured as a single request without multi-turn refinement."
      },
      {
        "en": "Whether review feedback arriving up to 24 hours after pull-request creation remains actionable."
      },
      {
        "en": "Whether reducing per-review latency from 30–60 seconds to near-instantaneous delivery matters to\nyour workflow."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "The decisive trade-off is whether the workflow can tolerate asynchronous completion. Anthropic’s Message\nBatches API documentation states that batch requests receive a 50% discount and that most batches finish\nwithin one hour, but processing can continue for as long as 24 hours. Therefore, the review process is suitable\nfor batching only if potentially delayed feedback remains useful.\n\nOption C directly tests that operational requirement. The reviews are already non-blocking, which makes\nbatching promising, but non-blocking does not automatically mean that feedback delivered many hours later\nstill has value. If developers have already merged and moved to unrelated work, delayed security findings\nmay increase remediation cost or remain unaddressed.\n\nOption A is manageable through each request’s unique custom_id, which allows results to be correlated\nregardless of return order. Option B is incorrect because batch requests can contain supported multi-turn\nconversation histories and tool-use configurations; each request is processed independently, but it need not\nrepresent a single conversational turn. Option D reverses the relevant consideration: batch processing is not\nintended to provide near-instantaneous responses. The real question is whether the cost saving justifies its\nlonger and nondeterministic completion time."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 62,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JSON schemas, and maintains high accuracy. It must\nhandle edge cases gracefully and integrate with downstream systems.\n\nYour extraction system uses tool use with a JSON schema containing 12 fields and detailed descriptions,\ntotaling approximately 2,500 tokens for the complete tool definition. Processing documents under 150,000\ntokens yields 98% accuracy. For documents between 175,000 and 190,000 tokens, accuracy drops to 71%,\nwith information from the final third consistently missed. The model’s context window is 200,000 tokens.\n\nWhat is the most likely cause?"
    },
    "options": [
      {
        "en": "Schemas exceeding eight to ten fields increase decision complexity during parameter generation,\nreducing extraction accuracy independently of document length."
      },
      {
        "en": "The model distributes attention proportionally across the input length, causing fields mentioned only\nonce near the document’s end to receive insufficient processing focus."
      },
      {
        "en": "Very long documents exceed the model’s effective attention span regardless of context limits, causing\naccuracy degradation for content farther from the prompt instructions."
      },
      {
        "en": "Tool definitions consume input-context tokens. Combined with system prompts and document content,\nthe total approaches the context limit, degrading end-of-document processing."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "Option D identifies the dominant capacity problem. Anthropic states that everything sent in a request counts\ntoward the context window : the system prompt, messages, documents, tool results, tool definitions, and the\noutput Claude generates. A 175,000–190,000-token document is therefore not the complete input. Adding a\n2,500-token tool schema, system instructions, wrappers, and the reserved output budget can push a nominally\nsub-200,000-token document close to or beyond the effective limit. Anthropic also warns that more context is\nnot automatically better and that accuracy and recall can degrade as token count grows, a behavior described\nas context rot. That combination explains why short documents remain accurate while long documents lose\ninformation. Option A predicts a problem independent of document length, contradicting the measurements.\nOption B is an unsupported generalization and does not account for tool-definition overhead. Option C\nrecognizes long-context degradation but ignores the concrete evidence that hidden prompt components\n\nconsume the same window. The correct response is to count tokens for the complete request before\nsubmission, reserve output capacity, and chunk or retrieve relevant sections when the total approaches the\nmodel’s supported window."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 63,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and\nmaintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.\n\nYour extraction pipeline validates outputs against JSON schemas, but you need to implement human review\ngiven limited reviewer capacity (they can handle approximately 5% of total extraction volume).\n\nWhat’s the most effective basis for selecting which extractions to route for human review?"
    },
    "options": [
      {
        "en": "Route extractions where the model indicates low confidence or where source documents contain\nambiguous or contradictory information."
      },
      {
        "en": "Route extractions containing specific high-priority entity types (e.g., financial figures, dates) for human\nreview, regardless of extraction confidence."
      },
      {
        "en": "Route extractions for review only when downstream systems report data quality issues or processing\nfailures."
      },
      {
        "en": "Randomly sample 5% of extractions for review."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Limited review capacity should be concentrated on records with the highest probability of semantic error.\nSchema validation confirms that the response has the correct structure and data types; it does not establish that\nthe extracted values are accurate. Ambiguous wording, contradictory passages, missing evidence, and model-\nreported uncertainty are direct indicators that an extraction requires human judgment.\n\nAnthropic’s reliability guidance recommends permitting Claude to express uncertainty, grounding factual\noutputs in source material, and validating critical information because hallucination-reduction methods do not\neliminate errors completely. These principles support routing uncertain or evidentially conflicted records to\nreviewers rather than treating syntactically valid output as automatically trustworthy. ( https://docs.anthropic.\ncom/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations )\n\nOption B may waste reviewer capacity on clear, well-supported values while overlooking ambiguous errors in\nother fields. Option C is reactive: downstream acceptance does not guarantee semantic correctness, and silent\nerrors may never produce processing failures. Option D provides an unbiased estimate of overall quality and\nshould be retained as a secondary audit mechanism, but random selection is not the most efficient way to\nintercept risky records when only 5% can be reviewed.\n\nIn production, model confidence should not be treated as a calibrated probability by itself. It should be\ncombined with objective signals such as contradictory source spans, missing citations, OCR quality,\nvalidation warnings, document type, and business impact.\n\nOfficial references/topics: Human-in-the-Loop Review, Uncertainty Handling, Source Grounding, Risk-\nBased Escalation."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 64,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "After deploying automated code review, developers report that approximately 35% of flagged findings are\nfalse positives falling into consistent patterns: style suggestions contradicting team conventions, security\nwarnings for patterns that are safe in your deployment context, and performance suggestions that would\ndegrade your specific use case. You want to reduce false positives while maintaining the ability to catch\ngenuine issues. Which approach best enables the model to generalize its judgment to novel code patterns it\nhas not seen before?"
    },
    "options": [
      {
        "en": "Implement post-processing that uses keyword matching to filter out findings containing terms such as\n“convention,” “context-dependent,” or “trade-off.”"
      },
      {
        "en": "Include few-shot examples in your prompt showing annotated code snippets that distinguish acceptable\npatterns from genuine issues in each category."
      },
      {
        "en": "Create a comprehensive written specification of all patterns that should not be flagged, and then include\nthe full documentation in the system prompt."
      },
      {
        "en": "Add instructions to your system prompt to “be conservative,” “only flag definite issues,” and “consider\nthat some patterns may be intentional.”"
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B teaches Claude the actual decision boundaries behind the team’s judgments. Contrasting examples\ncan demonstrate why one apparent security pattern is acceptable within the organization’s deployment\ncontrols while a superficially similar implementation is genuinely unsafe. The same technique can distinguish\nestablished style conventions from deviations and intentional performance trade-offs from accidental\ninefficiencies.\n\nAnthropic identifies relevant, diverse, and clearly structured examples as one of the most reliable ways to\nimprove Claude’s accuracy and consistency. Its official prompting guidance recommends examples that\nclosely mirror the production task while covering important variations and edge cases. This encourages\ngeneralization based on demonstrated criteria instead of memorization of prohibited wording.\n\nOption A can suppress legitimate findings merely because they contain a selected keyword. Option C will\nbecome lengthy, difficult to maintain, and incapable of enumerating every future code variation. Option D is\ntoo vague and may reduce recall by discouraging Claude from reporting uncertain but genuine defects. Few-\nshot contrasts provide precise, maintainable behavioral guidance without imposing a blanket suppression\npolicy."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 65,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline.\nThe system runs automated code reviews, generates test cases, and provides feedback on pull requests. You\nneed to design prompts that provide actionable feedback and minimize false positives.\n\nYour test generation produces unit tests for new code, but reviews show that 55% are low-value: trivial\nassertions that only verify functions do not throw exceptions, tests duplicating existing coverage, or tests\nignoring your team’s fixture conventions.\n\nHow do you reduce the rate of low-value tests being generated in the first place?"
    },
    "options": [
      {
        "en": "Implement two-phase generation in which a second Claude call scores each test against quality criteria,\nfiltering out low-scoring tests before presenting results to developers."
      },
      {
        "en": "Add post-generation coverage analysis that automatically filters out any generated test that does not\nincrease line coverage beyond existing tests."
      },
      {
        "en": "Restrict test generation to directories where historical quality metrics show higher acceptance rates,\ndisabling it for areas where generated tests consistently require substantial editing."
      },
      {
        "en": "Document testing standards in CLAUDE.md, including valuable-test criteria, available fixtures and\ntheir intended use cases, and examples distinguishing meaningful behavioral tests from trivial assertions."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "Option D improves the generation conditions instead of filtering defective output afterward. Anthropic\nrecommends using CLAUDE.md for repository-wide standards and information that Claude should apply in\nevery session. The file can define what constitutes a useful test, require assertions on observable behavior,\nidentify approved fixture factories, prohibit duplication of existing scenarios, and provide contrasting\nexamples of strong and trivial tests. These instructions are available before Claude decides what tests to create.\n\nOption A may remove some weak tests, but it doubles model work and still permits the first stage to generate\nlow-quality material. Option B treats line coverage as a quality measure even though a trivial assertion can\nexecute new lines without validating behavior. Option C abandons difficult areas rather than improving\ngeneration. The standards should also direct Claude to inspect nearby tests and fixtures before writing new\ncases, identify the behavior or regression each test protects, and run the relevant suite afterward. Because\nCLAUDE.md consumes context in every session, the guidance should remain concise; lengthy testing\nprocedures are better placed in a reusable skill referenced from the project instructions."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 66,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and\nmaintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.\n\nYour system has been running for 3 weeks and human reviewers have corrected 847 extractions. Analysis\nreveals a recurring pattern: when recipes use informal measurements like “a handful” or “a splash,” the model\neither invents specific amounts or leaves fields empty—accounting for 23% of all corrections.\n\nHow should you use this feedback to improve extraction accuracy?"
    },
    "options": [
      {
        "en": "Fine-tune the model on the 847 corrected extractions."
      },
      {
        "en": "Add few-shot examples to your prompt demonstrating correct handling of informal measurements—\nextracting them verbatim rather than converting or omitting them."
      },
      {
        "en": "Implement a post-processing layer that uses pattern matching to detect informal measurement phrases\nin source text and automatically populate values when the extraction is empty."
      },
      {
        "en": "Update your JSON schema to add a “measurement_type” enum field (precise/informal)."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "The reviewer corrections have exposed a narrow and repeatable interpretation failure. The desired policy is\nclear: informal measurements are valid source values and must be preserved verbatim rather than normalized\ninto invented quantities or treated as missing. This behavior can be communicated efficiently through targeted\nfew-shot examples.\n\nAnthropic recommends examples for demonstrating expected behavior and improving consistency. Examples\ncan pair source phrases such as “a handful of spinach,” “a splash of vinegar,” and “a pinch of salt” with\noutputs that retain handful , splash , and pinch exactly. Additional counterexamples can show that Claude\nmust not convert these phrases into grams, millilitres, or estimated serving quantities. ( https://docs.anthropic.\ncom/en/docs/about-claude/use-case-guides/ticket-routing )\n\nOption A introduces a substantially heavier training workflow for a problem that can be addressed directly\nthrough the prompt. Option C creates a parallel extraction mechanism based on pattern matching; it will be\nbrittle across linguistic variations and may populate a value without understanding its relationship to the\ncorrect ingredient. Option D adds useful classification metadata, but it does not instruct Claude to preserve the\noriginal measurement instead of inventing or omitting it.\n\nThe revised prompt should combine an explicit verbatim-extraction rule with several varied examples derived\nfrom the corrected cases, followed by regression evaluation against the identified failure set.\n\nOfficial references/topics: Few-Shot Examples, Feedback-Driven Prompt Improvement, Verbatim\nExtraction, Regression Evaluation."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 67,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "After the web-search and document-analysis subagents complete their tasks, the coordinator needs to spawn\nthe synthesis subagent to synthesize the findings. What is the correct approach for providing the synthesis\nsubagent with the information it needs?"
    },
    "options": [
      {
        "en": "Pass reference identifiers and configure the subagent with read access to a shared memory store where\nthe other subagents deposited their results."
      },
      {
        "en": "Include the complete findings from both subagents directly in the synthesis subagent’s prompt."
      },
      {
        "en": "Provide the subagent with tool definitions that allow it to request outputs from the other subagents\nthrough callbacks."
      },
      {
        "en": "Spawn the subagent with only a brief task description, relying on automatic context inheritance from\nthe coordinator."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B follows the Claude Agent SDK’s default context-isolation model. A newly spawned subagent\nreceives a fresh context window and does not automatically inherit the parent’s conversation history or\nprevious tool results. The coordinator must therefore include the information required for synthesis directly in\nthe spawning prompt, preferably using clearly separated structured sections for web findings, document\nfindings, source metadata, conflicts, and unresolved questions.\n\nAnthropic’s official SDK subagent documentation states that the Agent tool’s prompt string is the content\npassed from the parent to the new subagent. It specifically advises including required file paths, errors, and\ndecisions in that prompt because parent context is not inherited.\n\nOption A could work only if the application had deliberately implemented and authorized such a shared-\nmemory architecture. The question establishes no such mechanism, and reference identifiers alone provide no\nevidence to the subagent. Option C introduces a callback protocol that is unnecessary for a normal handoff.\nOption D is incorrect because subagent isolation expressly prevents automatic inheritance. “Complete\nfindings” means the complete evidence needed for synthesis, not every intermediate search trace or irrelevant\ntool result."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 68,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "Production reviews reveal inconsistent handling of uncertainty in final reports. Sometimes conflicting\nsubagent findings are synthesized into a single confident statement, losing important nuance, while other\nreports over-hedge with excessive qualifications and become unhelpful. The web-search agent returns,\n“Industry analysts estimate a $50 billion market size, although methodologies vary.” The document-analysis\nagent returns, “A peer-reviewed study estimates $35 billion, with a ±$7 billion 95% confidence interval.” The\ncoordinator either selects one estimate arbitrarily or produces a vague $35–$50 billion range. What systematic\napproach best addresses this?"
    },
    "options": [
      {
        "en": "Instruct the synthesis agent to structure reports with explicit sections distinguishing well-established\nfindings from contested findings while preserving each source’s characterization and methodological\ncontext."
      },
      {
        "en": "Add a verification subagent that passes only claims corroborated by at least two independent sources to\nsynthesis."
      },
      {
        "en": "Normalize every subagent’s uncertainty statements to probability scores between 0.0 and 1.0, then\ncalculate a confidence-weighted average."
      },
      {
        "en": "Configure subagents to report only findings that meet a high-confidence threshold."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A preserves disagreement as meaningful evidence. The report should identify the two estimates\nseparately, explain that they arise from different methodologies and source types, retain the peer-reviewed\nstudy’s stated confidence interval, and classify the market size as contested rather than manufacturing false\nagreement. It may then explain what additional evidence would resolve the discrepancy.\n\nAnthropic’s research prompting guidance recommends developing competing hypotheses, tracking\nconfidence, verifying across sources, and retaining structured research notes. This supports calibrated\nsynthesis rather than arbitrary selection or vague hedging.\n\nOption B discards potentially important minority evidence and incorrectly treats corroboration count as\nequivalent to reliability. Option C creates numerical precision unsupported by the original sources; confidence\nscores from different agents are not automatically comparable, and averaging incompatible estimates can be\nmeaningless. Option D introduces survivorship bias by suppressing uncertainty before synthesis. A systematic\nreporting structure distinguishes consensus, disagreement, evidence quality, methodological limitations, and\nunresolved questions. That produces an actionable briefing without overstating certainty or weakening every\nconclusion with generic qualifications."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 69,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JSON schemas, and maintains high accuracy. It must\nhandle edge cases gracefully and integrate with downstream systems.\n\nYour extraction system parses e-commerce product descriptions to extract specifications such as dimensions,\nweight, and materials into JSON. Despite having a well-defined schema, the model inconsistently extracts the\nmaterials field—sometimes returning “cotton blend,” other times “Cotton/Polyester mix,” and occasionally\nomitting the field when material information is clearly present in the source.\n\nWhat is the most effective way to improve extraction consistency?"
    },
    "options": [
      {
        "en": "Set the temperature to 0 to eliminate randomness and ensure deterministic outputs."
      },
      {
        "en": "Switch to a more capable model tier because inconsistent extraction indicates insufficient model\ncapability."
      },
      {
        "en": "Make the materials field required instead of optional in the schema to force the model to always extract\na value."
      },
      {
        "en": "Add few-shot examples showing two or three complete input-output pairs with standardized material-\ndescription formats."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "Option D addresses the observed inconsistency at the model-behavior level. A schema can require that\nmaterials be a string, but it cannot teach Claude which lexical form the application considers canonical or\ndemonstrate when a source phrase should populate the field. Anthropic identifies examples as one of the most\nreliable ways to steer output format, structure, and consistency, recommending several relevant and diverse\nexamples that mirror the real task in its prompting best practices . Complete input-output pairs show both\nrecognition and normalization: for example, a description containing “60% cotton, 40% polyester” can\nconsistently map to the chosen “cotton/polyester blend” representation. They can also include difficult cases\nwhere material information is embedded indirectly in prose. Temperature zero reduces sampling variability\nbut does not repair an underspecified transformation rule. A more capable model likewise lacks the missing\nformatting convention. Making the field required is dangerous because documents may legitimately omit\nmaterials; it can force unsupported values and increase hallucinations. Few-shot examples therefore supply\nthe missing decision boundary while preserving truthful absence handling. The examples should be evaluated\non held-out descriptions and supplemented by deterministic post-processing if downstream systems require an\nexact controlled vocabulary."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 70,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "After investigating a billing dispute for more than 25 turns, you determine that duplicate charges resulted\nfrom a payment-gateway timeout triggering retry logic. The required refund of $847 exceeds your $500\nauthorization limit, so you must invoke escalate_to_human. The human agent will not have access to the\nconversation transcript. What context should you pass to enable effective resolution?"
    },
    "options": [
      {
        "en": "The complete conversation transcript containing every message and tool result."
      },
      {
        "en": "The customer’s original complaint verbatim together with excerpts from the tool results showing the\nduplicate transactions."
      },
      {
        "en": "A structured summary containing the customer identifier, verified root cause, refund amount, relevant\ntransaction identifiers, actions already attempted, and recommended next action."
      },
      {
        "en": "Only the diagnosis and refund amount."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C gives the human agent the operational state required to continue without replaying a long\nconversation. The handoff should include verified identifiers, the duplicate transaction evidence, the\ndiagnosed timeout-and-retry mechanism, the $847 refund requirement, the agent’s $500 authorization\nconstraint, completed verification steps, prior actions, and the recommended resolution. Any unresolved\nuncertainty should be labeled explicitly.\n\nAnthropic’s effective context-engineering guidance recommends preserving high-value state in structured\nnotes while removing redundant conversational and tool-call history. Its long-running-agent guidance likewise\n\ndescribes structured handoffs as the mechanism for maintaining continuity across context resets or agent\nboundaries.\n\nOption A maximizes raw information but forces the human to locate the relevant facts among more than 25\nturns, increasing delay and error risk. Option B preserves evidence but omits the authorization constraint,\ncompleted verification, and explicit recommended action. Option D is too sparse to support validation or\nexecution. A structured handoff balances fidelity and efficiency: it contains everything needed for the next\nactor to make the refund decision while excluding greetings, repeated explanations, and irrelevant\nintermediate tool output."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 71,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "Your code-review prompts include both implementation changes and the corresponding test file, but the\nreview comments fail to identify untested code paths. The model correctly flags functions that have no tests at\nall, but it fails to recognize when conditional branches or error-handling paths within tested functions lack\ncoverage. What is the most effective way to improve branch-level gap detection without overcomplicating the\npipeline?"
    },
    "options": [
      {
        "en": "Interleave the implementation and tests in the prompt, presenting each function immediately before its\ntest cases."
      },
      {
        "en": "Add explicit instructions requiring Claude to enumerate every conditional branch and exception path,\nthen verify that each path has a corresponding test assertion."
      },
      {
        "en": "Implement a two-pass pipeline in which one model call extracts all conditional branches and another\ncross-references them against test assertions."
      },
      {
        "en": "Include few-shot examples showing code with an uncovered branch and the corresponding review\ncomment identifying the missing test case."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "The current prompt asks for testing analysis at too high a level. Claude recognizes the obvious absence of an\nentire test but has not been instructed to construct a path-level inventory. Option B turns the desired behavior\ninto an explicit verification procedure: enumerate each condition, alternative branch, early return, exception\nhandler, and failure path, then locate a test assertion that exercises its behavior.\n\nAnthropic’s prompting best practices emphasize clear, specific instructions and explicit sequential steps when\na task requires a defined analysis process. This change keeps the existing single review call while making the\nmissing evaluation criterion unambiguous.\n\nOption A improves proximity between implementation and tests but does not tell Claude what coverage\nrelationship to inspect. Option C could work, but it adds orchestration, latency, cost, and another handoff\nbefore testing whether a direct instruction solves the observed failure. Option D may improve recognition of\nexamples resembling the demonstration, but a few cases cannot enumerate every branch structure. Explicit\npath enumeration generalizes across unfamiliar code and creates auditable output: each reported gap can name\nthe uncovered condition, expected behavior, and missing assertion."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 72,
    "domain": "mcp",
    "category": "Tool Design and MCP Integration",
    "prompt": {
      "en": "You are building developer-productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools—Read, Write, Bash, Grep, and Glob—and integrates with Model Context\nProtocol (MCP) servers.\n\nYour productivity agent connects to three MCP servers: an issue tracker with search_issues , get_issue , and\ncreate_comment ; a documentation wiki with search_docs , get_page , and list_spaces ; and a database\nexplorer with run_query , get_schema , and list_databases . For cross-system questions such as, “Which\ndatabase tables are affected by the authentication refactor in PROJ-1234?”, the agent makes eight to ten\nsequential exploratory calls, lacks visibility into each server’s available content, and exhausts context before\ncompleting complex investigations.\n\nWhat architectural change best leverages MCP capabilities to address these problems?"
    },
    "options": [
      {
        "en": "Add a prepare_investigation tool to each server that accepts a natural-language question and returns\nrelevant summaries."
      },
      {
        "en": "Consolidate all three systems into one unified MCP server with cross-referencing capabilities."
      },
      {
        "en": "Expose each server’s content catalog as MCP resources, including issue summaries, documentation\n\nhierarchies, and database schemas."
      },
      {
        "en": "Add an orchestrator that routes each question to one server based on keywords."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C uses MCP resources for their intended purpose: exposing contextual data that applications and\nagents can discover and read without treating every lookup as an action-oriented tool invocation. Anthropic’s\nClaude Code MCP documentation states that Claude Code automatically provides mechanisms to list and read\nresources exposed by connected MCP servers. Resources may contain text, JSON, structured data, or other\nserver-provided content. The official MCP server concepts likewise explain that resources expose information\nfrom files, APIs, and databases through identifiable, discoverable URIs. Publishing issue summaries, the wiki\nhierarchy, and database schemas gives the agent an initial map of available evidence. It can identify relevant\nsystems and retrieve only the necessary records before making targeted tool calls. Option A creates another\nopaque, high-level tool whose output quality depends on each server interpreting the investigation correctly.\nOption B produces tight coupling and increases operational complexity. Option D prevents the cross-system\ninvestigation required by the question. Resource catalogs improve discoverability, reduce blind exploration,\nand preserve tools for searches, queries, and mutations that genuinely require execution."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 73,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "You are building a structured data-extraction system using Claude. The system extracts information from\nunstructured documents, validates output against JSON schemas, and integrates the results with downstream\nsystems.\n\nMonitoring reveals that specifications sometimes appear inconsistently within source documents. For\nexample, a summary section might state “Battery: 4000 mAh,” while the detailed specifications table states\n“Battery: 4200 mAh.” Your current schema contains a single battery_capacity field.\n\nThis inconsistency occurs in approximately 15% of documents, and historical analysis confirms that the\ndetailed specifications table is accurate 90% of the time.\n\nWhat is the most effective approach?"
    },
    "options": [
      {
        "en": "Change the field to an array that captures every discovered value and its source location, leaving\ndownstream systems to apply precedence rules."
      },
      {
        "en": "Reject every extraction containing conflicting values and require the source document to be corrected\nbefore processing continues."
      },
      {
        "en": "Add extraction instructions specifying that values from the detailed specifications table take precedence\nwhen conflicting values exist, while retaining the single-value schema."
      },
      {
        "en": "Add a conflict_detected Boolean field and route every affected document for manual review."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C converts an empirically validated source hierarchy into an explicit extraction rule. The downstream\ncontract requires one battery_capacity value, and historical analysis establishes that the detailed specifications\ntable is substantially more reliable than the summary section. Claude should therefore be instructed to inspect\nall occurrences, detect conflicts, and select the detailed-table value when the two locations disagree.\n\nAnthropic’s prompting guidance emphasizes clear, direct instructions, relevant context, and explicit decision\nrules when order or completeness matters. Providing the reason for the precedence rule also helps the model\ngeneralize it to comparable specification conflicts. Option A preserves every value but transfers a known and\nrepeatable decision into downstream systems, unnecessarily changing the schema. Option B rejects\napproximately 15% of otherwise processable documents even though a reliable precedence policy is available.\nOption D creates a costly manual-review queue for conflicts that can usually be resolved deterministically.\nThe extraction system should still retain source quotations or locations in internal provenance metadata when\nauditability matters, but the output field should follow the established detailed-table precedence. Anthropic\nprompting best practices"
    },
    "sourceLanguage": "en"
  },
  {
    "id": 74,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline.\nThe system runs automated code reviews, generates test cases, and provides feedback on pull requests. You\nneed to design prompts that provide actionable feedback and minimize false positives.\n\nAfter deploying automated code review, developers report that approximately 35% of findings are false\npositives following consistent patterns: style suggestions that contradict team conventions, security warnings\nfor patterns that are safe in the deployment environment, and performance suggestions that would degrade this\nparticular use case.\n\nYou want to reduce false positives while enabling the model to generalize its judgment to novel code patterns\nit has not seen before.\n\nWhich approach is most effective?"
    },
    "options": [
      {
        "en": "Create a comprehensive specification of every pattern that must not be flagged and include the\ncomplete document in the system prompt."
      },
      {
        "en": "Include few-shot examples containing annotated code snippets that distinguish acceptable project\npatterns from genuine issues in each category."
      },
      {
        "en": "Use keyword-based post-processing to remove findings containing terms such as “convention,”\n“context-dependent,” or “trade-off.”"
      },
      {
        "en": "Add general instructions telling Claude to be conservative and report only definite issues."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B demonstrates the decision boundary Claude must learn. Carefully selected examples can show\nstructurally similar code producing different outcomes based on project context—for example, an approved\nauthentication wrapper versus an unsafe direct call, or a deliberate performance trade-off versus an accidental\nquadratic operation. These contrasts help Claude apply the underlying judgment to new code rather than\nmerely memorizing prohibited phrases.\n\nAnthropic identifies relevant, diverse, and clearly structured examples as one of the most reliable methods for\nimproving output accuracy and consistency. It recommends several examples that mirror the real use case and\ncover important edge conditions. Option A risks creating an oversized negative catalogue that consumes\ncontext, becomes difficult to maintain, and cannot anticipate every future variation. Option C filters text after\ngeneration and may suppress genuine findings that happen to use the selected keywords. Option D is\ndangerously vague: telling a reviewer to be conservative can suppress real but uncertain defects and reduce\nrecall. The prompt should provide paired acceptable/problematic examples, explain why each classification\ndiffers, and require concrete code evidence for every reported finding. Anthropic prompting best practices"
    },
    "sourceLanguage": "en"
  },
  {
    "id": 75,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are using Claude Code to accelerate software development. Your team uses it for code generation,\nrefactoring, debugging, and documentation. You need to integrate it into your development workflow with\ncustom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct\nexecution.\n\nYou’ve asked Claude to write a data migration script, but the initial output doesn’t correctly handle records\nwith null values in required fields.\n\nWhat’s the most effective way to iterate toward a working solution?"
    },
    "options": [
      {
        "en": "Add “think harder about edge cases” to your prompt and request a complete rewrite of the migration\nlogic."
      },
      {
        "en": "Manually edit the generated code to fix the null handling, then continue working with Claude on other\nparts."
      },
      {
        "en": "Describe the null value problem in detail and ask Claude to regenerate the entire script with improved\nedge case handling."
      },
      {
        "en": "Provide a test case with example input containing null values and the expected output, then ask Claude\nto fix it."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "A concrete test case converts an imprecise correction into an executable success criterion. The input\ndemonstrates the failing null-value condition, while the expected output defines exactly how the migration\nmust handle it. Claude can modify the implementation, run the test, inspect the result, and continue iterating\nuntil the behavior passes.\n\nAnthropic recommends giving Claude a verification mechanism such as a test suite, build result, linter, fixture\ncomparison, or screenshot. Without such a mechanism, Claude can only judge that its output appears correct.\nA pass-or-fail test closes the feedback loop by allowing Claude to perform the work, evaluate the result, and\nrefine it using objective evidence. ( https://code.claude.com/docs/en/best-practices )\n\nOption A provides no additional specification and may generate a different but still incorrect implementation.\nOption B fixes the immediate defect manually but fails to use Claude’s iterative capabilities or establish a\nregression check. Option C supplies more description, but regenerating the entire script increases the risk of\naltering already-correct behavior and still lacks objective validation.\n\nThe best workflow is to add the failing case to the migration test suite, request the smallest necessary\ncorrection, run the relevant tests, and retain that test permanently to prevent the null-handling defect from\nrecurring.\n\nOfficial references/topics: Executable verification, test-driven iteration, regression protection, tight feedback\nloops."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 76,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are using Claude Code to accelerate software development. Your team uses it for code generation,\nrefactoring, debugging, and documentation. You need to integrate it into your development workflow with\ncustom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct\nexecution.\n\nA security audit requires updating your authentication library from v2 to v3. The migration guide documents\nbreaking changes: authenticate() now returns a Promise instead of accepting a callback, the User type has\n\nrestructured fields, and three deprecated methods were removed. Grep shows the library is imported in 45\nfiles across several modules.\n\nWhat’s the most effective approach?"
    },
    "options": [
      {
        "en": "Create a custom slash command encapsulating the migration transformations, then execute it against\neach file without prior codebase exploration."
      },
      {
        "en": "Update the dependency version, run the test suite, and use Claude Code to fix each failure as it appears."
      },
      {
        "en": "Enter plan mode to explore library usage across modules, map affected code paths, then create a\nmigration strategy before implementing."
      },
      {
        "en": "Paste the migration guide’s breaking changes into your prompt and use direct execution to update all\nusages across the 45 files."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "This migration is a high-impact, cross-module change with several independent breaking changes. Before\nediting, Claude must determine how the callback-based API is currently used, where the restructured User\nfields propagate, whether deprecated methods are wrapped or re-exported, and which downstream modules\ndepend on the affected behavior. Plan mode is therefore the correct starting point because it allows Claude to\ninspect the repository, identify affected code paths, and produce an implementation strategy without\nmodifying source files.\n\nAnthropic recommends separating exploration and planning from implementation when the approach is\nuncertain, the change affects multiple files, or the developer is unfamiliar with the impacted code. Direct\nexecution is better reserved for small, clearly scoped changes that can be described as a simple diff. (\nhttps://code.claude.com/docs/en/best-practices )\n\nOption A applies transformations before establishing whether every usage follows the same pattern. Option B\nturns the test suite into a reactive discovery mechanism and may miss untested behavior. Option D provides\nuseful migration documentation but assumes all 45 files can be changed uniformly. The reliable sequence is\nexploration, impact mapping, migration planning, implementation, and verification against tests and type\nchecks.\n\nOfficial references/topics: Plan Mode; Explore–Plan–Implement Workflow; Multi-File Migration Planning;\nVerification."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 77,
    "domain": "mcp",
    "category": "Tool Design and MCP Integration",
    "prompt": {
      "en": "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-\nambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems\nthrough custom Model Context Protocol (MCP) tools ( get_customer , lookup_order , process_refund ,\nescalate_to_human ). Your target is 80%+ first-contact resolution while knowing when to escalate.\n\nDuring testing, you find that when a customer says “I need a refund for my recent purchase,” the agent calls\nprocess_refund immediately—but populates the required order_id parameter with a plausible-looking but\n\nfabricated value instead of first calling lookup_order to retrieve the actual order ID. The refund call fails\nbecause the fabricated ID doesn’t exist.\n\nWhich change directly addresses the root cause of the agent fabricating the order_id value?"
    },
    "options": [
      {
        "en": "Update the process_refund tool description to explicitly state that order_id must be obtained from a\nprior lookup_order call and must never be assumed or invented."
      },
      {
        "en": "Switch tool_choice from \" auto \" to \" any \" to force the agent to make a tool call on every turn."
      },
      {
        "en": "Add server-side validation that checks whether the order_id exists in your database before executing the\nrefund, returning an error to the agent if not found."
      },
      {
        "en": "Pre-parse incoming customer messages to extract any order IDs mentioned, and inject them into the\nconversation context before passing to Claude."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "The root cause is an incomplete tool contract. Claude sees that process_refund requires an order_id , but the\ntool description does not explain the parameter’s trusted source or the prerequisite lookup sequence. Option A\nmakes the dependency explicit and prohibits fabricated values.\n\nAnthropic states that tool descriptions should explain what a tool does, when it should be used, how it\nbehaves, and any important limitations. Its prompting guidance also states that dependent tool calls must be\nexecuted sequentially and that Claude must never use placeholders or guess missing tool parameters. (\nhttps://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools )\n\nOption B merely forces some tool use; it does not force the correct tool or prevent a fabricated identifier.\nOption C is an essential defense-in-depth control, but it detects the invalid ID after the model has already\nmade the faulty call. It does not correct the selection logic that caused the fabrication. Option D works only\nwhen the customer actually provides an identifier and introduces an unnecessary preprocessing dependency.\n\nThe process_refund schema should describe order_id as a verified identifier returned by lookup_order , and\nthe tool description should state that the tool is unavailable until the corresponding order has been retrieved\nand eligibility established.\n\nOfficial references/topics: Tool descriptions, prerequisite tool calls, parameter provenance, sequential tool\norchestration."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 78,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline.\nThe system runs automated code reviews, generates test cases, and provides feedback on pull requests. You\nneed to design prompts that provide actionable feedback and minimize false positives.\n\nIn addition to your CI pipeline, your organization has enabled Claude’s managed Code Review through the\nClaude GitHub App on this repository, and reviews run automatically on every pull request. Reviews average\n18 findings per pull request. Developer feedback reveals three categories of unwanted noise: (1) style and\n\nformatting issues already enforced by your linter in CI, (2) findings on automatically generated template code\nunder src/gen/, and (3) rendering-helper patterns that are intentional project conventions but get flagged\nbecause they resemble common anti-patterns. Only approximately four findings per pull request are genuine\nlogic bugs.\n\nWhat is the most effective way to reduce this noise while preserving the detection of genuine issues?"
    },
    "options": [
      {
        "en": "Create a REVIEW.md file at the repository root containing skip rules for CI-enforced checks and\ngenerated files, together with a verification requirement that rendering-related findings cite a specific\nline demonstrating incorrect behavior."
      },
      {
        "en": "Add custom review instructions to a GitHub Actions workflow file, using the action’s prompt\nparameter to suppress duplicate lint findings, ignore generated template code, and apply stricter\nevidence requirements to rendering-related issues."
      },
      {
        "en": "Add detailed explanations to the project’s CLAUDE.md describing which patterns are intentional, that\nlinting is handled separately by CI, and that the src/gen/ directory contains automatically generated\ntemplate code."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A uses the dedicated control surface for managed Claude Code Review. Anthropic’s Code Review\ndocumentation states that a root-level REVIEW.md is injected into every review agent as the highest-priority\ninstruction block. It can define skip paths, suppress categories already enforced by CI, recalibrate severity,\ncap nit volume, and require source evidence before reporting particular findings. The documentation\nexplicitly identifies generated code, linting, and verification requirements as appropriate uses.\n\nOption B configures a self-hosted GitHub Actions workflow, but the scenario concerns the separate managed\nCode Review service running on Anthropic’s infrastructure. Instructions in that workflow do not control the\nmanaged reviewer. Option C provides useful general project context, but CLAUDE.md has lower review-\nspecific authority: managed Code Review treats violations of it primarily as nit-level findings. REVIEW.md\nis the stronger and more precise mechanism for changing what the managed service reports. The file should\nskip src/gen/**, suppress style issues already enforced by CI, and require concrete behavioral evidence for\nrendering-helper warnings while continuing to report verified correctness and security defects."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 79,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-\nambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems\nthrough custom Model Context Protocol (MCP) tools ( get_customer , lookup_order , process_refund ,\nescalate_to_human ). Your target is 80%+ first-contact resolution while knowing when to escalate.\n\nWhen the agent calls lookup_order and receives order details showing the item was purchased 45 days ago,\nhow does the agentic loop determine whether to call process_refund or escalate_to_human next?"
    },
    "options": [
      {
        "en": "The order details are added to the conversation and the model reasons about which action to take."
      },
      {
        "en": "The orchestration layer automatically routes to the next tool based on the order’s status field."
      },
      {
        "en": "The agent follows a pre-configured decision tree mapping order attributes to specific tool calls."
      },
      {
        "en": "The agent executes the remaining steps in a tool sequence planned at the start of the request."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "In the standard Claude tool-use loop, the application executes lookup_order and sends its output back as a\ntool_result . That result becomes part of the conversation state available to Claude. Claude then evaluates the\npurchase date, refund policy, customer request, authorization constraints, and available tools before selecting\nthe next action.\n\nAnthropic describes client-tool orchestration as a repeated loop: Claude emits a tool_use request, the\napplication executes it, returns a tool_result , and Claude continues reasoning from the updated conversation.\nClaude, rather than the tool implementation, selects when and how to invoke the next available tool unless the\napplication has explicitly implemented a fixed workflow. ( https://platform.claude.com/docs/en/agents-and-\ntools/tool-use/how-tool-use-works )\n\nOptions B and C describe possible custom orchestration architectures, but neither is stated in the scenario.\nOption D is inconsistent with adaptive agent behavior because later actions depend on information that did not\nexist before lookup_order completed. A rigid sequence would not respond appropriately to different purchase\ndates, eligibility states, or order conditions.\n\nThe tool result should return high-signal fields such as purchase date, return-window status, refund eligibility,\nexisting refund status, and stable order identifiers so Claude can make the subsequent decision accurately.\n\nOfficial references/topics: Tool-result continuation, adaptive agent loops, model-directed tool selection,\nsequential dependency handling."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 80,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-\nambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems\nthrough custom Model Context Protocol (MCP) tools ( get_customer , lookup_order , process_refund ,\nescalate_to_human ). Your target is 80%+ first-contact resolution while knowing when to escalate.\n\nA customer contacts the agent about a warranty claim on a power drill. Resolving this requires multiple\nsequential tool calls: get_customer to look up their account, lookup_order to find the purchase details, and\nthen either process_refund or escalate_to_human depending on warranty eligibility. You’re implementing the\nagentic loop that orchestrates these steps using the Claude API.\n\nWhat is the primary mechanism your application uses to determine whether to continue the loop or stop?"
    },
    "options": [
      {
        "en": "You check whether Claude’s response contains a text content block—if text is present, the agent has\nproduced its final answer and the loop should exit."
      },
      {
        "en": "You manually set the tool_choice parameter to \" none \" after the final expected tool call to force Claude\nto stop requesting tools."
      },
      {
        "en": "You check the stop_reason field in each API response—the loop continues while it equals \" tool_use \"\nand exits when it changes to \" end_turn \" or another terminal value."
      },
      {
        "en": "You track the number of tool calls made and exit the loop once a preconfigured maximum is reached."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "The Messages API exposes stop_reason specifically so the application can determine why Claude stopped\ngenerating and what action is required next. A value of tool_use means Claude is requesting one or more tools\nand expects the application to execute them and return corresponding tool_result blocks. A value of end_turn\nmeans Claude has naturally completed the response. ( https://platform.claude.com/docs/en/build-with-claude\n/handling-stop-reasons )\n\nAnthropic’s agent-loop tutorial implements this as a loop that continues executing tools and returning results\nwhile stop_reason remains tool_use . Once the value changes, the response is treated according to the new\nterminal or continuation condition. ( https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-\ntool-using-agent )\n\nOption A is unreliable because an assistant response can contain both text and tool-use blocks. Text alone\ndoes not prove that the workflow is complete. Option B requires the application to predict that no further tool\ncall is needed, defeating Claude’s ability to adapt from tool results. Option D is an important safety limit but\nis not the primary completion signal; an arbitrary maximum may terminate a valid workflow prematurely.\n\nThe harness should check stop_reason , process every requested tool call, append results to the conversation,\nand maintain a separate maximum-turn safeguard against runaway loops.\n\nOfficial references/topics: Messages API stop reasons, tool-use loops, tool-result continuation, bounded\norchestration."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 81,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol\n(MCP) servers.\n\nAn engineer’s exploration subagent spent 30 minutes analyzing a legacy payment system, reading 47 files and\ndocumenting data flows. The session was interrupted when the engineer’s connection dropped. While away, a\nteammate merged a PR that renamed two utility functions. The engineer wants to continue the same\nexploration.\n\nWhat’s the most effective approach?"
    },
    "options": [
      {
        "en": "Launch a fresh subagent with a summary of prior findings."
      },
      {
        "en": "Resume the subagent from its previous transcript without mentioning the changes—the architecture\nunderstanding remains valid."
      },
      {
        "en": "Resume the subagent from its previous transcript and inform it about the renamed functions."
      },
      {
        "en": "Launch a fresh subagent and include the prior transcript in the initial prompt for context."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Resuming the existing subagent preserves the expensive investigative context: files already inspected, data-\nflow relationships, hypotheses, and intermediate conclusions. Anthropic documents that session history\ncontains prompts, tool calls, tool results, and responses, allowing an interrupted investigation to continue with\nits prior analysis intact. ( https://code.claude.com/docs/en/agent-sdk/sessions ) Subagent transcripts also\npersist within their parent session and can be resumed after an interruption or restart. ( https://code.claude.com\n/docs/en/agent-sdk/subagents?utm_source=chatgpt.com )\n\nThe engineer must nevertheless disclose the renamed utility functions. Anthropic explicitly distinguishes\nconversation persistence from filesystem persistence: resuming restores what the agent previously knew, but it\ndoes not freeze or snapshot the repository. ( https://code.claude.com/docs/en/agent-sdk/sessions ) Without the\nupdate, the subagent may search for obsolete symbols, misinterpret broken references, or rely on stale file\npaths.\n\nOption A loses the detailed transcript and replaces it with a necessarily compressed summary. Option B\npreserves context but conceals a material repository change. Option D duplicates a large transcript inside a\nnew context, increasing token consumption without providing any advantage over native resume functionality.\n\nThe resumed prompt should name the renamed functions, identify the merge or affected files, and instruct the\nsubagent to re-read only the changed areas before continuing its broader exploration.\n\nOfficial references/topics: Session Resume; Persistent Subagent Transcripts; Repository Drift; Targeted\nContext Refresh."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 82,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-\nambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems\nthrough custom Model Context Protocol (MCP) tools ( get_customer , lookup_order , process_refund ,\nescalate_to_human ). Your target is 80%+ first-contact resolution while knowing when to escalate.\n\nThe agent verifies customer identity through a multi-step process before resetting passwords. During testing,\nyou notice that after the customer answers the third verification question, the agent asks them to provide their\nname again, as if the earlier exchange never happened.\n\nWhat’s the most likely cause of this behavior?"
    },
    "options": [
      {
        "en": "The prompt lacks instructions telling Claude to remember information across multiple exchanges."
      },
      {
        "en": "The conversation history isn’t being passed in subsequent API requests."
      },
      {
        "en": "The verification tool is clearing the agent’s internal state after each successful validation step."
      },
      {
        "en": "Claude’s memory retention is limited to two conversational turns by default, requiring explicit\nconfiguration to extend it."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "The Claude Messages API is stateless. Each API request must include the conversation history that Claude\nrequires for the current response. If the application sends only the customer’s third verification answer,\nClaude does not automatically retrieve the earlier turns containing the customer’s name and previous answers.\nFrom the model’s perspective, that information is absent.\n\nAnthropic’s Messages API documentation states that applications must send the full conversational history to\nbuild a multi-turn interaction. The correct implementation appends each user message and assistant response\nto the messages array and resends the accumulated sequence on every subsequent request. ( https://platform.\nclaude.com/docs/en/build-with-claude/working-with-messages )\n\nOption A cannot restore information that was omitted from the request. Instructions to “remember” do not\ncreate server-side conversational state. Option C describes application-specific behavior for which the\nscenario provides no evidence. Option D is factually incorrect: Claude does not have a default two-turn\nretention limit. Its effective conversational awareness depends on the messages provided and the model’s\ncontext window.\n\nFor a verification workflow, the application should also persist structured verification state separately from\nprose history. That state may include completed checks, pending checks, attempt counts, and a verified\ncustomer identifier. This improves reliability while the conversational transcript preserves the natural\ninteraction.\n\nOfficial references/topics: Stateless Messages API, multi-turn history construction, structured workflow\nstate, conversational continuity."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 83,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building developer-productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools—Read, Write, Bash, Grep, and Glob—and integrates with Model Context\nProtocol (MCP) servers.\n\nDuring testing, you observe that in extended exploration sessions lasting more than 30 minutes, the agent\nstarts giving inconsistent answers about code structure it discussed earlier. Engineers report having to repeat\ncontext about modules they have already explored.\n\nWhat is the most effective approach to address this?"
    },
    "options": [
      {
        "en": "Have the agent maintain a scratchpad file that records key findings and reference it during subsequent\nquestions."
      },
      {
        "en": "Implement automatic context clearing every 15 minutes to ensure the agent starts with fresh,\nuncontaminated context."
      },
      {
        "en": "Switch to a higher-capacity model tier to provide more context-window space for accumulated\nexploration data."
      },
      {
        "en": "Create summaries of all source files before exploration begins, loading only those compressed\nrepresentations into context."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A moves durable, high-value discoveries outside the transient conversation history. The scratchpad\nshould record module responsibilities, important symbols, architectural relationships, file paths, unresolved\nquestions, and decisions supported by the code. The agent can reread this compact file after context\ncompaction or before answering a later architectural question. Anthropic’s large-codebase guidance\nrecommends saving plans and important state to files because those artifacts survive when long conversations\nare compacted. Its context-management guidance also warns that accumulated file contents and command\noutput can reduce performance during extended sessions.\n\nOption B clears valuable information on a fixed schedule regardless of whether the current task is complete.\nOption C delays the problem but does not prevent irrelevant history from crowding out important details.\nOption D performs expensive summarization before the agent knows which files are relevant and may remove\nimplementation details needed later. A focused scratchpad supports just-in-time restoration: the agent keeps\nthe active context lean while retaining an auditable architectural map that can be updated as exploration\nprogresses."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 84,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JSON schemas, and maintains high accuracy. It must\nhandle edge cases gracefully and integrate with downstream systems.\n\nYour extraction uses tool use with a JSON schema in which property_type is defined as an enum: house,\napartment, condo, or townhouse. After deployment, 8% of extractions fail schema validation. Investigation\nreveals that listings mention many uncommon property types—“studio,” “loft,” “duplex,” “mobile home,”\n“tiny house,” and “converted warehouse”—and new types continue appearing regularly.\n\nWhat is the most effective long-term solution?"
    },
    "options": [
      {
        "en": "Change property_type from an enum to a free-form string and implement a normalization step in post-\nprocessing."
      },
      {
        "en": "Add few-shot examples demonstrating how to map unexpected property types to the closest existing\nenum value."
      },
      {
        "en": "Continuously expand the enum to include newly observed property types and add monitoring for\nadditional edge cases."
      },
      {
        "en": "Add an other value to the enum with a separate property_type_detail string field for specifics when\nother is selected."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A is the most sustainable open-world design. The property-type domain is demonstrably not closed:\nuncommon values already occur, and new labels continue to appear. An enum is appropriate only when the\nvalid vocabulary is stable and exhaustive. If the source contains a legitimate value outside that vocabulary, the\nschema either rejects it or pressures the model to map it inaccurately. A free-form string preserves the source\nmeaning, while deterministic post-processing can normalize “studio,” “loft,” “duplex,” and future terms into\nan evolving canonical taxonomy. Anthropic’s Structured Outputs documentation distinguishes structural\nschema conformance from the semantic decisions made within that schema; it also documents that JSON\nSchema constraints such as enums govern allowable output shapes and values. Few-shot mapping to the\nnearest existing enum, option B, discards real distinctions. Continually expanding the enum, option C, creates\nrecurring schema changes and still lags newly observed values. An “other” bucket with detail, option D, is\nworkable but collapses all emerging categories at the primary field and complicates analytics until\ndownstream interpretation occurs. Capturing the raw type first and normalizing it in code provides lossless\nextraction, testable mappings, and forward compatibility."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 85,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-\nambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems\nthrough custom Model Context Protocol (MCP) tools (get_customer, lookup_order, process_refund,\nescalate_to_human). Your target is 80%+ first-contact resolution while knowing when to escalate.\n\nA customer returns 4 hours after their initial session about the same billing dispute. The previous 32-turn\nsession contains lookup_order results showing “Status: PENDING, Expected resolution: 24–48 hours.” In\ntesting, you observe that when resuming sessions with stale tool results, the agent often references the\noutdated data in responses (e.g., “I see your refund is still being processed”) even after subsequent fresh tool\ncalls return different information.\n\nWhat approach most reliably handles returning customers?"
    },
    "options": [
      {
        "en": "Resume with full history and configure the agent to automatically re-call all previously used tools at\nsession start to ensure data freshness."
      },
      {
        "en": "Resume with full history and add a system prompt instruction telling the agent to always prefer the\nmost recent tool results when multiple calls to the same tool exist in context."
      },
      {
        "en": "Resume with full history but filter out previous tool_result messages before resuming, keeping only the\nhuman/assistant turns so the agent must re-fetch needed data."
      },
      {
        "en": "Start a new session, inject a structured summary of the previous interaction (issue type, actions taken,\nresolution status), then make fresh tool calls before engaging."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "Option D separates durable case history from volatile operational data. The new session receives a compact,\nstructured summary describing the billing dispute, the customer’s objective, actions previously taken, and the\nunresolved status. It does not inherit outdated backend observations as though they were still authoritative.\nFresh tool calls then retrieve the current refund or order state before the agent responds.\n\nAgent SDK sessions preserve conversation history, including earlier tool calls and tool results. Resuming the\ncomplete transcript therefore reintroduces stale system data into the active context, even though the external\nbackend may have changed substantially during the four-hour gap. Conversation persistence must not be\nconfused with persistence of external-system truth.\n\nOption A performs unnecessary calls to every previously used tool, including tools unrelated to the returning\ncustomer’s current question. Option B relies on prompt compliance while retaining contradictory historical\nevidence in context. Option C manually removes tool results from an existing transcript and may damage the\nlogical relationship between prior tool_use and tool_result blocks while still retaining a long, unstructured\nconversation.\n\nA structured summary should preserve stable identifiers, previous actions, customer commitments, and\nunresolved issues. Time-sensitive fields such as refund status, delivery state, account balance, or expected\nresolution should always be refreshed through authoritative tools.\n\nOfficial references/topics: Session persistence, stale tool-result management, context compaction, fresh-data\nretrieval."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 86,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are using Claude Code to accelerate software development. Your team uses it for code generation,\nrefactoring, debugging, and documentation. You need to integrate it into your development workflow with\ncustom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct\nexecution.\n\nYour team’s CLAUDE.md includes a rule: “Use 4-space indentation and always run Prettier formatting.”\nDespite this, code reviews reveal that roughly 30% of files Claude Code generates use inconsistent\nformatting—sometimes 2-space indentation, sometimes missing trailing commas. Adding emphasis\n(“IMPORTANT: You MUST use Prettier formatting”) reduces violations to about 15%, but doesn’t eliminate\nthem.\n\nWhat is the most effective way to ensure all generated code is consistently formatted?"
    },
    "options": [
      {
        "en": "Extract the formatting rules into a dedicated skill that Claude loads automatically when generating\ncode, with more detailed examples of correct formatting."
      },
      {
        "en": "Add a Stop hook with a prompt-based check that evaluates whether generated code follows formatting\nstandards and prompts Claude to fix violations."
      },
      {
        "en": "Split the formatting rules into path-scoped .claude/rules/ files that load when Claude works on matching\nfile types."
      },
      {
        "en": "Configure a PostToolUse hook with an Edit|Write matcher that automatically runs Prettier on each file\nClaude modifies."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "Formatting is deterministic and should be enforced by deterministic tooling rather than stronger natural-\nlanguage instructions. A PostToolUse hook executes after a successful tool operation. Matching Edit|Write\nrestricts the hook to file modifications, allowing the edited file path to be passed directly to Prettier.\n\nAnthropic provides this exact pattern in its official hooks guidance: configure a PostToolUse event with an\nEdit|Write matcher and run Prettier against the modified file. This ensures formatting occurs automatically\nafter every relevant edit instead of depending on Claude remembering to execute a formatter. ( https://code.\nclaude.com/docs/en/hooks-guide )\n\nOption A still relies on instruction-following and unnecessarily loads procedural material. Option B asks\nanother probabilistic model evaluation to determine whether formatting is correct, even though Prettier can\nenforce the result directly. A Stop hook also runs later than necessary. Option C improves contextual\nrelevance but does not guarantee compliance; path-scoped rules remain instructions rather than enforcement\ncontrols.\n\nThe hook should be stored in project settings so the workflow is shared by the team. The formatter’s exit\nstatus should also be monitored so configuration or syntax failures are visible instead of silently ignored.\n\nOfficial references/topics: Claude Code Hooks; PostToolUse; Edit|Write Matchers; Deterministic\nFormatting Enforcement."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 87,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "Your pipeline reviews approximately 200 database-migration scripts daily using the Message Batches API.\nEach request includes a shared 8,000-token system prompt containing migration-review guidelines and\nschema documentation, followed by an individual migration script. You added cache_control breakpoints to\nthe shared system prompt in every request, but monitoring shows cache-hit rates of only 32%, with misses\nconcentrated among requests processed later in the batch window. Which change addresses the root cause\nwithout adding sequential-processing latency?"
    },
    "options": [
      {
        "en": "Split the 200 requests into ten sequential batches of 20, submitting each batch only after the previous\nbatch completes."
      },
      {
        "en": "Add cache-prewarming requests with max_tokens: 0 at the beginning of every batch."
      },
      {
        "en": "Move the cache_control breakpoint from the shared system prompt to each migration script so similar\ncode patterns can be reused."
      },
      {
        "en": "Configure the cache breakpoints to use the extended one-hour TTL instead of the default five-minute\nTTL."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "Option D directly addresses cache entries expiring before later batch requests are processed. Anthropic’s\nbatch-processing documentation specifically notes that Message Batches can take longer than five minutes\nand recommends the one-hour prompt-cache duration for batches containing shared context. The prompt-\ncaching documentation confirms that the default TTL is five minutes and that \" ttl \" : \" 1h \" creates an\nextended entry.\n\nOption A may improve cache locality, but it introduces the sequential-processing latency explicitly prohibited\nby the requirement. Option B seeds the cache initially, but the prewarmed entry still expires after five minutes\nunless the TTL is extended; it therefore does not solve misses among requests scheduled later. Option C\nplaces the breakpoint on request-specific content, defeating reuse of the stable 8,000-token prefix and\nattempting to cache scripts that are not byte-for-byte identical.\n\nThe system should retain the breakpoint at the end of the shared system content and apply the one-hour TTL\nthere. Cache-usage fields should then be monitored to confirm that cache_read_input_tokens rises and later\nbatch requests reuse the intended prefix."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 88,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and\nmaintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.\n\nYour system extracts event metadata (date, location, organizer, attendee_count) from news articles using a\nJSON schema with all nullable fields. During evaluation, you observe the model frequently generates\nplausible but incorrect values for fields not mentioned in the article—for example, outputting “500” for\nattendee_count when the source contains no attendance information.\n\nWhat’s the most effective way to reduce these false extractions?"
    },
    "options": [
      {
        "en": "Upgrade to a more capable model tier with improved instruction-following to reduce hallucination\ntendencies."
      },
      {
        "en": "Make all schema fields required (non-nullable) with strict validation rules to ensure the model only\noutputs verifiable data."
      },
      {
        "en": "Add prompt instructions to return null for any field where information is not directly stated in the\nsource."
      },
      {
        "en": "Add a post-processing step using a second LLM call to verify each extracted value exists in the source\ndocument."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "The schema already supports the correct representation of missing evidence: null . The remaining defect is\nbehavioral. Claude must be explicitly instructed that absence of information is a valid outcome and that values\nmay be populated only when directly supported by the supplied article.\n\nAnthropic’s hallucination-reduction guidance recommends explicitly permitting Claude to express\nuncertainty, grounding outputs in the source, and retracting claims that lack supporting evidence. It also\nrecommends restricting the model to the provided documents rather than allowing unsupported external\nknowledge. ( https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations\n) Option C translates those controls directly into the extraction contract: when no source evidence exists, the\nmodel returns null .\n\nOption A may improve baseline performance but does not remove the architectural ambiguity that encourages\ncompletion of missing fields. Option B is counterproductive because non-nullable required fields force the\nmodel to provide values even when the article contains none. Structured validation would confirm that the\nresponse is syntactically valid while accepting fabricated content. Option D adds cost, latency, and another\nprobabilistic model decision; a second model can repeat or endorse the original hallucination.\n\nA robust implementation should supplement the instruction with source spans or quotations for populated\nfields and automated checks where feasible. Nevertheless, among the options, explicit null behavior is the\ndirect and most effective correction.\n\nOfficial references/topics: Reduce Hallucinations; External-Knowledge Restriction; Nullable JSON Schema\nFields; Grounded Extraction."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 89,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol\n(MCP) servers.\n\nAn engineer used the agent yesterday to analyze a legacy authentication module, identifying two distinct\nrefactoring approaches: extracting a microservice versus refactoring in-place. Today, they want to explore\nboth approaches in depth—having the agent propose specific code changes for each—before deciding which\nto implement.\n\nWhat’s the most effective way to structure this exploration?"
    },
    "options": [
      {
        "en": "Use fork_session to create two branches from yesterday’s analysis, exploring one approach in each fork."
      },
      {
        "en": "Resume yesterday’s session and explore both approaches sequentially within the same conversation\nthread."
      },
      {
        "en": "Resume yesterday’s session to explore the first approach, then start a new session for the second,\nmanually recreating the original context."
      },
      {
        "en": "Start two fresh sessions, manually providing a summary of yesterday’s analysis findings to establish\ncontext."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Forking is specifically designed for exploring alternative directions from a shared body of prior analysis. Each\nfork starts with a copy of yesterday’s conversation history, including the files read, architectural observations,\ndependency findings, and decisions already recorded. The microservice approach and the in-place refactoring\napproach can then develop independently under separate session IDs.\n\nAnthropic’s Agent SDK documentation states that a fork creates a new session from a copy of the original\nhistory while leaving the original session unchanged. Each resulting session can subsequently be resumed\nindependently. The documented implementation combines resume with fork_session=True in Python or\nforkSession: true in TypeScript. ( https://code.claude.com/docs/en/agent-sdk/sessions )\n\nOption B allows conclusions, assumptions, and proposed edits from the first approach to contaminate the\nevaluation of the second. Option C preserves context for only one branch and forces the engineer to\nreconstruct context manually for the other. Option D discards the detailed analysis already captured in the\nsession and depends on potentially incomplete summaries.\n\nTwo forks provide equivalent starting conditions, preserve the parent investigation, and support a fair\ncomparison of scope, migration risk, operational complexity, and required code changes. Filesystem edits\nshould still be isolated through worktrees or checkpointing because session forking branches conversation\nhistory, not the working directory.\n\nOfficial references/topics: Agent SDK Sessions; Session Forking; Alternative-Approach Exploration;\nContext Preservation."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 90,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates\nto specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one\ngenerates reports. The system researches topics and produces comprehensive, cited reports.\n\nProduction monitoring shows that follow-up queries such as “summarize what we learned about market\ntrends” consistently take more than 40 seconds. Investigation reveals that the coordinator spawns the\nsynthesis subagent for each summarization request, passing more than 80,000 tokens of accumulated findings.\nThe coordinator already has these findings in its context from orchestrating the research.\n\nWhat is the most effective way to improve response time for these follow-up summaries?"
    },
    "options": [
      {
        "en": "Spawn the synthesis subagent with reduced context and have it request specific findings from the\ncoordinator on demand."
      },
      {
        "en": "Have the coordinator handle straightforward summarization requests directly using its existing context,\nreserving subagent spawning for complex analysis."
      },
      {
        "en": "Pre-generate and cache summaries at multiple granularities whenever new findings accumulate."
      },
      {
        "en": "Enable prompt caching on the synthesis subagent to reduce the overhead of repeatedly transferring the\nsame research findings."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B eliminates an unnecessary agent boundary. The coordinator already possesses the accumulated\nfindings and can answer a straightforward follow-up without serializing more than 80,000 tokens into a fresh\nsubagent context, waiting for another model execution, and receiving the result back. Anthropic’s multi-agent\nresearch engineering guidance emphasizes scaling effort to task complexity: simple fact-finding or\nlightweight processing should use substantially fewer agents and tool calls than complex research. It also\nreports that multi-agent systems consume far more tokens than ordinary interactions, making avoidable\ndelegation expensive and slow. Option A adds an interactive retrieval protocol between agents and additional\nround trips. Option C spends compute proactively on summaries that users may never request and creates\ncache-invalidation problems whenever findings change. Option D could reduce repeated input cost where\ncaching is applicable, but the subagent still receives and processes an unnecessarily large context and still\nincurs spawning latency. Delegation is valuable when an isolated context or specialized capability materially\nimproves the result. For a direct summary already supported by the coordinator’s active context, local\nhandling is the faster and simpler architecture."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 91,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "Your test-generation process produces unit tests for new code, but reviews show that 55% are low-value:\ntrivial assertions that verify only that functions do not throw exceptions, tests that duplicate existing coverage,\nor tests that ignore your team’s fixture conventions. How should you reduce the rate of low-value tests being\ngenerated in the first place?"
    },
    "options": [
      {
        "en": "Restrict test generation to directories where historical quality metrics show higher acceptance rates,\ndisabling it in areas where generated tests consistently require substantial editing."
      },
      {
        "en": "Implement two-phase generation in which a second Claude call scores every test against quality criteria\nand filters out low-scoring tests before presenting them to developers."
      },
      {
        "en": "Document your testing standards in CLAUDE.md, including valuable-test criteria, available fixtures\nand their intended uses, and examples distinguishing meaningful behavioural tests from trivial\nassertions."
      },
      {
        "en": "Add post-generation coverage analysis that automatically filters out every generated test that does not\nincrease line coverage beyond the existing test suite."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "The failures reflect missing project-specific knowledge: Claude does not know which fixtures are preferred,\nwhat the existing suite already covers, or what the team considers meaningful behaviour. Option C provides\nthis information as persistent project context before test generation begins. This changes generation quality at\nthe source instead of filtering weak tests after spending tokens to produce them.\n\nAnthropic’s CLAUDE.md documentation recommends storing shared build and test commands, coding\nstandards, architectural decisions, conventions, and common workflows in a project CLAUDE.md. Testing\nguidance can define required behavioural assertions, fixture selection rules, duplication checks, naming\nconventions, and representative examples of acceptable and unacceptable tests.\n\nOption A avoids difficult directories rather than improving the model’s understanding and sacrifices\npotentially useful automation. Option B may remove some weak tests, but it doubles model work and asks\nanother probabilistic call to infer quality criteria that should have been stated explicitly. Option D treats line\ncoverage as a quality metric even though a trivial test can increase coverage without validating meaningful\nbehaviour, while a valuable regression test may cover already executed lines with better assertions. Persistent,\nconcrete testing standards therefore offer the most direct and scalable improvement."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 92,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "In production, you observe that simple fact-checking queries—for example, “What year was the Paris Climate\nAgreement signed?”—traverse all four subagents sequentially, consuming more than 40 seconds and\nsignificant tokens per query. Complex comparative research benefits from the full pipeline. Your query\ndistribution is diverse and evolving as users discover new applications. What is the most effective approach to\noptimize for varying query complexity?"
    },
    "options": [
      {
        "en": "Create a fast path for factual questions that bypasses subagents entirely, routing all other queries\nthrough the complete pipeline to ensure research thoroughness."
      },
      {
        "en": "Train a query-complexity classifier on labeled historical data to predict optimal subagent combinations,\nretraining it periodically as query patterns evolve."
      },
      {
        "en": "Have the coordinator analyze each query and dynamically decide which subagents to invoke based on\nits assessment of the query requirements."
      },
      {
        "en": "Implement pattern-based routing that categorizes queries by structure—single-fact, comparative, or\nanalytical—and maps each category to a predefined subagent combination."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C allows orchestration effort to scale according to the actual evidence and processing requirements of\neach request. A factual lookup might require one search operation and a direct coordinator response, while\ncomparative research may justify parallel search, document analysis, synthesis, and formal report generation.\n\nAnthropic’s orchestrator-workers guidance describes a central model dynamically decomposing a task,\nchoosing workers, and combining their results. This pattern is particularly appropriate when required subtasks\ncannot be predicted reliably in advance. Anthropic’s multi-agent research architecture similarly uses a lead\nagent to analyze the query and determine an appropriate research strategy.\n\nOption A creates an inflexible two-route system and still sends every non-factual query through the most\nexpensive workflow. Option B requires labeled training data, an externally maintained classifier, and a stable\ndefinition of the optimal agent combination. Option D is less expensive to implement but becomes brittle as\nquery types evolve beyond predetermined categories. Dynamic coordination uses the model’s existing\nreasoning ability to assess source requirements, analytical depth, expected output, and uncertainty before\ninvoking only the specialists that materially improve the result."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 93,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and\nmaintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.\n\nYour extraction system implements automatic retries when validation fails. On each retry, the specific\nvalidation error is appended to the prompt. This retry-with-error-feedback approach resolves most failures\nwithin 2–3 attempts.\n\nFor which failure pattern would additional retries be LEAST effective?"
    },
    "options": [
      {
        "en": "The model extracts keywords as a nested object organized by category when the schema requires a flat\narray of strings."
      },
      {
        "en": "The model extracts “et al.” for co-authors when the full list exists only in an external document not in\nthe input."
      },
      {
        "en": "The model extracts citation counts as locale-formatted strings (“1,234”) when the schema requires\nintegers."
      },
      {
        "en": "The model extracts dates as ISO 8601 datetime strings (“2023-03-15T00:00:00Z”) when the schema\nrequires only the date portion (YYYY-MM-DD)."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Retry-with-error-feedback is effective when the required information is available and the defect concerns\nrepresentation. Options A, C, and D are correctable formatting failures: the model can flatten an object into an\narray, remove thousands separators and emit an integer, or convert a datetime into the required date-only\nformat. The validation message supplies enough information to revise the output.\n\nOption B is fundamentally different. The complete co-author list is absent from the model’s input and exists\nonly in an external document. No number of retries can recover evidence that was never supplied. Repeated\nattempts may instead increase the probability of fabrication. Anthropic’s hallucination guidance recommends\n\nrestricting responses to available documents, allowing the model to acknowledge missing information, and\nwithholding or retracting claims that cannot be grounded in the source. ( https://docs.anthropic.com/en/docs\n/test-and-evaluate/strengthen-guardrails/reduce-hallucinations )\n\nThe correct response is therefore to return an explicit missing-data state, retrieve the external document\nthrough a tool, or route the record for enrichment. Retrying without changing the information boundary\ncannot solve the problem.\n\nCurrent Anthropic Structured Outputs can eliminate many shape-related failures by guaranteeing JSON\nSchema conformance, but they still cannot create unavailable source facts. ( https://platform.claude.com/docs\n/en/build-with-claude/structured-outputs ) This distinction—format failure versus evidence failure—is central\nto reliable extraction architecture.\n\nOfficial references/topics: Retry Boundaries; Missing Context; Grounded Extraction; Structured Outputs;\nExternal Data Retrieval."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 94,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are using Claude Code to accelerate software development. Your team uses it for code generation,\nrefactoring, debugging, and documentation. You need to integrate it into your development workflow with\ncustom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct\nexecution.\n\nYour team wants Claude to follow a detailed code review checklist (8 items covering API changes, test\ncoverage, documentation, security, etc.) when reviewing pull requests. The team also uses Claude extensively\nfor other tasks: writing new features, debugging production issues, and generating documentation. Currently,\ndevelopers paste the checklist at the start of each review session.\n\nWhich approach best addresses this workflow need?"
    },
    "options": [
      {
        "en": "Create a /review slash command containing the checklist, invoked when starting reviews."
      },
      {
        "en": "Create a dedicated review subagent with the checklist embedded in its configuration."
      },
      {
        "en": "Add the checklist to the project’s CLAUDE.md file under a “Code Review” section."
      },
      {
        "en": "Configure plan mode as the default for code review sessions."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "The checklist is a reusable, task-specific procedure that should load only when a pull-request review is being\nperformed. A /review command provides an explicit invocation mechanism, prevents repeated copy-and-\npaste, and keeps the checklist out of unrelated coding, debugging, and documentation sessions.\n\nIn current Claude Code terminology, custom commands have been consolidated into skills. A .claude/skills\n/review/SKILL.md file creates a /review command, while the legacy .claude/commands/review.md format\n\nremains supported. Anthropic recommends skills when users repeatedly supply the same checklist or multi-\nstep procedure; unlike CLAUDE.md content, the skill body is loaded only when invoked or determined\nrelevant. ( https://code.claude.com/docs/en/skills )\n\nOption B introduces an isolated agent context when the requirement is primarily to inject a repeatable review\nprocedure. A subagent could be useful for independent verification, but it is not necessary merely to avoid\nrepasting the checklist. Option C bloats every session with instructions that apply only to code review. Option\nD controls editing permissions and planning behavior; it does not encode review criteria.\n\nThe review skill can also pre-authorize read-only tools and accept a pull-request identifier or branch as an\nargument.\n\nOfficial references/topics: Claude Code Skills; Custom Slash Commands; On-Demand Instructions;\nReusable Review Workflows."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 95,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol\n(MCP) servers.\n\nYour agent has analyzed a complex service module—reading 23 source files, tracing request flows, and\nidentifying error handling patterns. A developer wants to compare two testing strategies before committing to\none: end-to-end tests with mocked external services vs. snapshot tests capturing expected outputs. They need\nto independently develop both approaches to evaluate trade-offs.\n\nHow should you manage the sessions?"
    },
    "options": [
      {
        "en": "Resume the analysis session with fork_session enabled, creating a separate branch for each testing\nstrategy."
      },
      {
        "en": "Start two fresh sessions, having each re-read the relevant source files before beginning."
      },
      {
        "en": "Continue in the original session, developing end-to-end tests first, then snapshot tests sequentially."
      },
      {
        "en": "Export the analysis session’s key findings to a file, then create two new sessions that reference this file."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Forking the existing analysis session creates independent continuations that inherit the accumulated\nconversation context. Each branch begins with the same understanding of the service module, request flow,\nsource files, and error-handling patterns, but subsequent work on one testing strategy does not alter the other\nbranch or the original session.\n\nAnthropic’s Agent SDK documentation states that sessions can be resumed with their full context and forked\nto explore different approaches. In the SDK, enabling fork_session while resuming causes the continuation to\nreceive a new session identifier rather than modifying the original session. ( https://docs.anthropic.com/en\n/docs/claude-code/sdk?utm_source=chatgpt.com )\n\nOption B wastes time, tokens, and tool calls by requiring both new sessions to rebuild the same 23-file\nanalysis. Option C mixes two experimental implementations into one conversation, increasing the risk that\nassumptions, edits, or conclusions from the first strategy influence the second. Option D preserves only a\nmanually selected summary, which may omit details contained in the full session history.\n\nThe appropriate design is to create one fork for the end-to-end strategy and another fork for the snapshot\nstrategy. The original analysis remains a stable parent, while each child session develops and evaluates its\napproach independently.\n\nOfficial references/topics: Agent SDK Sessions, Session Forking, Context Preservation, Alternative-\nApproach Evaluation."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 96,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates\nto specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one\ngenerates reports. The system researches topics and produces comprehensive, cited reports.\n\nProduction reviews reveal inconsistent handling of uncertainty in final reports. Sometimes conflicting\nsubagent findings are synthesized into a single confident statement, losing important nuance, while other\nreports use excessive qualifications and become unhelpful. The web-search agent returns, “Industry analysts\nestimate a $50 billion market size, although methodologies vary.” The document-analysis agent returns, “A\npeer-reviewed study estimates $35 billion, with a ±$7 billion 95% confidence interval.” The coordinator\neither selects one estimate arbitrarily or produces a vague $35–$50 billion range.\n\nWhat systematic approach best addresses this?"
    },
    "options": [
      {
        "en": "Implement a confidence-calibration layer that normalizes subagent uncertainty expressions to\nprobability scores between 0.0 and 1.0, and then calculate a confidence-weighted average."
      },
      {
        "en": "Configure subagents to report only findings meeting a high-confidence threshold, filtering uncertain\ninformation before it reaches the coordinator."
      },
      {
        "en": "Add a verification subagent that passes claims to synthesis only when they are corroborated by at least\ntwo independent sources."
      },
      {
        "en": "Instruct the synthesis agent to distinguish well-established findings from contested findings explicitly,\npreserving each source’s original uncertainty, methodology, and supporting evidence."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "Option D preserves the evidence instead of manufacturing certainty. The two estimates are not directly\ninterchangeable: one is an industry estimate with unspecified methodology, while the other is a peer-reviewed\nestimate with an explicit confidence interval. Converting both into model-generated confidence scores and\ncalculating a weighted average would create a new figure that neither source reported and that may have no\nstatistical validity. Anthropic’s hallucination-reduction guidance recommends making claims auditable\nthrough quotations, citations, and supporting evidence rather than presenting unsupported synthesis as fact. Its\nCitations documentation similarly emphasizes retaining the exact source passages supporting individual\nclaims. Filtering uncertain findings, option B, would remove decision-relevant information. Requiring two-\nsource corroboration, option C, could also discard credible evidence concerning emerging or specialized\nsubjects. The synthesis agent should report the estimates separately, explain their methodological differences,\nidentify which findings are strongly supported or disputed, and state what evidence would resolve the\ndisagreement. This produces calibrated, useful reporting without arbitrary selection, excessive hedging, or\nfalse precision."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 97,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates\nto specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one\ngenerates reports. The system researches topics and produces comprehensive, cited reports.\n\nYou have configured the system so that all four subagents have access to the complete set of 18 tools. During\ntesting, agents frequently call tools outside their specialization—the synthesis agent attempts web searches,\nand the report generator tries to analyze documents.\n\nWhat is the primary cause of this poor tool-selection behavior?"
    },
    "options": [
      {
        "en": "The tool definitions consume too much context-window space, leaving insufficient room for task\ncontent."
      },
      {
        "en": "Choosing from 18 tools instead of four or five relevant tools increases decision complexity beyond\nreliable selection thresholds."
      },
      {
        "en": "The agents’ role descriptions in their system prompts conflict with having access to tools outside those\nroles."
      },
      {
        "en": "The coordinator cannot track which capabilities each subagent has, leading to misrouted tasks."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C identifies the architectural contradiction. A specialized subagent’s role prompt says what work it\nshould perform, but granting it every tool simultaneously signals that unrelated actions are available and\npotentially legitimate. The synthesis agent can therefore interpret web search as a permissible way to fill gaps,\nwhile the report generator may invoke document-analysis tools even though those responsibilities belong\nelsewhere. Anthropic’s Agent SDK documentation describes subagents as focused workers with tailored\ninstructions and explicitly supports restricting each subagent to specific tools; it notes that tool restrictions\nreduce unintended actions. There is no documented universal threshold at which choosing among 18 tools\n\nbecomes unreliable, so option B invents a “four or five tools” limit. Context consumption in option A may\naffect efficiency, but it does not directly explain the role-specific cross-calling pattern. Option D is also\nincorrect because the observed behavior occurs after delegation, inside agents that already possess the tools.\nThe remedy is least-capability configuration: give the web agent search tools, the document agent document\ntools, the synthesis agent only the inputs and utilities required to combine findings, and the report agent\nformatting or file-output tools. Aligning role, description, and tool allowlist removes the conflicting\naffordances."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 98,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building developer-productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools—Read, Write, Bash, Grep, and Glob—and integrates with Model Context\nProtocol (MCP) servers.\n\nAn engineer who recently joined the team asks the agent to explain the authentication and authorization\narchitecture before making security improvements. The codebase contains more than 800 files across multiple\nservices.\n\nWhat exploration strategy will most effectively build understanding while respecting context limits?"
    },
    "options": [
      {
        "en": "Launch parallel subagents to explore every service simultaneously, and then synthesize their findings\ninto an architectural overview."
      },
      {
        "en": "Read all files containing auth , login , permission , or token in their filenames or contents."
      },
      {
        "en": "Read all CLAUDE.md and README files first, and then ask the engineer to identify the 10–15 most\nimportant authentication files."
      },
      {
        "en": "Use Grep to locate authentication entry points, read those files, and then follow imports and function\ncalls incrementally to map the authentication flow."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "Option D builds an evidence-based architectural map without indiscriminately loading hundreds of files.\nAuthentication entry points may include route handlers, middleware registration, token-validation functions,\nsession constructors, or identity-provider callbacks. After Grep identifies those anchors, targeted Read\noperations can establish their responsibilities, while imports, call sites, and configuration references reveal the\ndownstream authorization flow. Anthropic’s large-codebase guidance recommends scoping Claude to the\nportion of a repository touched by the task because unrelated instructions and file reads consume tokens and\ndegrade performance. Its common workflows guidance similarly recommends beginning broadly and\nnarrowing into specific components. Option A launches agents before the relevant service boundaries are\nknown and may produce overlapping, inconsistent investigations. Option B is an uncontrolled lexical sweep\nthat will include tests, documentation, unrelated tokens, and incidental terminology. Option C appropriately\n\nchecks project guidance but incorrectly delegates technical file selection to a new engineer who may not know\nthe architecture. Incremental dependency tracing maintains context efficiency while producing a verifiable\nend-to-end map grounded in actual code paths."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 99,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol\n(MCP) servers.\n\nYour code review assistant needs to analyze pull requests and provide feedback on three aspects: code style\ncompliance, potential security issues, and documentation completeness. Each aspect requires reading files,\nrunning analysis tools, and generating a report section. The review process follows the same three-step\nworkflow for every PR.\n\nWhich task decomposition pattern is most appropriate for this workflow?"
    },
    "options": [
      {
        "en": "Single comprehensive prompt—include all three instructions in one prompt and let the model handle all\nthree aspects simultaneously."
      },
      {
        "en": "Orchestrator-workers—have a central LLM analyze each PR to dynamically determine which checks\nare needed, then delegate to specialized worker LLMs for each identified subtask."
      },
      {
        "en": "Prompt chaining—break the review into sequential steps where each aspect (style, security,\ndocumentation) is analyzed separately, with outputs combined in a final synthesis step."
      },
      {
        "en": "Routing—classify each PR by type (feature, bugfix, refactor) first, then route to different review\nprompts optimized for that category."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Prompt chaining is appropriate because the workflow consists of predictable, fixed subtasks that apply to\nevery pull request. The system can run a focused style-compliance analysis, then a security analysis, then a\ndocumentation review, and finally synthesize the three results into a consistent report.\n\nAnthropic defines prompt chaining as decomposing a task into a sequence of steps in which each call handles\na smaller component. It is recommended when a task can be cleanly divided into fixed subtasks, trading\nadditional latency for better focus and accuracy. Intermediate checks can also be inserted between stages to\nconfirm that each report section meets its requirements. ( https://www.anthropic.com/engineering/building-\neffective-agents )\n\nOption A concentrates all considerations into one call, making it easier for one aspect to receive inadequate\nattention. Option B is unnecessary because orchestrator-workers is intended for complex work where the\nrequired subtasks cannot be predicted in advance. Here, the three review dimensions are already known and\nremain constant. Option D solves a different problem: routing is appropriate when inputs belong to distinct\ncategories that require different downstream processes.\n\nAlthough the three analyses could potentially be parallelized for lower latency, the option that accurately\nrepresents the stated repeatable decomposition is prompt chaining with final synthesis.\n\nOfficial references/topics: Prompt Chaining, Fixed Subtasks, Intermediate Validation, Workflow Selection."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 100,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates\nto specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one\ngenerates reports. The system researches topics and produces comprehensive, cited reports.\n\nThe coordinator provides detailed step-by-step instructions to the web-search subagent, specifying exact\nsearch queries, source priorities, and date filters. Production monitoring reveals three issues: (1) the subagent\nreports “insufficient results” rather than trying alternative approaches when the pre-specified searches fail, (2)\nresearch quality drops for emerging topics that do not match expected patterns, and (3) the subagent rarely\nsurfaces valuable tangential sources.\n\nWhat is the most effective way to improve subagent adaptability?"
    },
    "options": [
      {
        "en": "Specify research goals and quality criteria—coverage breadth, source diversity, and recency—rather\nthan procedural steps, allowing the subagent to determine its search strategy."
      },
      {
        "en": "Remove procedural details entirely, delegating with simple goals such as “research X thoroughly” and\n\nrelying on the subagent’s general capabilities."
      },
      {
        "en": "Add explicit fallback directives to the detailed instructions: “If specified searches yield fewer than N\nresults, attempt alternative query formulations before reporting failure.”"
      },
      {
        "en": "Implement a topic-classification step where the coordinator categorizes requests as “well-defined” or\n“exploratory” and uses different instruction styles for each category."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A defines what successful research must achieve without hard-coding a brittle search procedure. The\nsubagent receives measurable objectives—breadth, diversity, recency, and relevance—but retains authority to\nreformulate queries, follow promising leads, and adjust source selection when the topic does not match\nfamiliar patterns. Anthropic’s account of its multi-agent research system states that subagents need an\nobjective, expected output format, guidance about tools and sources, and clear task boundaries. This is more\ninformative than option B’s vague instruction, yet more adaptive than prescribing every query. Option C\nimproves only one known failure path and still constrains the agent to a predefined procedure that may be\nunsuitable for emerging subjects. Option D adds orchestration complexity and a potentially incorrect\nclassification step without solving over-prescription within either category. The coordinator should describe\nmandatory constraints separately from strategic guidance: authoritative-source requirements and time\nboundaries can remain fixed, while query formulation and exploration paths remain agent-controlled.\nEvaluation should then measure source coverage, evidence quality, duplication, and discovery of relevant\nsecondary leads rather than whether the subagent followed a particular series of searches."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 101,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "In addition to your CI pipeline, your organization has enabled Claude’s managed Code Review through the\nClaude GitHub App on this repository, and reviews run automatically on every pull request. Reviews average\n18 findings per pull request. Developer feedback reveals three categories of unwanted noise: (1) style and\nformatting issues already enforced by your CI linter, (2) findings on automatically generated template code\nunder src/gen/*, and (3) rendering-helper patterns that are intentional project conventions but are flagged\nbecause they resemble common anti-patterns. Only approximately four findings per pull request are genuine\nlogic bugs. What is the most effective way to reduce this noise while preserving the detection of real issues?"
    },
    "options": [
      {
        "en": "Create a REVIEW.md file at the repository root containing skip rules for CI-enforced checks and\ngenerated files, together with a verification requirement that rendering-related findings cite a specific\nline demonstrating incorrect behavior."
      },
      {
        "en": "Configure separate GitHub Actions workflow files for each code area: one for generated code with\nfindings suppressed, one for rendering code with custom instructions, and one general workflow for\neverything else."
      },
      {
        "en": "Add custom review instructions to a GitHub Actions workflow file, using the action’s prompt\nparameter to suppress duplicate lint findings, ignore generated template code, and impose stricter\nevidence requirements on rendering-related issues."
      },
      {
        "en": "Add detailed explanations to the project’s CLAUDE.md describing intentional patterns, stating that CI\nhandles linting, and identifying src/gen/ as automatically generated code."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A uses the dedicated configuration mechanism for Anthropic’s managed Code Review service. The\nofficial Code Review documentation states that a root-level REVIEW.md is injected into every review agent\nas the highest-priority instruction block. It can redefine severity, suppress categories already enforced by CI,\nskip generated paths, and require concrete evidence before particular findings are reported.\n\nThe proposed rules map directly to the observed noise. Skipping lint and formatting findings eliminates\nduplication with deterministic CI checks. Excluding src/gen/* prevents comments on machine-generated\ncode. Requiring a specific source line demonstrating incorrect behavior raises the verification threshold for\nrendering-helper findings without suppressing genuine defects.\n\nOptions B and C configure self-hosted GitHub Actions workflows, but the scenario concerns managed Code\nReview running through the Claude GitHub App on Anthropic’s infrastructure. Those workflow prompts do\nnot govern the managed reviewer. Option D supplies useful general project context, but CLAUDE.md applies\nto all Claude Code tasks and has lower review-specific authority. The documentation states that REVIEW.md\nis the stronger control for changing what managed Code Review flags and how findings are reported. It\ntherefore provides the most targeted solution with the least unnecessary infrastructure."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 102,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are using Claude Code to accelerate software development. Your team uses it for code generation,\nrefactoring, debugging, and documentation. You need to integrate it into your development workflow with\ncustom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct\nexecution.\n\nYou’ve asked Claude Code to build a PDF report generation feature. The initial implementation queries the\ndatabase correctly, but the output has formatting issues: table columns are too narrow causing content\ntruncation, dates display without proper formatting, and page break handling is incorrect. You’ve noticed\nthese issues interact—changing column widths affects how dates render, and page breaks depend on content\nheight.\n\nWhat’s the most effective approach for iterating toward a working solution?"
    },
    "options": [
      {
        "en": "Start fresh with a detailed prompt specifying all formatting requirements upfront."
      },
      {
        "en": "Provide all three issues in a single detailed message with exact specifications for each, allowing Claude\nto address them together in one update."
      },
      {
        "en": "Address the column width issue first with specific measurements, verify it works, then fix date\nformatting within the corrected columns, then adjust page breaks—testing after each change."
      },
      {
        "en": "Show Claude an example of a correctly formatted report and ask it to match that output, rather than\nlisting the specific technical issues."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "The defects are coupled, so changing all three simultaneously would make it difficult to determine which\nmodification caused an improvement or regression. Option C establishes a controlled sequence: correct the\nfoundational column geometry, verify the resulting layout, format dates within the stabilized columns, and\nfinally tune page breaks using the resulting content heights.\n\nAnthropic recommends tight feedback loops and early course correction. It also advises supplying Claude\nwith an executable or observable verification mechanism, such as a test, build result, generated fixture, or\nscreenshot comparison. Claude can then make a focused change, inspect the output, and iterate until that\nspecific condition is satisfied. ( https://code.claude.com/docs/en/best-practices )\n\nOption A discards useful context from the functioning database implementation. Option B changes multiple\ninteracting variables in one pass, making failures harder to isolate. Option D provides a useful visual target\nbut does not replace precise technical constraints or incremental verification.\n\nEach stage should have explicit acceptance criteria—for example, minimum column widths, expected date\nstrings, and page-break fixtures using short and long content. Once a stage passes, its test becomes a\nregression guard for subsequent changes.\n\nOfficial references/topics: Incremental Refinement; Tight Feedback Loops; Observable Verification;\nRegression Control."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 103,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are building developer-productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools—Read, Write, Bash, Grep, and Glob—and integrates with Model Context\nProtocol (MCP) servers.\n\nAn engineer sees the unfamiliar error message SYNC_CONFLICT: entity version mismatch detected in\nproduction logs but does not know which of the 12 services in the codebase generates it. The engineer asks\nthe agent to locate the responsible source code.\n\nWhat exploration approach will find the responsible code most efficiently?"
    },
    "options": [
      {
        "en": "Use Grep to search for distinctive text from the error message, such as SYNC_CONFLICT or entity\nversion mismatch , and then read the matching files to understand the context."
      },
      {
        "en": "Use Glob to find files in directories commonly associated with error handling, such as errors ,\nexceptions , or handlers , and then read every matching file."
      },
      {
        "en": "Read the project’s README and service-configuration files, and then systematically read source files\nin every service directory."
      },
      {
        "en": "Use Grep to locate every file importing the project’s error-handling module, and then read those files to\nfind custom error definitions."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A begins with the strongest available discriminator: the exact production error text. Anthropic’s tools\nreference specifies that Grep searches file contents and returns matching lines, enabling the agent to locate a\nliteral error constant or message without loading the full repository. Searching both the stable code\nSYNC_CONFLICT and the distinctive phrase protects against cases where the identifier and displayed\nmessage are defined separately. The agent can then read only the matching files and follow the surrounding\ncall path, error construction, and service ownership. Option B assumes that errors are stored in conventionally\nnamed directories, which may not hold in a twelve-service repository. Option C consumes substantial context\nbefore using the most direct evidence. Option D narrows the search to consumers of a known shared error\nmodule, but the message may be locally defined, generated from configuration, or wrapped by another\ncomponent. Grep followed by targeted Read operations follows Anthropic’s broader context-engineering\nprinciple of retrieving relevant source material just in time instead of placing an entire codebase into the\nactive context."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 104,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are using Claude Code to accelerate software development. Your team uses it for code generation,\nrefactoring, debugging, and documentation. You need to integrate it into your development workflow with\ncustom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct\nexecution.\n\nYour team has three requirements for Claude Code’s behavior in your project:\n\nClaude must never modify files in the db/migrations/ directory.\n\nClaude should prefer your custom logging module over console.log .\n\nAll TypeScript files must be auto-formatted with Prettier after every edit.\n\nAll three are currently written as instructions in your project’s CLAUDE.md. During a complex refactoring\nsession, a developer discovers that Claude edited a migration file, violating requirement #1.\n\nHow should you restructure these requirements across Claude Code’s configuration mechanisms?"
    },
    "options": [
      {
        "en": "Move all three requirements into .claude/rules/ as path-scoped rules: one targeting db/migrations/** that\nforbids editing those files, and others targeting **/*.ts for the logging convention and formatting\ninstruction."
      },
      {
        "en": "Configure hooks for all three: a PreToolUse hook script that blocks Edit calls targeting db/migrations/ ,\na PreToolUse hook script that adds logging convention context before edits, and a PostToolUse hook\nthat runs Prettier after TypeScript edits."
      },
      {
        "en": "Rewrite all three requirements in CLAUDE.md using stronger directive language and add few-shot\nexamples that demonstrate Claude refusing to edit migration files and running Prettier after edits."
      },
      {
        "en": "Add Edit(./db/migrations/**) to permissions.deny in the project settings, keep the logging preference in\nCLAUDE.md, and add a PostToolUse hook to run Prettier after TypeScript edits."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "Each requirement belongs in the mechanism matching its enforcement semantics. The migration restriction is\na hard safety boundary, so it should be implemented through permissions.deny , not merely expressed as\ncontextual guidance. Anthropic explicitly states that CLAUDE.md content is treated as context rather than\nenforced configuration. Permission rules use the Tool(specifier) form, evaluate deny rules before ask or allow\nrules, and support path-based Edit(...) restrictions. ( https://code.claude.com/docs/en/memory )\n\nThe custom logging convention is a persistent project preference, making CLAUDE.md the appropriate\nlocation. It should guide Claude’s code-generation decisions but does not require deterministic interception.\nPrettier formatting, by contrast, is deterministic automation. Anthropic documents the exact pattern of using a\nPostToolUse hook with an Edit|Write matcher to run Prettier automatically after file modifications. (\nhttps://code.claude.com/docs/en/hooks-guide )\n\nOption A incorrectly treats path-scoped rules as a security control; rules remain instructions. Option B\noveruses hooks for a semantic coding preference that belongs in CLAUDE.md. Option C relies entirely on\nstronger prompting, which cannot guarantee that protected files remain untouched. Option D correctly\nseparates prohibition, preference, and automatic enforcement.\n\nOfficial references/topics: Permission rules, CLAUDE.md semantics, PostToolUse formatting hooks."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 105,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "Your automated review calls the Claude API for each pull request, using tool_use with a report_findings tool\nthat returns a JSON array of finding objects. Each object contains file_path, line_number, severity, category,\nand description. During testing on a large pull request touching more than 30 files, the response reaches the\nmax_tokens limit and is truncated in the middle of the JSON, causing your pipeline’s parser to fail. What is\nthe most effective way to handle this?"
    },
    "options": [
      {
        "en": "Split the review into multiple API calls that each analyze a subset of the changed files, and then merge\nthe resulting findings arrays."
      },
      {
        "en": "Increase max_tokens to the model’s maximum and instruct Claude to keep each finding description\nunder 50 words."
      },
      {
        "en": "Switch from tool_use to prompting Claude to return findings as a Markdown list."
      },
      {
        "en": "Add retry logic that detects truncated JSON and resends the request with instructions to report only\ncritical- and high-severity findings."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A reduces the maximum output required from any single response while preserving the structured\nschema and complete severity range. The pipeline can partition files into coherent groups, execute bounded\nreviews, validate each returned array, and merge and deduplicate findings using stable fields such as file path,\nline number, category, and description.\n\nAnthropic’s stop-reason documentation confirms that max_tokens means generation reached the configured\noutput limit and the response must be treated as incomplete. Structured output constraints can guarantee\nschema-valid generation when completion succeeds, but they cannot create unlimited output capacity. A large\nfindings array can still exceed the available token budget.\n\nOption B may postpone the failure but provides no durable guarantee for still-larger pull requests, and\naggressively shortening descriptions may eliminate necessary evidence. Option C abandons machine-\nvalidated structure without reducing the amount of generated content. Option D deliberately suppresses\nmedium- or low-severity findings and repeats an oversized request rather than addressing its scope.\nPartitioning establishes predictable output bounds, supports targeted retries, retains every required finding\ncategory, and prevents a single truncated response from invalidating the complete review."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 106,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are using Claude Code to accelerate software development. Your team uses it for code generation,\nrefactoring, debugging, and documentation. You need to integrate it into your development workflow with\ncustom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct\nexecution.\n\nYour team frequently migrates React components to Vue. You’ve written a step-by-step workflow for Claude\nCode to follow during each migration, and you want every developer on the team to invoke it by typing\n/migrate-component . The workflow should stay in sync as the team iterates on it.\n\nWhere should you place the skill file?"
    },
    "options": [
      {
        "en": "In ~/.claude/skills/migrate-component/SKILL.md on each developer’s machine."
      },
      {
        "en": "As a detailed instruction block in the project’s root CLAUDE.md file."
      },
      {
        "en": "In the project’s .claude/settings.json using a skillOverrides entry to register and define the workflow."
      },
      {
        "en": "In .claude/skills/migrate-component/SKILL.md at the project root, committed to version control."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "Project skills are stored at .claude/skills/ < skill-name > /SKILL.md . The directory name becomes the\ninvocable command name, so .claude/skills/migrate-component/SKILL.md creates /migrate-component .\nAnthropic distinguishes project skills from personal skills: project skills apply only to the repository, while\nskills under ~/.claude/skills/ apply to one user across all projects. ( https://code.claude.com/docs/en/skills )\n\nCommitting the project skill to version control ensures that every developer receives the same workflow and\nthat changes are reviewed, versioned, and synchronized with the codebase. Anthropic’s .claude directory\nguidance states that project configuration should be committed when it is intended to be shared with the team,\nwhereas files under ~/.claude are personal. ( https://code.claude.com/docs/en/claude-directory )\n\nOption A requires manual duplication across developer machines and allows versions to diverge. Option B\nloads the migration procedure into every conversation even when no migration is occurring; Anthropic\nrecommends skills for reusable checklists and multi-step procedures because their bodies load only when\nused. Option C describes no valid mechanism for defining a skill’s content in settings.json .\n\nOption D provides the correct scope, command name, on-demand loading behavior, and team distribution\nmodel.\n\nOfficial references/topics: Project skills, SKILL.md structure, command invocation, version-controlled team\nconfiguration."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 107,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates\nto specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one\ngenerates reports. The system researches topics and produces comprehensive, cited reports.\n\nWhen analyzing complex legal cases that cite multiple precedents, the document-analysis subagent processes\neach precedent sequentially. A landmark case citing 12 precedents takes more than three minutes to analyze\ncompletely.\n\nWhat is the most effective way to reduce this latency while preserving the coordinator’s ability to monitor and\ndebug the system?"
    },
    "options": [
      {
        "en": "Implement a message queue where precedent-analysis tasks are processed asynchronously by a pool of\nworker agents."
      },
      {
        "en": "Enable the document-analysis subagent to spawn its own specialized subagents dynamically when it\nencounters cases with many citations."
      },
      {
        "en": "Have the coordinator spawn parallel document-analysis subagents, each handling a subset of\nprecedents, and then aggregate the results before synthesis."
      },
      {
        "en": "Create a recursive agent hierarchy where analysis agents subdivide work among child agents until\nreaching single-precedent granularity."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C parallelizes independent work while retaining centralized orchestration. Each precedent can be\nanalyzed without waiting for the previous precedent, so the coordinator can divide the 12 cases into balanced\nsubsets and invoke several document-analysis subagents concurrently. It then receives their final outputs,\nrecords which precedents completed or failed, and aggregates the results before synthesis. Anthropic’s multi-\nagent research architecture uses an orchestrator-worker pattern in which the lead agent creates specialized\nsubagents that operate in parallel and return findings for consolidation. Keeping spawning decisions at the\ncoordinator also produces a clearer execution trace for monitoring and debugging. A generic asynchronous\nqueue, option A, adds infrastructure but does not define how results remain associated with the correct\nresearch task. Options B and D create nested or recursive delegation, making execution paths, permissions,\nfailures, and token consumption harder to observe. Anthropic also cautions that multi-agent systems consume\nsubstantially more tokens than ordinary interactions, so unbounded recursive decomposition is inefficient.\nCoordinator-controlled parallel fan-out followed by deterministic aggregation provides the latency\nimprovement without sacrificing operational visibility."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 108,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates\nto specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one\ngenerates reports. The system researches topics and produces comprehensive, cited reports.\n\nThe synthesis agent receives summarized findings from the web-search and document-analysis agents, then\npasses a consolidated summary to the report generator. During testing, you discover that the generated reports\nmake factual claims without proper citations. The report generator cannot attribute statements to their original\nsources because that metadata was lost during the summarization steps.\n\nWhat is the most effective approach to ensure proper source attribution in the final reports?"
    },
    "options": [
      {
        "en": "Have each agent output structured data separating content summaries from source metadata such as\nURLs, document names, and page numbers."
      },
      {
        "en": "Skip summarization and pass the complete raw outputs from web search and document analysis directly\nto the report generator."
      },
      {
        "en": "Instruct the synthesis agent to embed source references inline within its summary text using a consistent\ncitation format."
      },
      {
        "en": "Have the report generator query the web-search agent to relocate sources for claims in the final report."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A preserves provenance as first-class data throughout the pipeline. Each finding should contain the\nsummarized claim, supporting excerpt, source identifier, URL or document title, and location information\nsuch as a page or content-block index. The synthesis agent can combine findings without severing the\nassociation between evidence and source, while the report generator can render citations directly from the\nstructured records. Anthropic’s Citations documentation explains that reliable citations identify the supporting\npassage and its precise source location, including PDF page ranges or content-block indices. Passing all raw\noutput, option B, preserves evidence but introduces excessive context and makes source selection harder.\nInline references in prose, option C, are vulnerable to being altered, omitted, or detached from claims during\nsubsequent summarization. Option D repeats research after report generation and may locate a different\nsource rather than the evidence originally used. A structured provenance contract should therefore be required\nin every subagent’s output and validated at each handoff. The report generator should reject or flag factual\nclaims that lack an associated evidence record instead of inventing or retrospectively reconstructing citations."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 109,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates\nto specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one\ngenerates reports. The system researches topics and produces comprehensive, cited reports.\n\nAfter the web-search agent finds 25 sources containing 120,000 tokens of raw content, the document-analysis\nagent extracts 15,000 tokens of key insights, and the synthesis agent produces a coherent 3,000-token\nnarrative draft, the coordinator must pass context to the report-generation agent for the final output with\nproper source citations.\n\nWhat context-passing strategy provides the best balance of completeness and efficiency?"
    },
    "options": [
      {
        "en": "Pass the synthesis draft together with a structured source index that maps key claims to their source\nURLs and relevant excerpts."
      },
      {
        "en": "Pass the full accumulated context from all prior agents."
      },
      {
        "en": "Pass only the synthesis draft and have a separate post-processing pipeline match claims to sources and\ninsert citations after the report is generated."
      },
      {
        "en": "Pass a condensed summary of all prior stages that preserves the main findings and attributes them to\nsources by name only."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A gives the report generator the finished narrative context plus the evidence required to verify and cite\nits claims. The 3,000-token synthesis draft supplies organization and conclusions, while the source index\npreserves URLs, supporting excerpts, and claim-to-source mappings without transferring 120,000 tokens of\nraw search material. Anthropic’s effective context-engineering guidance recommends curating the smallest\nhigh-signal context and having subagents return condensed, distilled results rather than flooding later stages\nwith their complete working history. Anthropic’s citation guidance likewise depends on retaining specific\nsupporting passages and source locations. Option B is complete but inefficient and introduces context\npollution that can reduce attention to relevant evidence. Option C separates citation insertion from the\nreasoning that produced the claims, making incorrect or unsupported matches more likely. Option D retains\nsource names but discards the passages needed to demonstrate that each source actually supports the\nassociated claim. The structured index should use stable source IDs and include only the excerpts necessary\nfor the report’s factual claims, with validation that every cited claim maps to at least one evidence entry."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 110,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates\nto specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one\ngenerates reports. The system researches topics and produces comprehensive, cited reports.\n\nThe coordinator agent has AgentDefinition objects configured for all four specialized subagents, each with\nappropriate descriptions, prompts, and tool restrictions. During testing, you notice that the coordinator\ncorrectly reasons about when to delegate—it generates messages such as, “I’ll ask the web-search agent to\nfind sources on this topic”—but no subagent execution ever occurs. The coordinator then proceeds as if the\ndelegation happened and continues with incomplete information. Logs show no errors.\n\nWhat is the most likely cause?"
    },
    "options": [
      {
        "en": "The AgentDefinition objects are configured correctly, but the coordinator’s system prompt does not\nexplicitly list the available subagent types, preventing the model from knowing that they can be invoked."
      },
      {
        "en": "Subagent context isolation means task descriptions from the coordinator do not automatically reach\nsubagents; you must configure explicit context forwarding in ClaudeAgentOptions."
      },
      {
        "en": "The coordinator’s allowedTools configuration does not include Agent—formerly named Task—so it\ncannot invoke the tool required to spawn subagents."
      },
      {
        "en": "The coordinator’s max_tokens setting is too low, causing the subagent tool invocation to be truncated\nbefore the subagent type can be specified."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C matches the distinction between reasoning about delegation and executing it. Defining subagents\nmakes their descriptions available for selection, but the coordinator must still invoke the SDK’s subagent-\n\nspawning tool. Current Claude Agent SDK documentation calls this the Agent tool; Task was its earlier name\nand remains relevant to older SDK configurations. Anthropic’s Subagents in the SDK documentation instructs\ndevelopers to include Agent in allowedTools so subagent invocations are approved automatically. Without\nthat permission, an invocation can fall through to a permission callback or be denied under a non-interactive\npermission mode. Option A is unlikely because the configured subagent descriptions already tell Claude when\neach agent should be selected, although explicit prompting can improve invocation reliability. Option B\nmisstates context isolation: context must be included in the spawning prompt, but that issue occurs after an\ninvocation is attempted and does not explain the absence of all subagent executions. Option D would\nnormally produce truncation evidence or incomplete output rather than consistent verbal promises with no\ntool call. The configuration should therefore permit Agent, explicitly request delegation where necessary, and\nlog subagent invocation events."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 111,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and\nmaintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.\n\nYour schema includes a skills: string[] field. Production monitoring reveals three consistency issues: (1)\ncompound phrases like “Python and SQL” are sometimes kept as one entry, sometimes split; (2) implied but\nunstated skills occasionally appear in extractions; (3) similar documents produce wildly different array\nlengths (5-10 vs 40+ entries). Your prompt currently says “Extract all skills mentioned.”\n\nWhat’s the most effective improvement?"
    },
    "options": [
      {
        "en": "Enrich the schema to {skill: string, confidence: float, source_quote: string}[] to capture extraction\nmetadata."
      },
      {
        "en": "Add few-shot examples demonstrating compound phrase handling, explicit mention criteria, and\nappropriate entry granularity."
      },
      {
        "en": "Add constraints: “Extract 10-20 skills maximum, one skill per entry, only explicitly named skills.”"
      },
      {
        "en": "Add post-extraction normalization that maps skills to a canonical taxonomy and deduplicates similar\nentries."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "The failure is caused by an underspecified extraction policy rather than an inadequate JSON structure.\n“Extract all skills mentioned” does not define whether coordinated phrases should be split, whether inferred\ncapabilities qualify, or what level of specificity constitutes one skill. Few-shot examples can demonstrate all\nthree decisions using concrete inputs and expected outputs.\n\nAnthropic identifies examples as one of the most effective ways to improve output accuracy and consistency\nbecause they communicate behavior more precisely than abstract instructions alone. Representative examples\n\ncan show that “Python and SQL” becomes two entries, that an unstated skill must not be inferred from a job\ntitle, and that broad descriptions should not be decomposed into dozens of speculative micro-skills. (\nhttps://docs.anthropic.com/en/docs/about-claude/use-case-guides/ticket-routing )\n\nOption A adds provenance and confidence metadata but does not define the correct extraction granularity.\nOption C addresses explicitness and splitting, but the arbitrary 10–20 limit can truncate documents containing\nmore than 20 legitimate skills or force padding when fewer than 10 appear. Option D is useful for\ncanonicalization and deduplication, but post-processing cannot reliably remove plausible implied skills or\ndetermine how the original phrase should have been interpreted.\n\nThe strongest prompt should combine explicit rules with diverse few-shot examples covering normal cases,\ncompound phrases, implied information, duplicates, and unusually long or short skill lists.\n\nOfficial references/topics: Few-Shot Prompting, Output Consistency, Explicit Extraction Criteria,\nRepresentative Examples."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 112,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JSON schemas, and maintains high accuracy. It must\nhandle edge cases gracefully and integrate with downstream systems.\n\nYour invoice extraction uses tool use with strict JSON schemas. JSON syntax errors never occur, but 12% of\nextractions fail semantic validation—for example, line-item amounts do not sum to the extracted total, or\nvendor IDs do not match valid formats. These failures currently route to manual review.\n\nWhat is the most effective approach to reduce manual-review volume while maintaining accuracy?"
    },
    "options": [
      {
        "en": "Implement post-processing logic that automatically corrects common errors, such as recalculating totals\nfrom line items when sums do not match."
      },
      {
        "en": "When validation fails, make a follow-up request containing the document, extraction, and validation\nerrors so the model can correct the result."
      },
      {
        "en": "Retry the extraction up to three times when validation fails, accepting the first result that passes\nvalidation."
      },
      {
        "en": "Add stricter schema constraints with detailed field descriptions to prevent the model from initially\ngenerating invalid values."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B creates a targeted correction loop using information the first extraction did not have: the validator’s\nprecise failure report. Anthropic’s prompting guidance describes prompt chaining as appropriate when an\napplication must inspect intermediate output or enforce a specific pipeline, with self-correction following the\npattern generate, review against criteria, and refine. Here, deterministic validators identify arithmetic\nmismatches and invalid vendor-ID formats. Returning the source document, original extraction, and explicit\nerrors lets Claude revise only the defective fields while preserving valid data. The corrected record must then\n\nbe validated again before acceptance, with a bounded retry count and human-review fallback. Option A is\nunsafe because automatically recalculating a total may overwrite the amount actually printed on the invoice; a\nmismatch can originate in an OCR or line-item extraction error. Option C repeats the same extraction without\nexplaining what failed, wasting calls and relying on chance. Option D may prevent some format violations,\nbut JSON Schema cannot express every cross-field arithmetic relationship or external vendor-registry rule. A\nvalidator-guided second pass therefore reduces manual review without silently changing source facts, while\nkeeping deterministic code—not the model—as the final acceptance authority."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 113,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline.\nThe system runs automated code reviews, generates test cases, and provides feedback on pull requests. You\nneed to design prompts that provide actionable feedback and minimize false positives.\n\nYour CI pipeline performs security-focused code reviews on approximately 50 pull requests daily, currently\ncosting $150 per day using the synchronous API. Reviews are non-blocking—developers merge after tests\npass and address findings in follow-up commits. You are evaluating the Message Batches API for its 50%\ncost reduction.\n\nWhat factor most determines whether batch processing is appropriate for this use case?"
    },
    "options": [
      {
        "en": "Whether reducing per-review latency from 30–60 seconds to near-instant matters for your workflow."
      },
      {
        "en": "Whether your result-processing system can handle reviews arriving in a different order from the order\nin which they were submitted."
      },
      {
        "en": "Whether review feedback arriving up to 24 hours after pull-request creation remains actionable."
      },
      {
        "en": "Whether you can structure each review as a single request without multi-turn refinement."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C identifies the fundamental trade-off introduced by batch processing: lower cost in exchange for\nasynchronous completion and potentially substantial latency. Anthropic states that most Message Batches\ncomplete within one hour, but results may become available only when all requests finish or after 24 hours,\nwhichever occurs first. Therefore, the workflow must remain useful even if security findings arrive\nconsiderably later than they would through synchronous requests.\n\nThe reviews are explicitly non-blocking, so batch processing can be suitable if developers can still act on\ndelayed findings through follow-up commits. Option B describes an implementation requirement because\nbatch results may be returned out of submission order, but Anthropic provides a deterministic solution\nthrough each request’s unique custom_id. Option A incorrectly focuses on near-instant feedback, which batch\nprocessing does not provide. Option D is not decisive because batches support independent Messages API\nrequests containing system prompts, tool use, and multi-turn conversation content. The primary decision is\ntherefore whether the maximum practical feedback delay is acceptable to the development workflow.\nAnthropic Message Batches documentation"
    },
    "sourceLanguage": "en"
  },
  {
    "id": 114,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and\nmaintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.\n\nTesting reveals that when source documents are missing certain specifications, the model fabricates plausible-\nsounding values to satisfy your schema’s required fields. For example, a document mentioning only\ndimensions receives a fabricated “weight: 2.3 kg” in the extraction output.\n\nWhat schema design change most effectively addresses this hallucination behavior?"
    },
    "options": [
      {
        "en": "Add explicit instructions to the prompt stating “only extract information explicitly stated in the\ndocument; use placeholder text for missing values.”"
      },
      {
        "en": "Change fields that may not exist in source documents from required to optional, allowing the model to\nomit them."
      },
      {
        "en": "Add a “confidence” field alongside each specification where the model self-reports its certainty, then\nfilter out low-confidence extractions."
      },
      {
        "en": "Implement semantic validation that verifies each extracted value appears in or can be inferred from the\nsource document text."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "The schema is creating a structural incentive for fabrication. When a field is declared required, the output\nmust contain a value even when the source document contains no corresponding evidence. Structured Outputs\ncan guarantee that Claude’s response conforms to a JSON Schema, but schema conformance does not\nestablish that every generated value is factually supported. Anthropic’s documentation shows that the required\narray determines which properties must be present; therefore, source-dependent properties that may\nlegitimately be absent should not be included as required fields. ( https://platform.claude.com/docs/en/build-\nwith-claude/structured-outputs )\n\nOption B corrects the problem at the contract level. Claude can omit the unavailable property rather than\ninventing content merely to produce valid JSON. A nullable representation could also be used when\ndownstream systems require a stable key set, but forcing an unsupported non-null value is architecturally\nunsound.\n\nOption A still requires placeholder generation and does not resolve the mismatch between the schema and\navailable evidence. Option C relies on model-generated confidence, which is not a substitute for grounding.\nOption D is a useful secondary control, but it does not constitute the requested schema-design change.\nAnthropic recommends allowing uncertainty and requiring factual claims to be grounded in the provided\nmaterial. ( https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations )\n\nOfficial references/topics: Structured Outputs—JSON Schema design; Reduce Hallucinations—allowing\nuncertainty and grounding claims."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 115,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "Users report that final reports sometimes lack depth on specific subtopics. Investigation shows that the\ndocument-analysis agent frequently identifies evidence gaps—for example, noting that “the retrieved sources\ndiscuss API authentication but lack details about token-refresh patterns.” Under the current strict pipeline, this\ninsight is not actionable because searching has already finished. What is the most effective architectural\nchange?"
    },
    "options": [
      {
        "en": "Add a research-planning agent before the initial search phase to decompose every topic into detailed\nsubquestions."
      },
      {
        "en": "Have the synthesis agent assign confidence scores to each report section and flag insufficiently\nsupported sections for manual review."
      },
      {
        "en": "Require the analysis agent to return specific evidence gaps to the coordinator, which launches targeted\nsearches and invokes analysis again until the defined coverage criteria are satisfied."
      },
      {
        "en": "Have the coordinator look for general gap indicators in the analysis output and run additional searches\nwithout repeating the analysis stage."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C converts the linear pipeline into a controlled iterative research loop. The document-analysis agent is\nbest positioned to identify precisely what the retrieved evidence fails to answer. It should return structured\ngaps containing the missing question, evidence already examined, preferred source characteristics, and the\ncoverage criterion that remains unsatisfied. The coordinator can then issue focused searches and resubmit the\nnew material for analysis.\n\nAnthropic’s multi-agent research architecture uses a lead agent to decompose work, coordinate research\nagents, assess returned information, and continue investigation when further evidence is required. The\nguidance also stresses clear objectives, output formats, source requirements, and task boundaries to prevent\ngaps and duplicated work.\n\nOption A may improve initial coverage but cannot anticipate every deficiency revealed only after sources are\nexamined. Option B documents incompleteness rather than correcting it. Option D retrieves more information\nbut does not ensure that the new evidence is analyzed and tested against the original gap. The loop in Option\nC establishes an explicit completion condition and preserves specialization: analysis identifies the gap, the\ncoordinator orchestrates, search agents retrieve evidence, and analysis verifies whether the gap has actually\nbeen closed."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 116,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "Production monitoring shows that the research phase takes longer than expected. Analysis reveals that the\ncoordinator invokes the web-search subagent, waits for its response, and then invokes the document-analysis\nsubagent. These tasks are independent; neither requires the other’s output. How should you modify the system\nto run these subagents concurrently?"
    },
    "options": [
      {
        "en": "Structure the coordinator to emit both Agent tool calls—for web search and document analysis—in a\nsingle response message instead of separate conversation turns."
      },
      {
        "en": "Switch both subagents from a Sonnet-tier model to a Haiku-tier model to reduce their individual\nexecution times."
      },
      {
        "en": "Add instructions explaining the performance benefits of parallel execution and request that the\ncoordinator invoke both subagents simultaneously."
      },
      {
        "en": "Create an asynchronous orchestration layer that launches parallel threads, each running a separate\ncoordinator-subagent pair, and then aggregates the results."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A exposes both independent invocations in the same assistant turn, allowing the Agent SDK or\napplication tool runner to execute them concurrently. The coordinator can then receive both results together\nand continue with synthesis only after the independent research branches have completed.\n\nAnthropic’s parallel tool-use documentation explains that a response may contain multiple tool-use blocks.\nIndependent, read-only operations can be executed concurrently to reduce latency, after which all\ncorresponding tool results should be returned together. The term “Agent” is used here because current Claude\nAgent SDK releases renamed the earlier “Task” tool.\n\nOption B may shorten individual execution but does not eliminate the sequential waiting pattern and could\nreduce research quality. Option C expresses the desired behavior but does not correct an orchestration\nimplementation that processes only one tool call per turn. Option D introduces unnecessary coordinators,\nduplicated context, and substantially more complex state management. A single coordinator issuing both\nindependent Agent calls preserves centralized monitoring and result association while removing the avoidable\nserial dependency. The runtime must process every returned tool call concurrently rather than stopping after\nthe first one."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 117,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are using Claude Code to accelerate software development. Your team uses it for code generation,\nrefactoring, debugging, and documentation. You need to integrate it into your development workflow with\ncustom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct\nexecution.\n\nYou’re implementing a complex graph traversal algorithm with specific performance requirements and edge\ncases to handle (disconnected nodes, cycles, weighted edges). You want to structure your workflow for\nefficient iterative refinement with Claude.\n\nWhat approach will most effectively enable progressive improvement across multiple iterations?"
    },
    "options": [
      {
        "en": "Have Claude extensively research the algorithm and create a detailed implementation plan using\nextended thinking, then implement the complete solution based on that plan."
      },
      {
        "en": "Provide Claude with a reference implementation from documentation, then ask it to rewrite the code to\nmatch your codebase style and add the required edge case handling, comparing outputs against the\nreference."
      },
      {
        "en": "Write a test suite covering expected behavior, edge cases, and performance requirements before\nimplementation. Ask Claude to write code that passes the tests, then iterate by sharing test failures with\neach refinement request."
      },
      {
        "en": "Provide Claude with a detailed natural language specification of the algorithm, including all\nrequirements and edge cases. Review each output manually and provide descriptive feedback on what\nbehavior needs to change."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C creates an objective verification loop. The tests encode expected traversal behavior for disconnected\ngraphs, cycle handling, weighted edges, invalid inputs, and performance constraints. Claude can implement\nthe algorithm, execute the suite, inspect concrete failures, and refine the implementation until the measurable\nconditions pass.\n\nAnthropic emphasizes giving Claude a verification mechanism such as tests, builds, linters, or fixture\ncomparisons. Without an executable pass-or-fail check, Claude can only determine that an implementation\nappears complete. With tests, it can perform work, evaluate the result, and iterate using evidence rather than\nsubjective judgment. Anthropic also recommends reproducing defects with failing tests before applying\ncorrections. ( https://code.claude.com/docs/en/best-practices )\n\nOption A may produce a thoughtful initial design but does not guarantee progressive improvement after\nimplementation. Option B risks inheriting assumptions or deficiencies from a reference that may not match\nthe project’s constraints. Option D depends on manual review and converts the developer into the primary\nverification system.\n\nThe test suite should include correctness fixtures, boundary cases, complexity-sensitive workloads, and\nregression tests added whenever a new failure is discovered. This makes every iteration cumulative: a\ncorrection must satisfy the new case without breaking previously validated behavior.\n\nOfficial references/topics: Executable Verification; Test-Driven Iteration; Feedback Loops; Regression\nTesting."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 118,
    "domain": "mcp",
    "category": "Tool Design and MCP Integration",
    "prompt": {
      "en": "During testing, when a customer says, “I need a refund for my recent purchase,” the agent immediately\ninvokes process_refund but populates the required order_id parameter with a plausible-looking fabricated\nvalue instead of first calling lookup_order. The refund fails because the invented order identifier does not\nexist. Which change directly addresses the root cause of the fabricated order_id?"
    },
    "options": [
      {
        "en": "Update the process_refund tool description to state explicitly that order_id must come from a successful\nlookup_order result and must never be assumed, inferred, or invented."
      },
      {
        "en": "Change tool_choice from auto to any so Claude must call a tool on every turn."
      },
      {
        "en": "Add server-side validation that checks whether order_id exists before attempting the refund and returns\nan error when it does not."
      },
      {
        "en": "Preprocess customer messages to extract any mentioned order identifiers and inject them into the\nconversation before sending the request to Claude."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A corrects the missing tool contract that permits Claude to guess a required parameter. The\nprocess_refund description should state its prerequisite explicitly: invoke lookup_order, use only the exact\norder_id returned by that successful call, and ask for additional identifying information when lookup cannot\nresolve an order. An input example can demonstrate the correct two-tool sequence.\n\nAnthropic’s tool-definition guidance identifies detailed descriptions as the most important factor in tool\nperformance. Descriptions should explain when a tool should and should not be used, what every parameter\nmeans, and all important limitations. The tool-use overview confirms that Claude selects and populates tools\nbased on the request and their descriptions.\n\nOption B forces some tool call but does not tell Claude which tool must run first or where the identifier\noriginates. Option C is an essential defence-in-depth control, but it detects the fabricated value after Claude\nhas already made the incorrect decision. Option D works only when the customer supplies an identifier and\ndoes not cover “recent purchase.” Explicit prerequisite and provenance instructions directly prevent the model\nfrom inventing the required argument."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 119,
    "domain": "mcp",
    "category": "Tool Design and MCP Integration",
    "prompt": {
      "en": "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-\nambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems\nthrough custom Model Context Protocol (MCP) tools ( get_customer , lookup_order , process_refund ,\nescalate_to_human ). Your target is 80%+ first-contact resolution while knowing when to escalate.\n\nYour process_refund tool returns two types of errors: technical errors (“503 Service Unavailable”,\n“Connection timeout”) that are transient (~5% of calls), and business errors (“Order exceeds 30-day return\nwindow”, “Item already refunded”) that are permanent (~12% of calls). Monitoring shows the agent wastes 3–\n4 turns retrying business errors that can never succeed. Currently, both error types return only a plain text\nmessage to Claude.\n\nWhat’s the most effective way to reduce wasted retries while improving customer-facing response quality?"
    },
    "options": [
      {
        "en": "Implement automatic retry logic at the tool layer for technical errors only, passing business errors to\nClaude without retries."
      },
      {
        "en": "Add few-shot examples showing how to distinguish retriable from non-retriable errors by parsing error\nmessage text."
      },
      {
        "en": "Add a check_refund_eligibility tool that must be called before process_refund to prevent business rule\nviolations."
      },
      {
        "en": "Return structured error responses with \" retriable \" : false for business errors and a customer-friendly\nexplanation for Claude to use."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "The error response must explicitly communicate both control semantics and user-facing meaning. Setting \"\nretriable \" : false tells the agent that repeating the same operation cannot change the outcome. Providing a\ncustomer-friendly explanation allows Claude to respond accurately without exposing internal implementation\ndetails or inventing its own interpretation of the business rule.\n\nAnthropic recommends returning failed tool operations with an error indicator and sufficiently informative\ncontent so Claude can decide whether to retry, request another input, or explain the limitation. Tool interfaces\nshould provide detailed descriptions and structured parameters rather than forcing Claude to infer operational\nbehavior from ambiguous text. ( https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-\nusing-agent?utm_source=chatgpt.com )\n\nOption A appropriately limits automatic retries to technical failures, but it does not solve the stated customer-\nresponse problem unless business failures also carry clear semantics. Option B relies on fragile parsing of\nhuman-readable messages. Option C adds latency and another tool dependency, and eligibility may still\nchange or fail for reasons not covered by the preliminary check.\n\nA complete schema should identify the error code, category, retryability, customer-safe explanation, and\npermitted next actions. Technical errors can similarly return \" retriable \" : true with retry guidance and a\nmaximum-attempt policy.\n\nOfficial references/topics: Structured tool errors, retryability classification, customer-safe explanations,\nresilient MCP contracts."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 120,
    "domain": "mcp",
    "category": "Tool Design and MCP Integration",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and\nmaintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.\n\nYour pipeline uses a tool called extract_metadata with a JSON schema for paper details. You’ve also defined\nlookup_citations and verify_doi tools for enrichment. During testing, you notice that when users include\nrequests like “extract the metadata and tell me how cited it is,” Claude sometimes calls lookup_citations first,\nwhich fails because it needs the DOI that extract_metadata would provide.\n\nWhat’s the most effective way to ensure structured metadata extraction happens first?"
    },
    "options": [
      {
        "en": "Set tool_choice to { \" type \" : \" tool \" , \" name \" : \" extract_metadata \" } and process the enrichment\nrequests in subsequent turns after receiving the extracted metadata."
      },
      {
        "en": "Set tool_choice to \" auto \" and reorder the tool definitions so extract_metadata appears first in the tools\narray, since Claude prioritizes earlier-listed tools."
      },
      {
        "en": "Set tool_choice to { \" type \" : \" tool \" , \" name \" : \" extract_metadata \" } for every API call in the\npipeline, ensuring Claude always extracts metadata before any enrichment can occur."
      },
      {
        "en": "Set tool_choice to \" any \" so Claude must use a tool, combined with system prompt instructions\nprioritizing extract_metadata ."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "The dependency must be enforced by orchestration rather than left to probabilistic tool selection. Anthropic\ndocuments that tool_choice: { \" type \" : \" tool \" , \" name \" : \" ... \" } forces Claude to invoke the specified tool.\nBy contrast, auto allows Claude to decide whether and which tool to call, while any requires some tool but\ndoes not force a particular one. ( https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools )\n\nOption A therefore establishes a deterministic two-stage workflow. The first API turn forces extract_metadata\n, producing the DOI and other structured paper details. The application validates and stores that result. A\nsubsequent turn then exposes or permits verify_doi and lookup_citations , passing the extracted DOI as\nexplicit state. This design converts an implicit tool dependency into an application-controlled execution graph.\n\nOption B is incorrect because array order is not a documented precedence mechanism and cannot guarantee\nselection. Option C forces extract_metadata on every call, including turns where enrichment should occur,\npotentially creating an infinite or non-progressing workflow. Option D guarantees only that one available tool\nis called; Claude could still select lookup_citations before the DOI exists.\n\nFor stronger input integrity, the tools can also use strict schemas so their arguments conform to the declared\nJSON Schema. The sequencing requirement, however, remains the responsibility of the orchestration layer.\n\nOfficial references/topics: Tool Choice; Forced Tool Invocation; Multi-Turn Tool Orchestration; Tool\nDependency Management."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 121,
    "domain": "mcp",
    "category": "Tool Design and MCP Integration",
    "prompt": {
      "en": "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-\nambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems\nthrough custom Model Context Protocol (MCP) tools ( get_customer , lookup_order , process_refund ,\nescalate_to_human ). Your target is 80%+ first-contact resolution while knowing when to escalate.\n\nProduction logs reveal inconsistent error handling: when lookup_order fails, the agent sometimes retries 5+\ntimes (wasteful when the order ID doesn’t exist), sometimes escalates immediately (premature for temporary\nnetwork issues), and sometimes asks users for clarification (inappropriate when the issue is a backend\npermission error). Investigation shows your MCP tool returns uniform error responses: { \" isError \" : true, \"\ncontent \" : [{ \" type \" : \" text \" , \" text \" : \" Operation failed \" }]} . The agent cannot distinguish between error\ntypes.\n\nWhat’s the most effective improvement?"
    },
    "options": [
      {
        "en": "Enhance error responses with structured metadata—include error_category (transient/validation\n/permission), isRetryable boolean, and a description of what caused the failure."
      },
      {
        "en": "Implement retry logic with exponential backoff in your MCP server for all errors, returning to the agent\nonly after retries are exhausted."
      },
      {
        "en": "Create an analyze_error MCP tool the agent calls after any failure to determine the error category and\nrecommended action."
      },
      {
        "en": "Add few-shot examples to the system prompt demonstrating how to interpret error message patterns and\nselect appropriate responses for each."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "The agent is behaving inconsistently because every failure is represented identically. “Operation failed”\ncontains no information about permanence, user correctability, authorization, or whether another attempt is\nlikely to succeed. Adding structured fields converts the error into an actionable interface contract.\n\nAnthropic instructs tool implementations to mark failures using an error flag and return information Claude\ncan use to retry with corrected input, ask for clarification, or explain a limitation. Tool design should expose\nsufficient detail for the model to choose the correct next action rather than forcing it to infer the cause from a\ngeneric message. ( https://platform.claude.com/docs/en/agents-and-tools/tool-use/build-a-tool-using-agent?\nutm_source=chatgpt.com )\n\nWith error_category , isRetryable , and a causal description, the agent can retry transient network failures,\nrequest corrected identifiers for validation errors, and escalate or report permission failures without pointless\nrepetitions. Option B retries permanent validation and permission failures unnecessarily. Option C adds\nanother tool call and failure point merely to classify information the original tool already possesses. Option D\nrelies on parsing variable text and examples rather than providing explicit machine-readable semantics.\n\nThe tool should preserve isError: true , return a stable structured error object, include a safe customer-facing\nmessage where appropriate, and avoid exposing internal secrets or stack traces.\n\nOfficial references/topics: MCP error contracts, actionable tool results, retryability metadata, agent-\ncomputer interface design."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 122,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and\nmaintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.\n\nThe system needs to extract candidate information (name, contact details, skills, work experience, education)\nfrom uploaded resumes. The extracted data must strictly conform to a predefined JSON schema, as missing\nrequired fields or incorrect data types will cause downstream validation failures.\n\nWhat is the most reliable approach to ensure Claude’s output consistently matches the schema?"
    },
    "options": [
      {
        "en": "Parse Claude’s text response with regex patterns to extract JSON objects, using retry logic for\nmalformed responses."
      },
      {
        "en": "Include detailed JSON formatting instructions and a template example in the system prompt, asking\nClaude to output only valid JSON."
      },
      {
        "en": "Make two separate API calls—first extracting information as text, then asking Claude to format that\ntext as JSON."
      },
      {
        "en": "Define a tool with an input schema matching your required JSON structure and extract the data from\nClaude’s tool_use response."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "A schema-defined tool provides a structured interface between Claude and the application. The tool’s\ninput_schema can declare required properties, nested work-experience and education objects, arrays of skills,\nand exact data types. Claude then supplies the extracted resume information as tool-call arguments, which the\napplication can read directly from the tool_use response.\n\nAnthropic’s tool documentation specifies that a custom tool definition includes a JSON Schema object\ndescribing its expected parameters. Current strict tool use can additionally enforce that generated tool\narguments match the declared schema exactly. This removes the need to locate JSON inside free-form text or\ndepend on post-generation repair. ( https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/implement-\ntool-use )\n\nOption A is fragile because regular expressions do not provide a robust parser for arbitrary nested JSON and\ncannot correct missing properties or incorrect types. Option B improves formatting behavior but remains\nprobabilistic. Option C doubles latency and creates two opportunities for information loss: first during\nextraction and again during reformatting.\n\nIn a production design, fields that may genuinely be absent from a resume should be optional or nullable\nrather than forcing invented values. The tool schema should also use strict: true where supported. Among the\navailable choices, D provides the strongest structural guarantee and the cleanest downstream integration.\n\nOfficial references/topics: Tool Use Responses, Input Schemas, Strict Tool Use, Nested Structured\nExtraction."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 123,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are building developer-productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools—Read, Write, Bash, Grep, and Glob—and integrates with Model Context\nProtocol (MCP) servers.\n\nYour agent needs to insert a new helper function into the middle of a 150-line utility module, between two\nexisting functions. The Edit tool fails because its old_string parameter cannot find unique text to match—the\nfile has repetitive docstrings, variable names, and structural patterns.\n\nWhat is the most reliable way to complete this insertion?"
    },
    "options": [
      {
        "en": "Use Edit’s replace_all parameter to target a common pattern and embed the new function in the\nreplacement text."
      },
      {
        "en": "Use Bash to append the function definition to the end of the file using heredoc syntax."
      },
      {
        "en": "Use Read to load the file, add the function at the appropriate location, and then use Write to overwrite\nthe file with the updated content."
      },
      {
        "en": "Use Edit with an extremely long old_string capturing more than 30 lines of context to guarantee\nuniqueness."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "Option D is the closest match to Claude Code’s documented editing procedure. The Claude Code tools\nreference explains that Edit performs exact string replacement and requires old_string to appear exactly once.\nWhen the text occurs multiple times, the prescribed response is to include sufficient surrounding context to\nidentify one occurrence uniquely. For this insertion, the match should span a distinctive boundary between the\npreceding function and the following function. It does not literally need 30 lines; it needs the smallest exact\nblock that is demonstrably unique, but option D is the only answer expressing that method.\n\nOption A would modify every occurrence of a repeated pattern and could insert the helper function multiple\ntimes. Option B places the function at the end rather than at the required architectural location. Option C can\ntechnically work, but Write replaces the complete file and increases the change surface. Anthropic explicitly\nstates that Write creates or overwrites full files, while partial modifications should use Edit. A targeted,\nuniquely anchored Edit preserves all unrelated content and produces a smaller, safer diff."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 124,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and\nmaintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.\n\nThe system routes documents with extraction confidence below 85% to human review. A quarterly audit\nreveals that 12% of high-confidence extractions (#85%) also contain errors—cases where the model finds\nplausible-but-incorrect values. Error sources vary: comparison tables showing competitor specs, appendices\nreferencing different product variants, and ambiguous phrasing the model misinterprets. You need a\nsustainable strategy to catch these high-confidence errors and measure whether improvements reduce the error\nrate over time.\n\nWhat approach is most effective?"
    },
    "options": [
      {
        "en": "Add a verification pass that re-extracts from each high-confidence document, flagging cases where the\ntwo extraction attempts produce different results."
      },
      {
        "en": "Implement heuristic rules that flag documents containing comparison tables or appendices for review\nregardless of confidence score."
      },
      {
        "en": "Lower the confidence threshold from 85% to 70%, routing a larger volume of extractions to human\nreview."
      },
      {
        "en": "Implement stratified random sampling reviewing a fixed percentage of high-confidence extractions\nweekly, enabling error rate measurement and novel pattern detection."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "Stratified random sampling provides both an ongoing quality-control mechanism and an unbiased\nmeasurement framework. By reviewing a fixed proportion of high-confidence outputs across meaningful\nstrata—such as document type, field, source format, and business risk—the organization can estimate the\nresidual error rate, compare performance across releases, and discover failure patterns that were not\nanticipated when existing rules were designed.\n\nAnthropic recommends measurable success criteria and evaluations that mirror the real-world task\ndistribution, including edge cases. Evaluation volume and repeatability are important because improvements\nmust be demonstrated empirically rather than inferred from isolated examples. ( https://docs.anthropic.com/en\n/docs/build-with-claude/develop-tests ) A weekly sampling program creates a stable benchmark and allows\nconfidence intervals, trend analysis, regression detection, and error-taxonomy updates.\n\nOption A detects only disagreements between stochastic extractions. Two attempts may produce the same\nplausible but incorrect answer, so agreement is not equivalent to factual correctness. Option B addresses\nknown patterns but will miss new failure modes and may generate excessive false positives. Option C actually\nlowers the review threshold in the wrong direction: documents between 70% and 85% would be treated as\nautomated rather than reviewed if the routing rule remains “below threshold,” and changing thresholds alone\ndoes not measure high-confidence error prevalence.\n\nOfficial references/topics: Evaluation Design; Representative Test Distributions; Continuous Reliability\nMeasurement; Human-in-the-Loop Sampling."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 125,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline.\nThe system runs automated code reviews, generates test cases, and provides feedback on pull requests. You\nneed to design prompts that provide actionable feedback and minimize false positives.\n\nDuring initial testing of the automated review pipeline, you notice that reviews on large pull requests\ncontaining more than 50 changed files sometimes take over 20 minutes and cost $8–$12 per run because of\nextensive agentic loops. Claude reads files, runs analysis tools, and iterates many times. Your team needs\neach invocation to abort once it reaches both a fixed iteration count and a fixed dollar amount, enforced by\nClaude Code itself rather than by the surrounding job runner.\n\nWhich configuration change directly enforces both per-invocation caps?"
    },
    "options": [
      {
        "en": "Switch the --model flag to a smaller, less expensive model so each iteration uses fewer tokens and has a\nlower per-call cost."
      },
      {
        "en": "Set timeout-minutes: 5 on the GitHub Actions job step and monitor per-run costs through the Anthropic\nConsole usage dashboard."
      },
      {
        "en": "Add --max-turns 10 --max-budget-usd 2.00 to the claude -p invocation to cap iterations and spending."
      },
      {
        "en": "Set --permission-mode dontAsk to automatically deny tool-permission requests not included in the\nexplicitly allowed set."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C applies the two native stopping controls required by the question. Anthropic’s Claude Code CLI\nreference defines --max-turns as the maximum number of agentic turns permitted in print mode and --max-\nbudget-usd as the maximum API expenditure for that invocation. When the turn limit is reached, the run exits\nwith an error. Spending by subagents counts toward the budget cap, and current Claude Code versions stop\nremaining background subagents when the limit is reached. These flags therefore control the complete\ninvocation rather than merely one model request.\n\nOption A lowers expected cost per iteration but establishes no hard ceiling on either iterations or total\nexpenditure. Option B limits wall-clock execution at the CI-runner level and only observes spending\nretrospectively; it does not enforce a Claude Code budget. Option D controls permission behavior, not\niteration count, execution time, or token spending. The pipeline should use both flags, capture the resulting\nnonzero exit or structured error status, and report whether a review ended normally or was terminated by a\nconfigured operational limit."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 126,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline.\nThe system runs automated code reviews, generates test cases, and provides feedback on pull requests. You\nneed to design prompts that provide actionable feedback and minimize false positives.\n\nYour automated reviewer uses a single prompt covering security issues, API design, and business-logic\ncorrectness. Your evaluation suite shows strong recall for API-design findings at 82% but poor recall for\nbusiness-logic edge cases in quiz scoring at 34%. When you add few-shot examples of logic bugs to the\nprompt, logic recall improves to 41%, but API-design recall drops to 68%.\n\nHow should you address this trade-off to improve detection across both categories?"
    },
    "options": [
      {
        "en": "Split the review into separate focused prompts—one for security and API design and another for\nbusiness logic—each with dedicated examples, and then consolidate the findings before posting."
      },
      {
        "en": "Replace the few-shot examples with a detailed checklist of specific logic edge cases to verify, such as\ndivision by zero in score calculations and boundary conditions in grading thresholds."
      },
      {
        "en": "Upgrade to a more capable model tier because its stronger reasoning will handle both concern types in\none prompt and eliminate the recall trade-off."
      },
      {
        "en": "Provide the full repository as context instead of only the changed files and surrounding code, giving the\nmodel deeper visibility into business-logic patterns."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A separates competing objectives so each review call can devote its attention and examples to a\ncoherent concern. Anthropic’s Building Effective AI Agents describes sectioning as a parallelization pattern\nin which independent aspects are handled by separate model calls and then aggregated. It specifically notes\nthat models generally perform better on complex tasks when each consideration receives focused attention.\nThe evaluation results demonstrate prompt interference: optimizing business-logic detection reduces API-\ndesign recall.\n\nA security and API-design reviewer can use examples, terminology, and evidence criteria appropriate to\ninterfaces and vulnerabilities. A business-logic reviewer can focus on state transitions, arithmetic boundaries,\ninvariants, and domain-specific edge cases. Their structured findings can then be deduplicated and ranked\nbefore posting. Option B may improve only the weak category and can overfit to known quiz-scoring failures.\nOption C assumes that model capacity alone removes prompt interference without evaluation evidence.\nOption D adds substantial unrelated context and does not isolate the competing review objectives. The split\nprompts should be evaluated independently and together so consolidation does not reintroduce omissions or\nduplicate findings."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 127,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "A developer uses Claude Code to refactor a function during a development session. Before committing, the\ndeveloper asks the same Claude session to review the code for issues. Later, a separate automated CI review\ncatches several bugs that the same-session review missed. What best explains this discrepancy?"
    },
    "options": [
      {
        "en": "Claude retains context about its prior reasoning in the session, making it less likely to question its own\ndecisions."
      },
      {
        "en": "The CI review uses a more specific prompt tailored to catching bugs, while the developer’s request was\ntoo general."
      },
      {
        "en": "The CI environment has access to the complete codebase, while the local session can see only the\ncurrent file."
      },
      {
        "en": "The extended session caused the context window to fill with conversation history, leaving insufficient\ncapacity for thorough analysis."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "The key difference is reviewer independence. In the original session, Claude retains the reasoning,\nassumptions, implementation decisions, and intermediate conclusions that led to the refactor. That context can\nanchor the subsequent review toward defending or confirming the chosen approach instead of evaluating the\nresulting code independently. The separate CI review begins with fresh context and can assess the\nimplementation solely against the code and review criteria.\n\nAnthropic’s Claude Code best-practices documentation explicitly states that fresh context improves code\nreview because Claude is not biased toward code it has just written. It recommends a writer/reviewer pattern\nusing separate sessions or a review subagent with an isolated context.\n\nOption B is possible in an uncontrolled comparison, but the scenario’s defining distinction is that one review\noccurs in the implementation session and the other is independent. Option C is false because local Claude\nCode can read and search the repository when permissions and tools permit it; it is not inherently restricted to\nthe current file. Option D would require evidence of context saturation, such as degraded instruction\nfollowing or an almost-full context window. No such evidence is supplied. Prior-reasoning bias most directly\nexplains the observed discrepancy."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 128,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "The web-search agent has gathered several relevant sources for a research topic. The document-analysis agent\nnow needs to examine those sources. How does information typically flow between these two specialized\nsubagents?"
    },
    "options": [
      {
        "en": "The coordinator receives the web-search agent’s output and includes the relevant sources and findings\nin the prompt used to invoke the document-analysis agent."
      },
      {
        "en": "The web-search agent directly invokes the document-analysis agent and passes the discovered sources\nas parameters."
      },
      {
        "en": "The agents communicate through an event-driven message queue, with the document-analysis agent\nsubscribing to web-search completion events."
      },
      {
        "en": "Both agents automatically access a shared memory store in which the web-search agent writes its\nfindings."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Option A matches the standard coordinator-managed subagent model. The coordinator invokes the web-\nsearch agent, receives its final result, selects the useful URLs or source records, and then supplies them\nexplicitly when invoking the document-analysis agent. This keeps task ownership, provenance, and execution\norder visible to the coordinator.\n\nThe Claude Agent SDK subagent documentation states that a subagent begins with a fresh context window\nand does not inherit the parent’s conversation history or previous tool results. The information passed through\nthe Agent tool’s prompt is the primary parent-to-subagent context channel. Consequently, the analysis prompt\nmust include the source URLs, documents, retrieval notes, and any questions the analyzer must answer.\n\nOption B requires nested delegation that is neither stated nor necessary and reduces centralized observability.\nOptions C and D describe valid custom architectures only if the application has deliberately implemented a\nqueue or shared memory system; neither is automatic Agent SDK behavior. Coordinator-mediated handoff is\ntherefore the expected approach. For reliability, the handoff should use structured source records rather than\nan informal prose statement, ensuring that the analyzer receives identifiers, provenance, relevant excerpts, and\nanalysis objectives."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 129,
    "domain": "mcp",
    "category": "Tool Design and MCP Integration",
    "prompt": {
      "en": "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates\nto specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one\ngenerates reports. The system researches topics and produces comprehensive, cited reports.\n\nThe document-analysis agent has a single analyze_document tool that takes a document and a free-text\ninstruction parameter. During evaluation, requests such as “extract the key financial metrics” often return\nnarrative summaries, while “summarize the methodology” sometimes returns raw data tables. The synthesis\nagent reports that 35% of analysis results require new requests with clarified instructions.\n\nWhat is the most effective way to improve reliability?"
    },
    "options": [
      {
        "en": "Enhance the tool description with detailed examples showing how different instruction phrasings should\nmap to different output formats."
      },
      {
        "en": "Split the generic tool into purpose-specific tools—extract_data_points, summarize_content, and\nverify_claim_against_source—each with defined input and output contracts."
      },
      {
        "en": "Keep the single tool but add an analysis_type enum parameter requiring explicit selection between\nextraction, summarization, and verification modes."
      },
      {
        "en": "Have the coordinator pre-classify each analysis request before passing instructions to the document-\nanalysis agent."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B removes ambiguity at the tool-interface level. Extraction, summarization, and claim verification are\ndifferent operations with different success criteria and output structures. Separate tools allow each operation\nto have a precise name, purpose, parameter schema, response contract, and error behavior. Anthropic’s\nguidance on writing effective tools for agents recommends a small set of thoughtful tools targeted at specific,\nhigh-impact workflows rather than generic wrappers that force the model to infer operational meaning from\nloosely structured instructions. Tool descriptions and examples, option A, could improve behavior but leave\nthe overloaded free-text contract intact. An analysis_type enum, option C, identifies the requested mode but\nstill requires one tool to return substantially different result structures, increasing validation and downstream\nbranching. Coordinator pre-classification, option D, adds another probabilistic decision without correcting the\ninterface used by the analysis agent. Purpose-specific tools let the synthesis layer know exactly what output it\nwill receive. Their schemas should require relevant fields—for example, data-point names and source\nlocations for extraction, or claim, verdict, and evidence for verification—and should be tested against the\nobserved failure cases."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 130,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol\n(MCP) servers.\n\nYour codebase exploration tool stores session IDs to allow engineers to continue investigations across work\nsessions. An engineer spent an hour yesterday analyzing a legacy authentication module, building context\nabout its architecture and dependencies. They want to continue today. The session ID is valid, but version\ncontrol shows 3 of the 12 files the agent previously read were modified overnight by a teammate’s merge.\n\nWhat approach best balances efficiency and accuracy?"
    },
    "options": [
      {
        "en": "Start a fresh session to ensure the agent works with current codebase state without stale assumptions"
      },
      {
        "en": "Resume the session and inform the agent which specific files changed for targeted re-analysis"
      },
      {
        "en": "Resume the session and immediately have the agent re-read all 12 previously analyzed files"
      },
      {
        "en": "Resume the session without informing the agent about the changed files"
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Resuming preserves the prior architectural analysis, dependency mapping, and conversation history, avoiding\nthe cost of repeating an hour of valid work. Anthropic states that resuming by session ID restores the agent’s\nfull prior context, including files read, analysis performed, and decisions made. ( https://code.claude.com/docs\n/en/agent-sdk/sessions )\n\nHowever, the session represents historical knowledge rather than a repository snapshot. Because three files\nchanged externally, the agent must be told which files are affected and directed to re-read them before relying\non earlier conclusions. Anthropic clarifies that sessions persist the conversation, not the filesystem. (\nhttps://code.claude.com/docs/en/agent-sdk/sessions ) Targeted re-analysis updates the stale portion of the\nagent’s model while retaining the nine unchanged files’ established context.\n\nOption A discards valuable work even though most of the analyzed code remains unchanged. Option C is\naccurate but inefficient because it reprocesses all twelve files regardless of whether they changed. Option D is\nunsafe: the agent may continue reasoning from obsolete function signatures, dependencies, or control flows.\n\nThe continuation prompt should identify the changed files, summarize the merge’s purpose where known, and\nrequest a focused comparison against the earlier understanding. Any architectural conclusions affected by\nthose changes should then be revised explicitly.\n\nOfficial references/topics: Session Resume; Filesystem Versus Conversation State; Targeted Re-Analysis;\nRepository Change Awareness."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 131,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "After deploying the automated review, you notice high precision but low recall—real bugs are slipping\nthrough undetected. Investigation reveals that your review prompt instructs Claude to “only report high-\nconfidence issues you are certain about” and “err on the side of not commenting.” Developers appreciate the\nlow noise, but a race condition that caused a production outage was visible in a reviewed pull request and\nwent unreported. You need to substantially improve bug detection while keeping false-positive rates\nmanageable. What is the most effective approach?"
    },
    "options": [
      {
        "en": "Add detailed few-shot examples demonstrating bug categories Claude should flag—race conditions,\nnull dereferences, and error-handling gaps—while retaining the high-confidence filtering instruction."
      },
      {
        "en": "Remove the conservative instructions and have Claude report every potential issue, then apply a\nprogrammatic filter that deduplicates findings and suppresses historically noisy categories."
      },
      {
        "en": "Split the review into a finding stage whose objective is comprehensive coverage—reporting every\npotential issue with confidence and severity metadata—and a separate stage that verifies and thresholds\nthose findings."
      },
      {
        "en": "Expand the context to include related tests, recent Git history, and the module’s dependency graph so\nClaude has richer evidence for judging severity."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "The prompt’s conservative reporting policy is directly causing the low recall. Claude may discover a\nlegitimate race condition during analysis but suppress it because it cannot satisfy the instruction to report only\n\nissues about which it is certain. Option C separates two objectives that should not be conflated: broad defect\ndiscovery and strict acceptance filtering.\n\nAnthropic’s current code-review prompting guidance explicitly recommends reporting every issue, including\nuncertain or lower-severity findings, assigning confidence and severity metadata, and allowing a separate\nverification stage to filter them. This maximizes recall while retaining control over developer-facing noise.\n\nOption A leaves the suppression policy intact, so additional examples cannot guarantee that discovered\nproblems will be reported. Option B improves recall but relies on historical category-level suppression, which\ncan discard genuine findings that happen to belong to noisy categories. Option D can improve analysis quality\nbut does not remove the instruction responsible for withholding findings. A dedicated finding stage followed\nby an independently configurable verification or thresholding stage produces measurable recall and precision\ncontrols without forcing one model call to optimize competing objectives."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 132,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "When researching “renewable-energy adoption,” the web-search agent returns recent statistics showing 35%\nadoption in 2024, while the document-analysis agent extracts an 18% adoption figure from an internal 2021\nreport. The synthesis agent incorrectly treats the figures as contradictory instead of recognizing that they may\nshow growth over time. What change would best enable the synthesis agent to interpret such temporal\ndifferences correctly?"
    },
    "options": [
      {
        "en": "Require subagents to include publication dates and data-collection periods in their structured outputs."
      },
      {
        "en": "Configure the web-search agent to return only results published during the previous six months."
      },
      {
        "en": "Add a conflict-resolution agent that automatically discards older data whenever a newer value exists for\nthe same metric."
      },
      {
        "en": "Instruct the synthesis agent to treat the newest value as authoritative and place all older findings in a\nseparate historical section."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "The two statistics cannot be compared correctly without temporal metadata. Option A preserves when each\nvalue was measured, not merely when its document was retrieved. The structured record should ideally\ndistinguish publication date, observation period, geographic scope, population, methodology, unit, and metric\ndefinition. The synthesis agent can then determine whether the figures represent a trend, conflicting\nmeasurements of the same period, or incomparable populations.\n\nAnthropic’s multi-agent research guidance emphasizes specifying output formats and source requirements so\ndownstream agents receive the context required for accurate synthesis. Its structured-output capability enables\nthese provenance fields to be required and schema validated.\n\nOption B removes valuable historical evidence and still does not guarantee that returned sources describe the\nsame measurement period. Option C assumes newer automatically means more reliable and could discard an\nauthoritative historical baseline. Option D preserves older material but imposes an interpretation without\n\nexamining whether methodology, geography, or definitions changed. Explicit temporal and methodological\nmetadata allows the synthesis agent to state a defensible conclusion such as apparent growth from 18% in\n2021 to 35% in 2024 while preserving any comparability caveats."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 133,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are using Claude Code to accelerate software development. Your team uses it for code generation,\nrefactoring, debugging, and documentation. You need to integrate it into your development workflow with\ncustom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct\nexecution.\n\nYour infrastructure-as-code repository includes Terraform modules ( /terraform/ ), Kubernetes manifests (\n/kubernetes/ ), and CI/CD pipeline scripts ( /pipelines/ ). Each requires different conventions, but your single\nroot CLAUDE.md has grown to 500+ lines. When developers work on Kubernetes files, Terraform-specific\nrules load into context unnecessarily, consuming tokens.\n\nWhat is the best approach to reorganize so only relevant guidance loads when editing specific file types?"
    },
    "options": [
      {
        "en": "Create files in .claude/rules/ with YAML frontmatter path-scoping (e.g., paths: [ \" terraform/**/*.tf \" ]\n), loading rules only when editing matching files."
      },
      {
        "en": "Restructure the root CLAUDE.md into clearly labeled sections with headers (e.g., “## Terraform\nConventions”), improving organization and readability."
      },
      {
        "en": "Split content into subdirectory CLAUDE.md files ( /terraform/CLAUDE.md , /kubernetes/CLAUDE.\nmd ), so Claude loads directory-specific guidance."
      },
      {
        "en": "Keep the root CLAUDE.md and use @path/to/import syntax to modularly include tool-specific\nguidance files from separate documents."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "Path-scoped rules directly satisfy the requirement that instructions load only when Claude works with\nmatching files. Each infrastructure domain can have a separate Markdown file under .claude/rules/ , with\nYAML paths frontmatter targeting Terraform files, Kubernetes manifests, or pipeline configuration.\n\nAnthropic documents that .claude/rules/ keeps project guidance modular and supports conditional loading\nbased on glob patterns. Rules with a paths field apply only when Claude works with matching files, reducing\nirrelevant context and token consumption. Rules without path frontmatter load unconditionally. ( https://code.\nclaude.com/docs/en/memory )\n\nOption B improves readability but leaves all 500-plus lines in every session. Option C can provide directory-\nspecific CLAUDE.md guidance, but path-scoped rules are more precise when conventions depend on\nextensions or patterns spanning multiple directories. Option D still requires manual imports and does not\nprovide the documented conditional rule-loading mechanism.\n\nA suitable design would use rules such as terraform.md scoped to terraform/**/*.tf , kubernetes.md scoped to\nkubernetes/**/*.{yaml,yml} , and pipelines.md scoped to the pipeline directory. Broad project-wide\ncommands and repository etiquette can remain in the root CLAUDE.md.\n\nOfficial references/topics: .claude/rules/ ; Path-Specific Rules; YAML Frontmatter; Context-Efficient\nInstruction Loading."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 134,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-\nambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems\nthrough custom Model Context Protocol (MCP) tools ( get_customer , lookup_order , process_refund ,\nescalate_to_human ). Your target is 80%+ first-contact resolution while knowing when to escalate.\n\nYou’re implementing the escalation logic for when the agent should call escalate_to_human . Your team\nproposes four different approaches for triggering escalation.\n\nWhich approach will most reliably identify cases that genuinely require human intervention?"
    },
    "options": [
      {
        "en": "Build a rules engine that maps specific issue types, customer segments, and product categories to\nescalation decisions, removing the need for model judgment calls."
      },
      {
        "en": "Instruct the agent to escalate when the customer requests a human, when the issue requires policy\nexceptions, or when the agent cannot make meaningful progress."
      },
      {
        "en": "Configure the agent to escalate after three consecutive tool calls that fail to resolve the customer’s\nstated issue, ensuring a reasonable attempt before involving a human."
      },
      {
        "en": "Implement sentiment analysis that monitors for frustration indicators (negative language, repeated\nquestions, exclamation marks) and triggers escalation when the frustration score exceeds a configured\nthreshold."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B identifies escalation through direct operational criteria rather than indirect proxies. A customer’s\nexplicit request for a person is unambiguous. A required policy exception defines an authorization boundary.\nAn inability to make meaningful progress identifies a case where continued autonomous execution is no\nlonger productive.\n\nAnthropic describes agents as systems that act, observe results, adjust, and continue until the task is\ncompleted or human input is required. Its trustworthy-agent guidance also emphasizes that agents must\nrecognize when to pause rather than pushing through uncertainty or decisions that only a human can settle. (\nhttps://www.anthropic.com/research/trustworthy-agents )\n\nOption A is too rigid for high-ambiguity support cases. Maintaining exhaustive mappings for every issue,\nproduct, and customer segment recreates the brittleness that agentic reasoning is intended to avoid. Option C\ntreats repeated tool use as a substitute for semantic progress; one definitive authorization failure may require\n\nimmediate escalation, while several legitimate diagnostic calls may not. Option D confuses emotional tone\nwith operational necessity. A calm customer may require a policy exception, while a frustrated customer may\nstill have a straightforward automated resolution.\n\nThe escalation criteria should be encoded in the system instructions and supported by evaluations covering\nexplicit requests, authorization limits, unresolved ambiguity, repeated non-progress, and successful self-\nservice cases.\n\nOfficial references/topics: Human-control checkpoints, escalation criteria, authorization boundaries,\nprogress-aware agents."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 135,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "In production, final reports frequently contain claims without proper source attribution. Investigation shows\nthat the web-search and document-analysis agents correctly attach citations to their outputs, but the synthesis\nagent loses track of which sources support which conclusions when combining findings. What is the most\neffective architectural change?"
    },
    "options": [
      {
        "en": "Add a verification step in which the report generator uses semantic-similarity matching against the\noriginal sources to reconstruct claim provenance."
      },
      {
        "en": "Have the coordinator insert source-identifier prefixes into prose before every handoff and parse those\nprefixes during report generation."
      },
      {
        "en": "Require every subagent to return structured claim-to-source mappings that the synthesis agent must\npreserve and merge when combining findings."
      },
      {
        "en": "Retain complete transcripts of every subagent interaction and add a citation-resolution agent that\nanalyzes those logs before report generation."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C preserves provenance as part of the data contract instead of attempting to reconstruct it after\nsynthesis. Each finding should carry a stable claim identifier and one or more source records containing the\nURL or document identifier, relevant location, supporting excerpt, retrieval date, and applicable qualification.\nThe synthesis agent can combine or rewrite claims while retaining their source relationships.\n\nAnthropic’s structured-output documentation supports schema-constrained, parseable results for downstream\nworkflows. Its citation documentation explains that reliable citations depend on valid pointers to provided\nsource material. Anthropic’s skill guidance similarly recommends cross-referencing each major claim and\nverifying its citation before completion.\n\nOption A reconstructs attribution probabilistically and may associate a claim with a similar but incorrect\npassage. Option B encodes metadata inside prose, making transformations and parsing fragile. Option D\nretains excessive context and adds another model stage to recover information that should never have been\ndiscarded. Structured claim-source mappings permit deterministic merging, citation validation, deduplication,\nand audit trails. The report generator can therefore cite the exact evidence supporting each conclusion without\nreplaying complete research transcripts."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 136,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline.\nThe system runs automated code reviews, generates test cases, and provides feedback on pull requests. You\nneed to design prompts that provide actionable feedback and minimize false positives.\n\nYour automated review generates many findings per pull request, but developer feedback shows that\napproximately half are dismissed as “not worth addressing.” Analysis reveals that these findings are often\ntechnically accurate but involve minor style preferences or patterns that are acceptable in the project.\n\nBefore adding infrastructure complexity, what prompt-design change would most effectively reduce\ndismissals while maintaining detection of genuine issues?"
    },
    "options": [
      {
        "en": "Add a secondary classification model that filters findings according to predicted developer acceptance."
      },
      {
        "en": "Ask Claude to rate each finding’s confidence from 1 to 10 and include only findings rated 8 or higher."
      },
      {
        "en": "Define explicit reporting criteria that distinguish reportable bugs and security issues from minor style\npreferences and accepted local patterns."
      },
      {
        "en": "Add the instruction: “Only report findings you are highly confident are genuine problems.”"
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C defines the reviewer’s actual objective instead of relying on an undefined notion of confidence. The\nprompt should identify reportable categories such as correctness defects, security vulnerabilities, data-loss\nrisks, broken requirements, and meaningful performance regressions. It should also specify that cosmetic\npreferences, lint-enforced formatting, speculative refactoring, and intentional repository conventions must not\nbe reported unless they cause concrete incorrect behavior.\n\nAnthropic’s Claude Code best-practices guidance recommends telling a reviewer to report gaps affecting\ncorrectness or stated requirements and to treat other observations as optional. Without such criteria, a\nreviewer asked to “find issues” will predictably return technically defensible but operationally low-value\nobservations. Option A adds cost and another probabilistic decision layer before correcting the primary\nprompt. Option B relies on self-reported confidence, which does not necessarily align with developer value or\nseverity. Option D can suppress genuine defects that require inference or cross-file verification because\n“highly confident” is undefined. Explicit scope, evidence requirements, and examples of both reportable and\nexcluded findings directly calibrate the review toward what developers will act upon. Claude Code best\npractices"
    },
    "sourceLanguage": "en"
  },
  {
    "id": 137,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "Your automated review CI jobs take 18 seconds to initialize before Claude begins analyzing code. Profiling\nreveals that the delay comes from automatically discovering hooks, MCP servers, plugins, skills, and multiple\n\nnested CLAUDE.md files throughout your monorepo. You need to reduce startup time while ensuring that\nreviews still enforce your team’s coding standards, which are documented in the root-level CLAUDE.md file.\nWhat is the most effective approach?"
    },
    "options": [
      {
        "en": "Run in --bare mode and specify all review criteria directly in the -p prompt argument for every CI\ninvocation, without referencing external files."
      },
      {
        "en": "Replace the default prompt entirely by using --system-prompt-file ./CLAUDE.md, which bypasses\ndefault prompt assembly and loads only your project rules."
      },
      {
        "en": "Run in --bare mode and pass --append-system-prompt-file ./CLAUDE.md to explicitly load your\nproject standards while skipping all automatic discovery."
      },
      {
        "en": "Keep the default initialization and add --exclude-dynamic-system-prompt-sections to reduce per-\nmachine prompt variability and improve prompt-cache hit rates across runners."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Claude Code’s --bare option is specifically designed for faster scripted execution. It skips automatic discovery\nof CLAUDE.md files, hooks, skills, plugins, MCP servers, and auto-memory while retaining essential built-in\ncapabilities such as Bash, file reading, and file editing. Because --bare also prevents automatic loading of the\nroot CLAUDE.md, the required standards must be added explicitly.\n\nOption C accomplishes both objectives. --append-system-prompt-file ./CLAUDE.md loads the project\nstandards into the current invocation while preserving Claude Code’s default coding-agent system prompt and\ntool-use guidance. According to the official Claude Code CLI reference , append flags add file contents to the\ndefault system prompt, whereas replacement flags discard that default guidance.\n\nOption A could work functionally but duplicates the standards in every command and creates configuration\ndrift. Option B replaces the complete default prompt, removing useful coding, safety, and tool-use\ninstructions. Option D improves prompt-cache reuse across different machines, but it does not disable hooks,\nplugins, skills, MCP servers, or CLAUDE.md discovery and therefore does not directly address the measured\ninitialization delay."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 138,
    "domain": "mcp",
    "category": "Tool Design and MCP Integration",
    "prompt": {
      "en": "You are using Claude Code to accelerate software development. Your team uses it for code generation,\nrefactoring, debugging, and documentation. You need to integrate it into your development workflow with\ncustom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct\nexecution.\n\nYour team is configuring MCP servers in Claude Code. You want to add a shared venue lookup server that all\nteam members should have access to, and you personally want to add an experimental music playlist server\nthat only you are testing.\n\nWhich configuration approach correctly applies MCP server scopes?"
    },
    "options": [
      {
        "en": "Add both servers to your local ~/.claude.json ."
      },
      {
        "en": "Add the venue server to .mcp.json and the playlist server to ~/.claude.json ."
      },
      {
        "en": "Add the venue server to ~/.claude.json and the playlist server to .mcp.json ."
      },
      {
        "en": "Add both servers to the project-level .mcp.json file."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "The venue server must be available to every project contributor, so it belongs at project scope. Claude Code\nstores project-scoped MCP configurations in the repository-root .mcp.json file, which can be committed to\nversion control and shared with the team.\n\nThe experimental playlist server should remain private. Local-scoped MCP servers are stored under the\ncurrent project’s entry in ~/.claude.json , while user-scoped servers are also stored in ~/.claude.json but load\nacross all projects. Because this server is described as a personal experiment, either private scope is\nconceptually appropriate; among the listed choices, option B correctly separates shared project configuration\nfrom private personal configuration. ( https://code.claude.com/docs/en/mcp )\n\nOption A prevents the team from receiving the venue configuration. Option C reverses the intended visibility.\nOption D exposes the experimental server configuration to other contributors and may commit machine-\nspecific commands or credentials.\n\nThe preferred commands would specify --scope project for the shared venue server and --scope local for an\nexperiment limited to the current repository. Project-scoped servers also require user approval before Claude\nCode activates configurations received through .mcp.json .\n\nOfficial references/topics: MCP Installation Scopes; Project Scope; Local Scope; .mcp.json ; ~/.claude.json ."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 139,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "Your pipeline runs:\n\nPROMPT= \" You are a code reviewer. \"\n\nPROMPT= \" $PROMPT Analyze the provided diff \"\n\nPROMPT= \" $PROMPT for bugs, security issues, \"\n\nPROMPT= \" $PROMPT and style violations. \"\n\nclaude -p \\\n\n--dangerously-skip-permissions \\\n\n--system-prompt \" $PROMPT \" < diff.txt\n\nThe reviews complete and return feedback, but Claude comments only on the piped diff—it never reads\nsurrounding files in the checked-out repository to understand broader context, even when the diff modifies a\nfunction called by many other modules. Which change to the invocation will cause Claude to read related\nrepository files while still applying your custom review instructions?"
    },
    "options": [
      {
        "en": "Keep --system-prompt and add --allowedTools \" Read, Glob, Grep \" because non-interactive -p mode\notherwise disables filesystem tools."
      },
      {
        "en": "Replace --system-prompt with --append-system-prompt so the review instructions are added to Claude\nCode’s default prompt instead of overwriting its built-in file-reading and code-navigation guidance."
      },
      {
        "en": "Remove --system-prompt entirely and place the review instructions in a root-level CLAUDE.md\nbecause --system-prompt is incompatible with tool use under -p."
      },
      {
        "en": "Stop piping the diff through standard input and embed it in the prompt string so Claude Code treats the\ninvocation as an agentic session rather than a stream-processing operation."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "The --system-prompt flag replaces Claude Code’s complete default system prompt. Although this does not\ntechnically remove the available tools, it discards the default coding-agent guidance that tells Claude how to\ngather repository context, navigate code, use tools, and verify findings. The replacement prompt says only to\nanalyze the supplied diff, so the observed diff-only behaviour is consistent with the configured instructions.\n\nOption B preserves the standard Claude Code identity and tool guidance while adding the custom review\ncriteria. The Claude Code CLI reference states that --append-system-prompt appends instructions to the\ndefault prompt, whereas --system-prompt replaces it. Anthropic specifically recommends appending when\nClaude should remain a coding assistant that follows additional per-invocation rules.\n\nOption A is incorrect because print mode does not inherently disable Read, Glob, or Grep; --allowedTools\nrestricts or pre-authorizes tools but does not restore overwritten behavioural guidance. Option C is incorrect\nbecause replacement system prompts remain compatible with tools, although the replacement must supply\nsuitable tool instructions. Option D changes where the diff appears but does not restore Claude Code’s default\ncode-navigation behaviour. Appending the review instructions directly addresses the configuration error."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 140,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and\nmaintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.\n\nYour extraction pipeline processes invoices and extracts line items, subtotals, tax amounts, and grand totals.\nDuring evaluation, you discover that in 18% of extractions, the sum of extracted line item amounts doesn’t\nmatch the extracted grand total—sometimes due to OCR errors in the source document, sometimes due to\nextraction mistakes by the model. Downstream accounting systems reject records with mismatched totals.\n\nWhat’s the most effective approach to improve extraction reliability?"
    },
    "options": [
      {
        "en": "Add few-shot examples demonstrating invoices where extracted line items sum correctly to the stated\ntotal, encouraging the model to produce mathematically consistent extractions."
      },
      {
        "en": "Extract line items and totals independently, then use a separate validation model to reconcile\ndiscrepancies by determining which extracted values are most likely correct."
      },
      {
        "en": "Implement post-processing that automatically adjusts line item amounts proportionally when their sum\ndoesn’t match the stated total."
      },
      {
        "en": "Add a “calculated_total” field where the model sums extracted line items alongside a “stated_total”\nfield. Flag records for human review when values differ."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "The pipeline must preserve source evidence while making inconsistencies explicit. Option D records the\namount stated on the invoice separately from the total derived from extracted line items. A mismatch then\nbecomes a machine-detectable validation condition rather than an invisible extraction defect.\n\nThis approach is superior because it does not silently overwrite source data or ask another model to guess\nwhich value is correct. Anthropic’s evaluation guidance recommends automated, code-based grading\nwhenever the criterion can be expressed deterministically. Arithmetic reconciliation is precisely such a\ncriterion. ( https://docs.anthropic.com/en/docs/build-with-claude/develop-tests ) In production, the summation\nshould preferably be calculated by application code using normalized decimal values, even though the option\ndescribes the model populating calculated_total . The essential design principle remains the same: preserve\nstated_total , compute an independent total, compare them, and route discrepancies for adjudication.\n\nOption A might improve behavior but cannot resolve genuine OCR corruption and could encourage the model\nto modify extracted values merely to create mathematical consistency. Option B introduces a second\nprobabilistic judgment without new evidence. Option C is unacceptable for accounting data because it\nfabricates adjusted amounts and destroys fidelity to the invoice.\n\nThe schema should therefore expose both values and attach a validation status or review reason when they\ndiffer.\n\nOfficial references/topics: Deterministic Validation; Human-in-the-Loop Review; Structured Output Design;\nSource-Fidelity Controls."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 141,
    "domain": "mcp",
    "category": "Tool Design and MCP Integration",
    "prompt": {
      "en": "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-\nambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems\nthrough custom Model Context Protocol (MCP) tools (get_customer, lookup_order, process_refund,\nescalate_to_human). Your target is 80%+ first-contact resolution while knowing when to escalate.\n\nAfter expanding the agent’s MCP tools with delivery-specific capabilities (check_delivery_status,\ncontact_driver, issue_credit, apply_promo_code, update_delivery_address, reschedule_delivery), the total tool\ncount has grown from 4 to 10. Your evaluation suite shows tool selection accuracy has dropped from 88% to\n\n71%. Log analysis reveals the majority of errors involve the agent selecting between semantically overlapping\ntools—calling issue_credit when process_refund was correct, and calling check_delivery_status when\nlookup_order already returns the needed data.\n\nWhich approach structurally eliminates the semantic overlap identified in the logs as the error source?"
    },
    "options": [
      {
        "en": "Split the tools across two sub-agents—a “financial resolution” agent with process_refund, issue_credit,\nand apply_promo_code, and a “delivery operations” agent with the remaining delivery tools—with a\ncoordinator routing between them."
      },
      {
        "en": "Consolidate semantically overlapping tools—merge issue_credit and process_refund into a single\nresolve_compensation tool with an action parameter, and fold check_delivery_status into lookup_order\nwith an optional include_tracking flag."
      },
      {
        "en": "Enable the tool search tool with defer_loading on the six new tools, keeping the original four always\nloaded, so the agent dynamically discovers specialized tools only when needed."
      },
      {
        "en": "Add few-shot examples to the system prompt demonstrating correct selection for each ambiguous tool\npair, such as showing when issue_credit applies versus when process_refund is appropriate."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B removes the ambiguity from the tool interface itself. The agent no longer needs to choose between\nseparate functions that represent closely related business operations. Instead, a single compensation tool\nexposes an explicit action parameter, while the existing order lookup tool can optionally return delivery-\ntracking information through a clearly defined flag.\n\nAnthropic’s tool-design guidance recommends consolidating related operations into fewer, more capable tools\nwhen separate functions create unnecessary semantic overlap. Claude selects tools primarily from their\nnames, descriptions, schemas, and the current task. When multiple tools appear capable of satisfying the same\nrequest, selection accuracy declines because the agent must infer distinctions that should have been made\nexplicit in the interface design.\n\nOption A adds routing complexity but leaves overlapping financial operations available within the same sub-\nagent. Option C reduces the number of tools loaded initially, but it does not eliminate the semantic duplication\nbetween compensation operations or overlapping lookup functions. Option D may improve behavior through\nexamples, but it compensates for a poorly designed tool surface rather than correcting the root cause.\n\nThe consolidated schemas should use enums for supported actions, clearly define when each action applies,\nand document the returned fields. This creates a smaller and more deterministic agent-computer interface.\n\nOfficial references/topics: Tool consolidation, semantic tool boundaries, action parameters, MCP tool-\nselection accuracy."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 142,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "After the web-search agent finds 25 sources containing 120,000 tokens of raw content, the document-analysis\nagent extracts 15,000 tokens of key insights, and the synthesis agent produces a coherent 3,000-token\n\nnarrative draft, the coordinator must pass context to the report-generation agent for the final output with\nproper source citations. What context-passing strategy provides the best balance of completeness and\nefficiency?"
    },
    "options": [
      {
        "en": "Pass a condensed summary of all prior stages that preserves the main findings and attributes them to\nsources by name only."
      },
      {
        "en": "Pass the synthesis draft together with a structured source index that maps key claims to their source\nURLs and relevant excerpts."
      },
      {
        "en": "Pass only the synthesis draft and use a separate post-processing pipeline to match claims to sources and\ninsert citations after report generation."
      },
      {
        "en": "Pass the complete accumulated context from all prior agents."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B gives the report generator the two forms of information it actually needs: a compact narrative\ncontaining the synthesized conclusions and precise evidence records supporting those conclusions. The source\nindex should map claim identifiers to URLs, document locations, excerpts, and other provenance fields so\ncitations can be generated and verified without reloading 120,000 tokens of raw material.\n\nAnthropic’s context-engineering guidance recommends distilling extensive subagent activity into high-signal\nsummaries while preserving critical context and dependencies. Its research architecture similarly treats\nsubagents as intelligent filters that compress large evidence collections before returning relevant findings to\nthe coordinator.\n\nOption A lacks sufficient location-level evidence for reliable citation verification. Option C postpones\nattribution until after drafting, when claim wording may no longer map cleanly to the original evidence.\nOption D maximizes theoretical completeness but introduces extensive irrelevant material, higher token costs,\nslower processing, and greater context pollution. The synthesis draft plus a structured claim-to-source index\nmaintains evidentiary completeness where it matters while eliminating intermediate searches, duplicate\npassages, and other low-value context."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 143,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "You are integrating Claude Code into your Continuous Integration/Continuous Deployment (CI/CD) pipeline.\nThe system runs automated code reviews, generates test cases, and provides feedback on pull requests. You\nneed to design prompts that provide actionable feedback and minimize false positives.\n\nYour pipeline reviews every pull request using a single API call with a static prompt containing the diff and\nthe full text of each changed file. Unchanged files are not included. Developers report that reviews\nconsistently miss cross-file bugs—for example, a pull request renames a function’s parameters, but the review\ndoes not identify callers in unchanged files that still use the old argument order.\n\nEvaluation shows that cross-file bugs account for 35% of production incidents originating from reviewed pull\nrequests.\n\nWhat is the most effective change to the review design?"
    },
    "options": [
      {
        "en": "Build a static dependency graph and include every file located within two dependency hops of a\nchanged file."
      },
      {
        "en": "Add instructions asking the model to list external references and reason step by step about how each\nchange could affect unseen callers."
      },
      {
        "en": "Redesign the review as a turn-limited agentic task that can read files and search the repository,\nfollowing references to verify cross-file findings."
      },
      {
        "en": "Run separate review passes for each changed file with its direct dependants, and then aggregate and\ndeduplicate the findings through a final consolidation pass."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C gives the reviewer access to the evidence currently missing from its prompt. An agentic review can\nuse Grep, Glob, Read, language-server tools, and test commands to locate callers, follow imports, inspect type\ndefinitions, and verify whether a suspected compatibility issue actually exists. A turn limit controls cost while\nstill allowing targeted exploration.\n\nAnthropic’s context-engineering guidance recommends just-in-time retrieval: agents should retain lightweight\nreferences and dynamically load the information needed for the current task instead of preloading a large\nfixed context. Anthropic has also reported that code-review performance improves when the necessary\nrepositories are available for gathering complete context. Option A may load many irrelevant files while still\nmissing reflection, generated interfaces, dependency injection, or indirect call paths beyond the arbitrary two-\nhop boundary. Option B cannot reason reliably about code that the model cannot inspect. Option D improves\ncoverage but fragments repository-wide relationships and may duplicate substantial work. An agentic loop\ncan begin with the diff, identify uncertain cross-file effects, search only relevant paths, and report findings\nonly after locating supporting code. Anthropic context-engineering guidance , Claude Code quality report"
    },
    "sourceLanguage": "en"
  },
  {
    "id": 144,
    "domain": "code",
    "category": "Claude Code Configuration and Workflows",
    "prompt": {
      "en": "You are building developer-productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools—Read, Write, Bash, Grep, and Glob—and integrates with Model Context\nProtocol (MCP) servers.\n\nYou are building a security-scanning workflow.\n\nWhen engineers need to locate every occurrence of a dangerous function such as eval() across a large\ncodebase, which tool should the agent use for content searching?"
    },
    "options": [
      {
        "en": "Use Glob with a pattern such as **/eval* to locate files, and then read each matching file."
      },
      {
        "en": "Use Grep to search for the regular-expression pattern eval\\( across all files in the codebase."
      },
      {
        "en": "Read the project’s main entry file and follow import statements to trace where eval() might be used."
      },
      {
        "en": "Use Bash to run ls -R | grep eval and search the recursively listed filenames."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B uses the tool designed to search file contents. Anthropic’s Claude Code tools reference distinguishes\nGrep from Glob: Grep searches lines inside files, whereas Glob matches filenames and paths. Grep is built on\nripgrep and accepts regular-expression patterns, so the opening parenthesis should be escaped as eval\\( when\nthe intention is to match the literal function call. The search can return matching files, line numbers, and\nsurrounding context without loading every file into the model’s context window. Option A searches filenames\nresembling eval , not source files whose contents invoke the function. Option C follows only code reachable\nfrom a selected entry point and can miss test utilities, dynamically loaded modules, scripts, and dormant\nvulnerable code. Option D combines a recursive filename listing with text filtering; it still searches names\nrather than file contents. After Grep identifies matches, the agent should use Read on the relevant ranges to\ndistinguish actual executable calls from comments, strings, or safe wrappers. Grep therefore provides the most\ncomplete and context-efficient initial security scan."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 145,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "Production monitoring shows that follow-up queries such as “summarize what we learned about market\ntrends” consistently take more than 40 seconds. Investigation reveals that the coordinator spawns the\nsynthesis subagent for every summarization request, passing more than 80,000 tokens of accumulated\nfindings. The coordinator already has these findings in its context from orchestrating the research. What is the\nmost effective way to improve response time for these follow-up summaries?"
    },
    "options": [
      {
        "en": "Pregenerate and cache summaries at multiple levels of detail whenever new findings accumulate."
      },
      {
        "en": "Enable prompt caching for the synthesis subagent to reduce the overhead of repeatedly transferring the\nsame research findings."
      },
      {
        "en": "Have the coordinator answer straightforward summarization requests directly from its existing context,\nreserving subagent invocation for complex analysis."
      },
      {
        "en": "Spawn the synthesis subagent with reduced context and allow it to request specific findings from the\ncoordinator on demand."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C avoids an unnecessary agent boundary. The coordinator already possesses the accumulated findings\nand can perform a straightforward summary without serializing, transferring, and reprocessing more than\n80,000 tokens in another context window. Subagents should be reserved for work that requires isolated\ncontext, specialized instructions, separate tools, or an independent analytical process.\n\nAnthropic’s current prompting guidance advises using subagents for independent workstreams and parallel or\ncontext-isolated tasks, while handling simpler tasks directly. Anthropic also notes that excessive subagent use\ncreates unnecessary cost and latency.\n\nOption A generates multiple summaries speculatively, consuming resources even if they are never requested\nand creating cache-invalidation complexity whenever findings change. Option B may reduce repeated input-\ntoken cost, but it does not eliminate subagent startup, message processing, or the unnecessary orchestration\nround trip. Option D introduces an iterative request protocol that will likely increase latency further. Direct\ncoordinator summarization uses information already available in active context and therefore provides the\nsmallest architectural change, lowest token-transfer overhead, and fastest response while preserving subagent\nsynthesis for genuinely complex comparative or cross-source analysis."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 146,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "Your pipeline reviews every pull request using a single API call with a static prompt containing the diff and\nthe full text of each changed file; unchanged files are not included. Reviews are posted asynchronously and do\nnot block pull-request creation. Developers report that reviews consistently miss bugs involving cross-file\ninteractions—for example, a pull request renames a function’s parameters, but the review does not flag callers\nin other files that still use the old parameter names. Post-release analysis shows that cross-file bugs account\nfor 35% of production incidents from reviewed pull requests. What is the most effective change to your\nreview design?"
    },
    "options": [
      {
        "en": "Redesign the review as a turn-limited agentic task in which the model can read files and search the\ncodebase through tools, following references to verify cross-file findings."
      },
      {
        "en": "Add chain-of-thought instructions asking the model to list all external references in the diff and then\nreason step by step about how each change might affect callers in other files."
      },
      {
        "en": "Use static analysis to build a dependency graph of changed code, and then expand the prompt to include\nevery file within two dependency hops of any changed file."
      },
      {
        "en": "Run parallel review passes for each changed file with its direct dependents included, and then aggregate\nand deduplicate the findings through a final summarization call."
      }
    ],
    "answer": 0,
    "explanation": {
      "en": "The failure is caused by missing evidence, not insufficient reasoning over the supplied evidence. A static\nprompt containing only changed files cannot reliably identify callers, configuration dependencies, generated\ninterfaces, or indirect relationships located elsewhere in the repository. Asking Claude to reason more deeply\ncannot recover code that it was never given.\n\nOption A converts the review into a bounded agentic loop. Claude can search for symbol references, read\nrelevant callers, inspect type definitions, and follow newly discovered dependencies before validating a\npotential defect. Anthropic describes the Claude Code agentic loop as gathering context, taking action,\nverifying results, and repeating based on tool feedback. A turn limit preserves predictable cost and execution\ntime.\n\nOption C improves coverage but imposes an arbitrary two-hop boundary and depends on the accuracy of a\nprecomputed graph, which may omit dynamic imports, reflection, generated code, configuration references, or\nlanguage-specific call relationships. Option D creates duplicated context and aggregation complexity while\nstill limiting each reviewer to predetermined dependents. Option B changes the reasoning instructions but\nsupplies no mechanism for checking unchanged files. Tool-enabled, just-in-time retrieval is therefore the most\nadaptable and reliable architecture for cross-file review."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 147,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "The coordinator agent has AgentDefinition objects configured for all four specialized subagents, each with\nappropriate descriptions, prompts, and tool restrictions. During testing, you notice that the coordinator\ncorrectly reasons about when to delegate—it generates messages such as, “I’ll ask the web-search agent to\nfind sources on this topic”—but no subagent execution occurs. The coordinator then proceeds as if the\ndelegation happened and continues with incomplete information. Logs show no errors. What is the most likely\ncause?"
    },
    "options": [
      {
        "en": "The AgentDefinition objects are configured correctly, but the coordinator’s system prompt does not\nexplicitly list the available subagent types."
      },
      {
        "en": "The coordinator’s allowedTools configuration does not include \" Agent \" —called \" Task \" in older\nSDK releases—so it cannot invoke the tool required to spawn subagents."
      },
      {
        "en": "Subagent context isolation prevents task descriptions from reaching subagents unless explicit context\nforwarding is configured in ClaudeAgentOptions."
      },
      {
        "en": "The coordinator’s max_tokens setting is too low, causing the subagent invocation to be truncated before\nthe agent-type parameter is specified."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B identifies the missing executable capability. Defining specialized agents makes their configurations\navailable, but the coordinator must still be permitted to call the tool that invokes them. Without that tool,\nClaude can describe an intended delegation in ordinary text but cannot create a subagent execution.\n\nThe current Claude Agent SDK documentation requires \" Agent \" in allowedTools to auto-approve subagent\ninvocations. The tool was renamed from \" Task \" to \" Agent \" in Claude Code 2.1.63, so the terminology in\nthe original candidate question required correction. Older integrations may still expose \" Task \" in\ninitialization or permission records.\n\nOption A is unlikely because properly written AgentDefinition.description values already tell Claude when\neach agent should be used. Option C misinterprets context isolation: the parent supplies the subagent’s\nassignment through the Agent tool’s prompt, and no additional automatic forwarding setting is required.\nOption D would normally produce truncation evidence or a max_tokens stop reason rather than silent absence\nof every invocation. The coordinator needs both agent definitions and permission to use the invocation tool."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 148,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-\nambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems\nthrough custom Model Context Protocol (MCP) tools (get_customer, lookup_order, process_refund,\nescalate_to_human). Your target is 80%+ first-contact resolution while knowing when to escalate.\n\nProduction logs show that when the agent handles complex billing disputes requiring 6+ tool calls, it\nsometimes exhausts its max_turns limit after gathering data but before completing resolution or escalating.\nThe team’s goal is to guarantee that every customer interaction ends with either a completed resolution or a\nhuman handoff, regardless of how the agent loop terminates.\n\nWhich approach achieves this guarantee?"
    },
    "options": [
      {
        "en": "Implement a pre-tool-use hook that counts tool invocations and terminates the loop with an automatic\nescalation once the agent reaches 80% of its max_turns limit."
      },
      {
        "en": "Split the workflow into two sequential agent invocations—a first agent gathers information via\nget_customer and lookup_order, then a second agent receives that data and handles process_refund or\nescalate_to_human, each with separate turn budgets."
      },
      {
        "en": "Add orchestration-layer code that checks the agent’s outcome after each loop termination—if the loop\nended without a completed resolution or escalation, programmatically call escalate_to_human with the\naccumulated conversation context and tool results."
      },
      {
        "en": "Add system prompt instructions telling the agent to call escalate_to_human with a summary of its\nfindings whenever it determines it cannot complete resolution within its remaining actions."
      }
    ],
    "answer": 2,
    "explanation": {
      "en": "Option C is the only approach that guarantees the required terminal condition independently of the model’s\nbehavior. When the agent loop stops, the orchestration layer evaluates the recorded outcome. If neither a\nsuccessful resolution nor a confirmed human escalation occurred, deterministic application code invokes\nescalate_to_human using the information accumulated before termination.\n\nThe max_turns limit is a host-controlled safety boundary. Once that boundary is reached, the model may no\nlonger have an opportunity to follow a prompt instruction or make another tool call. Therefore, the required\nfallback cannot depend entirely on Claude deciding to escalate before its remaining turns are exhausted.\n\nOption A escalates based on an arbitrary 80% threshold and may prematurely terminate cases that could have\nbeen resolved successfully within the remaining budget. Option B provides additional turn capacity but does\nnot guarantee that the second agent will complete its work or escalate before its own limit is reached. Option\nD remains probabilistic and cannot operate after an unexpected termination has already occurred.\n\nThe orchestration fallback should be idempotent, ensuring that repeated completion checks cannot create\nduplicate escalation records. It should also include verified customer information, relevant order data,\ncompleted actions, failure reasons, and the unresolved request in the handoff payload.\n\nOfficial references/topics: Agent-loop termination, deterministic fallback orchestration, terminal-state\nvalidation, human handoff guarantees."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 149,
    "domain": "reliability",
    "category": "Context Management and Reliability",
    "prompt": {
      "en": "You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates\nto specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one\ngenerates reports. The system researches topics and produces comprehensive, cited reports.\n\nYour multi-agent research pipeline crashes after processing 12 of 28 documents. The web-search agent had\nidentified relevant sources, the document analyzer had partially completed extraction, and the synthesizer had\nbegun identifying patterns. You need to resume processing without repeating work or losing fidelity in the\nprior findings.\n\nWhat state-management approach best balances information fidelity with context efficiency when restoring\nagent state?"
    },
    "options": [
      {
        "en": "Index all agent outputs in a shared vector store. When resuming, each agent queries the store using\nsemantic search to retrieve relevant prior findings."
      },
      {
        "en": "Have each agent persist a structured export to a known location. On resumption, the coordinator loads\nthe manifest and injects relevant state into agent prompts."
      },
      {
        "en": "Have each agent maintain its own persistent state file and reload it independently at the beginning of\nevery session."
      },
      {
        "en": "Persist the coordinator’s conversation log containing all task delegations and responses, providing this\nlog to agents when resuming."
      }
    ],
    "answer": 1,
    "explanation": {
      "en": "Option B combines lossless persistence with selective restoration. Each agent should checkpoint structured\nrecords containing completed document IDs, extracted findings, source metadata, unresolved work, validation\nstatus, and schema version. A coordinator-level manifest records where those artifacts are stored and which\npipeline stages completed. On resumption, the coordinator can skip the 12 completed documents and inject\nonly the artifacts relevant to each restarted agent. Anthropic’s effective context-engineering guidance\nrecommends structured note-taking outside the context window so agents can preserve project state across\nresets while loading only the information needed later. A vector store, option A, is useful for relevance\nretrieval but can omit exact details through similarity-based selection and is unsuitable as the sole recovery\nrecord. Option C fragments ownership of recovery state and makes cross-agent consistency difficult to verify.\nOption D preserves an extensive trace, but replaying a complete conversation wastes context and mixes\nobsolete instructions, intermediate reasoning, and redundant outputs. Structured checkpoints plus a manifest\nprovide deterministic recovery, auditability, exact provenance, and efficient prompt reconstruction.\nCheckpoints should be written atomically and validated before the corresponding stage is marked complete."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 150,
    "domain": "prompt",
    "category": "Prompt Engineering and Structured Output",
    "prompt": {
      "en": "You are building a structured data extraction system using Claude. The system extracts information from\nunstructured documents, validates the output using JavaScript Object Notation (JSON) schemas, and\nmaintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.\n\nYour extraction pipeline processes restaurant menus and must output structured JSON with fields for item\nnames, descriptions, prices, and dietary tags. Some menus use inconsistent formatting—prices as “$12” vs\n“12.00”, dietary info as icons vs text.\n\nWhat’s the most reliable approach?"
    },
    "options": [
      {
        "en": "Use separate extraction calls for each field to ensure consistent handling of each type."
      },
      {
        "en": "Define a strict output schema and include format normalization rules in your prompt."
      },
      {
        "en": "Request multiple extraction attempts per document and select the most common format."
      },
      {
        "en": "Extract data as-is and normalize formats in post-processing code after Claude returns."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "The most reliable architecture separates semantic interpretation from deterministic normalization. Claude is\nwell suited to identifying that “$12” and “12.00” represent prices, or that a leaf icon represents a dietary\nclassification. However, canonical conversion—removing currency symbols, converting values to decimal\ntypes, mapping icons to controlled labels, and enforcing locale-specific rules—is more predictably performed\nin application code.\n\nStructured Outputs guarantee that Claude returns valid JSON matching the supplied schema, but that\nguarantee concerns structural conformance. It does not by itself guarantee that every semantically equivalent\nsource representation will be normalized identically. Anthropic’s evaluation guidance identifies code-based\nchecks as the fastest, most reliable, and most scalable mechanism for rule-based validation. ( https://platform.\nclaude.com/docs/en/build-with-claude/structured-outputs )\n\nOption D therefore minimizes model responsibility: Claude extracts the evidence as represented, and\ndeterministic post-processing converts it into the canonical downstream format. This also makes\nnormalization rules independently testable, version-controlled, and auditable.\n\nOption A increases latency and cost without solving normalization. Option B improves output structure, but\nprompt-based normalization can still vary across ambiguous formats. Option C introduces unnecessary\nstochasticity and majority-vote logic where explicit parsing rules are available. The downstream contract\nshould remain stable, but format conversion should be implemented using deterministic transformations rather\nthan repeated probabilistic inference.\n\nOfficial references/topics: Structured Outputs—schema compliance; Evaluation Design—code-based\nvalidation; Reliable extraction pipelines."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 151,
    "domain": "agent",
    "category": "Agentic Architecture and Orchestration",
    "prompt": {
      "en": "You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with Model Context Protocol\n(MCP) servers.\n\nAn engineer submits two requests:\n\nRequest A: “Rename the getUserData function to fetchUserProfile everywhere it’s used.”\n\nRequest B: “Improve error handling throughout the data processing module—add try/catch blocks,\nmeaningful error messages, and ensure failures don’t silently corrupt data.”\n\nFor which request does specifying an explicit multi-phase workflow (such as analyze # propose # implement\nwith review) most improve outcome quality?"
    },
    "options": [
      {
        "en": "Neither request benefits significantly"
      },
      {
        "en": "Request A, the function rename task"
      },
      {
        "en": "Both requests benefit equally"
      },
      {
        "en": "Request B, the error handling task"
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "Request B benefits substantially more from an explicit multi-phase workflow because it is broad, judgment-\nintensive, and likely to affect multiple execution paths. Improving error handling requires the agent to identify\ncurrent failure modes, determine which exceptions should be caught, preserve useful diagnostic information,\nprevent partial state corruption, and verify that the resulting behavior remains consistent across the module.\nAn analyze # propose # implement # review sequence separates those concerns and creates checkpoints\nbefore consequential edits are made.\n\nRequest A is comparatively deterministic. The function and target name are already defined, and the task\nprimarily requires locating references, applying the rename, and running tests or static analysis. Anthropic’s\nClaude Code guidance states that planning is most useful when the approach is uncertain, the work spans\nmultiple files, or the developer is unfamiliar with the affected code. For a small change that can be described\nas a straightforward diff, direct implementation is usually preferable. ( https://code.claude.com/docs/en/best-\npractices )\n\nAnthropic also characterizes prompt chaining as appropriate when a task can be divided into fixed stages and\nadditional latency is justified by increased accuracy. Request B fits that pattern because analysis and review\nmaterially reduce the risk of introducing swallowed exceptions or inconsistent recovery behavior. (\nhttps://www.anthropic.com/research/building-effective-agents )\n\nOfficial references/topics: Prompt Chaining; Plan Before Editing; Multi-Phase Coding Workflows;\nVerification and Review."
    },
    "sourceLanguage": "en"
  },
  {
    "id": 152,
    "domain": "mcp",
    "category": "Tool Design and MCP Integration",
    "prompt": {
      "en": "You are building developer-productivity tools using the Claude Agent SDK. The agent helps engineers\nexplore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive\ntasks. It uses the built-in tools—Read, Write, Bash, Grep, and Glob—and integrates with Model Context\nProtocol (MCP) servers.\n\nEngineers frequently ask the agent to cross-reference code changes with Jira tickets during reviews—\nchecking ticket descriptions, acceptance criteria, and recent comments. This currently requires manually\ncopying and pasting content into conversations. The team wants the agent to access this standard Jira ticket\ndata directly.\n\nWhat is the most effective approach?"
    },
    "options": [
      {
        "en": "Use the Bash tool with curl to call Jira’s REST API, including authentication headers and parsing JSON\nresponses inline."
      },
      {
        "en": "Build a custom MCP server wrapping Jira’s API with tools designed specifically for this team’s code-\nreview workflow."
      },
      {
        "en": "Export Jira tickets to Markdown files in the repository that the agent accesses using the Read tool."
      },
      {
        "en": "Integrate an existing Jira MCP server that exposes tickets, comments, and metadata through\ndiscoverable tool interfaces."
      }
    ],
    "answer": 3,
    "explanation": {
      "en": "Option D uses the established integration mechanism without creating unnecessary infrastructure. Anthropic’s\nClaude Code MCP documentation specifically recommends connecting an MCP server when users repeatedly\ncopy information from an external system, such as an issue tracker, into conversations. Once connected, the\nserver exposes Jira operations through named, schema-defined tools that Claude can discover and invoke\ndirectly. This allows the agent to retrieve ticket descriptions, acceptance criteria, comments, and metadata\nwhile preserving the server’s authentication and access controls.\n\nOption A exposes authentication details to shell commands and requires the agent to construct requests and\nparse responses repeatedly. Option B is justified only when no existing server provides the required\ncapabilities or the workflow requires highly specialized operations. The question requires standard Jira\ninformation, so building and maintaining another server is unnecessary. Option C creates stale, manually\nsynchronized copies that lose permissions, current comments, and authoritative ticket state. The team should\ntherefore select a trusted Jira MCP implementation, configure appropriate read-only scopes where possible,\nand verify its tool descriptions and data-access boundaries before enabling it."
    },
    "sourceLanguage": "en"
  }
];

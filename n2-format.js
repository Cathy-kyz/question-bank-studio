// Format documentation for the JLPT N2 import (used by import.js).
window.N2_FORMAT = {
  sample: "{\n  \"type\": \"jlpt-n2\",\n  \"name\": \"JLPT N2 サンプル\",\n  \"sections\": [\n    {\n      \"id\": \"language-knowledge\",\n      \"problems\": [\n        {\n          \"title\": \"問題１\",\n          \"instruction\": \"＿＿＿の言葉の読み方として最もよいものを、１・２・３・４から一つ選びなさい。\",\n          \"weight\": 1,\n          \"questions\": [\n            {\n              \"no\": 1,\n              \"prompt\": \"バスの<u>運賃</u>を払う。\",\n              \"options\": [\n                \"うんしん\",\n                \"うんちん\",\n                \"うんにん\",\n                \"うんりん\"\n              ],\n              \"answer\": 2,\n              \"explanation\": \"「運賃」は「うんちん」。\"\n            }\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": \"grammar\",\n      \"problems\": [\n        {\n          \"title\": \"問題７\",\n          \"instruction\": \"次の文の（　）に入れるのに最もよいものを、１・２・３・４から一つ選びなさい。\",\n          \"weight\": 1,\n          \"questions\": [\n            {\n              \"no\": 31,\n              \"prompt\": \"この小説は、物語が進む（　）主人公の心理が変化していくのが面白い。\",\n              \"options\": [\n                \"としても\",\n                \"とはいえ\",\n                \"につれて\",\n                \"にあたって\"\n              ],\n              \"answer\": 3,\n              \"explanation\": \"につれて：随着\"\n            }\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": \"reading\",\n      \"problems\": [\n        {\n          \"title\": \"問題10\",\n          \"instruction\": \"次の（１）から（５）の文章を読んで、後の問いに対する答えとして最もよいものを、１・２・３・４から一つ選びなさい。\",\n          \"weight\": 2.2,\n          \"passages\": [\n            {\n              \"label\": \"（１）\",\n              \"text\": \"<u>排除</u>（注１）するのではなく、居場所をつくり出すプロセスです。\\n\\n（注１）排除する：ここでは、取り除く\",\n              \"questions\": [\n                {\n                  \"no\": 54,\n                  \"prompt\": \"筆者の考えに合うのはどれか。\",\n                  \"options\": [\n                    \"選択肢ア\",\n                    \"選択肢イ\",\n                    \"選択肢ウ\",\n                    \"選択肢エ\"\n                  ],\n                  \"answer\": 1,\n                  \"explanation\": \"解説\"\n                }\n              ]\n            }\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": \"listening\",\n      \"problems\": [\n        {\n          \"title\": \"問題１\",\n          \"instruction\": \"問題１では、まず質問を聞いてください。それから話を聞いて、最もよいものを一つ選んでください。\",\n          \"weight\": 2,\n          \"questions\": [\n            {\n              \"no\": 1,\n              \"prompt\": \"\",\n              \"options\": [\n                \"サークル活動\",\n                \"アルバイトの選び方\",\n                \"勉強の工夫\",\n                \"就職のための準備\"\n              ],\n              \"answer\": 3,\n              \"explanation\": \"解説\"\n            }\n          ]\n        },\n        {\n          \"title\": \"問題３\",\n          \"instruction\": \"問題３では、問題用紙に何も印刷されていません。\",\n          \"weight\": 2,\n          \"questions\": [\n            {\n              \"no\": 1,\n              \"prompt\": \"\",\n              \"options\": [\n                \"\",\n                \"\",\n                \"\",\n                \"\"\n              ],\n              \"answer\": 1,\n              \"explanation\": \"解説\"\n            }\n          ]\n        }\n      ]\n    }\n  ]\n}",
  fields: [
  {
    "field": "type",
    "req": "required",
    "desc": {
      "ja": "必ず \"jlpt-n2\" にします。",
      "en": "Must be \"jlpt-n2\".",
      "zh": "必须写 \"jlpt-n2\"。"
    }
  },
  {
    "field": "name",
    "req": "optional",
    "desc": {
      "ja": "問題集の名前（文字列）。例：\"JLPT N2 2023年12月\"。",
      "en": "Name of the bank (string).",
      "zh": "题库名称（字符串）。例：\"JLPT N2 2023年12月\"。"
    }
  },
  {
    "field": "sections[].id",
    "req": "required",
    "desc": {
      "ja": "language-knowledge（問題1〜6）、grammar（問題7〜9）、reading（問題10〜14）、listening（聴解）のいずれか。各1回ずつ。",
      "en": "One of language-knowledge (problems 1-6), grammar (7-9), reading (10-14), listening. Each at most once.",
      "zh": "language-knowledge（問題1〜6）、grammar（問題7〜9）、reading（問題10〜14）、listening（听解）之一，每个最多出现一次。"
    }
  },
  {
    "field": "problems[].title",
    "req": "required",
    "desc": {
      "ja": "大問名。例：\"問題１\"。聴解は自動で「聴解　」が付きます。",
      "en": "Problem name, e.g. \"問題１\". Listening gets a 聴解 prefix automatically.",
      "zh": "大题名，例：\"問題１\"。听解会自动加上「聴解　」前缀。"
    }
  },
  {
    "field": "problems[].instruction",
    "req": "optional",
    "desc": {
      "ja": "その大問の指示文（問題用紙に印刷されているとおり）。",
      "en": "The instruction printed on the paper for this problem.",
      "zh": "该大题的指示文（照试卷原文）。"
    }
  },
  {
    "field": "problems[].weight",
    "req": "required",
    "desc": {
      "ja": "1問あたりの配点。例：問題10は 2.2。3科目の合計が 58 / 57 / 58 になります。",
      "en": "Points per question, e.g. 2.2 for problem 10. Section totals should be 58 / 57 / 58.",
      "zh": "每题配点，例：問題10 为 2.2。三个科目合计应为 58 / 57 / 58。"
    }
  },
  {
    "field": "problems[].questions[]",
    "req": "one of",
    "desc": {
      "ja": "文章がない大問の問題配列。",
      "en": "Questions of a problem without a passage.",
      "zh": "没有文章的大题使用的题目数组。"
    }
  },
  {
    "field": "problems[].passages[]",
    "req": "one of",
    "desc": {
      "ja": "文章がある大問用。[{ label?, text, questions[] }]。label は \"（１）\" など。text に（注１）や注の行も入れます。",
      "en": "For problems with passages: [{ label?, text, questions[] }]. Put （注１） markers and the note lines in text. If several passages share one set of questions (e.g. 問題12 A/B), omit questions inside the passages and put \"questions\" beside \"passages\" on the problem instead.",
      "zh": "有文章的大题使用：[{ label?, text, questions[] }]。label 如 \"（１）\"；text 里写入（注１）标记和注释行。"
    }
  },
  {
    "field": "questions[].no",
    "req": "required",
    "desc": {
      "ja": "問題用紙に印刷された番号。数字、または \"2a\" のような文字列。",
      "en": "The number printed on the paper: a number, or a string such as \"2a\".",
      "zh": "试卷上印的题号：数字，或 \"2a\" 这样的字符串。"
    }
  },
  {
    "field": "questions[].prompt",
    "req": "required",
    "desc": {
      "ja": "問題文。聴解で何も印刷されていない問題は空文字 \"\"。",
      "en": "Question text. Use \"\" for listening questions with nothing printed.",
      "zh": "题干。听解中试卷没有印任何内容的题写空字符串 \"\"。"
    }
  },
  {
    "field": "questions[].options",
    "req": "required",
    "desc": {
      "ja": "選択肢の文字列配列（2〜4個）。聴解で何も印刷されていない場合は \"\" を並べます。",
      "en": "Array of choice strings (2-4). Use \"\" for unprinted listening choices.",
      "zh": "选项字符串数组（2〜4 个）。听解中没印选项时写 \"\"。"
    }
  },
  {
    "field": "questions[].answer",
    "req": "required",
    "desc": {
      "ja": "正解。問題用紙の番号（1〜4）。",
      "en": "Correct choice as printed (1 to 4).",
      "zh": "正确答案：试卷上的选项号（1〜4）。"
    }
  },
  {
    "field": "questions[].explanation",
    "req": "optional",
    "desc": {
      "ja": "解説（文字列）。",
      "en": "Explanation (string).",
      "zh": "解析（字符串）。"
    }
  },
  {
    "field": "questions[].label / weight",
    "req": "optional",
    "desc": {
      "ja": "label：問題文の前に出す番号表示（聴解の既定は「1番」）。weight：この問題だけ配点を変えるとき。",
      "en": "label: number shown before the stem (listening defaults to \"1番\"). weight: per-question override.",
      "zh": "label：题干前显示的编号（听解默认「1番」）；weight：仅该题需要不同配点时填写。"
    }
  },
  {
    "field": "マークアップ / markup",
    "req": "—",
    "desc": {
      "ja": "文字列内で <u>下線</u>、<ruby>漢字<rt>よみ</rt></ruby>（または {漢字|よみ}）、<sup>、<b>、表 <table class=\"source-table\"> が使えます。（注１）は自動で上付きになります。",
      "en": "Strings may use <u>, <ruby>…<rt>…</rt></ruby> (or {漢字|よみ}), <sup>, <b> and <table class=\"source-table\">. （注１） is made superscript automatically.",
      "zh": "字符串里可用 <u>下划线</u>、<ruby>漢字<rt>よみ</rt></ruby>（或 {漢字|よみ}）、<sup>、<b>、表格 <table class=\"source-table\">；（注１）会自动变成上标。"
    }
  }
],
  prompt: "请把我提供的 JLPT N2 真题（试卷 + 答案/解析）整理成一个 JSON 文件，只输出 JSON 本身，不要任何说明文字。\n\n【格式】\n顶层：{ \"type\": \"jlpt-n2\", \"name\": \"JLPT N2 2023年12月\", \"sections\": [ ... ] }\nsections 里按需包含 4 个科目，id 只能是：\n- \"language-knowledge\"：問題1〜6（文字・語彙）\n- \"grammar\"：問題7〜9（文法）\n- \"reading\"：問題10〜14（読解）\n- \"listening\"：聴解（問題1〜5）\n每个科目：{ \"id\": \"...\", \"problems\": [ ... ] }\n每个大题：{ \"title\": \"問題１\", \"instruction\": \"试卷上印的指示文\", \"weight\": 每题配点, \"questions\": [ ... ] }\n有文章的大题（問題9〜14）不写 questions，改写 \"passages\": [ { \"label\": \"（１）\", \"text\": \"文章全文，含注\", \"questions\": [ ... ] } ]（只有一篇文章的大题 label 可省略；多篇文章共用同一组题目时（如問題12 的 AとB），不要在每篇文章里写 questions，而是在大题层级同时写 \"questions\"（与 \"passages\" 并列，此时 passages 里不能再有 questions）；只有一篇文章配多道题时，题目放在这篇文章的 questions 里）。\n每道题：{ \"no\": 试卷上印的题号(数字，或 \"2a\"), \"prompt\": \"题干\", \"options\": [\"选项1\",\"选项2\",...], \"answer\": 正确选项号(1〜4), \"explanation\": \"解析\" }\n\n【规则】\n1. 严格照试卷原文，不要改写、不要缩写、不要补充。文章必须写全文，（注１）等标记和脚注行（如「（注１）排除する：ここでは、取り除く」）都要写进 text。\n2. 带下划线的词写成 <u>词</u>；原卷上有注音的汉字写成 {漢字|かんじ}，例如 {運賃|うんちん}。\n3. 空格写 （　）；問題8 的 ★ 排序题用「＿＿＿＿　＿＿＿＿　★　＿＿＿＿」表示。\n4. 听解：试卷上没有印刷的内容（问题3、4 的全部内容、问题5 第1番）prompt 写 \"\"，options 写 [\"\",\"\",\"\",\"\"]（问题4 为 3 个）；只填 answer 和 explanation。问题1、2 和问题5 第2番有印选项，照印出的文字写。\n5. 原卷有明显印刷错误时，保持原样，并在 explanation 末尾另起一行写「（注）原文ママ：……」。\n6. 配点 weight（每题）按下表填写：\n   問題1: 1 / 問題2: 1 / 問題3: 1 / 問題4: 1 / 問題5: 1 / 問題6: 2 / 問題7: 1 / 問題8: 1 / 問題9: 1.5\n   問題10: 2.2 / 問題11: 2.5 / 問題12: 3 / 問題13: 4 / 問題14: 4\n   聴解 問題1: 2 / 問題2: 2 / 問題3: 2 / 問題4: 1.6 / 問題5: 2.8\n7. answer 以试卷印刷的选项号（1〜4）为准，不是 0 起始。答案必须来自答案 PDF；答案 PDF 缺失或与试卷对不上的题，answer 填你的最佳判断，并在 explanation 里写「（要確認）」。\n\n【样例】\n{\n  \"type\": \"jlpt-n2\",\n  \"name\": \"JLPT N2 サンプル\",\n  \"sections\": [\n    {\n      \"id\": \"language-knowledge\",\n      \"problems\": [\n        {\n          \"title\": \"問題１\",\n          \"instruction\": \"＿＿＿の言葉の読み方として最もよいものを、１・２・３・４から一つ選びなさい。\",\n          \"weight\": 1,\n          \"questions\": [\n            {\n              \"no\": 1,\n              \"prompt\": \"バスの<u>運賃</u>を払う。\",\n              \"options\": [\n                \"うんしん\",\n                \"うんちん\",\n                \"うんにん\",\n                \"うんりん\"\n              ],\n              \"answer\": 2,\n              \"explanation\": \"「運賃」は「うんちん」。\"\n            }\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": \"grammar\",\n      \"problems\": [\n        {\n          \"title\": \"問題７\",\n          \"instruction\": \"次の文の（　）に入れるのに最もよいものを、１・２・３・４から一つ選びなさい。\",\n          \"weight\": 1,\n          \"questions\": [\n            {\n              \"no\": 31,\n              \"prompt\": \"この小説は、物語が進む（　）主人公の心理が変化していくのが面白い。\",\n              \"options\": [\n                \"としても\",\n                \"とはいえ\",\n                \"につれて\",\n                \"にあたって\"\n              ],\n              \"answer\": 3,\n              \"explanation\": \"につれて：随着\"\n            }\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": \"reading\",\n      \"problems\": [\n        {\n          \"title\": \"問題10\",\n          \"instruction\": \"次の（１）から（５）の文章を読んで、後の問いに対する答えとして最もよいものを、１・２・３・４から一つ選びなさい。\",\n          \"weight\": 2.2,\n          \"passages\": [\n            {\n              \"label\": \"（１）\",\n              \"text\": \"<u>排除</u>（注１）するのではなく、居場所をつくり出すプロセスです。\\n\\n（注１）排除する：ここでは、取り除く\",\n              \"questions\": [\n                {\n                  \"no\": 54,\n                  \"prompt\": \"筆者の考えに合うのはどれか。\",\n                  \"options\": [\n                    \"選択肢ア\",\n                    \"選択肢イ\",\n                    \"選択肢ウ\",\n                    \"選択肢エ\"\n                  ],\n                  \"answer\": 1,\n                  \"explanation\": \"解説\"\n                }\n              ]\n            }\n          ]\n        }\n      ]\n    },\n    {\n      \"id\": \"listening\",\n      \"problems\": [\n        {\n          \"title\": \"問題１\",\n          \"instruction\": \"問題１では、まず質問を聞いてください。それから話を聞いて、最もよいものを一つ選んでください。\",\n          \"weight\": 2,\n          \"questions\": [\n            {\n              \"no\": 1,\n              \"prompt\": \"\",\n              \"options\": [\n                \"サークル活動\",\n                \"アルバイトの選び方\",\n                \"勉強の工夫\",\n                \"就職のための準備\"\n              ],\n              \"answer\": 3,\n              \"explanation\": \"解説\"\n            }\n          ]\n        },\n        {\n          \"title\": \"問題３\",\n          \"instruction\": \"問題３では、問題用紙に何も印刷されていません。\",\n          \"weight\": 2,\n          \"questions\": [\n            {\n              \"no\": 1,\n              \"prompt\": \"\",\n              \"options\": [\n                \"\",\n                \"\",\n                \"\",\n                \"\"\n              ],\n              \"answer\": 1,\n              \"explanation\": \"解説\"\n            }\n          ]\n        }\n      ]\n    }\n  ]\n}\n"
};

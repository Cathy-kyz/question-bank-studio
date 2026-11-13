const BUILTIN_DOMAINS = DOMAINS;

(() => {
  const app = document.getElementById("app");
  const BUILTIN_BANK_ID = "builtin";
  const LANG_KEY = "ccarf-language";
  const DATA_KEY = "ccarf-data";
  const PROFILES_KEY = "ccarf-profiles";
  const BANK_KEY = "ccarf-active-bank";
  const LEGACY_KEYS = { stats: "ccarf-stats", wrongBook: "ccarf-wrong-book", practice: "ccarf-practice-record", favorites: "ccarf-favorites", resume: "ccarf-resumable-session" };
  const translateQuestion = (question) => {
    const translation = window.QUESTION_TRANSLATIONS?.[question.id];
    if (!translation) return question;
    return {
      ...question,
      prompt: { ...question.prompt, ja: translation.ja.prompt, zh: translation.zh.prompt },
      options: question.options.map((option, index) => ({ ...option, ja: translation.ja.options[index], zh: translation.zh.options[index] })),
      explanation: { ...question.explanation, ja: translation.ja.explanation, zh: translation.zh.explanation }
    };
  };
  const builtinBank = () => ({
    id: BUILTIN_BANK_ID,
    builtin: true,
    name: { en: "CCAR-F Foundations", ja: "CCAR-F Foundations", zh: "CCAR-F Foundations" },
    domains: BUILTIN_DOMAINS,
    questions: (window.IMPORTED_QUESTIONS?.length ? window.IMPORTED_QUESTIONS : QUESTIONS).map(translateQuestion)
  });
  const n2BuiltinBanks = () => [["n2-202307", window.N2_202307_BANK], ["n2-202312", window.N2_202312_BANK]]
    .filter(([, source]) => source)
    .map(([id, source]) => ({ ...source, id, type: "jlpt-n2", builtin: true }));
  // The active bank drives QUESTION_BANK and DOMAINS; progress is scoped by profile and bank.
  let banks = [];
  let bank = null;
  let QUESTION_BANK = [];
  let DOMAINS = [];
  let profiles = { active: "default", list: [{ id: "default", name: "Default" }] };
  const state = {
    language: ["en", "ja", "zh", "all"].includes(localStorage.getItem(LANG_KEY)) ? localStorage.getItem(LANG_KEY) : "ja",
    selectedDomain: "all",
    examSize: 10,
    session: null,
    timerId: null,
    profileId: "default",
    bankId: BUILTIN_BANK_ID,
    notice: null
  };

  const ui = {
    en: {
      footer: "Personal study question bank", eyebrow: "Practice with scenario questions in three languages.", title: "Practice with\nyour own question banks.",
      intro: "A practice studio with all {count} questions. Switch languages at any time.", questionsUnit: "questions loaded",
      domainHeading: "Exam domain distribution", reference: "Question counts by category in the reference PDF", chooseDomain: "Choose a practice domain", allDomains: "All domains", questionCount: "questions",
      customHeading: "Customize your practice", customIntro: "Choose a domain and mode from {count} questions.", study: "Start study mode", exam: "Start mock exam", studyHint: "See the answer and explanation after each response", examHint: "Timed · 1,000 points total · 720 to pass",
      examSizeLabel: "Questions in this mock exam", wrongBook: "Wrong-answer notebook", wrongBookCount: "questions to review", startWrongBook: "Practice wrong answers", clearWrongBook: "Clear notebook", clearWrongConfirm: "Clear all saved wrong answers?", wrongBookEmpty: "No saved mistakes yet. Incorrect answers from study and mock exams will appear here.", removeWrongQuestion: "Remove", wrongProgress: "{count}/3 correct",
      exitSessionTitle: "Leave this question set?", exitSessionMessage: "Save your progress to continue later, discard it, or stay here.", saveAndExit: "Save and exit", discardAndExit: "Don't save", stayHere: "Stay in this set", pause: "Pause", resume: "Resume", pausedTitle: "Exam paused", pausedMessage: "The timer is stopped and the questions are hidden. Resume when you are ready.", savedProgress: "Saved progress", continueSession: "Continue", discardSaved: "Discard saved progress", discardSavedConfirm: "Discard the saved question-set progress?", overwriteSavedConfirm: "Starting a new set will replace your saved progress. Continue?",
      best: "Mock-exam best", noScore: "No score yet", disclaimer: "The 156 source questions, choices, and explanations are available in English, Japanese, and Simplified Chinese.", missingTranslation: { ja: "日本語訳は未登録です。英語原文を表示します。", zh: "尚未提供中文翻译，以下显示英文原文。" },
      practice: "Study mode", mock: "Mock exam", wrongMode: "Wrong-answer practice", backHome: "Study home", question: "Question", of: "of", check: "Check answer", next: "Next question", previous: "Previous", finish: "View results", correct: "Correct", incorrect: "Incorrect", answer: "Answer", unanswered: "Not answered", finishConfirm: "Some questions are unanswered. Submit for scoring now?", endConfirm: "End the session and score it now?", resultTitle: "Your results", scoreLabel: "Score", pass: "PASS · 720 points required", fail: "NOT PASSED · 720 points required", correctCount: "correct", review: "Review answers", retry: "Try again", home: "Back to home", completed: "completed", remaining: "Time remaining", timeUp: "Time is up. Your answers have been scored.", total: "Total", strong: "Excellent work. Review the reasoning to reinforce your judgment.", good: "Good progress. Review the explanations for missed domains.", keepGoing: "Review the explanations, then try these scenarios again.", questionMap: "Question navigator", explanation: "Explanation", selected: "Your answer", correctOption: "Correct option", scoreSaved: "New mock-exam best", restartNotice: "Start a new session? Current progress will not be saved.", practiceProgress: "Practice progress", practiceProgressIntro: "Answered questions stay marked across all domains.", answeredLabel: "answered", accuracyLabel: "Accuracy", clearPractice: "Clear practice record", clearPracticeConfirm: "Clear all practice records? Marks on every question will be removed. The wrong-answer notebook is not affected.", practicedMark: "Answered", lastCorrect: "last correct", lastWrong: "last incorrect", favorite: "Favorite", favorited: "Favorited", favoritesHeading: "Favorites", favoritesCount: "saved questions", startFavorites: "Practice favorites", favoritesEmpty: "No favorites yet. Tap ☆ Favorite on any question to save it here.", favoritesMode: "Favorites practice", openList: "Open →", mockDomainNote: "Questions are drawn from the domain selected above.", scenarioExamNote: "Real exam format: 4 of the 6 scenarios are drawn at random, with 15 questions each (60 total, 120 minutes). Mistakes feed the wrong-answer notebook as usual.", scenarioLabel: "Scenario", wrongTimes: "Wrong {n}×", correctTimes: "Correct {n}/3", nextScenario: "Next scenario", scenarioStepOf: "Scenario {n} of {total}",
      profileLabel: "Profile", profileHint: "Each profile keeps its own progress, wrong-answer notebook, favorites and best scores.", addProfile: "+ Add", deleteProfile: "Delete", defaultProfile: "Default", newProfilePrompt: "Name for the new profile", deleteProfileConfirm: "Delete the profile \"{name}\" and all of its saved progress? This cannot be undone.",
      bankLabel: "Question bank", importBank: "Import JSON", deleteBank: "Delete bank", bankHint: "Imported banks are stored in this browser. Progress is kept separately for each bank.", importDone: "Imported {count} questions.", importFailed: "Import failed:", deleteBankConfirm: "Delete this question bank and all progress saved for it?", storageUnavailable: "This browser cannot store imported question banks."
    },
    ja: {
      footer: "個人学習用の問題集",
      eyebrow: "シナリオ形式の問題を、3言語で練習。",
      title: "自分の問題集で、\n判断力を磨く。",
      intro: "全{count}問を、英語・日本語・中国語で学習できる練習スタジオです。",
      questionsUnit: "問を収録", questionCount: "問",
      domainHeading: "出題領域の構成", reference: "参考PDFのカテゴリ別問題数",
      chooseDomain: "練習する領域", allDomains: "すべての領域", customHeading: "練習をカスタマイズ", customIntro: "{count}問から領域と学習方法を選べます。",
      examSizeLabel: "模擬試験の問題数", wrongBook: "間違い問題ノート", wrongBookCount: "問を復習できます", startWrongBook: "間違い問題を練習", clearWrongBook: "ノートを消去", clearWrongConfirm: "保存した間違い問題をすべて消去しますか？", wrongBookEmpty: "まだ間違い問題はありません。学習モードや模擬試験で間違えると、ここに保存されます。", removeWrongQuestion: "削除", wrongProgress: "3回中{count}回正解",
      study: "学習モードで始める", exam: "模擬テストを始める",
      studyHint: "回答ごとに正解と解説を確認", examHint: "時間制限あり・1000点満点・720点で合格",
      exitSessionTitle: "問題セットを終了しますか？", exitSessionMessage: "進捗を保存して後で続ける、保存せずに終了する、または練習に戻ることができます。", saveAndExit: "保存して終了", discardAndExit: "保存しない", stayHere: "続ける", pause: "一時停止", resume: "再開", pausedTitle: "試験を一時停止中", pausedMessage: "タイマーは停止しており、問題は非表示です。準備ができたら再開してください。", savedProgress: "保存した進捗", continueSession: "続きから再開", discardSaved: "保存データを削除", discardSavedConfirm: "保存した問題セットの進捗を削除しますか？", overwriteSavedConfirm: "新しい問題セットを始めると、保存した進捗は上書きされます。続けますか？",
      best: "模擬テスト最高点", noScore: "未記録", disclaimer: "ユーザー提供の156問について、問題文・選択肢・解説を英語・日本語・簡体字中国語で収録しています。", missingTranslation: { ja: "日本語訳は未登録です。英語原文を表示します。", zh: "中国語訳は未登録です。英語原文を表示します。" },
      practice: "学習モード", mock: "模擬テスト", wrongMode: "間違い問題の復習", backHome: "学習ホーム", question: "問題", of: "/", check: "回答を確認", next: "次の問題", previous: "前へ", finish: "結果を見る", correct: "正解です", incorrect: "不正解です", answer: "正解", unanswered: "未回答", finishConfirm: "未回答の問題があります。このまま採点しますか？", endConfirm: "テストを終了して採点しますか？", resultTitle: "今回の結果", scoreLabel: "得点", pass: "合格（720点以上）", fail: "不合格（合格基準：720点）", correctCount: "正解", review: "振り返り", retry: "もう一度挑戦", home: "ホームに戻る", completed: "完了", remaining: "残り時間", timeUp: "時間終了です。回答を採点しました。", min: "分", total: "合計", strong: "素晴らしい結果です。判断の根拠も確認して定着させましょう。", good: "順調です。間違えた領域の解説を確認しましょう。", keepGoing: "解説を読み、もう一度シナリオに挑戦しましょう。", questionMap: "問題一覧", explanation: "解説", selected: "あなたの回答", correctOption: "正解の選択肢", scoreSaved: "模擬テストの自己ベストを更新", restartNotice: "新しい問題セットを開始しますか？現在の進捗は保存されません。", practiceProgress: "学習の進捗", practiceProgressIntro: "回答済みの問題は、領域を切り替えても印が残ります。", answeredLabel: "回答済み", accuracyLabel: "正答率", clearPractice: "回答記録を消去", clearPracticeConfirm: "すべての回答記録を消去しますか？全問題の印が消えます。間違い問題ノートは変わりません。", practicedMark: "回答済み", lastCorrect: "前回正解", lastWrong: "前回不正解", favorite: "お気に入り", favorited: "お気に入り済み", favoritesHeading: "お気に入り", favoritesCount: "問を保存", startFavorites: "お気に入りを練習", favoritesEmpty: "まだお気に入りはありません。問題の「お気に入り」を押すとここに保存されます。", favoritesMode: "お気に入りの練習", openList: "開く →", mockDomainNote: "問題は上で選んだ領域から抽出されます。", scenarioExamNote: "本番形式：6つのシナリオから4つをランダムに選び、各15問（計60問・120分）を出題します。間違えた問題は通常どおり間違い問題ノートに保存されます。", scenarioLabel: "シナリオ", wrongTimes: "不正解 {n}回", correctTimes: "正解 {n}/3回", nextScenario: "次のシナリオへ", scenarioStepOf: "シナリオ {n} / {total}",
      profileLabel: "利用者", profileHint: "利用者ごとに、進捗・間違い問題ノート・お気に入り・模擬テストの最高点を別々に保存します。", addProfile: "追加", deleteProfile: "削除", defaultProfile: "既定", newProfilePrompt: "新しい利用者の名前", deleteProfileConfirm: "利用者「{name}」と、その保存済みの進捗をすべて削除しますか？元に戻せません。",
      bankLabel: "問題集", importBank: "JSONを取り込む", deleteBank: "問題集を削除", bankHint: "取り込んだ問題集はこのブラウザーに保存されます。問題集ごとに進捗を分けて保存します。", importDone: "{count}問を取り込みました。", importFailed: "取り込みに失敗しました：", deleteBankConfirm: "この問題集と、問題集ごとに保存された進捗をすべて削除しますか？", storageUnavailable: "このブラウザーでは取り込んだ問題集を保存できません。"
    },
    zh: {
      footer: "个人学习题库",
      eyebrow: "以场景题练习，支持三种语言。",
      title: "用自己的题库，\n磨练判断力。",
      intro: "本练习平台收录全部 {count} 道题，支持英语、日语和简体中文切换。",
      questionsUnit: "道题已载入", questionCount: "题",
      domainHeading: "考试领域分布", reference: "参考 PDF 中各类别的题目数",
      chooseDomain: "选择练习领域", allDomains: "全部领域", customHeading: "自定义练习", customIntro: "从 {count} 道题目中选择领域和练习方式。",
      examSizeLabel: "模拟试卷题数", wrongBook: "错题本", wrongBookCount: "道题待复习", startWrongBook: "练习错题", clearWrongBook: "清空错题本", clearWrongConfirm: "确定清空所有已保存的错题吗？", wrongBookEmpty: "还没有错题。学习模式或模拟考试中答错的题目会保存在这里。", removeWrongQuestion: "移除", wrongProgress: "答对 {count}/3 次",
      study: "开始学习模式", exam: "开始模拟测试",
      studyHint: "每题作答后查看答案与解析", examHint: "限时作答 · 满分 1000 分 · 720 分合格",
      exitSessionTitle: "要离开当前题组吗？", exitSessionMessage: "可以保存进度以便稍后继续，也可以不保存直接退出，或留在当前题组。", saveAndExit: "保存并退出", discardAndExit: "不保存", stayHere: "继续练习", pause: "暂停", resume: "继续", pausedTitle: "考试已暂停", pausedMessage: "倒计时已停止，题目已隐藏。准备好后点击继续。", savedProgress: "已保存的进度", continueSession: "继续上次练习", discardSaved: "删除已保存进度", discardSavedConfirm: "确定删除已保存的答题进度吗？", overwriteSavedConfirm: "开始新的题组会覆盖已保存的进度，确定继续吗？",
      best: "模拟测试最高分", noScore: "暂无记录", disclaimer: "已为用户提供的 156 道题目收录英文、日语和简体中文版本，包含题干、选项和解析。", missingTranslation: { ja: "尚未提供日语翻译，以下显示英文原文。", zh: "尚未提供中文翻译，以下显示英文原文。" },
      practice: "学习模式", mock: "模拟测试", wrongMode: "错题复习", backHome: "学习主页", question: "题目", of: "/", check: "查看答案", next: "下一题", previous: "上一题", finish: "查看结果", correct: "回答正确", incorrect: "回答错误", answer: "正确答案", unanswered: "未作答", finishConfirm: "仍有未作答题目。要现在评分吗？", endConfirm: "要结束测试并评分吗？", resultTitle: "本次结果", scoreLabel: "得分", pass: "合格（720 分及以上）", fail: "未合格（合格线：720 分）", correctCount: "正确", review: "答题回顾", retry: "再试一次", home: "返回主页", completed: "已完成", remaining: "剩余时间", timeUp: "时间到，已对答案评分。", total: "共计", strong: "表现出色！请再回顾判断依据，巩固理解。", good: "进展不错。建议查看答错领域的解析。", keepGoing: "阅读解析后，再次挑战这些场景题。", questionMap: "题目导航", explanation: "解析", selected: "你的答案", correctOption: "正确选项", scoreSaved: "刷新了模拟测试最高分", restartNotice: "开始新题组？当前进度不会保存。", practiceProgress: "做题进度", practiceProgressIntro: "做过的题会一直打上标记，切换领域也不会丢失。", answeredLabel: "已做", accuracyLabel: "正确率", clearPractice: "清空做题记录", clearPracticeConfirm: "确定清空所有做题记录吗？所有题目的标记都会消失。错题本不受影响。", practicedMark: "已做", lastCorrect: "上次答对", lastWrong: "上次答错", favorite: "收藏", favorited: "已收藏", favoritesHeading: "收藏夹", favoritesCount: "道题已收藏", startFavorites: "练习收藏", favoritesEmpty: "还没有收藏。在题目上点击“收藏”即可保存到这里。", favoritesMode: "收藏练习", openList: "打开 →", mockDomainNote: "题目从上方选择的领域中抽取。", scenarioExamNote: "仿真考试格式：从 6 个场景中随机抽取 4 个，每个场景 15 题（共 60 题，限时 120 分钟）。答错的题目照常进入错题本。", scenarioLabel: "场景", wrongTimes: "答错 {n} 次", correctTimes: "答对 {n}/3 次", nextScenario: "下一个场景", scenarioStepOf: "场景 {n} / {total}",
      profileLabel: "用户", profileHint: "每位用户的做题进度、错题本、收藏和模拟测试最高分各自独立保存。", addProfile: "新增", deleteProfile: "删除", defaultProfile: "默认", newProfilePrompt: "新用户的名称", deleteProfileConfirm: "确定删除用户「{name}」及其全部已保存的进度吗？此操作无法撤销。",
      bankLabel: "题库", importBank: "导入 JSON", deleteBank: "删除题库", bankHint: "导入的题库保存在此浏览器中，每个题库的进度分开保存。", importDone: "已导入 {count} 道题目。", importFailed: "导入失败：", deleteBankConfirm: "确定删除此题库及其全部做题数据吗？", storageUnavailable: "当前浏览器无法保存导入的题库。"
    }
  };

  const n2Ui = {
    en: {
      n2ExamHint: "Weighted estimate · 180 points · not an official score",
      n2Best: "N2 estimated best",
      n2Estimated: "Estimated weighted score",
      n2EstimateNote: "Estimated from this short weighted sample; not an official JLPT score or pass/fail result.",
      n2WeightedPoints: "Weighted points in this quiz: {earned}/{available}",
      n2SecKnowledgeGrammar: "Language knowledge (vocabulary·grammar)", n2SecReading: "Reading", n2SecListening: "Listening",
      n2Total: "Total", n2PassRule: "Pass: total ≥ {pass} and every section ≥ {min}", n2Pass: "Pass level", n2Fail: "Below pass line",
      n2Partial: "Sections not included in this quiz are shown as “–”; pass/fail needs all three sections."
    },
    ja: {
      n2ExamHint: "加重換算の推定得点 · 180点満点・公式得点ではありません",
      n2Best: "N2推定最高点",
      n2Estimated: "配点比率による推定得点",
      n2EstimateNote: "今回の問題セットから算出した推定値です。公式のJLPT得点・合否判定ではありません。",
      n2WeightedPoints: "今回の加重点：{earned}/{available}",
      n2SecKnowledgeGrammar: "言語知識（文字・語彙・文法）", n2SecReading: "読解", n2SecListening: "聴解",
      n2Total: "総合", n2PassRule: "合格条件：総合 {pass}点以上、かつ各科目 {min}点以上", n2Pass: "合格圏", n2Fail: "合格ライン未満",
      n2Partial: "今回含まれない科目は「–」です。合否の目安には3科目すべてが必要です。"
    },
    zh: {
      n2ExamHint: "按题型加权估算 · 满分180分（非官方成绩）",
      n2Best: "N2估算最高分",
      n2Estimated: "加权估算分",
      n2EstimateNote: "根据本次抽题的加权正确率估算，不是官方JLPT成绩，也不作合格判定。",
      n2WeightedPoints: "本次加权得分：{earned}/{available}",
      n2SecKnowledgeGrammar: "言语知识（文字·词汇·语法）", n2SecReading: "读解", n2SecListening: "听解",
      n2Total: "总分", n2PassRule: "合格条件：总分 ≥ {pass} 分，且每个科目 ≥ {min} 分", n2Pass: "达到合格线", n2Fail: "未达合格线",
      n2Partial: "本次未包含的科目显示为“–”；判定合格需要三个科目都有题目。"
    }
  };

  const n2TabNames = {
    en: {
      "language-knowledge": "Vocabulary",
      grammar: "Grammar",
      reading: "Reading",
      listening: "Listening"
    },
    ja: {
      "language-knowledge": "文字・語彙",
      grammar: "文法",
      reading: "読解",
      listening: "聴解"
    },
    zh: {
      "language-knowledge": "文字・词汇",
      grammar: "文法",
      reading: "阅读",
      listening: "听力"
    }
  };

  const languages = [["EN", "en"], ["日本語", "ja"], ["中文", "zh"]];
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const formattedPassageText = (value) => escapeHtml(value)
    .replace(/&lt;table class=&quot;source-table&quot;&gt;/g, '<table class="source-table">')
    .replace(/&lt;(\/?)(u|sup|ruby|rt|b|table|tr|th|td)&gt;/g, "<$1$2>");
  const compare = (valueForLanguage) => `<span class="translation-list">${languages.map(([label, code]) => `<span class="translation"><b>${label}</b><span>${valueForLanguage(code)}</span></span>`).join("")}</span>`;
  const tr = (key, vars = {}) => {
    const fill = (value) => value.replace(/\{(\w+)\}/g, (match, name) => vars[name] ?? match);
    const valueFor = (language) => ui[language][key] ?? n2Ui[language][key];
    return state.language === "all" ? compare((language) => fill(valueFor(language))) : fill(valueFor(state.language));
  };
  const text = (item) => bank?.type === "jlpt-n2"
    ? formattedPassageText(item.ja || item.en || "")
    : state.language === "all"
      ? compare((language) => escapeHtml(item[language] || (language === "en" ? item.en : ui.en.missingTranslation[language])))
      : escapeHtml(item[state.language] || item.en || "");
  const explanationText = (question, optionOrder) => typeof question.explanationSource === "string"
    ? escapeHtml(question.explanationSource)
    : text(remapOptionReferences(question.explanation, optionOrder));
  const remapOptionReferences = (item, optionOrder) => {
    const remapLetter = (letter) => {
      const originalIndex = letter.toUpperCase().charCodeAt(0) - 65;
      const displayIndex = optionOrder.indexOf(originalIndex);
      return displayIndex < 0 ? letter : String.fromCharCode(65 + displayIndex);
    };
    const remapText = (value) => String(value ?? "")
      .replace(/\b(Options?\s+)([A-D](?:(?:\s*,\s*(?:(?:and|or)\s+)?|\s+(?:and|or)\s+)[A-D])*)/gi,
        (match, prefix, labels) => `${prefix}${labels.replace(/\b[A-D]\b/gi, remapLetter)}`)
      .replace(/(選択肢\s*)([A-D](?:(?:\s*[、,・]\s*|\s*(?:と|および)\s*)[A-D])*)/g,
        (match, prefix, labels) => `${prefix}${labels.replace(/[A-D]/g, remapLetter)}`)
      .replace(/(选项\s*)([A-D](?:(?:\s*[、，,・]\s*|\s*(?:和|与)\s*)[A-D])*)/g,
        (match, prefix, labels) => `${prefix}${labels.replace(/[A-D]/g, remapLetter)}`);
    return Object.fromEntries(Object.entries(item).map(([language, value]) => [language, remapText(value)]));
  };
  const plainText = (item) => bank?.type === "jlpt-n2"
    ? escapeHtml(item.ja || item.en || "")
    : state.language === "all"
      ? languages.map(([, language]) => escapeHtml(item[language] || item.en)).join(" / ")
      : escapeHtml(item[state.language] || item.en || "");
  const plain = (key) => ui[state.language === "all" ? "en" : state.language][key];
  const domain = (id) => DOMAINS.find((entry) => entry.id === id);
  const isN2Bank = () => bank?.type === "jlpt-n2";
  const optionLabel = (question, index) => isN2Bank() && question.options.every((option) => !(option.ja || option.en))
    ? String(index + 1)
    : String.fromCharCode(65 + index);
  const n2TabName = (id) => n2TabNames[state.language === "all" ? "ja" : state.language][id] || text(domain(id));
  const n2ScoreEstimate = (questions, selected) => {
    const available = questions.reduce((sum, question) => sum + question.scoreWeight, 0);
    const earned = questions.reduce((sum, question) =>
      sum + (selected[question.id] === question.answer ? question.scoreWeight : 0), 0);
    const sections = Object.keys(bank.scoring.sections).map((key) => {
      const items = questions.filter((question) => question.scoreSection === key);
      const sectionAvailable = items.reduce((sum, question) => sum + question.scoreWeight, 0);
      const sectionEarned = items.reduce((sum, question) =>
        sum + (selected[question.id] === question.answer ? question.scoreWeight : 0), 0);
      const scoreMax = bank.scoring.sections[key].scoreMax;
      return { key, score: sectionAvailable ? Math.round(sectionEarned / sectionAvailable * scoreMax) : null, scoreMax };
    });
    const complete = sections.every((item) => item.score != null);
    const sectionSum = sections.reduce((sum, item) => sum + (item.score || 0), 0);
    const passed = complete && sectionSum >= bank.scoring.passTotal && sections.every((item) => item.score >= bank.scoring.sectionMin);
    return {
      score: complete ? Math.round(sectionSum) : available ? Math.round(earned / available * bank.scoring.scaleMax) : 0,
      earned: Math.round(earned),
      available: Math.round(available),
      sections,
      complete,
      passed
    };
  };
  // Scenario-based mock exam applies only to the built-in CCAR-F bank; other banks keep the plain random draw.
  const SCENARIO_COUNT = 4;
  const SCENARIO_QUESTIONS = 15;
  const useScenarioExam = () => Boolean(bank?.id === BUILTIN_BANK_ID && window.CCARF_SCENARIOS?.length && window.CCARF_QUESTION_SCENARIO);
  const scenarioOf = (question) => {
    if (!useScenarioExam()) return null;
    const id = window.CCARF_QUESTION_SCENARIO[question.id];
    return window.CCARF_SCENARIOS.find((item) => item.id === id) || null;
  };
  // Picks 4 scenarios at random and 15 questions from each, grouped by scenario like the real exam.
  const drawScenarioExam = () => {
    const picked = shuffle(window.CCARF_SCENARIOS.filter((item) => QUESTION_BANK.filter((q) => scenarioOf(q)?.id === item.id).length >= SCENARIO_QUESTIONS)).slice(0, SCENARIO_COUNT);
    return picked.flatMap((item) => shuffle(QUESTION_BANK.filter((q) => scenarioOf(q)?.id === item.id)).slice(0, SCENARIO_QUESTIONS));
  };
  // All progress lives in one object: data[profileId][bankId] = { stats, wrongBook, practice, favorites, resume }.
  const readData = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(DATA_KEY) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch { return {}; }
  };
  const readPart = (part, fallback) => readData()[state.profileId]?.[state.bankId]?.[part] ?? fallback;
  const writePart = (part, value) => {
    const data = readData();
    data[state.profileId] ??= {};
    data[state.profileId][state.bankId] ??= {};
    if (value == null) delete data[state.profileId][state.bankId][part];
    else data[state.profileId][state.bankId][part] = value;
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  };
  const stats = () => readPart("stats", {});
  const wrongBook = () => readPart("wrongBook", {});
  const saveWrongBook = (book) => writePart("wrongBook", book);
  const practiceRecord = () => readPart("practice", {});
  const savePracticeRecord = (record) => writePart("practice", record);
  const favorites = () => readPart("favorites", {});
  const saveFavorites = (book) => writePart("favorites", book);
  const profileName = (item) => item.id === "default" ? plain("defaultProfile") : item.name;
  const favoriteQuestions = () => {
    const saved = favorites();
    return Object.keys(saved)
      .sort((a, b) => (saved[b].addedAt || 0) - (saved[a].addedAt || 0))
      .map((id) => QUESTION_BANK.find((item) => String(item.id) === String(id)))
      .filter(Boolean);
  };
  const toggleFavorite = (questionId) => {
    const saved = favorites();
    if (saved[questionId]) delete saved[questionId];
    else saved[questionId] = { addedAt: Date.now() };
    saveFavorites(saved);
    if (state.session) renderQuiz();
    else renderDashboard();
  };
  const removeFavorite = (questionId) => {
    const saved = favorites();
    delete saved[questionId];
    saveFavorites(saved);
    refreshCollection();
  };
  const isUnsavedMode = (mode) => mode === "wrongbook" || mode === "favorites";
  const recordAnswer = (question, selected, mode) => {
    // The practice record holds only the first attempt, so accuracy stays honest.
    // Re-answering in the wrong-answer notebook only updates the notebook, never this record.
    const practice = practiceRecord();
    if (mode !== "wrongbook" && !practice[question.id]) {
      practice[question.id] = { correct: selected === question.answer, answeredAt: Date.now() };
      savePracticeRecord(practice);
    }
    const book = wrongBook();
    if (selected === question.answer) {
      const previous = book[question.id];
      if (!previous) return;
      const correctCount = (previous.correctCount || 0) + 1;
      if (correctCount >= 3) delete book[question.id];
      else book[question.id] = { ...previous, correctCount, lastReviewed: Date.now() };
    } else {
      const previous = book[question.id] || {};
      book[question.id] = { ...previous, mistakes: (previous.mistakes || 0) + 1, correctCount: 0, lastWrong: Date.now() };
    }
    saveWrongBook(book);
  };
  const removeWrongQuestion = (questionId) => {
    const book = wrongBook();
    delete book[questionId];
    saveWrongBook(book);
    refreshCollection();
  };
  const wrongProgress = (count) => state.language === "all"
    ? compare((language) => ui[language].wrongProgress.replace("{count}", count))
    : ui[state.language].wrongProgress.replace("{count}", count);
  const savedSession = () => {
    const saved = readPart("resume", null);
    return saved && Array.isArray(saved.questionIds) ? saved : null;
  };
  const modeLabel = (mode) => mode === "exam" ? tr("mock") : mode === "wrongbook" ? tr("wrongMode") : mode === "favorites" ? tr("favoritesMode") : tr("practice");

  function setLanguage(language) {
    state.language = ["en", "ja", "zh", "all"].includes(language) ? language : "ja";
    localStorage.setItem(LANG_KEY, language);
    document.documentElement.lang = language === "ja" || language === "all" ? "ja" : language === "zh" ? "zh-CN" : "en";
    document.querySelectorAll(".language-button").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.language === language);
    });
    document.getElementById("footer-note").innerHTML = tr("footer");
    state.session ? renderQuiz() : renderDashboard();
  }

  function refreshCollection() {
    if (state.collection) renderCollection(state.collection);
    else renderDashboard();
  }

  // Full-page view of the wrong-answer notebook ("wrongbook") or favorites ("favorites").
  function renderCollection(kind) {
    clearInterval(state.timerId);
    state.timerId = null;
    state.session = null;
    state.collection = kind;
    const isWrong = kind === "wrongbook";
    const savedWrong = wrongBook();
    const items = isWrong
      ? Object.keys(savedWrong)
        .sort((a, b) => (savedWrong[b].lastWrong || 0) - (savedWrong[a].lastWrong || 0))
        .map((id) => ({ question: QUESTION_BANK.find((item) => String(item.id) === String(id)), correctCount: savedWrong[id].correctCount || 0 }))
        .filter((item) => item.question)
      : favoriteQuestions().map((question) => ({ question, correctCount: 0 }));
    const rowHtml = items.map(({ question, correctCount }) => `<div class="wrong-book-row"><button class="wrong-book-item" data-open-id="${escapeHtml(question.id)}" type="button"><span class="wrong-book-id">#${escapeHtml(question.id)}</span><span class="wrong-book-question">${text(question.prompt) || `${text(domain(question.domain))} #${escapeHtml(question.id)}`}${isWrong ? `<small>${wrongProgress(correctCount)}</small>` : ""}</span><span class="topic-pill">${text(domain(question.domain))}</span></button><button class="wrong-book-remove" data-remove-id="${escapeHtml(question.id)}" type="button" aria-label="${plain("removeWrongQuestion")} #${escapeHtml(question.id)}">${tr("removeWrongQuestion")}</button></div>`);
    // The wrong-answer notebook of the built-in bank is grouped by exam scenario.
    const grouped = isWrong && useScenarioExam();
    const rows = grouped
      ? window.CCARF_SCENARIOS.map((scenario) => {
        const indexes = items.map((item, index) => index).filter((index) => scenarioOf(items[index].question)?.id === scenario.id);
        return indexes.length ? `<h3 class="wrong-book-scenario"><span>${tr("scenarioLabel")} ${scenario.id}: ${text(scenario)}</span><span class="topic-pill">${indexes.length}</span></h3>${indexes.map((index) => rowHtml[index]).join("")}` : "";
      }).join("")
      : rowHtml.join("");
    app.innerHTML = `
      <section class="collection-wrap">
        <div class="quiz-topline"><button class="text-button" id="collection-back" type="button">← ${tr("backHome")}</button></div>
        <section class="wrong-book-section card">
          <div class="wrong-book-heading">
            <div><h2>${isWrong ? tr("wrongBook") : tr("favoritesHeading")}</h2><p>${items.length} ${isWrong ? tr("wrongBookCount") : tr("favoritesCount")}</p></div>
            <div class="wrong-book-actions">
              ${isWrong && items.length ? `<button class="btn btn-quiet btn-small" id="clear-collection" type="button">${tr("clearWrongBook")}</button>` : ""}
              <button class="btn btn-primary" id="start-collection" type="button" ${items.length ? "" : "disabled"}>${isWrong ? tr("startWrongBook") : tr("startFavorites")} →</button>
            </div>
          </div>
          ${items.length ? `<div class="wrong-book-preview">${rows}</div>` : `<p class="empty-note">${isWrong ? tr("wrongBookEmpty") : tr("favoritesEmpty")}</p>`}
        </section>
      </section>`;

    const mode = isWrong ? "wrongbook" : "favorites";
    document.getElementById("collection-back").addEventListener("click", renderDashboard);
    document.getElementById("start-collection").addEventListener("click", () => startQuiz(mode));
    app.querySelectorAll("[data-open-id]").forEach((button) => button.addEventListener("click", () => {
      startQuiz(mode);
      const targetIndex = state.session?.list.findIndex((question) => String(question.id) === button.dataset.openId) ?? -1;
      if (targetIndex >= 0) { state.session.current = targetIndex; renderQuiz(); }
    }));
    app.querySelectorAll("[data-remove-id]").forEach((button) => button.addEventListener("click", () => {
      if (isWrong) removeWrongQuestion(button.dataset.removeId);
      else removeFavorite(button.dataset.removeId);
    }));
    const clearButton = document.getElementById("clear-collection");
    if (clearButton) clearButton.addEventListener("click", () => {
      if (window.confirm(plain("clearWrongConfirm"))) { saveWrongBook({}); renderCollection(kind); }
    });
  }

  function renderDashboard() {
    clearInterval(state.timerId);
    state.timerId = null;
    state.session = null;
    state.collection = null;
    const saved = stats();
    const pendingSession = savedSession();
    const domainOptions = DOMAINS.map((item) => `<option value="${item.id}" ${state.selectedDomain === item.id ? "selected" : ""}>${plainText(item)}</option>`).join("");
    const bestScore = saved[isN2Bank() ? "bestN2Estimate" : "bestExam"];
    const bestText = bestScore == null ? tr("noScore") : `${bestScore} / ${isN2Bank() ? bank.scoring.scaleMax : 1000}`;
    const savedWrongBook = wrongBook();
    const wrongIds = Object.keys(savedWrongBook);
    const availableCount = state.selectedDomain === "all" ? QUESTION_BANK.length : QUESTION_BANK.filter((question) => question.domain === state.selectedDomain).length;
    const examSizes = [5, 10, 15, 20, 60];
    const validExamSizes = examSizes.filter((size) => size <= availableCount);
    if (!validExamSizes.includes(state.examSize)) state.examSize = validExamSizes[validExamSizes.length - 1] || 5;
    const examSizeOptions = examSizes.map((size) => `<option value="${size}" ${state.examSize === size ? "selected" : ""} ${size > availableCount ? "disabled" : ""}>${size}</option>`).join("");
    const practice = practiceRecord();
    const practiceDone = QUESTION_BANK.filter((question) => practice[question.id]);
    const practiceCorrect = practiceDone.filter((question) => practice[question.id].correct).length;
    const practiceAccuracy = practiceDone.length ? `${Math.round(practiceCorrect / practiceDone.length * 100)}%` : "—";
    const practiceDomainRows = DOMAINS.map((item) => {
      const total = QUESTION_BANK.filter((question) => question.domain === item.id).length;
      const doneList = QUESTION_BANK.filter((question) => question.domain === item.id && practice[question.id]);
      const done = doneList.length;
      const domainAccuracy = done ? `${Math.round(doneList.filter((question) => practice[question.id].correct).length / done * 100)}%` : "—";
      return `<div class="domain-row"><span class="domain-name">${text(item)}</span><span class="domain-count">${done} / ${total} · ${plain("accuracyLabel")} <b class="domain-accuracy">${domainAccuracy}</b></span><div class="domain-track"><div class="domain-fill" style="width:${total ? done / total * 100 : 0}%"></div></div></div>`;
    }).join("");

    const favoriteList = favoriteQuestions();
    const profileOptions = profiles.list.map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === state.profileId ? "selected" : ""}>${escapeHtml(profileName(item))}</option>`).join("");
    const bankOptions = banks.map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === bank.id ? "selected" : ""}>${plainText(item.name)} (${item.questions.length})</option>`).join("");
    app.innerHTML = `
      <section class="card workspace-card">
        <div class="workspace-bar">
          <div class="workspace-group">
            <label class="select-label" for="profile-select">${tr("profileLabel")}</label>
            <select class="domain-select" id="profile-select">${profileOptions}</select>
            <button class="btn btn-secondary btn-small" id="add-profile" type="button">${tr("addProfile")}</button>
            <button class="btn btn-quiet btn-small" id="delete-profile" type="button" ${profiles.list.length > 1 ? "" : "disabled"}>${tr("deleteProfile")}</button>
          </div>
          <div class="workspace-group">
            <label class="select-label" for="bank-select">${tr("bankLabel")}</label>
            <select class="domain-select" id="bank-select">${bankOptions}</select>
            <button class="btn btn-secondary btn-small" id="import-bank" type="button">${tr("importBank")}</button>
            ${bank.builtin ? "" : `<button class="btn btn-quiet btn-small" id="delete-bank" type="button">${tr("deleteBank")}</button>`}
          </div>
        </div>
        ${state.notice ? `<p class="workspace-notice ${state.notice.error ? "is-error" : "is-ok"}">${escapeHtml(state.notice.text)}</p>` : ""}
      </section>
      ${pendingSession ? `<section class="resume-card card"><div><span class="quiz-mode">${modeLabel(pendingSession.mode)}</span><h2>${tr("savedProgress")}</h2><p>${tr("question")} ${Math.min((pendingSession.current || 0) + 1, pendingSession.questionIds.length)} ${tr("of")} ${pendingSession.questionIds.length}</p></div><div class="resume-actions"><button class="btn btn-primary" id="resume-session" type="button">${tr("continueSession")} →</button><button class="btn btn-quiet btn-small" id="discard-saved-session" type="button">${tr("discardSaved")}</button></div></section>` : ""}
      <section class="home-grid">
        <div class="card home-progress">
          <div class="card-heading">
            <h2>${tr("practiceProgress")}</h2>
            <button class="btn btn-quiet btn-small" id="clear-practice" type="button" ${practiceDone.length ? "" : "disabled"}>${tr("clearPractice")}</button>
          </div>
          <div class="stat-row">
            <div class="stat progress-summary"><strong>${practiceDone.length} / ${QUESTION_BANK.length}</strong><span>${tr("answeredLabel")}</span></div>
            <div class="stat"><strong>${practiceAccuracy}</strong><span>${tr("accuracyLabel")}</span></div>
            <div class="stat"><strong>${bestText}</strong><span>${tr(isN2Bank() ? "n2Best" : "best")}</span></div>
          </div>
          <div class="domain-track progress-total"><div class="domain-fill" style="width:${practiceDone.length / QUESTION_BANK.length * 100}%"></div></div>
          <div class="domain-list">${practiceDomainRows}</div>
        </div>
        <div class="home-side">
          <div class="card actions-card">
            <div class="mode-block">
              <h2>${tr("practice")}</h2>
              <label class="select-label" for="domain-select">${tr("chooseDomain")}</label>
              <select class="domain-select" id="domain-select"><option value="all">${plain("allDomains")}</option>${domainOptions}</select>
              <button class="btn btn-primary" data-mode="study" type="button">${tr("study")} <span aria-hidden="true">→</span><small style="display:block;font-size:10px;font-weight:500;opacity:.8;margin-top:4px">${tr("studyHint")}</small></button>
            </div>
            <div class="mode-block">
              <h2>${tr("mock")}</h2>
              ${useScenarioExam() ? `<p class="lead-small">${tr("scenarioExamNote")}</p>` : `<label class="select-label" for="exam-size">${tr("examSizeLabel")}</label>
              <select class="domain-select" id="exam-size">${examSizeOptions}</select>
              <p class="lead-small">${tr("mockDomainNote")}</p>`}
              <button class="btn btn-secondary" data-mode="exam" type="button">${tr("exam")} <span aria-hidden="true">→</span><small style="display:block;font-size:10px;font-weight:500;opacity:.8;margin-top:4px">${tr(isN2Bank() ? "n2ExamHint" : "examHint")}</small></button>
            </div>
          </div>
          <button class="card collection-button" id="open-wrong-book" type="button">
            <span class="collection-text"><span class="collection-title">${tr("wrongBook")}</span><span class="collection-count">${wrongIds.length} ${tr("wrongBookCount")}</span></span>
            <span class="btn btn-secondary btn-small">${tr("openList")}</span>
          </button>
          <button class="card collection-button" id="open-favorites" type="button">
            <span class="collection-text"><span class="collection-title">${tr("favoritesHeading")}</span><span class="collection-count">${favoriteList.length} ${tr("favoritesCount")}</span></span>
            <span class="btn btn-secondary btn-small">${tr("openList")}</span>
          </button>
        </div>
      </section>
      ${bank.id === BUILTIN_BANK_ID ? `<aside class="disclaimer"><span class="disclaimer-icon" aria-hidden="true">ⓘ</span><span>${tr("disclaimer")}</span></aside>` : ""}`;
    state.notice = null;

    document.getElementById("domain-select").addEventListener("change", (event) => { state.selectedDomain = event.target.value; renderDashboard(); });
    document.getElementById("exam-size")?.addEventListener("change", (event) => { state.examSize = Number(event.target.value); });
    const resumeButton = document.getElementById("resume-session");
    if (resumeButton) resumeButton.addEventListener("click", resumeSavedSession);
    const discardSavedButton = document.getElementById("discard-saved-session");
    if (discardSavedButton) discardSavedButton.addEventListener("click", () => {
      if (window.confirm(plain("discardSavedConfirm"))) { writePart("resume", null); renderDashboard(); }
    });
    app.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => startQuiz(button.dataset.mode)));
    document.getElementById("open-wrong-book").addEventListener("click", () => renderCollection("wrongbook"));
    document.getElementById("open-favorites").addEventListener("click", () => renderCollection("favorites"));
    const clearPracticeButton = document.getElementById("clear-practice");
    if (clearPracticeButton) clearPracticeButton.addEventListener("click", () => {
      if (window.confirm(plain("clearPracticeConfirm"))) { writePart("practice", null); renderDashboard(); }
    });
    document.getElementById("profile-select").addEventListener("change", (event) => switchProfile(event.target.value));
    document.getElementById("add-profile").addEventListener("click", addProfile);
    document.getElementById("delete-profile").addEventListener("click", deleteProfile);
    document.getElementById("bank-select").addEventListener("change", (event) => switchBank(event.target.value));
    document.getElementById("import-bank").addEventListener("click", () => { window.location.href = "import.html"; });
    document.getElementById("delete-bank")?.addEventListener("click", deleteBank);
  }

  function startQuiz(mode) {
    if (!isUnsavedMode(mode) && savedSession() && !window.confirm(plain("overwriteSavedConfirm"))) return;
    let list;
    if (mode === "wrongbook") {
      const savedWrongBook = wrongBook();
      list = Object.keys(savedWrongBook)
        .sort((a, b) => (savedWrongBook[b].lastWrong || 0) - (savedWrongBook[a].lastWrong || 0))
        .map((id) => QUESTION_BANK.find((item) => String(item.id) === String(id)))
        .filter(Boolean);
      if (!list.length) { renderDashboard(); return; }
    } else if (mode === "favorites") {
      list = favoriteQuestions();
      if (!list.length) { renderDashboard(); return; }
    } else {
      list = state.selectedDomain === "all" ? [...QUESTION_BANK] : QUESTION_BANK.filter((item) => item.domain === state.selectedDomain);
    }
    if (mode === "exam" && useScenarioExam()) {
      list = drawScenarioExam();
    } else if (mode === "exam") {
      list = shuffle(list).slice(0, Math.min(state.examSize, list.length));
    } else if (isUnsavedMode(mode)) {
      list = shuffle(list);
      // Wrong-answer practice runs one scenario at a time, like the mock exam.
      if (mode === "wrongbook" && useScenarioExam()) list.sort((m, n) => (scenarioOf(m)?.id || 99) - (scenarioOf(n)?.id || 99));
    }
    clearInterval(state.timerId);
    state.timerId = null;
    if (!isUnsavedMode(mode)) writePart("resume", null);
    const optionOrders = Object.fromEntries(list.map((question) => [question.id, isN2Bank() ? question.options.map((_, index) => index) : shuffle(question.options.map((_, index) => index))]));
    state.session = { mode, list, optionOrders, current: 0, selected: {}, checked: {}, seconds: mode === "exam" ? (useScenarioExam() ? 7200 : list.length * 90) : null };
    if (mode === "exam") startExamTimer();
    renderQuiz();
  }

  function pauseExam() {
    if (state.session?.mode !== "exam" || state.timerId == null) return;
    clearInterval(state.timerId);
    state.timerId = null;
    document.getElementById("pause-dialog")?.remove();
    document.body.insertAdjacentHTML("beforeend", `
      <div class="session-choice-backdrop pause-backdrop" id="pause-dialog">
        <section class="session-choice-dialog" role="dialog" aria-modal="true" aria-labelledby="pause-title">
          <h2 id="pause-title">${tr("pausedTitle")}</h2>
          <p>${tr("pausedMessage")}</p>
          <div class="session-choice-actions">
            <button class="btn btn-primary" id="resume-exam" type="button">${tr("resume")}</button>
          </div>
        </section>
      </div>`);
    const resume = document.getElementById("resume-exam");
    resume.addEventListener("click", () => startExamTimer());
    resume.focus();
  }

  function startExamTimer() {
    document.getElementById("pause-dialog")?.remove();
    clearInterval(state.timerId);
    if (state.session?.seconds <= 0) {
      finishQuiz(true);
      return;
    }
    state.timerId = setInterval(() => {
      if (!state.session) return;
      state.session.seconds -= 1;
      const timer = document.getElementById("timer");
      if (timer) timer.textContent = formatTime(state.session.seconds);
      if (state.session.seconds <= 0) finishQuiz(true);
    }, 1000);
  }

  function resumeSavedSession() {
    const saved = savedSession();
    if (!saved) return renderDashboard();
    const list = saved.questionIds.map((id) => QUESTION_BANK.find((question) => String(question.id) === String(id))).filter(Boolean);
    if (!list.length || !["study", "exam", "wrongbook"].includes(saved.mode)) {
      writePart("resume", null);
      return renderDashboard();
    }
    state.session = {
      mode: saved.mode,
      list,
      optionOrders: Object.fromEntries(list.map((question) => {
        const savedOrder = saved.optionOrders?.[question.id];
        const isValidOrder = Array.isArray(savedOrder)
          && savedOrder.length === question.options.length
          && new Set(savedOrder).size === question.options.length
          && savedOrder.every((index) => Number.isInteger(index) && index >= 0 && index < question.options.length);
        return [question.id, isValidOrder ? savedOrder : question.options.map((_, index) => index)];
      })),
      current: Math.min(Math.max(Number(saved.current) || 0, 0), list.length - 1),
      selected: saved.selected || {},
      checked: saved.checked || {},
      seconds: saved.mode === "exam" ? Math.max(0, Number(saved.seconds) || 0) : null
    };
    if (state.session.mode === "exam") startExamTimer();
    renderQuiz();
  }

  function saveCurrentSession() {
    const session = state.session;
    if (!session) return;
    writePart("resume", {
      mode: session.mode,
      questionIds: session.list.map((question) => question.id),
      optionOrders: session.optionOrders,
      current: session.current,
      selected: session.selected,
      checked: session.checked,
      seconds: session.seconds,
      savedAt: Date.now()
    });
    clearInterval(state.timerId);
    state.timerId = null;
    document.getElementById("session-choice-dialog")?.remove();
    renderDashboard();
  }

  function discardCurrentSession() {
    writePart("resume", null);
    clearInterval(state.timerId);
    state.timerId = null;
    document.getElementById("session-choice-dialog")?.remove();
    renderDashboard();
  }

  function openExitChoiceDialog() {
    if (!state.session) return renderDashboard();
    if (isUnsavedMode(state.session.mode)) {
      clearInterval(state.timerId);
      state.timerId = null;
      state.session = null;
      return state.collection ? renderCollection(state.collection) : renderDashboard();
    }
    document.getElementById("session-choice-dialog")?.remove();
    document.body.insertAdjacentHTML("beforeend", `
      <div class="session-choice-backdrop" id="session-choice-dialog">
        <section class="session-choice-dialog" role="dialog" aria-modal="true" aria-labelledby="session-choice-title">
          <h2 id="session-choice-title">${tr("exitSessionTitle")}</h2>
          <p>${tr("exitSessionMessage")}</p>
          <div class="session-choice-actions">
            <button class="btn btn-primary" id="save-and-exit" type="button">${tr("saveAndExit")}</button>
            <button class="btn btn-quiet" id="discard-and-exit" type="button">${tr("discardAndExit")}</button>
            <button class="text-button" id="stay-in-session" type="button">${tr("stayHere")}</button>
          </div>
        </section>
      </div>`);
    document.getElementById("save-and-exit").addEventListener("click", saveCurrentSession);
    document.getElementById("discard-and-exit").addEventListener("click", discardCurrentSession);
    document.getElementById("stay-in-session").addEventListener("click", () => document.getElementById("session-choice-dialog")?.remove());
    document.getElementById("save-and-exit").focus();
  }

  function shuffle(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  function formatTime(seconds) {
    const safe = Math.max(0, seconds);
    return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
  }

  function renderQuiz() {
    const session = state.session;
    if (!session) return renderDashboard();
    const q = session.list[session.current];
    const isChecked = Boolean(session.checked[q.id]);
    const selected = session.selected[q.id];
    const optionOrder = session.optionOrders[q.id];
    const progress = (session.current + 1) / session.list.length * 100;
    const options = optionOrder.map((optionIndex, displayIndex) => {
      const option = q.options[optionIndex];
      const isSelected = selected === optionIndex;
      const showCorrect = session.mode !== "exam" && isChecked && optionIndex === q.answer;
      const showWrong = session.mode !== "exam" && isChecked && isSelected && optionIndex !== q.answer;
      const classes = ["option", isSelected ? "is-selected" : "", showCorrect ? "is-correct" : "", showWrong ? "is-wrong" : ""].filter(Boolean).join(" ");
      return `<button class="${classes}" data-option="${optionIndex}" type="button" ${isChecked && session.mode !== "exam" ? "disabled" : ""}><span class="option-letter">${optionLabel(q, displayIndex)}</span><span>${text(option)}</span></button>`;
    }).join("");
    const feedback = session.mode !== "exam" && isChecked ? `
      <div class="feedback is-visible ${selected === q.answer ? "is-good" : "is-bad"}">
        <strong>${selected === q.answer ? tr("correct") : tr("incorrect")} · ${tr("answer")} ${optionLabel(q, optionOrder.indexOf(q.answer))}</strong>
        ${explanationText(q, optionOrder)}
      </div>` : "";
    const practice = practiceRecord();
    const practiceMark = practice[q.id];
    const wrongEntry = wrongBook()[q.id];
    const isFavorite = Boolean(favorites()[q.id]);
    const scenario = (session.mode === "exam" || session.mode === "wrongbook") ? scenarioOf(q) : null;
    const readingGroup = isN2Bank() && q.passageGroupId
      ? bank.passageGroups?.[q.passageGroupId]
      : null;
    const readingPassage = readingGroup?.passages?.[q.id] || readingGroup?.text;
    const scenarioIndexes = scenario ? session.list.map((item, index) => index).filter((index) => scenarioOf(session.list[index])?.id === scenario.id) : [];
    const scenarioIds = scenario ? [...new Set(session.list.map((item) => scenarioOf(item)?.id))] : [];
    const mapIndexes = scenario ? scenarioIndexes : session.list.map((item, index) => index);
    const map = mapIndexes.map((index) => {
      const item = session.list[index];
      const answered = session.selected[item.id] != null;
      return `<button class="map-dot ${index === session.current ? "is-current" : ""} ${answered ? "is-answered" : ""} ${practice[item.id] ? "is-practiced" : ""}" data-jump="${index}" type="button" aria-label="${plain("question")} ${index + 1}">${scenario ? index - scenarioIndexes[0] + 1 : index + 1}</button>`;
    }).join("");
    const n2Domains = isN2Bank()
      ? DOMAINS.map((item) => ({
        id: item.id,
        questions: session.list.map((question, index) => ({ question, index }))
          .filter(({ question }) => question.domain === item.id)
      }))
      : [];
    const n2CurrentDomain = isN2Bank() ? q.domain : null;
    const n2ProblemTitle = (question) => (question.passageGroupId
      ? bank.passageGroups[question.passageGroupId]?.title
      : bank.problems?.find((item) => item.questionIds.includes(question.id))?.title) || "";
    const n2Problems = [];
    if (isN2Bank()) {
      n2Domains.find((item) => item.id === n2CurrentDomain).questions.forEach((entry) => {
        const title = n2ProblemTitle(entry.question);
        let problem = n2Problems.find((item) => item.title === title);
        if (!problem) n2Problems.push(problem = { title, questions: [] });
        problem.questions.push(entry);
      });
    }
    const n2CurrentProblem = isN2Bank() ? n2ProblemTitle(q) : "";
    const n2QuestionMap = (item) => item.questions.map(({ question, index }, tabIndex) => {
      const answered = session.selected[question.id] != null;
      const number = n2CurrentDomain === "listening"
        ? tabIndex + 1
        : question.id.match(/\d+$/)?.[0] || tabIndex + 1;
      return `<button class="map-dot ${index === session.current ? "is-current" : ""} ${answered ? "is-answered" : ""} ${practice[question.id] ? "is-practiced" : ""}" data-jump="${index}" type="button" aria-label="${escapeHtml(n2TabName(n2CurrentDomain))} ${number}" aria-current="${index === session.current ? "step" : "false"}">${number}</button>`;
    }).join("");
    const problemInfo = isN2Bank() ? (readingGroup || bank.problems?.find((item) => item.questionIds.includes(q.id))) : null;
    const readingInstruction = problemInfo?.instruction
      ? `<div class="n2-reading-instruction"><p>${formattedPassageText(problemInfo.instruction)}</p></div>`
      : "";
    const n2Navigation = isN2Bank() ? `
          <div class="n2-section-tabs" role="tablist" aria-label="${plain("questionMap")}">
            ${n2Domains.map((item) => `<button class="n2-section-tab ${item.id === n2CurrentDomain ? "is-active" : ""}" id="n2-tab-${item.id}" type="button" role="tab" aria-selected="${item.id === n2CurrentDomain}" aria-controls="n2-question-map" data-n2-domain="${item.id}" ${item.questions.length ? "" : "disabled"}>${escapeHtml(n2TabName(item.id))}<span>${item.questions.length}</span></button>`).join("")}
          </div>
          <div class="n2-problem-tabs" role="tablist">
            ${n2Problems.map((item) => `<button class="n2-problem-tab ${item.title === n2CurrentProblem ? "is-active" : ""}" type="button" role="tab" aria-selected="${item.title === n2CurrentProblem}" data-n2-problem="${item.questions[0].index}">${escapeHtml(item.title.replace(/^聴解　/, ""))}</button>`).join("")}
          </div>
          ${readingInstruction}
          <div class="n2-question-map" id="n2-question-map" role="tabpanel" aria-labelledby="n2-tab-${n2CurrentDomain}">
            <div class="question-map">${n2QuestionMap(n2Problems.find((item) => item.title === n2CurrentProblem))}</div>
          </div>` : "";
    const n2StemPrefix = () => {
      if (!isN2Bank() || readingGroup) return "";
      if (q.label) return `${q.label}　`;
      const number = q.id.match(/^[LG]-(\d+)$/)?.[1];
      if (number) return `${Number(number)}　`;
      const listening = q.id.match(/^S(\d)-(\d+)([ab])?$/);
      if (!listening) return "";
      const [, part, no, sub] = listening;
      if (part === "5" && sub) return `${Number(no)}番　質問${sub === "a" ? 1 : 2}　`;
      return `${Number(no)}番　`;
    };
    const last = session.current === session.list.length - 1;
    const scenarioLast = scenario && session.current === scenarioIndexes[scenarioIndexes.length - 1];
    const scenarioFirst = scenario && session.current === scenarioIndexes[0];
    const scenarioAnswered = scenario ? scenarioIndexes.filter((index) => session.selected[session.list[index].id] != null).length : 0;
    const steps = scenario ? scenarioIds.map((id, step) => {
      const first = session.list.findIndex((item) => scenarioOf(item)?.id === id);
      return `<button class="scenario-step ${id === scenario.id ? "is-current" : ""}" data-jump="${first}" type="button">${step + 1}</button>`;
    }).join("") : "";
    const sidebar = scenario ? `
        <aside class="card scenario-panel">
          <div class="scenario-steps"><span class="scenario-step-label">${tr("scenarioStepOf", { n: scenarioIds.indexOf(scenario.id) + 1, total: scenarioIds.length })}</span>${steps}</div>
          <h2 class="scenario-title">${text(scenario)}</h2>
          <p class="scenario-desc">${text(scenario.desc)}</p>
          <div class="scenario-progress">${scenarioAnswered} / ${scenarioIndexes.length} ${tr("answeredLabel")}</div>
          <div class="question-map" aria-label="${plain("questionMap")}">${map}</div>
        </aside>` : isN2Bank() ? `
        <aside class="card n2-sidebar">
          ${n2Navigation}
          </aside>
          ${readingGroup ? `<section class="card reading-passage-panel">
              ${readingGroup.label ? `<div class="reading-passage-heading"><h2>${escapeHtml(readingGroup.label)}</h2></div>` : ""}
              <div class="reading-passage-text">${formattedPassageText(readingPassage)}</div>
            </section>` : ""}` : "";
    // Listening: answer every question of the 問題 first, then confirm them all at once.
    const deferredEntries = isN2Bank() && session.mode !== "exam" && q.domain === "listening"
      ? n2Problems.find((item) => item.title === n2CurrentProblem)?.questions || []
      : null;
    const canCheck = deferredEntries
      ? deferredEntries.every(({ question }) => session.selected[question.id] != null)
      : selected != null && !isChecked;

    app.innerHTML = `
      <section class="quiz-wrap ${scenario ? "is-scenario" : isN2Bank() ? "is-n2-quiz" : ""}">
        <div class="quiz-topline">
          <span class="quiz-mode">${modeLabel(session.mode)}</span>
          <div class="quiz-top-actions">${session.mode === "exam" ? `<div class="exam-float"><span class="timer" id="timer" aria-label="${plain("remaining")}">${formatTime(session.seconds)}</span><button class="text-button" id="pause-exam" type="button">⏸ ${tr("pause")}</button></div>` : ""}<button class="text-button" id="exit-quiz" type="button">← ${tr("backHome")}</button></div>
        </div>
        <div class="progress-line" role="progressbar" aria-valuenow="${session.current + 1}" aria-valuemin="1" aria-valuemax="${session.list.length}"><div class="progress-value" style="width:${progress}%"></div></div>
        <div class="${scenario ? "scenario-layout" : isN2Bank() ? `n2-layout ${readingGroup ? "has-reading-passage" : ""}` : ""}">
        ${sidebar}
        <article class="card question-card">
          <div class="question-meta"><div class="question-meta-left"><span class="question-number">${tr("question")} ${scenario ? `${session.current - scenarioIndexes[0] + 1} ${tr("of")} ${scenarioIndexes.length}` : `${session.current + 1} ${tr("of")} ${session.list.length}`} · #${q.id}</span>${practiceMark ? `<span class="practice-mark ${practiceMark.correct ? "is-good" : "is-bad"}">${tr("practicedMark")} · ${practiceMark.correct ? tr("lastCorrect") : tr("lastWrong")}</span>` : ""}${wrongEntry ? `<span class="practice-mark is-bad">${tr("wrongTimes", { n: wrongEntry.mistakes || 0 })}</span><span class="practice-mark is-good">${tr("correctTimes", { n: wrongEntry.correctCount || 0 })}</span>` : ""}</div><div class="question-meta-right"><button class="favorite-toggle ${isFavorite ? "is-on" : ""}" id="toggle-favorite" type="button" aria-pressed="${isFavorite}">${isFavorite ? "★" : "☆"} ${isFavorite ? tr("favorited") : tr("favorite")}</button><span class="topic-pill">${text(domain(q.domain))}</span></div></div>
          <p class="question-text">${formattedPassageText(readingGroup?.questionPrompts?.[q.id] || "") || `${escapeHtml(n2StemPrefix())}${text(q.prompt)}`}</p>
          <div class="options">${options}</div>
          <div class="quiz-controls">
            <button class="btn btn-quiet" id="prev-question" type="button" ${session.current === 0 || scenarioFirst ? "disabled" : ""}>← ${tr("previous")}</button>
            <div class="right-controls">
              ${session.mode !== "exam" && !isChecked ? `<button class="btn btn-primary" id="check-answer" type="button" ${canCheck ? "" : "disabled"}>${tr("check")}</button>` : ""}
              ${(session.mode === "exam" || isChecked || deferredEntries) ? `<button class="btn btn-primary" id="next-question" type="button">${last ? tr("finish") : scenarioLast ? tr("nextScenario") : tr("next")} →</button>` : ""}
            </div>
          </div>
          ${feedback}
        </article>
        </div>
        ${scenario || isN2Bank() ? "" : `<div class="question-map" aria-label="${plain("questionMap")}">${map}</div>`}
      </section>`;

    app.querySelectorAll("[data-n2-problem]").forEach((button) => button.addEventListener("click", () => {
      session.current = Number(button.dataset.n2Problem);
      renderQuiz();
    }));
    app.querySelectorAll("[data-n2-domain]").forEach((button) => button.addEventListener("click", () => {
      const firstQuestion = n2Domains.find((item) => item.id === button.dataset.n2Domain)?.questions[0];
      if (firstQuestion) {
        session.current = firstQuestion.index;
        renderQuiz();
      }
    }));
    app.querySelectorAll("[data-option]").forEach((button) => button.addEventListener("click", () => {
      if (session.mode !== "exam" && isChecked) return;
      session.selected[q.id] = Number(button.dataset.option);
      renderQuiz();
    }));
    app.querySelectorAll("[data-jump]").forEach((button) => button.addEventListener("click", () => { session.current = Number(button.dataset.jump); renderQuiz(); }));
    document.getElementById("prev-question").addEventListener("click", () => { session.current -= 1; renderQuiz(); });
    document.getElementById("exit-quiz").addEventListener("click", openExitChoiceDialog);
    document.getElementById("pause-exam")?.addEventListener("click", pauseExam);
    document.getElementById("toggle-favorite").addEventListener("click", () => toggleFavorite(q.id));
    const checkButton = document.getElementById("check-answer");
    if (checkButton) checkButton.addEventListener("click", () => {
      (deferredEntries ? deferredEntries.map((entry) => entry.question) : [q]).forEach((question) => {
        if (session.checked[question.id]) return;
        session.checked[question.id] = true;
        recordAnswer(question, session.selected[question.id], session.mode);
      });
      renderQuiz();
    });
    const nextButton = document.getElementById("next-question");
    if (nextButton) nextButton.addEventListener("click", () => {
      if (last) finishQuiz(false);
      else { session.current += 1; renderQuiz(); }
    });
  }

  function finishQuiz(timeUp) {
    const session = state.session;
    if (!session) return;
    const unanswered = session.list.filter((q) => session.selected[q.id] == null).length;
    if (!timeUp && session.mode === "exam" && unanswered > 0 && !window.confirm(plain("finishConfirm"))) return;
    if (!timeUp && session.mode !== "exam" && !isUnsavedMode(session.mode) && !window.confirm(plain("endConfirm"))) return;
    if (!isUnsavedMode(session.mode)) writePart("resume", null);
    clearInterval(state.timerId);
    state.timerId = null;
    document.getElementById("pause-dialog")?.remove();
    if (session.mode !== "exam" && isN2Bank()) {
      session.list.forEach((question) => {
        if (question.domain !== "listening" || session.checked[question.id] || session.selected[question.id] == null) return;
        session.checked[question.id] = true;
        recordAnswer(question, session.selected[question.id], session.mode);
      });
    }
    if (session.mode === "exam") {
      session.list.forEach((question) => {
        if (session.selected[question.id] != null) recordAnswer(question, session.selected[question.id], session.mode);
      });
    }
    const correct = session.list.filter((q) => session.selected[q.id] === q.answer).length;
    const percentage = Math.round(correct / session.list.length * 100);
    const isExam = session.mode === "exam";
    const n2Estimate = isN2Bank() ? n2ScoreEstimate(session.list, session.selected) : null;
    const scored = isExam || Boolean(n2Estimate);
    const score = n2Estimate ? n2Estimate.score : isExam ? Math.round(correct / session.list.length * 1000) : percentage;
    const scoreMax = n2Estimate ? bank.scoring.scaleMax : 1000;
    const scoreDisplay = scored ? `${score} / ${scoreMax}` : `${score}%`;
    const oldStats = stats();
    const bestKey = n2Estimate ? "bestN2Estimate" : "bestExam";
    const improved = isExam && (oldStats[bestKey] == null || score > oldStats[bestKey]);
    if (isExam) {
      writePart("stats", { ...oldStats, [bestKey]: Math.max(oldStats[bestKey] || 0, score), attempts: (oldStats.attempts || 0) + 1 });
    }
    const message = percentage >= 80 ? tr("strong") : percentage >= 60 ? tr("good") : tr("keepGoing");
    const review = session.list.map((q, index) => {
      const picked = session.selected[q.id];
      const ok = picked === q.answer;
      const optionOrder = session.optionOrders[q.id];
      const pickedText = picked == null ? tr("unanswered") : `${optionLabel(q, optionOrder.indexOf(picked))}. ${text(q.options[picked])}`;
      const answerText = `${optionLabel(q, optionOrder.indexOf(q.answer))}. ${text(q.options[q.answer])}`;
      return `<div class="result-item"><div class="result-item-head"><span>${index + 1}. ${text(domain(q.domain))}</span><span style="color:${ok ? "var(--green)" : "var(--red)"}">${ok ? tr("correct") : tr("incorrect")}</span></div><p><strong>${tr("selected")}:</strong> ${pickedText}<br><strong>${tr("correctOption")}:</strong> ${answerText}<br><strong>${tr("explanation")}:</strong> ${explanationText(q, optionOrder)}</p></div>`;
    }).join("");
    app.innerHTML = `
      <section class="result-wrap">
        <div class="card result-hero">
          <div class="eyebrow">${tr("resultTitle")}</div>
          <div class="score-ring" style="--score:${scored ? score / scoreMax * 100 : percentage}%"><span class="score-number ${scored ? "is-points" : ""}">${scoreDisplay}</span></div>
          <p class="result-subtitle">${correct} / ${session.list.length} ${tr("correctCount")}${n2Estimate ? `　·　${tr("n2Estimated")}` : isExam ? `　·　${score >= 720 ? tr("pass") : tr("fail")}` : `　·　${message}`}</p>
          ${n2Estimate ? `<p class="result-subtitle">${tr("n2WeightedPoints", n2Estimate)}<br>${tr("n2EstimateNote")}</p>
          <div class="n2-section-scores">
            ${n2Estimate.sections.map((item) => {
              const label = tr(`n2Sec${item.key[0].toUpperCase()}${item.key.slice(1)}`);
              const low = item.score != null && item.score < bank.scoring.sectionMin;
              return `<div class="n2-section-score ${low ? "is-low" : ""}"><span>${label}</span><strong>${item.score == null ? "–" : item.score} / ${item.scoreMax}</strong></div>`;
            }).join("")}
            <div class="n2-section-score is-total"><span>${tr("n2Total")}</span><strong>${n2Estimate.complete ? n2Estimate.score : "–"} / ${bank.scoring.scaleMax}</strong></div>
          </div>
          <p class="result-subtitle">${tr("n2PassRule", { pass: bank.scoring.passTotal, min: bank.scoring.sectionMin })}${n2Estimate.complete ? `<br><b>${n2Estimate.passed ? tr("n2Pass") : tr("n2Fail")}</b>` : `<br>${tr("n2Partial")}`}</p>` : ""}
          ${improved ? `<p class="result-subtitle" style="color:var(--purple);margin-top:8px">✦ ${tr("scoreSaved")}</p>` : ""}
          ${timeUp ? `<p class="result-subtitle" style="margin-top:8px">${tr("timeUp")}</p>` : ""}
          <div class="result-actions"><button class="btn btn-primary" id="retry" type="button">${tr("retry")}</button><button class="btn btn-quiet" id="go-home" type="button">${tr("home")}</button></div>
          <div class="result-details"><div class="card-heading"><h2>${tr("review")}</h2><span class="topic-pill">${session.list.length} ${tr("completed")}</span></div>${review}</div>
        </div>
      </section>`;
    document.getElementById("go-home").addEventListener("click", renderDashboard);
    document.getElementById("retry").addEventListener("click", () => startQuiz(session.mode));
  }

  function migrateLegacyData() {
    if (localStorage.getItem(DATA_KEY) != null) return;
    const scope = {};
    Object.entries(LEGACY_KEYS).forEach(([part, key]) => {
      try {
        const value = JSON.parse(localStorage.getItem(key) || "null");
        if (value != null) scope[part] = value;
      } catch {}
    });
    const data = Object.keys(scope).length ? { default: { [BUILTIN_BANK_ID]: scope } } : {};
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }

  // One-time repair: earlier versions overwrote the practice record when a question was re-answered
  // (e.g. in the wrong-answer notebook). A question still in the notebook was answered wrong at least once,
  // so restore its first-attempt mark to "wrong". Backs up the data first and runs only once.
  function restoreFirstAttempts() {
    const FLAG = "ccarf-first-attempt-restored";
    if (localStorage.getItem(FLAG)) return;
    try {
      const raw = localStorage.getItem(DATA_KEY);
      if (raw) {
        localStorage.setItem(`${DATA_KEY}-backup-${Date.now()}`, raw);
        const data = JSON.parse(raw);
        let fixed = 0;
        Object.values(data).forEach((profile) => Object.values(profile || {}).forEach((bank) => {
          Object.entries(bank.wrongBook || {}).forEach(([id, entry]) => {
            const practice = (bank.practice ??= {});
            if (!practice[id] || practice[id].correct) {
              practice[id] = { correct: false, answeredAt: entry.lastWrong || Date.now() };
              fixed += 1;
            }
          });
        }));
        localStorage.setItem(DATA_KEY, JSON.stringify(data));
        console.info(`First-attempt records restored for ${fixed} question(s).`);
      }
      localStorage.setItem(FLAG, "1");
    } catch {}
  }

  function loadProfiles() {
    try {
      const saved = JSON.parse(localStorage.getItem(PROFILES_KEY) || "null");
      if (saved && Array.isArray(saved.list) && saved.list.length) {
        return saved.list.some((item) => item.id === saved.active) ? saved : { ...saved, active: saved.list[0].id };
      }
    } catch {}
    return { active: "default", list: [{ id: "default", name: "Default" }] };
  }

  function saveProfiles() {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  }

  function switchProfile(id) {
    if (!profiles.list.some((item) => item.id === id)) return;
    profiles.active = id;
    saveProfiles();
    state.profileId = id;
    renderDashboard();
  }

  function addProfile() {
    const name = (window.prompt(plain("newProfilePrompt")) || "").trim();
    if (!name) return;
    const id = `p-${Date.now().toString(36)}`;
    profiles.list.push({ id, name });
    saveProfiles();
    switchProfile(id);
  }

  function deleteProfile() {
    const current = profiles.list.find((item) => item.id === state.profileId);
    if (!current || profiles.list.length < 2) return;
    if (!window.confirm(plain("deleteProfileConfirm").replace("{name}", profileName(current)))) return;
    profiles.list = profiles.list.filter((item) => item.id !== current.id);
    profiles.active = profiles.list[0].id;
    saveProfiles();
    const data = readData();
    delete data[current.id];
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
    state.profileId = profiles.active;
    renderDashboard();
  }

  const { loadImportedBanks, saveImportedBank, removeImportedBank, normalizeBank, purgeBankProgress } = window.BankStore;

  function activate(next) {
    clearInterval(state.timerId);
    state.timerId = null;
    state.session = null;
    bank = next;
    state.bankId = next.id;
    QUESTION_BANK = next.questions;
    DOMAINS = next.domains;
    state.selectedDomain = "all";
    localStorage.setItem(BANK_KEY, next.id);
  }

  function switchBank(id) {
    const next = banks.find((item) => item.id === id);
    if (!next) return;
    activate(next);
    renderDashboard();
  }

  async function deleteBank() {
    if (bank.builtin || !window.confirm(plain("deleteBankConfirm"))) return;
    try {
      await removeImportedBank(bank.id);
    } catch {
      state.notice = { text: plain("storageUnavailable"), error: true };
      return renderDashboard();
    }
    purgeBankProgress(bank.id);
    banks = banks.filter((item) => item.id !== bank.id);
    activate(banks[0]);
    renderDashboard();
  }

  async function boot() {
    migrateLegacyData();
    restoreFirstAttempts();
    profiles = loadProfiles();
    state.profileId = profiles.active;
    let imported = [];
    try {
      imported = await loadImportedBanks();
    } catch {
      state.notice = { text: plain("storageUnavailable"), error: true };
    }
    banks = [builtinBank(), ...n2BuiltinBanks(), ...imported].filter(Boolean);
    activate(banks.find((item) => item.id === localStorage.getItem(BANK_KEY)) || banks[0]);
    document.querySelectorAll(".language-button").forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.language)));
    document.getElementById("home-link").addEventListener("click", (event) => {
      event.preventDefault();
      state.collection = null;
    if (state.session && !document.getElementById("retry")) openExitChoiceDialog();
      else renderDashboard();
    });
    setLanguage(state.language);
  }

  boot();
})();

// Question-bank storage and validation, shared by the practice screen (index.html) and the import screen (import.html).
(() => {
  const BANK_DB = "ccarf-banks";
  const DATA_KEY = "ccarf-data";
  const openBankDb = () => new Promise((resolve, reject) => {
    const request = indexedDB.open(BANK_DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore("banks", { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  const withBankStore = async (mode, run) => {
    const db = await openBankDb();
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction("banks", mode);
        const request = run(tx.objectStore("banks"));
        tx.oncomplete = () => resolve(request?.result);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      });
    } finally {
      db.close();
    }
  };
  const loadImportedBanks = () => withBankStore("readonly", (store) => store.getAll());
  const saveImportedBank = (item) => withBankStore("readwrite", (store) => store.put(item));
  const removeImportedBank = (id) => withBankStore("readwrite", (store) => store.delete(id));

  const localized = (value) => {
    if (typeof value === "string") return value.trim() ? { en: value } : null;
    if (value && typeof value.en === "string" && value.en.trim()) return { en: value.en, ja: value.ja || undefined, zh: value.zh || undefined };
    return null;
  };

  // ---- JLPT N2 format ("type": "jlpt-n2") ---------------------------------------------------------
  const N2_SECTIONS = {
    "language-knowledge": { scoreSection: "knowledgeGrammar", prefix: "L", label: { en: "Language Knowledge (Vocabulary and Kanji)", ja: "言語知識（文字・語彙）", zh: "语言知识（文字・词汇）" } },
    grammar: { scoreSection: "knowledgeGrammar", prefix: "G", label: { en: "文法", ja: "文法" } },
    reading: { scoreSection: "reading", prefix: "R", label: { en: "読解", ja: "読解" } },
    listening: { scoreSection: "listening", prefix: "S", label: { en: "聴解", ja: "聴解" } }
  };
  const N2_STANDARD_RAW_MAX = { knowledgeGrammar: 58, reading: 57, listening: 58 };
  const pad2 = (value) => (/^\d+$/.test(String(value)) ? String(value).padStart(2, "0") : String(value));
  const plainString = (value) => (typeof value === "string" ? value : "");
  // {漢字|よみ} becomes ruby; （注１） becomes a superscript unless the line starts with it (footnote lines).
  const n2Markup = (value) => plainString(value)
    .replace(/\{([^{}|]+)\|([^{}|]+)\}/g, "<ruby>$1<rt>$2</rt></ruby>")
    .split("\n").map((line) => (/^（注[０-９0-9]+）/.test(line) ? line : line.replace(/(?<!<sup>)（注[０-９0-9]+）(?!<\/sup>)/g, "<sup>$&</sup>"))).join("\n");

  function normalizeN2Bank(raw, fileName) {
    if (!Array.isArray(raw.sections) || !raw.sections.length) throw new Error('A "jlpt-n2" file needs a non-empty "sections" array.');
    const questions = [];
    const problems = [];
    const passageGroups = {};
    const warnings = [];
    const ids = new Set();
    const totals = {};
    const seenSections = new Set();
    const baseName = fileName.replace(/\.json$/i, "");
    const name = typeof raw.name === "string" && raw.name.trim()
      ? { en: raw.name, ja: raw.name, zh: raw.name }
      : localized(raw.name) || { en: baseName, ja: baseName };

    raw.sections.forEach((section, sIndex) => {
      const sWhere = `sections[${sIndex}]`;
      const meta = N2_SECTIONS[section?.id];
      if (!meta) throw new Error(`${sWhere}: "id" must be one of ${Object.keys(N2_SECTIONS).join(", ")}.`);
      if (seenSections.has(section.id)) throw new Error(`${sWhere}: section "${section.id}" appears twice.`);
      seenSections.add(section.id);
      if (!Array.isArray(section.problems) || !section.problems.length) throw new Error(`${sWhere} needs a non-empty "problems" array.`);
      const listening = section.id === "listening";
      section.problems.forEach((problem, pIndex) => {
        const pWhere = `${sWhere}.problems[${pIndex}]`;
        if (!problem || typeof problem.title !== "string" || !problem.title.trim()) throw new Error(`${pWhere} needs a "title" such as "問題１".`);
        const title = listening && !problem.title.startsWith("聴解") ? `聴解　${problem.title}` : problem.title;
        const problemNo = (problem.title.match(/[0-9０-９]+/)?.[0] || String(pIndex + 1)).replace(/[０-９]/g, (digit) => String(digit.charCodeAt(0) - 65296));
        const instruction = n2Markup(problem.instruction);
        const weight = problem.weight;
        if (weight != null && !(typeof weight === "number" && weight > 0)) throw new Error(`${pWhere}: "weight" must be a positive number (points per question).`);
        if (weight == null) warnings.push(`${pWhere} (${problem.title}): no "weight", so 1 point per question is used.`);
        const hasQuestions = Array.isArray(problem.questions) && problem.questions.length > 0;
        const hasPassages = Array.isArray(problem.passages) && problem.passages.length > 0;
        if (!hasQuestions && !hasPassages) throw new Error(`${pWhere} needs either "questions" or "passages".`);
        // Shared questions (e.g. 問題12: AとB together): "questions" beside "passages", so every passage joins one block.
        const sharedQuestions = hasQuestions && hasPassages;
        if (sharedQuestions && problem.passages.some((passage) => Array.isArray(passage?.questions) && passage.questions.length)) {
          throw new Error(`${pWhere}: when "questions" sits beside "passages", the passages must not have their own "questions".`);
        }
        const joinPassages = (list) => list.map((passage) => {
          const label = passage?.label ? (/^[A-Za-z]$/.test(String(passage.label)) ? `【${passage.label}】` : String(passage.label)) : "";
          return [label, plainString(passage?.text)].filter(Boolean).join("\n");
        }).join("\n\n");
        // A passage without questions (e.g. A in 問題12) joins the next passage that has questions.
        const mergePassages = () => {
          const merged = [];
          let pending = [];
          problem.passages.forEach((passage, index) => {
            if (!Array.isArray(passage?.questions) || !passage.questions.length) {
              pending.push(passage);
              if (index === problem.passages.length - 1) throw new Error(`${pWhere}.passages[${index}] needs a non-empty "questions" array (a passage without questions joins the next passage, but this is the last one).`);
              return;
            }
            merged.push(pending.length ? { text: joinPassages([...pending, passage]), questions: passage.questions } : passage);
            pending = [];
          });
          return merged;
        };
        const blocks = sharedQuestions ? [{ text: joinPassages(problem.passages), questions: problem.questions }] : hasPassages ? mergePassages() : [{ questions: problem.questions }];
        const problemIds = [];
        blocks.forEach((block, bIndex) => {
          const bWhere = hasPassages ? `${pWhere}.passages[${bIndex}]` : pWhere;
          if (hasPassages && !plainString(block.text).trim()) throw new Error(`${bWhere} needs "text" (the passage).`);
          if (!Array.isArray(block.questions) || !block.questions.length) throw new Error(`${bWhere} needs a non-empty "questions" array.`);
          const blockIds = [];
          const prompts = {};
          block.questions.forEach((item, qIndex) => {
            const where = `${bWhere}.questions[${qIndex}]`;
            if (!item || item.no == null || item.no === "") throw new Error(`${where} needs "no" (the number printed on the paper, e.g. 1 or "2a").`);
            const id = listening ? `S${problemNo}-${pad2(item.no)}` : `${meta.prefix}-${pad2(item.no)}`;
            if (ids.has(id)) throw new Error(`${where}: duplicate question number ${item.no}.`);
            ids.add(id);
            const stem = n2Markup(item.prompt);
            if (!stem.trim() && !listening) throw new Error(`${where} needs "prompt".`);
            if (!Array.isArray(item.options) || item.options.length < 2) throw new Error(`${where} needs at least two "options".`);
            if (item.options.some((option) => typeof option !== "string")) throw new Error(`${where}: every option must be a string.`);
            if (!listening && item.options.some((option) => !option.trim())) throw new Error(`${where} has an empty option (only listening questions may have blank options).`);
            const answer = Number(item.answer) - 1;
            if (!Number.isInteger(answer) || answer < 0 || answer >= item.options.length) throw new Error(`${where}: "answer" must be the printed choice number, 1 to ${item.options.length}.`);
            const points = item.weight != null ? item.weight : (weight ?? 1);
            if (!(typeof points === "number" && points > 0)) throw new Error(`${where}: "weight" must be a positive number.`);
            const shown = hasPassages ? `問題${item.no}　${stem}` : stem;
            const explanation = plainString(item.explanation);
            const question = {
              id,
              domain: section.id,
              category: { en: problem.title, ja: problem.title },
              prompt: { en: shown, ja: shown },
              options: item.options.map((option) => { const markup = n2Markup(option); return { en: markup, ja: markup }; }),
              answer,
              explanation: { en: explanation, ja: explanation },
              explanationSource: explanation,
              scoreSection: meta.scoreSection,
              scoreWeight: points
            };
            if (!hasPassages) question.label = item.label != null ? String(item.label) : listening ? `${item.no}番` : String(item.no);
            totals[meta.scoreSection] = (totals[meta.scoreSection] || 0) + points;
            questions.push(question);
            blockIds.push(id);
            prompts[id] = shown;
          });
          problemIds.push(...blockIds);
          if (hasPassages) {
            const groupId = `${section.id}-${pIndex + 1}-${bIndex + 1}`;
            passageGroups[groupId] = {
              questionIds: blockIds,
              title,
              label: block.label ? String(block.label) : undefined,
              instruction,
              text: n2Markup(block.text),
              questionPrompts: prompts
            };
            blockIds.forEach((id) => { questions.find((question) => question.id === id).passageGroupId = groupId; });
          }
        });
        if (!hasPassages) problems.push({ title, instruction, questionIds: problemIds });
      });
    });

    const sections = {};
    Object.keys(N2_STANDARD_RAW_MAX).forEach((key) => {
      const total = Math.round((totals[key] || 0) * 10) / 10;
      sections[key] = { rawMax: total, scoreMax: 60 };
      if (totals[key] != null && Math.abs(total - N2_STANDARD_RAW_MAX[key]) > 0.05) {
        warnings.push(`Section "${key}" adds up to ${total} points (the usual total is ${N2_STANDARD_RAW_MAX[key]}). Check the "weight" values.`);
      }
    });
    const domains = Object.entries(N2_SECTIONS)
      .filter(([id]) => seenSections.has(id))
      .map(([id, meta]) => ({ id, ...meta.label, weight: questions.filter((question) => question.domain === id).length }));
    return {
      id: `imported-${Date.now().toString(36)}`,
      builtin: false,
      type: "jlpt-n2",
      name,
      domains,
      questions,
      problems,
      passageGroups,
      scoring: { scaleMax: 180, passTotal: 90, sectionMin: 19, sections },
      warnings
    };
  }

  // Validates a user-supplied bank and converts it to the internal shape; throws a readable error otherwise.
  function normalizeBank(raw, fileName) {
    if (raw && !Array.isArray(raw) && raw.type === "jlpt-n2") return normalizeN2Bank(raw, fileName);
    const source = Array.isArray(raw) ? raw : raw?.questions;
    if (!Array.isArray(source) || !source.length) throw new Error('The file needs a non-empty "questions" array.');
    const seen = new Set();
    const questions = source.map((item, index) => {
      const where = `questions[${index}]`;
      if (!item || item.id == null) throw new Error(`${where} needs an "id".`);
      if (seen.has(String(item.id))) throw new Error(`${where}: duplicate id ${item.id}.`);
      seen.add(String(item.id));
      if (item.domain == null || item.domain === "") throw new Error(`${where} needs a "domain".`);
      const prompt = localized(item.prompt);
      if (!prompt) throw new Error(`${where} needs "prompt" text (at least "en").`);
      if (!Array.isArray(item.options) || item.options.length < 2) throw new Error(`${where} needs at least two "options".`);
      const options = item.options.map((option) => localized(option));
      if (options.some((option) => !option)) throw new Error(`${where} has an empty option.`);
      const letter = typeof item.answer === "string" ? item.answer.trim().toUpperCase() : "";
      const answer = /^[A-Z]$/.test(letter) ? letter.charCodeAt(0) - 65 : item.answer;
      if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) throw new Error(`${where} has an invalid "answer" (use a letter such as "B", or a 0-based index).`);
      return {
        id: item.id,
        domain: String(item.domain),
        category: localized(item.category) || { en: String(item.domain) },
        prompt,
        options,
        answer,
        explanation: localized(item.explanation) || { en: "" }
      };
    });
    const labels = new Map();
    (Array.isArray(raw?.domains) ? raw.domains : []).forEach((item) => {
      const label = localized(item);
      if (item?.id != null && label) labels.set(String(item.id), label);
    });
    questions.forEach((question) => { if (!labels.has(question.domain)) labels.set(question.domain, question.category); });
    const domains = [...labels]
      .map(([id, label]) => ({ id, ...label, weight: questions.filter((question) => question.domain === id).length }))
      .filter((item) => item.weight > 0);
    return {
      id: `imported-${Date.now().toString(36)}`,
      builtin: false,
      name: localized(raw?.name) || { en: fileName.replace(/\.json$/i, "") },
      domains,
      questions
    };
  }

  // Removes the saved progress of one bank for every profile.
  function purgeBankProgress(id) {
    let data = {};
    try { data = JSON.parse(localStorage.getItem(DATA_KEY) || "{}"); } catch {}
    Object.values(data).forEach((scope) => delete scope[id]);
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }
  window.BankStore = { loadImportedBanks, saveImportedBank, removeImportedBank, normalizeBank, purgeBankProgress };
})();

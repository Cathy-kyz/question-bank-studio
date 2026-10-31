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

  // Validates a user-supplied bank and converts it to the internal shape; throws a readable error otherwise.
  function normalizeBank(raw, fileName) {
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

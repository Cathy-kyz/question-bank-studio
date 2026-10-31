(() => {
  const { normalizeBank, saveImportedBank, loadImportedBanks, removeImportedBank, purgeBankProgress } = window.BankStore;
  const LANG_KEY = "ccarf-language";
  const BANK_KEY = "ccarf-active-bank";

  const SAMPLE = {
    name: { en: "Sample practice set", ja: "サンプル問題集", zh: "示例题库" },
    domains: [
      { id: "basics", en: "Basics", ja: "基礎", zh: "基础" },
      { id: "advanced", en: "Advanced", ja: "応用", zh: "进阶" }
    ],
    questions: [
      {
        id: 1,
        domain: "basics",
        prompt: { en: "Which option is correct?", ja: "正しい選択肢はどれですか？", zh: "哪个选项是正确的？" },
        options: [{ en: "No" }, { en: "Yes", ja: "はい", zh: "是" }, { en: "Maybe" }],
        answer: "B",
        explanation: { en: "Option B is correct.", ja: "正解はBです。", zh: "正确答案是 B。" }
      },
      {
        id: 2,
        domain: "basics",
        prompt: "Plain strings are also accepted for prompts and options.",
        options: ["True", "False"],
        answer: 0,
        explanation: "Answer 0 means the first option."
      },
      {
        id: 3,
        domain: "advanced",
        prompt: { en: "Pick D for this question.", ja: "この問題の答えはDです。" },
        options: [{ en: "A" }, { en: "B" }, { en: "C" }, { en: "D" }],
        answer: "D",
        explanation: { en: "Option D is correct." }
      }
    ]
  };
  const SAMPLE_TEXT = JSON.stringify(SAMPLE, null, 2);

  const FIELDS = [
    { field: "name", req: "optional", desc: { ja: "問題集の名前。文字列、または en / ja / zh を持つオブジェクト。省略時はファイル名。", en: "Name of the bank. A string, or an object with en / ja / zh. Defaults to the file name.", zh: "题库名称。字符串，或包含 en / ja / zh 的对象。省略时使用文件名。" } },
    { field: "domains", req: "optional", desc: { ja: "領域の一覧 [{ id, en, ja?, zh? }]。省略時は各問題の category を領域名にします。", en: "List of domains [{ id, en, ja?, zh? }]. If omitted, each question's category is used as its domain name.", zh: "领域列表 [{ id, en, ja?, zh? }]。省略时使用各题的 category 作为领域名。" } },
    { field: "questions[].id", req: "required", desc: { ja: "問題番号。問題集の中で一意にしてください（進捗の管理に使います）。", en: "Question number. Must be unique within the bank (progress is tracked by it).", zh: "题号。在同一题库内必须唯一（做题进度按此记录）。" } },
    { field: "questions[].domain", req: "required", desc: { ja: "その問題が属する領域のID。", en: "ID of the domain this question belongs to.", zh: "该题所属领域的 ID。" } },
    { field: "questions[].category", req: "optional", desc: { ja: "領域名。domains を省略したときに領域の表示名として使います。", en: "Display name of the domain. Used when domains is omitted.", zh: "领域名称。省略 domains 时用作领域的显示名。" } },
    { field: "questions[].prompt", req: "required", desc: { ja: "問題文。文字列、または en / ja / zh のオブジェクト。en は必須。", en: "Question text. A string, or an object with en / ja / zh. en is required.", zh: "题干。字符串，或 en / ja / zh 对象。en 必填。" } },
    { field: "questions[].options", req: "required", desc: { ja: "選択肢の配列（2つ以上）。各要素は文字列、または en / ja / zh のオブジェクト。", en: "Array of choices (at least 2). Each item is a string, or an object with en / ja / zh.", zh: "选项数组（至少 2 个）。每项为字符串，或 en / ja / zh 对象。" } },
    { field: "questions[].answer", req: "required", desc: { ja: "正解。\"A\"、\"B\" などの文字、または 0 から始まる番号（0 は最初の選択肢）。", en: "Correct choice: a letter such as \"A\" or \"B\", or a 0-based index (0 is the first choice).", zh: "正确答案：\"A\"、\"B\" 等字母，或从 0 开始的序号（0 为第一个选项）。" } },
    { field: "questions[].explanation", req: "optional", desc: { ja: "解説。文字列、または en / ja / zh のオブジェクト。", en: "Explanation. A string, or an object with en / ja / zh.", zh: "解析。字符串，或 en / ja / zh 对象。" } }
  ];

  const T = {
    ja: {
      eyebrow: "問題集の管理", title: "問題集をインポート", lead: "JSONファイルから問題集を取り込みます。取り込む前に内容を確認できます。",
      pickHeading: "ファイルを選ぶ", dropText: "JSONファイルをここにドラッグするか、ボタンから選んでください。", pickButton: "ファイルを選択",
      savedHeading: "取り込み済みの問題集", savedHint: "問題集を削除すると、その問題集の進捗もすべて消去されます。", openPractice: "練習画面を開く →",
      formatHeading: "ファイルの形式", formatIntro: "ファイルは JSON 形式で、トップレベルに questions（問題の配列）が必要です。問題の配列だけのファイルも取り込めます。",
      colField: "項目", colRequired: "必須", colDesc: "内容", reqRequired: "必須", reqOptional: "任意", formatNote: "各テキスト項目は、文字列でも { \"en\": \"...\", \"ja\": \"...\", \"zh\": \"...\" } の形でも書けます。日本語・中国語が無い場合は英語を表示します。",
      sampleHeading: "サンプル", sampleIntro: "このまま保存して試せる例です。内容をコピーして書き換えると、自分の問題集を作れます。",
      copySample: "コピー", copied: "コピーしました", copyFailed: "コピーできませんでした", downloadSample: "sample-bank.json をダウンロード",
      previewName: "問題集名", previewQuestions: "問題数", previewDomains: "領域", saveBank: "この問題集を保存して選択", cancel: "キャンセル",
      saved: "保存しました。練習画面でこの問題集が選択されています。", importFailed: "取り込めませんでした：", notJson: "JSONとして読み込めません：",
      deleteBank: "削除", deleteConfirm: "この問題集と、保存された進捗をすべて削除しますか？", noBanks: "取り込み済みの問題集はありません。",
      active: "選択中", questionsUnit: "問", footer: "問題集のインポート", saveFailed: "保存できませんでした。このブラウザーでは問題集を保存できない可能性があります。"
    },
    en: {
      eyebrow: "Manage question banks", title: "Import a question bank", lead: "Load a question bank from a JSON file. You can review it before saving.",
      pickHeading: "Choose a file", dropText: "Drag a JSON file here, or choose one with the button.", pickButton: "Choose file",
      savedHeading: "Imported question banks", savedHint: "Deleting a bank also removes all progress saved for it.", openPractice: "Open practice →",
      formatHeading: "File format", formatIntro: "The file is JSON and needs a top-level \"questions\" array. A file that is only an array of questions is also accepted.",
      colField: "Field", colRequired: "Required", colDesc: "Description", reqRequired: "Required", reqOptional: "Optional", formatNote: "Text fields can be a string or an object such as { \"en\": \"...\", \"ja\": \"...\", \"zh\": \"...\" }. Missing languages fall back to English.",
      sampleHeading: "Sample", sampleIntro: "An example you can save and try as it is. Copy it and edit it to make your own bank.",
      copySample: "Copy", copied: "Copied", copyFailed: "Could not copy", downloadSample: "Download sample-bank.json",
      previewName: "Bank name", previewQuestions: "Questions", previewDomains: "Domains", saveBank: "Save and select this bank", cancel: "Cancel",
      saved: "Saved. This bank is now selected in the practice screen.", importFailed: "Import failed:", notJson: "Not valid JSON:",
      deleteBank: "Delete", deleteConfirm: "Delete this bank and all progress saved for it?", noBanks: "No imported question banks yet.",
      active: "Selected", questionsUnit: "questions", footer: "Question bank import", saveFailed: "Could not save. This browser may not support storing question banks."
    },
    zh: {
      eyebrow: "题库管理", title: "导入题库", lead: "从 JSON 文件导入题库。保存前可以先检查内容。",
      pickHeading: "选择文件", dropText: "将 JSON 文件拖到这里，或使用按钮选择。", pickButton: "选择文件",
      savedHeading: "已导入的题库", savedHint: "删除题库时，该题库保存的全部做题进度也会被清除。", openPractice: "打开练习画面 →",
      formatHeading: "文件格式", formatIntro: "文件为 JSON 格式，顶层需要 questions（题目数组）。只包含题目数组的文件也可以导入。",
      colField: "字段", colRequired: "是否必填", colDesc: "说明", reqRequired: "必填", reqOptional: "可选", formatNote: "文本字段可以写成字符串，也可以写成 { \"en\": \"...\", \"ja\": \"...\", \"zh\": \"...\" } 的形式。缺少的语言会显示英文。",
      sampleHeading: "示例", sampleIntro: "可直接保存试用的示例。复制后修改内容，即可制作自己的题库。",
      copySample: "复制", copied: "已复制", copyFailed: "复制失败", downloadSample: "下载 sample-bank.json",
      previewName: "题库名称", previewQuestions: "题数", previewDomains: "领域", saveBank: "保存并选择此题库", cancel: "取消",
      saved: "已保存。练习画面已选中此题库。", importFailed: "导入失败：", notJson: "无法作为 JSON 读取：",
      deleteBank: "删除", deleteConfirm: "确定删除此题库及其保存的全部进度吗？", noBanks: "还没有导入的题库。",
      active: "当前选择", questionsUnit: "题", footer: "题库导入", saveFailed: "无法保存。此浏览器可能不支持保存题库。"
    }
  };

  let lang = ["en", "ja", "zh"].includes(localStorage.getItem(LANG_KEY)) ? localStorage.getItem(LANG_KEY) : "ja";
  let pending = null;
  let notice = null;
  const t = (key) => (T[lang] || T.ja)[key] ?? T.en[key] ?? key;
  const pick = (value) => (value && typeof value === "object" ? value[lang] || value.en : value) || "";
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  const preview = document.getElementById("preview");
  const savedList = document.getElementById("saved-list");

  function applyStaticText() {
    document.documentElement.lang = lang === "ja" ? "ja" : lang === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll(".language-button").forEach((button) => button.classList.toggle("is-active", button.dataset.lang === lang));
    document.getElementById("format-rows").innerHTML = FIELDS.map((item) => `
      <tr>
        <td><code>${esc(item.field)}</code></td>
        <td><span class="req-pill ${item.req === "required" ? "is-required" : ""}">${item.req === "required" ? t("reqRequired") : t("reqOptional")}</span></td>
        <td>${esc(item.desc[lang] || item.desc.en)}</td>
      </tr>`).join("");
    document.getElementById("sample-code").textContent = SAMPLE_TEXT;
  }

  function renderNotice() {
    if (!notice) return "";
    return `<p class="workspace-notice ${notice.error ? "is-error" : "is-ok"}">${esc(notice.text)}</p>`;
  }

  function renderPreview() {
    if (!pending) {
      preview.innerHTML = renderNotice();
      return;
    }
    const domains = pending.domains.map((item) => `<li>${esc(pick(item))} <span class="topic-pill">${item.weight}${esc(t("questionsUnit"))}</span></li>`).join("");
    preview.innerHTML = `
      <div class="preview-box">
        <dl class="preview-facts">
          <div><dt>${esc(t("previewName"))}</dt><dd>${esc(pick(pending.name))}</dd></div>
          <div><dt>${esc(t("previewQuestions"))}</dt><dd>${pending.questions.length}</dd></div>
        </dl>
        <p class="preview-label">${esc(t("previewDomains"))}</p>
        <ul class="preview-domains">${domains}</ul>
        <p class="preview-sample">${esc(pick(pending.questions[0].prompt))}</p>
        <div class="workspace-row">
          <button class="btn btn-primary btn-small" id="save-bank" type="button">${esc(t("saveBank"))}</button>
          <button class="btn btn-quiet btn-small" id="cancel-bank" type="button">${esc(t("cancel"))}</button>
        </div>
      </div>`;
    document.getElementById("save-bank").addEventListener("click", saveBank);
    document.getElementById("cancel-bank").addEventListener("click", () => { pending = null; notice = null; renderPreview(); });
  }

  async function renderSaved() {
    let banks = [];
    try {
      banks = await loadImportedBanks();
    } catch {
      savedList.innerHTML = `<p class="empty-note">${esc(t("noBanks"))}</p>`;
      return;
    }
    const active = localStorage.getItem(BANK_KEY);
    if (!banks.length) {
      savedList.innerHTML = `<p class="empty-note">${esc(t("noBanks"))}</p>`;
      return;
    }
    savedList.innerHTML = banks.map((bank) => `
      <div class="saved-row">
        <div class="saved-info">
          <strong>${esc(pick(bank.name))}</strong>
          <span>${bank.questions.length} ${esc(t("questionsUnit"))}${bank.id === active ? ` · <span class="saved-active">${esc(t("active"))}</span>` : ""}</span>
        </div>
        <button class="btn btn-quiet btn-small" type="button" data-delete="${esc(bank.id)}">${esc(t("deleteBank"))}</button>
      </div>`).join("");
    savedList.querySelectorAll("[data-delete]").forEach((button) => button.addEventListener("click", () => deleteBank(button.dataset.delete)));
  }

  async function handleFile(file) {
    notice = null;
    pending = null;
    let raw;
    try {
      raw = JSON.parse(await file.text());
    } catch (error) {
      notice = { text: `${t("notJson")} ${error.message}`, error: true };
      return renderPreview();
    }
    try {
      pending = normalizeBank(raw, file.name);
      renderPreview();
    } catch (error) {
      notice = { text: `${t("importFailed")} ${error.message}`, error: true };
      renderPreview();
    }
  }

  async function saveBank() {
    if (!pending) return;
    try {
      await saveImportedBank(pending);
      localStorage.setItem(BANK_KEY, pending.id);
      pending = null;
      notice = { text: t("saved"), error: false };
    } catch {
      notice = { text: t("saveFailed"), error: true };
    }
    renderPreview();
    renderSaved();
  }

  async function deleteBank(id) {
    if (!window.confirm(t("deleteConfirm"))) return;
    try {
      await removeImportedBank(id);
    } catch {
      notice = { text: t("saveFailed"), error: true };
      return renderPreview();
    }
    purgeBankProgress(id);
    if (localStorage.getItem(BANK_KEY) === id) localStorage.removeItem(BANK_KEY);
    notice = null;
    renderSaved();
  }

  const fileInput = document.getElementById("file-input");
  const dropzone = document.getElementById("dropzone");
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    fileInput.value = "";
    if (file) handleFile(file);
  });
  dropzone.addEventListener("dragover", (event) => { event.preventDefault(); dropzone.classList.add("is-dragover"); });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("is-dragover"));
  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.classList.remove("is-dragover");
    const file = event.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  document.getElementById("copy-sample").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(SAMPLE_TEXT);
      document.getElementById("copy-sample").textContent = t("copied");
    } catch {
      document.getElementById("copy-sample").textContent = t("copyFailed");
    }
    setTimeout(() => { document.getElementById("copy-sample").textContent = t("copySample"); }, 1500);
  });
  document.getElementById("download-sample").addEventListener("click", () => {
    const url = URL.createObjectURL(new Blob([SAMPLE_TEXT], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample-bank.json";
    link.click();
    URL.revokeObjectURL(url);
  });

  document.querySelectorAll(".language-button").forEach((button) => button.addEventListener("click", () => {
    lang = button.dataset.lang;
    localStorage.setItem(LANG_KEY, lang);
    applyStaticText();
    renderPreview();
    renderSaved();
  }));

  applyStaticText();
  renderPreview();
  renderSaved();
})();

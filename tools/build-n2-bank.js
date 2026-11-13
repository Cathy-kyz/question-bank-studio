// Usage: node tools/build-n2-bank.js 202312 "JLPT N2 — December 2023" "日本語能力試験 N2 2023年12月" "日本语能力考试 N2 2023年12月"
// Reads samples/n2-<key>.json (JLPT N2 import format) and writes banks/n2-<key>/question-bank.js.
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const [key, en, ja, zh] = process.argv.slice(2);
if (!key || !en || !ja || !zh) { console.error("Usage: node tools/build-n2-bank.js <yyyymm> <en name> <ja name> <zh name>"); process.exit(1); }
global.window = {};
eval(fs.readFileSync(path.join(root, "bank-store.js"), "utf8"));
const raw = JSON.parse(fs.readFileSync(path.join(root, "samples", `n2-${key}.json`), "utf8"));
const bank = window.BankStore.normalizeBank(raw, `n2-${key}.json`);
if (bank.warnings?.length) console.warn("warnings:\n- " + bank.warnings.join("\n- "));
const { warnings, builtin, ...out } = bank;
out.id = `n2-${key}`;
out.name = { en, ja, zh };
const dir = path.join(root, "banks", `n2-${key}`);
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "question-bank.js"), `window.N2_${key}_BANK = ${JSON.stringify(out, null, 2)};\n`);
console.log(`wrote banks/n2-${key}/question-bank.js (${out.questions.length} questions)`);

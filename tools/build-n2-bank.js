// Usage: node tools/build-n2-bank.js 202312 "JLPT N2 — December 2023" "日本語能力試験 N2 2023年12月" "日本语能力考试 N2 2023年12月"
// Reads samples/n2-<key>.json (JLPT N2 import format) and writes banks/n2-<key>/question-bank.js and banks/manifest.js.
// serve.js does the same automatically when a bank is imported from import.html.
const fs = require("fs");
const path = require("path");
const { buildN2Bank, root } = require("./n2-builder");
const [key, en, ja, zh] = process.argv.slice(2);
if (!key || !en || !ja || !zh) { console.error("Usage: node tools/build-n2-bank.js <yyyymm> <en name> <ja name> <zh name>"); process.exit(1); }
const raw = JSON.parse(fs.readFileSync(path.join(root, "samples", `n2-${key}.json`), "utf8"));
const { count, warnings } = buildN2Bank(key, raw, { en, ja, zh });
if (warnings.length) console.warn("warnings:\n- " + warnings.join("\n- "));
console.log(`wrote banks/n2-${key}/question-bank.js (${count} questions)`);

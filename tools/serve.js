// Usage: node tools/serve.js [port]   (default 8080)
// Serves the app on http://localhost:<port>/ and lets import.html write JLPT N2 banks into banks/ automatically.
const http = require("http");
const fs = require("fs");
const path = require("path");
const { buildN2Bank, writeManifest, root } = require("./n2-builder");

const port = Number(process.argv[2]) || 8080;
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".md": "text/plain; charset=utf-8" };
const send = (res, status, body, type = "application/json; charset=utf-8") => {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const namesFor = (key) => {
  const year = key.slice(0, 4);
  const month = Number(key.slice(4));
  return { en: `JLPT N2 — ${MONTHS[month - 1]} ${year}`, ja: `日本語能力試験 N2 ${year}年${month}月`, zh: `日本语能力考试 N2 ${year}年${month}月` };
};
// "JLPT N2 2024年07月" -> "202407"
const keyFromName = (name) => {
  const match = String(name || "").match(/((?:19|20)\d{2})\D{0,3}(\d{1,2})/);
  if (!match || Number(match[2]) < 1 || Number(match[2]) > 12) return null;
  return match[1] + match[2].padStart(2, "0");
};

const readBody = (req) => new Promise((resolve, reject) => {
  const chunks = [];
  let size = 0;
  req.on("data", (chunk) => { size += chunk.length; if (size > 20e6) { reject(new Error("too large")); req.destroy(); } else chunks.push(chunk); });
  req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  req.on("error", reject);
});

const sameOrigin = (req) => !req.headers.origin || req.headers.origin === `http://${req.headers.host}`;
const localHost = (req) => /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(req.headers.host || "");

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname.startsWith("/api/")) {
    if (!localHost(req) || !sameOrigin(req)) return send(res, 403, { error: "forbidden" });
    if (req.method === "GET" && url.pathname === "/api/status") return send(res, 200, { ok: true });
    if (req.method === "POST" && url.pathname === "/api/save-n2") {
      try {
        const { raw, force } = JSON.parse(await readBody(req));
        const key = keyFromName(raw?.name);
        if (!key) return send(res, 422, { error: `Could not find the year and month in the name "${raw?.name}". Include something like "2024年07月".` });
        const dry = buildN2Bank(key, raw, namesFor(key), { dryRun: true });
        if (dry.warnings.length && !force) return send(res, 422, { error: "warnings", warnings: dry.warnings, key });
        const existed = fs.existsSync(path.join(root, "banks", `n2-${key}`));
        const { count, warnings } = buildN2Bank(key, raw, namesFor(key));
        console.log(`${existed ? "updated" : "added"} banks/n2-${key} (${count} questions)`);
        return send(res, 200, { id: `n2-${key}`, count, warnings, replaced: existed });
      } catch (error) {
        return send(res, 400, { error: error.message });
      }
    }
    return send(res, 404, { error: "not found" });
  }
  if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, "Method Not Allowed", "text/plain");
  const rel = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const file = path.join(root, rel);
  if (file !== root && !file.startsWith(root + path.sep)) return send(res, 403, "Forbidden", "text/plain");
  fs.readFile(file, (error, data) => error ? send(res, 404, "Not found", "text/plain") : send(res, 200, data, types[path.extname(file).toLowerCase()] || "application/octet-stream"));
}).listen(port, "127.0.0.1", () => {
  writeManifest();
  console.log(`Serving ${root}\nOpen http://localhost:${port}/  (import from http://localhost:${port}/import.html to save into banks/ automatically)`);
});

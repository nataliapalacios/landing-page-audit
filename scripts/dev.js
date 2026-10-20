// Servidor local mínimo que imita el ruteo de Vercel (index.html + /api/*), sin instalar la CLI.
// Uso: npm run dev  (lee .env si existe)
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { Readable } from "node:stream";

const PORT = process.env.PORT || 3000;

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (url.pathname.startsWith("/api/")) {
      const mod = await import(`../api/${url.pathname.slice(5)}.js`);
      const handler = mod[req.method];
      if (!handler) return res.writeHead(405).end();
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const request = new Request(url, {
        method: req.method,
        headers: req.headers,
        body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks),
      });
      const response = await handler(request);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      if (response.body) Readable.fromWeb(response.body).pipe(res);
      else res.end();
      return;
    }
    const html = await readFile(new URL("../index.html", import.meta.url));
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(html);
  } catch (e) {
    console.error(e);
    res.writeHead(500).end(String(e));
  }
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));

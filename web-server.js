// Simple static file server for the Expo web export.
// Reads PORT from env (Railway sets it), defaults to 3000 locally.
// Falls back to /index.html for unknown paths (SPA routing).
const http = require("node:http");
const path = require("node:path");
const handler = require("serve-handler");

const port = process.env.PORT || 3000;
const root = path.join(__dirname, "dist");

const server = http.createServer((req, res) =>
  handler(req, res, {
    public: root,
    rewrites: [{ source: "**", destination: "/index.html" }],
  }),
);

server.listen(port, () => {
  console.log(`[edufix-web] static server on http://localhost:${port}`);
});

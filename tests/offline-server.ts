import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
import type { AddressInfo } from "node:net";
// A real unavailable origin tests both engines, without WebKit's offline-emulation error.
export async function offlineServer(swRevision?: () => number) {
  const root = resolve("dist");
  const mime: Record<string, string> = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".webmanifest": "application/manifest+json",
    ".png": "image/png",
    ".svg": "image/svg+xml",
  };
  const server = createServer(async (req, res) => {
    try {
      const path = new URL(req.url || "/", "http://localhost").pathname;
      const file = resolve(root, "." + (path === "/" ? "/index.html" : path));
      if (!file.startsWith(root + "/")) throw Error("Invalid path");
      res.setHeader(
        "Content-Type",
        mime[extname(file)] || "application/octet-stream",
      );
      const content = await readFile(file);
      // Stamp the release on the worker and on the HTML shell so tests can
      // tell which version a reload actually rendered.
      const stamp = swRevision
        ? path === "/sw.js"
          ? `\n// Test release ${swRevision()}\n`
          : path === "/"
            ? `\n<meta name="test-release" content="${swRevision()}">\n`
            : ""
        : "";
      res.end(stamp ? Buffer.concat([content, Buffer.from(stamp)]) : content);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise<void>((r) => server.listen(0, "localhost", r));
  const url = `http://localhost:${(server.address() as AddressInfo).port}`;
  let closed = false;
  const close = async () => {
    if (closed) return;
    closed = true;
    await new Promise<void>((resolve, reject) => {
      server.close((e) => (e ? reject(e) : resolve()));
      server.closeAllConnections();
    });
  };
  return { url, close };
}

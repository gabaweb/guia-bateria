import { readFile, writeFile, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Use the very same battery_100 artwork as the Framework7 Icon in the guide.
// A 20px glyph sits inside the 30px green tile with its 7px corner radius.
const root = new URL("../", import.meta.url);
const source = await readFile(
  new URL("node_modules/framework7-icons/svg/battery_100.svg", root),
  "utf8",
);
const artwork = source.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const tile = (radius) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><rect width="30" height="30" rx="${radius}" fill="#30d158"/><svg x="5" y="5" width="20" height="20" viewBox="0 0 56 56" fill="white">${artwork}</svg></svg>\n`;

await writeFile(new URL("public/icon.svg", root), tile(7));
await Promise.all(
  [
    ["favicon-32.png", 32, 7],
    ["icon-192.png", 192, 7],
    ["icon-512.png", 512, 7],
    // iOS and maskable launchers apply their own outer shape.
    ["apple-touch-icon.png", 180, 0],
    ["icon-maskable.png", 512, 0],
  ].map(([file, size, radius]) =>
    sharp(Buffer.from(tile(radius)))
      .resize(size, size)
      .png()
      .toFile(fileURLToPath(new URL(`public/${file}`, root))),
  ),
);
await copyFile(
  new URL("node_modules/framework7-icons/LICENSE", root),
  new URL("public/framework7-icons-LICENSE.txt", root),
);

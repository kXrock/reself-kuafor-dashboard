// Generates brand monogram icons (terracotta "K" on espresso) from SVG → PNG.
// Run with: npm run icons
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const INK = "#2B2520";
const CLAY = "#C9785A";

function svg(size, { maskable = false } = {}) {
  // Maskable variant keeps the glyph within the safe zone (less inset).
  const pad = maskable ? size * 0.0 : size * 0.0;
  const r = maskable ? 0 : size * 0.22;
  const fontSize = maskable ? size * 0.46 : size * 0.56;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect x="${pad}" y="${pad}" width="${size - pad * 2}" height="${size - pad * 2}" rx="${r}" fill="${INK}"/>
  <text x="50%" y="50%" dy="0.02em" text-anchor="middle" dominant-baseline="central"
    font-family="Georgia, 'Times New Roman', serif" font-weight="600"
    font-size="${fontSize}" fill="${CLAY}">K</text>
</svg>`;
}

async function png(size, name, opts) {
  const buf = Buffer.from(svg(size, opts));
  await sharp(buf).png().toFile(join(publicDir, name));
  console.log("✓", name);
}

async function main() {
  await png(192, "icon-192.png");
  await png(512, "icon-512.png");
  await png(512, "icon-maskable-512.png", { maskable: true });
  await png(180, "apple-touch-icon.png");
  // favicon.ico from a 48px raster
  const favBuf = Buffer.from(svg(48));
  const favPng = await sharp(favBuf).resize(48, 48).png().toBuffer();
  writeFileSync(join(publicDir, "favicon.ico"), favPng); // browsers accept PNG-in-ICO container path
  await sharp(favBuf).resize(32, 32).png().toFile(join(publicDir, "favicon-32.png"));
  console.log("✓ favicon");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

// Generates brand monogram icons (elegant salon scissors on espresso).
// Run with: npm run icons
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const INK = "#2B2520";
const CLAY = "#C9785A";

function scissorsSvg(size, { maskable = false } = {}) {
  // Maskable variant uses a full-bleed rect; normal variant has rounded corners.
  const cornerR = maskable ? 0 : size * 0.22;
  // Slightly tighter glyph for maskable so it survives platform crop.
  const scale = maskable ? 0.78 : 1;
  const cx = size * 0.5;

  const handleY = size * 0.72;
  const handleR = size * 0.105 * scale;
  const leftHx = size * 0.36;
  const rightHx = size * 0.64;

  // Blade tips at top — crossed, so left handle leads to upper-RIGHT, right to upper-LEFT.
  const bladeTopY = size * 0.16;
  const leftBladeTipX = size * 0.66;
  const rightBladeTipX = size * 0.34;

  // Blade roots: at the inner edge of each handle, near the pivot.
  const innerOffset = handleR * 0.55;
  const leftRootX = leftHx + innerOffset;
  const rightRootX = rightHx - innerOffset;
  const rootY = handleY - innerOffset;

  // Pivot dot (center of the X).
  const pivotX = cx;
  const pivotY = size * 0.46;

  const stroke = size * 0.034;
  const pivotR = stroke * 0.95;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect x="0" y="0" width="${size}" height="${size}" rx="${cornerR}" fill="${INK}"/>
  <g stroke="${CLAY}" fill="none" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">
    <!-- Left blade: from left handle → upper right tip, passing through pivot -->
    <line x1="${leftRootX}" y1="${rootY}" x2="${leftBladeTipX}" y2="${bladeTopY}"/>
    <!-- Right blade: from right handle → upper left tip, passing through pivot -->
    <line x1="${rightRootX}" y1="${rootY}" x2="${rightBladeTipX}" y2="${bladeTopY}"/>
    <!-- Handles -->
    <circle cx="${leftHx}" cy="${handleY}" r="${handleR}"/>
    <circle cx="${rightHx}" cy="${handleY}" r="${handleR}"/>
  </g>
  <!-- Pivot screw -->
  <circle cx="${pivotX}" cy="${pivotY}" r="${pivotR}" fill="${CLAY}"/>
</svg>`;
}

async function png(size, name, opts) {
  const buf = Buffer.from(scissorsSvg(size, opts));
  await sharp(buf).png().toFile(join(publicDir, name));
  console.log("✓", name);
}

async function main() {
  await png(192, "icon-192.png");
  await png(512, "icon-512.png");
  await png(512, "icon-maskable-512.png", { maskable: true });
  await png(180, "apple-touch-icon.png");

  // favicon
  const favBuf = Buffer.from(scissorsSvg(48));
  const fav = await sharp(favBuf).resize(48, 48).png().toBuffer();
  writeFileSync(join(publicDir, "favicon.ico"), fav);
  await sharp(favBuf).resize(32, 32).png().toFile(join(publicDir, "favicon-32.png"));
  console.log("✓ favicon");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

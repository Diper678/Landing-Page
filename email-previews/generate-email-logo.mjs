import sharp from 'sharp';
import opentype from 'opentype.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Load Nasalization font and convert text to SVG path
const fontPath = join(root, 'assets', 'logos', 'Nasalization Rg.otf');
const font = opentype.loadSync(fontPath);
const textPath = font.getPath('Sisteco', 0, 0, 32);
const pathData = textPath.toPathData();
const textBBox = textPath.getBoundingBox();

console.log('Text bbox:', textBBox);

// Load icon
const iconPath = join(root, 'assets', 'logos', 'sisteco-icon.png');
const iconBuffer = readFileSync(iconPath);
const iconBase64 = iconBuffer.toString('base64');

// Position: icon at left, text centered vertically
const iconSize = 56;
const textX = iconSize + 14; // gap after icon
const textY = (60 / 2) - ((textBBox.y1 + textBBox.y2) / 2); // center vertically
const totalWidth = textX + (textBBox.x2 - textBBox.x1) + 10;

const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(totalWidth)}" height="60" viewBox="0 0 ${Math.ceil(totalWidth)} 60">
  <image href="data:image/png;base64,${iconBase64}" x="0" y="2" width="${iconSize}" height="${iconSize}" />
  <g transform="translate(${textX}, ${textY})">
    <path d="${pathData}" fill="#111111" />
  </g>
</svg>`;

// Retina (2x)
const width2x = Math.ceil(totalWidth) * 2;
const height2x = 120;
await sharp(Buffer.from(logoSvg))
  .resize(width2x, height2x)
  .png()
  .toFile(join(root, 'assets', 'logos', 'sisteco-email-logo.png'));

console.log(`Created: sisteco-email-logo.png (${width2x}x${height2x}, retina)`);

// Standard
await sharp(Buffer.from(logoSvg))
  .resize(Math.ceil(totalWidth), 60)
  .png()
  .toFile(join(root, 'assets', 'logos', 'sisteco-email-logo-sm.png'));

console.log(`Created: sisteco-email-logo-sm.png (${Math.ceil(totalWidth)}x60)`);

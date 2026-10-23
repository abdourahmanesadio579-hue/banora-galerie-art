import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function createCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  return table;
}

const crcTable = createCrcTable();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const toCrc = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(toCrc);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);
  return Buffer.concat([lenBuf, toCrc, crcBuf]);
}

function generatePng(width, height, isMaskable = false) {
  const rawRows = [];
  const cx = width / 2;
  const cy = height / 2;
  const r = width * (isMaskable ? 0.32 : 0.42);

  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const idx = 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background: Deep luxurious obsidian #141311
      let red = 20;
      let green = 19;
      let blue = 17;
      let alpha = 255;

      // Outer golden decorative circle frame
      const ringThickness = width * 0.025;
      if (Math.abs(dist - r) <= ringThickness) {
        // Gold #D4AF37
        red = 212;
        green = 175;
        blue = 55;
      } else if (dist < r - ringThickness) {
        // Inner canvas tint #1a1815 with slight warm gradient
        const grad = 1 - (dist / r) * 0.3;
        red = Math.round(28 * grad);
        green = Math.round(26 * grad);
        blue = Math.round(24 * grad);

        // Render Stylized 'B' in Center
        // Normalized coordinates in letter box: x in [-0.5, 0.5], y in [-0.5, 0.5]
        const letterSize = r * 1.1;
        const lx = dx / letterSize;
        const ly = dy / letterSize;

        // Stem of B: lx between -0.28 and -0.16, ly between -0.45 and 0.45
        const inStem = lx >= -0.28 && lx <= -0.16 && ly >= -0.45 && ly <= 0.45;

        // Top loop of B: center at (-0.16, -0.22), radius approx 0.22, thickness 0.1
        const topDist = Math.sqrt(Math.pow(lx - -0.16, 2) + Math.pow(ly - -0.22, 2));
        const inTopLoop = lx >= -0.16 && topDist <= 0.23 && topDist >= 0.12 && ly <= 0.02;

        // Bottom loop of B: center at (-0.16, 0.22), radius approx 0.24, thickness 0.1
        const botDist = Math.sqrt(Math.pow(lx - -0.16, 2) + Math.pow(ly - 0.22, 2));
        const inBotLoop = lx >= -0.16 && botDist <= 0.25 && botDist >= 0.13 && ly >= -0.02;

        // Serif accents
        const inSerif = (ly <= -0.43 && lx >= -0.34 && lx <= -0.1) || (ly >= 0.43 && lx >= -0.34 && lx <= -0.1);

        if (inStem || inTopLoop || inBotLoop || inSerif) {
          // Lustrous gold gradient: #E6C665 to #C59A27
          const goldGrad = 0.8 + 0.35 * Math.sin((dx + dy) / 30);
          red = Math.min(255, Math.round(220 * goldGrad));
          green = Math.min(255, Math.round(180 * goldGrad));
          blue = Math.min(255, Math.round(70 * goldGrad));
        }
      }

      row[idx] = red;
      row[idx + 1] = green;
      row[idx + 2] = blue;
      row[idx + 3] = alpha;
    }
    rawRows.push(row);
  }

  const rawBuffer = Buffer.concat(rawRows);
  const deflated = zlib.deflateSync(rawBuffer);

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bit
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PNGs
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePng(180, 180, false));

// Generate SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="100" fill="#141311"/>
  <circle cx="256" cy="256" r="210" stroke="#D4AF37" stroke-width="8" stroke-opacity="0.8" />
  <circle cx="256" cy="256" r="200" stroke="#F3E5AB" stroke-width="2" stroke-opacity="0.4" />
  <!-- Artistic BANORA monogram 'B' -->
  <path d="M 190 120 L 270 120 C 330 120 370 150 370 200 C 370 235 345 252 315 258 C 355 266 385 292 385 336 C 385 392 335 410 270 410 L 190 410 Z" fill="none" stroke="url(#goldGradient)" stroke-width="24" stroke-linejoin="round"/>
  <path d="M 230 135 L 230 395" stroke="url(#goldGradient)" stroke-width="20" stroke-linecap="round"/>
  <path d="M 230 258 L 290 258" stroke="url(#goldGradient)" stroke-width="16" stroke-linecap="round"/>
  <circle cx="256" cy="256" r="6" fill="#D4AF37"/>
  <defs>
    <linearGradient id="goldGradient" x1="160" y1="120" x2="385" y2="410" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#F9F1D6"/>
      <stop offset="50%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#AA7C11"/>
    </linearGradient>
  </defs>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');
console.log('PWA icons successfully generated in public/ directory!');

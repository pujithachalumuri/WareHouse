const { Jimp } = require('jimp');

/**
 * Perceptual difference hash (dHash) for a face image.
 * Lightweight, deterministic, non-AI image-similarity method — ideal for a
 * hackathon demo. Resizes to 9x8 grayscale and records horizontal gradient
 * signs between adjacent pixels, producing a 64-bit hash.
 *
 * @param {string} imageData - base64 data URL or raw base64 of the image
 * @returns {Promise<string>} 16-char hex hash (64 bits)
 */
async function faceHash(imageData) {
  const b64 = String(imageData || '').replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(b64, 'base64');
  const img = await Jimp.read(buffer);
  img.resize({ w: 9, h: 8 });
  img.greyscale();

  const gray = [];
  for (let y = 0; y < 8; y++) {
    const row = [];
    for (let x = 0; x < 9; x++) {
      const color = img.getPixelColor(x, y);
      const r = (color >> 24) & 0xff;
      const g = (color >> 16) & 0xff;
      const b = (color >> 8) & 0xff;
      row.push(Math.round(0.299 * r + 0.587 * g + 0.114 * b));
    }
    gray.push(row);
  }

  let bits = '';
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      bits += gray[y][x] >= gray[y][x + 1] ? '1' : '0';
    }
  }

  let hex = '';
  for (let i = 0; i < 64; i += 4) {
    hex += parseInt(bits.substr(i, 4), 2).toString(16);
  }
  return hex;
}

/**
 * Hamming distance between two hex hashes. Lower = more similar.
 */
function hammingDistance(h1, h2) {
  if (!h1 || !h2 || h1.length !== h2.length) return 999;
  let d = 0;
  for (let i = 0; i < h1.length; i++) {
    const a = parseInt(h1[i], 16);
    const b = parseInt(h2[i], 16);
    let x = a ^ b;
    while (x) {
      d += x & 1;
      x >>= 1;
    }
  }
  return d;
}

/**
 * Compare similarity. Returns match boolean + score (0-100).
 * Default threshold 12/64 lets genuine same-person captures pass while
 * clearly different faces are rejected.
 */
async function verifyFace(captured, reference, threshold = 12) {
  const cHash = await faceHash(captured);
  const dist = hammingDistance(cHash, reference);
  const maxBits = 64;
  const score = Math.round(((maxBits - dist) / maxBits) * 100);
  return { match: dist <= threshold, distance: dist, score, hash: cHash, threshold };
}

module.exports = { faceHash, hammingDistance, verifyFace };

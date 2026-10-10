const fs = require('fs');
const { PNG } = require('pngjs');

const data = fs.readFileSync('img/foto5_rot90.png');
const png = PNG.sync.read(data);
const W = png.width;
const H = png.height;

// Step 1: Extract ink pixels (thresholding)
// Black ink on paper. Exclude "AL..." text at bottom (y > 136, x: 70..130)
let grid = Array.from({ length: H }, () => new Uint8Array(W));

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (W * y + x) << 2;
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    // Exclude bottom text "AL..."
    const isDocText = (y >= 134 && x >= 70 && x <= 135);
    // Ink threshold
    if (brightness < 125 && !isDocText) {
      grid[y][x] = 1;
    }
  }
}

// Save binary preview to check threshold quality
const binPng = new PNG({ width: W, height: H });
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (W * y + x) << 2;
    const v = grid[y][x] ? 0 : 255;
    binPng.data[idx] = v;
    binPng.data[idx + 1] = v;
    binPng.data[idx + 2] = v;
    binPng.data[idx + 3] = 255;
  }
}
fs.writeFileSync('img/foto5_binary.png', PNG.sync.write(binPng));
console.log('Saved img/foto5_binary.png');

// Zhang-Suen Thinning Algorithm
function zhangSuenThinning(binaryGrid) {
  let g = binaryGrid.map(row => new Uint8Array(row));
  let changed = true;

  while (changed) {
    changed = false;
    // Step 1
    let toZero1 = [];
    for (let r = 1; r < H - 1; r++) {
      for (let c = 1; c < W - 1; c++) {
        if (g[r][c] === 0) continue;
        const p2 = g[r-1][c], p3 = g[r-1][c+1], p4 = g[r][c+1], p5 = g[r+1][c+1];
        const p6 = g[r+1][c], p7 = g[r+1][c-1], p8 = g[r][c-1], p9 = g[r-1][c-1];

        const b = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
        if (b < 2 || b > 6) continue;

        // Transitions 0 -> 1
        const n = [p2, p3, p4, p5, p6, p7, p8, p9, p2];
        let a = 0;
        for (let i = 0; i < 8; i++) {
          if (n[i] === 0 && n[i+1] === 1) a++;
        }
        if (a !== 1) continue;

        if (p2 * p4 * p6 !== 0) continue;
        if (p4 * p6 * p8 !== 0) continue;

        toZero1.push([r, c]);
      }
    }
    if (toZero1.length > 0) changed = true;
    for (const [r, c] of toZero1) g[r][c] = 0;

    // Step 2
    let toZero2 = [];
    for (let r = 1; r < H - 1; r++) {
      for (let c = 1; c < W - 1; c++) {
        if (g[r][c] === 0) continue;
        const p2 = g[r-1][c], p3 = g[r-1][c+1], p4 = g[r][c+1], p5 = g[r+1][c+1];
        const p6 = g[r+1][c], p7 = g[r+1][c-1], p8 = g[r][c-1], p9 = g[r-1][c-1];

        const b = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
        if (b < 2 || b > 6) continue;

        const n = [p2, p3, p4, p5, p6, p7, p8, p9, p2];
        let a = 0;
        for (let i = 0; i < 8; i++) {
          if (n[i] === 0 && n[i+1] === 1) a++;
        }
        if (a !== 1) continue;

        if (p2 * p4 * p8 !== 0) continue;
        if (p2 * p6 * p8 !== 0) continue;

        toZero2.push([r, c]);
      }
    }
    if (toZero2.length > 0) changed = true;
    for (const [r, c] of toZero2) g[r][c] = 0;
  }
  return g;
}

const skel = zhangSuenThinning(grid);

// Save skeleton preview
const skelPng = new PNG({ width: W, height: H });
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (W * y + x) << 2;
    const v = skel[y][x] ? 0 : 255;
    skelPng.data[idx] = v;
    skelPng.data[idx + 1] = v;
    skelPng.data[idx + 2] = v;
    skelPng.data[idx + 3] = 255;
  }
}
fs.writeFileSync('img/foto5_skeleton.png', PNG.sync.write(skelPng));
console.log('Saved img/foto5_skeleton.png');

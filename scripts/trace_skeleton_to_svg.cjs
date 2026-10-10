const fs = require('fs');
const { PNG } = require('pngjs');

const data = fs.readFileSync('img/foto5_skeleton.png');
const png = PNG.sync.read(data);
const W = png.width;
const H = png.height;

// 1 = black pixel (stroke), 0 = white
let grid = Array.from({ length: H }, () => new Uint8Array(W));
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (W * y + x) << 2;
    // Skeleton has black on white
    if (png.data[idx] < 128) {
      // Exclude isolated bottom-left or right edge noise
      if (y > 140 && x < 60) continue; // stray mark in corner
      if (x > 300 && y > 100) continue; // stray dots
      grid[y][x] = 1;
    }
  }
}

// Extract strokes by walking adjacent pixels
const visited = Array.from({ length: H }, () => new Uint8Array(W));
const strokes = [];

const dirs = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

// First find endpoints (degree 1)
function getNeighbors(y, x) {
  const n = [];
  for (const [dy, dx] of dirs) {
    const ny = y + dy, nx = x + dx;
    if (ny >= 0 && ny < H && nx >= 0 && nx < W && grid[ny][nx] === 1) {
      n.push([ny, nx]);
    }
  }
  return n;
}

// Find endpoints
let endpoints = [];
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (grid[y][x] === 1) {
      const n = getNeighbors(y, x);
      if (n.length === 1) {
        endpoints.push([y, x]);
      }
    }
  }
}

// Trace from endpoints first
function tracePath(startY, startX) {
  const path = [[startX, startY]];
  visited[startY][startX] = 1;
  let curY = startY, curX = startX;

  while (true) {
    const neighbors = getNeighbors(curY, curX).filter(([ny, nx]) => !visited[ny][nx]);
    if (neighbors.length === 0) break;
    // Pick closest or first unvisited neighbor
    const [nextY, nextX] = neighbors[0];
    visited[nextY][nextX] = 1;
    path.push([nextX, nextY]);
    curY = nextY;
    curX = nextX;
  }
  return path;
}

for (const [ey, ex] of endpoints) {
  if (!visited[ey][ex]) {
    const p = tracePath(ey, ex);
    if (p.length > 5) strokes.push(p);
  }
}

// Trace remaining loops
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (grid[y][x] === 1 && !visited[y][x]) {
      const p = tracePath(y, x);
      if (p.length > 5) strokes.push(p);
    }
  }
}

console.log(`Found ${strokes.length} strokes.`);

// Simplify path (RDP)
function pointLineDist(pt, a, b) {
  const [px, py] = pt;
  const [ax, ay] = a;
  const [bx, by] = b;
  const l2 = (bx - ax) ** 2 + (by - ay) ** 2;
  if (l2 === 0) return Math.hypot(px - ax, py - ay);
  let t = ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * (bx - ax)), py - (ay + t * (by - ay)));
}

function simplify(pts, epsilon = 1.0) {
  if (pts.length <= 2) return pts;
  let maxD = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = pointLineDist(pts[i], pts[0], pts[pts.length - 1]);
    if (d > maxD) {
      maxD = d;
      idx = i;
    }
  }
  if (maxD > epsilon) {
    const left = simplify(pts.slice(0, idx + 1), epsilon);
    const right = simplify(pts.slice(idx), epsilon);
    return left.slice(0, -1).concat(right);
  } else {
    return [pts[0], pts[pts.length - 1]];
  }
}

const simplifiedStrokes = strokes.map(s => simplify(s, 1.2));

// Generate SVG d attribute with smooth curves
function pointsToSvgPath(pts) {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0][0]} ${pts[0][1]}`;
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const xc = (pts[i][0] + pts[i + 1][0]) / 2;
    const yc = (pts[i][1] + pts[i + 1][1]) / 2;
    d += ` Q ${pts[i][0]} ${pts[i][1]} ${xc.toFixed(1)} ${yc.toFixed(1)}`;
  }
  d += ` L ${pts[pts.length - 1][0]} ${pts[pts.length - 1][1]}`;
  return d;
}

const pathStrings = simplifiedStrokes.map(pointsToSvgPath);

// Save as JSON and preview HTML
fs.writeFileSync('scripts/signature_paths.json', JSON.stringify(pathStrings, null, 2));

const htmlPreview = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #fdf6f0; display: flex; flex-direction: column; align-items: center; padding: 40px; }
    .box { position: relative; width: 646px; height: 308px; background: #fffcf8; border: 1px solid #e2d1c3; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    svg { width: 100%; height: 100%; }
    path {
      fill: none;
      stroke: #2b1f1d;
      stroke-width: 2.4;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    button { margin-top: 20px; padding: 10px 20px; background: #d4708f; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; }
  </style>
</head>
<body>
  <h2>Firma Extraída Dinámica de Jonnath (SVG)</h2>
  <div class="box">
    <svg viewBox="0 0 323 154" id="svgElem">
      ${pathStrings.map((d, i) => `<path id="p_${i}" d="${d}" />`).join('\n      ')}
    </svg>
  </div>
  <button onclick="animateInk()">Volver a Firmar a Pluma</button>
  <script>
    function animateInk() {
      const paths = document.querySelectorAll('path');
      let totalDelay = 0;
      paths.forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
        p.style.transition = 'none';
      });

      paths.forEach((p, i) => {
        const len = p.getTotalLength();
        const duration = Math.max(0.4, len / 180);
        setTimeout(() => {
          p.style.transition = 'stroke-dashoffset ' + duration + 's ease-in-out';
          p.style.strokeDashoffset = '0';
        }, totalDelay * 1000);
        totalDelay += duration * 0.75;
      });
    }
    window.onload = animateInk;
  </script>
</body>
</html>`;

fs.writeFileSync('scripts/preview_drawn_signature.html', htmlPreview);
console.log('Saved scripts/signature_paths.json and scripts/preview_drawn_signature.html');

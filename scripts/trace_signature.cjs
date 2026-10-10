const fs = require('fs');
const { PNG } = require('pngjs');

const data = fs.readFileSync('img/foto5_rot90.png');
const png = PNG.sync.read(data);

console.log(`Loaded png: ${png.width} x ${png.height}`);

// Let's analyze brightness
// Black ink on light grey/white paper
// Notice "AL..." is located at the bottom (y > 140)
// Let's filter out pixels where y > 140 and x around the text if needed
const binary = [];
let minX = png.width, maxX = 0, minY = png.height, maxY = 0;

for (let y = 0; y < png.height; y++) {
  const row = [];
  for (let x = 0; x < png.width; x++) {
    const idx = (png.width * y + x) << 2;
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Ignore the printed text "AL..." at the bottom (e.g. y > 138)
    const isPrintedText = (y > 136 && x > 70 && x < 130);
    // Dark ink pixels
    const isInk = brightness < 120 && !isPrintedText;
    row.push(isInk ? 1 : 0);

    if (isInk) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  binary.push(row);
}

console.log(`Bounding box: x=[${minX}, ${maxX}], y=[${minY}, ${maxY}]`);

const fs = require('fs');

// We will construct the stroke paths of the signature and render an interactive test HTML
// that overlays the SVG paths onto foto5_rot90.png with 50% opacity and shows the pen animation!

const testHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Signature Vector Calibration</title>
  <style>
    body { background: #f0e6df; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; padding: 20px; }
    .box { position: relative; width: 646px; height: 308px; border: 2px solid #ccc; background: white; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .bg-img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.35; pointer-events: none; }
    svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
    .stroke-path {
      fill: none;
      stroke: #1c1412;
      stroke-width: 2.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .flourish {
      stroke-width: 2.2;
    }
    .bold-stroke {
      stroke-width: 3.4;
    }
    .pen-tip {
      fill: #b33951;
      transition: cx 0.05s, cy 0.05s;
    }
    button { padding: 8px 16px; font-size: 16px; cursor: pointer; border-radius: 6px; background: #c45b7d; color: white; border: none; }
  </style>
</head>
<body>
  <h2>Calibración de Trazo de Pluma vs foto5_rot90.png</h2>
  <div class="box">
    <img src="../img/foto5_rot90.png" class="bg-img" id="bgImg" />
    <svg id="sigSvg" viewBox="0 0 323 154">
      <!-- Trazo 1: El corte diagonal largo inicial que cruza desde arriba izquierda hasta abajo derecha -->
      <path id="path1" class="stroke-path flourish" d="M 22 28 Q 120 70 200 95 T 300 126" />
      
      <!-- Trazo 2: El gran lazo superior que envuelve por arriba -->
      <path id="path2" class="stroke-path flourish" d="M 70 125 C 20 85 50 18 100 18 C 170 18 245 42 254 68 C 260 85 240 92 220 76" />
      
      <!-- Trazo 3: La estructura central (J/A inicial angular) -->
      <path id="path3" class="stroke-path bold-stroke" d="M 70 125 L 152 58 L 98 88 L 140 88" />
      
      <!-- Trazo 4: El nombre caligráfico manuscrito ("Jonnath") -->
      <path id="path4" class="stroke-path bold-stroke" d="M 102 88 Q 110 82 118 88 T 128 85 Q 134 78 138 88 Q 146 80 152 94 T 162 90 Q 168 84 172 96 L 188 105" />
      
      <!-- Trazo 5: El lazo inferior envolvente -->
      <path id="path5" class="stroke-path flourish" d="M 105 105 C 100 128 140 152 180 148 C 225 144 240 115 220 85 C 200 60 162 65 162 65" />
      
      <!-- Pluma animada -->
      <circle id="nib" class="pen-tip" cx="0" cy="0" r="3" style="display:none;" />
    </svg>
  </div>
  <div>
    <button onclick="toggleBg()">Alternar Fondo Foto</button>
    <button onclick="animateAll()">Animar Trazado de Pluma</button>
  </div>

  <script>
    function toggleBg() {
      const img = document.getElementById('bgImg');
      img.style.opacity = img.style.opacity === '0' ? '0.35' : '0';
    }

    function animateAll() {
      const paths = document.querySelectorAll('.stroke-path');
      paths.forEach((p, idx) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
        p.style.transition = 'none';
      });

      let delay = 100;
      paths.forEach((p, idx) => {
        const len = p.getTotalLength();
        setTimeout(() => {
          p.style.transition = 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
          p.style.strokeDashoffset = '0';
        }, delay);
        delay += 750;
      });
    }

    window.onload = animateAll;
  </script>
</body>
</html>`;

fs.writeFileSync('scripts/test_signature.html', testHtml);
console.log('test_signature.html created');

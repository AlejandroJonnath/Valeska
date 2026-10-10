import React, { useState, useEffect, useRef } from 'react';

// Enhanced aesthetic & romantic signature strokes inspired by Jonnath's signature in foto5.png,
// elevated with smooth continuous calligraphy curves and a subtle romantic heart flourish.
const SIGNATURE_STROKES = [
  // 1. Gran lazo superior caligráfico envolvente
  { 
    id: "top-flourish", 
    d: "M 65 110 C 22 72 44 20 98 18 C 160 15 242 38 258 64 C 265 76 254 85 232 79", 
    width: 2.2, 
    speed: 0.8 
  },

  // 2. Trazo angular de la inicial estilográfica
  { 
    id: "stem-apex", 
    d: "M 38 94 L 148 55 L 82 86 L 142 86", 
    width: 2.8, 
    speed: 0.6 
  },

  // 3. Caligrafía manuscrita fluida del nombre ("Jonnath")
  { 
    id: "cursive-name", 
    d: "M 94 86 C 102 79 109 82 115 87 C 120 91 125 82 131 86 C 137 89 141 81 147 90 C 152 97 159 84 165 92 C 171 99 178 88 184 96 C 189 101 195 94 200 98", 
    width: 2.6, 
    speed: 0.9 
  },

  // 4. Lazo inferior envolvente que culmina en un suave floreo romántico
  { 
    id: "bottom-loop", 
    d: "M 108 104 C 102 128 136 150 176 148 C 222 145 244 118 226 90 C 212 68 180 72 172 82 C 166 89 168 98 178 98 C 190 98 205 84 216 75", 
    width: 2.4, 
    speed: 0.85 
  },

  // 5. Corazón caligráfico integrado sutilmente como detalle de amor
  {
    id: "heart-accent",
    d: "M 230 75 C 230 68 222 64 217 71 C 212 64 204 68 204 75 C 204 85 217 93 217 93 C 217 93 230 85 230 75",
    width: 2.0,
    speed: 0.5
  },

  // 6. El veloz trazo diagonal característico que corta la firma con pluma
  { 
    id: "diagonal-strike", 
    d: "M 20 28 Q 120 68 200 95 T 308 126", 
    width: 2.6, 
    speed: 0.45 
  }
];

export default function SignaturePen({ autoStart = true }) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [penPos, setPenPos] = useState({ x: 0, y: 0, visible: false, angle: 35 });
  const svgRef = useRef(null);
  const pathRefs = useRef([]);

  const playStroke = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    setCompleted(false);

    const paths = pathRefs.current;
    if (!paths || paths.length === 0) return;

    // Reset all paths
    paths.forEach(p => {
      if (!p) return;
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
      p.style.transition = 'none';
    });

    let currentIdx = 0;

    const animateNextStroke = () => {
      if (currentIdx >= SIGNATURE_STROKES.length) {
        setIsDrawing(false);
        setCompleted(true);
        setPenPos(prev => ({ ...prev, visible: false }));
        return;
      }

      const p = paths[currentIdx];
      const strokeDef = SIGNATURE_STROKES[currentIdx];

      if (!p) {
        currentIdx++;
        animateNextStroke();
        return;
      }

      const len = p.getTotalLength();
      const duration = strokeDef.speed;

      // Position pen tip at start
      const startPt = p.getPointAtLength(0);
      setPenPos({ x: startPt.x, y: startPt.y, visible: true, angle: 32 });

      // Smooth tracking of fountain pen nib
      const startTime = performance.now();
      const trackNib = (now) => {
        const elapsed = (now - startTime) / (duration * 1000);
        if (elapsed < 1) {
          const pt = p.getPointAtLength(Math.min(len, len * elapsed));
          const sway = Math.sin(elapsed * 12) * 6;
          setPenPos({ x: pt.x, y: pt.y, visible: true, angle: 32 + sway });
          requestAnimationFrame(trackNib);
        } else {
          const endPt = p.getPointAtLength(len);
          setPenPos({ x: endPt.x, y: endPt.y, visible: true, angle: 32 });
        }
      };
      requestAnimationFrame(trackNib);

      // Stroke dashoffset animation
      p.style.transition = `stroke-dashoffset ${duration}s cubic-bezier(0.4, 0.05, 0.4, 1)`;
      p.style.strokeDashoffset = '0';

      currentIdx++;
      setTimeout(animateNextStroke, duration * 880);
    };

    setTimeout(animateNextStroke, 200);
  };

  useEffect(() => {
    if (autoStart) {
      const t = setTimeout(playStroke, 450);
      return () => clearTimeout(t);
    }
  }, [autoStart]);

  return (
    <div className="signature-container">
      <div className="signature-card enhanced-romantic-sig">
        <div className="signature-header">
          <span className="signature-label">Firma autógrafa a pluma</span>
          <span className="signature-date">Jonnath ♡ Valeska</span>
        </div>

        <div className="signature-svg-wrapper">
          <svg 
            ref={svgRef} 
            viewBox="0 0 323 154" 
            className="signature-svg"
            aria-label="Firma caligráfica romántica de Jonnath para Valeska"
          >
            <defs>
              <linearGradient id="romanticInk" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e1115" />
                <stop offset="50%" stopColor="#341822" />
                <stop offset="90%" stopColor="#4a1d2d" />
                <stop offset="100%" stopColor="#631f34" />
              </linearGradient>
              <filter id="inkGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodColor="#8c2e4b" floodOpacity="0.25" />
              </filter>
            </defs>

            {SIGNATURE_STROKES.map((st, idx) => (
              <path
                key={st.id}
                ref={el => pathRefs.current[idx] = el}
                d={st.d}
                fill={st.id === "heart-accent" && completed ? "rgba(214, 100, 133, 0.25)" : "none"}
                stroke="url(#romanticInk)"
                strokeWidth={st.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#inkGlow)"
                style={{
                  strokeDasharray: 450,
                  strokeDashoffset: completed ? 0 : 450,
                  transition: st.id === "heart-accent" ? "fill 0.8s ease 0.3s" : "none"
                }}
              />
            ))}

            {/* Pluma estilográfica que dibuja el trazo en tiempo real */}
            {penPos.visible && (
              <g 
                transform={`translate(${penPos.x}, ${penPos.y}) rotate(${penPos.angle}) scale(0.68)`}
                className="fountain-pen-nib"
              >
                {/* Sombra de la plumilla */}
                <ellipse cx="6" cy="12" rx="9" ry="3" fill="rgba(0,0,0,0.18)" filter="blur(1px)" />

                {/* Mango estilográfico en oro y resina borgoña */}
                <path d="M 0 0 L -8 -38 L -3 -70 L 3 -70 L 8 -38 Z" fill="#381722" stroke="#d4a373" strokeWidth="1.2" />
                {/* Plumilla dorada (Nib) */}
                <polygon points="0,0 -7,-24 7,-24" fill="#f0ca8b" stroke="#c4974f" strokeWidth="0.8" />
                {/* Grabado en plumilla */}
                <line x1="0" y1="0" x2="0" y2="-16" stroke="#221116" strokeWidth="1" />
                <circle cx="0" cy="-16" r="1.6" fill="#221116" />
                {/* Gota de tinta fresca */}
                <circle cx="0" cy="0" r="2.2" fill="#731f36" opacity="0.9" />
              </g>
            )}
          </svg>
        </div>

        <div className="signature-actions">
          <button 
            className="replay-sign-btn" 
            onClick={playStroke}
            disabled={isDrawing}
          >
            {isDrawing ? 'Dibujando a pluma...' : '✒️ Ver trazo de nuevo'}
          </button>
          
          {completed && (
            <span className="signature-badge romantic-badge">
              Firmado con todo mi corazón ♡
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useMemo } from 'react';

// Highly optimized, hardware-accelerated floating rose petals & stardust.
// Uses pure CSS transforms (translate3d) with will-change for 60fps on low-end hardware.
export default function FloatingPetals() {
  // Generate stable random properties for 14 delicate petals
  const petals = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: `${(i * 7.1) + Math.random() * 4}%`,
      animationDuration: `${9 + (i % 5) * 2.5}s`,
      animationDelay: `${(i % 7) * 1.3}s`,
      size: `${14 + (i % 3) * 6}px`,
      opacity: 0.45 + (i % 4) * 0.12,
      rotation: `${(i * 45) % 360}deg`,
      type: i % 3 === 0 ? 'sparkle' : 'petal'
    }));
  }, []);

  return (
    <div className="petals-container" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className={`floating-item ${p.type}`}
          style={{
            left: p.left,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            transform: `rotate(${p.rotation})`
          }}
        >
          {p.type === 'sparkle' ? '✦' : '🌸'}
        </span>
      ))}
    </div>
  );
}

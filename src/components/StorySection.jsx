import React, { useState, useEffect } from 'react';

const CHAPTERS = [
  {
    id: 1,
    tag: "Capítulo 1 • El Comienzo",
    title: "Ese click inesperado",
    image: "/img/foto1.png",
    alt: "Primera foto juntos",
    text: "Desde la primera vez que te vi, me enamoré. Posiblemente lo hice muy rápido pero yo sentí el dichoso \"click\" jajaja, realmente me gustabas en menos de una semana.",
    note: "Un recuerdo grabado en la memoria ♡",
    theme: "pink",
    stamp: "FIRST SIGHT • 2026"
  },
  {
    id: 2,
    tag: "Capítulo 2 • Conociéndonos",
    title: "Descubriendo tu sonrisa",
    image: "/img/foto2.png",
    alt: "Conociéndonos poco a poco",
    text: "Poco a poco nos fuimos conociendo y sé que era algo complicado porque no recordábamos quién era el otro, pero realmente me asombraba lo guapa que eres.",
    note: "Cada detalle tuyo me fascinaba...",
    theme: "blush",
    stamp: "MEMORIES • ♡"
  },
  {
    id: 3,
    tag: "Capítulo 3 • La Prueba",
    title: "Aquel 9 de abril",
    image: "/img/foto3.png",
    alt: "Mensaje sincero en la distancia",
    text: "Aunque fue doloroso desde ese 9 de abril, decidí esforzarme y esperarte a pesar que me dijeras que no lo haga y conozca a alguien más.",
    note: "Porque cuando el cariño es sincero, vale la pena esperar.",
    theme: "nostalgic",
    stamp: "FAITH • 09.04"
  },
  {
    id: 4,
    tag: "Capítulo 4 • La Luz",
    title: "El mensaje de strawberry 🍓",
    image: "/img/foto4.png",
    alt: "El reencuentro que cambió todo",
    text: "Luego recibí ese mensaje que me alegró para siempre, ese que dije \"valió la pena esperar\", volver a verte, amarte, sentirte. Fue un caos positivo para mis emociones, pasaba por un mal momento y lograste hacerme sonreír de nuevo.",
    note: "Ese 'Holaaa' que me devolvió la vida 🍓♡",
    theme: "strawberry",
    stamp: "REUNION • 🍓"
  },
  {
    id: 5,
    tag: "Capítulo 5 • La Calma",
    title: "Mi lugar seguro",
    image: null,
    isSpecialCard: true,
    specialIcon: "✨",
    text: "Desde el momento en que volviste a mi vida, cada charla nocturna, cada risa compartida y cada pequeño instante juntos se convirtió en mi rincón favorito del mundo. Me hiciste entender que lo que nace del corazón nunca se pierde; solo esperaba el momento indicado para florecer.",
    note: "Tu voz es paz en medio del caos.",
    theme: "rose-gold",
    stamp: "SAFE PLACE • ♡"
  },
  {
    id: 6,
    tag: "Capítulo 6 • Nuestro Presente",
    title: "La certeza de quererte",
    image: null,
    isSpecialCard: true,
    specialIcon: "🌸",
    text: "Estar contigo me llena de una paz y una felicidad que hacía muchísimo no experimentaba. Eres una persona maravillosa, dulce y única. Gracias por devolverme la ilusión, por tus detalles y por elegir escribir esta bonita historia a mi lado día tras día.",
    note: "Y esto recién empieza...",
    theme: "romantic",
    stamp: "FOREVER • 2026"
  }
];

export default function StorySection({ onGoToLetter }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedImage, setExpandedImage] = useState(null);

  const nextChapter = () => {
    if (activeIndex < CHAPTERS.length - 1) {
      setActiveIndex(prev => prev + 1);
    } else {
      onGoToLetter();
    }
  };

  const prevChapter = () => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
  };

  // Keyboard navigation for modal & photos
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && expandedImage) {
        setExpandedImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedImage]);

  const current = CHAPTERS[activeIndex];

  return (
    <section className="story-section">
      <div className="story-timeline-nav">
        <span className="timeline-title">Álbum de Nuestro Primer Mes</span>
        <div className="timeline-dots">
          {CHAPTERS.map((c, i) => (
            <button
              key={c.id}
              className={`timeline-dot ${i === activeIndex ? 'active' : ''} ${i < activeIndex ? 'visited' : ''}`}
              onClick={() => setActiveIndex(i)}
              title={c.title}
            >
              <span>{i + 1}</span>
            </button>
          ))}
          <button 
            className="timeline-dot letter-dot"
            onClick={onGoToLetter}
            title="Ir a la carta final"
          >
            💌
          </button>
        </div>
      </div>

      <div className="story-card-wrapper">
        <article className={`polaroid-story-card theme-${current.theme}`}>
          {/* Washi tape vintage decoration */}
          <div className="washi-tape"></div>

          {/* Postal stamp */}
          <div className="post-stamp">
            <span className="stamp-inner">{current.stamp}</span>
          </div>

          <header className="card-header">
            <span className="card-tag">{current.tag}</span>
            <h2 className="card-title">{current.title}</h2>
          </header>

          <div className="card-media-container">
            {current.image ? (
              <div 
                className="photo-frame clickable-photo-frame" 
                onClick={() => setExpandedImage({ src: current.image, alt: current.alt, title: current.title, note: current.note })}
                title="Haz clic para ver en pantalla completa"
              >
                <img 
                  src={current.image} 
                  alt={current.alt} 
                  className="vintage-photo" 
                  loading="lazy"
                />
                <div className="photo-grain-overlay"></div>
                <div className="photo-expand-badge">
                  <span>🔍 Toca para ampliar</span>
                </div>
              </div>
            ) : (
              <div className="romantic-art-frame">
                <span className="art-icon">{current.specialIcon}</span>
                <span className="art-sub">Un momento en nuestro corazón</span>
              </div>
            )}
          </div>

          <div className="card-body">
            <p className="card-text">
              "{current.text}"
            </p>
            <div className="handwritten-annotation">
              ~ {current.note}
            </div>
          </div>

          <footer className="card-navigation">
            <button 
              className="nav-btn prev-btn" 
              onClick={prevChapter}
              disabled={activeIndex === 0}
            >
              ← Anterior
            </button>
            <span className="page-counter">{activeIndex + 1} de {CHAPTERS.length}</span>
            <button 
              className="nav-btn next-btn" 
              onClick={nextChapter}
            >
              {activeIndex === CHAPTERS.length - 1 ? 'Abrir Carta Final 💌' : 'Sigue viendo →'}
            </button>
          </footer>
        </article>
      </div>

      <div className="story-quick-scroll">
        <button className="jump-letter-btn" onClick={onGoToLetter}>
          Ir directamente a la Carta Final 📜
        </button>
      </div>

      {/* Modal / Lightbox para ver imágenes individuales en gran tamaño */}
      {expandedImage && (
        <div 
          className="image-lightbox-overlay" 
          onClick={() => setExpandedImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="image-lightbox-card" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="lightbox-close-btn" 
              onClick={() => setExpandedImage(null)}
              aria-label="Cerrar imagen"
            >
              ✕ Cerrar
            </button>
            
            <div className="lightbox-image-container">
              <img 
                src={expandedImage.src} 
                alt={expandedImage.alt} 
                className="lightbox-full-img" 
              />
            </div>

            <div className="lightbox-caption">
              <h3>{expandedImage.title}</h3>
              <p>{expandedImage.note}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import React, { useState } from 'react';

export default function EnvelopeIntro({ onOpen }) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    // Smooth transition time before revealing the scrapbook
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div className={`envelope-screen ${isOpening ? 'fade-out' : ''}`}>
      <div className="envelope-wrapper">
        <div className="letter-header-tag">
          <span className="date-stamp">1er Mes • De Jonnath</span>
          <span className="tag-decor">✦</span>
          <span className="destination-tag">Para: Valeska ♡</span>
        </div>

        <div className={`vintage-envelope ${isOpening ? 'opened' : ''}`}>
          <div className="envelope-back"></div>
          <div className="envelope-paper-peek">
            <div className="peek-lines">
              <span className="line-peek"></span>
              <span className="line-peek short"></span>
            </div>
            <div className="peek-heart">💌</div>
          </div>
          <div className="envelope-pocket"></div>
          <div className="envelope-flap"></div>

          {/* Sello de lacre interactivo */}
          <button 
            className={`wax-seal ${isOpening ? 'broken' : ''}`}
            onClick={handleOpen}
            aria-label="Romper sello de lacre y abrir carta"
          >
            <div className="wax-seal-inner">
              <span className="wax-monogram">V</span>
              <span className="wax-heart">♡</span>
            </div>
            <span className="wax-ripple"></span>
          </button>
        </div>

        <div className="envelope-instructions">
          <p className="vintage-callout">Toca el sello de lacre para abrir tu carta</p>
          <span className="vintage-subtext">"Un mes desde que comenzó nuestra historia..."</span>
        </div>
      </div>
    </div>
  );
}

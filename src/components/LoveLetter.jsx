import React from 'react';
import SignaturePen from './SignaturePen';

export default function LoveLetter({ onBackToStory }) {
  return (
    <section className="love-letter-section">
      <div className="parchment-letter-wrapper">
        <div className="vintage-ribbon">
          <span>Primer Mes • Para Valeska ♡</span>
        </div>

        <article className="parchment-paper">
          <div className="parchment-texture-overlay"></div>
          
          <header className="letter-header">
            <div className="stamp-wax-corner">
              <span className="corner-heart">🌸</span>
            </div>
            <div className="letter-date-place">
              <p>Nuestro Primer Mes • 2026</p>
              <p>De: Jonnath</p>
            </div>
            <h1 className="letter-salutation">Mi querida Valeska,</h1>
          </header>

          <div className="letter-content-body">
            <p className="main-letter-paragraph">
              "Feliz primer mes, amor. No soy muy manual porque soy bastante malo haciendo físicamente las cosas, pero al menos te muestro como lo hago en digital"
            </p>

            <p className="secondary-letter-paragraph">
              Sé que a veces las palabras se quedan cortas para expresar todo lo que me haces sentir, pero quería prepararte algo único, que pudieras guardar y abrir siempre que quieras recordar lo especial que eres para mí. 
            </p>

            <p className="closing-sentiment">
              Gracias por hacerme sonreír, por tu paciencia y por este primer mes tan bonito. Prometo seguir cuidando de ti y de nosotros.
            </p>
          </div>

          <div className="letter-valediction">
            <p className="valediction-text">Con todo mi amor siempre,</p>
            {/* Firma autógrafa animada a pluma */}
            <SignaturePen autoStart={true} />
          </div>

          <footer className="letter-footer-note">
            <div className="love-counter-box">
              <span className="heart-pulse-icon">💖</span>
              <span>1 mes juntos... y toda una vida por compartir</span>
            </div>
          </footer>
        </article>

        <div className="letter-actions-bottom">
          <button className="back-story-btn" onClick={onBackToStory}>
            ← Volver a ver nuestros recuerdos
          </button>
        </div>
      </div>
    </section>
  );
}

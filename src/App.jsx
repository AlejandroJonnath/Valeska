import React, { useState } from 'react';
import FloatingPetals from './components/FloatingPetals';
import MusicPlayer from './components/MusicPlayer';
import EnvelopeIntro from './components/EnvelopeIntro';
import StorySection from './components/StorySection';
import LoveLetter from './components/LoveLetter';

export default function App() {
  const [currentView, setCurrentView] = useState('intro'); // 'intro' | 'story' | 'letter'

  return (
    <div className="romantic-app-root">
      {/* Background ambient petals */}
      <FloatingPetals />

      {/* Floating vintage music box */}
      <MusicPlayer />

      {/* Navigation header for quick switching after intro is opened */}
      {currentView !== 'intro' && (
        <header className="top-nav-bar">
          <button 
            className={`nav-tab ${currentView === 'story' ? 'active' : ''}`}
            onClick={() => setCurrentView('story')}
          >
            📸 Álbum de Recuerdos
          </button>
          <button 
            className={`nav-tab ${currentView === 'letter' ? 'active' : ''}`}
            onClick={() => setCurrentView('letter')}
          >
            📜 Carta de Primer Mes
          </button>
        </header>
      )}

      {/* Main interactive screens */}
      <main className="main-content-flow">
        {currentView === 'intro' && (
          <EnvelopeIntro onOpen={() => setCurrentView('story')} />
        )}

        {currentView === 'story' && (
          <StorySection onGoToLetter={() => setCurrentView('letter')} />
        )}

        {currentView === 'letter' && (
          <LoveLetter onBackToStory={() => setCurrentView('story')} />
        )}
      </main>

      {/* Subtle romantic watermark footer */}
      <footer className="romantic-footer">
        <p>Hecho con amor para Valeska ♡ Primer Mes</p>
      </footer>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';

// Lightweight, zero-external-dependency Music Box synthesizer using Web Audio API.
// Plays a delicate, romantic music box lullaby (notes of a romantic chord progression).
export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioCtxRef = useRef(null);
  const isPlayingRef = useRef(false);
  const timerRef = useRef(null);

  // Romantic melody notes (frequencies in Hz): Music box timbre
  // Melodic sequence inspired by sweet nostalgic lullabies
  const melody = [
    // Phrase 1 (C - G - Am - F)
    { note: 523.25, dur: 0.6 }, // C5
    { note: 659.25, dur: 0.6 }, // E5
    { note: 783.99, dur: 0.8 }, // G5
    { note: 659.25, dur: 0.5 }, // E5
    { note: 880.00, dur: 0.9 }, // A5
    { note: 783.99, dur: 0.7 }, // G5
    { note: 659.25, dur: 0.7 }, // E5
    { note: 587.33, dur: 0.9 }, // D5

    // Phrase 2
    { note: 523.25, dur: 0.6 }, // C5
    { note: 587.33, dur: 0.6 }, // D5
    { note: 659.25, dur: 0.8 }, // E5
    { note: 698.46, dur: 0.6 }, // F5
    { note: 659.25, dur: 0.8 }, // E5
    { note: 587.33, dur: 0.7 }, // D5
    { note: 523.25, dur: 1.2 }, // C5

    // Phrase 3 (Sweet high variation)
    { note: 783.99, dur: 0.6 }, // G5
    { note: 880.00, dur: 0.6 }, // A5
    { note: 987.77, dur: 0.8 }, // B5
    { note: 1046.50, dur: 1.1 }, // C6
    { note: 987.77, dur: 0.6 }, // B5
    { note: 880.00, dur: 0.8 }, // A5
    { note: 783.99, dur: 1.2 }, // G5

    // Phrase 4 (Warm resolution)
    { note: 698.46, dur: 0.6 }, // F5
    { note: 659.25, dur: 0.6 }, // E5
    { note: 587.33, dur: 0.8 }, // D5
    { note: 523.25, dur: 1.5 }  // C5
  ];

  const playMusicBoxNote = (freq, duration, gainNode, ctx) => {
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    // Pure bell-like music box timbre (sine with quick decay and bright chime)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Subtle overtone oscillator for authentic metallic tines
    const overtone = ctx.createOscillator();
    const overtoneGain = ctx.createGain();
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2.01, ctx.currentTime);

    const now = ctx.currentTime;
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.28 * volume, now + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.8);

    overtoneGain.gain.setValueAtTime(0, now);
    overtoneGain.gain.linearRampToValueAtTime(0.08 * volume, now + 0.015);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.9);

    osc.connect(noteGain);
    overtone.connect(overtoneGain);
    noteGain.connect(gainNode);
    overtoneGain.connect(gainNode);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + duration * 2);
    overtone.stop(now + duration * 1.5);
  };

  const startMelody = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.7, ctx.currentTime);
    masterGain.connect(ctx.destination);

    isPlayingRef.current = true;
    let step = 0;

    const playNext = () => {
      if (!isPlayingRef.current) return;
      const noteItem = melody[step % melody.length];
      playMusicBoxNote(noteItem.note, noteItem.dur, masterGain, ctx);
      step++;
      const nextDelay = (noteItem.dur * 0.95) * 1000;
      timerRef.current = setTimeout(playNext, nextDelay);
    };

    playNext();
  };

  const stopMelody = () => {
    isPlayingRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopMelody();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      startMelody();
    }
  };

  useEffect(() => {
    return () => {
      stopMelody();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div className="music-player-container">
      <button 
        className={`music-toggle-btn ${isPlaying ? 'playing' : ''}`}
        onClick={toggleMusic}
        title={isPlaying ? "Pausar cajita de música" : "Escuchar melodía para Valeska"}
        aria-label="Reproductor de música para Valeska"
      >
        <span className="music-icon">
          {isPlaying ? '🎵' : '🎼'}
        </span>
        <div className="music-info">
          <span className="music-title">Cajita de Música</span>
          <span className="music-status">{isPlaying ? 'Reproduciendo melodía...' : 'Haz clic para escuchar'}</span>
        </div>
        <div className={`music-waves ${isPlaying ? 'active' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    </div>
  );
}

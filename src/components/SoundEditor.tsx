import React, { useRef, useState } from 'react';
import { useSpriteStore } from '../stores/spriteStore';

interface SoundEntry {
  id: string;
  name: string;
  url: string;
  duration?: number;
}

export default function SoundEditor() {
  const { sprites, selectedSpriteId, updateSprite } = useSpriteStore();
  const selectedSprite = sprites.find((s) => s.id === selectedSpriteId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedSoundIndex, setSelectedSoundIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!selectedSprite) {
    return (
      <div className="sound-editor sound-editor--empty">
        <p>Select a sprite to edit its sounds.</p>
      </div>
    );
  }

  const sounds: SoundEntry[] = selectedSprite.sounds || [];

  const handleUpload = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.onloadedmetadata = () => {
      const newSound: SoundEntry = {
        id: `sound-${Date.now()}`,
        name: file.name.replace(/\.[^.]+$/, ''),
        url,
        duration: audio.duration,
      };
      updateSprite(selectedSprite.id, {
        sounds: [...sounds, newSound],
      });
    };
    e.target.value = '';
  };

  const handlePlay = (index: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (playingIndex === index) {
      setPlayingIndex(null);
      return;
    }
    const sound = sounds[index];
    if (!sound?.url) return;
    const audio = new Audio(sound.url);
    audioRef.current = audio;
    audio.play();
    setPlayingIndex(index);
    audio.onended = () => setPlayingIndex(null);
  };

  const handleDeleteSound = (index: number) => {
    const newSounds = sounds.filter((_, i) => i !== index);
    updateSprite(selectedSprite.id, { sounds: newSounds });
    if (selectedSoundIndex >= newSounds.length) {
      setSelectedSoundIndex(Math.max(0, newSounds.length - 1));
    }
  };

  const handleRenameSound = (index: number, name: string) => {
    const newSounds = sounds.map((s, i) => i === index ? { ...s, name } : s);
    updateSprite(selectedSprite.id, { sounds: newSounds });
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return '0:00';
    const m = Math.floor(duration / 60);
    const s = Math.floor(duration % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const selectedSound = sounds[selectedSoundIndex];

  return (
    <div className="sound-editor">
      {/* Sidebar */}
      <div className="sound-editor__sidebar">
        {/* Add sound actions */}
        <div className="sound-editor__add-actions">
          <button className="sound-editor__add-btn sound-editor__add-btn--library" title="Choose a Sound">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Choose</span>
          </button>
          <button className="sound-editor__add-btn sound-editor__add-btn--record" title="Record">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4" fill="currentColor"/>
              <path d="M12 6a6 6 0 016 6M12 6a6 6 0 00-6 6m6 6v3m-3 0h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Record</span>
          </button>
          <button className="sound-editor__add-btn sound-editor__add-btn--surprise" title="Surprise">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Surprise</span>
          </button>
          <button className="sound-editor__add-btn sound-editor__add-btn--upload" title="Upload Sound" onClick={handleUpload}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Upload</span>
          </button>
        </div>

        <input ref={fileInputRef} type="file" accept="audio/*" style={{ display: 'none' }} onChange={handleFileChange} />

        {/* Sound list */}
        <div className="sound-editor__list">
          {sounds.length === 0 && (
            <div className="sound-editor__list-empty">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>No sounds yet</p>
            </div>
          )}
          {sounds.map((sound, index) => (
            <div
              key={sound.id}
              className={`sound-editor__list-item ${index === selectedSoundIndex ? 'sound-editor__list-item--active' : ''}`}
              onClick={() => setSelectedSoundIndex(index)}
            >
              <button
                className={`sound-editor__list-play ${playingIndex === index ? 'sound-editor__list-play--playing' : ''}`}
                onClick={(e) => { e.stopPropagation(); handlePlay(index); }}
              >
                {playingIndex === index ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="3" y="2" width="3" height="10" rx="1" fill="currentColor"/>
                    <rect x="8" y="2" width="3" height="10" rx="1" fill="currentColor"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 2.5l9 4.5-9 4.5V2.5z" fill="currentColor"/>
                  </svg>
                )}
              </button>
              <div className="sound-editor__list-info">
                <input
                  className="sound-editor__list-name"
                  value={sound.name}
                  onChange={(e) => handleRenameSound(index, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="sound-editor__list-duration">{formatDuration(sound.duration)}</span>
              </div>
              <button
                className="sound-editor__list-delete"
                onClick={(e) => { e.stopPropagation(); handleDeleteSound(index); }}
                title="Delete"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 4h10M5 4V2.5A.5.5 0 015.5 2h3a.5.5 0 01.5.5V4M3 4v8a1 1 0 001 1h6a1 1 0 001-1V4" stroke="#EC5959" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main area */}
      <div className="sound-editor__main">
        {selectedSound ? (
          <>
            <div className="sound-editor__main-header">
              <span className="sound-editor__main-title">{selectedSound.name}</span>
              <span className="sound-editor__main-duration">{formatDuration(selectedSound.duration)}</span>
            </div>

            {/* Waveform placeholder */}
            <div className="sound-editor__waveform">
              <svg width="100%" height="100%" viewBox="0 0 400 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4C97FF" stopOpacity="0.9"/>
                    <stop offset="100%" stopColor="#4C97FF" stopOpacity="0.2"/>
                  </linearGradient>
                </defs>
                {Array.from({ length: 80 }).map((_, i) => {
                  const h = Math.abs(Math.sin(i * 0.4) * 45 + Math.sin(i * 0.7) * 20 + Math.sin(i * 1.2) * 10 + 5);
                  return (
                    <rect
                      key={i}
                      x={i * 5 + 1}
                      y={60 - h}
                      width="3"
                      height={h * 2}
                      rx="1.5"
                      fill="url(#waveGrad)"
                    />
                  );
                })}
                <line x1="0" y1="60" x2="400" y2="60" stroke="#4C97FF" strokeWidth="0.5" opacity="0.3"/>
              </svg>
            </div>

            {/* Playback controls */}
            <div className="sound-editor__controls">
              <button
                className={`sound-editor__play-btn ${playingIndex === selectedSoundIndex ? 'sound-editor__play-btn--playing' : ''}`}
                onClick={() => handlePlay(selectedSoundIndex)}
              >
                {playingIndex === selectedSoundIndex ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="3" y="2" width="4" height="12" rx="1.5" fill="currentColor"/>
                      <rect x="9" y="2" width="4" height="12" rx="1.5" fill="currentColor"/>
                    </svg>
                    Stop
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 2.5l10 5.5-10 5.5V2.5z" fill="currentColor"/>
                    </svg>
                    Play
                  </>
                )}
              </button>

              <div className="sound-editor__effects">
                <span className="sound-editor__effects-label">Effects:</span>
                {['Faster', 'Slower', 'Louder', 'Softer', 'Echo', 'Robot', 'Reverse'].map((effect) => (
                  <button key={effect} className="sound-editor__effect-btn">{effect}</button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="sound-editor__main-empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>Add a sound to get started</p>
            <button className="sound-editor__main-upload-btn" onClick={handleUpload}>
              Upload Sound
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Display Mode Toggle
 *
 * 3-way toggle for selecting how the sentence is displayed:
 * - Visual + Audio: Show pinyin and auto-play audio
 * - Audio Only: Hide pinyin, only play audio
 * - Visual Only: Show pinyin, no auto-play audio
 */

import React from 'react';
import type { SentenceDisplayMode } from '../../lib/quiz/translatorTypes';

interface DisplayModeToggleProps {
  mode: SentenceDisplayMode;
  onModeChange: (mode: SentenceDisplayMode) => void;
}

const modes: { value: SentenceDisplayMode; label: string; icon: string }[] = [
  { value: 'visual-audio', label: 'Both', icon: '👁️🔊' },
  { value: 'audio-only', label: 'Audio', icon: '🔊' },
  { value: 'visual-only', label: 'Visual', icon: '👁️' },
];

export function DisplayModeToggle({ mode, onModeChange }: DisplayModeToggleProps) {
  return (
    <div className="display-mode-toggle">
      <span className="display-mode-label">Display:</span>
      <div className="display-mode-buttons">
        {modes.map(m => (
          <button
            key={m.value}
            className={`display-mode-btn ${mode === m.value ? 'active' : ''}`}
            onClick={() => onModeChange(m.value)}
            title={m.label}
            aria-label={`${m.label} mode`}
            aria-pressed={mode === m.value}
          >
            <span className="display-mode-icon">{m.icon}</span>
            <span className="display-mode-text">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

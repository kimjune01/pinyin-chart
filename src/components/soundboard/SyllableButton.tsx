/**
 * SyllableButton - Individual syllable cell in the pinyin grid
 *
 * Features:
 * - Click to play audio
 * - Visual feedback (hover, playing, error states)
 * - Shows pinyin with tone marks
 * - Handles loading and error states
 */

import { useState } from 'react';
import { audioService } from '../../lib/audio/AudioService';

interface SyllableButtonProps {
  pinyin: string;
  tone: number;
  displayPinyin: string; // With tone marks (e.g., "mā")
  onSelect?: (pinyin: string) => void;
  isSelected?: boolean;
}

export default function SyllableButton({ pinyin, tone, displayPinyin, onSelect, isSelected }: SyllableButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleClick = async () => {
    if (isPlaying) return;

    setIsPlaying(true);
    setHasError(false);
    onSelect?.(pinyin);

    try {
      const pinyinWithTone = `${pinyin}${tone}`;
      await audioService.play(pinyinWithTone);
    } catch (error) {
      console.error(`Failed to play ${pinyin}${tone}:`, error);
      setHasError(true);
    } finally {
      // Keep playing state for a moment for visual feedback
      setTimeout(() => setIsPlaying(false), 500);
    }
  };

  return (
    <button
      className={`syllable-button ${isPlaying ? 'playing' : ''} ${hasError ? 'error' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      disabled={isPlaying}
      aria-label={`Play ${displayPinyin}`}
      title={`Click to hear ${displayPinyin}`}
      data-syllable={pinyin}
    >
      <span className="syllable-text">{displayPinyin}</span>
      {isPlaying && <span className="playing-indicator">🔊</span>}
      {hasError && <span className="error-indicator">⚠️</span>}
    </button>
  );
}

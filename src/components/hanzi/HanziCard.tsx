/**
 * HanziCard - Individual character card in the hanzi grid
 *
 * Features:
 * - Click to play audio
 * - Shows hanzi character prominently
 * - Pinyin with tone marks below
 * - English meaning
 * - Visual feedback (hover, playing states)
 */

import { useState } from 'react';
import { audioService } from '../../lib/audio/AudioService';
import type { HSKCharacter } from '../../data/hskCharacters';

interface HanziCardProps {
  character: HSKCharacter;
  isSelected?: boolean;
  onSelect?: (character: HSKCharacter) => void;
}

const TONE_COLORS: Record<number, string> = {
  1: 'var(--tone-1, #e74c3c)',  // Red - high level
  2: 'var(--tone-2, #f39c12)',  // Orange - rising
  3: 'var(--tone-3, #27ae60)',  // Green - dipping
  4: 'var(--tone-4, #3498db)',  // Blue - falling
  5: 'var(--tone-5, #95a5a6)',  // Gray - neutral
};

export default function HanziCard({ character, isSelected, onSelect }: HanziCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleClick = async () => {
    if (isPlaying) return;

    setIsPlaying(true);
    setHasError(false);
    onSelect?.(character);

    try {
      // Use vocabulary audio for hanzi
      await audioService.playVocabulary(character.hanzi);
    } catch (error) {
      console.error(`Failed to play ${character.hanzi}:`, error);
      setHasError(true);
    } finally {
      setTimeout(() => setIsPlaying(false), 500);
    }
  };

  const toneColor = TONE_COLORS[character.tone] || TONE_COLORS[5];

  return (
    <button
      className={`hanzi-card ${isPlaying ? 'playing' : ''} ${hasError ? 'error' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      disabled={isPlaying}
      aria-label={`${character.hanzi} - ${character.pinyinDisplay} - ${character.meaning}`}
      title={`Click to hear ${character.hanzi}`}
      data-hanzi={character.hanzi}
      style={{ '--tone-color': toneColor } as React.CSSProperties}
    >
      <span className="hanzi-character">{character.hanzi}</span>
      <span className="hanzi-pinyin">{character.pinyinDisplay}</span>
      <span className="hanzi-meaning">{character.meaning}</span>
      {isPlaying && <span className="playing-indicator">🔊</span>}
      {hasError && <span className="error-indicator">⚠️</span>}
      <span className="tone-indicator" aria-label={`Tone ${character.tone}`} />
    </button>
  );
}

/**
 * ToneSelector - Sticky radio button tone selector with keyboard shortcuts
 *
 * Features:
 * - Sticky positioning (always visible while scrolling)
 * - Keyboard shortcuts: 1-5 for tones
 * - Color-coded by tone
 * - Accessible with ARIA labels
 */

import { useEffect } from 'react';

interface ToneSelectorProps {
  selectedTone: number;
  onToneChange: (tone: number) => void;
}

const TONES = [
  { number: 1, label: 'mā', name: '1st Tone', color: 'var(--tone-1-color)', key: '1' },
  { number: 2, label: 'má', name: '2nd Tone', color: 'var(--tone-2-color)', key: '2' },
  { number: 3, label: 'mǎ', name: '3rd Tone', color: 'var(--tone-3-color)', key: '3' },
  { number: 4, label: 'mà', name: '4th Tone', color: 'var(--tone-4-color)', key: '4' },
  { number: 5, label: 'ma', name: 'Neutral', color: 'var(--tone-5-color)', key: '5' },
];

export default function ToneSelector({ selectedTone, onToneChange }: ToneSelectorProps) {
  // Keyboard shortcuts: 1-5
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const toneMap: Record<string, number> = {
        '1': 1, '2': 2, '3': 3, '4': 4, '5': 5
      };

      const tone = toneMap[e.key];
      if (tone) {
        e.preventDefault();
        onToneChange(tone);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onToneChange]);

  return (
    <div className="tone-selector-sticky">
      <div className="tone-selector-container">
        <label className="tone-selector-label">Select Tone:</label>

        <div className="tone-options">
          {TONES.map((tone) => (
            <label
              key={tone.number}
              className={`tone-option ${selectedTone === tone.number ? 'selected' : ''}`}
              style={{
                '--tone-color': tone.color
              } as React.CSSProperties}
            >
              <input
                type="radio"
                name="tone"
                value={tone.number}
                checked={selectedTone === tone.number}
                onChange={() => onToneChange(tone.number)}
                aria-label={`${tone.name} - Press ${tone.key}`}
                aria-keyshortcuts={tone.key}
              />
              <span className="tone-button">
                <span className="tone-label">{tone.label}</span>
                <span className="tone-key">{tone.key}</span>
              </span>
              <span className="tone-name">{tone.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

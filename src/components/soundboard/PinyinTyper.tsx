/**
 * PinyinTyper - Type a syllable and select a tone to hear it
 */

import { useState, useCallback } from 'react';
import { PINYIN_SYLLABLES } from '../../data/pinyinSyllables';
import { audioService } from '../../lib/audio/AudioService';
import { addToneMarks } from '../../lib/utils/pinyinUtils';
import ToneIcon from '../shared/ToneIcon';

export default function PinyinTyper() {
  const [input, setInput] = useState('');
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToneClick = useCallback(async (tone: number) => {
    const syllable = input.trim().toLowerCase();

    if (!syllable) {
      setError('Type a syllable first');
      setLastPlayed(null);
      return;
    }

    // Check if this syllable exists
    const syllableData = PINYIN_SYLLABLES.find(s => s.pinyin === syllable);

    if (!syllableData) {
      setError(`"${syllable}" is not a valid pinyin syllable`);
      setLastPlayed(null);
      return;
    }

    // Check if this tone exists for this syllable
    if (!syllableData.tones.includes(tone)) {
      setError(`"${addToneMarks(syllable, tone)}" doesn't exist (tone ${tone} not available)`);
      setLastPlayed(null);
      return;
    }

    // Valid! Play the sound
    setError(null);
    setLastPlayed(addToneMarks(syllable, tone));
    setIsPlaying(true);

    try {
      await audioService.play(`${syllable}${tone}`);
    } catch (err) {
      setError('Failed to play audio');
    } finally {
      setIsPlaying(false);
    }
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow pinyin characters (letters and ü)
    const value = e.target.value.replace(/[^a-züA-ZÜ]/g, '').toLowerCase();
    setInput(value);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Number keys 1-4 trigger tone buttons
    const num = parseInt(e.key);
    if (num >= 1 && num <= 4) {
      e.preventDefault();
      handleToneClick(num);
    }
  };

  return (
    <div className="pinyin-typer">
      <h3 className="pinyin-typer-title">Type & Listen</h3>

      <div className="pinyin-typer-input-row">
        <input
          type="text"
          className="pinyin-typer-input"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type syllable (e.g. ma, sheng)"
          maxLength={6}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>

      <div className="pinyin-typer-tones">
        {[1, 2, 3, 4].map(tone => (
          <button
            key={tone}
            className={`pinyin-typer-tone-btn tone-${tone}`}
            onClick={() => handleToneClick(tone)}
            disabled={isPlaying}
          >
            <ToneIcon tone={tone} size={32} />
            <span className="tone-number">{tone}</span>
          </button>
        ))}
      </div>

      <div className="pinyin-typer-feedback">
        {error && (
          <div className="pinyin-typer-error">{error}</div>
        )}
        {lastPlayed && !error && (
          <div className="pinyin-typer-success">{lastPlayed}</div>
        )}
        {!error && !lastPlayed && (
          <div className="pinyin-typer-hint">Type a syllable, then press 1-4 or click a tone</div>
        )}
      </div>
    </div>
  );
}

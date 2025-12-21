/**
 * PinyinTyper - Type a syllable and select a tone to hear it
 */

import { useState, useCallback, useMemo } from 'react';
import { PINYIN_SYLLABLES } from '../../data/pinyinSyllables';
import { HSK_CHARACTERS } from '../../data/hskCharacters';
import { audioService } from '../../lib/audio/AudioService';
import { addToneMarks } from '../../lib/utils/pinyinUtils';
import ToneIcon from '../shared/ToneIcon';
import HanziCard from '../hanzi/HanziCard';

export default function PinyinTyper() {
  const [input, setInput] = useState('');
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Find hanzi that match the current syllable+tone
  const matchingHanzi = useMemo(() => {
    const syllable = input.trim().toLowerCase();
    if (!syllable) return [];

    // The pinyin format in HSK_CHARACTERS is like "wo3", "ni3", "wo3men5", etc.
    // We need to match syllables within multi-syllable words too
    const results = HSK_CHARACTERS.filter(char => {
      const pinyinWithTones = char.pinyin.toLowerCase();

      // Split pinyin into individual syllables (e.g., "wo3men5" -> ["wo3", "men5"])
      const syllables = pinyinWithTones.match(/[a-zü]+[0-9]/g) || [];

      // Check if any syllable matches
      const matchingSyllable = syllables.find(s => {
        const baseSyllable = s.replace(/[0-9]/g, '');
        const tone = parseInt(s.match(/[0-9]/)?.[0] || '0');

        if (baseSyllable !== syllable) return false;

        // If tone is selected, also filter by tone
        if (selectedTone !== null) {
          return tone === selectedTone;
        }

        return true;
      });

      return !!matchingSyllable;
    });

    // Sort: single characters first, then by HSK level
    return results.sort((a, b) => {
      if (a.hanzi.length !== b.hanzi.length) {
        return a.hanzi.length - b.hanzi.length;
      }
      return a.level - b.level;
    });
  }, [input, selectedTone]);

  const handleToneClick = useCallback(async (tone: number) => {
    const syllable = input.trim().toLowerCase();

    // Update selected tone for hanzi display
    setSelectedTone(tone);

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
    setSelectedTone(null); // Reset tone selection when input changes
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

      {/* Display matching hanzi from HSK characters */}
      {matchingHanzi.length > 0 && (
        <div className="pinyin-typer-hanzi">
          <div className="pinyin-typer-hanzi-label">
            Hanzi with this pronunciation:
          </div>
          <div className="pinyin-typer-hanzi-list">
            {matchingHanzi.map((char, idx) => (
              <HanziCard key={`${char.hanzi}-${idx}`} character={char} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * SentenceExplorer - Interactive sentence exploration component
 *
 * A beginner-friendly way to explore Chinese sentences:
 * - List view of horizontal cards per category
 * - Click to select, Space to play selected
 * - Two play buttons: full sentence (TTS) and syllable-by-syllable
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { audioService } from '../../lib/audio/AudioService';
import {
  beginnerPhrases,
  phraseCategories,
  type Phrase,
} from '../../data/beginnerPhrases';

interface SentenceExplorerProps {
  initialCategory?: string;
}

export default function SentenceExplorer({ initialCategory }: SentenceExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'greetings');
  const [selectedPhraseId, setSelectedPhraseId] = useState<string | null>(null);
  const [playingPhraseId, setPlayingPhraseId] = useState<string | null>(null);
  const [syllablePhraseId, setSyllablePhraseId] = useState<string | null>(null);
  const isPlayingRef = useRef(false);

  // Get phrases for current category
  const categoryPhrases = beginnerPhrases.filter(p => p.category === selectedCategory);
  const selectedPhrase = categoryPhrases.find(p => p.id === selectedPhraseId);

  // Select first phrase when category changes
  useEffect(() => {
    if (categoryPhrases.length > 0) {
      setSelectedPhraseId(categoryPhrases[0].id);
    }
  }, [selectedCategory]);

  // Play full phrase via TTS
  const playPhrase = useCallback(async (phrase: Phrase) => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    setPlayingPhraseId(phrase.id);

    try {
      await audioService.playVocabulary(phrase.chinese, true);
    } catch (error) {
      console.error('Error playing phrase:', error);
    } finally {
      isPlayingRef.current = false;
      setPlayingPhraseId(null);
    }
  }, []);

  // Play syllables one by one
  const playSyllables = useCallback(async (phrase: Phrase) => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    setSyllablePhraseId(phrase.id);

    try {
      for (const word of phrase.words) {
        const pinyinParts = word.pinyin.match(/[a-zA-ZüÜ]+\d/g);
        if (pinyinParts && pinyinParts.length > 1) {
          await audioService.playVocabulary(word.hanzi, true);
        } else {
          await audioService.play(word.pinyin, true);
        }
        // Small pause between words
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (error) {
      console.error('Error playing syllables:', error);
    } finally {
      isPlayingRef.current = false;
      setSyllablePhraseId(null);
    }
  }, []);

  // Keyboard support - Space to play selected
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && selectedPhrase) {
        e.preventDefault();
        playPhrase(selectedPhrase);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        const currentIndex = categoryPhrases.findIndex(p => p.id === selectedPhraseId);
        if (currentIndex < categoryPhrases.length - 1) {
          setSelectedPhraseId(categoryPhrases[currentIndex + 1].id);
        }
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = categoryPhrases.findIndex(p => p.id === selectedPhraseId);
        if (currentIndex > 0) {
          setSelectedPhraseId(categoryPhrases[currentIndex - 1].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhrase, playPhrase, categoryPhrases, selectedPhraseId]);

  return (
    <div className="sentence-explorer">
      {/* Category Selector */}
      <div className="category-section">
        <select
          className="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {phraseCategories.map(category => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
        <span className="phrase-count">{categoryPhrases.length} phrases</span>
      </div>

      {/* Phrase List */}
      <div className="phrase-list">
        {categoryPhrases.map((phrase) => (
          <div
            key={phrase.id}
            className={`phrase-card ${selectedPhraseId === phrase.id ? 'selected' : ''} ${playingPhraseId === phrase.id || syllablePhraseId === phrase.id ? 'playing' : ''}`}
            onClick={() => {
              setSelectedPhraseId(phrase.id);
              playSyllables(phrase);
            }}
          >
            <div className="phrase-content">
              <div className="phrase-chinese">{phrase.chinese}</div>
              <div className="phrase-details">
                <div className="phrase-pinyin">{phrase.pinyinDisplay}</div>
                <div className="phrase-english">{phrase.english}</div>
              </div>
            </div>
            <button
              className="play-btn"
              onClick={(e) => {
                e.stopPropagation();
                playPhrase(phrase);
              }}
              disabled={isPlayingRef.current}
              aria-label={`Play ${phrase.english}`}
              title="Play full sentence"
            >
              {playingPhraseId === phrase.id ? '🔊' : '▶'}
            </button>
          </div>
        ))}
      </div>

      <style>{`
        .sentence-explorer {
          max-width: 600px;
          margin: 0 auto;
        }

        .category-section {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .category-select {
          flex: 1;
          padding: var(--spacing-sm) var(--spacing-md);
          font-size: var(--font-size-base);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
          color: var(--color-text);
        }

        .category-select:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .phrase-count {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          white-space: nowrap;
        }

        .phrase-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-xl);
        }

        .phrase-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          background: var(--color-surface);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .phrase-card:hover {
          border-color: var(--color-primary);
        }

        .phrase-card.selected {
          border-color: var(--color-primary);
          background: rgba(74, 144, 226, 0.08);
        }

        .phrase-card.playing {
          background: rgba(74, 144, 226, 0.15);
        }

        .phrase-content {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .phrase-chinese {
          font-size: var(--font-size-3xl);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text);
          line-height: 1.2;
          padding: 0 var(--spacing-md);
        }

        .phrase-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .phrase-pinyin {
          font-size: var(--font-size-sm);
          color: var(--color-primary);
        }

        .phrase-english {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }

        .play-btn {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: var(--radius-full);
          cursor: pointer;
          font-size: var(--font-size-sm);
          transition: all var(--transition-fast);
        }

        .play-btn:hover:not(:disabled) {
          background: var(--color-primary-hover);
          transform: scale(1.1);
        }

        .play-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .phrase-chinese {
            font-size: var(--font-size-2xl);
          }

          .phrase-pinyin,
          .phrase-english {
            font-size: var(--font-size-xs);
          }

          .play-btn {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </div>
  );
}

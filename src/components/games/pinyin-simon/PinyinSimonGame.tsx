/**
 * PinyinSimonGame - Pinyin Simon Memory Game
 * Adapted from Strudel's PitchSimon.jsx
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { audioService } from '../../../lib/audio/AudioService';
import { addToneMarks } from '../../../lib/utils/pinyinUtils';
import { PINYIN_SYLLABLES } from '../../../data/pinyinSyllables';

// Types
type GameState = 'menu' | 'playing' | 'listening' | 'success' | 'failed';
type DifficultyMode = 'tones' | 'similar';
type GameMode = 'easy' | 'medium' | 'hard';

interface SyllableSet {
  items: SyllableItem[];
  name: string;
}

interface SyllableItem {
  id: string;
  display: string;
  audio: string;  // pinyin with tone for audio playback
  hanzi?: string; // for HSK words
}

// Button colors - classic Simon style
const BUTTON_COLORS = [
  { bg: 'simon-red', active: 'simon-red-active' },
  { bg: 'simon-blue', active: 'simon-blue-active' },
  { bg: 'simon-yellow', active: 'simon-yellow-active' },
  { bg: 'simon-green', active: 'simon-green-active' },
];

// Storage keys
const STORAGE_KEYS = {
  highScore: 'pinyin-simon-highscore',
  speed: 'pinyin-simon-speed',
  difficulty: 'pinyin-simon-difficulty',
  gameMode: 'pinyin-simon-gamemode',
};

// Helper functions for localStorage
function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail
  }
}

// Generate syllable sets based on difficulty
function generateSyllableSet(difficulty: DifficultyMode): SyllableSet {
  switch (difficulty) {
    case 'tones': {
      // Pick a random syllable that has all 4 tones
      const syllablesWithAllTones = PINYIN_SYLLABLES.filter(
        s => s.tones.includes(1) && s.tones.includes(2) && s.tones.includes(3) && s.tones.includes(4)
      );
      const syllable = syllablesWithAllTones[Math.floor(Math.random() * syllablesWithAllTones.length)];
      return {
        name: syllable.pinyin,
        items: [1, 2, 3, 4].map(tone => ({
          id: `${syllable.pinyin}${tone}`,
          display: addToneMarks(syllable.pinyin, tone),
          audio: `${syllable.pinyin}${tone}`,
        })),
      };
    }
    case 'similar': {
      // Confusing initial groups
      const confusingGroups = [
        ['zh', 'ch', 'sh', 'r'],
        ['z', 'c', 's'],
        ['j', 'q', 'x'],
        ['b', 'p', 'm', 'f'],
        ['d', 't', 'n', 'l'],
      ];
      const group = confusingGroups[Math.floor(Math.random() * confusingGroups.length)];
      // Find a common final that works with all initials in the group
      const commonFinal = 'a';
      const tone = Math.floor(Math.random() * 4) + 1;

      const items: SyllableItem[] = [];
      for (const initial of group.slice(0, 4)) {
        const syllable = PINYIN_SYLLABLES.find(s => s.initial === initial && s.final === commonFinal);
        if (syllable && syllable.tones.includes(tone)) {
          items.push({
            id: `${syllable.pinyin}${tone}`,
            display: addToneMarks(syllable.pinyin, tone),
            audio: `${syllable.pinyin}${tone}`,
          });
        }
      }

      // Fallback if we don't have 4 items
      while (items.length < 4) {
        const randomSyllable = PINYIN_SYLLABLES[Math.floor(Math.random() * PINYIN_SYLLABLES.length)];
        if (randomSyllable.tones.includes(tone) && !items.find(i => i.id === `${randomSyllable.pinyin}${tone}`)) {
          items.push({
            id: `${randomSyllable.pinyin}${tone}`,
            display: addToneMarks(randomSyllable.pinyin, tone),
            audio: `${randomSyllable.pinyin}${tone}`,
          });
        }
      }

      return { name: `${group.join('/')} sounds`, items: items.slice(0, 4) };
    }
  }
}

// Avoid runs of 3+ same items
function pickNextItem(items: SyllableItem[], sequence: string[]): string {
  const lastTwo = sequence.slice(-2);
  if (lastTwo.length === 2 && lastTwo[0] === lastTwo[1]) {
    // Last two are the same, pick different
    const otherItems = items.filter(i => i.id !== lastTwo[0]);
    return otherItems[Math.floor(Math.random() * otherItems.length)].id;
  }
  return items[Math.floor(Math.random() * items.length)].id;
}

export default function PinyinSimonGame() {
  // Game state
  const [gameState, setGameState] = useState<GameState>('menu');
  const [difficulty, setDifficulty] = useState<DifficultyMode>('tones');
  const [gameMode, setGameMode] = useState<GameMode>('easy');
  const [speed, setSpeed] = useState(1.0);
  const [syllableSet, setSyllableSet] = useState<SyllableSet | null>(null);
  const [targetSequence, setTargetSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [currentEasyItem, setCurrentEasyItem] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [centerPlaying, setCenterPlaying] = useState(false);

  // Refs
  const autoReplayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load settings on mount
  useEffect(() => {
    setHighScore(loadFromStorage(STORAGE_KEYS.highScore, 0));
    setSpeed(loadFromStorage(STORAGE_KEYS.speed, 1.0));
    setDifficulty(loadFromStorage(STORAGE_KEYS.difficulty, 'tones'));
    setGameMode(loadFromStorage(STORAGE_KEYS.gameMode, 'easy'));
  }, []);

  // Save settings when they change
  useEffect(() => { saveToStorage(STORAGE_KEYS.speed, speed); }, [speed]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.difficulty, difficulty); }, [difficulty]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.gameMode, gameMode); }, [gameMode]);

  // Play a single item with button highlight (for hard mode sequence playback)
  const playItem = useCallback(async (item: SyllableItem, buttonIndex: number) => {
    setActiveButton(buttonIndex);

    try {
      if (item.hanzi) {
        await audioService.playVocabulary(item.hanzi);
      } else if (item.audio.includes(',')) {
        await audioService.playSequence(item.audio.split(','));
      } else {
        await audioService.play(item.audio);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }

    const noteDelay = Math.round(800 / speed);
    await new Promise(resolve => setTimeout(resolve, noteDelay));
    setActiveButton(null);
  }, [speed]);

  // Play a single item with center highlight only (for easy mode prompts - no hint!)
  const playItemCenter = useCallback(async (item: SyllableItem) => {
    setCenterPlaying(true);

    try {
      if (item.hanzi) {
        await audioService.playVocabulary(item.hanzi);
      } else if (item.audio.includes(',')) {
        await audioService.playSequence(item.audio.split(','));
      } else {
        await audioService.play(item.audio);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }

    const noteDelay = Math.round(800 / speed);
    await new Promise(resolve => setTimeout(resolve, noteDelay));
    setCenterPlaying(false);
  }, [speed]);

  // Play entire sequence with button highlights (for hard mode - showing the new syllable set)
  const playSequence = useCallback(async (sequence: string[], set: SyllableSet) => {
    for (const itemId of sequence) {
      const index = set.items.findIndex(i => i.id === itemId);
      const item = set.items[index];
      if (item) {
        await playItem(item, index);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
  }, [playItem]);

  // Play entire sequence with center highlight only (no hints!)
  const playSequenceCenter = useCallback(async (sequence: string[], set: SyllableSet) => {
    for (const itemId of sequence) {
      const item = set.items.find(i => i.id === itemId);
      if (item) {
        await playItemCenter(item);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
  }, [playItemCenter]);

  // Play sequence fast (for recap on failure)
  const playSequenceFast = useCallback(async (sequence: string[], set: SyllableSet) => {
    for (const itemId of sequence) {
      const index = set.items.findIndex(i => i.id === itemId);
      const item = set.items[index];
      if (item) {
        setActiveButton(index);
        try {
          if (item.hanzi) {
            await audioService.playVocabulary(item.hanzi);
          } else {
            await audioService.play(item.audio);
          }
        } catch { /* ignore */ }
        await new Promise(resolve => setTimeout(resolve, 400));
        setActiveButton(null);
      }
    }
  }, []);

  // Start new game
  const handleStart = useCallback(async () => {
    const set = generateSyllableSet(difficulty);
    setSyllableSet(set);
    setScore(0);
    setUserSequence([]);
    setCurrentEasyItem(null);

    if (gameMode === 'easy') {
      // Easy mode: single item - use center highlight (no hint!)
      const randomItem = set.items[Math.floor(Math.random() * set.items.length)];
      setTargetSequence([]);
      setGameState('playing');

      setTimeout(async () => {
        await playItemCenter(randomItem);
        setCurrentEasyItem(randomItem.id);
        setGameState('listening');
      }, 500);
    } else if (gameMode === 'medium') {
      // Medium mode: sequence with center highlight only (no hints)
      const firstItem = pickNextItem(set.items, []);
      setTargetSequence([firstItem]);
      setGameState('playing');

      setTimeout(async () => {
        await playSequenceCenter([firstItem], set);
        setGameState('listening');
      }, 500);
    } else {
      // Hard mode: sequence with button hints (since syllables change, need to show them)
      const firstItem = pickNextItem(set.items, []);
      setTargetSequence([firstItem]);
      setGameState('playing');

      setTimeout(async () => {
        await playSequence([firstItem], set);
        setGameState('listening');
      }, 500);
    }
  }, [difficulty, gameMode, playItemCenter, playSequence, playSequenceCenter]);

  // Handle button click
  const handleButtonClick = useCallback(async (index: number) => {
    if (gameState !== 'listening' || !syllableSet) return;

    const clickedItem = syllableSet.items[index];

    // Play the clicked button's sound
    setActiveButton(index);
    try {
      if (clickedItem.hanzi) {
        await audioService.playVocabulary(clickedItem.hanzi);
      } else {
        await audioService.play(clickedItem.audio);
      }
    } catch { /* ignore */ }

    await new Promise(resolve => setTimeout(resolve, 300));
    setActiveButton(null);

    if (gameMode === 'easy') {
      // Easy mode: check single item
      if (clickedItem.id === currentEasyItem) {
        // Correct! Show feedback and pick new item
        setFeedback('correct');
        setScore(prev => prev + 1);
        const otherItems = syllableSet.items.filter(i => i.id !== currentEasyItem);
        const newItem = otherItems[Math.floor(Math.random() * otherItems.length)];

        setGameState('playing');
        setTimeout(async () => {
          setFeedback(null);
          await playItemCenter(newItem);
          setCurrentEasyItem(newItem.id);
          setGameState('listening');
        }, 800);
      } else {
        // Wrong - show feedback and replay same item (center only, no hint!)
        setFeedback('incorrect');
        setGameState('playing');
        setTimeout(async () => {
          setFeedback(null);
          const itemToReplay = syllableSet.items.find(i => i.id === currentEasyItem);
          if (itemToReplay) {
            await playItemCenter(itemToReplay);
          }
          setGameState('listening');
        }, 800);
      }
    } else {
      // Hard mode: check sequence
      const expectedId = targetSequence[userSequence.length];

      if (clickedItem.id === expectedId) {
        // Correct!
        const newUserSequence = [...userSequence, clickedItem.id];
        setUserSequence(newUserSequence);

        if (newUserSequence.length === targetSequence.length) {
          // Sequence complete!
          setScore(prev => prev + targetSequence.length);
          setGameState('success');

          // Auto-advance to next round
          setTimeout(() => {
            if (gameMode === 'hard') {
              // Hard mode: new syllable set each round, show buttons (need to learn new sounds)
              const newSet = generateSyllableSet(difficulty);
              setSyllableSet(newSet);

              // Generate entirely new sequence of increased length from new syllable set
              const newLength = targetSequence.length + 1;
              const newSequence: string[] = [];
              for (let i = 0; i < newLength; i++) {
                newSequence.push(pickNextItem(newSet.items, newSequence));
              }

              setTargetSequence(newSequence);
              setUserSequence([]);
              setGameState('playing');

              setTimeout(async () => {
                await playSequence(newSequence, newSet);
                setGameState('listening');
              }, 500);
            } else {
              // Medium mode: same syllable set, center only (no hints)
              const newItem = pickNextItem(syllableSet.items, targetSequence);
              const newSequence = [...targetSequence, newItem];
              setTargetSequence(newSequence);
              setUserSequence([]);
              setGameState('playing');

              setTimeout(async () => {
                await playSequenceCenter(newSequence, syllableSet);
                setGameState('listening');
              }, 500);
            }
          }, 1000);
        }
      } else {
        // Wrong - game over
        setGameState('failed');

        // Save high score
        if (score > highScore) {
          setHighScore(score);
          saveToStorage(STORAGE_KEYS.highScore, score);
        }

        // Play fast recap
        setTimeout(() => {
          playSequenceFast(targetSequence, syllableSet);
        }, 500);
      }
    }
  }, [gameState, syllableSet, gameMode, currentEasyItem, targetSequence, userSequence, score, highScore, playItem, playSequence, playSequenceFast]);

  // Auto-replay in easy mode
  useEffect(() => {
    if (autoReplayIntervalRef.current) {
      clearInterval(autoReplayIntervalRef.current);
      autoReplayIntervalRef.current = null;
    }

    if (gameMode === 'easy' && gameState === 'listening' && currentEasyItem && syllableSet) {
      autoReplayIntervalRef.current = setInterval(async () => {
        const item = syllableSet.items.find(i => i.id === currentEasyItem);
        if (item) {
          await playItemCenter(item);
        }
      }, 4000);
    }

    return () => {
      if (autoReplayIntervalRef.current) {
        clearInterval(autoReplayIntervalRef.current);
      }
    };
  }, [gameMode, gameState, currentEasyItem, syllableSet, playItemCenter]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'listening') return;

      const num = parseInt(e.key);
      if (num >= 1 && num <= 4) {
        handleButtonClick(num - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleButtonClick]);

  // Return to menu
  const handleMenu = useCallback(() => {
    setGameState('menu');
    setTargetSequence([]);
    setUserSequence([]);
    setSyllableSet(null);
    setCurrentEasyItem(null);
  }, []);

  // Get status message
  const getStatusMessage = () => {
    switch (gameState) {
      case 'menu': return 'Choose your settings and start!';
      case 'playing': return 'Listen carefully...';
      case 'listening':
        if (gameMode === 'easy') return 'Click the matching button!';
        return `Your turn: ${userSequence.length + 1} of ${targetSequence.length}`;
      case 'success':
        if (gameMode === 'hard') return 'Correct! New sounds coming...';
        return 'Correct! Next round...';
      case 'failed': return 'Game Over!';
    }
  };

  return (
    <div className="simon-container">
      {/* Menu Screen */}
      {gameState === 'menu' && (
        <div className="simon-menu">
          <h2 className="simon-title">Pinyin Simon</h2>

          {/* Difficulty Selection */}
          <div className="simon-setting-group">
            <h3>Difficulty</h3>
            <div className="simon-buttons-row">
              {(['tones', 'similar'] as DifficultyMode[]).map(d => (
                <button
                  key={d}
                  className={`simon-option-btn ${difficulty === d ? 'active' : ''}`}
                  onClick={() => setDifficulty(d)}
                >
                  {d === 'tones' ? 'Tones' : 'Similar'}
                </button>
              ))}
            </div>
            <p className="simon-hint">
              {difficulty === 'tones' && 'Same syllable, 4 different tones'}
              {difficulty === 'similar' && 'Similar sounding initials'}
            </p>
          </div>

          {/* Game Mode Selection */}
          <div className="simon-setting-group">
            <h3>Game Mode</h3>
            <div className="simon-buttons-row">
              <button
                className={`simon-option-btn ${gameMode === 'easy' ? 'active' : ''}`}
                onClick={() => setGameMode('easy')}
              >
                Easy
              </button>
              <button
                className={`simon-option-btn ${gameMode === 'medium' ? 'active' : ''}`}
                onClick={() => setGameMode('medium')}
              >
                Medium
              </button>
              <button
                className={`simon-option-btn ${gameMode === 'hard' ? 'active' : ''}`}
                onClick={() => setGameMode('hard')}
              >
                Hard
              </button>
            </div>
            <p className="simon-hint">
              {gameMode === 'easy' && 'Single item, retry on wrong'}
              {gameMode === 'medium' && 'Sequence mode, same sounds'}
              {gameMode === 'hard' && 'Sequence mode, sounds change each round'}
            </p>
          </div>

          {/* Speed Slider */}
          <div className="simon-setting-group">
            <h3>Speed: {speed.toFixed(1)}x</h3>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="simon-slider"
            />
          </div>

          {/* High Score */}
          {highScore > 0 && (
            <div className="simon-high-score">
              Best Score: <span>{highScore}</span>
            </div>
          )}

          {/* Start Button */}
          <button className="simon-start-btn" onClick={handleStart}>
            Start Game
          </button>
        </div>
      )}

      {/* Game Screen */}
      {gameState !== 'menu' && syllableSet && (
        <div className="simon-game">
          {/* Header */}
          <div className="simon-header">
            <div className="simon-score">
              Score: <span>{score}</span>
              {(gameMode === 'medium' || gameMode === 'hard') && targetSequence.length > 0 && (
                <span className="simon-length"> | Length: {targetSequence.length}</span>
              )}
            </div>
            <button className="simon-menu-btn" onClick={handleMenu}>Menu</button>
          </div>

          {/* Simon Grid */}
          <div className="simon-grid">
            {syllableSet.items.map((item, index) => (
              <button
                key={item.id}
                className={`simon-button ${BUTTON_COLORS[index].bg} ${activeButton === index ? BUTTON_COLORS[index].active : ''}`}
                onClick={() => handleButtonClick(index)}
                disabled={gameState !== 'listening'}
              >
                <span className="simon-button-text">{item.display}</span>
                {item.hanzi && <span className="simon-button-hanzi">{item.hanzi}</span>}
                <span className="simon-button-hotkey">{index + 1}</span>
              </button>
            ))}

            {/* Center Circle */}
            <div className={`simon-center ${feedback === 'correct' ? 'simon-center-correct' : ''} ${feedback === 'incorrect' ? 'simon-center-incorrect' : ''} ${centerPlaying ? 'simon-center-playing' : ''}`}>
              {feedback === 'correct' && <span className="simon-feedback-icon correct">✓</span>}
              {feedback === 'incorrect' && <span className="simon-feedback-icon incorrect">✗</span>}
              {!feedback && (gameState === 'playing' || centerPlaying) && <span className="simon-icon">🔊</span>}
              {!feedback && gameState === 'listening' && !centerPlaying && <span className="simon-icon">👆</span>}
              {!feedback && gameState === 'success' && <span className="simon-icon">✓</span>}
              {!feedback && gameState === 'failed' && (
                <button className="simon-retry-btn" onClick={handleStart}>
                  Retry
                </button>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="simon-status">
            {getStatusMessage()}
            {gameState === 'listening' && (gameMode === 'medium' || gameMode === 'hard') && (
              <div className="simon-progress">
                {userSequence.map((_, i) => (
                  <span key={i} className="simon-check">✓</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

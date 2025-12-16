/**
 * PinyinCommandGame - Missile Command style typing game for Pinyin
 * Type syllables and select tones to destroy falling pinyin before they hit the base
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { audioService } from '../../../lib/audio/AudioService';
import { addToneMarks } from '../../../lib/utils/pinyinUtils';
import {
  type FallingSyllable,
  type Explosion,
  type DifficultyConfig,
  type LevelConfig,
  DIFFICULTY_PRESETS,
  TIMING,
  calculateLevelConfig,
  spawnSyllable,
  createExplosion,
  updateExplosion,
  findMatchingSyllable,
  isExactMatch,
  getAudioInterval,
  calculateSyllableX,
} from './commandEngine';

// Types
type GameState = 'menu' | 'playing' | 'paused' | 'gameOver';

// Storage keys
const STORAGE_KEYS = {
  highScore: 'pinyin-command-highscore',
  lastDifficulty: 'pinyin-command-difficulty',
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

export default function PinyinCommandGame() {
  // Game state
  const [gameState, setGameState] = useState<GameState>('menu');
  const [difficulty, setDifficulty] = useState<DifficultyConfig>(DIFFICULTY_PRESETS[0]);
  const [level, setLevel] = useState(1);
  const [levelConfig, setLevelConfig] = useState<LevelConfig>(() =>
    calculateLevelConfig(1, DIFFICULTY_PRESETS[0])
  );

  // Entities
  const [syllables, setSyllables] = useState<FallingSyllable[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);

  // Player stats
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [combo, setCombo] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [destroyedCount, setDestroyedCount] = useState(0);

  // Input state
  const [typedInput, setTypedInput] = useState('');
  const [targetedSyllable, setTargetedSyllable] = useState<FallingSyllable | null>(null);

  // Level transition
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Dome damage animation
  const [domeHit, setDomeHit] = useState(false);

  // Laser pulse effect
  const [laserTarget, setLaserTarget] = useState<{ x: number; y: number; tone: number; hueShift: number; saturation: number } | null>(null);

  // Space bomb
  const [bombActive, setBombActive] = useState(false);
  const spawnCooldownRef = useRef<number>(0);

  // Title animation - swap PINYIN with 拼音
  const [showHanziTitle, setShowHanziTitle] = useState(false);

  // Refs for game loop
  const gameLoopRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);
  const lastSpawnTimeRef = useRef<number>(0);
  const syllablesRef = useRef<FallingSyllable[]>([]);
  const explosionsRef = useRef<Explosion[]>([]);

  // Keep refs in sync with state
  useEffect(() => { syllablesRef.current = syllables; }, [syllables]);
  useEffect(() => { explosionsRef.current = explosions; }, [explosions]);

  // Load settings on mount
  useEffect(() => {
    setHighScore(loadFromStorage(STORAGE_KEYS.highScore, 0));
    const savedDiffId = loadFromStorage(STORAGE_KEYS.lastDifficulty, 'ma-only');
    const savedDiff = DIFFICULTY_PRESETS.find(d => d.id === savedDiffId);
    if (savedDiff) {
      setDifficulty(savedDiff);
    }
  }, []);

  // Title animation - swap PINYIN/拼音 periodically on menu
  useEffect(() => {
    if (gameState !== 'menu') return;

    const interval = setInterval(() => {
      setShowHanziTitle(prev => !prev);
    }, 2500);

    return () => clearInterval(interval);
  }, [gameState]);

  // Preload audio for current difficulty
  useEffect(() => {
    if (gameState === 'playing') {
      const syllablesToPreload = difficulty.syllablePool
        .slice(0, 20)
        .flatMap(s =>
          difficulty.tones
            .filter(t => s.tones.includes(t))
            .map(t => `${s.pinyin}${t}`)
        );
      audioService.preload(syllablesToPreload.slice(0, 50));
    }
  }, [gameState, difficulty]);

  // Track which syllables are currently playing audio
  const playingUntilRef = useRef<Map<string, number>>(new Map());

  // Audio scheduling - allow overlapping audio for multiple falling syllables
  const playAudioForSyllable = useCallback((syllableId: string, pinyinWithTone: string, xPosition: number) => {
    // Mark as playing until 600ms from now
    playingUntilRef.current.set(syllableId, Date.now() + 600);

    // Calculate pan from x position: 0% = -1 (left), 50% = 0 (center), 100% = +1 (right)
    const pan = (xPosition / 50) - 1;

    // Play audio (non-blocking, with overlap, with stereo pan)
    audioService.play(pinyinWithTone, false, true, pan).catch(error => {
      console.error('Error playing audio:', error);
    });
  }, []);

  // Game loop
  const gameLoop = useCallback((timestamp: number) => {
    if (gameState !== 'playing') return;

    const deltaTime = lastTimestampRef.current ? timestamp - lastTimestampRef.current : 16;
    lastTimestampRef.current = timestamp;

    const now = Date.now();

    // Clean up expired playing states
    for (const [id, until] of playingUntilRef.current.entries()) {
      if (now >= until) {
        playingUntilRef.current.delete(id);
      }
    }

    // Update syllables
    let newSyllables = syllablesRef.current.map(s => {
      // Check if this syllable is currently playing audio
      const isPlaying = playingUntilRef.current.has(s.id) && now < playingUntilRef.current.get(s.id)!;

      // Check for audio scheduling
      let nextAudioTime = s.nextAudioTime;
      if (now >= s.nextAudioTime && s.y < TIMING.BASE_Y) {
        // Play audio (non-blocking) with stereo pan based on current x position
        const currentX = calculateSyllableX(s);
        playAudioForSyllable(s.id, s.pinyinWithTone, currentX);
        // Schedule next play
        nextAudioTime = now + getAudioInterval(s.y);
      }

      return {
        ...s,
        y: s.y + s.fallSpeed * deltaTime,
        isPlaying,
        nextAudioTime,
      };
    });

    // Check for syllables that hit the base
    const survived: FallingSyllable[] = [];
    let healthLoss = 0;

    for (const s of newSyllables) {
      if (s.y >= TIMING.BASE_Y) {
        healthLoss += difficulty.healthLossPerMiss;
      } else {
        survived.push(s);
      }
    }

    if (healthLoss > 0) {
      // Trigger dome damage animation
      setDomeHit(true);
      setTimeout(() => setDomeHit(false), 400);

      setHealth(prev => {
        const newHealth = Math.max(0, prev - healthLoss);
        if (newHealth <= 0) {
          setGameState('gameOver');
        }
        return newHealth;
      });
      setCombo(0);
    }

    setSyllables(survived);

    // Spawn new syllables (respect bomb cooldown)
    const timeSinceLastSpawn = now - lastSpawnTimeRef.current;
    const isInCooldown = now < spawnCooldownRef.current;
    if (timeSinceLastSpawn >= levelConfig.spawnInterval && !isInCooldown) {
      const newSyllable = spawnSyllable(difficulty, levelConfig, survived);
      if (newSyllable) {
        setSyllables(prev => [...prev, newSyllable]);
      }
      lastSpawnTimeRef.current = now;
    }

    // Update explosions
    const updatedExplosions = explosionsRef.current
      .map(e => updateExplosion(e))
      .filter((e): e is Explosion => e !== null);
    setExplosions(updatedExplosions);

    // Continue loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, levelConfig, difficulty, playAudioForSyllable]);

  // Start/stop game loop
  useEffect(() => {
    if (gameState === 'playing') {
      lastTimestampRef.current = 0;
      lastSpawnTimeRef.current = Date.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);

  // Level up check
  useEffect(() => {
    if (destroyedCount >= difficulty.syllablesPerLevel && gameState === 'playing') {
      const newLevel = level + 1;
      setLevel(newLevel);
      setDestroyedCount(0);
      setLevelConfig(calculateLevelConfig(newLevel, difficulty));
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 1500);
    }
  }, [destroyedCount, difficulty.syllablesPerLevel, level, difficulty, gameState]);

  // Play space bomb sound - deep explosion
  const playBombSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

      // Deep boom - low frequency sweep
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.5);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.5);

      // Add noise burst for explosion texture
      const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.3, audioCtx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1);
      }

      const noiseSource = audioCtx.createBufferSource();
      const noiseGain = audioCtx.createGain();
      const noiseFilter = audioCtx.createBiquadFilter();

      noiseSource.buffer = noiseBuffer;
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(2000, audioCtx.currentTime);
      noiseFilter.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.3);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);

      noiseGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

      noiseSource.start(audioCtx.currentTime);
      noiseSource.stop(audioCtx.currentTime + 0.3);
    } catch {
      // Silently fail if Web Audio API not available
    }
  }, []);

  // Trigger space bomb - clear all syllables
  const triggerSpaceBomb = useCallback(() => {
    // Play bomb sound
    playBombSound();

    // Trigger bomb animation
    setBombActive(true);
    setTimeout(() => setBombActive(false), 500);

    // Create explosions for all syllables
    const currentSyllables = syllablesRef.current;
    const newExplosions = currentSyllables.map(s => {
      const pinyinDisplay = addToneMarks(s.pinyin, s.tone);
      return createExplosion(s, pinyinDisplay);
    });

    // Add points for each destroyed syllable
    const points = currentSyllables.length * 5;
    setScore(prev => prev + points);
    setDestroyedCount(prev => prev + currentSyllables.length);

    // Clear all syllables and add explosions
    setSyllables([]);
    setExplosions(prev => [...prev, ...newExplosions]);

    // Reset combo (bomb consumes it)
    setCombo(0);

    // Set spawn cooldown for 2 seconds
    spawnCooldownRef.current = Date.now() + 2000;

    // Clear input
    setTypedInput('');
    setTargetedSyllable(null);
  }, [playBombSound]);

  // Input handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      const key = e.key;

      // Tone selection (1-4)
      if (['1', '2', '3', '4'].includes(key)) {
        e.preventDefault();
        if (targetedSyllable?.isMatched) {
          // Valid match - attempt tone match
          const tone = parseInt(key);
          attemptToneMatch(tone);
        } else if (typedInput) {
          // Invalid input - no matching syllable, play blip and clear
          playInvalidSound();
          setTypedInput('');
          setTargetedSyllable(null);
          setSyllables(prev => prev.map(s => ({ ...s, isTargeted: false, isMatched: false })));
        }
        return;
      }

      // Letter input (a-z)
      if (/^[a-z]$/i.test(key)) {
        e.preventDefault();
        const newInput = typedInput + key.toLowerCase();
        setTypedInput(newInput);
        updateTargeting(newInput);
        return;
      }

      // Backspace to clear
      if (key === 'Backspace') {
        e.preventDefault();
        const newInput = typedInput.slice(0, -1);
        setTypedInput(newInput);
        updateTargeting(newInput);
        return;
      }

      // Escape to clear input or pause
      if (key === 'Escape') {
        e.preventDefault();
        if (typedInput) {
          setTypedInput('');
          updateTargeting('');
        } else {
          setGameState('paused');
        }
        return;
      }

      // Space bomb (requires 10+ combo)
      if (key === ' ') {
        e.preventDefault();
        if (combo >= 10) {
          triggerSpaceBomb();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, typedInput, targetedSyllable, combo, triggerSpaceBomb]);

  const updateTargeting = useCallback((input: string) => {
    // Reset all targeting
    setSyllables(prev => prev.map(s => ({ ...s, isTargeted: false, isMatched: false })));

    if (!input) {
      setTargetedSyllable(null);
      return;
    }

    const match = findMatchingSyllable(input, syllablesRef.current);
    if (!match) {
      setTargetedSyllable(null);
      return;
    }

    const isExact = isExactMatch(input, match);

    setSyllables(prev => prev.map(s => {
      if (s.id === match.id) {
        return { ...s, isTargeted: true, isMatched: isExact };
      }
      return s;
    }));

    setTargetedSyllable({ ...match, isTargeted: true, isMatched: isExact });
  }, []);

  // Play wrong tone sound (low buzzer) using Web Audio API
  const playWrongToneSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // Low buzzer sound - descending
      oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.15);
      oscillator.type = 'sawtooth';

      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch {
      // Silently fail if Web Audio API not available
    }
  }, []);

  // Play invalid input sound (short blip) - for unmatched syllables
  const playInvalidSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // Quick high-pitched blip
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime + 0.03);
      oscillator.type = 'square';

      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.08);
    } catch {
      // Silently fail if Web Audio API not available
    }
  }, []);

  // Play laser pew sound - classic arcade laser
  const playLaserSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

      // Main laser tone - high frequency sweep down
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // Classic pew: start high, sweep down quickly
      oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.15);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.002, audioCtx.currentTime + 0.15);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.15);

      // Add a subtle noise burst for texture
      const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.05, audioCtx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * 0.3;
      }

      const noiseSource = audioCtx.createBufferSource();
      const noiseGain = audioCtx.createGain();
      const noiseFilter = audioCtx.createBiquadFilter();

      noiseSource.buffer = noiseBuffer;
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 3000;

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);

      noiseGain.gain.setValueAtTime(0.015, audioCtx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.002, audioCtx.currentTime + 0.05);

      noiseSource.start(audioCtx.currentTime);
      noiseSource.stop(audioCtx.currentTime + 0.05);
    } catch {
      // Silently fail if Web Audio API not available
    }
  }, []);

  const attemptToneMatch = useCallback((tone: number) => {
    if (!targetedSyllable) return;

    // Find ANY syllable matching the typed pinyin + selected tone (not just the targeted one)
    // This allows destroying syllables in any order, not just closest-to-base first
    const syllable = syllablesRef.current.find(s =>
      s.pinyin === targetedSyllable.pinyin && s.tone === tone
    );

    if (syllable) {
      // SUCCESS - trigger laser effect and sound
      playLaserSound();
      const targetX = calculateSyllableX(syllable);
      setLaserTarget({ x: targetX, y: syllable.y, tone: syllable.tone, hueShift: syllable.hueShift, saturation: syllable.saturation });
      setTimeout(() => setLaserTarget(null), 300);

      // Destroy syllable
      const pinyinDisplay = addToneMarks(syllable.pinyin, syllable.tone);
      const explosion = createExplosion(syllable, pinyinDisplay);
      setExplosions(prev => [...prev, explosion]);
      setSyllables(prev => prev.filter(s => s.id !== syllable.id));

      // Update stats - bonus points for hanzi
      const comboBonus = Math.min(combo, 10);
      const hanziBonus = syllable.displayAsHanzi ? 5 : 0;
      setScore(prev => prev + 10 + comboBonus + hanziBonus);
      setCombo(prev => prev + 1);
      setDestroyedCount(prev => prev + 1);
    } else {
      // WRONG TONE - no syllable with this pinyin+tone exists
      playWrongToneSound();
      setCombo(0);
    }

    // Reset input
    setTypedInput('');
    setTargetedSyllable(null);
    setSyllables(prev => prev.map(s => ({ ...s, isTargeted: false, isMatched: false })));
  }, [targetedSyllable, combo, playLaserSound, playWrongToneSound]);

  // Start game
  const handleStart = useCallback(() => {
    setGameState('playing');
    setSyllables([]);
    setExplosions([]);
    setScore(0);
    setHealth(100);
    setLevel(1);
    setCombo(0);
    setDestroyedCount(0);
    setTypedInput('');
    setTargetedSyllable(null);
    setLevelConfig(calculateLevelConfig(1, difficulty));
    lastSpawnTimeRef.current = Date.now();

    saveToStorage(STORAGE_KEYS.lastDifficulty, difficulty.id);
  }, [difficulty]);

  // Resume from pause
  const handleResume = useCallback(() => {
    setGameState('playing');
    lastSpawnTimeRef.current = Date.now();
  }, []);

  // Return to menu
  const handleMenu = useCallback(() => {
    setGameState('menu');
    setSyllables([]);
    setExplosions([]);

    // Save high score
    if (score > highScore) {
      setHighScore(score);
      saveToStorage(STORAGE_KEYS.highScore, score);
    }
  }, [score, highScore]);

  // Retry after game over
  const handleRetry = useCallback(() => {
    if (score > highScore) {
      setHighScore(score);
      saveToStorage(STORAGE_KEYS.highScore, score);
    }
    handleStart();
  }, [score, highScore, handleStart]);

  return (
    <div className="command-container">
      {/* Menu Screen */}
      {gameState === 'menu' && (
        <div className="command-menu">
          <h2 className="command-title">
            <span className="title-swap">
              <span className={`title-text ${showHanziTitle ? 'hidden' : ''}`}>PINYIN</span>
              <span className={`title-text hanzi ${showHanziTitle ? '' : 'hidden'}`}>拼音</span>
            </span>
            {' COMMAND'}
          </h2>
          <p className="command-subtitle">Defend your base!</p>

          {/* Difficulty Selection */}
          <div className="command-setting-group">
            <div className="command-difficulty-grid">
              {DIFFICULTY_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  className={`command-difficulty-btn ${difficulty.id === preset.id ? 'active' : ''}`}
                  onClick={() => setDifficulty(preset)}
                >
                  <span className="difficulty-name">{preset.name}</span>
                  <span className="difficulty-desc">{preset.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* High Score */}
          {highScore > 0 && (
            <div className="command-high-score">
              HIGH SCORE: <span>{highScore}</span>
            </div>
          )}

          {/* Instructions */}
          <div className="command-instructions">
            <p>Type the syllable, then press <kbd>1</kbd>-<kbd>4</kbd> for the tone</p>
          </div>

          {/* Start Button */}
          <button className="command-start-btn" onClick={handleStart}>
            START GAME
          </button>
        </div>
      )}

      {/* Game Screen */}
      {(gameState === 'playing' || gameState === 'paused') && (
        <div className="command-game">
          {/* HUD */}
          <div className="command-hud">
            <div className="command-hud-left">
              <div className="command-score">SCORE: {score}</div>
              <div className="command-level">LEVEL {level}</div>
            </div>
            <div className="command-hud-center">
              {combo > 1 && (
                <div className={`command-combo ${combo >= 10 ? 'bomb-ready' : ''}`}>
                  x{combo} COMBO
                  {combo >= 10 && <span className="bomb-indicator"> [SPACE] BOMB</span>}
                </div>
              )}
            </div>
            <div className="command-hud-right">
              <div className="command-health-container">
                <div className="command-health-label">SHIELDS</div>
                <div className="command-health-bar">
                  <div
                    className={`command-health-fill ${health <= 25 ? 'critical' : ''}`}
                    style={{ width: `${health}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Game Area */}
          <div className={`command-arena ${bombActive ? 'bomb-active' : ''}`}>
            {/* Falling Syllables */}
            {syllables.map(s => (
              <div
                key={s.id}
                className={`command-syllable ${s.isTargeted ? 'targeted' : ''} ${s.isMatched ? 'matched' : ''} ${s.isPlaying ? 'playing' : ''} ${s.displayAsHanzi ? 'hanzi-mode' : ''}`}
                style={{
                  left: `${calculateSyllableX(s)}%`,
                  top: `${s.y}%`,
                  '--tone-color': `var(--tone-${s.tone}-color)`,
                  filter: `hue-rotate(${s.hueShift}deg) saturate(${s.saturation})`,
                } as React.CSSProperties}
              >
                <span className="syllable-text">
                  {s.displayAsHanzi ? s.hanzi : addToneMarks(s.pinyin, s.tone)}
                </span>
                {level === 1 && <span className="syllable-tone">{s.tone}</span>}
              </div>
            ))}

            {/* Explosions */}
            {explosions.map(e => (
              <div
                key={e.id}
                className={`command-explosion ${e.phase} ${e.wasHanzi ? 'reveal-pinyin' : ''}`}
                style={{
                  left: `${e.x}%`,
                  top: `${e.y}%`,
                  '--progress': e.progress,
                  '--tone-color': `var(--tone-${e.tone}-color)`,
                  filter: `hue-rotate(${e.hueShift}deg) saturate(${e.saturation})`,
                } as React.CSSProperties}
              >
                <div className="explosion-ring" />
                {e.phase === 'showing' && (
                  <span className={`explosion-reveal ${e.wasHanzi ? 'is-pinyin' : 'is-hanzi'}`}>
                    {e.wasHanzi ? e.pinyin : e.hanzi}
                  </span>
                )}
              </div>
            ))}

            {/* Laser Pulse Effect */}
            {laserTarget && (
              <div
                className="command-laser"
                style={{
                  '--target-x': `${laserTarget.x}%`,
                  '--target-y': `${laserTarget.y}%`,
                  '--tone-color': `var(--tone-${laserTarget.tone}-color)`,
                  filter: `hue-rotate(${laserTarget.hueShift}deg) saturate(${laserTarget.saturation})`,
                } as React.CSSProperties}
              />
            )}

            {/* Level Up Animation */}
            {showLevelUp && (
              <div className="command-level-up">
                LEVEL {level}
              </div>
            )}

            {/* Base with Dome and City */}
            <div className={`command-base ${domeHit ? 'hit' : ''} ${health <= 0 ? 'destroyed' : ''}`}>
              {/* Dome shield */}
              <div className="command-dome">
                <div className="dome-shield" style={{ opacity: health / 100 * 0.8 + 0.2 }} />
              </div>
              {/* City skyline */}
              <div className="command-city">
                {health > 0 ? (
                  <>
                    <div className="building b1" />
                    <div className="building b2" />
                    <div className="building b3" />
                    <div className="building b4" />
                    <div className="building b5" />
                  </>
                ) : (
                  <>
                    <div className="building destroyed b1" />
                    <div className="building destroyed b2" />
                    <div className="building destroyed b3" />
                    <div className="smoke s1" />
                    <div className="smoke s2" />
                    <div className="smoke s3" />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Input Display */}
          <div className="command-input-area">
            <div className="command-input-display">
              <span className="input-text">{typedInput || '\u00A0'}</span>
              <span className="input-cursor">|</span>
            </div>
            <div className={`command-tone-prompt ${targetedSyllable?.isMatched ? 'visible' : ''}`}>
              Press <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd> for tone
            </div>
          </div>

          {/* Pause Overlay */}
          {gameState === 'paused' && (
            <div className="command-overlay">
              <div className="command-pause-menu">
                <h2>PAUSED</h2>
                <button className="command-btn" onClick={handleResume}>RESUME</button>
                <button className="command-btn secondary" onClick={handleMenu}>QUIT</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'gameOver' && (
        <div className="command-gameover">
          <h2 className="command-gameover-title">GAME OVER</h2>
          <div className="command-final-score">
            <div className="score-label">FINAL SCORE</div>
            <div className="score-value">{score}</div>
            {score > highScore && <div className="new-record">NEW RECORD!</div>}
          </div>
          <div className="command-stats">
            <div>Level reached: {level}</div>
            <div>Difficulty: {difficulty.name}</div>
          </div>
          <div className="command-gameover-buttons">
            <button className="command-btn" onClick={handleRetry}>RETRY</button>
            <button className="command-btn secondary" onClick={handleMenu}>MENU</button>
          </div>

          {/* Destroyed city with smoke */}
          <div className="command-base destroyed gameover-city">
            <div className="command-dome">
              <div className="dome-shield" />
            </div>
            <div className="command-city">
              <div className="building destroyed b1" />
              <div className="building destroyed b2" />
              <div className="building destroyed b3" />
              <div className="smoke s1" />
              <div className="smoke s2" />
              <div className="smoke s3" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

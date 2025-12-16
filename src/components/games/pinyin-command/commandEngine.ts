/**
 * Command Engine - Game logic for Pinyin Command
 * Handles syllable filtering, spawning, difficulty progression
 */

import { PINYIN_SYLLABLES, type PinyinSyllable } from '../../../data/pinyinSyllables';
import { PINYIN_TO_HANZI } from '../../../lib/audio/audioConfig';

// Types
export interface FallingSyllable {
  id: string;
  pinyin: string;           // base syllable without tone (e.g., "ma")
  tone: number;             // 1-4
  pinyinWithTone: string;   // e.g., "ma1"
  hanzi: string;            // Chinese character for explosion reveal
  displayAsHanzi: boolean;  // true = show hanzi, false = show pinyin
  x: number;                // horizontal position (0-100%)
  y: number;                // vertical position (0 = top, 100 = base)
  startX: number;           // starting x position for trajectory
  fallSpeed: number;        // % per millisecond
  isTargeted: boolean;      // highlighted when partially matching input
  isMatched: boolean;       // waiting for tone input
  isPlaying: boolean;       // currently playing audio (for glow effect)
  nextAudioTime: number;    // timestamp for next audio play
  createdAt: number;        // for unique ID generation
}

// Target point for convergence (center bottom)
export const TARGET_X = 50; // center of screen
export const TARGET_Y = 92; // just above base

export interface Explosion {
  id: string;
  x: number;
  y: number;
  hanzi: string;
  pinyin: string;           // pinyin with tone marks for display
  tone: number;
  wasHanzi: boolean;        // true = show pinyin in explosion, false = show hanzi
  phase: 'expanding' | 'showing' | 'fading';
  startTime: number;
  progress: number;         // 0-1
}

export interface DifficultyConfig {
  id: string;
  name: string;
  description: string;
  syllablePool: PinyinSyllable[];
  tones: number[];
  maxSimultaneous: number;
  healthLossPerMiss: number;
  syllablesPerLevel: number;
  audioOverlap: boolean;
}

export interface LevelConfig {
  level: number;
  spawnInterval: number;    // ms between spawns
  fallSpeed: number;        // % per ms
  maxSyllables: number;
}

// Timing constants
export const TIMING = {
  BASE_SPAWN_INTERVAL: 3500,  // slower initial spawn
  MIN_SPAWN_INTERVAL: 1000,   // don't get too fast
  BASE_FALL_SPEED: 0.010,     // % per ms (slower initial fall)
  FALL_SPEED_INCREASE: 1.05,  // 5% speed increase per level (shallower ramp)
  MAX_FALL_SPEED: 0.03,       // cap max speed lower
  BASE_Y: 92,                 // % - where base starts
  EXPLOSION_EXPAND: 150,      // ms
  EXPLOSION_SHOW: 350,        // ms
  EXPLOSION_FADE: 150,        // ms
  AUDIO_MAX_INTERVAL: 2500,   // ms at top
  AUDIO_MIN_INTERVAL: 400,    // ms near base
};

// Difficulty presets
export const DIFFICULTY_PRESETS: DifficultyConfig[] = [
  {
    id: 'ma-only',
    name: '"mā" Practice',
    description: 'Just "ma" with all 4 tones - perfect for beginners',
    syllablePool: PINYIN_SYLLABLES.filter(s => s.pinyin === 'ma'),
    tones: [1, 2, 3, 4],
    maxSimultaneous: 3,
    healthLossPerMiss: 8,
    syllablesPerLevel: 6,
    audioOverlap: false,
  },
  {
    id: 'simple-vowels',
    name: 'Simple Vowels',
    description: 'a, o, e, i, u vowel sounds',
    syllablePool: PINYIN_SYLLABLES.filter(s =>
      ['a', 'o', 'e', 'ai', 'ei', 'ao', 'ou'].includes(s.pinyin)
    ),
    tones: [1, 2, 3, 4],
    maxSimultaneous: 4,
    healthLossPerMiss: 10,
    syllablesPerLevel: 8,
    audioOverlap: false,
  },
  {
    id: 'labials',
    name: 'Labials (b, p, m, f)',
    description: 'Practice lip consonant initials',
    syllablePool: PINYIN_SYLLABLES.filter(s =>
      ['b', 'p', 'm', 'f'].includes(s.initial)
    ),
    tones: [1, 2, 3, 4],
    maxSimultaneous: 4,
    healthLossPerMiss: 10,
    syllablesPerLevel: 10,
    audioOverlap: true,
  },
  {
    id: 'retroflexes',
    name: 'Retroflexes (zh, ch, sh, r)',
    description: 'Practice curled tongue sounds',
    syllablePool: PINYIN_SYLLABLES.filter(s =>
      ['zh', 'ch', 'sh', 'r'].includes(s.initial)
    ),
    tones: [1, 2, 3, 4],
    maxSimultaneous: 5,
    healthLossPerMiss: 12,
    syllablesPerLevel: 10,
    audioOverlap: true,
  },
  {
    id: 'sibilants',
    name: 'Sibilants (z, c, s)',
    description: 'Practice hissing sounds',
    syllablePool: PINYIN_SYLLABLES.filter(s =>
      ['z', 'c', 's'].includes(s.initial)
    ),
    tones: [1, 2, 3, 4],
    maxSimultaneous: 4,
    healthLossPerMiss: 12,
    syllablesPerLevel: 10,
    audioOverlap: true,
  },
  {
    id: 'palatals',
    name: 'Palatals (j, q, x)',
    description: 'Practice tongue-roof sounds',
    syllablePool: PINYIN_SYLLABLES.filter(s =>
      ['j', 'q', 'x'].includes(s.initial)
    ),
    tones: [1, 2, 3, 4],
    maxSimultaneous: 5,
    healthLossPerMiss: 12,
    syllablesPerLevel: 10,
    audioOverlap: true,
  },
  {
    id: 'all-syllables',
    name: 'All Syllables',
    description: 'The ultimate challenge - all ~400 syllables',
    syllablePool: PINYIN_SYLLABLES,
    tones: [1, 2, 3, 4],
    maxSimultaneous: 6,
    healthLossPerMiss: 15,
    syllablesPerLevel: 12,
    audioOverlap: true,
  },
];

/**
 * Get hanzi character for a syllable+tone combination
 */
export function getHanzi(pinyin: string, tone: number): string {
  const hanziArray = PINYIN_TO_HANZI[pinyin];
  if (hanziArray && hanziArray[tone - 1]) {
    return hanziArray[tone - 1];
  }
  // Fallback: return a placeholder
  return '?';
}

/**
 * Calculate audio interval based on y position
 * Decreases as syllable approaches the base
 */
export function getAudioInterval(yPosition: number): number {
  const progress = yPosition / TIMING.BASE_Y;
  // Exponential curve for more dramatic urgency near bottom
  const factor = Math.pow(1 - progress, 1.5);
  return TIMING.AUDIO_MIN_INTERVAL +
    (TIMING.AUDIO_MAX_INTERVAL - TIMING.AUDIO_MIN_INTERVAL) * factor;
}

/**
 * Calculate level configuration based on level number
 */
export function calculateLevelConfig(level: number, difficulty: DifficultyConfig): LevelConfig {
  // Shallower ramp: 6% spawn frequency increase per level
  const levelFactor = Math.pow(1.06, level - 1);

  return {
    level,
    spawnInterval: Math.max(
      TIMING.MIN_SPAWN_INTERVAL,
      TIMING.BASE_SPAWN_INTERVAL / levelFactor
    ),
    fallSpeed: Math.min(
      TIMING.MAX_FALL_SPEED,
      TIMING.BASE_FALL_SPEED * Math.pow(TIMING.FALL_SPEED_INCREASE, level - 1)
    ),
    // Slower ramp for max syllables: +1 every 4 levels
    maxSyllables: Math.min(
      difficulty.maxSimultaneous + Math.floor(level / 4),
      8
    ),
  };
}

/**
 * Generate a random syllable from the difficulty pool
 */
export function spawnSyllable(
  difficulty: DifficultyConfig,
  levelConfig: LevelConfig,
  existingSyllables: FallingSyllable[]
): FallingSyllable | null {
  // Don't spawn if at max
  if (existingSyllables.length >= levelConfig.maxSyllables) {
    return null;
  }

  // Filter to syllables that have valid tones
  const validSyllables = difficulty.syllablePool.filter(s =>
    difficulty.tones.some(t => s.tones.includes(t))
  );

  if (validSyllables.length === 0) return null;

  // Pick random syllable
  const syllable = validSyllables[Math.floor(Math.random() * validSyllables.length)];

  // Pick random valid tone
  const validTones = difficulty.tones.filter(t => syllable.tones.includes(t));
  const tone = validTones[Math.floor(Math.random() * validTones.length)];

  // Avoid spawning same syllable+tone if already on screen
  const pinyinWithTone = `${syllable.pinyin}${tone}`;
  if (existingSyllables.some(s => s.pinyinWithTone === pinyinWithTone)) {
    // Try once more with different selection
    const otherSyllables = validSyllables.filter(s => s.pinyin !== syllable.pinyin);
    if (otherSyllables.length > 0) {
      const altSyllable = otherSyllables[Math.floor(Math.random() * otherSyllables.length)];
      const altValidTones = difficulty.tones.filter(t => altSyllable.tones.includes(t));
      const altTone = altValidTones[Math.floor(Math.random() * altValidTones.length)];

      return createSyllable(altSyllable.pinyin, altTone, levelConfig);
    }
  }

  return createSyllable(syllable.pinyin, tone, levelConfig);
}

/**
 * Calculate probability of showing hanzi based on level
 * Linear ramp: starts at level 5, reaches 100% at level 25
 * Formula: p = 0.05 * (level - 5), clamped to [0, 1]
 */
export function getHanziProbability(level: number): number {
  // p = mx + b where m = 0.05, b = -0.25 (starts at level 5)
  return Math.max(0, Math.min(1, 0.05 * level - 0.25));
}

function createSyllable(pinyin: string, tone: number, levelConfig: LevelConfig): FallingSyllable {
  const now = Date.now();

  // Random x position, avoiding edges - this is where it spawns
  const startX = 10 + Math.random() * 80;

  // Determine if this syllable should display as hanzi based on level
  const hanziProb = getHanziProbability(levelConfig.level);
  const displayAsHanzi = Math.random() < hanziProb;

  return {
    id: `${pinyin}${tone}-${now}-${Math.random().toString(36).substr(2, 5)}`,
    pinyin,
    tone,
    pinyinWithTone: `${pinyin}${tone}`,
    hanzi: getHanzi(pinyin, tone),
    displayAsHanzi,
    x: startX,
    y: 0,
    startX,
    fallSpeed: levelConfig.fallSpeed,
    isTargeted: false,
    isMatched: false,
    isPlaying: false,
    nextAudioTime: now + 500, // Small delay before first audio
    createdAt: now,
  };
}

/**
 * Calculate current X position based on trajectory toward target
 * Syllables converge toward the center as they fall
 */
export function calculateSyllableX(syllable: FallingSyllable): number {
  // Progress from 0 (top) to 1 (target)
  const progress = syllable.y / TARGET_Y;
  // Ease-in curve for more natural convergence
  const easedProgress = progress * progress;
  // Interpolate from startX toward TARGET_X
  return syllable.startX + (TARGET_X - syllable.startX) * easedProgress;
}

/**
 * Create an explosion at the given position
 */
export function createExplosion(syllable: FallingSyllable, pinyinDisplay: string): Explosion {
  return {
    id: `explosion-${syllable.id}`,
    x: calculateSyllableX(syllable),
    y: syllable.y,
    hanzi: syllable.hanzi,
    pinyin: pinyinDisplay,
    tone: syllable.tone,
    wasHanzi: syllable.displayAsHanzi,
    phase: 'expanding',
    startTime: Date.now(),
    progress: 0,
  };
}

/**
 * Update explosion progress and phase
 */
export function updateExplosion(explosion: Explosion): Explosion | null {
  const elapsed = Date.now() - explosion.startTime;
  const totalDuration = TIMING.EXPLOSION_EXPAND + TIMING.EXPLOSION_SHOW + TIMING.EXPLOSION_FADE;

  if (elapsed >= totalDuration) {
    return null; // Explosion complete
  }

  let phase: Explosion['phase'];
  let progress: number;

  if (elapsed < TIMING.EXPLOSION_EXPAND) {
    phase = 'expanding';
    progress = elapsed / TIMING.EXPLOSION_EXPAND;
  } else if (elapsed < TIMING.EXPLOSION_EXPAND + TIMING.EXPLOSION_SHOW) {
    phase = 'showing';
    progress = (elapsed - TIMING.EXPLOSION_EXPAND) / TIMING.EXPLOSION_SHOW;
  } else {
    phase = 'fading';
    progress = (elapsed - TIMING.EXPLOSION_EXPAND - TIMING.EXPLOSION_SHOW) / TIMING.EXPLOSION_FADE;
  }

  return { ...explosion, phase, progress };
}

/**
 * Find the best matching syllable for the given input
 * Prioritizes: exact match > partial match closest to base
 */
export function findMatchingSyllable(
  input: string,
  syllables: FallingSyllable[]
): FallingSyllable | null {
  if (!input) return null;

  const inputLower = input.toLowerCase();

  // Find syllables that start with the input
  const matches = syllables.filter(s =>
    s.pinyin.startsWith(inputLower) && !s.isMatched
  );

  if (matches.length === 0) return null;

  // Prioritize exact matches, then closest to base
  const exactMatches = matches.filter(s => s.pinyin === inputLower);
  if (exactMatches.length > 0) {
    // Return the one closest to the base
    return exactMatches.reduce((a, b) => a.y > b.y ? a : b);
  }

  // Return closest partial match
  return matches.reduce((a, b) => a.y > b.y ? a : b);
}

/**
 * Check if input exactly matches a syllable
 */
export function isExactMatch(input: string, syllable: FallingSyllable): boolean {
  return input.toLowerCase() === syllable.pinyin;
}

/**
 * Sandwich Engine - Question generation and game logic for Pinyin Sandwich
 */

import { PINYIN_SYLLABLES, type PinyinSyllable } from '../../../data/pinyinSyllables';
import { getAudioUrl } from '../../../lib/audio/audioConfig';

// Types
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface SandwichQuestion {
  id: string;
  syllable: PinyinSyllable;
  tone: number;
  audioUrl: string;
  initialOptions: string[];
  finalOptions: string[];
  toneOptions: number[];
}

export interface DifficultyConfig {
  initialCount: number;
  finalCount: number;
  syllablePool: 'common' | 'intermediate' | 'all';
  useConfusingOptions: boolean;
  questionsPerRound: number;
}

// Difficulty configurations
export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    initialCount: 3,
    finalCount: 3,
    syllablePool: 'common',
    useConfusingOptions: false,
    questionsPerRound: 5,
  },
  medium: {
    initialCount: 4,
    finalCount: 4,
    syllablePool: 'intermediate',
    useConfusingOptions: true,
    questionsPerRound: 8,
  },
  hard: {
    initialCount: 5,
    finalCount: 5,
    syllablePool: 'all',
    useConfusingOptions: true,
    questionsPerRound: 10,
  },
};

// Common syllables for easy mode
const COMMON_SYLLABLES = [
  'ma', 'ba', 'pa', 'da', 'ta', 'na', 'la', 'wo', 'ni', 'ta',
  'de', 'le', 'he', 'ne', 'me', 'shi', 'zhi', 'chi',
  'bu', 'pu', 'mu', 'fu', 'du', 'tu', 'nu', 'lu',
  'ge', 'ke', 'se', 'ze', 'ce',
];

// Intermediate adds more variety
const INTERMEDIATE_SYLLABLES = [
  ...COMMON_SYLLABLES,
  'guo', 'huo', 'duo', 'tuo', 'nuo', 'luo',
  'jia', 'qia', 'xia', 'lia', 'nia',
  'jie', 'qie', 'xie', 'lie', 'nie',
  'zai', 'cai', 'sai', 'dai', 'tai', 'nai', 'lai',
  'men', 'fen', 'ben', 'pen', 'zen', 'cen', 'sen',
  'ming', 'bing', 'ping', 'ding', 'ting', 'ning', 'ling',
];

// Confusing initial groups (phonetically similar)
const CONFUSING_INITIAL_GROUPS: string[][] = [
  ['b', 'p', 'm', 'f'],
  ['d', 't', 'n', 'l'],
  ['g', 'k', 'h'],
  ['j', 'q', 'x'],
  ['zh', 'ch', 'sh', 'r'],
  ['z', 'c', 's'],
];

// Confusing final groups (phonetically similar)
const CONFUSING_FINAL_GROUPS: string[][] = [
  ['a', 'e', 'o'],
  ['ai', 'ei', 'ao', 'ou'],
  ['an', 'en', 'in', 'un'],
  ['ang', 'eng', 'ing', 'ong'],
  ['ia', 'ie', 'iu', 'iao'],
  ['ua', 'uo', 'ui', 'uai'],
  ['uan', 'uen', 'uang', 'ueng'],
  ['ian', 'in', 'iang', 'ing'],
];

// Helper functions
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getConfusingGroup<T>(item: T, groups: T[][]): T[] {
  for (const group of groups) {
    if (group.includes(item)) {
      return group;
    }
  }
  return [item];
}

// Get all unique initials from syllables
function getAllInitials(): string[] {
  const initials = new Set<string>();
  PINYIN_SYLLABLES.forEach(s => {
    if (s.initial) initials.add(s.initial);
  });
  return Array.from(initials);
}

// Get all unique finals from syllables
function getAllFinals(): string[] {
  const finals = new Set<string>();
  PINYIN_SYLLABLES.forEach(s => {
    if (s.final) finals.add(s.final);
  });
  return Array.from(finals);
}

// Check if a syllable with given initial exists
function isValidInitialFinalCombo(initial: string, final: string): boolean {
  return PINYIN_SYLLABLES.some(s => s.initial === initial && s.final === final);
}

// Generate initial options for a question
function generateInitialOptions(
  correctInitial: string,
  correctFinal: string,
  count: number,
  useConfusing: boolean
): string[] {
  const options = new Set<string>([correctInitial]);

  // Get confusing initials first
  if (useConfusing) {
    const confusingGroup = getConfusingGroup(correctInitial, CONFUSING_INITIAL_GROUPS);
    for (const initial of confusingGroup) {
      if (options.size >= count) break;
      // Only add if this initial + final is a valid syllable
      if (initial !== correctInitial && isValidInitialFinalCombo(initial, correctFinal)) {
        options.add(initial);
      }
    }
  }

  // Fill remaining with random valid initials
  const allInitials = shuffle(getAllInitials());
  for (const initial of allInitials) {
    if (options.size >= count) break;
    if (!options.has(initial) && isValidInitialFinalCombo(initial, correctFinal)) {
      options.add(initial);
    }
  }

  // If still not enough (rare), just add any initials
  if (options.size < count) {
    for (const initial of allInitials) {
      if (options.size >= count) break;
      if (!options.has(initial)) {
        options.add(initial);
      }
    }
  }

  return shuffle(Array.from(options));
}

// Generate final options for a question
function generateFinalOptions(
  correctInitial: string,
  correctFinal: string,
  count: number,
  useConfusing: boolean
): string[] {
  const options = new Set<string>([correctFinal]);

  // Get confusing finals first
  if (useConfusing) {
    const confusingGroup = getConfusingGroup(correctFinal, CONFUSING_FINAL_GROUPS);
    for (const final of confusingGroup) {
      if (options.size >= count) break;
      // Only add if this initial + final is a valid syllable
      if (final !== correctFinal && isValidInitialFinalCombo(correctInitial, final)) {
        options.add(final);
      }
    }
  }

  // Fill remaining with random valid finals
  const allFinals = shuffle(getAllFinals());
  for (const final of allFinals) {
    if (options.size >= count) break;
    if (!options.has(final) && isValidInitialFinalCombo(correctInitial, final)) {
      options.add(final);
    }
  }

  // If still not enough, just add any finals
  if (options.size < count) {
    for (const final of allFinals) {
      if (options.size >= count) break;
      if (!options.has(final)) {
        options.add(final);
      }
    }
  }

  return shuffle(Array.from(options));
}

// Get syllable pool based on difficulty
function getSyllablePool(pool: 'common' | 'intermediate' | 'all'): PinyinSyllable[] {
  switch (pool) {
    case 'common':
      return PINYIN_SYLLABLES.filter(s => COMMON_SYLLABLES.includes(s.pinyin));
    case 'intermediate':
      return PINYIN_SYLLABLES.filter(s => INTERMEDIATE_SYLLABLES.includes(s.pinyin));
    case 'all':
    default:
      return PINYIN_SYLLABLES;
  }
}

// Generate a single question
export function generateQuestion(
  difficulty: Difficulty,
  recentSyllables: string[] = []
): SandwichQuestion {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const pool = getSyllablePool(config.syllablePool);

  // Filter out recent syllables and ensure valid tones
  const validSyllables = pool.filter(
    s => !recentSyllables.includes(s.pinyin) &&
         s.tones.some(t => t >= 1 && t <= 4) &&
         s.initial && s.final
  );

  // Pick random syllable
  const syllable = validSyllables.length > 0
    ? randomItem(validSyllables)
    : randomItem(pool.filter(s => s.initial && s.final));

  // Pick random tone (1-4 only)
  const validTones = syllable.tones.filter(t => t >= 1 && t <= 4);
  const tone = randomItem(validTones);

  // Generate options
  const initialOptions = generateInitialOptions(
    syllable.initial!,
    syllable.final!,
    config.initialCount,
    config.useConfusingOptions
  );

  const finalOptions = generateFinalOptions(
    syllable.initial!,
    syllable.final!,
    config.finalCount,
    config.useConfusingOptions
  );

  return {
    id: `${syllable.pinyin}${tone}-${Date.now()}`,
    syllable,
    tone,
    audioUrl: getAudioUrl(`${syllable.pinyin}${tone}`),
    initialOptions,
    finalOptions,
    toneOptions: [1, 2, 3, 4],
  };
}

// Check if answer is correct
export function checkAnswer(
  question: SandwichQuestion,
  selectedInitial: string | null,
  selectedFinal: string | null,
  selectedTone: number | null
): { correct: boolean; initialCorrect: boolean; finalCorrect: boolean; toneCorrect: boolean } {
  const initialCorrect = selectedInitial === question.syllable.initial;
  const finalCorrect = selectedFinal === question.syllable.final;
  const toneCorrect = selectedTone === question.tone;

  return {
    correct: initialCorrect && finalCorrect && toneCorrect,
    initialCorrect,
    finalCorrect,
    toneCorrect,
  };
}

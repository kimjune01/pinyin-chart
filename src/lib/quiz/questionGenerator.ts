/**
 * Question Generator
 *
 * Generates quiz questions for all 6 quiz types.
 * Each generator creates questions with audio URLs and multiple choice options.
 */

import type { Question, QuizOption, LevelConfig } from './types';
import { PINYIN_SYLLABLES, type PinyinSyllable } from '../../data/pinyinSyllables';
import { INITIALS } from '../../data/pinyinInitials';
import { FINALS } from '../../data/pinyinFinals';
import { getAudioUrl } from '../audio/audioConfig';
import { addToneMarks } from '../utils/pinyinUtils';

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random item from array
 */
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get random items from array (unique)
 */
function randomItems<T>(array: T[], count: number): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Shuffle and slice options, ensuring the correct answer is always included
 */
function shuffleOptionsWithCorrect(options: QuizOption[], count: number): QuizOption[] {
  const correctOption = options.find(o => o.isCorrect);
  if (!correctOption) {
    return shuffle(options).slice(0, count);
  }

  // Get wrong options and shuffle them
  const wrongOptions = shuffle(options.filter(o => !o.isCorrect));

  // Take (count - 1) wrong options and add the correct one
  const selected = wrongOptions.slice(0, count - 1);
  selected.push(correctOption);

  // Shuffle the final selection so correct answer isn't always last
  return shuffle(selected);
}

/**
 * Pick a random item from array, avoiding recently used items
 * Returns null if no valid item can be found
 */
function randomItemAvoiding<T>(
  array: T[],
  recentItems: T[],
  getKey: (item: T) => string = (item) => String(item)
): T | null {
  const recentKeys = new Set(recentItems.map(getKey));
  const available = array.filter(item => !recentKeys.has(getKey(item)));

  if (available.length === 0) {
    // Fallback: if all items are recent, just pick any random one
    return array.length > 0 ? randomItem(array) : null;
  }

  return randomItem(available);
}

const RECENT_WINDOW_SIZE = 5;

// ============================================================================
// 1. TONE RECOGNITION
// ============================================================================

export async function generateToneQuestions(
  level: LevelConfig,
  count: number
): Promise<Question[]> {
  const questions: Question[] = [];
  const recentSyllables: PinyinSyllable[] = [];

  // All four tones
  const availableTones = [1, 2, 3, 4];

  // Get all valid syllables upfront
  const syllablesWithTones = PINYIN_SYLLABLES.filter(s =>
    s.tones.length >= 3 && s.tones.some(t => availableTones.includes(t))
  );

  for (let i = 0; i < count; i++) {
    // Pick a random syllable, avoiding recent ones
    const syllable = randomItemAvoiding(
      syllablesWithTones,
      recentSyllables.slice(-RECENT_WINDOW_SIZE),
      s => s.pinyin
    );

    if (!syllable) continue;

    // Track recent syllables
    recentSyllables.push(syllable);

    // Pick a random tone from available tones for this syllable
    const validTones = syllable.tones.filter(t => availableTones.includes(t));
    const correctTone = randomItem(validTones);

    // Create audio URL
    const audioUrl = getAudioUrl(`${syllable.pinyin}${correctTone}`);

    // Generate options (all 5 tones or subset for level 0)
    const toneOptions = availableTones.map(tone => ({
      id: `tone-${tone}`,
      label: getToneLabel(tone),
      value: tone.toString(),
      isCorrect: tone === correctTone,
    }));

    questions.push({
      id: `tone-${i}`,
      audioUrl,
      correctAnswer: correctTone.toString(),
      options: toneOptions, // Keep tones in order (1, 2, 3, 4)
      syllable: `${syllable.pinyin}${correctTone}`,
      explanation: `Correct answer: ${getToneLabel(correctTone)} (${addToneMarks(syllable.pinyin, correctTone)})`,
    });
  }

  return questions;
}

function getToneLabel(tone: number): string {
  const labels = ['', '1st Tone (mā)', '2nd Tone (má)', '3rd Tone (mǎ)', '4th Tone (mà)'];
  return labels[tone] || '';
}

// ============================================================================
// 2. INITIAL RECOGNITION
// ============================================================================

export async function generateInitialQuestions(
  level: LevelConfig,
  count: number
): Promise<Question[]> {
  const questions: Question[] = [];
  const recentSyllables: PinyinSyllable[] = [];

  // Define confusing initial groups by level
  const confusingGroups = [
    ['b', 'p', 'm', 'f'],           // Labials
    ['d', 't', 'n', 'l'],           // Dentals
    ['g', 'k', 'h'],                // Gutturals
    ['j', 'q', 'x'],                // Palatals
    ['zh', 'ch', 'sh', 'r'],        // Retroflexes
    ['z', 'c', 's'],                // Sibilants
    ['zh', 'z', 'j'],               // Very confusing
    ['ch', 'c', 'q'],               // Very confusing
    ['sh', 's', 'x'],               // Very confusing
  ];

  // Helper to check if initial + final is valid
  const isValidInitialFinal = (initial: string, final: string): boolean => {
    return PINYIN_SYLLABLES.some(s => s.initial === initial && s.final === final);
  };

  for (let i = 0; i < count; i++) {
    // Pick a confusing group (harder groups for higher levels)
    const groupIndex = level.id < confusingGroups.length
      ? level.id
      : Math.floor(Math.random() * confusingGroups.length);
    const group = confusingGroups[groupIndex];

    // Pick a random initial from this group
    const correctInitial = randomItem(group);

    // Find syllables with this initial
    const syllablesWithInitial = PINYIN_SYLLABLES.filter(s =>
      s.initial === correctInitial && s.tones.length > 0
    );

    if (syllablesWithInitial.length === 0) continue;

    // Pick a syllable avoiding recent ones
    const syllable = randomItemAvoiding(
      syllablesWithInitial,
      recentSyllables.slice(-RECENT_WINDOW_SIZE),
      s => s.pinyin
    );

    if (!syllable) continue;

    recentSyllables.push(syllable);
    const tone = randomItem(syllable.tones);

    const audioUrl = getAudioUrl(`${syllable.pinyin}${tone}`);

    // Create options from the confusing group - only include valid combinations
    const validGroupInitials = group.filter(initial =>
      isValidInitialFinal(initial, syllable.final)
    );

    const options: QuizOption[] = validGroupInitials.map(initial => ({
      id: `initial-${initial}`,
      label: initial || '∅',
      value: initial,
      isCorrect: initial === correctInitial,
    }));

    // Add more random initials if needed - only valid ones
    const additionalInitials = INITIALS.filter(i =>
      !validGroupInitials.includes(i) && isValidInitialFinal(i, syllable.final)
    );
    while (options.length < level.optionCount && additionalInitials.length > 0) {
      const extraInitial = randomItem(additionalInitials);
      options.push({
        id: `initial-${extraInitial}`,
        label: extraInitial || '∅',
        value: extraInitial,
        isCorrect: false,
      });
      additionalInitials.splice(additionalInitials.indexOf(extraInitial), 1);
    }

    // Skip if we don't have enough valid options
    if (options.length < 2) continue;

    questions.push({
      id: `initial-${i}`,
      audioUrl,
      correctAnswer: correctInitial,
      options: shuffleOptionsWithCorrect(options, Math.min(level.optionCount, options.length)),
      syllable: `${syllable.pinyin}${tone}`,
      explanation: `Correct answer: ${correctInitial || '∅'} (${addToneMarks(syllable.pinyin, tone)})`,
    });
  }

  return questions;
}

// ============================================================================
// 3. FINAL RECOGNITION
// ============================================================================

/**
 * Check if a given initial + final combination forms a valid syllable
 */
function isValidSyllable(initial: string, final: string): boolean {
  return PINYIN_SYLLABLES.some(s => s.initial === initial && s.final === final);
}

export async function generateFinalQuestions(
  level: LevelConfig,
  count: number
): Promise<Question[]> {
  const questions: Question[] = [];
  const recentSyllables: PinyinSyllable[] = [];

  // Define confusing final groups
  const confusingGroups = [
    ['a', 'e', 'o'],
    ['ai', 'ei', 'ao', 'ou'],
    ['an', 'en', 'ang', 'eng'],
    ['ian', 'uan', 'üan'],
    ['iang', 'uang'],
    ['in', 'un', 'ün'],
    ['ing', 'ong', 'iong'],
  ];

  for (let i = 0; i < count; i++) {
    // Pick a confusing group
    const group = randomItem(confusingGroups);
    const correctFinal = randomItem(group);

    // Find syllables with this final
    const syllablesWithFinal = PINYIN_SYLLABLES.filter(s =>
      s.final === correctFinal && s.tones.length > 0
    );

    if (syllablesWithFinal.length === 0) continue;

    // Pick a syllable avoiding recent ones
    const syllable = randomItemAvoiding(
      syllablesWithFinal,
      recentSyllables.slice(-RECENT_WINDOW_SIZE),
      s => s.pinyin
    );

    if (!syllable) continue;

    recentSyllables.push(syllable);
    const tone = randomItem(syllable.tones);

    const audioUrl = getAudioUrl(`${syllable.pinyin}${tone}`);

    // Create options from the confusing group - only include valid combinations
    const validGroupFinals = group.filter(final =>
      isValidSyllable(syllable.initial, final)
    );

    const options: QuizOption[] = validGroupFinals.map(final => ({
      id: `final-${final}`,
      label: final,
      value: final,
      isCorrect: final === correctFinal,
    }));

    // Add more random finals if needed - only valid ones
    const additionalFinals = FINALS.filter(f =>
      !validGroupFinals.includes(f) && isValidSyllable(syllable.initial, f)
    );
    while (options.length < level.optionCount && additionalFinals.length > 0) {
      const extraFinal = randomItem(additionalFinals);
      options.push({
        id: `final-${extraFinal}`,
        label: extraFinal,
        value: extraFinal,
        isCorrect: false,
      });
      additionalFinals.splice(additionalFinals.indexOf(extraFinal), 1);
    }

    // Skip if we don't have enough valid options
    if (options.length < 2) continue;

    questions.push({
      id: `final-${i}`,
      audioUrl,
      correctAnswer: correctFinal,
      options: shuffleOptionsWithCorrect(options, Math.min(level.optionCount, options.length)),
      syllable: `${syllable.pinyin}${tone}`,
      explanation: `Correct answer: ${correctFinal} (${addToneMarks(syllable.pinyin, tone)})`,
    });
  }

  return questions;
}

// ============================================================================
// 4. COMPLETE SYLLABLE RECOGNITION
// ============================================================================

export async function generateSyllableQuestions(
  level: LevelConfig,
  count: number
): Promise<Question[]> {
  const questions: Question[] = [];
  const recentSyllables: PinyinSyllable[] = [];

  // Get all valid syllables upfront
  const syllablesWithTones = PINYIN_SYLLABLES.filter(s => s.tones.length > 0);

  for (let i = 0; i < count; i++) {
    // Pick a random syllable, avoiding recent ones
    const correctSyllable = randomItemAvoiding(
      syllablesWithTones,
      recentSyllables.slice(-RECENT_WINDOW_SIZE),
      s => s.pinyin
    );

    if (!correctSyllable) continue;

    recentSyllables.push(correctSyllable);
    const tone = randomItem(correctSyllable.tones);

    const audioUrl = getAudioUrl(`${correctSyllable.pinyin}${tone}`);
    const correctDisplay = addToneMarks(correctSyllable.pinyin, tone);

    // Find similar-sounding syllables for wrong options
    const similarSyllables = PINYIN_SYLLABLES.filter(s =>
      s.pinyin !== correctSyllable.pinyin &&
      s.tones.length > 0 &&
      (
        // Same initial or final
        s.initial === correctSyllable.initial ||
        s.final === correctSyllable.final ||
        // Similar length
        Math.abs(s.pinyin.length - correctSyllable.pinyin.length) <= 1
      )
    );

    const wrongOptions = randomItems(similarSyllables, level.optionCount - 1);

    // For syllable quiz, include tone in value so we can play the correct audio
    const options: QuizOption[] = [
      {
        id: 'correct',
        label: correctDisplay,
        value: `${correctSyllable.pinyin}${tone}`,  // Include tone for audio playback
        isCorrect: true,
      },
      ...wrongOptions.map((s, idx) => {
        const wrongTone = randomItem(s.tones);
        return {
          id: `wrong-${idx}`,
          label: addToneMarks(s.pinyin, wrongTone),
          value: `${s.pinyin}${wrongTone}`,  // Include tone for audio playback
          isCorrect: false,
        };
      }),
    ];

    questions.push({
      id: `syllable-${i}`,
      audioUrl,
      correctAnswer: `${correctSyllable.pinyin}${tone}`,  // Include tone to match option values
      options: shuffle(options),
      syllable: `${correctSyllable.pinyin}${tone}`,
      explanation: `Correct answer: ${correctDisplay}`,
    });
  }

  return questions;
}

// ============================================================================
// 5. MINIMAL PAIRS (Using curated minimal pairs data)
// ============================================================================

export async function generateMinimalPairQuestions(
  level: LevelConfig,
  count: number
): Promise<Question[]> {
  const questions: Question[] = [];
  const recentPinyin: string[] = [];

  // Import minimal pairs data (will be available after file creation)
  const { MINIMAL_PAIRS } = await import('../../data/minimalPairs');

  // Select pairs by level difficulty
  const difficultyMap = ['medium', 'medium', 'hard'] as const;
  const targetDifficulty = difficultyMap[Math.min(level.id, difficultyMap.length - 1)];

  const availableSets = MINIMAL_PAIRS.filter(set => set.difficulty === targetDifficulty);
  const pairSet = randomItem(availableSets);
  const allPairs = pairSet.pairs;

  for (let i = 0; i < count; i++) {
    // Pick a pair, avoiding recent pinyin
    const availablePairs = allPairs.filter(pair =>
      !pair.some(p => recentPinyin.slice(-RECENT_WINDOW_SIZE).includes(p))
    );
    const pair = availablePairs.length > 0 ? randomItem(availablePairs) : randomItem(allPairs);
    const correctPinyin = randomItem(pair);

    recentPinyin.push(correctPinyin);

    // Find syllable object
    const syllableObj = PINYIN_SYLLABLES.find(s => s.pinyin === correctPinyin);
    if (!syllableObj || syllableObj.tones.length === 0) continue;

    const tone = randomItem(syllableObj.tones);
    const audioUrl = getAudioUrl(`${correctPinyin}${tone}`);

    // Create options from the pair - include tone in value for audio playback
    const options: QuizOption[] = pair.map(p => ({
      id: `pair-${p}`,
      label: addToneMarks(p, tone),
      value: `${p}${tone}`,  // Include tone for audio playback
      isCorrect: p === correctPinyin,
    }));

    // Add more confusing options to reach optionCount
    const confusingSyllables = PINYIN_SYLLABLES.filter(s =>
      !pair.includes(s.pinyin) &&
      s.tones.includes(tone) &&
      (s.initial === syllableObj.initial || s.final === syllableObj.final)
    );

    while (options.length < level.optionCount && confusingSyllables.length > 0) {
      const extraSyllable = randomItem(confusingSyllables);
      options.push({
        id: `extra-${extraSyllable.pinyin}`,
        label: addToneMarks(extraSyllable.pinyin, tone),
        value: `${extraSyllable.pinyin}${tone}`,  // Include tone for audio playback
        isCorrect: false,
      });
      confusingSyllables.splice(confusingSyllables.indexOf(extraSyllable), 1);
    }

    questions.push({
      id: `minimal-${i}`,
      audioUrl,
      correctAnswer: `${correctPinyin}${tone}`,  // Include tone to match option values
      options: shuffleOptionsWithCorrect(options, level.optionCount),
      syllable: `${correctPinyin}${tone}`,
      explanation: `Correct answer: ${addToneMarks(correctPinyin, tone)} (${pairSet.description})`,
    });
  }

  return questions;
}

// ============================================================================
// 6. HSK WORDS (Using real HSK vocabulary data)
// ============================================================================

export async function generateHSKWordQuestions(
  level: LevelConfig,
  count: number
): Promise<Question[]> {
  const questions: Question[] = [];
  const recentPinyin: string[] = [];

  // Import HSK words data
  const { getWordsByLevel } = await import('../../data/hskWords');

  // Map level ID to HSK level (0 -> HSK 1, 1 -> HSK 2, 2 -> HSK 3)
  const hskLevel = (level.id + 1) as 1 | 2 | 3;

  // Get all words for this level and shuffle them
  const allWords = shuffle(getWordsByLevel(hskLevel));

  for (let i = 0; i < Math.min(count, allWords.length); i++) {
    // Pick a word avoiding recent pinyin
    const availableWords = allWords.filter(w =>
      !recentPinyin.slice(-RECENT_WINDOW_SIZE).includes(w.pinyin)
    );
    const word = availableWords.length > 0 ? availableWords[0] : allWords[i];

    recentPinyin.push(word.pinyin);
    // Remove used word from allWords to avoid duplicates
    const wordIndex = allWords.indexOf(word);
    if (wordIndex > -1) allWords.splice(wordIndex, 1);

    // For single syllable words, use the syllable directly
    // For multi-syllable words, use the full pinyin
    const firstSyllable = word.syllables[0];
    const audioUrl = getAudioUrl(firstSyllable);

    // Create wrong options by finding similar words from the shuffled pool
    const wrongWords = allWords
      .filter(w => w.pinyin !== word.pinyin)
      .slice(0, level.optionCount - 1);

    // Use hanzi|syllables format for vocabulary audio playback
    // Format: "你好|ni3,hao3" - hanzi for CDN/TTS, syllables as fallback
    const options: QuizOption[] = [
      {
        id: 'correct',
        label: word.pinyinDisplay,
        value: `${word.word}|${word.syllables.join(',')}`,  // hanzi|syllables for audio
        isCorrect: true,
      },
      ...wrongWords.map((w, idx) => ({
        id: `wrong-${idx}`,
        label: w.pinyinDisplay,
        value: `${w.word}|${w.syllables.join(',')}`,  // hanzi|syllables for audio
        isCorrect: false,
      })),
    ];

    questions.push({
      id: `hsk-${i}`,
      audioUrl,
      correctAnswer: `${word.word}|${word.syllables.join(',')}`,  // Match option value format
      options: shuffle(options),
      syllable: word.syllables.join(','),  // All syllables (for fallback)
      hanzi: word.word,  // Chinese characters for vocabulary audio
      explanation: `Correct answer: ${word.pinyinDisplay} (${word.meaning})`,
    });
  }

  return questions;
}

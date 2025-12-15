/**
 * Question Generator
 *
 * Generates quiz questions for all 6 quiz types.
 * Each generator creates questions with audio URLs and multiple choice options.
 */

import type { Question, QuizOption, LevelConfig } from './types';
import { PINYIN_SYLLABLES } from '../../data/pinyinSyllables';
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

// ============================================================================
// 1. TONE RECOGNITION
// ============================================================================

export async function generateToneQuestions(
  level: LevelConfig,
  count: number
): Promise<Question[]> {
  const questions: Question[] = [];

  // Get available tones for this level
  const availableTones = level.id === 0 ? [1, 2, 3, 4] : [1, 2, 3, 4, 5];

  for (let i = 0; i < count; i++) {
    // Pick a random syllable that has multiple tones
    const syllablesWithTones = PINYIN_SYLLABLES.filter(s =>
      s.tones.length >= 3 && s.tones.some(t => availableTones.includes(t))
    );
    const syllable = randomItem(syllablesWithTones);

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
      options: shuffle(toneOptions),
      syllable: `${syllable.pinyin}${correctTone}`,
      explanation: `Correct answer: ${getToneLabel(correctTone)} (${addToneMarks(syllable.pinyin, correctTone)})`,
    });
  }

  return questions;
}

function getToneLabel(tone: number): string {
  const labels = ['', '1st Tone (mā)', '2nd Tone (má)', '3rd Tone (mǎ)', '4th Tone (mà)', 'Neutral (ma)'];
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

    const syllable = randomItem(syllablesWithInitial);
    const tone = randomItem(syllable.tones);

    const audioUrl = getAudioUrl(`${syllable.pinyin}${tone}`);

    // Create options from the confusing group
    const options: QuizOption[] = group.map(initial => ({
      id: `initial-${initial}`,
      label: initial || '∅',
      value: initial,
      isCorrect: initial === correctInitial,
    }));

    // Add more random initials if needed to reach optionCount
    const additionalInitials = INITIALS.filter(i => !group.includes(i));
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

    questions.push({
      id: `initial-${i}`,
      audioUrl,
      correctAnswer: correctInitial,
      options: shuffle(options).slice(0, level.optionCount),
      syllable: `${syllable.pinyin}${tone}`,
      explanation: `Correct answer: ${correctInitial || '∅'} (${addToneMarks(syllable.pinyin, tone)})`,
    });
  }

  return questions;
}

// ============================================================================
// 3. FINAL RECOGNITION
// ============================================================================

export async function generateFinalQuestions(
  level: LevelConfig,
  count: number
): Promise<Question[]> {
  const questions: Question[] = [];

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

    const syllable = randomItem(syllablesWithFinal);
    const tone = randomItem(syllable.tones);

    const audioUrl = getAudioUrl(`${syllable.pinyin}${tone}`);

    // Create options from the confusing group
    const options: QuizOption[] = group.map(final => ({
      id: `final-${final}`,
      label: final,
      value: final,
      isCorrect: final === correctFinal,
    }));

    // Add more random finals if needed
    const additionalFinals = FINALS.filter(f => !group.includes(f));
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

    questions.push({
      id: `final-${i}`,
      audioUrl,
      correctAnswer: correctFinal,
      options: shuffle(options).slice(0, level.optionCount),
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

  for (let i = 0; i < count; i++) {
    // Pick a random syllable with tones
    const syllablesWithTones = PINYIN_SYLLABLES.filter(s => s.tones.length > 0);
    const correctSyllable = randomItem(syllablesWithTones);
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

    const options: QuizOption[] = [
      {
        id: 'correct',
        label: correctDisplay,
        value: correctSyllable.pinyin,
        isCorrect: true,
      },
      ...wrongOptions.map((s, idx) => ({
        id: `wrong-${idx}`,
        label: addToneMarks(s.pinyin, randomItem(s.tones)),
        value: s.pinyin,
        isCorrect: false,
      })),
    ];

    questions.push({
      id: `syllable-${i}`,
      audioUrl,
      correctAnswer: correctSyllable.pinyin,
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

  // Import minimal pairs data (will be available after file creation)
  const { MINIMAL_PAIRS } = await import('../../data/minimalPairs');

  // Select pairs by level difficulty
  const difficultyMap = ['medium', 'medium', 'hard'] as const;
  const targetDifficulty = difficultyMap[Math.min(level.id, difficultyMap.length - 1)];

  const availableSets = MINIMAL_PAIRS.filter(set => set.difficulty === targetDifficulty);
  const pairSet = randomItem(availableSets);
  const allPairs = pairSet.pairs;

  for (let i = 0; i < count; i++) {
    const pair = randomItem(allPairs);
    const correctPinyin = randomItem(pair);

    // Find syllable object
    const syllableObj = PINYIN_SYLLABLES.find(s => s.pinyin === correctPinyin);
    if (!syllableObj || syllableObj.tones.length === 0) continue;

    const tone = randomItem(syllableObj.tones);
    const audioUrl = getAudioUrl(`${correctPinyin}${tone}`);

    // Create options from the pair
    const options: QuizOption[] = pair.map(p => ({
      id: `pair-${p}`,
      label: addToneMarks(p, tone),
      value: p,
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
        value: extraSyllable.pinyin,
        isCorrect: false,
      });
      confusingSyllables.splice(confusingSyllables.indexOf(extraSyllable), 1);
    }

    questions.push({
      id: `minimal-${i}`,
      audioUrl,
      correctAnswer: correctPinyin,
      options: shuffle(options).slice(0, level.optionCount),
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

  // Import HSK words data
  const { getRandomWords } = await import('../../data/hskWords');

  // Map level ID to HSK level (0 -> HSK 1, 1 -> HSK 2, 2 -> HSK 3)
  const hskLevel = (level.id + 1) as 1 | 2 | 3;

  // Get random words from this HSK level
  const words = getRandomWords(hskLevel, count);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // For single syllable words, use the syllable directly
    // For multi-syllable words, use the full pinyin
    const firstSyllable = word.syllables[0];
    const audioUrl = getAudioUrl(firstSyllable);

    // Create wrong options by finding similar words
    const allWordsForLevel = await import('../../data/hskWords').then(m => m.getWordsByLevel(hskLevel));
    const wrongWords = allWordsForLevel
      .filter(w => w.pinyin !== word.pinyin)
      .sort(() => Math.random() - 0.5)
      .slice(0, level.optionCount - 1);

    const options: QuizOption[] = [
      {
        id: 'correct',
        label: word.pinyinDisplay,
        value: word.pinyin,
        isCorrect: true,
      },
      ...wrongWords.map((w, idx) => ({
        id: `wrong-${idx}`,
        label: w.pinyinDisplay,
        value: w.pinyin,
        isCorrect: false,
      })),
    ];

    questions.push({
      id: `hsk-${i}`,
      audioUrl,
      correctAnswer: word.pinyin,
      options: shuffle(options),
      syllable: firstSyllable,
      explanation: `Correct answer: ${word.pinyinDisplay} (${word.meaning})`,
    });
  }

  return questions;
}

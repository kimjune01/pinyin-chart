/**
 * Quiz Configurations
 *
 * Defines all 6 quiz types with their levels and settings.
 * Each quiz uses the same framework but with different question generators.
 */

import type { QuizConfig } from '../lib/quiz/types';
import {
  generateToneQuestions,
  generateInitialQuestions,
  generateFinalQuestions,
  generateSyllableQuestions,
  generateMinimalPairQuestions,
  generateHSKWordQuestions,
  generateAudioToHanziQuestions,
  generateHanziToPinyinQuestions,
  generateHanziToMeaningQuestions,
} from '../lib/quiz/questionGenerator';

// ============================================================================
// 1. TONE RECOGNITION QUIZ
// ============================================================================

export const TONE_QUIZ: QuizConfig = {
  id: 'tone-recognition',
  name: 'Tone Recognition',
  description: 'Listen to a syllable and identify which of the 4 tones is being used.',
  icon: '🎵',
  levels: [
    {
      id: 0,
      name: 'Four Tones',
      description: 'Basic tone recognition (1st, 2nd, 3rd, 4th)',
      questionCount: 10,
      optionCount: 4,
      difficulty: 'easy',
      unlockThreshold: 80,
    },
    {
      id: 1,
      name: 'Timed',
      description: '5 seconds per question',
      questionCount: 15,
      optionCount: 4,
      difficulty: 'medium',
      unlockThreshold: 80,
      questionTimeLimit: 5,
    },
    {
      id: 2,
      name: 'Master',
      description: '2.5 seconds per question',
      questionCount: 20,
      optionCount: 4,
      difficulty: 'hard',
      unlockThreshold: 85,
      questionTimeLimit: 2.5,
    },
  ],
  generateQuestions: generateToneQuestions,
};

// ============================================================================
// 2. INITIAL RECOGNITION QUIZ
// ============================================================================

export const INITIAL_QUIZ: QuizConfig = {
  id: 'initial-recognition',
  name: 'Initial Recognition',
  description: 'Identify the initial consonant sound (b, p, m, f, etc.)',
  icon: '🔤',
  levels: [
    {
      id: 0,
      name: 'Labials',
      description: 'b, p, m, f sounds',
      questionCount: 10,
      optionCount: 4,
      difficulty: 'easy',
      unlockThreshold: 80,
    },
    {
      id: 1,
      name: 'Dentals',
      description: 'd, t, n, l sounds',
      questionCount: 12,
      optionCount: 4,
      difficulty: 'easy',
      unlockThreshold: 80,
    },
    {
      id: 2,
      name: 'Palatals',
      description: 'j, q, x sounds',
      questionCount: 12,
      optionCount: 4,
      difficulty: 'medium',
      unlockThreshold: 80,
    },
    {
      id: 3,
      name: 'Retroflexes',
      description: 'zh, ch, sh, r sounds',
      questionCount: 12,
      optionCount: 4,
      difficulty: 'medium',
      unlockThreshold: 85,
    },
    {
      id: 4,
      name: 'Sibilants',
      description: 'z, c, s sounds',
      questionCount: 12,
      optionCount: 4,
      difficulty: 'medium',
      unlockThreshold: 85,
    },
    {
      id: 5,
      name: 'Confusing Pairs',
      description: 'zh/z/j, ch/c/q, sh/s/x',
      questionCount: 15,
      optionCount: 5,
      difficulty: 'hard',
      unlockThreshold: 85,
    },
  ],
  generateQuestions: generateInitialQuestions,
};

// ============================================================================
// 3. FINAL RECOGNITION QUIZ
// ============================================================================

export const FINAL_QUIZ: QuizConfig = {
  id: 'final-recognition',
  name: 'Final Recognition',
  description: 'Identify the final vowel sound (a, ai, an, ang, etc.)',
  icon: '🎤',
  levels: [
    {
      id: 0,
      name: 'Simple Vowels',
      description: 'a, e, o sounds',
      questionCount: 10,
      optionCount: 3,
      difficulty: 'easy',
      unlockThreshold: 80,
    },
    {
      id: 1,
      name: 'Compound Vowels',
      description: 'ai, ei, ao, ou sounds',
      questionCount: 12,
      optionCount: 4,
      difficulty: 'medium',
      unlockThreshold: 80,
    },
    {
      id: 2,
      name: 'Nasal n',
      description: 'an, en, in, un, ün sounds',
      questionCount: 12,
      optionCount: 5,
      difficulty: 'medium',
      unlockThreshold: 80,
    },
    {
      id: 3,
      name: 'Nasal ng',
      description: 'ang, eng, ing, ong sounds',
      questionCount: 12,
      optionCount: 4,
      difficulty: 'medium',
      unlockThreshold: 85,
    },
    {
      id: 4,
      name: 'n vs ng',
      description: 'Distinguish between n and ng endings',
      questionCount: 15,
      optionCount: 4,
      difficulty: 'hard',
      unlockThreshold: 85,
    },
  ],
  generateQuestions: generateFinalQuestions,
};

// ============================================================================
// 4. COMPLETE SYLLABLE QUIZ
// ============================================================================

export const SYLLABLE_QUIZ: QuizConfig = {
  id: 'complete-syllable',
  name: 'Complete Syllable',
  description: 'Recognize the entire pinyin syllable with tone marks.',
  icon: '💬',
  levels: [
    {
      id: 0,
      name: 'Beginner',
      description: 'Common syllables',
      questionCount: 10,
      optionCount: 4,
      difficulty: 'easy',
      unlockThreshold: 80,
    },
    {
      id: 1,
      name: 'Intermediate',
      description: 'More challenging syllables',
      questionCount: 15,
      optionCount: 5,
      difficulty: 'medium',
      unlockThreshold: 80,
    },
    {
      id: 2,
      name: 'Advanced',
      description: 'Complex syllables',
      questionCount: 20,
      optionCount: 6,
      difficulty: 'hard',
      unlockThreshold: 85,
    },
  ],
  generateQuestions: generateSyllableQuestions,
};

// ============================================================================
// 5. MINIMAL PAIRS QUIZ
// ============================================================================

export const MINIMAL_PAIRS_QUIZ: QuizConfig = {
  id: 'minimal-pairs',
  name: 'Minimal Pairs',
  description: 'Distinguish between easily confused syllable pairs.',
  icon: '🔍',
  levels: [
    {
      id: 0,
      name: 'Retroflex vs Dental',
      description: 'zh/z, ch/c, sh/s pairs',
      questionCount: 12,
      optionCount: 3,
      difficulty: 'medium',
      unlockThreshold: 80,
    },
    {
      id: 1,
      name: 'Palatals',
      description: 'j/q/x confusions',
      questionCount: 12,
      optionCount: 3,
      difficulty: 'medium',
      unlockThreshold: 80,
    },
    {
      id: 2,
      name: 'n vs ng Endings',
      description: 'an/ang, en/eng, in/ing pairs',
      questionCount: 15,
      optionCount: 4,
      difficulty: 'hard',
      unlockThreshold: 85,
    },
  ],
  generateQuestions: generateMinimalPairQuestions,
};

// ============================================================================
// 6. HSK WORDS QUIZ
// ============================================================================

export const HSK_QUIZ: QuizConfig = {
  id: 'hsk-words',
  name: 'HSK Audio → Pinyin',
  description: 'Recognize pinyin for common HSK vocabulary words.',
  icon: '📚',
  levels: [
    {
      id: 0,
      name: 'HSK 1',
      description: 'Basic vocabulary (150 words)',
      questionCount: 10,
      optionCount: 4,
      difficulty: 'easy',
      unlockThreshold: 80,
    },
    {
      id: 1,
      name: 'HSK 2',
      description: 'Elementary vocabulary (300 words)',
      questionCount: 15,
      optionCount: 4,
      difficulty: 'medium',
      unlockThreshold: 80,
    },
    {
      id: 2,
      name: 'HSK 3',
      description: 'Intermediate vocabulary (600 words)',
      questionCount: 20,
      optionCount: 5,
      difficulty: 'hard',
      unlockThreshold: 85,
    },
  ],
  generateQuestions: generateHSKWordQuestions,
};

// ============================================================================
// 7. AUDIO TO HANZI QUIZ
// ============================================================================

export const AUDIO_TO_HANZI_QUIZ: QuizConfig = {
  id: 'audio-to-hanzi',
  name: 'Audio to Character',
  description: 'Hear the pronunciation and select the correct Chinese character.',
  icon: '👂',
  levels: [
    {
      id: 0,
      name: 'HSK 1',
      description: '150 basic characters',
      questionCount: 10,
      optionCount: 4,
      difficulty: 'easy',
      unlockThreshold: 80,
    },
    {
      id: 1,
      name: 'HSK 2',
      description: '150 elementary characters',
      questionCount: 12,
      optionCount: 4,
      difficulty: 'easy',
      unlockThreshold: 80,
    },
    {
      id: 2,
      name: 'HSK 3',
      description: '300 intermediate characters',
      questionCount: 15,
      optionCount: 5,
      difficulty: 'medium',
      unlockThreshold: 80,
    },
    {
      id: 3,
      name: 'HSK 4',
      description: '300 upper-intermediate characters',
      questionCount: 15,
      optionCount: 5,
      difficulty: 'medium',
      unlockThreshold: 85,
    },
    {
      id: 4,
      name: 'HSK 5',
      description: '400 advanced characters',
      questionCount: 20,
      optionCount: 6,
      difficulty: 'hard',
      unlockThreshold: 85,
    },
    {
      id: 5,
      name: 'HSK 6',
      description: '500 proficient characters',
      questionCount: 20,
      optionCount: 6,
      difficulty: 'hard',
      unlockThreshold: 90,
    },
  ],
  generateQuestions: generateAudioToHanziQuestions,
};

// ============================================================================
// 8. HANZI TO PINYIN QUIZ
// ============================================================================

export const HANZI_TO_PINYIN_QUIZ: QuizConfig = {
  id: 'hanzi-to-pinyin',
  name: 'Character to Pinyin',
  description: 'See a Chinese character and select the correct pinyin pronunciation.',
  icon: '📖',
  levels: [
    {
      id: 0,
      name: 'HSK 1',
      description: '150 basic characters',
      questionCount: 10,
      optionCount: 4,
      difficulty: 'easy',
      unlockThreshold: 80,
    },
    {
      id: 1,
      name: 'HSK 2',
      description: '150 elementary characters',
      questionCount: 12,
      optionCount: 4,
      difficulty: 'easy',
      unlockThreshold: 80,
    },
    {
      id: 2,
      name: 'HSK 3',
      description: '300 intermediate characters',
      questionCount: 15,
      optionCount: 5,
      difficulty: 'medium',
      unlockThreshold: 80,
    },
    {
      id: 3,
      name: 'HSK 4',
      description: '300 upper-intermediate characters',
      questionCount: 15,
      optionCount: 5,
      difficulty: 'medium',
      unlockThreshold: 85,
    },
    {
      id: 4,
      name: 'HSK 5',
      description: '400 advanced characters',
      questionCount: 20,
      optionCount: 6,
      difficulty: 'hard',
      unlockThreshold: 85,
    },
    {
      id: 5,
      name: 'HSK 6',
      description: '500 proficient characters',
      questionCount: 20,
      optionCount: 6,
      difficulty: 'hard',
      unlockThreshold: 90,
    },
  ],
  generateQuestions: generateHanziToPinyinQuestions,
};

// ============================================================================
// 9. HANZI TO MEANING QUIZ
// ============================================================================

export const HANZI_TO_MEANING_QUIZ: QuizConfig = {
  id: 'hanzi-to-meaning',
  name: 'Character to Meaning',
  description: 'See a Chinese character and select the correct English meaning.',
  icon: '🔤',
  levels: [
    {
      id: 0,
      name: 'HSK 1',
      description: '150 basic characters',
      questionCount: 10,
      optionCount: 4,
      difficulty: 'easy',
      unlockThreshold: 80,
    },
    {
      id: 1,
      name: 'HSK 2',
      description: '150 elementary characters',
      questionCount: 12,
      optionCount: 4,
      difficulty: 'easy',
      unlockThreshold: 80,
    },
    {
      id: 2,
      name: 'HSK 3',
      description: '300 intermediate characters',
      questionCount: 15,
      optionCount: 5,
      difficulty: 'medium',
      unlockThreshold: 80,
    },
    {
      id: 3,
      name: 'HSK 4',
      description: '300 upper-intermediate characters',
      questionCount: 15,
      optionCount: 5,
      difficulty: 'medium',
      unlockThreshold: 85,
    },
    {
      id: 4,
      name: 'HSK 5',
      description: '400 advanced characters',
      questionCount: 20,
      optionCount: 6,
      difficulty: 'hard',
      unlockThreshold: 85,
    },
    {
      id: 5,
      name: 'HSK 6',
      description: '500 proficient characters',
      questionCount: 20,
      optionCount: 6,
      difficulty: 'hard',
      unlockThreshold: 90,
    },
  ],
  generateQuestions: generateHanziToMeaningQuestions,
};

// ============================================================================
// QUIZ REGISTRY
// ============================================================================

export const ALL_QUIZZES: QuizConfig[] = [
  TONE_QUIZ,
  INITIAL_QUIZ,
  FINAL_QUIZ,
  SYLLABLE_QUIZ,
  MINIMAL_PAIRS_QUIZ,
  HSK_QUIZ,
  AUDIO_TO_HANZI_QUIZ,
  HANZI_TO_PINYIN_QUIZ,
  HANZI_TO_MEANING_QUIZ,
];

export function getQuizById(id: string): QuizConfig | undefined {
  return ALL_QUIZZES.find(q => q.id === id);
}

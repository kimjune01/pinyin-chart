/**
 * Sentence Translator Quiz Types
 *
 * Types for the multi-step sentence translation quiz where users
 * guess constituents one by one, then the full sentence meaning.
 */

import type { Word } from '../../data/sentencePatterns';
import type { QuizOption, GameState, LevelConfig } from './types';

/**
 * Display mode for the sentence prompt
 */
export type SentenceDisplayMode = 'visual-audio' | 'audio-only' | 'visual-only';

/**
 * A single step in the multi-step translation process
 */
export interface TranslatorStep {
  id: string;
  slotId: string;           // Which pattern slot this step corresponds to
  slotLabel: string;        // Display label (e.g., "Subject", "Verb", "Object")
  correctAnswer: string;    // The correct English word/phrase
  correctWord: Word;        // Full word object with hanzi, pinyin, english
  options: QuizOption[];    // Multiple choice options
  isStructureStep: boolean; // true for final "full sentence meaning" step
}

/**
 * A complete translator question with all its steps
 */
export interface TranslatorQuestion {
  id: string;
  patternId: string;
  patternName: string;
  fullHanzi: string;        // Complete Chinese sentence
  fullPinyin: string;       // Complete pinyin with tone marks
  fullEnglish: string;      // Complete English translation
  selectedWords: Record<string, Word>;  // Words selected for each slot
  steps: TranslatorStep[];  // All steps to complete this question
}

/**
 * Progress tracking for a single step within a question
 */
export interface TranslatorStepProgress {
  stepId: string;
  completed: boolean;
  attempts: number;         // Number of tries (for retry-until-correct)
  selectedAnswer: string | null;
  isCorrect: boolean | null;
}

/**
 * Session state for the translator quiz
 */
export interface TranslatorSession {
  quizId: string;
  levelId: number;
  questions: TranslatorQuestion[];
  currentQuestionIndex: number;
  totalQuestions: number;
  questionsCompleted: number;  // Questions fully completed (all steps done)
  startTime: number;
  displayMode: SentenceDisplayMode;
}

/**
 * State returned by the useTranslatorQuizEngine hook
 */
export interface TranslatorEngineState {
  // Game state
  gameState: GameState;
  session: TranslatorSession | null;

  // Current question state
  currentQuestion: TranslatorQuestion | null;
  currentQuestionIndex: number;
  totalQuestions: number;

  // Multi-step state
  currentStepIndex: number;
  totalStepsInQuestion: number;
  stepProgress: TranslatorStepProgress[];
  revealedSlots: string[];    // Slot IDs that have been correctly guessed

  // Answer state
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  currentAttempts: number;    // Attempts on current step

  // Display mode
  displayMode: SentenceDisplayMode;

  // Scoring
  score: number;              // Percentage correct
  perfectQuestions: number;   // Questions with all steps correct on first try
  totalStepsCompleted: number;
  totalStepsAttempted: number;
}

/**
 * Actions available from the useTranslatorQuizEngine hook
 */
export interface TranslatorEngineActions {
  startLevel: (levelId: number) => Promise<void>;
  submitStepAnswer: (answer: string) => void;
  nextStep: () => void;
  nextQuestion: () => void;
  setDisplayMode: (mode: SentenceDisplayMode) => void;
  restartLevel: () => void;
  exitQuiz: () => void;
  playAudio: () => void;
}

/**
 * Level configuration specific to translator quiz
 */
export interface TranslatorLevelConfig extends LevelConfig {
  patterns?: string[];        // Specific pattern IDs to use (optional)
  includeQuestions?: boolean; // Include question patterns (default: false for early levels)
}

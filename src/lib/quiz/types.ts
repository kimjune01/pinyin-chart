/**
 * Quiz Type System
 *
 * Defines TypeScript interfaces and types for the entire quiz system.
 * This allows all 6 quiz types to share the same framework.
 */

/**
 * Quiz game states
 */
export type GameState =
  | 'idle'           // Level selection screen
  | 'loading'        // Loading questions
  | 'playing'        // Currently answering a question
  | 'answered'       // Just answered, showing feedback
  | 'levelComplete'  // Finished all questions in level
  | 'finished';      // Quiz session ended

/**
 * Answer option for multiple choice
 */
export interface QuizOption {
  id: string;
  label: string;      // Display text (e.g., "mā", "1st Tone", "ma")
  value: string;      // Actual value for comparison
  isCorrect: boolean;
  meaning?: string;   // English meaning (for HSK vocabulary options)
  hanzi?: string;     // Chinese characters (for HSK vocabulary options)
}

/**
 * Individual quiz question
 */
export interface Question {
  id: string;
  audioUrl: string;              // URL to the audio file to play
  correctAnswer: string;         // The correct answer value
  options: QuizOption[];         // Multiple choice options
  explanation?: string;          // Optional explanation after answer
  syllable?: string;             // Original syllable for reference
  hanzi?: string;                // Chinese characters for vocabulary audio (HSK words)
  meaning?: string;              // English meaning (for HSK vocabulary)
  displayType?: 'audio' | 'visual' | 'visual-silent'; // audio: play first, visual: show with audio btn, visual-silent: no audio until feedback
  visualPrompt?: string;         // Character/text to display for visual-first questions
}

/**
 * Quiz level configuration
 */
export interface LevelConfig {
  id: number;
  name: string;                  // e.g., "Basic", "Intermediate", "Advanced"
  description: string;           // What this level covers
  questionCount: number;         // Number of questions per round
  optionCount: number;           // Number of multiple choice options
  difficulty: 'easy' | 'medium' | 'hard';
  unlockThreshold: number;       // Percentage score needed to unlock (0-100)
  timeLimit?: number;            // Optional total time limit in seconds
  questionTimeLimit?: number;    // Optional per-question time limit in seconds
}

/**
 * Quiz type configuration
 */
export interface QuizConfig {
  id: string;                    // e.g., "tone-recognition"
  name: string;                  // Display name
  description: string;           // What this quiz teaches
  icon?: string;                 // Icon/emoji for the quiz
  levels: LevelConfig[];         // All levels for this quiz

  // Question generation function (will be implemented in Phase 4)
  generateQuestions: (level: LevelConfig, count: number) => Promise<Question[]>;
}

/**
 * User's answer to a question
 */
export interface QuizAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;             // Milliseconds
}

/**
 * Progress for a single level
 */
export interface LevelProgress {
  levelId: number;
  attempts: number;              // Number of times attempted
  bestScore: number;             // Best score (0-100)
  lastScore: number;             // Most recent score
  totalQuestions: number;        // Total questions answered
  correctAnswers: number;        // Total correct answers
  averageTime: number;           // Average time per question (ms)
  lastAttempt: string;           // ISO timestamp
  unlocked: boolean;             // Whether this level is unlocked
}

/**
 * Progress for an entire quiz type
 */
export interface QuizProgress {
  quizId: string;
  currentLevel: number;          // Highest unlocked level
  levels: Record<number, LevelProgress>; // Progress per level
  totalAttempts: number;
  totalCorrect: number;
  totalQuestions: number;
  overallAccuracy: number;       // Percentage (0-100)
}

/**
 * Current quiz session state
 */
export interface QuizSession {
  quizId: string;
  levelId: number;
  questions: Question[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  score: number;                 // Current score (0-100)
  correctCount: number;
  startTime: number;             // Timestamp
  gameState: GameState;
}

/**
 * Result of completing a level
 */
export interface LevelResult {
  levelId: number;
  totalQuestions: number;
  correctAnswers: number;
  score: number;                 // Percentage (0-100)
  accuracy: number;              // Same as score
  averageTime: number;           // Average time per question (ms)
  passed: boolean;               // Whether user passed the threshold
  nextLevelUnlocked: boolean;    // Whether next level was unlocked
}

/**
 * Quiz engine actions
 */
export type QuizAction =
  | { type: 'START_LEVEL'; levelId: number }
  | { type: 'QUESTIONS_LOADED'; questions: Question[] }
  | { type: 'SUBMIT_ANSWER'; answer: string; timeSpent: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'COMPLETE_LEVEL' }
  | { type: 'RESTART_LEVEL' }
  | { type: 'EXIT_QUIZ' };

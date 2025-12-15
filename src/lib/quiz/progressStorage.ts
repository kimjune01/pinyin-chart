/**
 * Progress Storage
 *
 * Manages saving and loading quiz progress from localStorage.
 * Provides a clean API for progress persistence.
 */

import type { QuizProgress, LevelProgress, LevelResult } from './types';

const STORAGE_KEY_PREFIX = 'pinyin-quiz-progress';
const STORAGE_VERSION = 1;

/**
 * Get the storage key for a specific quiz
 */
function getStorageKey(quizId: string): string {
  return `${STORAGE_KEY_PREFIX}-${quizId}-v${STORAGE_VERSION}`;
}

/**
 * Load progress for a specific quiz
 * Returns default progress if none exists
 */
export function loadQuizProgress(quizId: string): QuizProgress {
  if (typeof window === 'undefined') {
    return getDefaultProgress(quizId);
  }

  try {
    const key = getStorageKey(quizId);
    const stored = localStorage.getItem(key);

    if (!stored) {
      return getDefaultProgress(quizId);
    }

    const progress = JSON.parse(stored) as QuizProgress;

    // Validate structure
    if (!progress.quizId || !progress.levels) {
      console.warn(`[progressStorage] Invalid progress data for ${quizId}`);
      return getDefaultProgress(quizId);
    }

    return progress;
  } catch (error) {
    console.error('[progressStorage] Error loading progress:', error);
    return getDefaultProgress(quizId);
  }
}

/**
 * Save progress for a specific quiz
 */
export function saveQuizProgress(progress: QuizProgress): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const key = getStorageKey(progress.quizId);
    localStorage.setItem(key, JSON.stringify(progress));
  } catch (error) {
    console.error('[progressStorage] Error saving progress:', error);
  }
}

/**
 * Update progress after completing a level
 */
export function updateLevelProgress(
  quizId: string,
  levelId: number,
  result: LevelResult
): QuizProgress {
  const progress = loadQuizProgress(quizId);

  // Get or create level progress
  const levelProgress: LevelProgress = progress.levels[levelId] || {
    levelId,
    attempts: 0,
    bestScore: 0,
    lastScore: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    averageTime: 0,
    lastAttempt: new Date().toISOString(),
    unlocked: levelId === 0, // First level is always unlocked
  };

  // Update level progress
  levelProgress.attempts += 1;
  levelProgress.lastScore = result.score;
  levelProgress.bestScore = Math.max(levelProgress.bestScore, result.score);
  levelProgress.totalQuestions += result.totalQuestions;
  levelProgress.correctAnswers += result.correctAnswers;

  // Update average time (weighted average)
  const totalTime = levelProgress.averageTime * (levelProgress.totalQuestions - result.totalQuestions);
  levelProgress.averageTime = (totalTime + result.averageTime * result.totalQuestions) / levelProgress.totalQuestions;

  levelProgress.lastAttempt = new Date().toISOString();
  levelProgress.unlocked = true;

  // Unlock next level if passed threshold
  if (result.nextLevelUnlocked) {
    const nextLevelId = levelId + 1;
    if (!progress.levels[nextLevelId]) {
      progress.levels[nextLevelId] = {
        levelId: nextLevelId,
        attempts: 0,
        bestScore: 0,
        lastScore: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        averageTime: 0,
        lastAttempt: new Date().toISOString(),
        unlocked: true,
      };
    } else {
      progress.levels[nextLevelId].unlocked = true;
    }
    progress.currentLevel = Math.max(progress.currentLevel, nextLevelId);
  }

  // Update level in progress
  progress.levels[levelId] = levelProgress;

  // Recalculate overall stats
  progress.totalAttempts += 1;
  progress.totalCorrect += result.correctAnswers;
  progress.totalQuestions += result.totalQuestions;
  progress.overallAccuracy = progress.totalQuestions > 0
    ? (progress.totalCorrect / progress.totalQuestions) * 100
    : 0;

  // Save updated progress
  saveQuizProgress(progress);

  return progress;
}

/**
 * Check if a level is unlocked
 */
export function isLevelUnlocked(quizId: string, levelId: number): boolean {
  if (levelId === 0) return true; // First level always unlocked

  const progress = loadQuizProgress(quizId);
  return progress.levels[levelId]?.unlocked || false;
}

/**
 * Get the highest unlocked level
 */
export function getHighestUnlockedLevel(quizId: string): number {
  const progress = loadQuizProgress(quizId);
  return progress.currentLevel;
}

/**
 * Reset all progress for a quiz (useful for testing)
 */
export function resetQuizProgress(quizId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const key = getStorageKey(quizId);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('[progressStorage] Error resetting progress:', error);
  }
}

/**
 * Reset all progress for all quizzes
 */
export function resetAllProgress(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const keys = Object.keys(localStorage).filter(key =>
      key.startsWith(STORAGE_KEY_PREFIX)
    );
    keys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('[progressStorage] Error resetting all progress:', error);
  }
}

/**
 * Get default progress for a new quiz
 */
function getDefaultProgress(quizId: string): QuizProgress {
  return {
    quizId,
    currentLevel: 0,
    levels: {
      0: {
        levelId: 0,
        attempts: 0,
        bestScore: 0,
        lastScore: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        averageTime: 0,
        lastAttempt: new Date().toISOString(),
        unlocked: true, // First level always unlocked
      },
    },
    totalAttempts: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    overallAccuracy: 0,
  };
}

/**
 * Export all progress data (for backup/debugging)
 */
export function exportAllProgress(): Record<string, QuizProgress> {
  if (typeof window === 'undefined') {
    return {};
  }

  const allProgress: Record<string, QuizProgress> = {};

  try {
    const keys = Object.keys(localStorage).filter(key =>
      key.startsWith(STORAGE_KEY_PREFIX)
    );

    keys.forEach(key => {
      const stored = localStorage.getItem(key);
      if (stored) {
        const progress = JSON.parse(stored) as QuizProgress;
        allProgress[progress.quizId] = progress;
      }
    });
  } catch (error) {
    console.error('[progressStorage] Error exporting progress:', error);
  }

  return allProgress;
}

/**
 * Import progress data (for restore/testing)
 */
export function importProgress(allProgress: Record<string, QuizProgress>): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    Object.values(allProgress).forEach(progress => {
      saveQuizProgress(progress);
    });
  } catch (error) {
    console.error('[progressStorage] Error importing progress:', error);
  }
}

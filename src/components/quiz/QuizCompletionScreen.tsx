/**
 * QuizCompletionScreen - Shows results after completing a level
 */

import type { LevelResult } from '../../lib/quiz/types';

interface QuizCompletionScreenProps {
  result: LevelResult;
  onNextLevel?: () => void;
  onRetry: () => void;
  onExit: () => void;
}

export default function QuizCompletionScreen({
  result,
  onNextLevel,
  onRetry,
  onExit,
}: QuizCompletionScreenProps) {
  const isPassing = result.passed;
  const formatTime = (ms: number): string => {
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="completion-screen">
      <div className="completion-header">
        <span className="completion-icon">{isPassing ? '🎉' : '💪'}</span>
        <h1 className="completion-title">
          {isPassing ? 'Level Complete!' : 'Keep Practicing!'}
        </h1>
        <div className={`completion-score ${isPassing ? 'passing' : 'failing'}`}>
          {result.score}%
        </div>
      </div>

      <div className="completion-stats">
        <div className="completion-stat">
          <span className="completion-stat-value">{result.correctAnswers}/{result.totalQuestions}</span>
          <span className="completion-stat-label">Correct</span>
        </div>
        <div className="completion-stat">
          <span className="completion-stat-value">{formatTime(result.averageTime)}</span>
          <span className="completion-stat-label">Avg Time</span>
        </div>
      </div>

      {isPassing && result.nextLevelUnlocked && (
        <div className="completion-message success">
          🎊 Next level unlocked!
        </div>
      )}

      {!isPassing && (
        <div className="completion-message failure">
          Try again to unlock the next level
        </div>
      )}

      <div className="completion-actions">
        {isPassing && onNextLevel && result.nextLevelUnlocked && (
          <button className="completion-button primary" onClick={onNextLevel}>
            Next Level →
          </button>
        )}
        <button className="completion-button secondary" onClick={onRetry}>
          🔄 Retry
        </button>
        <button className="completion-button secondary" onClick={onExit}>
          ← Levels
        </button>
      </div>
    </div>
  );
}

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
      <div className="completion-icon">
        {isPassing ? '🎉' : '💪'}
      </div>

      <h1 className="completion-title">
        {isPassing ? 'Level Complete!' : 'Keep Practicing!'}
      </h1>

      <div className={`completion-score ${isPassing ? 'passing' : 'failing'}`}>
        {result.score}%
      </div>

      <div className="completion-stats">
        <div className="completion-stat">
          <div className="completion-stat-value">{result.correctAnswers}</div>
          <div className="completion-stat-label">Correct</div>
        </div>

        <div className="completion-stat">
          <div className="completion-stat-value">{result.totalQuestions}</div>
          <div className="completion-stat-label">Total</div>
        </div>

        <div className="completion-stat">
          <div className="completion-stat-value">{formatTime(result.averageTime)}</div>
          <div className="completion-stat-label">Avg Time</div>
        </div>
      </div>

      {isPassing && result.nextLevelUnlocked && (
        <div style={{
          padding: 'var(--spacing-md)',
          background: 'rgba(74, 144, 226, 0.1)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--spacing-lg)',
        }}>
          <strong>🎊 Next level unlocked!</strong>
        </div>
      )}

      {!isPassing && (
        <div style={{
          padding: 'var(--spacing-md)',
          background: 'rgba(231, 76, 60, 0.1)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--spacing-lg)',
          color: 'var(--color-text-secondary)',
        }}>
          Try again to unlock the next level
        </div>
      )}

      <div className="completion-actions">
        {isPassing && onNextLevel && result.nextLevelUnlocked && (
          <button
            className="completion-button primary"
            onClick={onNextLevel}
          >
            Next Level →
          </button>
        )}

        <button
          className="completion-button secondary"
          onClick={onRetry}
        >
          🔄 Retry Level
        </button>

        <button
          className="completion-button secondary"
          onClick={onExit}
        >
          ← Back to Levels
        </button>
      </div>
    </div>
  );
}

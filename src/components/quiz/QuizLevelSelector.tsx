/**
 * QuizLevelSelector - Grid of level cards for selecting which level to play
 */

import type { LevelConfig, QuizProgress } from '../../lib/quiz/types';

interface QuizLevelSelectorProps {
  title: string;
  description: string;
  levels: LevelConfig[];
  progress: QuizProgress;
  onSelectLevel: (levelId: number) => void;
}

export default function QuizLevelSelector({
  title,
  description,
  levels,
  progress,
  onSelectLevel,
}: QuizLevelSelectorProps) {
  const isLevelUnlocked = (levelId: number): boolean => {
    if (levelId === 0) return true;
    return progress.levels[levelId]?.unlocked || false;
  };

  const getLevelBestScore = (levelId: number): number => {
    return progress.levels[levelId]?.bestScore || 0;
  };

  const getLevelAttempts = (levelId: number): number => {
    return progress.levels[levelId]?.attempts || 0;
  };

  return (
    <div className="level-selector">
      <div className="level-selector-header">
        <h1 className="level-selector-title">{title}</h1>
        <p className="level-selector-description">{description}</p>
      </div>

      <div className="level-grid">
        {levels.map((level) => {
          const unlocked = isLevelUnlocked(level.id);
          const bestScore = getLevelBestScore(level.id);
          const attempts = getLevelAttempts(level.id);

          return (
            <button
              key={level.id}
              className={`level-card ${!unlocked ? 'locked' : ''}`}
              onClick={() => unlocked && onSelectLevel(level.id)}
              disabled={!unlocked}
            >
              <div className="level-card-header">
                <span className="level-name">{level.name}</span>
                <span className="level-icon">
                  {unlocked ? getDifficultyIcon(level.difficulty) : '🔒'}
                </span>
              </div>

              <p className="level-description">{level.description}</p>

              <div className="level-stats">
                {unlocked && attempts > 0 && (
                  <>
                    <div className="level-stat">
                      <span>Best:</span>
                      <span className="level-best-score">{bestScore}%</span>
                    </div>
                    <div className="level-stat">
                      <span>Attempts:</span>
                      <span>{attempts}</span>
                    </div>
                  </>
                )}
                {unlocked && attempts === 0 && (
                  <div className="level-stat">
                    <span>✨ Not attempted yet</span>
                  </div>
                )}
                {!unlocked && (
                  <div className="level-stat">
                    <span>🔒 Complete previous level to unlock</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {progress.totalQuestions > 0 && (
        <div style={{
          textAlign: 'center',
          marginTop: 'var(--spacing-xl)',
          padding: 'var(--spacing-lg)',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <h3 style={{ margin: '0 0 var(--spacing-sm) 0' }}>Overall Progress</h3>
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-xl)',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <div>
              <strong>Accuracy:</strong> {progress.overallAccuracy.toFixed(1)}%
            </div>
            <div>
              <strong>Total Questions:</strong> {progress.totalQuestions}
            </div>
            <div>
              <strong>Correct:</strong> {progress.totalCorrect}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getDifficultyIcon(difficulty: 'easy' | 'medium' | 'hard'): string {
  switch (difficulty) {
    case 'easy': return '⭐';
    case 'medium': return '⭐⭐';
    case 'hard': return '⭐⭐⭐';
  }
}

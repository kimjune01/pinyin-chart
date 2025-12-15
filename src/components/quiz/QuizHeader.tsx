/**
 * QuizHeader - Displays score, progress, and timer
 */

interface QuizHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  correctCount: number;
  timeElapsed?: number;
  onExit: () => void;
}

export default function QuizHeader({
  currentQuestion,
  totalQuestions,
  score,
  correctCount,
  timeElapsed,
  onExit,
}: QuizHeaderProps) {
  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="quiz-header">
      <div className="quiz-header-content">
        <div className="quiz-progress">
          <div className="quiz-stat">
            <span className="quiz-stat-label">Question</span>
            <span className="quiz-stat-value">
              {currentQuestion + 1}/{totalQuestions}
            </span>
          </div>

          <div className="quiz-stat">
            <span className="quiz-stat-label">Score</span>
            <span className="quiz-stat-value">{score}%</span>
          </div>

          <div className="quiz-stat">
            <span className="quiz-stat-label">Correct</span>
            <span className="quiz-stat-value">
              {correctCount}/{currentQuestion + 1}
            </span>
          </div>

          {timeElapsed !== undefined && (
            <div className="quiz-stat">
              <span className="quiz-stat-label">Time</span>
              <span className="quiz-stat-value">{formatTime(timeElapsed)}</span>
            </div>
          )}
        </div>

        <button className="quiz-exit-button" onClick={onExit}>
          Exit Quiz
        </button>
      </div>
    </div>
  );
}

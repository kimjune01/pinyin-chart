/**
 * BaseQuiz - Main quiz orchestrator component
 *
 * Manages quiz state and renders appropriate screens based on game state.
 * All quiz types use this component with different configurations.
 */

import { useEffect } from 'react';
import type { QuizConfig } from '../../lib/quiz/types';
import { useQuizEngine, useQuizProgress } from '../../lib/quiz/quizEngine';
import QuizLevelSelector from './QuizLevelSelector';
import QuizHeader from './QuizHeader';
import QuizGameArea from './QuizGameArea';
import QuizCompletionScreen from './QuizCompletionScreen';

interface BaseQuizProps {
  config: QuizConfig;
}

export default function BaseQuiz({ config }: BaseQuizProps) {
  const { progress, refresh } = useQuizProgress(config.id);

  const {
    gameState,
    session,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    correctCount,
    score,
    isAnswered,
    selectedAnswer,
    isCorrect,
    timeElapsed,

    startLevel,
    submitAnswer,
    nextQuestion,
    restartLevel,
    exitQuiz,

    levelResult,
  } = useQuizEngine(config);

  // Refresh progress when level completes
  useEffect(() => {
    if (gameState === 'levelComplete') {
      refresh();
    }
  }, [gameState, refresh]);

  // Loading state
  if (gameState === 'loading') {
    return (
      <div className="quiz-container">
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'var(--font-size-2xl)',
          color: 'var(--color-text-secondary)',
        }}>
          Loading questions...
        </div>
      </div>
    );
  }

  // Level selection screen
  if (gameState === 'idle') {
    return (
      <div className="quiz-container">
        <QuizLevelSelector
          title={config.name}
          description={config.description}
          levels={config.levels}
          progress={progress}
          onSelectLevel={startLevel}
        />
      </div>
    );
  }

  // Playing or answered state
  if ((gameState === 'playing' || gameState === 'answered') && currentQuestion && session) {
    return (
      <div className="quiz-container">
        <QuizHeader
          currentQuestion={currentQuestionIndex}
          totalQuestions={totalQuestions}
          score={score}
          correctCount={correctCount}
          timeElapsed={timeElapsed}
          onExit={exitQuiz}
        />

        <QuizGameArea
          question={currentQuestion}
          isAnswered={isAnswered}
          selectedAnswer={selectedAnswer}
          isCorrect={isCorrect}
          onSubmitAnswer={submitAnswer}
          onNextQuestion={nextQuestion}
        />
      </div>
    );
  }

  // Level complete screen
  if (gameState === 'levelComplete' && levelResult && session) {
    const currentLevelId = session.levelId;
    const hasNextLevel = currentLevelId < config.levels.length - 1;
    const nextLevelUnlocked = levelResult.nextLevelUnlocked;

    return (
      <div className="quiz-container">
        <QuizCompletionScreen
          result={levelResult}
          onNextLevel={hasNextLevel && nextLevelUnlocked ? () => startLevel(currentLevelId + 1) : undefined}
          onRetry={restartLevel}
          onExit={exitQuiz}
        />
      </div>
    );
  }

  // Fallback
  return (
    <div className="quiz-container">
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'var(--font-size-xl)',
        color: 'var(--color-text-secondary)',
      }}>
        Something went wrong. Please refresh.
      </div>
    </div>
  );
}

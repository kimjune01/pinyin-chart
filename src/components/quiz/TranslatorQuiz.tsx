/**
 * TranslatorQuiz - Sentence Translation Quiz Orchestrator
 *
 * Manages the multi-step sentence translation quiz state and renders
 * appropriate screens based on game state.
 */

import { useEffect, useState } from 'react';
import type { LevelConfig } from '../../lib/quiz/types';
import { useTranslatorQuizEngine, useTranslatorQuizProgress } from '../../lib/quiz/translatorQuizEngine';
import QuizLevelSelector from './QuizLevelSelector';
import QuizHeader from './QuizHeader';
import { TranslatorGameArea } from './TranslatorGameArea';
import QuizCompletionScreen from './QuizCompletionScreen';

// Level configurations for the translator quiz
const TRANSLATOR_LEVELS: LevelConfig[] = [
  {
    id: 0,
    name: 'Basic Statements',
    description: 'Simple "I am..." patterns with adjectives and nouns',
    questionCount: 5,
    optionCount: 4,
    difficulty: 'easy',
    unlockThreshold: 70,
  },
  {
    id: 1,
    name: 'More Patterns',
    description: 'Add verbs, possession, and more vocabulary',
    questionCount: 7,
    optionCount: 4,
    difficulty: 'easy',
    unlockThreshold: 75,
  },
  {
    id: 2,
    name: 'Expanded Vocabulary',
    description: 'Abilities, desires, and more complex sentences',
    questionCount: 8,
    optionCount: 4,
    difficulty: 'medium',
    unlockThreshold: 75,
  },
  {
    id: 3,
    name: 'All Statements',
    description: 'All statement patterns including location and going',
    questionCount: 10,
    optionCount: 4,
    difficulty: 'medium',
    unlockThreshold: 80,
  },
  {
    id: 4,
    name: 'Advanced',
    description: 'Exclamations and past tense patterns',
    questionCount: 10,
    optionCount: 4,
    difficulty: 'hard',
    unlockThreshold: 80,
  },
];

export default function TranslatorQuiz() {
  const [mounted, setMounted] = useState(false);
  const { progress, refresh } = useTranslatorQuizProgress();

  const {
    gameState,
    session,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    currentStepIndex,
    totalStepsInQuestion,
    revealedSlots,
    selectedAnswer,
    isCorrect,
    currentAttempts,
    displayMode,
    score,
    perfectQuestions,

    startLevel,
    submitStepAnswer,
    nextStep,
    setDisplayMode,
    restartLevel,
    exitQuiz,

    levelResult,
  } = useTranslatorQuizEngine(TRANSLATOR_LEVELS);

  // Set mounted after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Refresh progress when level completes
  useEffect(() => {
    if (gameState === 'levelComplete') {
      refresh();
    }
  }, [gameState, refresh]);

  // Show loading until mounted
  if (!mounted || gameState === 'loading') {
    return (
      <div className="quiz-container">
        <div className="quiz-loading">
          Loading sentences...
        </div>
      </div>
    );
  }

  // Level selection screen
  if (gameState === 'idle') {
    return (
      <div className="quiz-container">
        <QuizLevelSelector
          title="Sentence Translator"
          description="Listen to Chinese sentences and identify their meaning step by step. Guess each word, then the full sentence."
          levels={TRANSLATOR_LEVELS}
          progress={progress}
          onSelectLevel={startLevel}
        />
      </div>
    );
  }

  // Playing or answered state
  if ((gameState === 'playing' || gameState === 'answered') && currentQuestion && session) {
    return (
      <div className="quiz-container translator-quiz">
        <QuizHeader
          currentQuestion={currentQuestionIndex}
          totalQuestions={totalQuestions}
          score={score}
          correctCount={perfectQuestions}
          timeElapsed={0}
          onExit={exitQuiz}
        />

        <TranslatorGameArea
          question={currentQuestion}
          currentStepIndex={currentStepIndex}
          totalSteps={totalStepsInQuestion}
          revealedSlots={revealedSlots}
          selectedAnswer={selectedAnswer}
          isCorrect={isCorrect}
          currentAttempts={currentAttempts}
          displayMode={displayMode}
          onSubmitAnswer={submitStepAnswer}
          onNextStep={nextStep}
          onDisplayModeChange={setDisplayMode}
        />
      </div>
    );
  }

  // Level complete screen
  if (gameState === 'levelComplete' && levelResult && session) {
    const currentLevelId = session.levelId;
    const hasNextLevel = currentLevelId < TRANSLATOR_LEVELS.length - 1;
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
      <div className="quiz-error">
        Something went wrong. Please refresh.
      </div>
    </div>
  );
}

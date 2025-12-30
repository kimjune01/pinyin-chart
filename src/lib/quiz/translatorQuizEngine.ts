/**
 * Translator Quiz Engine
 *
 * React hook that manages multi-step sentence translation quiz state.
 * Each question has multiple steps (guess each constituent, then the full sentence).
 * Uses retry-until-correct logic for each step.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { LevelConfig, GameState, LevelResult } from './types';
import type {
  TranslatorQuestion,
  TranslatorSession,
  TranslatorStepProgress,
  SentenceDisplayMode,
  TranslatorEngineState,
  TranslatorEngineActions,
} from './translatorTypes';
import { generateTranslatorQuestions } from './translatorQuestionGenerator';
import { updateLevelProgress, loadQuizProgress } from './progressStorage';
import { audioService } from '../audio/AudioService';

const QUIZ_ID = 'sentence-translator';

export interface UseTranslatorQuizEngineReturn extends TranslatorEngineState, TranslatorEngineActions {
  levelResult: LevelResult | null;
  config: { levels: LevelConfig[] };
}

/**
 * Translator Quiz Engine Hook
 */
export function useTranslatorQuizEngine(
  levels: LevelConfig[]
): UseTranslatorQuizEngineReturn {
  // Core state
  const [gameState, setGameState] = useState<GameState>('idle');
  const [session, setSession] = useState<TranslatorSession | null>(null);
  const [levelResult, setLevelResult] = useState<LevelResult | null>(null);

  // Multi-step state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepProgress, setStepProgress] = useState<TranslatorStepProgress[]>([]);
  const [revealedSlots, setRevealedSlots] = useState<string[]>([]);

  // Answer state
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentAttempts, setCurrentAttempts] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Ref to track wrong answer timeout for cleanup
  const wrongAnswerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Display mode
  const [displayMode, setDisplayMode] = useState<SentenceDisplayMode>('visual-audio');

  // Scoring
  const [totalStepsCompleted, setTotalStepsCompleted] = useState(0);
  const [totalStepsAttempted, setTotalStepsAttempted] = useState(0);
  const [perfectQuestions, setPerfectQuestions] = useState(0); // Questions with all steps correct on first try
  const [currentQuestionPerfect, setCurrentQuestionPerfect] = useState(true); // Track if current question is still perfect

  // Timing
  const [startTime, setStartTime] = useState(0);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (wrongAnswerTimeoutRef.current) {
        clearTimeout(wrongAnswerTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Start a level
   */
  const startLevel = useCallback(async (levelId: number) => {
    // Clear any pending timeout
    if (wrongAnswerTimeoutRef.current) {
      clearTimeout(wrongAnswerTimeoutRef.current);
      wrongAnswerTimeoutRef.current = null;
    }

    setGameState('loading');
    setLevelResult(null);
    setIsProcessing(false);

    try {
      const level = levels.find(l => l.id === levelId);
      if (!level) {
        throw new Error(`Level ${levelId} not found`);
      }

      // Generate questions
      const questions = await generateTranslatorQuestions(level, level.questionCount);

      // Create session
      const newSession: TranslatorSession = {
        quizId: QUIZ_ID,
        levelId,
        questions,
        currentQuestionIndex: 0,
        totalQuestions: questions.length,
        questionsCompleted: 0,
        startTime: Date.now(),
        displayMode,
      };

      // Initialize step progress for first question
      const firstQuestion = questions[0];
      const initialStepProgress: TranslatorStepProgress[] = firstQuestion.steps.map(step => ({
        stepId: step.id,
        completed: false,
        attempts: 0,
        selectedAnswer: null,
        isCorrect: null,
      }));

      setSession(newSession);
      setStepProgress(initialStepProgress);
      setCurrentStepIndex(0);
      setRevealedSlots([]);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setCurrentAttempts(0);
      setTotalStepsCompleted(0);
      setTotalStepsAttempted(0);
      setPerfectQuestions(0);
      setCurrentQuestionPerfect(true);
      setStartTime(Date.now());
      setGameState('playing');

      // Audio is handled by TranslatorGameArea component
    } catch (error) {
      console.error('[translatorQuizEngine] Error starting level:', error);
      setGameState('idle');
    }
  }, [levels, displayMode]);

  /**
   * Submit an answer for the current step
   * Uses retry-until-correct logic
   */
  const submitStepAnswer = useCallback((answer: string) => {
    if (!session || gameState !== 'playing' || isProcessing) return;

    const currentQuestion = session.questions[session.currentQuestionIndex];
    if (!currentQuestion) return;

    const currentStep = currentQuestion.steps[currentStepIndex];
    if (!currentStep) return;

    // Clear any pending wrong answer timeout
    if (wrongAnswerTimeoutRef.current) {
      clearTimeout(wrongAnswerTimeoutRef.current);
      wrongAnswerTimeoutRef.current = null;
    }

    const correct = answer === currentStep.correctAnswer;
    const attempts = currentAttempts + 1;

    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setCurrentAttempts(attempts);
    setTotalStepsAttempted(prev => prev + 1);

    // Update step progress
    const updatedStepProgress = [...stepProgress];
    updatedStepProgress[currentStepIndex] = {
      ...updatedStepProgress[currentStepIndex],
      attempts,
      selectedAnswer: answer,
      isCorrect: correct,
      completed: correct,
    };
    setStepProgress(updatedStepProgress);

    if (correct) {
      // Mark step as completed
      setTotalStepsCompleted(prev => prev + 1);

      // Add to revealed slots (for non-structure steps)
      if (!currentStep.isStructureStep) {
        setRevealedSlots(prev => [...prev, currentStep.slotId]);
      }

      setGameState('answered');
    } else {
      // Wrong answer - mark question as imperfect
      setCurrentQuestionPerfect(false);

      // Show feedback but stay on same step
      // Block new submissions during feedback
      setIsProcessing(true);

      // Reset after delay so user can retry
      wrongAnswerTimeoutRef.current = setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        setIsProcessing(false);
        wrongAnswerTimeoutRef.current = null;
      }, 1000);
    }
  }, [session, gameState, currentStepIndex, currentAttempts, stepProgress, isProcessing]);

  /**
   * Complete the current level
   */
  const completeLevel = useCallback((finalPerfectCount: number) => {
    if (!session) return;

    const level = levels.find(l => l.id === session.levelId);
    if (!level) return;

    // Calculate results
    // Score is based on perfect questions (all steps correct on first try)
    const totalQs = session.questions.length;
    const score = Math.round((finalPerfectCount / totalQs) * 100);
    const passed = score >= level.unlockThreshold;

    // Calculate average time per question
    const totalTime = Date.now() - startTime;
    const averageTime = totalTime / totalQs;

    const result: LevelResult = {
      levelId: session.levelId,
      totalQuestions: totalQs,
      correctAnswers: finalPerfectCount, // Questions with all steps correct on first try
      score,
      accuracy: score,
      averageTime,
      passed,
      nextLevelUnlocked: passed && session.levelId < levels.length - 1,
    };

    // Save progress
    updateLevelProgress(QUIZ_ID, session.levelId, result);

    setLevelResult(result);
    setGameState('levelComplete');
  }, [session, levels, startTime]);

  /**
   * Move to the next question or complete the level
   */
  const nextQuestion = useCallback(() => {
    if (!session) return;

    // Clear any pending timeout
    if (wrongAnswerTimeoutRef.current) {
      clearTimeout(wrongAnswerTimeoutRef.current);
      wrongAnswerTimeoutRef.current = null;
    }

    // Count this question as perfect if all steps were correct on first try
    const newPerfectCount = currentQuestionPerfect ? perfectQuestions + 1 : perfectQuestions;
    if (currentQuestionPerfect) {
      setPerfectQuestions(newPerfectCount);
    }

    const nextQuestionIdx = session.currentQuestionIndex + 1;

    if (nextQuestionIdx >= session.questions.length) {
      // Level complete - pass the updated perfect count
      completeLevel(newPerfectCount);
    } else {
      // Next question
      const nextQ = session.questions[nextQuestionIdx];

      // Initialize step progress for new question
      const newStepProgress: TranslatorStepProgress[] = nextQ.steps.map(step => ({
        stepId: step.id,
        completed: false,
        attempts: 0,
        selectedAnswer: null,
        isCorrect: null,
      }));

      setSession({
        ...session,
        currentQuestionIndex: nextQuestionIdx,
        questionsCompleted: session.questionsCompleted + 1,
      });
      setStepProgress(newStepProgress);
      setCurrentStepIndex(0);
      setRevealedSlots([]);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setCurrentAttempts(0);
      setIsProcessing(false);
      setCurrentQuestionPerfect(true); // Reset for new question
      setGameState('playing');

      // Audio is handled by TranslatorGameArea component
    }
  }, [session, currentQuestionPerfect, perfectQuestions, completeLevel]);

  /**
   * Move to the next step or next question
   */
  const nextStep = useCallback(() => {
    if (!session) return;

    // Clear any pending timeout
    if (wrongAnswerTimeoutRef.current) {
      clearTimeout(wrongAnswerTimeoutRef.current);
      wrongAnswerTimeoutRef.current = null;
    }

    const currentQuestion = session.questions[session.currentQuestionIndex];
    if (!currentQuestion) return;

    const nextStepIdx = currentStepIndex + 1;

    if (nextStepIdx >= currentQuestion.steps.length) {
      // All steps complete, move to next question
      nextQuestion();
    } else {
      // Move to next step
      setCurrentStepIndex(nextStepIdx);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setCurrentAttempts(0);
      setIsProcessing(false);
      setGameState('playing');
    }
  }, [session, currentStepIndex, nextQuestion]);

  /**
   * Restart the current level
   */
  const restartLevel = useCallback(() => {
    if (session) {
      startLevel(session.levelId);
    }
  }, [session, startLevel]);

  /**
   * Exit quiz and return to level selection
   */
  const exitQuiz = useCallback(() => {
    // Clear any pending timeout
    if (wrongAnswerTimeoutRef.current) {
      clearTimeout(wrongAnswerTimeoutRef.current);
      wrongAnswerTimeoutRef.current = null;
    }

    setSession(null);
    setGameState('idle');
    setStepProgress([]);
    setCurrentStepIndex(0);
    setRevealedSlots([]);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setCurrentAttempts(0);
    setIsProcessing(false);
    setLevelResult(null);
    audioService.stop();
  }, []);

  /**
   * Play audio for the current question
   */
  const playAudio = useCallback(() => {
    if (!session) return;
    const currentQuestion = session.questions[session.currentQuestionIndex];
    if (currentQuestion) {
      playQuestionAudio(currentQuestion);
    }
  }, [session]);

  /**
   * Play audio for a question (full sentence)
   */
  const playQuestionAudio = async (question: TranslatorQuestion) => {
    try {
      // Use TTS for full sentence
      await audioService.playVocabulary(question.fullHanzi);
    } catch (error) {
      console.error('[translatorQuizEngine] Error playing audio:', error);
    }
  };

  // Derived state
  const currentQuestion = session?.questions[session.currentQuestionIndex] || null;
  const currentQuestionIndex = session?.currentQuestionIndex ?? 0;
  const totalQuestions = session?.questions.length ?? 0;
  const totalStepsInQuestion = currentQuestion?.steps.length ?? 0;

  // Score is based on perfect questions (all steps correct on first try)
  const questionsAttempted = currentQuestionIndex; // Questions we've moved past
  const score = questionsAttempted > 0
    ? Math.round((perfectQuestions / questionsAttempted) * 100)
    : 0;

  return {
    // State
    gameState,
    session,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    currentStepIndex,
    totalStepsInQuestion,
    stepProgress,
    revealedSlots,
    selectedAnswer,
    isCorrect,
    currentAttempts,
    displayMode,
    score,
    perfectQuestions, // Questions with all steps correct on first try
    totalStepsCompleted,
    totalStepsAttempted,

    // Actions
    startLevel,
    submitStepAnswer,
    nextStep,
    nextQuestion,
    setDisplayMode,
    restartLevel,
    exitQuiz,
    playAudio,

    // Result
    levelResult,
    config: { levels },
  };
}

/**
 * Helper hook: Get translator quiz progress
 */
export function useTranslatorQuizProgress() {
  const [progress, setProgress] = useState(() => loadQuizProgress(QUIZ_ID));

  // Load from localStorage after hydration
  useEffect(() => {
    setProgress(loadQuizProgress(QUIZ_ID));
  }, []);

  const refresh = useCallback(() => {
    setProgress(loadQuizProgress(QUIZ_ID));
  }, []);

  return { progress, refresh };
}

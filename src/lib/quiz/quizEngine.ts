/**
 * Quiz Engine
 *
 * React hook that manages quiz state and logic.
 * Provides a state machine for quiz flow.
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  QuizConfig,
  QuizSession,
  QuizProgress,
  Question,
  QuizAnswer,
  GameState,
  LevelResult,
} from './types';
import { updateLevelProgress, loadQuizProgress } from './progressStorage';
import { audioService } from '../audio/AudioService';

export interface UseQuizEngineReturn {
  // State
  gameState: GameState;
  session: QuizSession | null;
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  correctCount: number;
  score: number;
  isAnswered: boolean;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  timeElapsed: number;

  // Actions
  startLevel: (levelId: number) => Promise<void>;
  submitAnswer: (answer: string) => void;
  nextQuestion: () => void;
  restartLevel: () => void;
  exitQuiz: () => void;

  // Level result (available when level is complete)
  levelResult: LevelResult | null;
}

/**
 * Main quiz engine hook
 */
export function useQuizEngine(config: QuizConfig): UseQuizEngineReturn {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [session, setSession] = useState<QuizSession | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [levelResult, setLevelResult] = useState<LevelResult | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  // Timer for tracking time elapsed
  useEffect(() => {
    if (gameState === 'playing' && questionStartTime > 0) {
      const interval = setInterval(() => {
        setTimeElapsed(Date.now() - questionStartTime);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [gameState, questionStartTime]);

  /**
   * Start a level
   */
  const startLevel = useCallback(async (levelId: number) => {
    setGameState('loading');
    setLevelResult(null);

    try {
      const level = config.levels.find(l => l.id === levelId);
      if (!level) {
        throw new Error(`Level ${levelId} not found`);
      }

      // Generate questions
      const questions = await config.generateQuestions(level, level.questionCount);

      // Preload first question audio
      if (questions[0]) {
        audioService.preload([extractPinyinFromUrl(questions[0].audioUrl)]);
      }

      // Create session
      const newSession: QuizSession = {
        quizId: config.id,
        levelId,
        questions,
        currentQuestionIndex: 0,
        answers: [],
        score: 0,
        correctCount: 0,
        startTime: Date.now(),
        gameState: 'playing',
      };

      setSession(newSession);
      setGameState('playing');
      setQuestionStartTime(Date.now());
      setSelectedAnswer(null);
      setIsCorrect(null);
      setTimeElapsed(0);

      // Auto-play first question audio (skip for visual-silent quizzes)
      if (questions[0] && questions[0].displayType !== 'visual-silent') {
        await playQuestionAudio(questions[0]);
      }
    } catch (error) {
      console.error('[quizEngine] Error starting level:', error);
      setGameState('idle');
    }
  }, [config]);

  /**
   * Submit an answer
   */
  const submitAnswer = useCallback((answer: string) => {
    if (!session || gameState !== 'playing') return;

    const currentQuestion = session.questions[session.currentQuestionIndex];
    if (!currentQuestion) return;

    const timeSpent = Date.now() - questionStartTime;
    const correct = answer === currentQuestion.correctAnswer;

    // Create answer record
    const quizAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: answer,
      isCorrect: correct,
      timeSpent,
    };

    // Update session
    const updatedSession: QuizSession = {
      ...session,
      answers: [...session.answers, quizAnswer],
      correctCount: session.correctCount + (correct ? 1 : 0),
    };

    // Calculate score
    updatedSession.score = Math.round(
      (updatedSession.correctCount / (session.currentQuestionIndex + 1)) * 100
    );

    setSession(updatedSession);
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setGameState('answered');

    // Auto-advance after delay (or user can click next)
  }, [session, gameState, questionStartTime]);

  /**
   * Move to next question or complete level
   */
  const nextQuestion = useCallback(() => {
    if (!session) return;

    const nextIndex = session.currentQuestionIndex + 1;

    if (nextIndex >= session.questions.length) {
      // Level complete
      completeLevel(session);
    } else {
      // Next question
      const updatedSession: QuizSession = {
        ...session,
        currentQuestionIndex: nextIndex,
      };

      setSession(updatedSession);
      setGameState('playing');
      setQuestionStartTime(Date.now());
      setSelectedAnswer(null);
      setIsCorrect(null);
      setTimeElapsed(0);

      // Preload next question audio (if exists)
      const nextQuestion = session.questions[nextIndex + 1];
      if (nextQuestion) {
        audioService.preload([extractPinyinFromUrl(nextQuestion.audioUrl)]);
      }

      // Auto-play current question audio (skip for visual-silent quizzes)
      const currentQuestion = session.questions[nextIndex];
      if (currentQuestion && currentQuestion.displayType !== 'visual-silent') {
        playQuestionAudio(currentQuestion);
      }
    }
  }, [session]);

  /**
   * Complete the current level
   */
  const completeLevel = useCallback((completedSession: QuizSession) => {
    const level = config.levels.find(l => l.id === completedSession.levelId);
    if (!level) return;

    // Calculate results
    const totalQuestions = completedSession.questions.length;
    const correctAnswers = completedSession.correctCount;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= level.unlockThreshold;

    // Calculate average time
    const totalTime = completedSession.answers.reduce((sum, a) => sum + a.timeSpent, 0);
    const averageTime = totalTime / totalQuestions;

    const result: LevelResult = {
      levelId: completedSession.levelId,
      totalQuestions,
      correctAnswers,
      score,
      accuracy: score,
      averageTime,
      passed,
      nextLevelUnlocked: passed && completedSession.levelId < config.levels.length - 1,
    };

    // Save progress
    updateLevelProgress(config.id, completedSession.levelId, result);

    setLevelResult(result);
    setGameState('levelComplete');
  }, [config]);

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
    setSession(null);
    setGameState('idle');
    setSelectedAnswer(null);
    setIsCorrect(null);
    setLevelResult(null);
    setTimeElapsed(0);
    audioService.stop();
  }, []);

  /**
   * Play audio for a question
   */
  const playQuestionAudio = async (question: Question) => {
    try {
      // For HSK words with hanzi, use vocabulary audio (CDN with Web Speech fallback)
      if (question.hanzi) {
        await audioService.playVocabulary(question.hanzi);
      }
      // For multi-syllable words without hanzi, play syllables in sequence
      else if (question.syllable?.includes(',')) {
        const syllables = question.syllable.split(',');
        await audioService.playSequence(syllables);
      }
      // For single syllable questions
      else {
        const pinyin = extractPinyinFromUrl(question.audioUrl);
        await audioService.play(pinyin);
      }
    } catch (error) {
      console.error('[quizEngine] Error playing question audio:', error);
    }
  };

  // Derived state
  const currentQuestion = session?.questions[session.currentQuestionIndex] || null;
  const currentQuestionIndex = session?.currentQuestionIndex ?? 0;
  const totalQuestions = session?.questions.length ?? 0;
  const correctCount = session?.correctCount ?? 0;
  const score = session?.score ?? 0;
  const isAnswered = gameState === 'answered';

  return {
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
  };
}

/**
 * Helper: Extract pinyin from audio URL
 * e.g., ".../ma1.mp3" => "ma1"
 */
function extractPinyinFromUrl(url: string): string {
  const match = url.match(/([^/]+)\.mp3$/);
  return match ? match[1] : '';
}

/**
 * Helper hook: Get quiz progress
 * Defers localStorage read until after hydration to avoid SSR mismatch
 */
export function useQuizProgress(quizId: string) {
  const [progress, setProgress] = useState<QuizProgress>(() => ({
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
        lastAttempt: '',
        unlocked: true,
      },
    },
    totalAttempts: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    overallAccuracy: 0,
  }));

  // Load from localStorage after hydration
  useEffect(() => {
    setProgress(loadQuizProgress(quizId));
  }, [quizId]);

  const refresh = useCallback(() => {
    setProgress(loadQuizProgress(quizId));
  }, [quizId]);

  return { progress, refresh };
}

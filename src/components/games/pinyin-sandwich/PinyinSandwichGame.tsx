/**
 * PinyinSandwichGame - Build a pinyin sandwich by selecting initial, final, and tone
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { audioService } from '../../../lib/audio/AudioService';
import { addToneMarks } from '../../../lib/utils/pinyinUtils';
import SandwichStack from './SandwichStack';
import IngredientPanel from './IngredientPanel';
import {
  generateQuestion,
  checkAnswer,
  DIFFICULTY_CONFIGS,
  type Difficulty,
  type SandwichQuestion,
} from './sandwichEngine';

// Types
type GameState = 'menu' | 'playing' | 'checking' | 'success' | 'failure' | 'levelComplete';
type AnimationState = 'idle' | 'building' | 'complete' | 'shipping' | 'falling' | 'reset';

// Storage keys
const STORAGE_KEYS = {
  highScore: 'pinyin-sandwich-highscore',
  difficulty: 'pinyin-sandwich-difficulty',
};

// Helper functions for localStorage
function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail
  }
}

export default function PinyinSandwichGame() {
  // Game state
  const [gameState, setGameState] = useState<GameState>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentQuestion, setCurrentQuestion] = useState<SandwichQuestion | null>(null);
  const [selectedInitial, setSelectedInitial] = useState<string | null>(null);
  const [selectedFinal, setSelectedFinal] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Track recent syllables to avoid repetition
  const recentSyllables = useRef<string[]>([]);

  // Load settings on mount
  useEffect(() => {
    setHighScore(loadFromStorage(STORAGE_KEYS.highScore, 0));
    setDifficulty(loadFromStorage(STORAGE_KEYS.difficulty, 'easy'));
  }, []);

  // Save difficulty when it changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.difficulty, difficulty);
  }, [difficulty]);

  // Play audio
  const playAudio = useCallback(async () => {
    if (!currentQuestion || isPlaying) return;
    setIsPlaying(true);
    try {
      await audioService.play(`${currentQuestion.syllable.pinyin}${currentQuestion.tone}`);
    } catch (error) {
      console.error('Audio error:', error);
    } finally {
      setIsPlaying(false);
    }
  }, [currentQuestion, isPlaying]);

  // Start game
  const startGame = useCallback(() => {
    recentSyllables.current = [];
    setScore(0);
    setQuestionsAnswered(0);
    setSelectedInitial(null);
    setSelectedFinal(null);
    setSelectedTone(null);
    setShowFeedback(false);
    setAnimationState('idle');

    const question = generateQuestion(difficulty, recentSyllables.current);
    recentSyllables.current.push(question.syllable.pinyin);
    setCurrentQuestion(question);
    setGameState('playing');

    // Auto-play audio after a short delay
    setTimeout(async () => {
      try {
        await audioService.play(`${question.syllable.pinyin}${question.tone}`);
      } catch (error) {
        console.error('Audio error:', error);
      }
    }, 500);
  }, [difficulty]);

  // Handle selection
  const handleSelectInitial = useCallback((value: string | number) => {
    if (gameState !== 'playing') return;
    setSelectedInitial(String(value));
    setAnimationState('building');
  }, [gameState]);

  const handleSelectFinal = useCallback((value: string | number) => {
    if (gameState !== 'playing') return;
    setSelectedFinal(String(value));
    setAnimationState('building');
  }, [gameState]);

  const handleSelectTone = useCallback((value: string | number) => {
    if (gameState !== 'playing') return;
    setSelectedTone(Number(value));
    setAnimationState('building');
  }, [gameState]);

  // Check if all selections are made
  const allSelected = selectedInitial !== null && selectedFinal !== null && selectedTone !== null;

  // Submit answer
  const submitAnswer = useCallback(() => {
    if (!currentQuestion || !allSelected) return;

    setGameState('checking');
    setAnimationState('complete');

    const result = checkAnswer(currentQuestion, selectedInitial, selectedFinal, selectedTone);
    setShowFeedback(true);

    setTimeout(() => {
      if (result.correct) {
        setScore(prev => prev + 1);
        setAnimationState('shipping');
        setGameState('success');
      } else {
        setAnimationState('falling');
        setGameState('failure');
      }
    }, 500);
  }, [currentQuestion, selectedInitial, selectedFinal, selectedTone, allSelected]);

  // Handle animation end
  const handleAnimationEnd = useCallback(() => {
    if (animationState === 'shipping' || animationState === 'falling') {
      const config = DIFFICULTY_CONFIGS[difficulty];
      const newQuestionsAnswered = questionsAnswered + 1;
      setQuestionsAnswered(newQuestionsAnswered);

      // Check if level complete
      if (animationState === 'shipping' && newQuestionsAnswered >= config.questionsPerRound) {
        // Update high score
        const newScore = score + 1;
        if (newScore > highScore) {
          setHighScore(newScore);
          saveToStorage(STORAGE_KEYS.highScore, newScore);
        }
        setGameState('levelComplete');
        return;
      }

      // Next question
      setTimeout(() => {
        setSelectedInitial(null);
        setSelectedFinal(null);
        setSelectedTone(null);
        setShowFeedback(false);
        setAnimationState('reset');

        setTimeout(() => {
          const question = generateQuestion(difficulty, recentSyllables.current.slice(-5));
          recentSyllables.current.push(question.syllable.pinyin);
          setCurrentQuestion(question);
          setAnimationState('idle');
          setGameState('playing');

          // Auto-play audio
          setTimeout(async () => {
            try {
              await audioService.play(`${question.syllable.pinyin}${question.tone}`);
            } catch (error) {
              console.error('Audio error:', error);
            }
          }, 300);
        }, 300);
      }, animationState === 'falling' ? 800 : 200);
    }
  }, [animationState, difficulty, questionsAnswered, score, highScore]);

  // Retry after failure
  const retry = useCallback(() => {
    setSelectedInitial(null);
    setSelectedFinal(null);
    setSelectedTone(null);
    setShowFeedback(false);
    setAnimationState('idle');
    setGameState('playing');

    // Replay audio
    setTimeout(() => playAudio(), 300);
  }, [playAudio]);

  // Return to menu
  const returnToMenu = useCallback(() => {
    setGameState('menu');
    setCurrentQuestion(null);
    setSelectedInitial(null);
    setSelectedFinal(null);
    setSelectedTone(null);
    setShowFeedback(false);
    setAnimationState('idle');
  }, []);

  // Get status message
  const getStatusMessage = (): string => {
    switch (gameState) {
      case 'menu':
        return 'Select difficulty and start!';
      case 'playing':
        return 'Listen and build the sandwich!';
      case 'checking':
        return 'Checking...';
      case 'success':
        return 'Correct! Great job!';
      case 'failure':
        return `Oops! It was: ${currentQuestion ? addToneMarks(currentQuestion.syllable.pinyin, currentQuestion.tone) : ''}`;
      case 'levelComplete':
        return `Round Complete! Score: ${score}/${DIFFICULTY_CONFIGS[difficulty].questionsPerRound}`;
      default:
        return '';
    }
  };

  // Get score emoji based on percentage
  const getScoreEmoji = (): string => {
    const total = DIFFICULTY_CONFIGS[difficulty].questionsPerRound;
    const percentage = (score / total) * 100;

    if (percentage === 100) return '🤩'; // Perfect
    if (percentage >= 80) return '😄';   // Great
    if (percentage >= 60) return '🙂';   // Good
    if (percentage >= 40) return '😐';   // Okay
    if (percentage >= 20) return '😕';   // Needs work
    return '😢';                          // Keep practicing
  };

  return (
    <div className="sandwich-container">
      {/* Menu Screen */}
      {gameState === 'menu' && (
        <div className="sandwich-menu">
          <h2 className="sandwich-title">Pinyin Sandwich</h2>
          <p className="sandwich-subtitle">Build sandwiches by identifying Initial, Final, and Tone!</p>

          {/* Difficulty Selection */}
          <div className="sandwich-setting-group">
            <h3>Difficulty</h3>
            <div className="sandwich-buttons-row">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  className={`sandwich-option-btn ${difficulty === d ? 'active' : ''}`}
                  onClick={() => setDifficulty(d)}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
            <p className="sandwich-hint">
              {difficulty === 'easy' && `${DIFFICULTY_CONFIGS.easy.questionsPerRound} questions, ${DIFFICULTY_CONFIGS.easy.initialCount} options each, common syllables`}
              {difficulty === 'medium' && `${DIFFICULTY_CONFIGS.medium.questionsPerRound} questions, ${DIFFICULTY_CONFIGS.medium.initialCount} options each, confusing options`}
              {difficulty === 'hard' && `${DIFFICULTY_CONFIGS.hard.questionsPerRound} questions, ${DIFFICULTY_CONFIGS.hard.initialCount} options each, all syllables`}
            </p>
          </div>

          {/* High Score */}
          {highScore > 0 && (
            <div className="sandwich-high-score">
              Best Score: <span>{highScore}</span>
            </div>
          )}

          {/* Start Button */}
          <button className="sandwich-start-btn" onClick={startGame}>
            Start Game
          </button>
        </div>
      )}

      {/* Level Complete Screen */}
      {gameState === 'levelComplete' && (
        <div className="sandwich-game">
          {/* Stopped Conveyor Belt */}
          <div className="conveyor-container">
            <div className="conveyor-belt stopped">
              <div className="conveyor-stripes" />
            </div>
            <div className="conveyor-rail conveyor-rail-left" />
            <div className="conveyor-rail conveyor-rail-right" />
          </div>

          {/* Score Display */}
          <div className="sandwich-complete-screen">
            <div className="score-emoji">{getScoreEmoji()}</div>
            <h2 className="complete-title">Round Complete!</h2>
            <div className="complete-score">
              {score} / {DIFFICULTY_CONFIGS[difficulty].questionsPerRound}
            </div>
            <div className="sandwich-complete-actions">
              <button className="sandwich-start-btn" onClick={startGame}>
                Play Again
              </button>
              <button className="sandwich-menu-btn" onClick={returnToMenu}>
                Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Screen */}
      {gameState !== 'menu' && gameState !== 'levelComplete' && currentQuestion && (
        <div className="sandwich-game">
          {/* Header */}
          <div className="sandwich-header">
            <div className="sandwich-score">
              Score: <span>{score}</span>
              <span className="sandwich-progress"> | {questionsAnswered + 1}/{DIFFICULTY_CONFIGS[difficulty].questionsPerRound}</span>
            </div>
            <button className="sandwich-menu-btn" onClick={returnToMenu}>Menu</button>
          </div>

          {/* Sandwich Visual */}
          <SandwichStack
            initial={selectedInitial}
            final={selectedFinal}
            tone={selectedTone}
            basePinyin={currentQuestion.syllable.pinyin}
            animationState={animationState}
            onAnimationEnd={handleAnimationEnd}
          />

          {/* Audio Button */}
          <button
            className={`sandwich-audio-btn ${isPlaying ? 'playing' : ''}`}
            onClick={playAudio}
            disabled={isPlaying || gameState === 'checking'}
          >
            {isPlaying ? '🔊 Playing...' : '🔊 Play Sound'}
          </button>

          {/* Selection Panels */}
          <div className="sandwich-panels">
            <IngredientPanel
              type="initial"
              label="Initial"
              options={currentQuestion.initialOptions}
              selected={selectedInitial}
              onSelect={handleSelectInitial}
              disabled={gameState !== 'playing'}
              correctValue={showFeedback ? currentQuestion.syllable.initial : null}
              showFeedback={showFeedback}
            />
            <IngredientPanel
              type="final"
              label="Final"
              options={currentQuestion.finalOptions}
              selected={selectedFinal}
              onSelect={handleSelectFinal}
              disabled={gameState !== 'playing'}
              correctValue={showFeedback ? currentQuestion.syllable.final : null}
              showFeedback={showFeedback}
            />
            <IngredientPanel
              type="tone"
              label="Tone"
              options={currentQuestion.toneOptions}
              selected={selectedTone}
              onSelect={handleSelectTone}
              disabled={gameState !== 'playing'}
              correctValue={showFeedback ? currentQuestion.tone : null}
              showFeedback={showFeedback}
            />
          </div>

          {/* Submit / Retry Button */}
          <div className="sandwich-actions">
            {gameState === 'playing' && (
              <button
                className="sandwich-submit-btn"
                onClick={submitAnswer}
                disabled={!allSelected}
              >
                Submit
              </button>
            )}
            {gameState === 'failure' && (
              <button className="sandwich-retry-btn" onClick={retry}>
                Try Again
              </button>
            )}
          </div>

          {/* Status Message */}
          <div className={`sandwich-status ${gameState}`}>
            {getStatusMessage()}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * TranslatorGameArea - Multi-step sentence translation game display
 *
 * Shows the sentence being translated, current step options,
 * and progress through the multi-step translation process.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { TranslatorQuestion, TranslatorStep, SentenceDisplayMode } from '../../lib/quiz/translatorTypes';
import { DisplayModeToggle } from './DisplayModeToggle';
import { SentenceDisplay } from './SentenceDisplay';
import { audioService } from '../../lib/audio/AudioService';

interface TranslatorGameAreaProps {
  question: TranslatorQuestion;
  currentStepIndex: number;
  totalSteps: number;
  revealedSlots: string[];
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  currentAttempts: number;
  displayMode: SentenceDisplayMode;
  onSubmitAnswer: (answer: string) => void;
  onNextStep: () => void;
  onDisplayModeChange: (mode: SentenceDisplayMode) => void;
}

const AUTO_ADVANCE_DELAY = 1200; // ms

export function TranslatorGameArea({
  question,
  currentStepIndex,
  totalSteps,
  revealedSlots,
  selectedAnswer,
  isCorrect,
  currentAttempts,
  displayMode,
  onSubmitAnswer,
  onNextStep,
  onDisplayModeChange,
}: TranslatorGameAreaProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingMode, setPlayingMode] = useState<'sentence' | 'syllables' | null>(null);
  const [showWrongFeedback, setShowWrongFeedback] = useState(false);
  const syllableAbortRef = useRef(false);

  const currentStep = question.steps[currentStepIndex];
  const isAnswered = isCorrect === true;

  // Reset feedback when step changes
  useEffect(() => {
    setShowWrongFeedback(false);
  }, [currentStepIndex, question.id]);

  // Show wrong feedback briefly
  useEffect(() => {
    if (isCorrect === false) {
      setShowWrongFeedback(true);
      const timer = setTimeout(() => setShowWrongFeedback(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isCorrect, currentAttempts]);

  // Auto-advance after correct answer
  useEffect(() => {
    if (isCorrect === true) {
      const timer = setTimeout(onNextStep, AUTO_ADVANCE_DELAY);
      return () => clearTimeout(timer);
    }
  }, [isCorrect, onNextStep]);

  // Stop syllable playback when question changes
  useEffect(() => {
    syllableAbortRef.current = true;
    return () => {
      syllableAbortRef.current = true;
    };
  }, [question.id]);

  // Play audio when question changes (if in audio mode)
  useEffect(() => {
    if (displayMode !== 'visual-only') {
      // Small delay to ensure abort flag is reset
      setTimeout(() => {
        syllableAbortRef.current = false;
        handlePlaySentence();
      }, 100);
    }
  }, [question.id]);

  // Play full sentence
  const handlePlaySentence = useCallback(async () => {
    if (isPlaying) return;

    setIsPlaying(true);
    setPlayingMode('sentence');
    try {
      await audioService.playVocabulary(question.fullHanzi);
    } catch (error) {
      console.error('Error playing sentence audio:', error);
    } finally {
      setTimeout(() => {
        setIsPlaying(false);
        setPlayingMode(null);
      }, 300);
    }
  }, [question.fullHanzi, isPlaying]);

  // Build sentence parts for syllable playback (includes connectors and suffixes)
  const buildSentenceParts = useCallback(() => {
    const parts: string[] = [];

    // Get slot order from steps
    const stepSlots = question.steps
      .filter(s => !s.isStructureStep)
      .map(s => s.slotId);

    // Connector map for each pattern/slot combination
    const connectors: Record<string, Record<string, string>> = {
      'adj-pattern': { adjective: '很' },
      'noun-pattern': { noun: '是' },
      'go-pattern': { place: '想去' },
      'location-pattern': { place: '在' },
      'have-pattern': { object: '有' },
      'can-pattern': { skill: '会' },
      'want-pattern': { verb: '想' },
      'too-pattern': { adjective: '太' },
    };

    // Suffixes for each pattern
    const suffixes: Record<string, string> = {
      'too-pattern': '了',
      'past-pattern': '了',
      'q-permission': '吗',
    };

    for (const slotId of stepSlots) {
      const word = question.selectedWords[slotId];
      if (!word) continue;

      // Add connector if present
      const connector = connectors[question.patternId]?.[slotId];
      if (connector) {
        parts.push(connector);
      }

      // Add the word
      parts.push(word.hanzi);
    }

    // Add suffix if present
    const suffix = suffixes[question.patternId];
    if (suffix) {
      parts.push(suffix);
    }

    return parts;
  }, [question]);

  // Play syllable by syllable
  const handlePlaySyllables = useCallback(async () => {
    if (isPlaying) return;

    setIsPlaying(true);
    setPlayingMode('syllables');
    syllableAbortRef.current = false;

    try {
      // Build full sentence parts including connectors and suffixes
      const parts = buildSentenceParts();

      for (const part of parts) {
        if (syllableAbortRef.current) break;
        await audioService.playVocabulary(part, true);
        // Small pause between parts
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error('Error playing syllables:', error);
    } finally {
      setIsPlaying(false);
      setPlayingMode(null);
    }
  }, [buildSentenceParts, isPlaying]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space to replay full sentence
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handlePlaySentence();
        return;
      }

      // Number keys for option selection
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9 && currentStep) {
        const index = num - 1;
        if (index < currentStep.options.length && !isAnswered) {
          onSubmitAnswer(currentStep.options[index].value);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, isAnswered, onSubmitAnswer, handlePlaySentence]);

  if (!currentStep) return null;

  return (
    <div className="translator-game-area">
      {/* Display mode toggle */}
      <div className="translator-controls">
        <DisplayModeToggle
          mode={displayMode}
          onModeChange={onDisplayModeChange}
        />
      </div>

      {/* Sentence display */}
      <SentenceDisplay
        question={question}
        revealedSlots={revealedSlots}
        displayMode={displayMode}
        onPlaySentence={handlePlaySentence}
        onPlaySyllables={handlePlaySyllables}
        isPlaying={isPlaying}
        playingMode={playingMode}
      />

      {/* Step progress indicator */}
      <div className="translator-step-progress">
        <div className="step-dots">
          {question.steps.map((step, idx) => (
            <div
              key={step.id}
              className={`step-dot ${
                idx < currentStepIndex ? 'completed' :
                idx === currentStepIndex ? 'current' : 'pending'
              }`}
              title={step.isStructureStep ? 'Full sentence' : step.slotLabel}
            />
          ))}
        </div>
        <span className="step-label">
          Step {currentStepIndex + 1} of {totalSteps}
          {currentStep.isStructureStep
            ? ': What does this sentence mean?'
            : `: What is the ${currentStep.slotLabel}?`}
        </span>
      </div>

      {/* Answer options */}
      <div className="translator-options">
        {currentStep.options.map((option, index) => {
          const isSelected = selectedAnswer === option.value;
          const showCorrect = isAnswered && option.isCorrect;
          const showIncorrect = showWrongFeedback && isSelected && !option.isCorrect;

          let className = 'translator-option';
          if (showCorrect) className += ' correct';
          if (showIncorrect) className += ' incorrect shake';

          return (
            <button
              key={option.id}
              className={className}
              onClick={() => !isAnswered && onSubmitAnswer(option.value)}
              disabled={isAnswered}
            >
              <span className="option-hotkey">{index + 1}</span>
              <span className="option-label">{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback area */}
      <div className="translator-feedback">
        {isAnswered && (
          <div className="feedback-banner correct">
            <span className="feedback-text">Correct!</span>
            {currentStep.isStructureStep && (
              <span className="feedback-english">{question.fullEnglish}</span>
            )}
          </div>
        )}
        {showWrongFeedback && (
          <div className="feedback-banner incorrect">
            <span className="feedback-text">Try again!</span>
            {currentAttempts >= 2 && (
              <span className="feedback-hint">
                Hint: The answer is "{currentStep.correctAnswer.split(' ')[0]}..."
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

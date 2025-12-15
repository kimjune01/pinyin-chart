/**
 * QuizGameArea - Main question display and answer options
 */

import { useState, useEffect, useRef } from 'react';
import type { Question } from '../../lib/quiz/types';
import { audioService } from '../../lib/audio/AudioService';
import { addToneMarks } from '../../lib/utils/pinyinUtils';

interface QuizGameAreaProps {
  question: Question;
  isAnswered: boolean;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  onSubmitAnswer: (answer: string) => void;
  onNextQuestion: () => void;
  questionTimeLimit?: number;
}

const AUTO_ADVANCE_DELAY = 1000; // ms
const TIMER_UPDATE_INTERVAL = 50; // ms

export default function QuizGameArea({
  question,
  isAnswered,
  selectedAnswer,
  isCorrect,
  onSubmitAnswer,
  onNextQuestion,
  questionTimeLimit,
}: QuizGameAreaProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(questionTimeLimit ?? 0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Reset timer when question changes
  useEffect(() => {
    if (questionTimeLimit && !isAnswered) {
      startTimeRef.current = Date.now();
      setTimeRemaining(questionTimeLimit);

      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const remaining = Math.max(0, questionTimeLimit - elapsed);
        setTimeRemaining(remaining);

        if (remaining <= 0) {
          // Time's up - submit wrong answer
          if (timerRef.current) clearInterval(timerRef.current);
          onSubmitAnswer('__timeout__');
        }
      }, TIMER_UPDATE_INTERVAL);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [question.id, questionTimeLimit, isAnswered, onSubmitAnswer]);

  // Clear timer when answered
  useEffect(() => {
    if (isAnswered && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [isAnswered]);

  // Auto-advance to next question after correct answer
  useEffect(() => {
    if (isAnswered && isCorrect) {
      const timer = setTimeout(onNextQuestion, AUTO_ADVANCE_DELAY);
      return () => clearTimeout(timer);
    }
  }, [isAnswered, isCorrect, onNextQuestion]);

  // Keyboard shortcuts for answer selection (1-9)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswered) return;

      const key = e.key;
      const num = parseInt(key);
      if (num >= 1 && num <= 9) {
        const index = num - 1;
        if (index < question.options.length) {
          onSubmitAnswer(question.options[index].value);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, question.options, onSubmitAnswer]);

  const playAudio = async () => {
    if (isPlaying) return;

    setIsPlaying(true);
    try {
      // Extract pinyin from URL (e.g., ".../ma1.mp3" => "ma1")
      const match = question.audioUrl.match(/([^/]+)\.mp3$/);
      const pinyin = match ? match[1] : '';

      if (pinyin) {
        await audioService.play(pinyin);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setTimeout(() => setIsPlaying(false), 500);
    }
  };

  const timerProgress = questionTimeLimit ? (timeRemaining / questionTimeLimit) * 100 : 100;
  const isLowTime = questionTimeLimit && timeRemaining < questionTimeLimit * 0.3;

  return (
    <div className="quiz-game-area">
      <div className="question-card">
        {questionTimeLimit && !isAnswered && (
          <div className="timer-container">
            <div
              className={`timer-bar ${isLowTime ? 'low' : ''}`}
              style={{ width: `${timerProgress}%` }}
            />
            <span className="timer-text">{timeRemaining.toFixed(1)}s</span>
          </div>
        )}

        <div className="question-prompt">
          <button
            className="question-audio-button"
            onClick={playAudio}
            disabled={isPlaying}
          >
🔊 Play
          </button>
          <span className="question-title">Select the correct answer</span>
        </div>

        <div className="answer-options">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option.value;
            const showCorrect = isAnswered && option.isCorrect;
            const showIncorrect = isAnswered && isSelected && !option.isCorrect;

            let className = 'answer-option';
            if (showCorrect) className += ' correct';
            if (showIncorrect) className += ' incorrect';
            if (isSelected && !isAnswered) className += ' selected';

            return (
              <button
                key={option.id}
                className={className}
                onClick={() => !isAnswered && onSubmitAnswer(option.value)}
                disabled={isAnswered}
              >
                <span className="option-hotkey">{index + 1}</span>
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="feedback-area">
          {isAnswered ? (
            <div className={`feedback-banner ${isCorrect ? 'correct' : 'incorrect'}`}>
              <div>
                {isCorrect ? '✅ Correct!' : selectedAnswer === '__timeout__' ? '⏱️ Time\'s up!' : '❌ Incorrect'}
                {question.syllable && (() => {
                  const match = question.syllable.match(/^([a-zü]+)(\d)$/i);
                  if (match) {
                    const [, base, tone] = match;
                    return <span className="feedback-pinyin">{addToneMarks(base, parseInt(tone))}</span>;
                  }
                  return null;
                })()}
              </div>

              {!isCorrect && (
                <button
                  className="feedback-next-button"
                  onClick={onNextQuestion}
                >
                  Next Question →
                </button>
              )}
            </div>
          ) : (
            <div className="feedback-spacer" />
          )}
        </div>
      </div>
    </div>
  );
}

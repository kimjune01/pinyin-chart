/**
 * QuizGameArea - Main question display and answer options
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Question } from '../../lib/quiz/types';
import { audioService } from '../../lib/audio/AudioService';
import { addToneMarks } from '../../lib/utils/pinyinUtils';
import { PINYIN_SYLLABLES } from '../../data/pinyinSyllables';

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

  const playAudio = useCallback(async () => {
    if (isPlaying) return;

    setIsPlaying(true);
    try {
      // For HSK words with hanzi, use vocabulary audio (CDN with Web Speech fallback)
      if (question.hanzi) {
        await audioService.playVocabulary(question.hanzi);
      }
      // For multi-syllable words without hanzi, play syllables in sequence
      else if (question.syllable?.includes(',')) {
        const syllables = question.syllable.split(',');
        await audioService.playSequence(syllables);
      } else {
        // Extract pinyin from URL (e.g., ".../ma1.mp3" => "ma1")
        const match = question.audioUrl.match(/([^/]+)\.mp3$/);
        const pinyin = match ? match[1] : '';

        if (pinyin) {
          await audioService.play(pinyin);
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setTimeout(() => setIsPlaying(false), 500);
    }
  }, [question.audioUrl, question.syllable, question.hanzi, isPlaying]);

  // Play audio for a specific option (used after answering to explore alternatives)
  const playOptionAudio = useCallback(async (optionValue: string) => {
    if (isPlaying) return;

    if (!question.syllable) return;

    setIsPlaying(true);
    try {
      // For HSK quizzes, option value is "hanzi|syllables" format (e.g., "你好|ni3,hao3")
      if (optionValue.includes('|')) {
        const [hanzi] = optionValue.split('|');
        await audioService.playVocabulary(hanzi);
        return;
      }

      // Legacy: comma-separated syllables without hanzi
      if (optionValue.includes(',')) {
        const syllables = optionValue.split(',');
        await audioService.playSequence(syllables);
        return;
      }

      // For tone quizzes, option value is a tone number (1-4)
      if (/^[1-4]$/.test(optionValue)) {
        const match = question.syllable.match(/^([a-zü]+)(\d)$/i);
        if (match) {
          const [, base] = match;
          await audioService.play(`${base}${optionValue}`);
        }
        return;
      }

      // For syllable/pairs quizzes, option value is a full syllable with tone (e.g., "ma1", "ju4")
      if (/^[a-zü]+\d$/i.test(optionValue)) {
        await audioService.play(optionValue);
        return;
      }

      // For initial/final quizzes
      const match = question.syllable.match(/^([a-zü]+)(\d)$/i);
      if (!match) return;

      const [, base, tone] = match;
      const currentSyllable = PINYIN_SYLLABLES.find(s => s.pinyin === base);

      if (currentSyllable) {
        const isInitialOption = PINYIN_SYLLABLES.some(s => s.initial === optionValue);
        const isFinalOption = PINYIN_SYLLABLES.some(s => s.final === optionValue);

        if (isInitialOption) {
          const targetSyllable = PINYIN_SYLLABLES.find(
            s => s.initial === optionValue && s.final === currentSyllable.final && s.tones.includes(parseInt(tone))
          );
          if (targetSyllable) {
            await audioService.play(`${targetSyllable.pinyin}${tone}`);
          } else {
            await audioService.play(`${base}${tone}`);
          }
        } else if (isFinalOption) {
          const targetSyllable = PINYIN_SYLLABLES.find(
            s => s.initial === currentSyllable.initial && s.final === optionValue && s.tones.includes(parseInt(tone))
          );
          if (targetSyllable) {
            await audioService.play(`${targetSyllable.pinyin}${tone}`);
          } else {
            await audioService.play(`${base}${tone}`);
          }
        } else {
          await audioService.play(`${base}${tone}`);
        }
      } else {
        await audioService.play(`${base}${tone}`);
      }
    } catch (error) {
      console.error('Audio not available');
    } finally {
      setTimeout(() => setIsPlaying(false), 500);
    }
  }, [question.syllable, isPlaying]);

  // Keyboard shortcuts for answer selection (1-9) and replay (space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space to replay audio
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        playAudio();
        return;
      }

      const key = e.key;
      const num = parseInt(key);
      if (num >= 1 && num <= 9) {
        const index = num - 1;
        if (index < question.options.length) {
          if (isAnswered && !isCorrect) {
            // After wrong answer, play the selected option's audio
            playOptionAudio(question.options[index].value);
          } else if (!isAnswered) {
            onSubmitAnswer(question.options[index].value);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, isCorrect, question.options, onSubmitAnswer, playAudio, playOptionAudio]);

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
            const canExplore = isAnswered && !isCorrect;

            let className = 'answer-option';
            if (showCorrect) className += ' correct';
            if (showIncorrect) className += ' incorrect';
            if (isSelected && !isAnswered) className += ' selected';
            if (canExplore) className += ' explorable';

            const handleClick = () => {
              if (!isAnswered) {
                onSubmitAnswer(option.value);
              } else if (canExplore) {
                playOptionAudio(option.value);
              }
            };

            return (
              <button
                key={option.id}
                className={className}
                onClick={handleClick}
                disabled={isAnswered && isCorrect === true}
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
                <span className="feedback-pinyin">
                  {(() => {
                    // For tone quizzes, show syllable with tone marks
                    if (question.syllable) {
                      const match = question.syllable.match(/^([a-zü]+)(\d)$/i);
                      if (match) {
                        const [, base, tone] = match;
                        // Check if correctAnswer is a tone number (1-4)
                        if (/^[1-4]$/.test(question.correctAnswer)) {
                          return addToneMarks(base, parseInt(tone));
                        }
                      }
                    }
                    // For other quizzes, show the correct answer directly
                    return question.correctAnswer;
                  })()}
                </span>
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

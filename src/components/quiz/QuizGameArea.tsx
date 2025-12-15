/**
 * QuizGameArea - Main question display and answer options
 */

import { useState } from 'react';
import type { Question } from '../../lib/quiz/types';
import { audioService } from '../../lib/audio/AudioService';

interface QuizGameAreaProps {
  question: Question;
  isAnswered: boolean;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  onSubmitAnswer: (answer: string) => void;
  onNextQuestion: () => void;
}

export default function QuizGameArea({
  question,
  isAnswered,
  selectedAnswer,
  isCorrect,
  onSubmitAnswer,
  onNextQuestion,
}: QuizGameAreaProps) {
  const [isPlaying, setIsPlaying] = useState(false);

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

  return (
    <div className="quiz-game-area">
      <div className="question-card">
        <div className="question-prompt">
          <h2 className="question-title">Listen and select the correct answer:</h2>

          <button
            className="question-audio-button"
            onClick={playAudio}
            disabled={isPlaying}
          >
            {isPlaying ? '🔊 Playing...' : '🔊 Play Audio'}
          </button>
        </div>

        <div className="answer-options">
          {question.options.map((option) => {
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
                {option.label}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className={`feedback-banner ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            {question.explanation && (
              <div style={{ marginTop: 'var(--spacing-sm)', fontSize: 'var(--font-size-base)' }}>
                {question.explanation}
              </div>
            )}

            <button
              className="feedback-next-button"
              onClick={onNextQuestion}
            >
              Next Question →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * ClickableRegion - Reusable clickable area component with feedback states
 */

import { useState } from 'react';
import type { FeedbackType } from '../visualGameEngine';

interface ClickableRegionProps {
  emoji?: string;
  hanzi?: string; // For showing association on completed items
  pinyin?: string; // For showing with hanzi during peek
  label?: string;
  meaning?: string; // English meaning shown on completion
  position: string | number;
  onClick: (position: string | number) => void;
  feedback: FeedbackType;
  selectedPosition: string | number | null;
  isCompleted?: boolean;
  disabled?: boolean;
  className?: string;
}

// Count visual emoji characters (handles multi-codepoint emojis)
function countEmojis(str: string): number {
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  return [...segmenter.segment(str)].length;
}

export default function ClickableRegion({
  emoji,
  hanzi,
  pinyin,
  label,
  meaning,
  position,
  onClick,
  feedback,
  selectedPosition,
  isCompleted = false,
  disabled = false,
  className = '',
}: ClickableRegionProps) {
  const [isPeeking, setIsPeeking] = useState(false);
  const isSelected = selectedPosition === position;
  const feedbackClass = isSelected && feedback ? feedback : '';
  const completedClass = isCompleted ? 'completed' : '';
  const peekingClass = isPeeking ? 'peeking' : '';

  // Dynamic emoji size based on count
  const emojiCount = emoji ? countEmojis(emoji) : 0;
  const emojiSizeClass = emojiCount > 2 ? 'small-emoji' : '';

  const handleClick = () => {
    if (isCompleted && hanzi) {
      // Briefly show association
      setIsPeeking(true);
      setTimeout(() => setIsPeeking(false), 800);
    } else if (!disabled && !feedback && !isCompleted) {
      onClick(position);
    }
  };

  return (
    <button
      type="button"
      className={`clickable-region ${feedbackClass} ${completedClass} ${peekingClass} ${emojiSizeClass} ${className}`}
      onClick={handleClick}
      disabled={disabled || !!feedback}
      aria-label={label || meaning || `Position ${position}`}
    >
      {isPeeking && hanzi ? (
        <div className="peek-content">
          <span className="hanzi-peek">{hanzi}</span>
          {pinyin && <span className="pinyin-peek">{pinyin}</span>}
        </div>
      ) : (
        <>
          {emoji && <span className="emoji">{emoji}</span>}
          {label && <span className="label">{label}</span>}
          {isCompleted && meaning && <span className="meaning">{meaning}</span>}
        </>
      )}
    </button>
  );
}

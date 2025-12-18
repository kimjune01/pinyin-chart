/**
 * ClickableRegion - Reusable clickable area component with feedback states
 */

import type { FeedbackType } from '../visualGameEngine';

interface ClickableRegionProps {
  emoji?: string;
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

export default function ClickableRegion({
  emoji,
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
  const isSelected = selectedPosition === position;
  const feedbackClass = isSelected && feedback ? feedback : '';
  const completedClass = isCompleted ? 'completed' : '';

  const handleClick = () => {
    if (!disabled && !feedback && !isCompleted) {
      onClick(position);
    }
  };

  return (
    <button
      type="button"
      className={`clickable-region ${feedbackClass} ${completedClass} ${className}`}
      onClick={handleClick}
      disabled={disabled || !!feedback || isCompleted}
      aria-label={label || meaning || `Position ${position}`}
    >
      {emoji && <span className="emoji">{emoji}</span>}
      {label && <span className="label">{label}</span>}
      {isCompleted && meaning && <span className="meaning">{meaning}</span>}
    </button>
  );
}

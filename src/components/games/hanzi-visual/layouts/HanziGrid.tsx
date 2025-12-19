/**
 * HanziGrid - Grid layout for Hanzi character options (reverse mode)
 */

import { useState } from 'react';
import type { TopicItem, FeedbackType } from '../visualGameEngine';

interface HanziGridProps {
  items: TopicItem[];
  columns: number;
  onSelect: (hanzi: string) => void;
  feedback: FeedbackType;
  selectedHanzi: string | null;
  completedHanzi: Set<string>;
}

function HanziOption({
  item,
  isSelected,
  isCompleted,
  feedback,
  onSelect,
}: {
  item: TopicItem;
  isSelected: boolean;
  isCompleted: boolean;
  feedback: FeedbackType;
  onSelect: (hanzi: string) => void;
}) {
  const [isPeeking, setIsPeeking] = useState(false);
  const feedbackClass = isSelected && feedback ? feedback : '';
  const completedClass = isCompleted ? 'completed' : '';
  const peekingClass = isPeeking ? 'peeking' : '';

  // Dynamic font size based on character count
  const charCount = item.hanzi.length;
  const sizeClass = charCount > 2 ? 'small-text' : '';

  const handleClick = () => {
    if (isCompleted && item.emoji) {
      // Briefly show association
      setIsPeeking(true);
      setTimeout(() => setIsPeeking(false), 800);
    } else if (!feedback && !isCompleted) {
      onSelect(item.hanzi);
    }
  };

  return (
    <button
      type="button"
      className={`hanzi-option ${feedbackClass} ${completedClass} ${peekingClass} ${sizeClass}`}
      onClick={handleClick}
      disabled={!!feedback}
      aria-label={`Select ${item.hanzi}`}
    >
      {isPeeking && item.emoji ? (
        <span className="emoji-peek">{item.emoji}</span>
      ) : (
        <>
          <span className="hanzi-char">{item.hanzi}</span>
          {isCompleted && item.meaning && (
            <span className="meaning">{item.meaning}</span>
          )}
        </>
      )}
    </button>
  );
}

export default function HanziGrid({
  items,
  columns,
  onSelect,
  feedback,
  selectedHanzi,
  completedHanzi,
}: HanziGridProps) {
  const colsClass = `cols-${Math.min(columns, 4)}`;

  // Sort by position so shuffled positions affect visual order
  const sortedItems = [...items].sort((a, b) => {
    const posA = typeof a.position === 'number' ? a.position : 0;
    const posB = typeof b.position === 'number' ? b.position : 0;
    return posA - posB;
  });

  return (
    <div className={`hanzi-grid ${colsClass}`}>
      {sortedItems.map((item) => (
        <HanziOption
          key={item.hanzi}
          item={item}
          isSelected={selectedHanzi === item.hanzi}
          isCompleted={completedHanzi.has(item.hanzi)}
          feedback={feedback}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

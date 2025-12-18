/**
 * EmojiGrid - Grid layout for emoji-based topics
 */

import type { TopicItem, FeedbackType } from '../visualGameEngine';
import ClickableRegion from './ClickableRegion';

interface EmojiGridProps {
  items: TopicItem[];
  columns: number;
  onSelect: (position: string | number) => void;
  feedback: FeedbackType;
  selectedPosition: string | number | null;
  completedPositions: Set<string | number>;
}

export default function EmojiGrid({
  items,
  columns,
  onSelect,
  feedback,
  selectedPosition,
  completedPositions,
}: EmojiGridProps) {
  const colsClass = `cols-${Math.min(columns, 4)}`;

  return (
    <div className={`emoji-grid ${colsClass}`}>
      {items.map((item) => (
        <ClickableRegion
          key={item.position}
          emoji={item.emoji}
          meaning={item.meaning}
          position={item.position}
          onClick={onSelect}
          feedback={feedback}
          selectedPosition={selectedPosition}
          isCompleted={completedPositions.has(item.position)}
        />
      ))}
    </div>
  );
}

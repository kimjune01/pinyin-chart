/**
 * EmojiGrid - Grid layout for emoji-based topics
 */

import type { TopicItem, FeedbackType } from '../visualGameEngine';
import { addToneMarks } from '../../../../lib/utils/pinyinUtils';
import ClickableRegion from './ClickableRegion';

// Convert pinyin with tone numbers (e.g., "mi3fan4") to display format (e.g., "mǐfàn")
function formatPinyin(pinyin: string): string {
  const syllables = pinyin.match(/[a-zA-ZüÜ]+\d/g);
  if (!syllables) return pinyin;

  return syllables.map(syllable => {
    const match = syllable.match(/^([a-zA-ZüÜ]+)(\d)$/);
    if (match) {
      return addToneMarks(match[1], parseInt(match[2], 10));
    }
    return syllable;
  }).join('');
}

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

  // Sort by position so shuffled positions affect visual order
  const sortedItems = [...items].sort((a, b) => {
    const posA = typeof a.position === 'number' ? a.position : 0;
    const posB = typeof b.position === 'number' ? b.position : 0;
    return posA - posB;
  });

  return (
    <div className={`emoji-grid ${colsClass}`}>
      {sortedItems.map((item) => (
        <ClickableRegion
          key={item.position}
          emoji={item.emoji}
          hanzi={item.hanzi}
          pinyin={formatPinyin(item.pinyin)}
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

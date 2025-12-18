/**
 * DirectionDiagram - Compass-style layout for direction words
 */

import type { TopicItem, FeedbackType } from '../visualGameEngine';
import ClickableRegion from './ClickableRegion';

interface DirectionDiagramProps {
  items: TopicItem[];
  onSelect: (position: string | number) => void;
  feedback: FeedbackType;
  selectedPosition: string | number | null;
  completedPositions: Set<string | number>;
}

export default function DirectionDiagram({
  items,
  onSelect,
  feedback,
  selectedPosition,
  completedPositions,
}: DirectionDiagramProps) {
  // Create a map of position to item for easy lookup
  const itemByPosition = new Map<string, TopicItem>();
  items.forEach(item => {
    itemByPosition.set(String(item.position), item);
  });

  const positions = ['top', 'bottom', 'left', 'right'];

  return (
    <div className="direction-diagram">
      {positions.map((pos) => {
        const item = itemByPosition.get(pos);
        return (
          <ClickableRegion
            key={pos}
            emoji={item?.emoji || ''}
            meaning={item?.meaning}
            position={pos}
            onClick={onSelect}
            feedback={feedback}
            selectedPosition={selectedPosition}
            isCompleted={completedPositions.has(pos)}
            className={`pos-${pos}`}
          />
        );
      })}
      {/* Center reference point */}
      <div className="clickable-region pos-center">
        <span className="emoji">🧭</span>
      </div>
    </div>
  );
}

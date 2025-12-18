/**
 * FamilyTree - 4-level family tree layout with connecting lines
 * Levels: grandparents → parents → self → grandchildren
 */

import type { TopicItem, FeedbackType } from '../visualGameEngine';

interface FamilyTreeProps {
  items: TopicItem[];
  onSelect: (position: string | number) => void;
  feedback: FeedbackType;
  selectedPosition: string | number | null;
  completedPositions: Set<string | number>;
}

// Group family members by level
interface FamilyLevels {
  grandparents: TopicItem[];
  parents: TopicItem[];
  self: TopicItem[];
  grandchildren: TopicItem[];
}

function groupByLevel(items: TopicItem[]): FamilyLevels {
  const levels: FamilyLevels = {
    grandparents: [],
    parents: [],
    self: [],
    grandchildren: [],
  };

  items.forEach(item => {
    const pos = String(item.position);
    if (pos.startsWith('gp-')) {
      levels.grandparents.push(item);
    } else if (pos.startsWith('p-')) {
      levels.parents.push(item);
    } else if (pos.startsWith('s-')) {
      levels.self.push(item);
    } else if (pos.startsWith('gc-')) {
      levels.grandchildren.push(item);
    }
  });

  // Sort by position
  const sortOrder = ['left', 'center', 'right'];
  const sortFn = (a: TopicItem, b: TopicItem) => {
    const aPos = String(a.position).split('-')[1];
    const bPos = String(b.position).split('-')[1];
    return sortOrder.indexOf(aPos) - sortOrder.indexOf(bPos);
  };

  levels.grandparents.sort(sortFn);
  levels.parents.sort(sortFn);
  levels.self.sort(sortFn);
  levels.grandchildren.sort(sortFn);

  return levels;
}

interface FamilyMemberProps {
  item: TopicItem;
  onClick: (position: string | number) => void;
  feedback: FeedbackType;
  selectedPosition: string | number | null;
  isCompleted: boolean;
}

function FamilyMember({ item, onClick, feedback, selectedPosition, isCompleted }: FamilyMemberProps) {
  const isSelected = selectedPosition === item.position;
  const feedbackClass = isSelected && feedback ? feedback : '';
  const completedClass = isCompleted ? 'completed' : '';
  const selfClass = item.isSelf ? 'self' : '';

  const handleClick = () => {
    if (!feedback && !isCompleted) {
      onClick(item.position);
    }
  };

  return (
    <button
      type="button"
      className={`family-member ${feedbackClass} ${completedClass} ${selfClass}`}
      onClick={handleClick}
      disabled={!!feedback || isCompleted}
      aria-label={item.meaning || item.hanzi}
    >
      <span className="icon">{item.emoji}</span>
      {isCompleted && item.meaning && <span className="meaning">{item.meaning}</span>}
    </button>
  );
}

export default function FamilyTree({
  items,
  onSelect,
  feedback,
  selectedPosition,
  completedPositions,
}: FamilyTreeProps) {
  const levels = groupByLevel(items);

  return (
    <div className="family-tree">
      {/* SVG connector lines for 4-level tree */}
      <svg className="tree-connectors" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grandparents to Parents */}
        <line x1="40" y1="12" x2="60" y2="12" />
        <line x1="50" y1="12" x2="50" y2="22" />
        <line x1="40" y1="22" x2="60" y2="22" />
        <line x1="40" y1="22" x2="40" y2="27" />
        <line x1="60" y1="22" x2="60" y2="27" />
        {/* Parents to Siblings */}
        <line x1="40" y1="40" x2="60" y2="40" />
        <line x1="50" y1="40" x2="50" y2="50" />
        <line x1="25" y1="50" x2="75" y2="50" />
        <line x1="25" y1="50" x2="25" y2="55" />
        <line x1="50" y1="50" x2="50" y2="55" />
        <line x1="75" y1="50" x2="75" y2="55" />
        {/* Self to Children */}
        <line x1="50" y1="70" x2="50" y2="78" />
        <line x1="40" y1="78" x2="60" y2="78" />
        <line x1="40" y1="78" x2="40" y2="83" />
        <line x1="60" y1="78" x2="60" y2="83" />
      </svg>

      {/* Grandparents level */}
      {levels.grandparents.length > 0 && (
        <div className="tree-level">
          {levels.grandparents.map(item => (
            <FamilyMember
              key={item.position}
              item={item}
              onClick={onSelect}
              feedback={feedback}
              selectedPosition={selectedPosition}
              isCompleted={completedPositions.has(item.position)}
            />
          ))}
        </div>
      )}

      {/* Parents level */}
      {levels.parents.length > 0 && (
        <div className="tree-level">
          {levels.parents.map(item => (
            <FamilyMember
              key={item.position}
              item={item}
              onClick={onSelect}
              feedback={feedback}
              selectedPosition={selectedPosition}
              isCompleted={completedPositions.has(item.position)}
            />
          ))}
        </div>
      )}

      {/* Self level */}
      {levels.self.length > 0 && (
        <div className="tree-level self-level">
          {levels.self.map(item => (
            <FamilyMember
              key={item.position}
              item={item}
              onClick={onSelect}
              feedback={feedback}
              selectedPosition={selectedPosition}
              isCompleted={completedPositions.has(item.position)}
            />
          ))}
        </div>
      )}

      {/* Grandchildren level */}
      {levels.grandchildren.length > 0 && (
        <div className="tree-level">
          {levels.grandchildren.map(item => (
            <FamilyMember
              key={item.position}
              item={item}
              onClick={onSelect}
              feedback={feedback}
              selectedPosition={selectedPosition}
              isCompleted={completedPositions.has(item.position)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

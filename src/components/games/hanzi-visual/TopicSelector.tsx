/**
 * TopicSelector - Topic selection UI with endless mode option and direction toggle
 */

import { useState } from 'react';
import type { Topic, TopicCategory, GameDirection } from './visualGameEngine';
import { CATEGORY_LABELS } from './visualGameEngine';

type DifficultyFilter = 'all' | 1 | 2 | 3;

interface TopicSelectorProps {
  topics: Topic[];
  direction: GameDirection;
  onDirectionChange: (direction: GameDirection) => void;
  onSelectTopic: (topic: Topic, direction: GameDirection) => void;
  onStartEndless: (filteredTopics: Topic[]) => void;
}

function DifficultyStars({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="difficulty">
      {'⭐'.repeat(level)}
    </span>
  );
}

interface TopicCardProps {
  topic: Topic;
  onSelect: () => void;
}

function TopicCard({ topic, onSelect }: TopicCardProps) {
  const previewEmojis = topic.previewEmojis?.join(' ') || topic.items.slice(0, 3).map(i => i.emoji).join(' ');

  return (
    <button
      type="button"
      className="topic-card"
      onClick={onSelect}
      aria-label={`Play ${topic.name} - ${topic.nameZh}`}
    >
      <div className="emoji-preview">{previewEmojis}</div>
      <div className="topic-name-zh">{topic.nameZh}</div>
      <div className="topic-name">{topic.name}</div>
      <div className="topic-meta">
        <DifficultyStars level={topic.difficulty} />
        <span className="item-count">{topic.items.length} items</span>
      </div>
    </button>
  );
}

// Group topics by category
function groupByCategory(topics: Topic[]): Map<TopicCategory, Topic[]> {
  const groups = new Map<TopicCategory, Topic[]>();

  // Define category order
  const categoryOrder: TopicCategory[] = [
    'people',
    'language',
    'living-things',
    'food-drink',
    'places',
    'nature',
    'objects',
    'activities',
    'other',
  ];

  // Initialize groups in order
  for (const cat of categoryOrder) {
    groups.set(cat, []);
  }

  // Group topics
  for (const topic of topics) {
    const group = groups.get(topic.category);
    if (group) {
      group.push(topic);
    }
  }

  // Remove empty categories
  for (const [cat, topicList] of groups) {
    if (topicList.length === 0) {
      groups.delete(cat);
    }
  }

  return groups;
}

interface CategorySectionProps {
  category: TopicCategory;
  topics: Topic[];
  onSelectTopic: (topic: Topic) => void;
}

function CategorySection({ category, topics, onSelectTopic }: CategorySectionProps) {
  const label = CATEGORY_LABELS[category];

  return (
    <div className="category-section">
      <h2 className="category-header">
        <span className="category-emoji">{label.emoji}</span>
        <span className="category-name">{label.name}</span>
        <span className="category-name-zh">{label.nameZh}</span>
      </h2>
      <div className="topics-grid">
        {topics.map(topic => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onSelect={() => onSelectTopic(topic)}
          />
        ))}
      </div>
    </div>
  );
}

export default function TopicSelector({
  topics,
  direction,
  onDirectionChange,
  onSelectTopic,
  onStartEndless,
}: TopicSelectorProps) {
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');

  // Filter topics by difficulty
  const filteredTopics = difficultyFilter === 'all'
    ? topics
    : topics.filter(t => t.difficulty === difficultyFilter);

  const groupedTopics = groupByCategory(filteredTopics);

  return (
    <div className="topic-selector">
      <h1>Hanzi Visual</h1>
      <p className="subtitle">Match Chinese characters to their visual representations</p>

      {/* Controls Row */}
      <div className="controls-row">
        {/* Direction Toggle */}
        <div className="direction-toggle">
        <button
          type="button"
          className={`toggle-btn ${direction === 'hanzi-to-emoji' ? 'active' : ''}`}
          onClick={() => onDirectionChange('hanzi-to-emoji')}
        >
          <span className="toggle-icon">字</span>
          <span className="toggle-arrow">→</span>
          <span className="toggle-icon">🎯</span>
        </button>
        <button
          type="button"
          className={`toggle-btn ${direction === 'emoji-to-hanzi' ? 'active' : ''}`}
          onClick={() => onDirectionChange('emoji-to-hanzi')}
        >
          <span className="toggle-icon">🎯</span>
          <span className="toggle-arrow">→</span>
          <span className="toggle-icon">字</span>
        </button>
        </div>

        {/* Difficulty Filter */}
        <select
          className="difficulty-filter"
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value === 'all' ? 'all' : Number(e.target.value) as 1 | 2 | 3)}
        >
          <option value="all">All Levels</option>
          <option value="1">⭐ Easy</option>
          <option value="2">⭐⭐ Medium</option>
          <option value="3">⭐⭐⭐ Hard</option>
        </select>
      </div>

      <button
        type="button"
        className="endless-mode-btn"
        onClick={() => onStartEndless(filteredTopics)}
      >
        🔀 Endless Mode
      </button>

      <div className="categories-container">
        {Array.from(groupedTopics.entries()).map(([category, categoryTopics]) => (
          <CategorySection
            key={category}
            category={category}
            topics={categoryTopics}
            onSelectTopic={(topic) => onSelectTopic(topic, direction)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * TopicSelector - Topic selection UI with endless mode option
 */

import type { Topic, TopicCategory } from './visualGameEngine';
import { CATEGORY_LABELS } from './visualGameEngine';

interface TopicSelectorProps {
  topics: Topic[];
  onSelectTopic: (topic: Topic) => void;
  onStartEndless: () => void;
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
  onSelectTopic,
  onStartEndless,
}: TopicSelectorProps) {
  const groupedTopics = groupByCategory(topics);

  return (
    <div className="topic-selector">
      <h1>Hanzi Visual</h1>
      <p className="subtitle">Match Chinese characters to their visual representations</p>

      <button
        type="button"
        className="endless-mode-btn"
        onClick={onStartEndless}
      >
        🔀 Endless Mode
      </button>

      <div className="categories-container">
        {Array.from(groupedTopics.entries()).map(([category, categoryTopics]) => (
          <CategorySection
            key={category}
            category={category}
            topics={categoryTopics}
            onSelectTopic={onSelectTopic}
          />
        ))}
      </div>
    </div>
  );
}

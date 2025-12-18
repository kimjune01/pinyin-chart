/**
 * TopicSelector - Topic selection UI with endless mode option
 */

import type { Topic } from './visualGameEngine';

interface TopicSelectorProps {
  topics: Topic[];
  onSelectTopic: (topic: Topic) => void;
  onStartEndless: () => void;
}

function DifficultyStars({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="difficulty">
      {'⭐'.repeat(level)}{'☆'.repeat(3 - level)}
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
      <div className="topic-name">{topic.name}</div>
      <div className="topic-name-zh">{topic.nameZh}</div>
      <DifficultyStars level={topic.difficulty} />
    </button>
  );
}

export default function TopicSelector({
  topics,
  onSelectTopic,
  onStartEndless,
}: TopicSelectorProps) {
  return (
    <div className="topic-selector">
      <h1>Hanzi Visual</h1>
      <p className="subtitle">Match Chinese characters to their visual representations</p>

      <div className="topics-grid">
        {topics.map(topic => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onSelect={() => onSelectTopic(topic)}
          />
        ))}
      </div>

      <button
        type="button"
        className="endless-mode-btn"
        onClick={onStartEndless}
      >
        🔀 Endless Mode
      </button>
    </div>
  );
}

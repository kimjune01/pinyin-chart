/**
 * Visual Game Engine - Types and game logic for Hanzi Visual Association Game
 */

// Topic Item represents a single Hanzi and its visual representation
export interface TopicItem {
  hanzi: string;
  pinyin: string; // With tone number for audio (e.g., "mao1")
  meaning?: string;
  emoji?: string;
  position: string | number; // Grid index or position ID (e.g., "top", "gp-left")
  isSelf?: boolean; // For family tree - marks the "me" position
}

// Topic categories for organization
export type TopicCategory =
  | 'living-things'
  | 'food-drink'
  | 'people'
  | 'places'
  | 'nature'
  | 'objects'
  | 'language'
  | 'activities'
  | 'other';

export const CATEGORY_LABELS: Record<TopicCategory, { name: string; nameZh: string; emoji: string }> = {
  'living-things': { name: 'Living Things', nameZh: '生物', emoji: '🐾' },
  'food-drink': { name: 'Food & Drink', nameZh: '饮食', emoji: '🍽️' },
  'people': { name: 'People', nameZh: '人物', emoji: '👥' },
  'places': { name: 'Places', nameZh: '地点', emoji: '🏠' },
  'nature': { name: 'Nature', nameZh: '自然', emoji: '🌿' },
  'objects': { name: 'Objects', nameZh: '物品', emoji: '📦' },
  'language': { name: 'Language', nameZh: '语言', emoji: '📝' },
  'activities': { name: 'Activities', nameZh: '活动', emoji: '⚽' },
  'other': { name: 'Other', nameZh: '其他', emoji: '✨' },
};

// Topic configuration
export interface Topic {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  category: TopicCategory;
  difficulty: 1 | 2 | 3;
  layoutType: 'emoji-grid' | 'family-tree' | 'direction-diagram';
  gridColumns?: number;
  shuffleMode?: 'full' | 'pairs'; // 'pairs' only swaps within pairs (for opposites)
  items: TopicItem[];
  previewEmojis?: string[]; // For display in topic selector
}

// Game state types
export type GamePhase = 'topic-select' | 'playing' | 'feedback' | 'complete';
export type GameMode = 'single-topic' | 'endless';
export type GameDirection = 'hanzi-to-emoji' | 'emoji-to-hanzi';
export type FeedbackType = 'correct' | 'incorrect' | null;

export interface GameState {
  phase: GamePhase;
  mode: GameMode;
  currentTopic: Topic | null;
  currentItem: TopicItem | null;
  itemQueue: TopicItem[];
  score: number;
  streak: number;
  questionsAnswered: number;
  correctAnswers: number;
  selectedPosition: string | number | null;
  feedback: FeedbackType;
}

// Initial game state
export const initialGameState: GameState = {
  phase: 'topic-select',
  mode: 'single-topic',
  currentTopic: null,
  currentItem: null,
  itemQueue: [],
  score: 0,
  streak: 0,
  questionsAnswered: 0,
  correctAnswers: 0,
  selectedPosition: null,
  feedback: null,
};

// Shuffle array helper
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Shuffle item positions for emoji-grid layouts (prevents position memorization)
export function shuffleGridPositions(topic: Topic): Topic {
  if (topic.layoutType !== 'emoji-grid') {
    return topic;
  }

  let shuffledItems: TopicItem[];

  if (topic.shuffleMode === 'pairs') {
    // Only swap within pairs (for opposites layout)
    // Items are in pairs: [0,1], [2,3], [4,5], etc.
    shuffledItems = [];
    for (let i = 0; i < topic.items.length; i += 2) {
      const left = topic.items[i];
      const right = topic.items[i + 1];
      if (right && Math.random() < 0.5) {
        // Swap positions within the pair
        shuffledItems.push({ ...left, position: right.position });
        shuffledItems.push({ ...right, position: left.position });
      } else {
        shuffledItems.push(left);
        if (right) shuffledItems.push(right);
      }
    }
  } else {
    // Full shuffle - reassign all positions randomly
    const positions = topic.items.map(item => item.position);
    const shuffledPositions = shuffleArray([...positions]);
    shuffledItems = topic.items.map((item, index) => ({
      ...item,
      position: shuffledPositions[index],
    }));
  }

  return {
    ...topic,
    items: shuffledItems,
  };
}

// Generate item queue for a topic
export function generateTopicQueue(topic: Topic): TopicItem[] {
  return shuffleArray([...topic.items]);
}

// Generate shuffled topic queue for endless mode
export function generateEndlessTopicQueue(topics: Topic[]): Topic[] {
  return shuffleArray([...topics]);
}

// Check if answer is correct
export function checkAnswer(item: TopicItem, selectedPosition: string | number): boolean {
  return item.position === selectedPosition;
}

// Check if answer is correct in reverse mode (matching by hanzi)
export function checkReverseAnswer(correctItem: TopicItem, selectedHanzi: string): boolean {
  return correctItem.hanzi === selectedHanzi;
}

// Generate Hanzi options for reverse mode (1 correct + distractors)
export function generateHanziOptions(
  correctItem: TopicItem,
  allItems: TopicItem[],
  numOptions: number = 4
): TopicItem[] {
  // Filter out the correct item and shuffle remaining items
  const distractors = shuffleArray(
    allItems.filter(item => item.hanzi !== correctItem.hanzi)
  ).slice(0, numOptions - 1);

  // Combine correct item with distractors and shuffle
  return shuffleArray([correctItem, ...distractors]);
}

// Calculate score for correct answer
export function calculateScore(streak: number): number {
  const baseScore = 100;
  const streakBonus = Math.min(streak, 5) * 20; // Max 100 bonus
  return baseScore + streakBonus;
}

// Storage keys
export const STORAGE_KEYS = {
  highScore: 'hanzi-visual-highscore',
  topicProgress: 'hanzi-visual-progress',
};

// Load from localStorage
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

// Save to localStorage
export function saveToStorage(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail
  }
}

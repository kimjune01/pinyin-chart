/**
 * Fruits & Food Topic - Match food Hanzi to their emoji representations
 */

import type { Topic } from '../visualGameEngine';

export const fruitsTopic: Topic = {
  id: 'fruits',
  name: 'Food & Drinks',
  nameZh: '食物',
  description: 'Match food and drink words to their emoji',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🍎', '🍵', '🍚'],
  items: [
    { hanzi: '苹果', pinyin: 'ping2guo3', meaning: 'apple', emoji: '🍎', position: 0 },
    { hanzi: '茶', pinyin: 'cha2', meaning: 'tea', emoji: '🍵', position: 1 },
    { hanzi: '水', pinyin: 'shui3', meaning: 'water', emoji: '💧', position: 2 },
    { hanzi: '米饭', pinyin: 'mi3fan4', meaning: 'rice', emoji: '🍚', position: 3 },
    { hanzi: '菜', pinyin: 'cai4', meaning: 'vegetable', emoji: '🥬', position: 4 },
    { hanzi: '肉', pinyin: 'rou4', meaning: 'meat', emoji: '🥩', position: 5 },
  ],
};

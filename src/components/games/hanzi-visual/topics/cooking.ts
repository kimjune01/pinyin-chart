/**
 * Cooking Topic - Match cooking Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const cookingTopic: Topic = {
  id: 'cooking',
  name: 'Cooking',
  nameZh: '烹饪',
  description: 'Match Chinese cooking words to emojis',
  category: 'food-drink',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🍳', '🔪', '🍲'],
  items: [
    { hanzi: '炒', pinyin: 'chao3', meaning: 'stir fry', emoji: '🍳', position: 0 },
    { hanzi: '煮', pinyin: 'zhu3', meaning: 'boil', emoji: '🫕', position: 1 },
    { hanzi: '切', pinyin: 'qie1', meaning: 'cut', emoji: '🔪', position: 2 },
    { hanzi: '锅', pinyin: 'guo1', meaning: 'pot/wok', emoji: '🍲', position: 3 },
    { hanzi: '火', pinyin: 'huo3', meaning: 'fire', emoji: '🔥', position: 4 },
    { hanzi: '盐', pinyin: 'yan2', meaning: 'salt', emoji: '🧂', position: 5 },
    { hanzi: '蒸', pinyin: 'zheng1', meaning: 'steam', emoji: '♨️', position: 6 },
    { hanzi: '烤', pinyin: 'kao3', meaning: 'roast/grill', emoji: '🥓', position: 7 },
    { hanzi: '米饭', pinyin: 'mi3fan4', meaning: 'rice', emoji: '🍚', position: 8 },
  ],
};

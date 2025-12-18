/**
 * Flowers Topic - Match flower Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const flowersTopic: Topic = {
  id: 'flowers',
  name: 'Flowers',
  nameZh: '花',
  description: 'Match Chinese flowers to emojis',
  category: 'living-things',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🌸', '🌹', '🌻'],
  items: [
    { hanzi: '樱花', pinyin: 'ying1hua1', meaning: 'cherry blossom', emoji: '🌸', position: 0 },
    { hanzi: '玫瑰', pinyin: 'mei2gui5', meaning: 'rose', emoji: '🌹', position: 1 },
    { hanzi: '向日葵', pinyin: 'xiang4ri4kui2', meaning: 'sunflower', emoji: '🌻', position: 2 },
    { hanzi: '郁金香', pinyin: 'yu4jin1xiang1', meaning: 'tulip', emoji: '🌷', position: 3 },
    { hanzi: '菊花', pinyin: 'ju2hua1', meaning: 'chrysanthemum', emoji: '🌼', position: 4 },
    { hanzi: '兰花', pinyin: 'lan2hua1', meaning: 'orchid', emoji: '🪻', position: 5 },
    { hanzi: '荷花', pinyin: 'he2hua1', meaning: 'lotus', emoji: '🪷', position: 6 },
    { hanzi: '花束', pinyin: 'hua1shu4', meaning: 'bouquet', emoji: '💐', position: 7 },
    { hanzi: '仙人掌', pinyin: 'xian1ren2zhang3', meaning: 'cactus', emoji: '🌵', position: 8 },
  ],
};

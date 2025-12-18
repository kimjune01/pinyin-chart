/**
 * Rooms Topic - Match room Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const roomsTopic: Topic = {
  id: 'rooms',
  name: 'Rooms',
  nameZh: '房间',
  description: 'Match Chinese rooms to emojis',
  category: 'places',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🛏️', '🍳', '🚿'],
  items: [
    { hanzi: '卧室', pinyin: 'wo4shi4', meaning: 'bedroom', emoji: '🛏️', position: 0 },
    { hanzi: '厨房', pinyin: 'chu2fang2', meaning: 'kitchen', emoji: '🍳🔪', position: 1 },
    { hanzi: '浴室', pinyin: 'yu4shi4', meaning: 'bathroom', emoji: '🚿🛁', position: 2 },
    { hanzi: '客厅', pinyin: 'ke4ting1', meaning: 'living room', emoji: '🛋️📺', position: 3 },
    { hanzi: '餐厅', pinyin: 'can1ting1', meaning: 'dining room', emoji: '🍽️', position: 4 },
    { hanzi: '书房', pinyin: 'shu1fang2', meaning: 'study', emoji: '📚🪑', position: 5 },
    { hanzi: '阳台', pinyin: 'yang2tai2', meaning: 'balcony', emoji: '🌅🪴', position: 6 },
    { hanzi: '车库', pinyin: 'che1ku4', meaning: 'garage', emoji: '🚗🏠', position: 7 },
    { hanzi: '地下室', pinyin: 'di4xia4shi4', meaning: 'basement', emoji: '⬇️🏠', position: 8 },
  ],
};

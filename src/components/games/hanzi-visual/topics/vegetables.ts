/**
 * Vegetables Topic - Match vegetable Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const vegetablesTopic: Topic = {
  id: 'vegetables',
  name: 'Vegetables',
  nameZh: '蔬菜',
  description: 'Match Chinese vegetables to emojis',
  category: 'food-drink',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🥕', '🍅', '🥦'],
  items: [
    { hanzi: '胡萝卜', pinyin: 'hu2luo2bo5', meaning: 'carrot', emoji: '🥕', position: 0 },
    { hanzi: '西红柿', pinyin: 'xi1hong2shi4', meaning: 'tomato', emoji: '🍅', position: 1 },
    { hanzi: '西兰花', pinyin: 'xi1lan2hua1', meaning: 'broccoli', emoji: '🥦', position: 2 },
    { hanzi: '玉米', pinyin: 'yu4mi3', meaning: 'corn', emoji: '🌽', position: 3 },
    { hanzi: '蘑菇', pinyin: 'mo2gu5', meaning: 'mushroom', emoji: '🍄', position: 4 },
    { hanzi: '土豆', pinyin: 'tu3dou4', meaning: 'potato', emoji: '🥔', position: 5 },
    { hanzi: '洋葱', pinyin: 'yang2cong1', meaning: 'onion', emoji: '🧅', position: 6 },
    { hanzi: '大蒜', pinyin: 'da4suan4', meaning: 'garlic', emoji: '🧄', position: 7 },
    { hanzi: '辣椒', pinyin: 'la4jiao1', meaning: 'chili pepper', emoji: '🌶️', position: 8 },
  ],
};

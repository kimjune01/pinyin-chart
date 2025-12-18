/**
 * Desserts Topic - Match dessert Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const dessertsTopic: Topic = {
  id: 'desserts',
  name: 'Desserts',
  nameZh: '甜点',
  description: 'Match Chinese desserts to emojis',
  category: 'food-drink',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🍰', '🍩', '🍦'],
  items: [
    { hanzi: '蛋糕', pinyin: 'dan4gao1', meaning: 'cake', emoji: '🍰', position: 0 },
    { hanzi: '甜甜圈', pinyin: 'tian2tian2quan1', meaning: 'donut', emoji: '🍩', position: 1 },
    { hanzi: '冰淇淋', pinyin: 'bing1qi2lin2', meaning: 'ice cream', emoji: '🍦', position: 2 },
    { hanzi: '饼干', pinyin: 'bing3gan1', meaning: 'cookie', emoji: '🍪', position: 3 },
    { hanzi: '巧克力', pinyin: 'qiao3ke4li4', meaning: 'chocolate', emoji: '🍫', position: 4 },
    { hanzi: '糖果', pinyin: 'tang2guo3', meaning: 'candy', emoji: '🍬', position: 5 },
    { hanzi: '棒棒糖', pinyin: 'bang4bang4tang2', meaning: 'lollipop', emoji: '🍭', position: 6 },
    { hanzi: '纸杯蛋糕', pinyin: 'zhi3bei1dan4gao1', meaning: 'cupcake', emoji: '🧁', position: 7 },
    { hanzi: '布丁', pinyin: 'bu4ding1', meaning: 'pudding', emoji: '🍮', position: 8 },
  ],
};

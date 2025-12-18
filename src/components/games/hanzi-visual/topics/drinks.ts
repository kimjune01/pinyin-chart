/**
 * Drinks Topic - Match drink Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const drinksTopic: Topic = {
  id: 'drinks',
  name: 'Drinks',
  nameZh: '饮料',
  description: 'Match Chinese drinks to emojis',
  category: 'food-drink',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['☕', '🍵', '🥛'],
  items: [
    { hanzi: '水', pinyin: 'shui3', meaning: 'water', emoji: '💧', position: 0 },
    { hanzi: '茶', pinyin: 'cha2', meaning: 'tea', emoji: '🍵', position: 1 },
    { hanzi: '咖啡', pinyin: 'ka1fei1', meaning: 'coffee', emoji: '☕', position: 2 },
    { hanzi: '牛奶', pinyin: 'niu2nai3', meaning: 'milk', emoji: '🥛', position: 3 },
    { hanzi: '果汁', pinyin: 'guo3zhi1', meaning: 'juice', emoji: '🧃', position: 4 },
    { hanzi: '啤酒', pinyin: 'pi2jiu3', meaning: 'beer', emoji: '🍺', position: 5 },
    { hanzi: '葡萄酒', pinyin: 'pu2tao5jiu3', meaning: 'wine', emoji: '🍷', position: 6 },
    { hanzi: '可乐', pinyin: 'ke3le4', meaning: 'cola', emoji: '🥤', position: 7 },
    { hanzi: '冰', pinyin: 'bing1', meaning: 'ice', emoji: '🧊', position: 8 },
  ],
};

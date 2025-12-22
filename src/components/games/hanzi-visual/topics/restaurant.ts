/**
 * Restaurant Topic - Match restaurant Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const restaurantTopic: Topic = {
  id: 'restaurant',
  name: 'Restaurant',
  nameZh: '餐厅',
  description: 'Match Chinese restaurant items to emojis',
  category: 'places',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🍽️', '🥢', '🧾'],
  items: [
    { hanzi: '菜单', pinyin: 'cai4dan1', meaning: 'menu', emoji: '📋', position: 0 },
    { hanzi: '筷子', pinyin: 'kuai4zi5', meaning: 'chopsticks', emoji: '🥢', position: 1 },
    { hanzi: '盘子', pinyin: 'pan2zi5', meaning: 'plate', emoji: '🍽️', position: 2 },
    { hanzi: '碗', pinyin: 'wan3', meaning: 'bowl', emoji: '🥣', position: 3 },
    { hanzi: '杯子', pinyin: 'bei1zi5', meaning: 'cup', emoji: '🥤', position: 4 },
    { hanzi: '勺子', pinyin: 'shao2zi5', meaning: 'spoon', emoji: '🥄', position: 5 },
    { hanzi: '刀叉', pinyin: 'dao1cha1', meaning: 'knife and fork', emoji: '🍴', position: 6 },
    { hanzi: '账单', pinyin: 'zhang4dan1', meaning: 'bill', emoji: '🧾', position: 7 },
    { hanzi: '小费', pinyin: 'xiao3fei4', meaning: 'tip', emoji: '💵', position: 8 },
  ],
};

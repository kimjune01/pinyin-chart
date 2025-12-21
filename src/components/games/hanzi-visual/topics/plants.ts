/**
 * Plants Topic - Match plant Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const plantsTopic: Topic = {
  id: 'plants',
  name: 'Plants',
  nameZh: '植物',
  description: 'Match Chinese plants to emojis',
  category: 'living-things',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🌲', '🌿', '🍀'],
  items: [
    { hanzi: '树', pinyin: 'shu4', meaning: 'tree', emoji: '🌲', position: 0 },
    { hanzi: '草', pinyin: 'cao3', meaning: 'grass', emoji: '🌿', position: 1 },
    { hanzi: '叶子', pinyin: 'ye4zi5', meaning: 'leaf', emoji: '🍃', position: 2 },
    { hanzi: '竹子', pinyin: 'zhu2zi5', meaning: 'bamboo', emoji: '🎋', position: 3 },
    { hanzi: '蘑菇', pinyin: 'mo2gu5', meaning: 'mushroom', emoji: '🍄', position: 4 },
    { hanzi: '四叶草', pinyin: 'si4ye4cao3', meaning: 'four-leaf clover', emoji: '🍀', position: 5 },
    { hanzi: '棕榈树', pinyin: 'zong1lv2shu4', meaning: 'palm tree', emoji: '🌴', position: 6 },
    { hanzi: '种子', pinyin: 'zhong3zi5', meaning: 'seed', emoji: '🌱', position: 7 },
    { hanzi: '木头', pinyin: 'mu4tou5', meaning: 'wood', emoji: '🪵', position: 8 },
  ],
};

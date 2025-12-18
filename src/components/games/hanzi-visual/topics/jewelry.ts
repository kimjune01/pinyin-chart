/**
 * Jewelry Topic - Match jewelry Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const jewelryTopic: Topic = {
  id: 'jewelry',
  name: 'Jewelry',
  nameZh: '首饰',
  description: 'Match Chinese jewelry to emojis',
  category: 'objects',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['💍', '💎', '👑'],
  items: [
    { hanzi: '戒指', pinyin: 'jie4zhi5', meaning: 'ring', emoji: '💍', position: 0 },
    { hanzi: '钻石', pinyin: 'zuan4shi2', meaning: 'diamond', emoji: '💎', position: 1 },
    { hanzi: '皇冠', pinyin: 'huang2guan1', meaning: 'crown', emoji: '👑', position: 2 },
    { hanzi: '项链', pinyin: 'xiang4lian4', meaning: 'necklace', emoji: '📿', position: 3 },
    { hanzi: '口红', pinyin: 'kou3hong2', meaning: 'lipstick', emoji: '💄', position: 4 },
    { hanzi: '香水', pinyin: 'xiang1shui3', meaning: 'perfume', emoji: '🧴✨', position: 5 },
    { hanzi: '钱包', pinyin: 'qian2bao1', meaning: 'wallet', emoji: '👛', position: 6 },
    { hanzi: '手提包', pinyin: 'shou3ti2bao1', meaning: 'handbag', emoji: '👜', position: 7 },
    { hanzi: '蝴蝶结', pinyin: 'hu2die2jie2', meaning: 'ribbon', emoji: '🎀', position: 8 },
  ],
};

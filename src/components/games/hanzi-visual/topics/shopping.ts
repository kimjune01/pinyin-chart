/**
 * Shopping Topic - Match shopping Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const shoppingTopic: Topic = {
  id: 'shopping',
  name: 'Shopping',
  nameZh: '购物',
  description: 'Match Chinese shopping words to emojis',
  category: 'activities',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['💵', '🛒', '🏪'],
  items: [
    { hanzi: '钱', pinyin: 'qian2', meaning: 'money', emoji: '💵', position: 0 },
    { hanzi: '买', pinyin: 'mai3', meaning: 'buy', emoji: '🛒', position: 1 },
    { hanzi: '卖', pinyin: 'mai4', meaning: 'sell', emoji: '🏪💰', position: 2 },
    { hanzi: '贵', pinyin: 'gui4', meaning: 'expensive', emoji: '💎💰', position: 3 },
    { hanzi: '便宜', pinyin: 'pian2yi5', meaning: 'cheap', emoji: '🏷️', position: 4 },
    { hanzi: '商店', pinyin: 'shang1dian4', meaning: 'shop', emoji: '🏪', position: 5 },
    { hanzi: '超市', pinyin: 'chao1shi4', meaning: 'supermarket', emoji: '🛒🏬', position: 6 },
    { hanzi: '付钱', pinyin: 'fu4qian2', meaning: 'pay', emoji: '💳', position: 7 },
    { hanzi: '收据', pinyin: 'shou1ju4', meaning: 'receipt', emoji: '🧾', position: 8 },
  ],
};

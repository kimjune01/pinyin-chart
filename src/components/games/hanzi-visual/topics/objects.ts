/**
 * Objects Topic - Match common object Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const objectsTopic: Topic = {
  id: 'objects',
  name: 'Objects',
  nameZh: '物品',
  description: 'Match Chinese objects to emojis',
  category: 'objects',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['📱', '💻', '📚'],
  items: [
    { hanzi: '手机', pinyin: 'shou3ji1', meaning: 'phone', emoji: '📱', position: 0 },
    { hanzi: '电脑', pinyin: 'dian4nao3', meaning: 'computer', emoji: '💻', position: 1 },
    { hanzi: '书', pinyin: 'shu1', meaning: 'book', emoji: '📚', position: 2 },
    { hanzi: '钱', pinyin: 'qian2', meaning: 'money', emoji: '💰', position: 3 },
    { hanzi: '钥匙', pinyin: 'yao4shi5', meaning: 'key', emoji: '🔑', position: 4 },
    { hanzi: '灯', pinyin: 'deng1', meaning: 'lamp', emoji: '💡', position: 5 },
    { hanzi: '椅子', pinyin: 'yi3zi5', meaning: 'chair', emoji: '🪑', position: 6 },
    { hanzi: '门', pinyin: 'men2', meaning: 'door', emoji: '🚪', position: 7 },
    { hanzi: '窗户', pinyin: 'chuang1hu5', meaning: 'window', emoji: '🪟', position: 8 },
  ],
};

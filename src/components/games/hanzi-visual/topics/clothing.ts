/**
 * Clothing Topic - Match clothing Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const clothingTopic: Topic = {
  id: 'clothing',
  name: 'Clothing',
  nameZh: '衣服',
  description: 'Match Chinese clothing to emojis',
  category: 'objects',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['👔', '👖', '👟'],
  items: [
    { hanzi: '衣服', pinyin: 'yi1fu5', meaning: 'clothes', emoji: '👔', position: 0 },
    { hanzi: '裤子', pinyin: 'ku4zi5', meaning: 'pants', emoji: '👖', position: 1 },
    { hanzi: '鞋子', pinyin: 'xie2zi5', meaning: 'shoes', emoji: '👟', position: 2 },
    { hanzi: '帽子', pinyin: 'mao4zi5', meaning: 'hat', emoji: '🧢', position: 3 },
    { hanzi: '裙子', pinyin: 'qun2zi5', meaning: 'skirt', emoji: '👗', position: 4 },
    { hanzi: '袜子', pinyin: 'wa4zi5', meaning: 'socks', emoji: '🧦', position: 5 },
    { hanzi: '眼镜', pinyin: 'yan3jing4', meaning: 'glasses', emoji: '👓', position: 6 },
    { hanzi: '手表', pinyin: 'shou3biao3', meaning: 'watch', emoji: '⌚', position: 7 },
    { hanzi: '包', pinyin: 'bao1', meaning: 'bag', emoji: '👜', position: 8 },
  ],
};

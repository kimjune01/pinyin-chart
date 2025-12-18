/**
 * Space Topic - Match space Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const spaceTopic: Topic = {
  id: 'space',
  name: 'Space',
  nameZh: '太空',
  description: 'Match Chinese space words to emojis',
  category: 'nature',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['☀️', '🌙', '🌍'],
  items: [
    { hanzi: '太阳', pinyin: 'tai4yang2', meaning: 'sun', emoji: '☀️', position: 0 },
    { hanzi: '月亮', pinyin: 'yue4liang5', meaning: 'moon', emoji: '🌙', position: 1 },
    { hanzi: '地球', pinyin: 'di4qiu2', meaning: 'Earth', emoji: '🌍', position: 2 },
    { hanzi: '星星', pinyin: 'xing1xing5', meaning: 'star', emoji: '⭐', position: 3 },
    { hanzi: '火箭', pinyin: 'huo3jian4', meaning: 'rocket', emoji: '🚀', position: 4 },
    { hanzi: '卫星', pinyin: 'wei4xing1', meaning: 'satellite', emoji: '🛰️', position: 5 },
    { hanzi: '宇航员', pinyin: 'yu3hang2yuan2', meaning: 'astronaut', emoji: '👨‍🚀', position: 6 },
    { hanzi: '外星人', pinyin: 'wai4xing1ren2', meaning: 'alien', emoji: '👽', position: 7 },
    { hanzi: '银河', pinyin: 'yin2he2', meaning: 'galaxy', emoji: '🌌', position: 8 },
  ],
};

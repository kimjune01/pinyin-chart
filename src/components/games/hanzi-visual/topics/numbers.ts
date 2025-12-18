/**
 * Numbers Topic - Match number Hanzi to digit emojis
 */

import type { Topic } from '../visualGameEngine';

export const numbersTopic: Topic = {
  id: 'numbers',
  name: 'Numbers',
  nameZh: '数字',
  description: 'Match Chinese numbers to digits',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 5,
  previewEmojis: ['1️⃣', '2️⃣', '3️⃣'],
  items: [
    { hanzi: '一', pinyin: 'yi1', meaning: 'one', emoji: '1️⃣', position: 0 },
    { hanzi: '二', pinyin: 'er4', meaning: 'two', emoji: '2️⃣', position: 1 },
    { hanzi: '三', pinyin: 'san1', meaning: 'three', emoji: '3️⃣', position: 2 },
    { hanzi: '四', pinyin: 'si4', meaning: 'four', emoji: '4️⃣', position: 3 },
    { hanzi: '五', pinyin: 'wu3', meaning: 'five', emoji: '5️⃣', position: 4 },
    { hanzi: '六', pinyin: 'liu4', meaning: 'six', emoji: '6️⃣', position: 5 },
    { hanzi: '七', pinyin: 'qi1', meaning: 'seven', emoji: '7️⃣', position: 6 },
    { hanzi: '八', pinyin: 'ba1', meaning: 'eight', emoji: '8️⃣', position: 7 },
    { hanzi: '九', pinyin: 'jiu3', meaning: 'nine', emoji: '9️⃣', position: 8 },
    { hanzi: '十', pinyin: 'shi2', meaning: 'ten', emoji: '🔟', position: 9 },
  ],
};

/**
 * Zodiac Topic - Match Chinese zodiac animal Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const zodiacTopic: Topic = {
  id: 'zodiac',
  name: 'Zodiac',
  nameZh: '生肖',
  description: 'Match Chinese zodiac animals to emojis',
  category: 'other',
  difficulty: 3,
  layoutType: 'emoji-grid',
  gridColumns: 4,
  previewEmojis: ['🐲', '🐯', '🐰'],
  items: [
    { hanzi: '鼠', pinyin: 'shu3', meaning: 'rat', emoji: '🐀', position: 0 },
    { hanzi: '牛', pinyin: 'niu2', meaning: 'ox', emoji: '🐂', position: 1 },
    { hanzi: '虎', pinyin: 'hu3', meaning: 'tiger', emoji: '🐅', position: 2 },
    { hanzi: '兔', pinyin: 'tu4', meaning: 'rabbit', emoji: '🐰', position: 3 },
    { hanzi: '龙', pinyin: 'long2', meaning: 'dragon', emoji: '🐲', position: 4 },
    { hanzi: '蛇', pinyin: 'she2', meaning: 'snake', emoji: '🐍', position: 5 },
    { hanzi: '马', pinyin: 'ma3', meaning: 'horse', emoji: '🐴', position: 6 },
    { hanzi: '羊', pinyin: 'yang2', meaning: 'sheep', emoji: '🐑', position: 7 },
    { hanzi: '猴', pinyin: 'hou2', meaning: 'monkey', emoji: '🐵', position: 8 },
    { hanzi: '鸡', pinyin: 'ji1', meaning: 'rooster', emoji: '🐔', position: 9 },
    { hanzi: '狗', pinyin: 'gou3', meaning: 'dog', emoji: '🐕', position: 10 },
    { hanzi: '猪', pinyin: 'zhu1', meaning: 'pig', emoji: '🐷', position: 11 },
  ],
};

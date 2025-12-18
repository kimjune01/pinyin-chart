/**
 * Holidays Topic - Match holiday Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const holidaysTopic: Topic = {
  id: 'holidays',
  name: 'Holidays',
  nameZh: '节日',
  description: 'Match Chinese holidays to emojis',
  category: 'activities',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🧧', '🎄', '🎃'],
  items: [
    { hanzi: '春节', pinyin: 'chun1jie2', meaning: 'Spring Festival', emoji: '🧧🎆', position: 0 },
    { hanzi: '圣诞节', pinyin: 'sheng4dan4jie2', meaning: 'Christmas', emoji: '🎄🎅', position: 1 },
    { hanzi: '万圣节', pinyin: 'wan4sheng4jie2', meaning: 'Halloween', emoji: '🎃👻', position: 2 },
    { hanzi: '情人节', pinyin: 'qing2ren2jie2', meaning: "Valentine's Day", emoji: '💕💐', position: 3 },
    { hanzi: '中秋节', pinyin: 'zhong1qiu1jie2', meaning: 'Mid-Autumn', emoji: '🥮🌕', position: 4 },
    { hanzi: '新年', pinyin: 'xin1nian2', meaning: 'New Year', emoji: '🎉🥂', position: 5 },
    { hanzi: '母亲节', pinyin: 'mu3qin1jie2', meaning: "Mother's Day", emoji: '👩💐', position: 6 },
    { hanzi: '父亲节', pinyin: 'fu4qin1jie2', meaning: "Father's Day", emoji: '👨🎁', position: 7 },
    { hanzi: '端午节', pinyin: 'duan1wu3jie2', meaning: 'Dragon Boat', emoji: '🐉🚣', position: 8 },
  ],
};

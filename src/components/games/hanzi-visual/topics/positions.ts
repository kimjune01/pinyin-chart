/**
 * Positions Topic - Match relative position Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const positionsTopic: Topic = {
  id: 'positions',
  name: 'Positions',
  nameZh: '位置',
  description: 'Match Chinese position words to emojis',
  category: 'language',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['📥', '📤', '🎯'],
  items: [
    { hanzi: '里面', pinyin: 'li3mian4', meaning: 'inside', emoji: '📥', position: 0 },
    { hanzi: '外面', pinyin: 'wai4mian4', meaning: 'outside', emoji: '📤', position: 1 },
    { hanzi: '中间', pinyin: 'zhong1jian1', meaning: 'middle', emoji: '🎯', position: 2 },
    { hanzi: '前面', pinyin: 'qian2mian4', meaning: 'front', emoji: '⏫', position: 3 },
    { hanzi: '后面', pinyin: 'hou4mian4', meaning: 'back', emoji: '⏬', position: 4 },
    { hanzi: '旁边', pinyin: 'pang2bian1', meaning: 'beside', emoji: '↔️', position: 5 },
    { hanzi: '这里', pinyin: 'zhe4li3', meaning: 'here', emoji: '📍', position: 6 },
    { hanzi: '那里', pinyin: 'na4li3', meaning: 'there', emoji: '👉📍', position: 7 },
    { hanzi: '对面', pinyin: 'dui4mian4', meaning: 'opposite', emoji: '🔄', position: 8 },
  ],
};

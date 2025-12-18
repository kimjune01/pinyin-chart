/**
 * Colors Topic - Match color Hanzi to colored objects
 */

import type { Topic } from '../visualGameEngine';

export const colorsTopic: Topic = {
  id: 'colors',
  name: 'Colors',
  nameZh: '颜色',
  description: 'Match Chinese colors to colored objects',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['❤️', '💛', '💙'],
  items: [
    { hanzi: '红', pinyin: 'hong2', meaning: 'red', emoji: '❤️', position: 0 },
    { hanzi: '黄', pinyin: 'huang2', meaning: 'yellow', emoji: '💛', position: 1 },
    { hanzi: '蓝', pinyin: 'lan2', meaning: 'blue', emoji: '💙', position: 2 },
    { hanzi: '绿', pinyin: 'lv4', meaning: 'green', emoji: '💚', position: 3 },
    { hanzi: '白', pinyin: 'bai2', meaning: 'white', emoji: '🤍', position: 4 },
    { hanzi: '黑', pinyin: 'hei1', meaning: 'black', emoji: '🖤', position: 5 },
    { hanzi: '紫', pinyin: 'zi3', meaning: 'purple', emoji: '💜', position: 6 },
    { hanzi: '橙', pinyin: 'cheng2', meaning: 'orange', emoji: '🧡', position: 7 },
    { hanzi: '粉', pinyin: 'fen3', meaning: 'pink', emoji: '🩷', position: 8 },
  ],
};

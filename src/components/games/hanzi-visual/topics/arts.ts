/**
 * Arts & Crafts Topic - Match art supply Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const artsTopic: Topic = {
  id: 'arts',
  name: 'Arts & Crafts',
  nameZh: '美术',
  description: 'Match Chinese art supplies to emojis',
  category: 'activities',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🎨', '🖌️', '✂️'],
  items: [
    { hanzi: '画', pinyin: 'hua4', meaning: 'painting', emoji: '🖼️', position: 0 },
    { hanzi: '颜料', pinyin: 'yan2liao4', meaning: 'paint', emoji: '🎨', position: 1 },
    { hanzi: '画笔', pinyin: 'hua4bi3', meaning: 'paintbrush', emoji: '🖌️', position: 2 },
    { hanzi: '蜡笔', pinyin: 'la4bi3', meaning: 'crayon', emoji: '🖍️', position: 3 },
    { hanzi: '剪刀', pinyin: 'jian3dao1', meaning: 'scissors', emoji: '✂️', position: 4 },
    { hanzi: '胶水', pinyin: 'jiao1shui3', meaning: 'glue', emoji: '🧴', position: 5 },
    { hanzi: '纸', pinyin: 'zhi3', meaning: 'paper', emoji: '📄', position: 6 },
    { hanzi: '线', pinyin: 'xian4', meaning: 'thread', emoji: '🧵', position: 7 },
    { hanzi: '毛线', pinyin: 'mao2xian4', meaning: 'yarn', emoji: '🧶', position: 8 },
  ],
};

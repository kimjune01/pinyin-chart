/**
 * Math Topic - Match math operation Hanzi to symbols
 */

import type { Topic } from '../visualGameEngine';

export const mathTopic: Topic = {
  id: 'math',
  name: 'Math',
  nameZh: '数学',
  description: 'Match Chinese math terms to symbols',
  category: 'language',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['➕', '➖', '✖️'],
  items: [
    { hanzi: '加', pinyin: 'jia1', meaning: 'add', emoji: '➕', position: 0 },
    { hanzi: '减', pinyin: 'jian3', meaning: 'subtract', emoji: '➖', position: 1 },
    { hanzi: '乘', pinyin: 'cheng2', meaning: 'multiply', emoji: '✖️', position: 2 },
    { hanzi: '除', pinyin: 'chu2', meaning: 'divide', emoji: '➗', position: 3 },
    { hanzi: '等于', pinyin: 'deng3yu2', meaning: 'equals', emoji: '🟰', position: 4 },
    { hanzi: '大于', pinyin: 'da4yu2', meaning: 'greater than', emoji: '▶️', position: 5 },
    { hanzi: '小于', pinyin: 'xiao3yu2', meaning: 'less than', emoji: '◀️', position: 6 },
    { hanzi: '无穷', pinyin: 'wu2qiong2', meaning: 'infinity', emoji: '♾️', position: 7 },
    { hanzi: '百分比', pinyin: 'bai3fen1bi3', meaning: 'percent', emoji: '💯', position: 8 },
  ],
};

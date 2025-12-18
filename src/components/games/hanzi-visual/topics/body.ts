/**
 * Body Parts Topic - Match body part Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const bodyTopic: Topic = {
  id: 'body',
  name: 'Body',
  nameZh: '身体',
  description: 'Match Chinese body parts to emojis',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['👁️', '👂', '👃'],
  items: [
    { hanzi: '眼睛', pinyin: 'yan3jing1', meaning: 'eye', emoji: '👁️', position: 0 },
    { hanzi: '耳朵', pinyin: 'er3duo5', meaning: 'ear', emoji: '👂', position: 1 },
    { hanzi: '鼻子', pinyin: 'bi2zi5', meaning: 'nose', emoji: '👃', position: 2 },
    { hanzi: '嘴', pinyin: 'zui3', meaning: 'mouth', emoji: '👄', position: 3 },
    { hanzi: '手', pinyin: 'shou3', meaning: 'hand', emoji: '✋', position: 4 },
    { hanzi: '脚', pinyin: 'jiao3', meaning: 'foot', emoji: '🦶', position: 5 },
    { hanzi: '头', pinyin: 'tou2', meaning: 'head', emoji: '🗣️', position: 6 },
    { hanzi: '心', pinyin: 'xin1', meaning: 'heart', emoji: '❤️', position: 7 },
    { hanzi: '牙', pinyin: 'ya2', meaning: 'tooth', emoji: '🦷', position: 8 },
  ],
};

/**
 * Nature Topic - Match nature Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const natureTopic: Topic = {
  id: 'nature',
  name: 'Nature',
  nameZh: '自然',
  description: 'Match Chinese nature words to emojis',
  category: 'nature',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🌸', '🌳', '⛰️'],
  items: [
    { hanzi: '花', pinyin: 'hua1', meaning: 'flower', emoji: '🌸', position: 0 },
    { hanzi: '树', pinyin: 'shu4', meaning: 'tree', emoji: '🌳', position: 1 },
    { hanzi: '山', pinyin: 'shan1', meaning: 'mountain', emoji: '⛰️', position: 2 },
    { hanzi: '河', pinyin: 'he2', meaning: 'river', emoji: '🏞️', position: 3 },
    { hanzi: '海', pinyin: 'hai3', meaning: 'sea', emoji: '🌊', position: 4 },
    { hanzi: '草', pinyin: 'cao3', meaning: 'grass', emoji: '🌿', position: 5 },
    { hanzi: '星星', pinyin: 'xing1xing5', meaning: 'star', emoji: '⭐', position: 6 },
    { hanzi: '火', pinyin: 'huo3', meaning: 'fire', emoji: '🔥', position: 7 },
    { hanzi: '石头', pinyin: 'shi2tou5', meaning: 'rock', emoji: '🪨', position: 8 },
  ],
};

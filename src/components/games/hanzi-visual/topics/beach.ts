/**
 * Beach Topic - Match beach Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const beachTopic: Topic = {
  id: 'beach',
  name: 'Beach',
  nameZh: '海滩',
  description: 'Match Chinese beach words to emojis',
  category: 'nature',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🏖️', '🌊', '🏄'],
  items: [
    { hanzi: '海滩', pinyin: 'hai3tan1', meaning: 'beach', emoji: '🏖️', position: 0 },
    { hanzi: '海浪', pinyin: 'hai3lang4', meaning: 'wave', emoji: '🌊', position: 1 },
    { hanzi: '冲浪', pinyin: 'chong1lang4', meaning: 'surfing', emoji: '🏄', position: 2 },
    { hanzi: '岛', pinyin: 'dao3', meaning: 'island', emoji: '🏝️', position: 3 },
    { hanzi: '太阳伞', pinyin: 'tai4yang2san3', meaning: 'beach umbrella', emoji: '⛱️', position: 4 },
    { hanzi: '潜水', pinyin: 'qian2shui3', meaning: 'diving', emoji: '🤿', position: 5 },
    { hanzi: '快艇', pinyin: 'kuai4ting3', meaning: 'speedboat', emoji: '🚤', position: 6 },
    { hanzi: '锚', pinyin: 'mao2', meaning: 'anchor', emoji: '⚓', position: 7 },
    { hanzi: '沙子', pinyin: 'sha1zi5', meaning: 'sand', emoji: '🏖️🏝️', position: 8 },
  ],
};

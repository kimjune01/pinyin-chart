/**
 * Seasons Topic - Match season Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const seasonsTopic: Topic = {
  id: 'seasons',
  name: 'Seasons',
  nameZh: '季节',
  description: 'Match Chinese seasons to emojis',
  category: 'nature',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 2,
  previewEmojis: ['🌸', '☀️', '🍂', '❄️'],
  items: [
    { hanzi: '春天', pinyin: 'chun1tian1', meaning: 'spring', emoji: '🌸🌷', position: 0 },
    { hanzi: '夏天', pinyin: 'xia4tian1', meaning: 'summer', emoji: '☀️🏖️', position: 1 },
    { hanzi: '秋天', pinyin: 'qiu1tian1', meaning: 'autumn', emoji: '🍂🍁', position: 2 },
    { hanzi: '冬天', pinyin: 'dong1tian1', meaning: 'winter', emoji: '❄️☃️', position: 3 },
  ],
};

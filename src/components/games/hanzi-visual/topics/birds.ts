/**
 * Birds Topic - Match bird Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const birdsTopic: Topic = {
  id: 'birds',
  name: 'Birds',
  nameZh: '鸟类',
  description: 'Match Chinese birds to emojis',
  category: 'living-things',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🦅', '🦉', '🐧'],
  items: [
    { hanzi: '老鹰', pinyin: 'lao3ying1', meaning: 'eagle', emoji: '🦅', position: 0 },
    { hanzi: '鸭子', pinyin: 'ya1zi5', meaning: 'duck', emoji: '🦆', position: 1 },
    { hanzi: '天鹅', pinyin: 'tian1e2', meaning: 'swan', emoji: '🦢', position: 2 },
    { hanzi: '猫头鹰', pinyin: 'mao1tou2ying1', meaning: 'owl', emoji: '🦉', position: 3 },
    { hanzi: '孔雀', pinyin: 'kong3que4', meaning: 'peacock', emoji: '🦚', position: 4 },
    { hanzi: '鹦鹉', pinyin: 'ying1wu3', meaning: 'parrot', emoji: '🦜', position: 5 },
    { hanzi: '企鹅', pinyin: 'qi3e2', meaning: 'penguin', emoji: '🐧', position: 6 },
    { hanzi: '火烈鸟', pinyin: 'huo3lie4niao3', meaning: 'flamingo', emoji: '🦩', position: 7 },
    { hanzi: '鸽子', pinyin: 'ge1zi5', meaning: 'dove', emoji: '🕊️', position: 8 },
  ],
};

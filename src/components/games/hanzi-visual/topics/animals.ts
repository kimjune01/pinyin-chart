/**
 * Animals Topic - Match animal Hanzi to their emoji representations
 */

import type { Topic } from '../visualGameEngine';

export const animalsTopic: Topic = {
  id: 'animals',
  name: 'Animals',
  nameZh: '动物',
  description: 'Match animal characters to their emoji',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🐱', '🐕', '🐟'],
  items: [
    { hanzi: '猫', pinyin: 'mao1', meaning: 'cat', emoji: '🐱', position: 0 },
    { hanzi: '狗', pinyin: 'gou3', meaning: 'dog', emoji: '🐕', position: 1 },
    { hanzi: '鸟', pinyin: 'niao3', meaning: 'bird', emoji: '🐦', position: 2 },
    { hanzi: '鱼', pinyin: 'yu2', meaning: 'fish', emoji: '🐟', position: 3 },
    { hanzi: '马', pinyin: 'ma3', meaning: 'horse', emoji: '🐴', position: 4 },
    { hanzi: '牛', pinyin: 'niu2', meaning: 'cow/ox', emoji: '🐂', position: 5 },
  ],
};

/**
 * Animals Topic - Match animal Hanzi to their emoji representations
 */

import type { Topic } from '../visualGameEngine';

export const animalsTopic: Topic = {
  id: 'animals',
  name: 'Animals',
  nameZh: '动物',
  description: 'Match animal characters to their emoji',
  category: 'living-things',
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
    { hanzi: '牛', pinyin: 'niu2', meaning: 'cow', emoji: '🐄', position: 5 },
    { hanzi: '猪', pinyin: 'zhu1', meaning: 'pig', emoji: '🐷', position: 6 },
    { hanzi: '羊', pinyin: 'yang2', meaning: 'sheep', emoji: '🐑', position: 7 },
    { hanzi: '兔子', pinyin: 'tu4zi5', meaning: 'rabbit', emoji: '🐰', position: 8 },
    { hanzi: '鸡', pinyin: 'ji1', meaning: 'chicken', emoji: '🐔', position: 9 },
    { hanzi: '鸭子', pinyin: 'ya1zi5', meaning: 'duck', emoji: '🦆', position: 10 },
    { hanzi: '熊猫', pinyin: 'xiong2mao1', meaning: 'panda', emoji: '🐼', position: 11 },
  ],
};

/**
 * Reptiles Topic - Match reptile Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const reptilesTopic: Topic = {
  id: 'reptiles',
  name: 'Reptiles',
  nameZh: '爬行动物',
  description: 'Match Chinese reptiles to emojis',
  category: 'living-things',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🐍', '🐊', '🐢'],
  items: [
    { hanzi: '蛇', pinyin: 'she2', meaning: 'snake', emoji: '🐍', position: 0 },
    { hanzi: '蜥蜴', pinyin: 'xi1yi4', meaning: 'lizard', emoji: '🦎', position: 1 },
    { hanzi: '鳄鱼', pinyin: 'e4yu2', meaning: 'crocodile', emoji: '🐊', position: 2 },
    { hanzi: '乌龟', pinyin: 'wu1gui1', meaning: 'turtle', emoji: '🐢', position: 3 },
    { hanzi: '青蛙', pinyin: 'qing1wa1', meaning: 'frog', emoji: '🐸', position: 4 },
    { hanzi: '恐龙', pinyin: 'kong3long2', meaning: 'dinosaur', emoji: '🦖', position: 5 },
    { hanzi: '雷龙', pinyin: 'lei2long2', meaning: 'brontosaurus', emoji: '🦕', position: 6 },
    { hanzi: '变色龙', pinyin: 'bian4se4long2', meaning: 'chameleon', emoji: '🦎🌈', position: 7 },
    { hanzi: '蝎子', pinyin: 'xie1zi5', meaning: 'scorpion', emoji: '🦂', position: 8 },
  ],
};

/**
 * Wild Animals Topic - Match wild animal Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const wildanimalsTopic: Topic = {
  id: 'wildanimals',
  name: 'Wild Animals',
  nameZh: '野生动物',
  description: 'Match Chinese wild animals to emojis',
  category: 'living-things',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🦁', '🐯', '🐘'],
  items: [
    { hanzi: '狮子', pinyin: 'shi1zi5', meaning: 'lion', emoji: '🦁', position: 0 },
    { hanzi: '老虎', pinyin: 'lao3hu3', meaning: 'tiger', emoji: '🐯', position: 1 },
    { hanzi: '大象', pinyin: 'da4xiang4', meaning: 'elephant', emoji: '🐘', position: 2 },
    { hanzi: '长颈鹿', pinyin: 'chang2jing3lu4', meaning: 'giraffe', emoji: '🦒', position: 3 },
    { hanzi: '斑马', pinyin: 'ban1ma3', meaning: 'zebra', emoji: '🦓', position: 4 },
    { hanzi: '犀牛', pinyin: 'xi1niu2', meaning: 'rhino', emoji: '🦏', position: 5 },
    { hanzi: '熊', pinyin: 'xiong2', meaning: 'bear', emoji: '🐻', position: 6 },
    { hanzi: '考拉', pinyin: 'kao3la1', meaning: 'koala', emoji: '🐨', position: 7 },
    { hanzi: '袋鼠', pinyin: 'dai4shu3', meaning: 'kangaroo', emoji: '🦘', position: 8 },
  ],
};

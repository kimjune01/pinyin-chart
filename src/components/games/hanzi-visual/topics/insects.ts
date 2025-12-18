/**
 * Insects Topic - Match insect Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const insectsTopic: Topic = {
  id: 'insects',
  name: 'Insects',
  nameZh: '昆虫',
  description: 'Match Chinese insects to emojis',
  category: 'living-things',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🦋', '🐝', '🐜'],
  items: [
    { hanzi: '蝴蝶', pinyin: 'hu2die2', meaning: 'butterfly', emoji: '🦋', position: 0 },
    { hanzi: '蜜蜂', pinyin: 'mi4feng1', meaning: 'bee', emoji: '🐝', position: 1 },
    { hanzi: '蚂蚁', pinyin: 'ma3yi3', meaning: 'ant', emoji: '🐜', position: 2 },
    { hanzi: '瓢虫', pinyin: 'piao2chong2', meaning: 'ladybug', emoji: '🐞', position: 3 },
    { hanzi: '蜘蛛', pinyin: 'zhi1zhu1', meaning: 'spider', emoji: '🕷️', position: 4 },
    { hanzi: '蜗牛', pinyin: 'wo1niu2', meaning: 'snail', emoji: '🐌', position: 5 },
    { hanzi: '蚊子', pinyin: 'wen2zi5', meaning: 'mosquito', emoji: '🦟', position: 6 },
    { hanzi: '蟑螂', pinyin: 'zhang1lang2', meaning: 'cockroach', emoji: '🪳', position: 7 },
    { hanzi: '蟋蟀', pinyin: 'xi1shuai4', meaning: 'cricket', emoji: '🦗', position: 8 },
  ],
};

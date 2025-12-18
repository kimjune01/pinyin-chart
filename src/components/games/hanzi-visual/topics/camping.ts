/**
 * Camping Topic - Match camping Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const campingTopic: Topic = {
  id: 'camping',
  name: 'Camping',
  nameZh: '露营',
  description: 'Match Chinese camping words to emojis',
  category: 'activities',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['⛺', '🔥', '🏕️'],
  items: [
    { hanzi: '帐篷', pinyin: 'zhang4peng5', meaning: 'tent', emoji: '⛺', position: 0 },
    { hanzi: '篝火', pinyin: 'gou1huo3', meaning: 'campfire', emoji: '🔥', position: 1 },
    { hanzi: '露营地', pinyin: 'lu4ying2di4', meaning: 'campsite', emoji: '🏕️', position: 2 },
    { hanzi: '指南针', pinyin: 'zhi3nan2zhen1', meaning: 'compass', emoji: '🧭', position: 3 },
    { hanzi: '钓鱼', pinyin: 'diao4yu2', meaning: 'fishing', emoji: '🎣', position: 4 },
    { hanzi: '山', pinyin: 'shan1', meaning: 'mountain', emoji: '🏔️', position: 5 },
    { hanzi: '森林', pinyin: 'sen1lin2', meaning: 'forest', emoji: '🌲🌲', position: 6 },
    { hanzi: '小路', pinyin: 'xiao3lu4', meaning: 'trail', emoji: '🥾', position: 7 },
    { hanzi: '背包', pinyin: 'bei1bao1', meaning: 'backpack', emoji: '🎒', position: 8 },
  ],
};

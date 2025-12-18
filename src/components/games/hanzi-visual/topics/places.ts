/**
 * Places Topic - Match location Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const placesTopic: Topic = {
  id: 'places',
  name: 'Places',
  nameZh: '地方',
  description: 'Match Chinese places to emojis',
  category: 'places',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🏠', '🏫', '🏥'],
  items: [
    { hanzi: '家', pinyin: 'jia1', meaning: 'home', emoji: '🏠', position: 0 },
    { hanzi: '学校', pinyin: 'xue2xiao4', meaning: 'school', emoji: '🏫', position: 1 },
    { hanzi: '医院', pinyin: 'yi1yuan4', meaning: 'hospital', emoji: '🏥', position: 2 },
    { hanzi: '商店', pinyin: 'shang1dian4', meaning: 'shop', emoji: '🏪', position: 3 },
    { hanzi: '银行', pinyin: 'yin2hang2', meaning: 'bank', emoji: '🏦', position: 4 },
    { hanzi: '餐厅', pinyin: 'can1ting1', meaning: 'restaurant', emoji: '🍽️', position: 5 },
    { hanzi: '机场', pinyin: 'ji1chang3', meaning: 'airport', emoji: '🛫', position: 6 },
    { hanzi: '酒店', pinyin: 'jiu3dian4', meaning: 'hotel', emoji: '🏨', position: 7 },
    { hanzi: '公园', pinyin: 'gong1yuan2', meaning: 'park', emoji: '🌳🌷', position: 8 },
  ],
};

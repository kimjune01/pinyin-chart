/**
 * Jobs Topic - Match occupation Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const jobsTopic: Topic = {
  id: 'jobs',
  name: 'Jobs',
  nameZh: '职业',
  description: 'Match Chinese occupations to emojis',
  category: 'people',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['👨‍⚕️', '👨‍🏫', '👮'],
  items: [
    { hanzi: '医生', pinyin: 'yi1sheng1', meaning: 'doctor', emoji: '👨‍⚕️', position: 0 },
    { hanzi: '老师', pinyin: 'lao3shi1', meaning: 'teacher', emoji: '👨‍🏫', position: 1 },
    { hanzi: '警察', pinyin: 'jing3cha2', meaning: 'police', emoji: '👮', position: 2 },
    { hanzi: '厨师', pinyin: 'chu2shi1', meaning: 'chef', emoji: '👨‍🍳', position: 3 },
    { hanzi: '学生', pinyin: 'xue2sheng1', meaning: 'student', emoji: '🧑‍🎓', position: 4 },
    { hanzi: '司机', pinyin: 'si1ji1', meaning: 'driver', emoji: '🚗👨', position: 5 },
    { hanzi: '服务员', pinyin: 'fu2wu4yuan2', meaning: 'waiter', emoji: '🍽️👨', position: 6 },
    { hanzi: '农民', pinyin: 'nong2min2', meaning: 'farmer', emoji: '👨‍🌾', position: 7 },
    { hanzi: '工人', pinyin: 'gong1ren2', meaning: 'worker', emoji: '👷', position: 8 },
  ],
};

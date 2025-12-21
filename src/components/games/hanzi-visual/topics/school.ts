/**
 * School Topic - Match school item Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const schoolTopic: Topic = {
  id: 'school',
  name: 'School',
  nameZh: '学校',
  description: 'Match Chinese school items to emojis',
  category: 'places',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['📚', '✏️', '🎒'],
  items: [
    { hanzi: '书', pinyin: 'shu1', meaning: 'book', emoji: '📚', position: 0 },
    { hanzi: '笔', pinyin: 'bi3', meaning: 'pen', emoji: '✏️', position: 1 },
    { hanzi: '书包', pinyin: 'shu1bao1', meaning: 'backpack', emoji: '🎒', position: 2 },
    { hanzi: '本子', pinyin: 'ben3zi5', meaning: 'notebook', emoji: '📓', position: 3 },
    { hanzi: '尺子', pinyin: 'chi3zi5', meaning: 'ruler', emoji: '📏', position: 4 },
    { hanzi: '铅笔', pinyin: 'qian1bi3', meaning: 'pencil', emoji: '✏️', position: 5 },
    { hanzi: '剪刀', pinyin: 'jian3dao1', meaning: 'scissors', emoji: '✂️', position: 6 },
    { hanzi: '考试', pinyin: 'kao3shi4', meaning: 'exam', emoji: '📝✍️', position: 7 },
    { hanzi: '作业', pinyin: 'zuo4ye4', meaning: 'homework', emoji: '📄✏️', position: 8 },
  ],
};

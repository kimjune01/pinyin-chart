/**
 * Baby Topic - Match baby Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const babyTopic: Topic = {
  id: 'baby',
  name: 'Baby',
  nameZh: '宝宝',
  description: 'Match Chinese baby words to emojis',
  category: 'people',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['👶', '🍼', '🧸'],
  items: [
    { hanzi: '宝宝', pinyin: 'bao3bao5', meaning: 'baby', emoji: '👶', position: 0 },
    { hanzi: '奶瓶', pinyin: 'nai3ping2', meaning: 'bottle', emoji: '🍼', position: 1 },
    { hanzi: '玩具熊', pinyin: 'wan2ju4xiong2', meaning: 'teddy bear', emoji: '🧸', position: 2 },
    { hanzi: '旋转木马', pinyin: 'xuan2zhuan3mu4ma3', meaning: 'carousel', emoji: '🎠', position: 3 },
    { hanzi: '风筝', pinyin: 'feng1zheng5', meaning: 'kite', emoji: '🪁', position: 4 },
    { hanzi: '悠悠球', pinyin: 'you1you1qiu2', meaning: 'yo-yo', emoji: '🪀', position: 5 },
    { hanzi: '摩天轮', pinyin: 'mo2tian1lun2', meaning: 'ferris wheel', emoji: '🎡', position: 6 },
    { hanzi: '过山车', pinyin: 'guo4shan1che1', meaning: 'roller coaster', emoji: '🎢', position: 7 },
    { hanzi: '气球', pinyin: 'qi4qiu2', meaning: 'balloon', emoji: '🎈', position: 8 },
  ],
};

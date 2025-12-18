/**
 * Cleaning Topic - Match cleaning Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const cleaningTopic: Topic = {
  id: 'cleaning',
  name: 'Cleaning',
  nameZh: '打扫',
  description: 'Match Chinese cleaning items to emojis',
  category: 'objects',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🧹', '🧽', '🧼'],
  items: [
    { hanzi: '扫帚', pinyin: 'sao4zhou5', meaning: 'broom', emoji: '🧹', position: 0 },
    { hanzi: '海绵', pinyin: 'hai3mian2', meaning: 'sponge', emoji: '🧽', position: 1 },
    { hanzi: '肥皂', pinyin: 'fei2zao4', meaning: 'soap', emoji: '🧼', position: 2 },
    { hanzi: '水桶', pinyin: 'shui3tong3', meaning: 'bucket', emoji: '🪣', position: 3 },
    { hanzi: '洗衣篮', pinyin: 'xi3yi1lan2', meaning: 'laundry basket', emoji: '🧺', position: 4 },
    { hanzi: '洗发水', pinyin: 'xi3fa4shui3', meaning: 'shampoo', emoji: '🧴', position: 5 },
    { hanzi: '卫生纸', pinyin: 'wei4sheng1zhi3', meaning: 'toilet paper', emoji: '🧻', position: 6 },
    { hanzi: '牙刷', pinyin: 'ya2shua1', meaning: 'toothbrush', emoji: '🪥', position: 7 },
    { hanzi: '毛巾', pinyin: 'mao2jin1', meaning: 'towel', emoji: '🛁', position: 8 },
  ],
};

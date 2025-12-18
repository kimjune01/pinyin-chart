/**
 * Transportation Topic - Match vehicle Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const transportTopic: Topic = {
  id: 'transport',
  name: 'Transport',
  nameZh: '交通',
  description: 'Match Chinese vehicles to emojis',
  category: 'objects',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🚗', '✈️', '🚂'],
  items: [
    { hanzi: '车', pinyin: 'che1', meaning: 'car', emoji: '🚗', position: 0 },
    { hanzi: '飞机', pinyin: 'fei1ji1', meaning: 'airplane', emoji: '✈️', position: 1 },
    { hanzi: '火车', pinyin: 'huo3che1', meaning: 'train', emoji: '🚂', position: 2 },
    { hanzi: '船', pinyin: 'chuan2', meaning: 'boat', emoji: '🚢', position: 3 },
    { hanzi: '公共汽车', pinyin: 'gong1gong4qi4che1', meaning: 'bus', emoji: '🚌', position: 4 },
    { hanzi: '自行车', pinyin: 'zi4xing2che1', meaning: 'bicycle', emoji: '🚲', position: 5 },
    { hanzi: '出租车', pinyin: 'chu1zu1che1', meaning: 'taxi', emoji: '🚕', position: 6 },
    { hanzi: '地铁', pinyin: 'di4tie3', meaning: 'subway', emoji: '🚇', position: 7 },
    { hanzi: '摩托车', pinyin: 'mo2tuo1che1', meaning: 'motorcycle', emoji: '🏍️', position: 8 },
  ],
};

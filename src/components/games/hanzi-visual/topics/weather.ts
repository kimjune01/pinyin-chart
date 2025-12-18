/**
 * Weather Topic - Match weather/nature Hanzi to their emoji representations
 */

import type { Topic } from '../visualGameEngine';

export const weatherTopic: Topic = {
  id: 'weather',
  name: 'Weather & Nature',
  nameZh: '天气',
  description: 'Match weather and nature words to their emoji',
  category: 'nature',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['☀️', '🌧️', '🌙'],
  items: [
    { hanzi: '日', pinyin: 'ri4', meaning: 'sun/day', emoji: '☀️', position: 0 },
    { hanzi: '月', pinyin: 'yue4', meaning: 'moon/month', emoji: '🌙', position: 1 },
    { hanzi: '雨', pinyin: 'yu3', meaning: 'rain', emoji: '🌧️', position: 2 },
    { hanzi: '云', pinyin: 'yun2', meaning: 'cloud', emoji: '☁️', position: 3 },
    { hanzi: '风', pinyin: 'feng1', meaning: 'wind', emoji: '🌬️', position: 4 },
    { hanzi: '雪', pinyin: 'xue3', meaning: 'snow', emoji: '❄️', position: 5 },
  ],
};

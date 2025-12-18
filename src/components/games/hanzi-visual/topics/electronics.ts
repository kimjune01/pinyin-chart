/**
 * Electronics Topic - Match electronics Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const electronicsTopic: Topic = {
  id: 'electronics',
  name: 'Electronics',
  nameZh: '电子产品',
  description: 'Match Chinese electronics to emojis',
  category: 'objects',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['📱', '💻', '🎮'],
  items: [
    { hanzi: '手机', pinyin: 'shou3ji1', meaning: 'phone', emoji: '📱', position: 0 },
    { hanzi: '电脑', pinyin: 'dian4nao3', meaning: 'laptop', emoji: '💻', position: 1 },
    { hanzi: '游戏机', pinyin: 'you2xi4ji1', meaning: 'game console', emoji: '🎮', position: 2 },
    { hanzi: '电视', pinyin: 'dian4shi4', meaning: 'TV', emoji: '📺', position: 3 },
    { hanzi: '相机', pinyin: 'xiang4ji1', meaning: 'camera', emoji: '📷', position: 4 },
    { hanzi: '键盘', pinyin: 'jian4pan2', meaning: 'keyboard', emoji: '⌨️', position: 5 },
    { hanzi: '鼠标', pinyin: 'shu3biao1', meaning: 'mouse', emoji: '🖱️', position: 6 },
    { hanzi: '插头', pinyin: 'cha1tou2', meaning: 'plug', emoji: '🔌', position: 7 },
    { hanzi: '电池', pinyin: 'dian4chi2', meaning: 'battery', emoji: '🔋', position: 8 },
  ],
};

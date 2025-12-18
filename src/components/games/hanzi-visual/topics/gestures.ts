/**
 * Gestures Topic - Match gesture Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const gesturesTopic: Topic = {
  id: 'gestures',
  name: 'Gestures',
  nameZh: '手势',
  description: 'Match Chinese gestures to emojis',
  category: 'people',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['👍', '👎', '👏'],
  items: [
    { hanzi: '好', pinyin: 'hao3', meaning: 'good', emoji: '👍', position: 0 },
    { hanzi: '不好', pinyin: 'bu4hao3', meaning: 'bad', emoji: '👎', position: 1 },
    { hanzi: '鼓掌', pinyin: 'gu3zhang3', meaning: 'clap', emoji: '👏', position: 2 },
    { hanzi: '握手', pinyin: 'wo4shou3', meaning: 'handshake', emoji: '🤝', position: 3 },
    { hanzi: '挥手', pinyin: 'hui1shou3', meaning: 'wave', emoji: '👋', position: 4 },
    { hanzi: '祈祷', pinyin: 'qi2dao3', meaning: 'pray', emoji: '🙏', position: 5 },
    { hanzi: '拳头', pinyin: 'quan2tou5', meaning: 'fist', emoji: '✊', position: 6 },
    { hanzi: '胜利', pinyin: 'sheng4li4', meaning: 'victory', emoji: '✌️', position: 7 },
    { hanzi: '爱心', pinyin: 'ai4xin1', meaning: 'love', emoji: '🫶', position: 8 },
  ],
};

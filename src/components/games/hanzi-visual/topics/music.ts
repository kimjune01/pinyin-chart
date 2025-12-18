/**
 * Music Topic - Match instrument Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const musicTopic: Topic = {
  id: 'music',
  name: 'Music',
  nameZh: '音乐',
  description: 'Match Chinese instruments to emojis',
  category: 'activities',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🎸', '🎹', '🥁'],
  items: [
    { hanzi: '吉他', pinyin: 'ji2ta1', meaning: 'guitar', emoji: '🎸', position: 0 },
    { hanzi: '钢琴', pinyin: 'gang1qin2', meaning: 'piano', emoji: '🎹', position: 1 },
    { hanzi: '鼓', pinyin: 'gu3', meaning: 'drum', emoji: '🥁', position: 2 },
    { hanzi: '小提琴', pinyin: 'xiao3ti2qin2', meaning: 'violin', emoji: '🎻', position: 3 },
    { hanzi: '萨克斯', pinyin: 'sa4ke4si1', meaning: 'saxophone', emoji: '🎷', position: 4 },
    { hanzi: '喇叭', pinyin: 'la3ba5', meaning: 'trumpet', emoji: '🎺', position: 5 },
    { hanzi: '麦克风', pinyin: 'mai4ke4feng1', meaning: 'microphone', emoji: '🎤', position: 6 },
    { hanzi: '耳机', pinyin: 'er3ji1', meaning: 'headphones', emoji: '🎧', position: 7 },
    { hanzi: '音乐', pinyin: 'yin1yue4', meaning: 'music', emoji: '🎵🎶', position: 8 },
  ],
};

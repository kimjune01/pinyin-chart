/**
 * Emotions Topic - Match emotion Hanzi to face emojis
 */

import type { Topic } from '../visualGameEngine';

export const emotionsTopic: Topic = {
  id: 'emotions',
  name: 'Emotions',
  nameZh: '情绪',
  description: 'Match Chinese emotions to face emojis',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['😊', '😢', '😠'],
  items: [
    { hanzi: '高兴', pinyin: 'gao1xing4', meaning: 'happy', emoji: '😊', position: 0 },
    { hanzi: '难过', pinyin: 'nan2guo4', meaning: 'sad', emoji: '😢', position: 1 },
    { hanzi: '生气', pinyin: 'sheng1qi4', meaning: 'angry', emoji: '😠', position: 2 },
    { hanzi: '害怕', pinyin: 'hai4pa4', meaning: 'scared', emoji: '😨', position: 3 },
    { hanzi: '惊讶', pinyin: 'jing1ya4', meaning: 'surprised', emoji: '😲', position: 4 },
    { hanzi: '累', pinyin: 'lei4', meaning: 'tired', emoji: '😴', position: 5 },
    { hanzi: '爱', pinyin: 'ai4', meaning: 'love', emoji: '🥰', position: 6 },
    { hanzi: '紧张', pinyin: 'jin3zhang1', meaning: 'nervous', emoji: '😰', position: 7 },
    { hanzi: '无聊', pinyin: 'wu2liao2', meaning: 'bored', emoji: '😑', position: 8 },
  ],
};

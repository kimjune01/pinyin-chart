/**
 * Pronouns Topic - Match pronoun Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const pronounsTopic: Topic = {
  id: 'pronouns',
  name: 'Pronouns',
  nameZh: '代词',
  description: 'Match Chinese pronouns to emojis',
  category: 'people',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🙋', '👨', '👩'],
  items: [
    { hanzi: '我', pinyin: 'wo3', meaning: 'I/me', emoji: '🙋', position: 0 },
    { hanzi: '你', pinyin: 'ni3', meaning: 'you', emoji: '👆😀', position: 1 },
    { hanzi: '他', pinyin: 'ta1', meaning: 'he', emoji: '👨', position: 2 },
    { hanzi: '她', pinyin: 'ta1', meaning: 'she', emoji: '👩', position: 3 },
    { hanzi: '我们', pinyin: 'wo3men5', meaning: 'we', emoji: '👥', position: 4 },
    { hanzi: '你们', pinyin: 'ni3men5', meaning: 'you (plural)', emoji: '👆👆', position: 5 },
    { hanzi: '他们', pinyin: 'ta1men5', meaning: 'they', emoji: '👨👩', position: 6 },
    { hanzi: '这', pinyin: 'zhe4', meaning: 'this', emoji: '👇📍', position: 7 },
    { hanzi: '那', pinyin: 'na4', meaning: 'that', emoji: '👉📍', position: 8 },
  ],
};

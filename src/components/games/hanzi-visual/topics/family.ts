/**
 * Family Topic - Match family member Hanzi using tree diagram
 */

import type { Topic } from '../visualGameEngine';

export const familyTopic: Topic = {
  id: 'family',
  name: 'Family',
  nameZh: '家庭',
  description: 'Find family members on the family tree',
  difficulty: 2,
  layoutType: 'family-tree',
  previewEmojis: ['👴', '👨', '👶'],
  items: [
    // Grandparents level
    { hanzi: '爷爷', pinyin: 'ye2ye5', meaning: 'grandpa (paternal)', emoji: '👴', position: 'gp-left' },
    { hanzi: '奶奶', pinyin: 'nai3nai5', meaning: 'grandma (paternal)', emoji: '👵', position: 'gp-right' },
    // Parents level
    { hanzi: '爸爸', pinyin: 'ba4ba5', meaning: 'father', emoji: '👨', position: 'p-left' },
    { hanzi: '妈妈', pinyin: 'ma1ma5', meaning: 'mother', emoji: '👩', position: 'p-right' },
    // Siblings level (with self)
    { hanzi: '哥哥', pinyin: 'ge1ge5', meaning: 'older brother', emoji: '🧔', position: 's-left' },
    { hanzi: '我', pinyin: 'wo3', meaning: 'me', emoji: '🙋', position: 's-center', isSelf: true },
    { hanzi: '妹妹', pinyin: 'mei4mei5', meaning: 'younger sister', emoji: '👧', position: 's-right' },
    // Children level
    { hanzi: '儿子', pinyin: 'er2zi5', meaning: 'son', emoji: '👦', position: 'gc-left' },
    { hanzi: '女儿', pinyin: 'nv3er2', meaning: 'daughter', emoji: '👧', position: 'gc-right' },
  ],
};

/**
 * Actions Topic - Match action/verb Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const actionsTopic: Topic = {
  id: 'actions',
  name: 'Actions',
  nameZh: '动作',
  description: 'Match Chinese verbs to emojis',
  category: 'language',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 4,
  previewEmojis: ['🍽️', '😴', '🏃', '✍️'],
  items: [
    { hanzi: '吃', pinyin: 'chi1', meaning: 'eat', emoji: '🍽️😋', position: 0 },
    { hanzi: '喝', pinyin: 'he1', meaning: 'drink', emoji: '🥤', position: 1 },
    { hanzi: '睡觉', pinyin: 'shui4jiao4', meaning: 'sleep', emoji: '😴🛏️', position: 2 },
    { hanzi: '走', pinyin: 'zou3', meaning: 'walk', emoji: '🚶', position: 3 },
    { hanzi: '跑', pinyin: 'pao3', meaning: 'run', emoji: '🏃', position: 4 },
    { hanzi: '看', pinyin: 'kan4', meaning: 'look', emoji: '👀', position: 5 },
    { hanzi: '听', pinyin: 'ting1', meaning: 'listen', emoji: '👂🎵', position: 6 },
    { hanzi: '说', pinyin: 'shuo1', meaning: 'speak', emoji: '🗣️', position: 7 },
    { hanzi: '写', pinyin: 'xie3', meaning: 'write', emoji: '✍️', position: 8 },
    { hanzi: '读', pinyin: 'du2', meaning: 'read', emoji: '📖👁️', position: 9 },
    { hanzi: '坐', pinyin: 'zuo4', meaning: 'sit', emoji: '🪑', position: 10 },
    { hanzi: '站', pinyin: 'zhan4', meaning: 'stand', emoji: '🧍', position: 11 },
    { hanzi: '开', pinyin: 'kai1', meaning: 'open', emoji: '🚪➡️', position: 12 },
    { hanzi: '关', pinyin: 'guan1', meaning: 'close', emoji: '🚪⬅️', position: 13 },
    { hanzi: '找', pinyin: 'zhao3', meaning: 'look for', emoji: '🔍', position: 14 },
    { hanzi: '等', pinyin: 'deng3', meaning: 'wait', emoji: '⏳', position: 15 },
  ],
};

/**
 * Sports Topic - Match sport/activity Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const sportsTopic: Topic = {
  id: 'sports',
  name: 'Sports',
  nameZh: '运动',
  description: 'Match Chinese sports to emojis',
  category: 'activities',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['⚽', '🏀', '🏊'],
  items: [
    { hanzi: '足球', pinyin: 'zu2qiu2', meaning: 'soccer', emoji: '⚽', position: 0 },
    { hanzi: '篮球', pinyin: 'lan2qiu2', meaning: 'basketball', emoji: '🏀', position: 1 },
    { hanzi: '游泳', pinyin: 'you2yong3', meaning: 'swimming', emoji: '🏊', position: 2 },
    { hanzi: '跑步', pinyin: 'pao3bu4', meaning: 'running', emoji: '🏃', position: 3 },
    { hanzi: '网球', pinyin: 'wang3qiu2', meaning: 'tennis', emoji: '🎾', position: 4 },
    { hanzi: '乒乓球', pinyin: 'ping1pang1qiu2', meaning: 'ping pong', emoji: '🏓', position: 5 },
    { hanzi: '羽毛球', pinyin: 'yu3mao2qiu2', meaning: 'badminton', emoji: '🏸', position: 6 },
    { hanzi: '滑雪', pinyin: 'hua2xue3', meaning: 'skiing', emoji: '⛷️', position: 7 },
    { hanzi: '骑马', pinyin: 'qi2ma3', meaning: 'horse riding', emoji: '🏇', position: 8 },
  ],
};

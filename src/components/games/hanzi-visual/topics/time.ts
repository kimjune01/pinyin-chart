/**
 * Time Topic - Match time-related Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const timeTopic: Topic = {
  id: 'time',
  name: 'Time',
  nameZh: '时间',
  description: 'Match Chinese time words to emojis',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🌅', '🌙', '📅'],
  items: [
    { hanzi: '早上', pinyin: 'zao3shang5', meaning: 'morning', emoji: '🌅', position: 0 },
    { hanzi: '中午', pinyin: 'zhong1wu3', meaning: 'noon', emoji: '☀️', position: 1 },
    { hanzi: '晚上', pinyin: 'wan3shang5', meaning: 'evening', emoji: '🌙', position: 2 },
    { hanzi: '今天', pinyin: 'jin1tian1', meaning: 'today', emoji: '📅', position: 3 },
    { hanzi: '明天', pinyin: 'ming2tian1', meaning: 'tomorrow', emoji: '🔜', position: 4 },
    { hanzi: '昨天', pinyin: 'zuo2tian1', meaning: 'yesterday', emoji: '🔙', position: 5 },
    { hanzi: '现在', pinyin: 'xian4zai4', meaning: 'now', emoji: '⏰', position: 6 },
    { hanzi: '年', pinyin: 'nian2', meaning: 'year', emoji: '🗓️', position: 7 },
    { hanzi: '生日', pinyin: 'sheng1ri4', meaning: 'birthday', emoji: '🎂', position: 8 },
  ],
};

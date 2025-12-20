/**
 * Opposites Topic - Match opposite word Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const oppositesTopic: Topic = {
  id: 'opposites',
  name: 'Opposites',
  nameZh: '反义词',
  description: 'Match Chinese opposites to emojis',
  category: 'language',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 2,
  shuffleMode: 'pairs',
  previewEmojis: ['🐘', '🐜', '🔥', '❄️'],
  items: [
    { hanzi: '大', pinyin: 'da4', meaning: 'big', emoji: '🐘', position: 0 },
    { hanzi: '小', pinyin: 'xiao3', meaning: 'small', emoji: '🐜', position: 1 },
    { hanzi: '高', pinyin: 'gao1', meaning: 'tall', emoji: '🦒', position: 2 },
    { hanzi: '矮', pinyin: 'ai3', meaning: 'short', emoji: '🐁', position: 3 },
    { hanzi: '快', pinyin: 'kuai4', meaning: 'fast', emoji: '🐇', position: 4 },
    { hanzi: '慢', pinyin: 'man4', meaning: 'slow', emoji: '🐢', position: 5 },
    { hanzi: '热', pinyin: 're4', meaning: 'hot', emoji: '🔥', position: 6 },
    { hanzi: '冷', pinyin: 'leng3', meaning: 'cold', emoji: '❄️', position: 7 },
    { hanzi: '重', pinyin: 'zhong4', meaning: 'heavy', emoji: '🏋️', position: 8 },
    { hanzi: '轻', pinyin: 'qing1', meaning: 'light', emoji: '🪶', position: 9 },
    { hanzi: '长', pinyin: 'chang2', meaning: 'long', emoji: '🐍', position: 10 },
    { hanzi: '短', pinyin: 'duan3', meaning: 'short', emoji: '🐛', position: 11 },
    { hanzi: '新', pinyin: 'xin1', meaning: 'new', emoji: '✨📦', position: 12 },
    { hanzi: '旧', pinyin: 'jiu4', meaning: 'old', emoji: '📦🧓', position: 13 },
    { hanzi: '远', pinyin: 'yuan3', meaning: 'far', emoji: '🏔️', position: 14 },
    { hanzi: '近', pinyin: 'jin4', meaning: 'near', emoji: '🤏', position: 15 },
    { hanzi: '多', pinyin: 'duo1', meaning: 'many', emoji: '🍎🍎🍎', position: 16 },
    { hanzi: '少', pinyin: 'shao3', meaning: 'few', emoji: '🍎', position: 17 },
    { hanzi: '对', pinyin: 'dui4', meaning: 'correct', emoji: '✅', position: 18 },
    { hanzi: '错', pinyin: 'cuo4', meaning: 'wrong', emoji: '❌', position: 19 },
  ],
};

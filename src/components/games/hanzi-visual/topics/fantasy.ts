/**
 * Fantasy Topic - Match fantasy Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const fantasyTopic: Topic = {
  id: 'fantasy',
  name: 'Fantasy',
  nameZh: '幻想',
  description: 'Match Chinese fantasy words to emojis',
  category: 'other',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🧙‍♂️', '🧚', '🦄'],
  items: [
    { hanzi: '魔法师', pinyin: 'mo2fa3shi1', meaning: 'wizard', emoji: '🧙‍♂️', position: 0 },
    { hanzi: '仙女', pinyin: 'xian1nv3', meaning: 'fairy', emoji: '🧚', position: 1 },
    { hanzi: '独角兽', pinyin: 'du2jiao3shou4', meaning: 'unicorn', emoji: '🦄', position: 2 },
    { hanzi: '龙', pinyin: 'long2', meaning: 'dragon', emoji: '🐲', position: 3 },
    { hanzi: '公主', pinyin: 'gong1zhu3', meaning: 'princess', emoji: '👸', position: 4 },
    { hanzi: '王子', pinyin: 'wang2zi3', meaning: 'prince', emoji: '🤴', position: 5 },
    { hanzi: '幽灵', pinyin: 'you1ling2', meaning: 'ghost', emoji: '👻', position: 6 },
    { hanzi: '美人鱼', pinyin: 'mei3ren2yu2', meaning: 'mermaid', emoji: '🧜‍♀️', position: 7 },
    { hanzi: '城堡', pinyin: 'cheng2bao3', meaning: 'castle', emoji: '🏰', position: 8 },
  ],
};

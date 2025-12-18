/**
 * Countries Topic - Match country Hanzi to flag emojis
 */

import type { Topic } from '../visualGameEngine';

export const countriesTopic: Topic = {
  id: 'countries',
  name: 'Countries',
  nameZh: '国家',
  description: 'Match Chinese country names to flags',
  category: 'places',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🇨🇳', '🇺🇸', '🇯🇵'],
  items: [
    { hanzi: '中国', pinyin: 'zhong1guo2', meaning: 'China', emoji: '🇨🇳', position: 0 },
    { hanzi: '美国', pinyin: 'mei3guo2', meaning: 'USA', emoji: '🇺🇸', position: 1 },
    { hanzi: '日本', pinyin: 'ri4ben3', meaning: 'Japan', emoji: '🇯🇵', position: 2 },
    { hanzi: '韩国', pinyin: 'han2guo2', meaning: 'Korea', emoji: '🇰🇷', position: 3 },
    { hanzi: '英国', pinyin: 'ying1guo2', meaning: 'UK', emoji: '🇬🇧', position: 4 },
    { hanzi: '法国', pinyin: 'fa3guo2', meaning: 'France', emoji: '🇫🇷', position: 5 },
    { hanzi: '德国', pinyin: 'de2guo2', meaning: 'Germany', emoji: '🇩🇪', position: 6 },
    { hanzi: '加拿大', pinyin: 'jia1na2da4', meaning: 'Canada', emoji: '🇨🇦', position: 7 },
    { hanzi: '澳大利亚', pinyin: 'ao4da4li4ya4', meaning: 'Australia', emoji: '🇦🇺', position: 8 },
  ],
};

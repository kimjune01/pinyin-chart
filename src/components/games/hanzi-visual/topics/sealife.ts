/**
 * Sea Life Topic - Match sea creature Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const sealifeTopic: Topic = {
  id: 'sealife',
  name: 'Sea Life',
  nameZh: '海洋生物',
  description: 'Match Chinese sea creatures to emojis',
  category: 'living-things',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🐙', '🦈', '🐬'],
  items: [
    { hanzi: '章鱼', pinyin: 'zhang1yu2', meaning: 'octopus', emoji: '🐙', position: 0 },
    { hanzi: '虾', pinyin: 'xia1', meaning: 'shrimp', emoji: '🦐', position: 1 },
    { hanzi: '螃蟹', pinyin: 'pang2xie4', meaning: 'crab', emoji: '🦀', position: 2 },
    { hanzi: '鲨鱼', pinyin: 'sha1yu2', meaning: 'shark', emoji: '🦈', position: 3 },
    { hanzi: '海豚', pinyin: 'hai3tun2', meaning: 'dolphin', emoji: '🐬', position: 4 },
    { hanzi: '鲸鱼', pinyin: 'jing1yu2', meaning: 'whale', emoji: '🐳', position: 5 },
    { hanzi: '乌贼', pinyin: 'wu1zei2', meaning: 'squid', emoji: '🦑', position: 6 },
    { hanzi: '贝壳', pinyin: 'bei4ke2', meaning: 'shell', emoji: '🐚', position: 7 },
    { hanzi: '海龟', pinyin: 'hai3gui1', meaning: 'sea turtle', emoji: '🐢', position: 8 },
  ],
};

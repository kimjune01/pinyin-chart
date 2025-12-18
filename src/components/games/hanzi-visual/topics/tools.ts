/**
 * Tools Topic - Match tool Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const toolsTopic: Topic = {
  id: 'tools',
  name: 'Tools',
  nameZh: '工具',
  description: 'Match Chinese tools to emojis',
  category: 'objects',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['✂️', '🔨', '🔧'],
  items: [
    { hanzi: '剪刀', pinyin: 'jian3dao1', meaning: 'scissors', emoji: '✂️', position: 0 },
    { hanzi: '锤子', pinyin: 'chui2zi5', meaning: 'hammer', emoji: '🔨', position: 1 },
    { hanzi: '扳手', pinyin: 'ban1shou3', meaning: 'wrench', emoji: '🔧', position: 2 },
    { hanzi: '螺丝刀', pinyin: 'luo2si1dao1', meaning: 'screwdriver', emoji: '🪛', position: 3 },
    { hanzi: '刷子', pinyin: 'shua1zi5', meaning: 'brush', emoji: '🖌️', position: 4 },
    { hanzi: '锯子', pinyin: 'ju4zi5', meaning: 'saw', emoji: '🪚', position: 5 },
    { hanzi: '尺子', pinyin: 'chi3zi5', meaning: 'ruler', emoji: '📏', position: 6 },
    { hanzi: '手电筒', pinyin: 'shou3dian4tong3', meaning: 'flashlight', emoji: '🔦', position: 7 },
    { hanzi: '放大镜', pinyin: 'fang4da4jing4', meaning: 'magnifier', emoji: '🔍', position: 8 },
  ],
};

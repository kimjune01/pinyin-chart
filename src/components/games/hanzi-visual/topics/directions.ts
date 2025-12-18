/**
 * Directions Topic - Match directional Hanzi using spatial layout
 */

import type { Topic } from '../visualGameEngine';

export const directionsTopic: Topic = {
  id: 'directions',
  name: 'Directions',
  nameZh: '方向',
  description: 'Click the correct direction on the compass',
  category: 'language',
  difficulty: 2,
  layoutType: 'direction-diagram',
  previewEmojis: ['⬆️', '⬇️', '⬅️'],
  items: [
    { hanzi: '上', pinyin: 'shang4', meaning: 'up/above', emoji: '⬆️', position: 'top' },
    { hanzi: '下', pinyin: 'xia4', meaning: 'down/below', emoji: '⬇️', position: 'bottom' },
    { hanzi: '左', pinyin: 'zuo3', meaning: 'left', emoji: '⬅️', position: 'left' },
    { hanzi: '右', pinyin: 'you4', meaning: 'right', emoji: '➡️', position: 'right' },
  ],
};

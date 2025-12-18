/**
 * Fruits & Food Topic - Match food Hanzi to their emoji representations
 */

import type { Topic } from '../visualGameEngine';

export const fruitsTopic: Topic = {
  id: 'fruits',
  name: 'Fruits',
  nameZh: '水果',
  description: 'Match fruit words to their emoji',
  category: 'food-drink',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🍎', '🍊', '🍇'],
  items: [
    { hanzi: '苹果', pinyin: 'ping2guo3', meaning: 'apple', emoji: '🍎', position: 0 },
    { hanzi: '橙子', pinyin: 'cheng2zi5', meaning: 'orange', emoji: '🍊', position: 1 },
    { hanzi: '葡萄', pinyin: 'pu2tao5', meaning: 'grape', emoji: '🍇', position: 2 },
    { hanzi: '香蕉', pinyin: 'xiang1jiao1', meaning: 'banana', emoji: '🍌', position: 3 },
    { hanzi: '草莓', pinyin: 'cao3mei2', meaning: 'strawberry', emoji: '🍓', position: 4 },
    { hanzi: '西瓜', pinyin: 'xi1gua1', meaning: 'watermelon', emoji: '🍉', position: 5 },
    { hanzi: '桃子', pinyin: 'tao2zi5', meaning: 'peach', emoji: '🍑', position: 6 },
    { hanzi: '梨', pinyin: 'li2', meaning: 'pear', emoji: '🍐', position: 7 },
    { hanzi: '柠檬', pinyin: 'ning2meng2', meaning: 'lemon', emoji: '🍋', position: 8 },
  ],
};

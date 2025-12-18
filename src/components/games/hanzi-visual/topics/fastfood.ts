/**
 * Fast Food Topic - Match fast food Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const fastfoodTopic: Topic = {
  id: 'fastfood',
  name: 'Fast Food',
  nameZh: '快餐',
  description: 'Match Chinese fast food to emojis',
  category: 'food-drink',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['🍕', '🍔', '🍟'],
  items: [
    { hanzi: '披萨', pinyin: 'pi1sa4', meaning: 'pizza', emoji: '🍕', position: 0 },
    { hanzi: '汉堡', pinyin: 'han4bao3', meaning: 'hamburger', emoji: '🍔', position: 1 },
    { hanzi: '薯条', pinyin: 'shu3tiao2', meaning: 'fries', emoji: '🍟', position: 2 },
    { hanzi: '热狗', pinyin: 're4gou3', meaning: 'hot dog', emoji: '🌭', position: 3 },
    { hanzi: '三明治', pinyin: 'san1ming2zhi4', meaning: 'sandwich', emoji: '🥪', position: 4 },
    { hanzi: '墨西哥卷', pinyin: 'mo4xi1ge1juan3', meaning: 'taco', emoji: '🌮', position: 5 },
    { hanzi: '面条', pinyin: 'mian4tiao2', meaning: 'noodles', emoji: '🍜', position: 6 },
    { hanzi: '寿司', pinyin: 'shou4si1', meaning: 'sushi', emoji: '🍣', position: 7 },
    { hanzi: '炸鸡', pinyin: 'zha2ji1', meaning: 'fried chicken', emoji: '🍗', position: 8 },
  ],
};

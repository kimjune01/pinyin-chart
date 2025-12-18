/**
 * Office Topic - Match office item Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const officeTopic: Topic = {
  id: 'office',
  name: 'Office',
  nameZh: '办公室',
  description: 'Match Chinese office items to emojis',
  category: 'places',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['💻', '🖨️', '📊'],
  items: [
    { hanzi: '电脑', pinyin: 'dian4nao3', meaning: 'computer', emoji: '💻', position: 0 },
    { hanzi: '打印机', pinyin: 'da3yin4ji1', meaning: 'printer', emoji: '🖨️', position: 1 },
    { hanzi: '文件', pinyin: 'wen2jian4', meaning: 'document', emoji: '📄', position: 2 },
    { hanzi: '会议', pinyin: 'hui4yi4', meaning: 'meeting', emoji: '👥📊', position: 3 },
    { hanzi: '邮件', pinyin: 'you2jian4', meaning: 'email', emoji: '📧', position: 4 },
    { hanzi: '电话', pinyin: 'dian4hua4', meaning: 'phone', emoji: '📞', position: 5 },
    { hanzi: '日历', pinyin: 'ri4li4', meaning: 'calendar', emoji: '📅', position: 6 },
    { hanzi: '订书机', pinyin: 'ding4shu1ji1', meaning: 'stapler', emoji: '🔗', position: 7 },
    { hanzi: '回形针', pinyin: 'hui2xing2zhen1', meaning: 'paperclip', emoji: '📎', position: 8 },
  ],
};

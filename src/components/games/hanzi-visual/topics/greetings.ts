/**
 * Greetings Topic - Match greeting Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const greetingsTopic: Topic = {
  id: 'greetings',
  name: 'Greetings',
  nameZh: '问候',
  description: 'Match Chinese greetings to emojis',
  category: 'people',
  difficulty: 1,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['👋', '🙏', '👋✨'],
  items: [
    { hanzi: '你好', pinyin: 'ni3hao3', meaning: 'hello', emoji: '👋😀', position: 0 },
    { hanzi: '谢谢', pinyin: 'xie4xie5', meaning: 'thank you', emoji: '🙏', position: 1 },
    { hanzi: '对不起', pinyin: 'dui4bu5qi3', meaning: 'sorry', emoji: '😔🙇', position: 2 },
    { hanzi: '没关系', pinyin: 'mei2guan1xi5', meaning: "it's okay", emoji: '👍😊', position: 3 },
    { hanzi: '再见', pinyin: 'zai4jian4', meaning: 'goodbye', emoji: '👋✨', position: 4 },
    { hanzi: '请', pinyin: 'qing3', meaning: 'please', emoji: '🤲', position: 5 },
    { hanzi: '欢迎', pinyin: 'huan1ying2', meaning: 'welcome', emoji: '🤗', position: 6 },
    { hanzi: '早上好', pinyin: 'zao3shang5hao3', meaning: 'good morning', emoji: '🌅👋', position: 7 },
    { hanzi: '晚安', pinyin: 'wan3an1', meaning: 'good night', emoji: '🌙😴', position: 8 },
  ],
};

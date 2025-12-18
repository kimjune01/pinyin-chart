/**
 * Medical Topic - Match medical Hanzi to emojis
 */

import type { Topic } from '../visualGameEngine';

export const medicalTopic: Topic = {
  id: 'medical',
  name: 'Medical',
  nameZh: '医疗',
  description: 'Match Chinese medical terms to emojis',
  category: 'other',
  difficulty: 2,
  layoutType: 'emoji-grid',
  gridColumns: 3,
  previewEmojis: ['💊', '💉', '🩺'],
  items: [
    { hanzi: '药', pinyin: 'yao4', meaning: 'medicine', emoji: '💊', position: 0 },
    { hanzi: '针', pinyin: 'zhen1', meaning: 'injection', emoji: '💉', position: 1 },
    { hanzi: '听诊器', pinyin: 'ting1zhen3qi4', meaning: 'stethoscope', emoji: '🩺', position: 2 },
    { hanzi: '创可贴', pinyin: 'chuang1ke3tie1', meaning: 'bandage', emoji: '🩹', position: 3 },
    { hanzi: '医生', pinyin: 'yi1sheng1', meaning: 'doctor', emoji: '👨‍⚕️', position: 4 },
    { hanzi: '护士', pinyin: 'hu4shi5', meaning: 'nurse', emoji: '👩‍⚕️', position: 5 },
    { hanzi: '医院', pinyin: 'yi1yuan4', meaning: 'hospital', emoji: '🏥', position: 6 },
    { hanzi: '轮椅', pinyin: 'lun2yi3', meaning: 'wheelchair', emoji: '🦽', position: 7 },
    { hanzi: '体温计', pinyin: 'ti3wen1ji4', meaning: 'thermometer', emoji: '🌡️', position: 8 },
  ],
};

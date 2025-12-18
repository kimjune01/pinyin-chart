/**
 * Sentence Patterns - Data for the Sentence Builder
 *
 * Chinese sentence patterns with selectable vocabulary slots.
 * Teaches key grammatical structures like:
 * - Subject + 很 + Adjective (NOT 是 with adjectives!)
 * - Subject + 是 + Noun
 * - Subject + Verb + Object
 * - Negation with 不
 */

export interface Word {
  hanzi: string;
  pinyin: string;
  english: string;
}

export interface SentencePattern {
  id: string;
  name: string;
  description: string;
  template: string; // e.g., "{subject} + 很 + {adjective}"
  slots: PatternSlot[];
  example: {
    chinese: string;
    pinyin: string;
    english: string;
  };
}

export interface PatternSlot {
  id: string;
  label: string;
  position: number;
  connector?: string; // Fixed text before this slot
  words: Word[];
}

// Common subjects
const subjects: Word[] = [
  { hanzi: '我', pinyin: 'wǒ', english: 'I' },
  { hanzi: '你', pinyin: 'nǐ', english: 'you' },
  { hanzi: '他', pinyin: 'tā', english: 'he' },
  { hanzi: '她', pinyin: 'tā', english: 'she' },
  { hanzi: '我们', pinyin: 'wǒmen', english: 'we' },
  { hanzi: '他们', pinyin: 'tāmen', english: 'they' },
  { hanzi: '这个', pinyin: 'zhège', english: 'this' },
  { hanzi: '那个', pinyin: 'nàge', english: 'that' },
];

// Adjectives (used with 很, NOT 是)
const adjectives: Word[] = [
  { hanzi: '高兴', pinyin: 'gāoxìng', english: 'happy' },
  { hanzi: '累', pinyin: 'lèi', english: 'tired' },
  { hanzi: '忙', pinyin: 'máng', english: 'busy' },
  { hanzi: '饿', pinyin: 'è', english: 'hungry' },
  { hanzi: '渴', pinyin: 'kě', english: 'thirsty' },
  { hanzi: '冷', pinyin: 'lěng', english: 'cold' },
  { hanzi: '热', pinyin: 'rè', english: 'hot' },
  { hanzi: '好', pinyin: 'hǎo', english: 'good' },
  { hanzi: '大', pinyin: 'dà', english: 'big' },
  { hanzi: '小', pinyin: 'xiǎo', english: 'small' },
  { hanzi: '贵', pinyin: 'guì', english: 'expensive' },
  { hanzi: '便宜', pinyin: 'piányi', english: 'cheap' },
  { hanzi: '漂亮', pinyin: 'piàoliang', english: 'beautiful' },
  { hanzi: '帅', pinyin: 'shuài', english: 'handsome' },
  { hanzi: '可爱', pinyin: 'kěài', english: 'cute' },
  { hanzi: '难', pinyin: 'nán', english: 'difficult' },
  { hanzi: '容易', pinyin: 'róngyì', english: 'easy' },
  { hanzi: '快', pinyin: 'kuài', english: 'fast' },
  { hanzi: '慢', pinyin: 'màn', english: 'slow' },
  { hanzi: '远', pinyin: 'yuǎn', english: 'far' },
  { hanzi: '近', pinyin: 'jìn', english: 'close' },
];

// Nouns (used with 是)
const nouns: Word[] = [
  { hanzi: '学生', pinyin: 'xuésheng', english: 'student' },
  { hanzi: '老师', pinyin: 'lǎoshī', english: 'teacher' },
  { hanzi: '医生', pinyin: 'yīshēng', english: 'doctor' },
  { hanzi: '朋友', pinyin: 'péngyou', english: 'friend' },
  { hanzi: '中国人', pinyin: 'zhōngguórén', english: 'Chinese person' },
  { hanzi: '美国人', pinyin: 'měiguórén', english: 'American' },
  { hanzi: '咖啡', pinyin: 'kāfēi', english: 'coffee' },
  { hanzi: '茶', pinyin: 'chá', english: 'tea' },
  { hanzi: '水', pinyin: 'shuǐ', english: 'water' },
  { hanzi: '书', pinyin: 'shū', english: 'book' },
  { hanzi: '手机', pinyin: 'shǒujī', english: 'phone' },
  { hanzi: '电脑', pinyin: 'diànnǎo', english: 'computer' },
];

// Objects for verb patterns
const objects: Word[] = [
  { hanzi: '咖啡', pinyin: 'kāfēi', english: 'coffee' },
  { hanzi: '茶', pinyin: 'chá', english: 'tea' },
  { hanzi: '水', pinyin: 'shuǐ', english: 'water' },
  { hanzi: '饭', pinyin: 'fàn', english: 'food/rice' },
  { hanzi: '中国菜', pinyin: 'zhōngguócài', english: 'Chinese food' },
  { hanzi: '书', pinyin: 'shū', english: 'book' },
  { hanzi: '电影', pinyin: 'diànyǐng', english: 'movie' },
  { hanzi: '音乐', pinyin: 'yīnyuè', english: 'music' },
  { hanzi: '中文', pinyin: 'zhōngwén', english: 'Chinese' },
  { hanzi: '英文', pinyin: 'yīngwén', english: 'English' },
  { hanzi: '钱', pinyin: 'qián', english: 'money' },
  { hanzi: '时间', pinyin: 'shíjiān', english: 'time' },
];

// Verbs
const verbs: Word[] = [
  { hanzi: '喜欢', pinyin: 'xǐhuan', english: 'like' },
  { hanzi: '想', pinyin: 'xiǎng', english: 'want/think' },
  { hanzi: '要', pinyin: 'yào', english: 'want/need' },
  { hanzi: '有', pinyin: 'yǒu', english: 'have' },
  { hanzi: '吃', pinyin: 'chī', english: 'eat' },
  { hanzi: '喝', pinyin: 'hē', english: 'drink' },
  { hanzi: '看', pinyin: 'kàn', english: 'watch/read' },
  { hanzi: '听', pinyin: 'tīng', english: 'listen' },
  { hanzi: '学', pinyin: 'xué', english: 'learn/study' },
  { hanzi: '说', pinyin: 'shuō', english: 'speak' },
  { hanzi: '买', pinyin: 'mǎi', english: 'buy' },
  { hanzi: '知道', pinyin: 'zhīdào', english: 'know' },
];

// Places for 去 pattern
const places: Word[] = [
  { hanzi: '中国', pinyin: 'zhōngguó', english: 'China' },
  { hanzi: '北京', pinyin: 'běijīng', english: 'Beijing' },
  { hanzi: '上海', pinyin: 'shànghǎi', english: 'Shanghai' },
  { hanzi: '学校', pinyin: 'xuéxiào', english: 'school' },
  { hanzi: '公司', pinyin: 'gōngsī', english: 'company' },
  { hanzi: '医院', pinyin: 'yīyuàn', english: 'hospital' },
  { hanzi: '机场', pinyin: 'jīchǎng', english: 'airport' },
  { hanzi: '餐厅', pinyin: 'cāntīng', english: 'restaurant' },
  { hanzi: '超市', pinyin: 'chāoshì', english: 'supermarket' },
  { hanzi: '家', pinyin: 'jiā', english: 'home' },
];

export const sentencePatterns: SentencePattern[] = [
  {
    id: 'adj-pattern',
    name: 'Subject + 很 + Adjective',
    description: 'Describe states and feelings. In Chinese, use 很 (not 是) before adjectives!',
    template: '{subject} 很 {adjective}',
    example: {
      chinese: '我很高兴',
      pinyin: 'wǒ hěn gāoxìng',
      english: 'I am happy',
    },
    slots: [
      {
        id: 'subject',
        label: 'Subject',
        position: 0,
        words: subjects,
      },
      {
        id: 'adjective',
        label: 'Adjective',
        position: 1,
        connector: '很',
        words: adjectives,
      },
    ],
  },
  {
    id: 'noun-pattern',
    name: 'Subject + 是 + Noun',
    description: 'State identity or what something is. Use 是 with nouns.',
    template: '{subject} 是 {noun}',
    example: {
      chinese: '我是学生',
      pinyin: 'wǒ shì xuésheng',
      english: 'I am a student',
    },
    slots: [
      {
        id: 'subject',
        label: 'Subject',
        position: 0,
        words: subjects,
      },
      {
        id: 'noun',
        label: 'Noun',
        position: 1,
        connector: '是',
        words: nouns,
      },
    ],
  },
  {
    id: 'verb-pattern',
    name: 'Subject + Verb + Object',
    description: 'Basic action sentences. Chinese word order is Subject-Verb-Object.',
    template: '{subject} {verb} {object}',
    example: {
      chinese: '我喜欢咖啡',
      pinyin: 'wǒ xǐhuan kāfēi',
      english: 'I like coffee',
    },
    slots: [
      {
        id: 'subject',
        label: 'Subject',
        position: 0,
        words: subjects.slice(0, 6), // Just pronouns
      },
      {
        id: 'verb',
        label: 'Verb',
        position: 1,
        words: verbs,
      },
      {
        id: 'object',
        label: 'Object',
        position: 2,
        words: objects,
      },
    ],
  },
  {
    id: 'go-pattern',
    name: 'Subject + 想去 + Place',
    description: 'Express wanting to go somewhere.',
    template: '{subject} 想去 {place}',
    example: {
      chinese: '我想去中国',
      pinyin: 'wǒ xiǎng qù zhōngguó',
      english: 'I want to go to China',
    },
    slots: [
      {
        id: 'subject',
        label: 'Subject',
        position: 0,
        words: subjects.slice(0, 6),
      },
      {
        id: 'place',
        label: 'Place',
        position: 1,
        connector: '想去',
        words: places,
      },
    ],
  },
  {
    id: 'neg-adj-pattern',
    name: 'Subject + 不 + Adjective',
    description: 'Negate adjectives. Use 不 (not 不是) before adjectives.',
    template: '{subject} 不 {adjective}',
    example: {
      chinese: '我不累',
      pinyin: 'wǒ bú lèi',
      english: 'I am not tired',
    },
    slots: [
      {
        id: 'subject',
        label: 'Subject',
        position: 0,
        words: subjects,
      },
      {
        id: 'adjective',
        label: 'Adjective',
        position: 1,
        connector: '不',
        words: adjectives,
      },
    ],
  },
  {
    id: 'neg-noun-pattern',
    name: 'Subject + 不是 + Noun',
    description: 'Negate identity. Use 不是 to say "is not".',
    template: '{subject} 不是 {noun}',
    example: {
      chinese: '我不是老师',
      pinyin: 'wǒ bú shì lǎoshī',
      english: 'I am not a teacher',
    },
    slots: [
      {
        id: 'subject',
        label: 'Subject',
        position: 0,
        words: subjects,
      },
      {
        id: 'noun',
        label: 'Noun',
        position: 1,
        connector: '不是',
        words: nouns,
      },
    ],
  },
  {
    id: 'neg-verb-pattern',
    name: 'Subject + 不 + Verb + Object',
    description: 'Negate actions. Put 不 before the verb.',
    template: '{subject} 不 {verb} {object}',
    example: {
      chinese: '我不喜欢咖啡',
      pinyin: 'wǒ bù xǐhuan kāfēi',
      english: "I don't like coffee",
    },
    slots: [
      {
        id: 'subject',
        label: 'Subject',
        position: 0,
        words: subjects.slice(0, 6),
      },
      {
        id: 'verb',
        label: 'Verb',
        position: 1,
        connector: '不',
        words: verbs,
      },
      {
        id: 'object',
        label: 'Object',
        position: 2,
        words: objects,
      },
    ],
  },
];

// Helper to get pinyin with tone numbers for audio
export function getPinyinWithTones(pinyin: string): string {
  const toneMap: Record<string, string> = {
    'ā': 'a1', 'á': 'a2', 'ǎ': 'a3', 'à': 'a4',
    'ē': 'e1', 'é': 'e2', 'ě': 'e3', 'è': 'e4',
    'ī': 'i1', 'í': 'i2', 'ǐ': 'i3', 'ì': 'i4',
    'ō': 'o1', 'ó': 'o2', 'ǒ': 'o3', 'ò': 'o4',
    'ū': 'u1', 'ú': 'u2', 'ǔ': 'u3', 'ù': 'u4',
    'ǖ': 'v1', 'ǘ': 'v2', 'ǚ': 'v3', 'ǜ': 'v4',
  };

  let result = pinyin.toLowerCase();
  for (const [toned, numbered] of Object.entries(toneMap)) {
    if (result.includes(toned)) {
      const base = numbered[0];
      const tone = numbered[1];
      result = result.replace(toned, base) + tone;
      break;
    }
  }

  // If no tone mark found, assume tone 5 (neutral)
  if (!/\d$/.test(result)) {
    result += '5';
  }

  return result;
}

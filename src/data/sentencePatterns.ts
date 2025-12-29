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
  category: 'statement' | 'question';
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

// Question words
const questionWords: Word[] = [
  { hanzi: '什么', pinyin: 'shénme', english: 'what' },
  { hanzi: '谁', pinyin: 'shéi', english: 'who' },
  { hanzi: '哪里', pinyin: 'nǎlǐ', english: 'where' },
  { hanzi: '哪个', pinyin: 'nǎge', english: 'which' },
  { hanzi: '怎么', pinyin: 'zěnme', english: 'how' },
  { hanzi: '为什么', pinyin: 'wèishénme', english: 'why' },
  { hanzi: '几', pinyin: 'jǐ', english: 'how many' },
  { hanzi: '多少', pinyin: 'duōshao', english: 'how much' },
];

// Skills for 会 pattern
const skills: Word[] = [
  { hanzi: '说中文', pinyin: 'shuō zhōngwén', english: 'speak Chinese' },
  { hanzi: '说英文', pinyin: 'shuō yīngwén', english: 'speak English' },
  { hanzi: '做饭', pinyin: 'zuò fàn', english: 'cook' },
  { hanzi: '开车', pinyin: 'kāi chē', english: 'drive' },
  { hanzi: '游泳', pinyin: 'yóuyǒng', english: 'swim' },
  { hanzi: '唱歌', pinyin: 'chàng gē', english: 'sing' },
  { hanzi: '跳舞', pinyin: 'tiào wǔ', english: 'dance' },
  { hanzi: '写汉字', pinyin: 'xiě hànzì', english: 'write characters' },
];

// Verb phrases for 想 + Verb pattern
const verbPhrases: Word[] = [
  { hanzi: '吃饭', pinyin: 'chī fàn', english: 'eat' },
  { hanzi: '喝咖啡', pinyin: 'hē kāfēi', english: 'drink coffee' },
  { hanzi: '看电影', pinyin: 'kàn diànyǐng', english: 'watch a movie' },
  { hanzi: '听音乐', pinyin: 'tīng yīnyuè', english: 'listen to music' },
  { hanzi: '学中文', pinyin: 'xué zhōngwén', english: 'learn Chinese' },
  { hanzi: '买东西', pinyin: 'mǎi dōngxi', english: 'go shopping' },
  { hanzi: '睡觉', pinyin: 'shuì jiào', english: 'sleep' },
  { hanzi: '休息', pinyin: 'xiūxi', english: 'rest' },
];

// Possessions for 有 pattern
const possessions: Word[] = [
  { hanzi: '钱', pinyin: 'qián', english: 'money' },
  { hanzi: '时间', pinyin: 'shíjiān', english: 'time' },
  { hanzi: '书', pinyin: 'shū', english: 'books' },
  { hanzi: '朋友', pinyin: 'péngyou', english: 'friends' },
  { hanzi: '问题', pinyin: 'wèntí', english: 'questions' },
  { hanzi: '手机', pinyin: 'shǒujī', english: 'phone' },
  { hanzi: '车', pinyin: 'chē', english: 'car' },
  { hanzi: '工作', pinyin: 'gōngzuò', english: 'job' },
];

export const sentencePatterns: SentencePattern[] = [
  {
    id: 'adj-pattern',
    name: 'Subject + 很 + Adjective',
    category: 'statement',
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
    category: 'statement',
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
    category: 'statement',
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
    category: 'statement',
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
    id: 'location-pattern',
    name: 'Subject + 在 + Place',
    category: 'statement',
    description: 'Say where someone or something is located.',
    template: '{subject} 在 {place}',
    example: {
      chinese: '我在家',
      pinyin: 'wǒ zài jiā',
      english: 'I am at home',
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
        connector: '在',
        words: places,
      },
    ],
  },
  {
    id: 'have-pattern',
    name: 'Subject + 有 + Object',
    category: 'statement',
    description: 'Express possession. Negated with 没有, not 不有!',
    template: '{subject} 有 {object}',
    example: {
      chinese: '我有书',
      pinyin: 'wǒ yǒu shū',
      english: 'I have books',
    },
    slots: [
      {
        id: 'subject',
        label: 'Subject',
        position: 0,
        words: subjects.slice(0, 6),
      },
      {
        id: 'object',
        label: 'Object',
        position: 1,
        connector: '有',
        words: possessions,
      },
    ],
  },
  {
    id: 'can-pattern',
    name: 'Subject + 会 + Skill',
    category: 'statement',
    description: 'Express ability or learned skills. 会 means "can" or "know how to".',
    template: '{subject} 会 {skill}',
    example: {
      chinese: '我会说中文',
      pinyin: 'wǒ huì shuō zhōngwén',
      english: 'I can speak Chinese',
    },
    slots: [
      {
        id: 'subject',
        label: 'Subject',
        position: 0,
        words: subjects.slice(0, 6),
      },
      {
        id: 'skill',
        label: 'Skill',
        position: 1,
        connector: '会',
        words: skills,
      },
    ],
  },
  {
    id: 'want-pattern',
    name: 'Subject + 想 + Verb',
    category: 'statement',
    description: 'Express wanting to do something. 想 means "want to" or "would like to".',
    template: '{subject} 想 {verb}',
    example: {
      chinese: '我想吃饭',
      pinyin: 'wǒ xiǎng chī fàn',
      english: 'I want to eat',
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
        label: 'Action',
        position: 1,
        connector: '想',
        words: verbPhrases,
      },
    ],
  },
  {
    id: 'too-pattern',
    name: '太 + Adjective + 了',
    category: 'statement',
    description: 'Express "too much" of something. 太...了 is a common emphatic pattern.',
    template: '太 {adjective} 了',
    example: {
      chinese: '太贵了',
      pinyin: 'tài guì le',
      english: 'Too expensive!',
    },
    slots: [
      {
        id: 'adjective',
        label: 'Adjective',
        position: 0,
        connector: '太',
        words: [
          { hanzi: '贵', pinyin: 'guì', english: 'expensive' },
          { hanzi: '便宜', pinyin: 'piányi', english: 'cheap' },
          { hanzi: '大', pinyin: 'dà', english: 'big' },
          { hanzi: '小', pinyin: 'xiǎo', english: 'small' },
          { hanzi: '热', pinyin: 'rè', english: 'hot' },
          { hanzi: '冷', pinyin: 'lěng', english: 'cold' },
          { hanzi: '难', pinyin: 'nán', english: 'difficult' },
          { hanzi: '好', pinyin: 'hǎo', english: 'good' },
          { hanzi: '忙', pinyin: 'máng', english: 'busy' },
          { hanzi: '累', pinyin: 'lèi', english: 'tired' },
        ],
      },
    ],
  },
  {
    id: 'past-pattern',
    name: 'Subject + Verb + 了',
    category: 'statement',
    description: 'Express completed actions (past tense). Add 了 after the verb. Negate with 没 (no 了).',
    template: '{subject} {verb} 了',
    example: {
      chinese: '我吃了',
      pinyin: 'wǒ chī le',
      english: 'I ate',
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
        label: 'Action',
        position: 1,
        words: [
          { hanzi: '吃', pinyin: 'chī', english: 'ate' },
          { hanzi: '喝咖啡', pinyin: 'hē kāfēi', english: 'drank coffee' },
          { hanzi: '喝啤酒', pinyin: 'hē píjiǔ', english: 'drank beer' },
          { hanzi: '睡觉', pinyin: 'shuì jiào', english: 'slept' },
          { hanzi: '看电影', pinyin: 'kàn diànyǐng', english: 'watched a movie' },
          { hanzi: '看书', pinyin: 'kàn shū', english: 'read a book' },
          { hanzi: '听音乐', pinyin: 'tīng yīnyuè', english: 'listened to music' },
          { hanzi: '买东西', pinyin: 'mǎi dōngxi', english: 'bought stuff' },
          { hanzi: '做作业', pinyin: 'zuò zuòyè', english: 'did homework' },
        ],
      },
    ],
  },
  // Question patterns
  {
    id: 'q-verb-what',
    name: 'Subject + Verb + 什么?',
    category: 'question',
    description: 'Ask "what" questions. The question word goes where the answer would be.',
    template: '{subject} {verb} 什么?',
    example: {
      chinese: '你吃什么?',
      pinyin: 'nǐ chī shénme?',
      english: 'What do you eat?',
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
        words: [
          { hanzi: '吃', pinyin: 'chī', english: 'eat' },
          { hanzi: '喝', pinyin: 'hē', english: 'drink' },
          { hanzi: '看', pinyin: 'kàn', english: 'watch/read' },
          { hanzi: '听', pinyin: 'tīng', english: 'listen to' },
          { hanzi: '学', pinyin: 'xué', english: 'study' },
          { hanzi: '买', pinyin: 'mǎi', english: 'buy' },
          { hanzi: '喜欢', pinyin: 'xǐhuan', english: 'like' },
          { hanzi: '想', pinyin: 'xiǎng', english: 'want' },
        ],
      },
      {
        id: 'question',
        label: 'Question Word',
        position: 2,
        words: [
          { hanzi: '什么', pinyin: 'shénme', english: 'what' },
        ],
      },
    ],
  },
  {
    id: 'q-who',
    name: '谁 + Verb + Object?',
    category: 'question',
    description: 'Ask "who" questions. 谁 takes the place of the subject.',
    template: '谁 {verb} {object}?',
    example: {
      chinese: '谁喜欢咖啡?',
      pinyin: 'shéi xǐhuan kāfēi?',
      english: 'Who likes coffee?',
    },
    slots: [
      {
        id: 'question',
        label: 'Question Word',
        position: 0,
        words: [
          { hanzi: '谁', pinyin: 'shéi', english: 'who' },
        ],
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
    id: 'q-where',
    name: 'Subject + 去哪里?',
    category: 'question',
    description: 'Ask "where" questions about going places.',
    template: '{subject} 去哪里?',
    example: {
      chinese: '你去哪里?',
      pinyin: 'nǐ qù nǎlǐ?',
      english: 'Where are you going?',
    },
    slots: [
      {
        id: 'subject',
        label: 'Subject',
        position: 0,
        words: subjects.slice(0, 6),
      },
    ],
  },
  {
    id: 'q-how-many',
    name: 'Subject + 有多少 + Object?',
    category: 'question',
    description: 'Ask "how many/much" questions.',
    template: '{subject} 有多少 {object}?',
    example: {
      chinese: '你有多少钱?',
      pinyin: 'nǐ yǒu duōshao qián?',
      english: 'How much money do you have?',
    },
    slots: [
      {
        id: 'subject',
        label: 'Subject',
        position: 0,
        words: subjects.slice(0, 6),
      },
      {
        id: 'object',
        label: 'Object',
        position: 1,
        connector: '有多少',
        words: [
          { hanzi: '钱', pinyin: 'qián', english: 'money' },
          { hanzi: '书', pinyin: 'shū', english: 'books' },
          { hanzi: '朋友', pinyin: 'péngyou', english: 'friends' },
          { hanzi: '时间', pinyin: 'shíjiān', english: 'time' },
          { hanzi: '水', pinyin: 'shuǐ', english: 'water' },
        ],
      },
    ],
  },
  {
    id: 'q-why',
    name: 'Subject + 为什么 + Verb?',
    category: 'question',
    description: 'Ask "why" questions. 为什么 comes before the verb.',
    template: '{subject} 为什么 {verb}?',
    example: {
      chinese: '你为什么学中文?',
      pinyin: 'nǐ wèishénme xué zhōngwén?',
      english: 'Why do you study Chinese?',
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
        label: 'Action',
        position: 1,
        connector: '为什么',
        words: [
          { hanzi: '学中文', pinyin: 'xué zhōngwén', english: 'study Chinese' },
          { hanzi: '去中国', pinyin: 'qù zhōngguó', english: 'go to China' },
          { hanzi: '吃这个', pinyin: 'chī zhège', english: 'eat this' },
          { hanzi: '喜欢他', pinyin: 'xǐhuan tā', english: 'like him' },
          { hanzi: '不高兴', pinyin: 'bù gāoxìng', english: 'unhappy' },
          { hanzi: '很忙', pinyin: 'hěn máng', english: 'so busy' },
        ],
      },
    ],
  },
  {
    id: 'q-when',
    name: 'Subject + 什么时候 + Verb?',
    category: 'question',
    description: 'Ask "when" questions. 什么时候 means "what time" or "when".',
    template: '{subject} 什么时候 {verb}?',
    example: {
      chinese: '你什么时候去?',
      pinyin: 'nǐ shénme shíhou qù?',
      english: 'When are you going?',
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
        label: 'Action',
        position: 1,
        connector: '什么时候',
        words: [
          { hanzi: '去', pinyin: 'qù', english: 'go' },
          { hanzi: '来', pinyin: 'lái', english: 'come' },
          { hanzi: '回家', pinyin: 'huí jiā', english: 'go home' },
          { hanzi: '吃饭', pinyin: 'chī fàn', english: 'eat' },
          { hanzi: '睡觉', pinyin: 'shuì jiào', english: 'sleep' },
          { hanzi: '工作', pinyin: 'gōngzuò', english: 'work' },
        ],
      },
    ],
  },
  {
    id: 'q-permission',
    name: 'Subject + 可以 + Verb + 吗?',
    category: 'question',
    description: 'Ask for permission. 可以 means "may" or "can" for permission.',
    template: '{subject} 可以 {verb} 吗?',
    example: {
      chinese: '我可以进来吗?',
      pinyin: 'wǒ kěyǐ jìnlái ma?',
      english: 'May I come in?',
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
        label: 'Action',
        position: 1,
        connector: '可以',
        words: [
          { hanzi: '进来', pinyin: 'jìnlái', english: 'come in' },
          { hanzi: '坐这里', pinyin: 'zuò zhèlǐ', english: 'sit here' },
          { hanzi: '用这个', pinyin: 'yòng zhège', english: 'use this' },
          { hanzi: '问你', pinyin: 'wèn nǐ', english: 'ask you' },
          { hanzi: '看看', pinyin: 'kànkan', english: 'take a look' },
          { hanzi: '试试', pinyin: 'shìshi', english: 'try' },
          { hanzi: '走了', pinyin: 'zǒu le', english: 'leave' },
          { hanzi: '帮忙', pinyin: 'bāngmáng', english: 'help' },
          { hanzi: '借一下', pinyin: 'jiè yíxià', english: 'borrow' },
          { hanzi: '拍照', pinyin: 'pāizhào', english: 'take photos' },
        ],
      },
    ],
  },
  {
    id: 'q-did-you',
    name: 'Subject + Verb + 了没有?',
    category: 'question',
    description: 'Ask if someone did something. The 了没有 pattern is natural for completed actions.',
    template: '{subject} {verb} 了没有?',
    example: {
      chinese: '你吃了没有?',
      pinyin: 'nǐ chī le méiyǒu?',
      english: 'Did you eat?',
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
        label: 'Action',
        position: 1,
        words: [
          { hanzi: '吃', pinyin: 'chī', english: 'eat' },
          { hanzi: '喝咖啡', pinyin: 'hē kāfēi', english: 'drink coffee' },
          { hanzi: '睡觉', pinyin: 'shuì jiào', english: 'sleep' },
          { hanzi: '看电影', pinyin: 'kàn diànyǐng', english: 'watch the movie' },
          { hanzi: '做作业', pinyin: 'zuò zuòyè', english: 'do homework' },
          { hanzi: '买', pinyin: 'mǎi', english: 'buy it' },
          { hanzi: '来', pinyin: 'lái', english: 'come' },
          { hanzi: '走', pinyin: 'zǒu', english: 'leave' },
        ],
      },
    ],
  },
  {
    id: 'q-how-so',
    name: 'Subject + 怎么这么 + Adj?',
    category: 'question',
    description: 'Express surprise or reproach about how something is. 怎么这么 means "how so" or "how can...be so".',
    template: '{subject} 怎么这么 {adjective}?',
    example: {
      chinese: '你怎么这么懒?',
      pinyin: 'nǐ zěnme zhème lǎn?',
      english: 'How can you be so lazy?',
    },
    slots: [
      {
        id: 'subject',
        label: 'Subject',
        position: 0,
        words: subjects.slice(0, 6),
      },
      {
        id: 'adjective',
        label: 'Adjective',
        position: 1,
        connector: '怎么这么',
        words: [
          { hanzi: '懒', pinyin: 'lǎn', english: 'lazy' },
          { hanzi: '笨', pinyin: 'bèn', english: 'dumb' },
          { hanzi: '慢', pinyin: 'màn', english: 'slow' },
          { hanzi: '快', pinyin: 'kuài', english: 'fast' },
          { hanzi: '忙', pinyin: 'máng', english: 'busy' },
          { hanzi: '累', pinyin: 'lèi', english: 'tired' },
          { hanzi: '贵', pinyin: 'guì', english: 'expensive' },
          { hanzi: '难', pinyin: 'nán', english: 'difficult' },
          { hanzi: '厉害', pinyin: 'lìhai', english: 'amazing' },
          { hanzi: '可爱', pinyin: 'kěài', english: 'cute' },
        ],
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

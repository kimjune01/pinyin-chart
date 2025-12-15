/**
 * Minimal Pairs Data
 *
 * Curated sets of confusing pinyin syllables for targeted practice.
 * Organized by phonetic features that learners commonly confuse.
 */

export interface MinimalPairSet {
  category: string;
  description: string;
  pairs: string[][];  // Each pair is a group of confusing syllables
  difficulty: 'easy' | 'medium' | 'hard';
}

export const MINIMAL_PAIRS: MinimalPairSet[] = [
  // Retroflex vs Dental (most common confusion for English speakers)
  {
    category: 'retroflex-dental',
    description: 'Retroflex (zh, ch, sh) vs Dental (z, c, s)',
    difficulty: 'medium',
    pairs: [
      ['zhi', 'zi'],
      ['zhu', 'zu'],
      ['zha', 'za'],
      ['zhe', 'ze'],
      ['chi', 'ci'],
      ['chu', 'cu'],
      ['cha', 'ca'],
      ['che', 'ce'],
      ['shi', 'si'],
      ['shu', 'su'],
      ['sha', 'sa'],
      ['she', 'se'],
    ],
  },

  // Palatal confusions
  {
    category: 'palatals',
    description: 'Palatal sounds (j, q, x)',
    difficulty: 'medium',
    pairs: [
      ['ji', 'qi', 'xi'],
      ['jia', 'qia', 'xia'],
      ['jie', 'qie', 'xie'],
      ['jiu', 'qiu', 'xiu'],
      ['juan', 'quan', 'xuan'],
      ['jiang', 'qiang', 'xiang'],
    ],
  },

  // Three-way retroflex/dental/palatal
  {
    category: 'three-way-confusion',
    description: 'Retroflex vs Dental vs Palatal (hardest)',
    difficulty: 'hard',
    pairs: [
      ['zhi', 'zi', 'ji'],
      ['chi', 'ci', 'qi'],
      ['shi', 'si', 'xi'],
      ['zhu', 'zu', 'ju'],
      ['chu', 'cu', 'qu'],
      ['shu', 'su', 'xu'],
    ],
  },

  // n vs ng endings (very difficult for learners)
  {
    category: 'n-ng-endings',
    description: 'n vs ng nasal endings',
    difficulty: 'hard',
    pairs: [
      ['an', 'ang'],
      ['en', 'eng'],
      ['in', 'ing'],
      ['un', 'ong'],
      ['ban', 'bang'],
      ['can', 'cang'],
      ['dan', 'dang'],
      ['fan', 'fang'],
      ['gan', 'gang'],
      ['han', 'hang'],
      ['kan', 'kang'],
      ['lan', 'lang'],
      ['man', 'mang'],
      ['nan', 'nang'],
      ['pan', 'pang'],
      ['ran', 'rang'],
      ['san', 'sang'],
      ['tan', 'tang'],
      ['wan', 'wang'],
      ['yan', 'yang'],
      ['zan', 'zang'],
    ],
  },

  // ian vs iang, uan vs uang
  {
    category: 'compound-n-ng',
    description: 'Compound finals with n vs ng',
    difficulty: 'hard',
    pairs: [
      ['ian', 'iang'],
      ['uan', 'uang'],
      ['tian', 'tiang'],
      ['lian', 'liang'],
      ['xian', 'xiang'],
      ['juan', 'jiang'],
      ['quan', 'qiang'],
      ['xuan', 'xiang'],
      ['guan', 'guang'],
      ['kuan', 'kuang'],
      ['huan', 'huang'],
      ['zuan', 'zhuang'],
      ['chuan', 'chuang'],
      ['shuan', 'shuang'],
    ],
  },

  // Labial consonants (b, p, m, f)
  {
    category: 'labials',
    description: 'Labial consonants (b, p, m, f)',
    difficulty: 'easy',
    pairs: [
      ['ba', 'pa', 'ma', 'fa'],
      ['bo', 'po', 'mo', 'fo'],
      ['bu', 'pu', 'mu', 'fu'],
      ['bei', 'pei', 'mei', 'fei'],
      ['ban', 'pan', 'man', 'fan'],
      ['bang', 'pang', 'mang', 'fang'],
      ['bao', 'pao', 'mao'],
      ['ben', 'pen', 'men', 'fen'],
      ['beng', 'peng', 'meng', 'feng'],
      ['bing', 'ping', 'ming'],
    ],
  },

  // Dental consonants (d, t, n, l)
  {
    category: 'dentals',
    description: 'Dental consonants (d, t, n, l)',
    difficulty: 'easy',
    pairs: [
      ['da', 'ta', 'na', 'la'],
      ['de', 'te', 'ne', 'le'],
      ['du', 'tu', 'nu', 'lu'],
      ['dai', 'tai', 'nai', 'lai'],
      ['dan', 'tan', 'nan', 'lan'],
      ['dang', 'tang', 'nang', 'lang'],
      ['dao', 'tao', 'nao', 'lao'],
      ['deng', 'teng', 'neng', 'leng'],
      ['dou', 'tou', 'nou', 'lou'],
      ['ding', 'ting', 'ning', 'ling'],
    ],
  },

  // Guttural consonants (g, k, h)
  {
    category: 'gutturals',
    description: 'Guttural consonants (g, k, h)',
    difficulty: 'easy',
    pairs: [
      ['ga', 'ka', 'ha'],
      ['ge', 'ke', 'he'],
      ['gu', 'ku', 'hu'],
      ['gai', 'kai', 'hai'],
      ['gan', 'kan', 'han'],
      ['gang', 'kang', 'hang'],
      ['gao', 'kao', 'hao'],
      ['gen', 'ken', 'hen'],
      ['geng', 'keng', 'heng'],
      ['gou', 'kou', 'hou'],
      ['gong', 'kong', 'hong'],
    ],
  },

  // ü (v) vs u confusion
  {
    category: 'u-v-confusion',
    description: 'ü (v) vs u sounds',
    difficulty: 'medium',
    pairs: [
      ['ju', 'zhu'],
      ['qu', 'chu'],
      ['xu', 'shu'],
      ['lü', 'lu'],
      ['nü', 'nu'],
      ['jue', 'zhue'],
      ['que', 'chue'],
      ['xue', 'shue'],
    ],
  },

  // Similar compound finals
  {
    category: 'compound-finals',
    description: 'Confusing compound finals',
    difficulty: 'medium',
    pairs: [
      ['ai', 'ei'],
      ['ao', 'ou'],
      ['ie', 'ei'],
      ['uo', 'ou'],
      ['ian', 'uan'],
      ['iao', 'iu'],
      ['uai', 'ui'],
    ],
  },
];

/**
 * Get pairs by difficulty level
 */
export function getPairsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): MinimalPairSet[] {
  return MINIMAL_PAIRS.filter(set => set.difficulty === difficulty);
}

/**
 * Get pairs by category
 */
export function getPairsByCategory(category: string): MinimalPairSet | undefined {
  return MINIMAL_PAIRS.find(set => set.category === category);
}

/**
 * Get all pair syllables flattened
 */
export function getAllPairs(): string[][] {
  return MINIMAL_PAIRS.flatMap(set => set.pairs);
}

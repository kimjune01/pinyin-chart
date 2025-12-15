/**
 * Pinyin Final Sounds (Rhymes)
 *
 * There are approximately 38 finals in Mandarin Chinese.
 * Finals are the vowel and consonant combinations that follow the initial.
 */

export interface PinyinFinal {
  symbol: string;
  ipa: string;  // International Phonetic Alphabet
  description: string;
  group: string;
}

export const PINYIN_FINALS: PinyinFinal[] = [
  // Simple finals (single vowels)
  { symbol: 'a', ipa: 'a', description: 'open front unrounded', group: 'simple' },
  { symbol: 'o', ipa: 'o', description: 'close-mid back rounded', group: 'simple' },
  { symbol: 'e', ipa: 'ɤ', description: 'close-mid back unrounded', group: 'simple' },
  { symbol: 'i', ipa: 'i', description: 'close front unrounded', group: 'simple' },
  { symbol: 'u', ipa: 'u', description: 'close back rounded', group: 'simple' },
  { symbol: 'ü', ipa: 'y', description: 'close front rounded', group: 'simple' },
  { symbol: 'er', ipa: 'ɚ', description: 'r-colored vowel', group: 'simple' },

  // Compound finals (two vowels)
  { symbol: 'ai', ipa: 'aɪ', description: 'a + i diphthong', group: 'compound' },
  { symbol: 'ei', ipa: 'eɪ', description: 'e + i diphthong', group: 'compound' },
  { symbol: 'ao', ipa: 'ɑʊ', description: 'a + o diphthong', group: 'compound' },
  { symbol: 'ou', ipa: 'oʊ', description: 'o + u diphthong', group: 'compound' },
  { symbol: 'ia', ipa: 'ia', description: 'i + a', group: 'compound' },
  { symbol: 'ie', ipa: 'iɛ', description: 'i + e', group: 'compound' },
  { symbol: 'ua', ipa: 'ua', description: 'u + a', group: 'compound' },
  { symbol: 'uo', ipa: 'uo', description: 'u + o', group: 'compound' },
  { symbol: 'üe', ipa: 'yɛ', description: 'ü + e', group: 'compound' },
  { symbol: 'iao', ipa: 'iɑʊ', description: 'i + a + o', group: 'compound' },
  { symbol: 'iou', ipa: 'ioʊ', description: 'i + o + u (written as iu)', group: 'compound' },
  { symbol: 'uai', ipa: 'uaɪ', description: 'u + a + i', group: 'compound' },
  { symbol: 'uei', ipa: 'ueɪ', description: 'u + e + i (written as ui)', group: 'compound' },

  // Nasal finals (ending in n)
  { symbol: 'an', ipa: 'an', description: 'a + n', group: 'nasal-n' },
  { symbol: 'en', ipa: 'ən', description: 'e + n', group: 'nasal-n' },
  { symbol: 'in', ipa: 'in', description: 'i + n', group: 'nasal-n' },
  { symbol: 'un', ipa: 'un', description: 'u + n', group: 'nasal-n' },
  { symbol: 'ün', ipa: 'yn', description: 'ü + n', group: 'nasal-n' },
  { symbol: 'ian', ipa: 'iɛn', description: 'i + a + n', group: 'nasal-n' },
  { symbol: 'uan', ipa: 'uan', description: 'u + a + n', group: 'nasal-n' },
  { symbol: 'üan', ipa: 'yɛn', description: 'ü + a + n', group: 'nasal-n' },
  { symbol: 'uen', ipa: 'uən', description: 'u + e + n (written as un)', group: 'nasal-n' },

  // Nasal finals (ending in ng)
  { symbol: 'ang', ipa: 'ɑŋ', description: 'a + ng', group: 'nasal-ng' },
  { symbol: 'eng', ipa: 'əŋ', description: 'e + ng', group: 'nasal-ng' },
  { symbol: 'ing', ipa: 'iŋ', description: 'i + ng', group: 'nasal-ng' },
  { symbol: 'ong', ipa: 'ʊŋ', description: 'o + ng', group: 'nasal-ng' },
  { symbol: 'iang', ipa: 'iɑŋ', description: 'i + a + ng', group: 'nasal-ng' },
  { symbol: 'uang', ipa: 'uɑŋ', description: 'u + a + ng', group: 'nasal-ng' },
  { symbol: 'iong', ipa: 'iʊŋ', description: 'i + o + ng', group: 'nasal-ng' },
  { symbol: 'ueng', ipa: 'uəŋ', description: 'u + e + ng', group: 'nasal-ng' },
];

// Grouped finals for display
export const FINAL_GROUPS = {
  simple: ['a', 'o', 'e', 'i', 'u', 'ü', 'er'],
  compound: ['ai', 'ei', 'ao', 'ou', 'ia', 'ie', 'ua', 'uo', 'üe', 'iao', 'iou', 'uai', 'uei'],
  'nasal-n': ['an', 'en', 'in', 'un', 'ün', 'ian', 'uan', 'üan', 'uen'],
  'nasal-ng': ['ang', 'eng', 'ing', 'ong', 'iang', 'uang', 'iong', 'ueng']
} as const;

// Flat list of finals (symbols only)
export const FINALS = PINYIN_FINALS.map(f => f.symbol);

// Common spellings that get simplified
export const SPELLING_RULES = {
  'iou': 'iu',   // iou → iu (when after initial)
  'uei': 'ui',   // uei → ui (when after initial)
  'uen': 'un',   // uen → un (when after initial)
} as const;

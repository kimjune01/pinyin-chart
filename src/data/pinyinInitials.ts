/**
 * Pinyin Initial Consonants
 *
 * There are 21 initial consonants in Mandarin Chinese, plus the null initial (∅).
 * Initials are grouped by phonetic similarity for educational purposes.
 */

export interface PinyinInitial {
  symbol: string;
  ipa: string;  // International Phonetic Alphabet
  description: string;
  group: string;
}

export const PINYIN_INITIALS: PinyinInitial[] = [
  // Null initial (syllables starting with vowels)
  { symbol: '', ipa: '∅', description: 'null initial', group: 'null' },

  // Labials (lip sounds)
  { symbol: 'b', ipa: 'p', description: 'unaspirated p', group: 'labial' },
  { symbol: 'p', ipa: 'pʰ', description: 'aspirated p', group: 'labial' },
  { symbol: 'm', ipa: 'm', description: 'm', group: 'labial' },
  { symbol: 'f', ipa: 'f', description: 'f', group: 'labial' },

  // Dentals (tongue-tooth sounds)
  { symbol: 'd', ipa: 't', description: 'unaspirated t', group: 'dental' },
  { symbol: 't', ipa: 'tʰ', description: 'aspirated t', group: 'dental' },
  { symbol: 'n', ipa: 'n', description: 'n', group: 'dental' },
  { symbol: 'l', ipa: 'l', description: 'l', group: 'dental' },

  // Gutturals (throat sounds)
  { symbol: 'g', ipa: 'k', description: 'unaspirated k', group: 'guttural' },
  { symbol: 'k', ipa: 'kʰ', description: 'aspirated k', group: 'guttural' },
  { symbol: 'h', ipa: 'x', description: 'h', group: 'guttural' },

  // Palatals (tongue-palate sounds)
  { symbol: 'j', ipa: 'tɕ', description: 'unaspirated palatal affricate', group: 'palatal' },
  { symbol: 'q', ipa: 'tɕʰ', description: 'aspirated palatal affricate', group: 'palatal' },
  { symbol: 'x', ipa: 'ɕ', description: 'palatal fricative', group: 'palatal' },

  // Retroflexes (curled tongue sounds)
  { symbol: 'zh', ipa: 'ʈʂ', description: 'unaspirated retroflex affricate', group: 'retroflex' },
  { symbol: 'ch', ipa: 'ʈʂʰ', description: 'aspirated retroflex affricate', group: 'retroflex' },
  { symbol: 'sh', ipa: 'ʂ', description: 'retroflex fricative', group: 'retroflex' },
  { symbol: 'r', ipa: 'ɻ', description: 'retroflex approximant', group: 'retroflex' },

  // Sibilants (hissing sounds)
  { symbol: 'z', ipa: 'ts', description: 'unaspirated dental affricate', group: 'sibilant' },
  { symbol: 'c', ipa: 'tsʰ', description: 'aspirated dental affricate', group: 'sibilant' },
  { symbol: 's', ipa: 's', description: 'dental fricative', group: 'sibilant' },
];

// Grouped initials for display
export const INITIAL_GROUPS = {
  null: [''],
  labial: ['b', 'p', 'm', 'f'],
  dental: ['d', 't', 'n', 'l'],
  guttural: ['g', 'k', 'h'],
  palatal: ['j', 'q', 'x'],
  retroflex: ['zh', 'ch', 'sh', 'r'],
  sibilant: ['z', 'c', 's']
} as const;

// Flat list of initials (symbols only)
export const INITIALS = PINYIN_INITIALS.map(i => i.symbol);

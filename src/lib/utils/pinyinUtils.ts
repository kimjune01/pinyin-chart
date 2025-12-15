/**
 * Pinyin Utilities
 *
 * Helper functions for pinyin formatting and conversion
 */

// Tone mark mapping for each vowel
const TONE_MARKS: Record<string, string[]> = {
  'a': ['ā', 'á', 'ǎ', 'à', 'a'],
  'e': ['ē', 'é', 'ě', 'è', 'e'],
  'i': ['ī', 'í', 'ǐ', 'ì', 'i'],
  'o': ['ō', 'ó', 'ǒ', 'ò', 'o'],
  'u': ['ū', 'ú', 'ǔ', 'ù', 'u'],
  'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
  'v': ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'], // Alternative for ü
};

/**
 * Convert pinyin with tone number to pinyin with tone marks
 * @param pinyin - Base pinyin (e.g., "ma")
 * @param tone - Tone number (1-5)
 * @returns Pinyin with tone marks (e.g., "mā")
 *
 * Rules for tone mark placement:
 * 1. If there is an "a" or "e", place the tone mark on it
 * 2. If there is "ou", place the tone mark on "o"
 * 3. Otherwise, place the tone mark on the last vowel
 */
export function addToneMarks(pinyin: string, tone: number): string {
  if (tone < 1 || tone > 5) {
    return pinyin;
  }

  const toneIndex = tone - 1;
  let result = pinyin.toLowerCase();

  // Rule 1: If there's 'a' or 'e', mark it
  if (result.includes('a')) {
    const char = result.includes('a') ? 'a' : 'A';
    result = result.replace(/a/i, TONE_MARKS['a'][toneIndex]);
    return result;
  }

  if (result.includes('e')) {
    result = result.replace(/e/i, TONE_MARKS['e'][toneIndex]);
    return result;
  }

  // Rule 2: If there's "ou", mark the "o"
  if (result.includes('ou')) {
    result = result.replace(/o/i, TONE_MARKS['o'][toneIndex]);
    return result;
  }

  // Rule 3: Mark the last vowel
  // Find all vowels in order
  const vowels = ['i', 'u', 'ü', 'v', 'o'];
  for (let i = vowels.length - 1; i >= 0; i--) {
    const vowel = vowels[i];
    if (result.includes(vowel)) {
      const toneMarks = TONE_MARKS[vowel];
      if (toneMarks) {
        result = result.replace(new RegExp(vowel, 'i'), toneMarks[toneIndex]);
        return result;
      }
    }
  }

  return pinyin;
}

/**
 * Parse pinyin with tone number to base and tone
 * @param pinyinWithTone - Pinyin with tone number (e.g., "ma1")
 * @returns Object with base pinyin and tone number
 */
export function parsePinyin(pinyinWithTone: string): { base: string; tone: number } {
  const match = pinyinWithTone.match(/^([a-zü]+)([1-5])$/i);
  if (match) {
    return {
      base: match[1],
      tone: parseInt(match[2])
    };
  }
  return {
    base: pinyinWithTone,
    tone: 5
  };
}

/**
 * Check if a syllable-tone combination is valid
 */
export function isValidPinyin(syllable: string, tone: number): boolean {
  // This would check against our syllable database
  // For now, basic validation
  return tone >= 1 && tone <= 5 && syllable.length > 0;
}

/**
 * Get tone name
 */
export function getToneName(tone: number): string {
  const names = ['', '1st Tone', '2nd Tone', '3rd Tone', '4th Tone'];
  return names[tone] || '';
}

/**
 * Get tone color CSS variable
 */
export function getToneColor(tone: number): string {
  return `var(--tone-${tone}-color)`;
}

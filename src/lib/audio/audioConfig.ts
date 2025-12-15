/**
 * Audio Configuration for Pinyin Chart
 *
 * Defines CDN URLs and audio file paths.
 * Audio files are hotlinked from jsDelivr CDN (GitHub mirror).
 */

// Primary CDN: jsDelivr (fast, global CDN with no rate limits)
export const AUDIO_CDN_BASE = 'https://cdn.jsdelivr.net/gh/davinfifield/mp3-chinese-pinyin-sound@master/mp3';

// Fallback CDN: GitHub raw (slower, may have rate limits)
export const AUDIO_CDN_FALLBACK = 'https://raw.githubusercontent.com/davinfifield/mp3-chinese-pinyin-sound/master/mp3';

/**
 * Get the audio URL for a given pinyin syllable with tone
 * @param pinyin - Pinyin syllable with tone number (e.g., "ma1", "zhang4")
 * @returns Full URL to the audio file
 */
export function getAudioUrl(pinyin: string, useFallback = false): string {
  const base = useFallback ? AUDIO_CDN_FALLBACK : AUDIO_CDN_BASE;
  return `${base}/${pinyin}.mp3`;
}

/**
 * Preload strategy configuration
 */
export const AUDIO_CONFIG = {
  // Maximum number of audio files to keep in memory cache
  maxCacheSize: 300,

  // Common syllables to preload (from HSK 1-2 frequency)
  commonSyllables: [
    'de5', 'shi4', 'yi1', 'bu4', 'wo3', 'ni3', 'ta1', 'le5', 'men5',
    'zhe4', 'you3', 'ge4', 'zai4', 'bu2', 'hao3', 'ren2', 'shang4',
    'lai2', 'dao4', 'xia4', 'zi5', 'hui4', 'guo2', 'shuo1', 'kan4',
    'qu4', 'neng2', 'dou1', 'mei2', 'xiang3', 'yao4', 'dui4', 'yin1',
    'wei4', 'jian4', 'tai4', 'ji3', 'jiu4', 'gong1', 'zuo4', 'tian1',
    'jia1', 'wen4', 'ma5', 'ji4', 'ming2', 'xian4', 'zhong1', 'hou4'
  ],

  // Enable audio preloading
  enablePreload: true,

  // Volume settings
  defaultVolume: 0.7,
  minVolume: 0.0,
  maxVolume: 1.0
} as const;

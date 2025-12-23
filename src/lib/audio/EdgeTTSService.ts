/**
 * EdgeTTS Service - High-quality Chinese TTS using Microsoft Edge's neural voices
 *
 * Uses edge-tts-universal for free, API-key-free access to Microsoft's
 * neural TTS voices. Much higher quality than Web Speech API.
 */

// Available Chinese voices
export const CHINESE_VOICES = {
  // Mandarin (Simplified)
  xiaoxiao: 'zh-CN-XiaoxiaoNeural',    // Female, versatile
  xiaoyi: 'zh-CN-XiaoyiNeural',        // Female
  yunjian: 'zh-CN-YunjianNeural',      // Male
  yunxi: 'zh-CN-YunxiNeural',          // Male, narrator style
  yunxia: 'zh-CN-YunxiaNeural',        // Male, child
  yunyang: 'zh-CN-YunyangNeural',      // Male, professional
  // Regional dialects
  xiaobei: 'zh-CN-liaoning-XiaobeiNeural',  // Liaoning dialect
  xiaoni: 'zh-CN-shaanxi-XiaoniNeural',     // Shaanxi dialect
} as const;

export type ChineseVoice = keyof typeof CHINESE_VOICES;

// Default voice for Chinese TTS
const DEFAULT_VOICE = CHINESE_VOICES.xiaoxiao;

// Cache for audio blobs to avoid re-synthesizing
const audioCache = new Map<string, string>();
const MAX_CACHE_SIZE = 100;

/**
 * Synthesize text to speech using Edge TTS
 * @param text - Chinese text to synthesize
 * @param voice - Voice to use (defaults to xiaoxiao)
 * @returns Audio URL that can be played
 */
export async function synthesizeSpeech(
  text: string,
  voice: string = DEFAULT_VOICE
): Promise<string> {
  const cacheKey = `${voice}:${text}`;

  // Check cache first
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }

  try {
    // Dynamic import for browser compatibility
    const { EdgeTTS } = await import('edge-tts-universal/browser');

    const tts = new EdgeTTS(text, voice);
    const result = await tts.synthesize();

    // Convert to blob URL
    const audioBuffer = await result.audio.arrayBuffer();
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);

    // Cache the result
    if (audioCache.size >= MAX_CACHE_SIZE) {
      // Remove oldest entry
      const firstKey = audioCache.keys().next().value;
      if (firstKey) {
        const oldUrl = audioCache.get(firstKey);
        if (oldUrl) URL.revokeObjectURL(oldUrl);
        audioCache.delete(firstKey);
      }
    }
    audioCache.set(cacheKey, audioUrl);

    return audioUrl;
  } catch (error) {
    console.error('[EdgeTTS] Synthesis failed:', error);
    throw error;
  }
}

/**
 * Play text using Edge TTS
 * @param text - Chinese text to speak
 * @param waitForEnd - If true, wait for audio to finish
 * @param voice - Voice to use
 */
export async function speak(
  text: string,
  waitForEnd: boolean = false,
  voice: string = DEFAULT_VOICE
): Promise<void> {
  const audioUrl = await synthesizeSpeech(text, voice);
  const audio = new Audio(audioUrl);

  if (waitForEnd) {
    await new Promise<void>((resolve, reject) => {
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error(`EdgeTTS playback failed for: ${text}`));
      audio.play().catch(reject);
    });
  } else {
    await audio.play();
  }
}

/**
 * Check if Edge TTS is available in this environment
 */
export async function isAvailable(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    // Try to import the module
    await import('edge-tts-universal/browser');
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear the audio cache
 */
export function clearCache(): void {
  for (const url of audioCache.values()) {
    URL.revokeObjectURL(url);
  }
  audioCache.clear();
}

/**
 * Get cache size
 */
export function getCacheSize(): number {
  return audioCache.size;
}

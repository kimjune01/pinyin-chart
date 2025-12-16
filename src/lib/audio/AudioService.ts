/**
 * AudioService - Core audio management for Pinyin Chart
 *
 * Handles audio playback, preloading, and caching.
 * Works with Service Worker for persistent browser caching.
 */

import { getAudioUrl, getVocabAudioUrl, AUDIO_CONFIG, TTS_OVERRIDE_SYLLABLES, PINYIN_TO_HANZI } from './audioConfig';

export type AudioLoadState = 'idle' | 'loading' | 'loaded' | 'error';

interface AudioMetadata {
  url: string;
  state: AudioLoadState;
  audio: HTMLAudioElement | null;
  error?: Error;
}

class AudioServiceClass {
  private audioCache: Map<string, AudioMetadata>;
  private currentlyPlaying: HTMLAudioElement | null;
  private volume: number;
  private loadingPromises: Map<string, Promise<void>>;

  constructor() {
    this.audioCache = new Map();
    this.currentlyPlaying = null;
    this.volume = AUDIO_CONFIG.defaultVolume;
    this.loadingPromises = new Map();
  }

  /**
   * Normalize pinyin for audio lookup
   * Handles neutral tone (5) fallback to tone 4
   */
  private normalizePinyin(pinyin: string): string {
    // If tone 5 (neutral tone), try tone 4 as fallback (common for particles)
    if (pinyin.endsWith('5')) {
      return pinyin.slice(0, -1) + '4';
    }
    return pinyin;
  }

  /**
   * Play a pinyin syllable audio
   * @param pinyin - Pinyin with tone number (e.g., "ma1")
   * @param waitForEnd - If true, wait for audio to finish before resolving
   * @param allowOverlap - If true, don't stop currently playing audio (for parallel playback)
   */
  async play(pinyin: string, waitForEnd: boolean = false, allowOverlap: boolean = false): Promise<void> {
    // Normalize pinyin (handle neutral tone fallback)
    const normalizedPinyin = this.normalizePinyin(pinyin);

    // Check if this syllable should use TTS instead of CDN
    if (TTS_OVERRIDE_SYLLABLES.has(normalizedPinyin)) {
      await this.playPinyinWithTTS(normalizedPinyin, waitForEnd);
      return;
    }

    try {
      // Get or load audio
      const audio = await this.getAudio(normalizedPinyin);

      // Stop currently playing audio (unless overlap is allowed)
      if (!allowOverlap && this.currentlyPlaying && this.currentlyPlaying !== audio) {
        this.currentlyPlaying.pause();
        this.currentlyPlaying.currentTime = 0;
      }

      // For overlapping playback, clone the audio element so multiple instances can play
      const playableAudio = allowOverlap ? audio.cloneNode() as HTMLAudioElement : audio;

      // Set volume and play
      playableAudio.volume = this.volume;
      playableAudio.currentTime = 0;

      if (!allowOverlap) {
        this.currentlyPlaying = playableAudio;
      }

      if (waitForEnd) {
        // Wait for audio to finish playing
        await new Promise<void>((resolve, reject) => {
          playableAudio.onended = () => {
            if (this.currentlyPlaying === playableAudio) {
              this.currentlyPlaying = null;
            }
            resolve();
          };
          playableAudio.onerror = () => reject(new Error(`Error playing ${pinyin}`));
          playableAudio.play().catch(reject);
        });
      } else {
        await playableAudio.play();
        // Clear current playing when done
        playableAudio.onended = () => {
          if (this.currentlyPlaying === playableAudio) {
            this.currentlyPlaying = null;
          }
        };
      }
    } catch (error) {
      // CDN file missing or failed - fall back to TTS
      console.log(`[AudioService] CDN audio failed for "${pinyin}", falling back to TTS`);
      try {
        await this.playPinyinWithTTS(normalizedPinyin, waitForEnd);
      } catch (ttsError) {
        console.error(`[AudioService] TTS fallback also failed for "${pinyin}":`, ttsError);
        throw error;
      }
    }
  }

  /**
   * Play multiple syllables in sequence
   * @param syllables - Array of pinyin with tone numbers (e.g., ["ni3", "hao3"])
   * @param delayMs - Delay between syllables in milliseconds
   */
  async playSequence(syllables: string[], delayMs: number = 100): Promise<void> {
    for (let i = 0; i < syllables.length; i++) {
      await this.play(syllables[i], true);
      // Add delay between syllables (but not after the last one)
      if (i < syllables.length - 1 && delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  /**
   * Play vocabulary audio for a Chinese word (hanzi)
   * Tries audio-cmn CDN first, falls back to Web Speech API
   * @param hanzi - Chinese characters (e.g., "你好", "学生")
   * @param waitForEnd - If true, wait for audio to finish before resolving
   */
  async playVocabulary(hanzi: string, waitForEnd: boolean = false): Promise<void> {
    const cacheKey = `vocab:${hanzi}`;

    // Check if we already know this word is missing from CDN
    const cached = this.audioCache.get(cacheKey);
    if (cached?.state === 'error') {
      // Use Web Speech API fallback
      await this.speakWithWebSpeech(hanzi, waitForEnd);
      return;
    }

    // Try loading from CDN
    try {
      const audio = await this.loadVocabAudio(hanzi);

      // Stop currently playing audio
      if (this.currentlyPlaying && this.currentlyPlaying !== audio) {
        this.currentlyPlaying.pause();
        this.currentlyPlaying.currentTime = 0;
      }

      audio.volume = this.volume;
      audio.currentTime = 0;
      this.currentlyPlaying = audio;

      if (waitForEnd) {
        await new Promise<void>((resolve, reject) => {
          audio.onended = () => {
            if (this.currentlyPlaying === audio) {
              this.currentlyPlaying = null;
            }
            resolve();
          };
          audio.onerror = () => reject(new Error(`Error playing ${hanzi}`));
          audio.play().catch(reject);
        });
      } else {
        await audio.play();
        audio.onended = () => {
          if (this.currentlyPlaying === audio) {
            this.currentlyPlaying = null;
          }
        };
      }
    } catch {
      // CDN failed, use Web Speech API fallback
      console.log(`[AudioService] CDN audio not available for "${hanzi}", using Web Speech`);
      await this.speakWithWebSpeech(hanzi, waitForEnd);
    }
  }

  /**
   * Load vocabulary audio from CDN
   */
  private async loadVocabAudio(hanzi: string): Promise<HTMLAudioElement> {
    const cacheKey = `vocab:${hanzi}`;
    const url = getVocabAudioUrl(hanzi);

    // Check cache
    const cached = this.audioCache.get(cacheKey);
    if (cached?.audio && cached.state === 'loaded') {
      return cached.audio;
    }

    // Create metadata entry
    this.audioCache.set(cacheKey, {
      url,
      state: 'loading',
      audio: null
    });

    try {
      const audio = new Audio(url);

      await new Promise<void>((resolve, reject) => {
        audio.addEventListener('canplaythrough', () => resolve(), { once: true });
        audio.addEventListener('error', () => reject(new Error(`Failed to load vocab audio: ${hanzi}`)), { once: true });
        audio.load();
        // Shorter timeout for vocab audio (3 seconds)
        setTimeout(() => reject(new Error(`Timeout loading vocab audio: ${hanzi}`)), 3000);
      });

      this.audioCache.set(cacheKey, {
        url,
        state: 'loaded',
        audio
      });

      this.trimCache();
      return audio;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.audioCache.set(cacheKey, {
        url,
        state: 'error',
        audio: null,
        error: err
      });
      throw err;
    }
  }

  /**
   * Use Web Speech API to speak Chinese text
   * @param text - Chinese text to speak
   * @param waitForEnd - If true, wait for speech to finish
   */
  private async speakWithWebSpeech(text: string, waitForEnd: boolean = false): Promise<void> {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('[AudioService] Web Speech API not available');
      return;
    }

    // Stop any currently playing audio
    this.stop();
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.volume = this.volume;

    // Try to find a Chinese voice
    const voices = window.speechSynthesis.getVoices();
    const chineseVoice = voices.find(v => v.lang.startsWith('zh'));
    if (chineseVoice) {
      utterance.voice = chineseVoice;
    }

    if (waitForEnd) {
      await new Promise<void>((resolve) => {
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve(); // Don't throw, just continue
        window.speechSynthesis.speak(utterance);
      });
    } else {
      window.speechSynthesis.speak(utterance);
    }
  }

  /**
   * Play pinyin using TTS with representative Chinese character
   * @param pinyin - Pinyin with tone number (e.g., "sheng4")
   * @param waitForEnd - If true, wait for speech to finish
   */
  private async playPinyinWithTTS(pinyin: string, waitForEnd: boolean = false): Promise<void> {
    // Extract base and tone from pinyin (e.g., "sheng4" -> "sheng", 4)
    const match = pinyin.match(/^([a-zü]+)(\d)$/i);
    if (!match) {
      console.warn(`[AudioService] Invalid pinyin format for TTS: ${pinyin}`);
      return;
    }

    const [, base, toneStr] = match;
    const tone = parseInt(toneStr);

    // Look up the representative hanzi for this pinyin+tone
    const hanziMap = PINYIN_TO_HANZI[base.toLowerCase()];
    if (!hanziMap) {
      console.warn(`[AudioService] No hanzi mapping for pinyin: ${base}`);
      // Fall back to speaking the pinyin directly
      await this.speakWithWebSpeech(pinyin, waitForEnd);
      return;
    }

    const hanzi = hanziMap[tone - 1]; // tones are 1-indexed
    console.log(`[AudioService] Using TTS for ${pinyin} -> ${hanzi}`);
    await this.speakWithWebSpeech(hanzi, waitForEnd);
  }

  /**
   * Get audio element (from cache or load)
   */
  private async getAudio(pinyin: string): Promise<HTMLAudioElement> {
    // Check cache first
    const cached = this.audioCache.get(pinyin);
    if (cached?.audio && cached.state === 'loaded') {
      return cached.audio;
    }

    // If already loading, wait for that promise
    const loadingPromise = this.loadingPromises.get(pinyin);
    if (loadingPromise) {
      await loadingPromise;
      const loaded = this.audioCache.get(pinyin);
      if (loaded?.audio) {
        return loaded.audio;
      }
    }

    // Load new audio
    return this.loadAudio(pinyin);
  }

  /**
   * Load an audio file
   */
  private async loadAudio(pinyin: string): Promise<HTMLAudioElement> {
    const promise = this._loadAudioInternal(pinyin);
    this.loadingPromises.set(pinyin, promise);

    try {
      await promise;
      const metadata = this.audioCache.get(pinyin);
      if (!metadata?.audio) {
        throw new Error(`Failed to load audio for ${pinyin}`);
      }
      return metadata.audio;
    } finally {
      this.loadingPromises.delete(pinyin);
    }
  }

  /**
   * Internal load logic
   */
  private async _loadAudioInternal(pinyin: string): Promise<void> {
    const url = getAudioUrl(pinyin);

    // Create metadata entry
    this.audioCache.set(pinyin, {
      url,
      state: 'loading',
      audio: null
    });

    try {
      const audio = new Audio(url);

      // Wait for audio to be loadable
      await new Promise<void>((resolve, reject) => {
        audio.addEventListener('canplaythrough', () => resolve(), { once: true });
        audio.addEventListener('error', () => {
          // Try fallback URL
          const fallbackUrl = getAudioUrl(pinyin, true);
          if (audio.src !== fallbackUrl) {
            console.warn(`[AudioService] Primary CDN failed for "${pinyin}", trying fallback...`);
            audio.src = fallbackUrl;
          } else {
            reject(new Error(`Failed to load audio: ${pinyin}`));
          }
        }, { once: true });

        audio.load();

        // Timeout after 10 seconds
        setTimeout(() => reject(new Error(`Timeout loading audio: ${pinyin}`)), 10000);
      });

      // Update cache with loaded audio
      this.audioCache.set(pinyin, {
        url,
        state: 'loaded',
        audio
      });

      // Manage cache size
      this.trimCache();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.audioCache.set(pinyin, {
        url,
        state: 'error',
        audio: null,
        error: err
      });
      throw err;
    }
  }

  /**
   * Preload multiple syllables
   */
  async preload(syllables: string[]): Promise<void> {
    console.log(`[AudioService] Preloading ${syllables.length} syllables...`);

    const promises = syllables.map(pinyin =>
      this.loadAudio(pinyin).catch(err => {
        console.warn(`[AudioService] Failed to preload "${pinyin}":`, err);
      })
    );

    await Promise.all(promises);
    console.log(`[AudioService] Preload complete`);
  }

  /**
   * Preload common syllables
   */
  async preloadCommon(): Promise<void> {
    if (!AUDIO_CONFIG.enablePreload) return;
    await this.preload([...AUDIO_CONFIG.commonSyllables]);
  }

  /**
   * Stop currently playing audio
   */
  stop(): void {
    if (this.currentlyPlaying) {
      this.currentlyPlaying.pause();
      this.currentlyPlaying.currentTime = 0;
      this.currentlyPlaying = null;
    }
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(
      AUDIO_CONFIG.minVolume,
      Math.min(AUDIO_CONFIG.maxVolume, volume)
    );

    if (this.currentlyPlaying) {
      this.currentlyPlaying.volume = this.volume;
    }
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * Check if audio is loaded
   */
  isLoaded(pinyin: string): boolean {
    const metadata = this.audioCache.get(pinyin);
    return metadata?.state === 'loaded';
  }

  /**
   * Get load state
   */
  getLoadState(pinyin: string): AudioLoadState {
    return this.audioCache.get(pinyin)?.state ?? 'idle';
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.audioCache.size;
  }

  /**
   * Trim cache to max size (LRU eviction)
   */
  private trimCache(): void {
    if (this.audioCache.size <= AUDIO_CONFIG.maxCacheSize) {
      return;
    }

    // Remove oldest entries
    const entries = Array.from(this.audioCache.entries());
    const toRemove = entries.slice(0, this.audioCache.size - AUDIO_CONFIG.maxCacheSize);

    for (const [key] of toRemove) {
      this.audioCache.delete(key);
    }

    console.log(`[AudioService] Trimmed cache to ${this.audioCache.size} entries`);
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.stop();
    this.audioCache.clear();
    this.loadingPromises.clear();
    console.log('[AudioService] Cache cleared');
  }
}

// Singleton instance
export const audioService = new AudioServiceClass();

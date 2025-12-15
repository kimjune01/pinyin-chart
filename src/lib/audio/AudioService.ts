/**
 * AudioService - Core audio management for Pinyin Chart
 *
 * Handles audio playback, preloading, and caching.
 * Works with Service Worker for persistent browser caching.
 */

import { getAudioUrl, AUDIO_CONFIG } from './audioConfig';

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
   * Play a pinyin syllable audio
   * @param pinyin - Pinyin with tone number (e.g., "ma1")
   */
  async play(pinyin: string): Promise<void> {
    try {
      // Get or load audio
      const audio = await this.getAudio(pinyin);

      // Stop currently playing audio
      if (this.currentlyPlaying && this.currentlyPlaying !== audio) {
        this.currentlyPlaying.pause();
        this.currentlyPlaying.currentTime = 0;
      }

      // Set volume and play
      audio.volume = this.volume;
      audio.currentTime = 0;
      await audio.play();

      this.currentlyPlaying = audio;

      // Clear current playing when done
      audio.onended = () => {
        if (this.currentlyPlaying === audio) {
          this.currentlyPlaying = null;
        }
      };
    } catch (error) {
      console.error(`[AudioService] Failed to play audio for "${pinyin}":`, error);
      throw error;
    }
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

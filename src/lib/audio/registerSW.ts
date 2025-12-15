/**
 * Service Worker Registration for Pinyin Chart
 *
 * Registers the service worker to enable audio caching and offline functionality.
 * This should be called once when the app loads.
 */

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.warn('[registerSW] Service Workers are not supported in this browser');
    return null;
  }

  try {
    // Register the service worker
    const registration = await navigator.serviceWorker.register(
      '/pinyin-chart/sw.js',
      { scope: '/pinyin-chart/' }
    );

    console.log('[registerSW] Service Worker registered successfully:', registration.scope);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker available
          console.log('[registerSW] New Service Worker available. Refresh to update.');

          // Optionally notify the user
          if (confirm('A new version of Pinyin Chart is available. Reload to update?')) {
            newWorker.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
          }
        }
      });
    });

    // Listen for controlling service worker changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[registerSW] Service Worker controller changed');
    });

    return registration;
  } catch (error) {
    console.error('[registerSW] Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Get the number of cached audio files
 */
export async function getCachedAudioCount(): Promise<number> {
  if (!navigator.serviceWorker.controller) {
    return 0;
  }

  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      if (event.data.type === 'CACHE_SIZE') {
        resolve(event.data.count);
      }
    };

    navigator.serviceWorker.controller!.postMessage(
      { type: 'GET_CACHE_SIZE' },
      [messageChannel.port2]
    );

    // Timeout after 5 seconds
    setTimeout(() => resolve(0), 5000);
  });
}

/**
 * Clear all cached audio files
 */
export async function clearAudioCache(): Promise<void> {
  if (!navigator.serviceWorker.controller) {
    return;
  }

  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      if (event.data.type === 'CACHE_CLEARED') {
        console.log('[registerSW] Audio cache cleared');
        resolve();
      }
    };

    navigator.serviceWorker.controller!.postMessage(
      { type: 'CLEAR_CACHE' },
      [messageChannel.port2]
    );

    // Timeout after 5 seconds
    setTimeout(() => resolve(), 5000);
  });
}

/**
 * Check if service worker is ready
 */
export function isServiceWorkerReady(): boolean {
  return 'serviceWorker' in navigator && !!navigator.serviceWorker.controller;
}

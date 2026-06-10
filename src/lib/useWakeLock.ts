import { useEffect } from 'react';

/** Keep the screen awake while `active`. Silently does nothing where unsupported. */
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return;

    let lock: WakeLockSentinel | null = null;
    let released = false;

    const acquire = async () => {
      try {
        lock = await navigator.wakeLock.request('screen');
        if (released) void lock.release();
      } catch {
        // Rejected (low battery, unsupported) — screen may dim, that's fine.
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') void acquire();
    };

    void acquire();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      released = true;
      document.removeEventListener('visibilitychange', onVisibility);
      void lock?.release();
    };
  }, [active]);
}

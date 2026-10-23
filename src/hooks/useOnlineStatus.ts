import { useEffect, useState, useCallback } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [isChecking, setIsChecking] = useState(false);

  // Active ping to verify real server reachability
  const checkConnectivity = useCallback(async (): Promise<boolean> => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOnline(false);
      return false;
    }

    setIsChecking(true);
    try {
      // Use cache-busting timestamp to avoid cached response
      const res = await fetch(`/api/version?_t=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store',
      });
      const online = res.ok;
      setIsOnline(online);
      setIsChecking(false);
      return online;
    } catch {
      // Server unreachable or no internet
      setIsOnline(false);
      setIsChecking(false);
      return false;
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      // Re-verify with active ping
      checkConnectivity();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkConnectivity();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial check on mount
    checkConnectivity();

    // Adaptive periodic connectivity ping: check every 3s when offline for instant unlock, 12s when online
    const interval = setInterval(() => {
      checkConnectivity();
    }, isOnline ? 12000 : 3000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [checkConnectivity, isOnline]);

  return { isOnline, isChecking, checkConnectivity };
}

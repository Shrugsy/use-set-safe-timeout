import { useRef, useEffect, useCallback } from "react";

/**
 * Returns a callback that acts as a 'safe' version of window.setTimeout which clears itself on unmount
 */
function useSetSafeTimeout() {
  const timeoutIds = useRef<number[]>([]);

  /* on cleanup, clear any timeouts created
  by this hook's instance of `setSafeTimeout` */
  useEffect(() => {
    return () => {
      // Intentionally want the latest values outside of this scope
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
      timeoutIds.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
    };
  }, []);

  /**
   * Accepts the same args as, and internally calls `window.setTimeout`.
   * Also clears timeouts created with this instance on unmount.
   */
  const setSafeTimeout = useCallback(
    (
      callback: () => void,
      milliseconds: number | undefined,
      ...args: unknown[]
    ) => {
      const timeoutId = window.setTimeout(callback, milliseconds, ...args);
      timeoutIds.current.push(timeoutId);
      return () => window.clearTimeout(timeoutId);
    },
    []
  );

  return setSafeTimeout;
}

export default useSetSafeTimeout;

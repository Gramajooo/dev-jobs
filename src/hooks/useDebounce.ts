import { useEffect, useMemo, useRef } from "react";

export type DebouncedFunction<T extends (...args: any[]) => any> = ((
  ...args: Parameters<T>
) => void) & {
  cancel: () => void;
};

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 350,
): DebouncedFunction<T> {
  const callbackRef = useRef<T>(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const debounced = useMemo(() => {
    const fn = (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    };

    fn.cancel = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    return fn;
  }, [delay]);

  return debounced;
}

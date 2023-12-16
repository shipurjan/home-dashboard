import { useEffect, useRef } from 'react';

type IntervalCallback = () => void;

export function useDispatch(callback: IntervalCallback, delay: number): void {
  const savedCallback = useRef<IntervalCallback>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);

  // Run on mount
  useEffect(() => {
    if (savedCallback.current) savedCallback.current();
  }, []);
}

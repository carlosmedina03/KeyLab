import { useState, useEffect } from 'react';

/**
 * Debounce hook — delays the update of a value by the specified delay.
 * Used to prevent excessive regex evaluations on every keystroke.
 * Default delay: 150ms (as per spec NFR)
 */
export function useDebounce(value, delay = 150) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

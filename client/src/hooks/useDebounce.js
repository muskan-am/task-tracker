/**
 * @file useDebounce.js
 * @description Returns a debounced version of the provided value.
 * Used by TaskFilter to delay the search API call while the user types.
 *
 * @param {*}      value - The value to debounce
 * @param {number} [delay=500] - Milliseconds to wait before updating
 * @returns {*} The debounced value
 *
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * useEffect(() => { fetchTasks({ search: debouncedSearch }); }, [debouncedSearch]);
 */

import { useState, useEffect } from "react";

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // clean up on value or delay change
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;

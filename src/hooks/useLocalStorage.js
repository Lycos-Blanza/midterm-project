import { useState, useEffect } from "react";

// Custom hook to sync state with localStorage
export default function useLocalStorage(key, initialValue) {
  // Initialize state from localStorage if it exists, otherwise use initialValue
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue; // fallback if error occurs
    }
  });

  // Update localStorage whenever value or key changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  // Return state and setter like useState
  return [value, setValue];
}

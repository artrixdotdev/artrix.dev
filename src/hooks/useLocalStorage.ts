"use client";
import { useState, useEffect } from "react";

export function useLocalStorage<T>(
   key: string,
   initialValue: T,
   forceNew = false,
): readonly [T, (value: T | ((prev: T) => T)) => void] {
   const [storedValue, setStoredValue] = useState<T>(initialValue);

   useEffect(() => {
      try {
         // If forceNew is true, always set the initial value
         if (forceNew) {
            window.localStorage.setItem(key, JSON.stringify(initialValue));
            setStoredValue(initialValue);
            return;
         }

         const item = window.localStorage.getItem(key);
         if (item !== null) {
            setStoredValue(JSON.parse(item));
         } else {
            window.localStorage.setItem(key, JSON.stringify(initialValue));
         }
      } catch (error) {
         console.error("Error accessing localStorage:", error);
      }
   }, [key, initialValue, forceNew]);

   const setValue = (value: T | ((prev: T) => T)) => {
      try {
         const valueToStore =
            value instanceof Function ? value(storedValue) : value;
         setStoredValue(valueToStore);
         window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
         console.error("Error setting localStorage:", error);
      }
   };

   return [storedValue, setValue] as const;
}

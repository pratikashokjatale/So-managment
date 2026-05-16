import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function useDebouncedQueryParam(
  key: string,
  delay = 500,
  defaultValue = ""
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get(key) ?? defaultValue;

  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  const setValue = (newValue: string) => {
    setSearchParams((prev) => {
      if (!newValue) {
        prev.delete(key);
      } else {
        prev.set(key, newValue);
      }
      return prev;
    });
  };

  return {
    value,
    debouncedValue,
    setValue,
  };
}

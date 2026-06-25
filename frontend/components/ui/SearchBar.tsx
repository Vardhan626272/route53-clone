"use client";

import { useEffect, useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search",
  debounceMs = 300,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (localValue !== value) onChange(localValue);
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [localValue, value, onChange, debounceMs]);

  return (
    <div className="relative w-full max-w-md">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-aws-muted">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <input
        type="search"
        value={localValue}
        onChange={(event) => setLocalValue(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded border border-aws-border bg-white py-2 pl-9 pr-3 text-sm text-aws-text outline-none transition focus:border-aws-link focus:ring-1 focus:ring-aws-link"
      />
    </div>
  );
}

'use client';

import { ChangeEvent } from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  name?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  label,
  name = 'search',
}: SearchInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <label className="flex w-full items-center gap-3 rounded-md border border-[var(--border-color)] bg-[var(--background)] px-4 py-2 shadow-sm transition  ">
      <FiSearch className="text-[var(--text-sub)]" aria-hidden="true" />
      {label && (
        <span className="sr-only" id={`${name}-label`}>
          {label}
        </span>
      )}
      <input
        id={`${name}-input`}
        aria-labelledby={label ? `${name}-label` : undefined}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-sub)]"
        name={name}
      />
    </label>
  );
}

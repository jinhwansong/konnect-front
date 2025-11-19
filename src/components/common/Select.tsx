'use client';

import clsx from 'clsx';
import React, { useState, useRef, JSX } from 'react';
import { FiChevronDown } from 'react-icons/fi';

import useClickOutside from '@/hooks/useClickOutside';
import { Option } from '@/types/apply';

interface SelectProps<T extends string> {
  value?: T;
  onChange: React.Dispatch<React.SetStateAction<T>> | ((value: T) => void);
  options: Option[];
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
}

function SelectComponent<T extends string>(
  {
    value,
    onChange,
    options,
    placeholder,
    label,
    error,
    disabled = false,
    className,
    name,
  }: SelectProps<T>,
  _ref: React.Ref<HTMLDivElement>
) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  useClickOutside(selectRef, () => setIsOpen(false));

  const selected = options.find(o => o.value === value);
  const selectId = name || 'select';

  const handleChange = (val: T) => {
    (onChange as (value: T) => void)(val); // any 제거한 안전한 호출
  };

  return (
    <div  ref={selectRef}>
      {label && (
        <label
          htmlFor={selectId}
          className="mb-2 block text-sm font-medium text-[var(--text-bold)]"
        >
          {label}
        </label>
      )}
      <div className={`relative ${className || ''}`}>
        <button
          type="button"
          id={selectId}
          onClick={() => !disabled && setIsOpen(prev => !prev)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={clsx(
            'flex h-[50px] w-full items-center justify-between rounded-lg border px-4 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2',
            'bg-[var(--editor-bg)] text-[var(--text)]',
            'border-[var(--border-color)] hover:border-[var(--primary-sub01)]',
            'focus:border-[var(--primary)] focus:outline-none',
            disabled &&
              'cursor-not-allowed bg-[var(--primary-sub02)] opacity-60',
            error &&
              'border-[var(--color-danger)] focus:border-[var(--color-danger)]'
          )}
        >
          {selected?.label || (
            <span className="text-[var(--text-sub)]">{placeholder}</span>
          )}
          <FiChevronDown
            className={clsx(
              'ml-2 h-5 w-5 text-[var(--text-sub)] transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {isOpen && (
          <ul
            role="listbox"
            className="absolute z-20 mt-2 max-h-[200px] w-full overflow-auto rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-2 py-2 shadow-lg"
          >
            {options.map(item => {
              const isActive = item.value === value;
              return (
                <li
                  key={item.value}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    handleChange(item.value as T);
                    setIsOpen(false);
                  }}
                  className={clsx(
                    'cursor-pointer rounded-md px-3 py-2.5 text-sm transition-colors',
                    isActive
                      ? 'bg-[var(--primary-sub02)] font-medium text-[var(--primary)]'
                      : 'text-[var(--text)] hover:bg-[var(--hover-bg)]'
                  )}
                >
                  {item.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {error && (
        <p
          id={`${selectId}-error`}
          className="mt-1 text-sm text-[var(--color-danger)]"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

const Select = React.memo(React.forwardRef(SelectComponent)) as <
  T extends string,
>(
  props: SelectProps<T> & React.RefAttributes<HTMLDivElement>
) => JSX.Element;

export default Select;

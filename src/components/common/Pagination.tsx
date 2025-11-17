import clsx from 'clsx';
import React from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from 'react-icons/fi';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (newPage: number) => void;
  className?: string;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      page,
      totalPages,
      onChange,
      className,
      showFirstLast = true,
      showPrevNext = true,
    },
    ref
  ) => {
    const group = Math.ceil(page / 10);
    const start = (group - 1) * 10 + 1;
    const end = Math.min(group * 10, totalPages);
    const handlePage = (p: number) => {
      if (p >= 1 && p <= totalPages) onChange(p);
    };
    const buttonClasses =
      'flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

    return (
      <nav
        ref={ref}
        className={`mt-5 flex w-full items-center justify-center gap-1.5 ${className || ''}`}
        role="navigation"
        aria-label="Pagination Navigation"
      >
        {showFirstLast && (
          <button
            onClick={() => handlePage(1)}
            disabled={page === 1}
            className={buttonClasses}
            aria-label="Go to first page"
          >
            <FiChevronsLeft />
          </button>
        )}
        {showPrevNext && (
          <button
            onClick={() => handlePage(page - 1)}
            disabled={page === 1}
            className={buttonClasses}
            aria-label="Go to previous page"
          >
            <FiChevronLeft />
          </button>
        )}

        {Array.from({ length: end - start + 1 }, (_, index) => {
          const pageNum = start + index;
          return (
            <button
              key={pageNum}
              onClick={() => handlePage(pageNum)}
              disabled={page === pageNum}
              className={clsx(
                'flex h-9 w-9 items-center justify-center rounded-full border focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
                page === pageNum
                  ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                  : 'border-[var(--border-color)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
              )}
              aria-label={`Go to page ${pageNum}`}
              aria-current={page === pageNum ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}

        {showPrevNext && (
          <button
            onClick={() => handlePage(page + 1)}
            disabled={page === totalPages}
            className={buttonClasses}
            aria-label="Go to next page"
          >
            <FiChevronRight />
          </button>
        )}
        {showFirstLast && (
          <button
            onClick={() => handlePage(totalPages)}
            disabled={page === totalPages}
            className={buttonClasses}
            aria-label="Go to last page"
          >
            <FiChevronsRight />
          </button>
        )}
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination';

export default React.memo(Pagination);

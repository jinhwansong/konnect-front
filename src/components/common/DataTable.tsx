'use client';

import { ReactNode } from 'react';

type SortDirection = 'asc' | 'desc' | 'none';

interface Column<T> {
  key: keyof T | string;
  label: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data?: T[];
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  renderRow?: (item: T, index: number) => ReactNode;
  onSort?: (key: Column<T>['key'], direction: SortDirection) => void;
  sortState?: { key: Column<T>['key']; direction: SortDirection };
  getRowKey?: (item: T, index: number) => string;
}

export default function DataTable<T extends object>({
  columns,
  data = [],
  isLoading = false,
  isError = false,
  errorMessage = 'Something went wrong. Please try again.',
  emptyMessage = 'No records found.',
  renderRow,
  onSort,
  sortState,
  getRowKey,
}: DataTableProps<T>) {
  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !onSort) return;
    const currentDirection =
      sortState?.key === column.key ? sortState.direction : 'none';
    const nextDirection =
      currentDirection === 'none'
        ? 'asc'
        : currentDirection === 'asc'
          ? 'desc'
          : 'none';

    onSort(column.key, nextDirection);
  };

  const renderPlaceholder = () => {
    if (isLoading) {
      return (
        <tbody>
          {Array.from({ length: 5 }).map((_, index) => (
            <tr
              key={`skeleton-${index}`}
              className="animate-pulse border-b border-[var(--border-color)]"
            >
              {columns.map(column => (
                <td key={String(column.key)} className="px-6 py-4">
                  <div className="h-4 w-24 rounded bg-[var(--background-sub)]" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      );
    }

    if (isError) {
      return (
        <tbody>
          <tr>
            <td
              colSpan={columns.length}
              className="px-6 py-10 text-center text-sm text-[var(--color-danger)]"
            >
              {errorMessage}
            </td>
          </tr>
        </tbody>
      );
    }

    if (!data.length) {
      return (
        <tbody>
          <tr>
            <td
              colSpan={columns.length}
              className="px-6 py-10 text-center text-sm text-[var(--text-sub)]"
            >
              {emptyMessage}
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {data.map((item, index) => (
          <tr
            key={getRowKey ? getRowKey(item, index) : index}
            className="border-b border-[var(--border-color)] transition hover:bg-[var(--hover-bg)]"
          >
            {renderRow
              ? renderRow(item, index)
              : columns.map(column => (
                  <td
                    key={String(column.key)}
                    className={`px-6 py-4 text-sm text-[var(--text)] ${getAlignmentClasses(column.align)}`}
                  >
                    {String(item[column.key as keyof T] ?? '—')}
                  </td>
                ))}
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm">
      <div className="max-w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--border-color)] text-sm">
          <thead className="bg-[var(--background)]">
            <tr>
              {columns.map(column => {
                const isActive = sortState?.key === column.key;
                const direction = isActive
                  ? (sortState?.direction ?? 'none')
                  : 'none';
                return (
                  <th
                    key={String(column.key)}
                    scope="col"
                    style={column.width ? { width: column.width } : undefined}
                    className={`px-6 py-4 text-left text-xs font-semibold tracking-wide text-[var(--text-sub)] uppercase ${getAlignmentClasses(column.align)}`}
                    aria-sort={
                      column.sortable
                        ? direction === 'none'
                          ? 'none'
                          : direction === 'asc'
                            ? 'ascending'
                            : 'descending'
                        : undefined
                    }
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(column)}
                      className={`flex items-center gap-2 text-xs font-semibold text-[var(--text-sub)] transition hover:text-[var(--text-bold)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] focus-visible:outline-none ${column.sortable ? '' : 'cursor-default'}`}
                      aria-label={
                        column.sortable ? `${column.label} 정렬` : undefined
                      }
                      disabled={!column.sortable}
                    >
                      {column.label}
                      {column.sortable && (
                        <span className="text-[10px]">
                          {direction === 'none'
                            ? '↕'
                            : direction === 'asc'
                              ? '↑'
                              : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          {renderPlaceholder()}
        </table>
      </div>
    </div>
  );
}

function getAlignmentClasses(align: Column<object>['align']) {
  switch (align) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-left';
  }
}

'use client';
import { useCallback, useState } from 'react';

export default function usePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const onPrevPage = useCallback(() => {
    setCurrentPage((prev) => prev - 1);
  }, []);
  const onNextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);
  const onPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  return { currentPage, onPrevPage, onNextPage, onPage };
}

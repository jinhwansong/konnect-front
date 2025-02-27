import React from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import style from './pagenaion.module.scss';
import { IPage } from '@/type';

interface IPagenation extends IPage {
  totalPage: number;
}

export default function Pagenation({
  totalPage,
  currentPage,
  onPage,
  onPrevPage,
  onNextPage,
}: IPagenation) {
  const group = Math.ceil(currentPage / 10);
  const start = (group - 1) * 10 + 1;
  const end = Math.min(group * 10, totalPage);
  return (
    <div className={style.pagenation}>
      <button onClick={() => onPage(1)} disabled={currentPage === 1}>
        <FiChevronsLeft />
      </button>
      <button onClick={() => onPrevPage()} disabled={currentPage === 1}>
        <FiChevronLeft />
      </button>

      {Array.from({ length: end - start + 1 }, (_, index) => {
        const pageNum = start + index;
        return (
          <button
            key={pageNum}
            onClick={() => onPage(pageNum)}
            disabled={currentPage === pageNum}
            className={currentPage === pageNum ? style.active : ''}
          >
            {pageNum}
          </button>
        );
      })}

      <button onClick={() => onNextPage()} disabled={currentPage === totalPage}>
        <FiChevronRight />
      </button>
      <button
        onClick={() => onPage(totalPage)}
        disabled={currentPage === totalPage}
      >
        <FiChevronsRight />
      </button>
    </div>
  );
}

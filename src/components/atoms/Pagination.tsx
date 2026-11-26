// src/components/atoms/Pagination.tsx
import React from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const createPageArray = () => {
    const pages = [];
    const maxVisible = 5; // show max 5 pages at a time
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pages = createPageArray();

  return (
    <div className="flex items-center space-x-2 mt-4 justify-center">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded ${p === page ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          {p}
        </button>
      ))}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        ›
      </button>
    </div>
  );
};

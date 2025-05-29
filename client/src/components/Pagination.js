// components/Pagination.jsx
import React from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let startPage, endPage;

        if (totalPages <= maxVisible) {
            startPage = 1;
            endPage = totalPages;
        } else {
            const half = Math.floor(maxVisible / 2);
            if (currentPage <= half + 1) {
                startPage = 1;
                endPage = maxVisible;
            } else if (currentPage >= totalPages - half) {
                startPage = totalPages - maxVisible + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - half;
                endPage = currentPage + half;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${
                        currentPage === i
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                    } transition-colors`}
                    aria-current={currentPage === i ? 'page' : undefined}
                >
                    {i}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center space-x-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                    currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
                aria-label="Предыдущая страница"
            >
                <HiChevronLeft className="w-5 h-5" />
            </button>

            {renderPageNumbers()}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                    currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
                aria-label="Следующая страница"
            >
                <HiChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination;
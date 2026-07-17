import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DashboardPaginationProps {
    page: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}

const DashboardPagination: React.FC<DashboardPaginationProps> = ({
    page, pageSize, totalItems, onPageChange,
}) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    if (totalItems <= pageSize) return null;

    const safePage = Math.min(page, totalPages);
    const from = (safePage - 1) * pageSize + 1;
    const to = Math.min(safePage * pageSize, totalItems);

    return (
        <div className="analytics-pagination">
            <span className="analytics-pagination__summary">{from}–{to} / {totalItems}</span>
            <div className="analytics-pagination__controls">
                <button
                    type="button"
                    className="analytics-pagination__button"
                    onClick={() => onPageChange(safePage - 1)}
                    disabled={safePage <= 1}
                    aria-label="Trang trước"
                >
                    <ChevronLeft size={14} />
                </button>
                <span className="analytics-pagination__page">{safePage} / {totalPages}</span>
                <button
                    type="button"
                    className="analytics-pagination__button"
                    onClick={() => onPageChange(safePage + 1)}
                    disabled={safePage >= totalPages}
                    aria-label="Trang sau"
                >
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
};

export default DashboardPagination;

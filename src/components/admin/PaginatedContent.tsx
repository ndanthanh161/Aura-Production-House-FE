import React, { useMemo, useState } from 'react';
import DashboardPagination from './DashboardPagination';

interface PaginatedRenderState<T> {
    items: T[];
    startIndex: number;
    pagination: React.ReactNode;
}

interface PaginatedContentProps<T> {
    items: T[];
    pageSize: number;
    children: (state: PaginatedRenderState<T>) => React.ReactNode;
}

const PaginatedContent = <T,>({ items, pageSize, children }: PaginatedContentProps<T>) => {
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const safePage = Math.min(page, totalPages);

    const visibleItems = useMemo(() => {
        const start = (safePage - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [items, pageSize, safePage]);

    return children({
        items: visibleItems,
        startIndex: (safePage - 1) * pageSize,
        pagination: (
            <DashboardPagination
                page={safePage}
                pageSize={pageSize}
                totalItems={items.length}
                onPageChange={setPage}
            />
        ),
    });
};

export default PaginatedContent;

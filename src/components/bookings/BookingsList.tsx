import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BookingCard } from './BookingCard';
import type { Project } from '../../types/project.types';

interface BookingsListProps {
    bookings: Project[];
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    ITEMS_PER_PAGE: number;
    onSelectProject: (project: Project) => void;
    onPay: (packageId: string, projectId: string) => void;
}

export const BookingsList: React.FC<BookingsListProps> = React.memo(({
    bookings,
    currentPage,
    setCurrentPage,
    ITEMS_PER_PAGE,
    onSelectProject,
    onPay
}) => {
    return (
        <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'grid', gap: '2rem' }}
        >
            {bookings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((booking, index) => (
                <BookingCard
                    key={booking.id}
                    booking={booking}
                    index={index}
                    onSelect={onSelectProject}
                    onPay={onPay}
                />
            ))}

            {/* Pagination Controls */}
            {bookings.length > ITEMS_PER_PAGE && (
                <div style={{
                    marginTop: '4rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        style={{
                            width: '46px', height: '46px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            color: currentPage === 1 ? 'var(--color-text-muted)' : 'var(--color-text)',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'var(--transition-cinematic)',
                            opacity: currentPage === 1 ? 0.25 : 1
                        }}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {Array.from({ length: Math.ceil(bookings.length / ITEMS_PER_PAGE) }).map((_, idx) => {
                            const pageNum = idx + 1;
                            const isActive = currentPage === pageNum;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    style={{
                                        width: '46px', height: '46px',
                                        borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.8rem', fontWeight: 800,
                                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                        backgroundColor: isActive ? 'var(--color-accent)' : 'transparent',
                                        border: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                                        color: isActive ? 'white' : 'var(--color-text)',
                                        cursor: 'pointer',
                                        transform: isActive ? 'scale(1.08)' : 'scale(1)'
                                    }}
                                >
                                    {pageNum.toString().padStart(2, '0')}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(bookings.length / ITEMS_PER_PAGE), prev + 1))}
                        disabled={currentPage === Math.ceil(bookings.length / ITEMS_PER_PAGE)}
                        style={{
                            width: '46px', height: '46px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            color: currentPage === Math.ceil(bookings.length / ITEMS_PER_PAGE) ? 'var(--color-text-muted)' : 'var(--color-text)',
                            cursor: currentPage === Math.ceil(bookings.length / ITEMS_PER_PAGE) ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'var(--transition-cinematic)',
                            opacity: currentPage === Math.ceil(bookings.length / ITEMS_PER_PAGE) ? 0.25 : 1
                        }}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </motion.div>
    );
});

BookingsList.displayName = 'BookingsList';
export default BookingsList;

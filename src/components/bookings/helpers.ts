import type { ProjectStatus } from '../../types/project.types';

export const getStatusInfo = (status: ProjectStatus) => {
    switch (status) {
        case 'Scheduled': return { color: '#C09A5A', label: 'Chờ thanh toán', desc: 'Đã lên lịch, vui lòng hoàn tất thanh toán để triển khai.' };
        case 'InProduction': return { color: '#3b82f6', label: 'Đang sản xuất', desc: 'Đội ngũ AURA đang trong quá trình ghi hình và hậu kỳ.' };
        case 'Completed': return { color: '#10b981', label: 'Hoàn thành', desc: 'Dự án đã kết thúc và bàn giao sản phẩm thành công.' };
        case 'Cancelled': return { color: '#ef4444', label: 'Đã hủy', desc: 'Dự án đã được hủy theo yêu cầu hoặc quá hạn.' };
        default: return { color: '#94a3b8', label: status, desc: '' };
    }
};

export const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export const formatMoney = (amount: number) => {
    if (amount === undefined || amount === null) return '—';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

import React from 'react';
import type { Package } from '../../types/package.types';
import { Button } from '../ui/Button';
import { getCinematicSpecs } from './helpers';

interface SpecsMatrixTableProps {
    packages: Package[];
    activeIdx: number;
    handleCheckout: (pkg: Package) => void;
    formatPrice: (price: number) => string;
}

export const SpecsMatrixTable: React.FC<SpecsMatrixTableProps> = React.memo(({ packages, activeIdx, handleCheckout, formatPrice }) => {
    return (
        <div className="container" style={{
            marginTop: '7rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '6rem',
            maxWidth: '1100px'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <span style={{
                    color: '#C09A5A',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3em',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    display: 'block',
                    marginBottom: '1rem'
                }}>
                    Director's Matrix
                </span>
                <h3 style={{
                    fontSize: '1.8rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    BẢNG SO SÁNH THÔNG SỐ SẢN XUẤT
                </h3>
                <p style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.85rem',
                    maxWidth: '500px',
                    margin: '0.5rem auto 0',
                    lineHeight: 1.6
                }}>
                    Xem chi tiết thông số kỹ thuật, cấu hình thiết bị và đội ngũ chuyên gia đi kèm cho từng hợp đồng sản xuất hình ảnh.
                </p>
            </div>

            <div style={{
                overflowX: 'auto',
                backgroundColor: 'rgba(10,10,10,0.5)',
                border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px', tableLayout: 'fixed' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.08)', backgroundColor: '#000000' }}>
                            <th style={{ padding: '1.8rem 1.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', width: '24%' }}>ĐẶC ĐIỂM SẢN XUẤT</th>
                            {packages.map((pkg, i) => (
                                <th key={pkg.id} style={{
                                    padding: '1.8rem 1.5rem',
                                    color: i === activeIdx ? '#C09A5A' : '#FFFFFF',
                                    fontSize: '0.85rem',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                    textAlign: 'center',
                                    backgroundColor: i === activeIdx ? 'rgba(192, 154, 90, 0.025)' : 'transparent',
                                    borderLeft: i === activeIdx ? '1px solid rgba(192, 154, 90, 0.15)' : 'none',
                                    borderRight: i === activeIdx ? '1px solid rgba(192, 154, 90, 0.15)' : 'none',
                                    position: 'relative',
                                    width: `${76 / packages.length}%`
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                        <span>{pkg.name}</span>
                                        {pkg.isPopular && (
                                            <span style={{ fontSize: '0.85rem', color: '#C09A5A', backgroundColor: 'rgba(192, 154, 90, 0.15)', padding: '2px 8px', letterSpacing: '0.05em', fontWeight: 800 }}>POPULAR</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { label: 'Sử Dụng Template Của AURA', key: 'useTemplates' },
                            { label: 'Thiết Bị Quay Phim', key: 'camera' },
                            { label: 'Chất Lượng Hình Ảnh', key: 'resolution' },
                            { label: 'Hệ Thống Chiếu Sáng', key: 'lighting' },
                            { label: 'Đội Ngũ Thực Hiện', key: 'crew' },
                        ].map((row, rowIdx) => (
                            <tr key={row.key} style={{
                                borderBottom: '1px solid rgba(255,255,255,0.04)',
                                backgroundColor: rowIdx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                                transition: 'all 0.3s ease'
                            }} className="matrix-row-hover">
                                <td style={{ padding: '1.4rem 1.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, letterSpacing: '0.02em' }}>{row.label}</td>
                                {packages.map((pkg, i) => {
                                    const specs = getCinematicSpecs(pkg.name, pkg.price);
                                    const val = specs[row.key as keyof typeof specs];
                                    return (
                                        <td key={pkg.id} style={{
                                            padding: '1.4rem 1.5rem',
                                            fontSize: '0.8rem',
                                            color: i === activeIdx ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                                            textAlign: 'center',
                                            fontWeight: i === activeIdx ? 700 : 400,
                                            backgroundColor: i === activeIdx ? 'rgba(192, 154, 90, 0.025)' : 'transparent',
                                            borderLeft: i === activeIdx ? '1px solid rgba(192, 154, 90, 0.08)' : 'none',
                                            borderRight: i === activeIdx ? '1px solid rgba(192, 154, 90, 0.08)' : 'none',
                                        }}>
                                            {val}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        {/* Final Row: Contract Price & Checkout */}
                        <tr style={{ borderTop: '2px solid rgba(255,255,255,0.08)', backgroundColor: '#000000' }}>
                            <td style={{ padding: '2rem 1.5rem', fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>CHI PHÍ HỢP ĐỒNG</td>
                            {packages.map((pkg, i) => (
                                <td key={pkg.id} style={{
                                    padding: '2rem 1.5rem',
                                    textAlign: 'center',
                                    backgroundColor: i === activeIdx ? 'rgba(192, 154, 90, 0.04)' : 'transparent',
                                    borderLeft: i === activeIdx ? '1px solid rgba(192, 154, 90, 0.15)' : 'none',
                                    borderRight: i === activeIdx ? '1px solid rgba(192, 154, 90, 0.15)' : 'none',
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: i === activeIdx ? '#C09A5A' : '#FFFFFF', fontFamily: 'monospace' }}>
                                            {formatPrice(pkg.price)}
                                        </span>
                                        <Button
                                            onClick={() => handleCheckout(pkg)}
                                            size="sm"
                                            style={{
                                                fontSize: '0.65rem',
                                                padding: '0.6rem 1.2rem',
                                                borderRadius: 0,
                                                backgroundColor: i === activeIdx ? '#C09A5A' : 'transparent',
                                                color: i === activeIdx ? '#000000' : '#FFFFFF',
                                                border: i === activeIdx ? 'none' : '1px solid rgba(255,255,255,0.15)',
                                                fontWeight: 900,
                                                letterSpacing: '0.12em',
                                                textTransform: 'uppercase',
                                                width: '100%',
                                                maxWidth: '120px',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            ĐĂNG KÝ
                                        </Button>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
});
SpecsMatrixTable.displayName = 'SpecsMatrixTable';

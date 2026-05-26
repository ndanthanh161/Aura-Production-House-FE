import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    CheckCircle2,
    Loader2,
    AlertCircle,
    Star,
    Crown,
    Zap,
    Camera,
    Users,
    Download,
    Award,
    Film,
    Sparkles,
    PlayCircle,
    Eye
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { packageApi } from '../../services/packageApi';
import type { Package } from '../../types/package.types';

const tierIcons = [Zap, Star, Crown];

// ─── PURE HELPER FUNCTIONS (EXTRACTED ABOVE COMPONENT) ───
const getCinematicSpecs = (pkgName: string, price: number) => {
    const nameLower = pkgName.toLowerCase();

    // Tier 5 - Cao nhất (>= 20M)
    if (nameLower.includes('vip') || nameLower.includes('luxury') || nameLower.includes('cao cấp') || nameLower.includes('gold') || price >= 20_000_000) {
        return {
            camera: 'Sony A7C + DJI RS3 Gimbal + Flycam',
            lenses: 'Sigma Art 35mm, 50mm, 85mm',
            resolution: '4K 10-bit + Color Grading chuyên sâu',
            crew: '4-5 thành viên (Quay phim, Đạo diễn, Editor, Designer)',
            revisions: 'Không giới hạn chỉnh sửa',
            rawFootage: 'Toàn bộ file gốc + file đã hậu kỳ',
            deliveryTime: '10 - 15 ngày làm việc',
            lighting: 'Hệ thống đèn studio Amaran 200d/100d + softbox lớn'
        };
    }
    // Tier 4 (>= 10M)
    if (price >= 10_000_000) {
        return {
            camera: 'Sony A7C + DJI Gimbal ổn định',
            lenses: 'Sony 50mm f/1.8 + 18-105mm f/4',
            resolution: '4K 10-bit + Color Grading cơ bản',
            crew: '3-4 thành viên (Quay phim, Editor, Trợ lý, Designer)',
            revisions: '5 lần chỉnh sửa',
            rawFootage: 'File đã hậu kỳ + file gốc',
            deliveryTime: '7 - 12 ngày làm việc',
            lighting: '2 đèn Amaran 100d + dù tản sáng / softbox'
        };
    }
    // Tier 3 (>= 8M)
    if (price >= 8_000_000) {
        return {
            camera: 'Sony A6400 + Gimbal cơ bản',
            lenses: 'Sony 18-105mm f/4',
            resolution: '4K 8-bit + Chỉnh màu cơ bản',
            crew: '3 thành viên (Quay phim, Editor, Trợ lý)',
            revisions: '3 lần chỉnh sửa',
            rawFootage: 'File đã hậu kỳ + file gốc',
            deliveryTime: '7 - 10 ngày làm việc',
            lighting: '1 đèn Amaran 100d + tấm hắt sáng'
        };
    }
    // Tier 2 (>= 5M)
    if (price >= 5_000_000) {
        return {
            camera: 'Sony A6400',
            lenses: 'Kit lens 28-60mm',
            resolution: '4K 8-bit cơ bản',
            crew: '2 thành viên (Quay phim + Editor)',
            revisions: '2 lần chỉnh sửa',
            rawFootage: 'File đã chỉnh sửa (không kèm file gốc)',
            deliveryTime: '5 - 7 ngày làm việc',
            lighting: 'Đèn led cầm tay mini bổ trợ'
        };
    }
    // Tier 1 - Cơ bản nhất
    return {
        camera: 'Sony A6400',
        lenses: 'Kit lens cơ bản',
        resolution: '1080p - 4K cơ bản',
        crew: '1-2 thành viên (Quay phim + Editor)',
        revisions: '1 lần chỉnh sửa',
        rawFootage: 'File đã chỉnh sửa (không kèm file gốc)',
        deliveryTime: '3 - 5 ngày làm việc',
        lighting: 'Ánh sáng tự nhiên / Đèn led nhỏ'
    };
};

const getCinematicPreviewImage = (index: number) => {
    const images = [
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000', // Basic - camera setup
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1000', // Pro - filming set
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1000'  // VIP - anamorphic lighting set
    ];
    return images[index % images.length];
};

const getFocalLength = (index: number) => {
    const focals = ['24mm', '50mm', '85mm Anamorphic'];
    return focals[index % focals.length];
};

const getTelemetryData = (index: number) => {
    const telemetry = [
        { focal: '24mm', aperture: 'f/4.0', shutter: '1/100s', color: 'REC.709', iso: '400', exposure: '0.0EV' },
        { focal: '50mm', aperture: 'f/1.8', shutter: '1/48s', color: 'SLOG3-CINE', iso: '800', exposure: '-0.3EV' },
        { focal: '85mm Anamorphic', aperture: 'T1.5', shutter: '180°', color: 'REDCODE RAW', iso: '800', exposure: '0.0EV' }
    ];
    return telemetry[index % telemetry.length];
};

const getAmbientGlowColor = (index: number) => {
    const glows = [
        `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(100, 149, 237, 0.08) 0%, transparent 60%)`, // Basic: blue tint
        `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(192, 154, 90, 0.12) 0%, transparent 60%)`, // Popular: gold glow
        `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(229, 62, 62, 0.1) 0%, transparent 60%)`    // VIP: warm ruby red
    ];
    return glows[index % glows.length];
};

const getStoryboardData = (pkgName: string) => {
    const nameLower = pkgName.toLowerCase();
    if (nameLower.includes('vip') || nameLower.includes('luxury') || nameLower.includes('cao cấp') || nameLower.includes('gold')) {
        return {
            title: 'GÓI TOÀN DIỆN — SẢN XUẤT CHUYÊN SÂU',
            desc: 'Dành cho khách hàng cần sản phẩm chất lượng cao, trau chuốt từng chi tiết với đội ngũ đầy đủ nhất của AURA.',
            suitability: ['Video thương hiệu doanh nghiệp', 'Phim giới thiệu sản phẩm / dịch vụ', 'Video sự kiện lớn (hội thảo, khai trương)', 'MV / video ca nhạc'],
            scenes: [
                { label: 'Bước 01 / Lên ý tưởng', detail: 'Họp với khách hàng, xây dựng kịch bản chi tiết, lên danh sách cảnh quay và storyboard.' },
                { label: 'Bước 02 / Quay phim', detail: 'Quay tại địa điểm thực tế với đầy đủ thiết bị: gimbal, flycam, ánh sáng, thu âm chuyên dụng.' },
                { label: 'Bước 03 / Hậu kỳ', detail: 'Dựng phim, color grading chuyên sâu, chỉnh âm thanh, thêm hiệu ứng và xuất file chất lượng cao.' }
            ]
        };
    } else if (nameLower.includes('pro') || nameLower.includes('premium') || nameLower.includes('chuyên nghiệp') || nameLower.includes('silver')) {
        return {
            title: 'GÓI NÂNG CAO — CHẤT LƯỢNG CHUYÊN NGHIỆP',
            desc: 'Phù hợp cho các cửa hàng, startup nhỏ hoặc cá nhân muốn nâng tầm hình ảnh thương hiệu.',
            suitability: ['Video giới thiệu cửa hàng / quán café', 'Video review sản phẩm chuyên nghiệp', 'Clip viral cho mạng xã hội', 'Phóng sự ngắn / phỏng vấn'],
            scenes: [
                { label: 'Bước 01 / Lên ý tưởng', detail: 'Trao đổi concept, khảo sát địa điểm, chuẩn bị nội dung quay.' },
                { label: 'Bước 02 / Quay phim', detail: 'Quay 4K với gimbal ổn định, thu âm micro rời, chụp ảnh bổ sung.' },
                { label: 'Bước 03 / Hậu kỳ', detail: 'Dựng phim chuyên nghiệp, chỉnh màu cơ bản, lồng nhạc bản quyền và xuất file.' }
            ]
        };
    } else {
        return {
            title: 'GÓI CƠ BẢN — KHỞI ĐẦU ĐƠN GIẢN',
            desc: 'Giải pháp tiết kiệm cho cá nhân, sinh viên hoặc dự án nhỏ cần video gọn gàng, hiệu quả.',
            suitability: ['Video thương hiệu cá nhân', 'Content ngắn cho TikTok / Reels / Shorts', 'Clip giới thiệu bản thân / portfolio', 'Phỏng vấn & chia sẻ kinh nghiệm'],
            scenes: [
                { label: 'Bước 01 / Chuẩn bị', detail: 'Định hình nội dung, chuẩn bị phục trang và bối cảnh đơn giản.' },
                { label: 'Bước 02 / Quay phim', detail: 'Quay cơ động với máy ảnh hoặc điện thoại chuyên quay, ánh sáng tự nhiên.' },
                { label: 'Bước 03 / Hậu kỳ', detail: 'Cắt ghép, chỉnh sáng, thêm nhạc nền miễn phí và xuất file chuẩn mạng xã hội.' }
            ]
        };
    }
};

// ─── MEMOIZED SUB-COMPONENTS (PREVENTS WASTED RENDERING CYCLES) ───

interface LensControlDialProps {
    packages: Package[];
    activeIdx: number;
    setActiveIdx: (idx: number) => void;
}

const LensControlDial: React.FC<LensControlDialProps> = React.memo(({ packages, activeIdx, setActiveIdx }) => {
    return (
        <div style={{
            margin: '0 auto 4rem',
            width: '100%',
            maxWidth: '900px',
            backgroundColor: 'rgba(10,10,10,0.85)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            padding: '1.5rem 0',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
            overflow: 'hidden'
        }}>
            {/* Perforations border to look like cinema reels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', opacity: 0.15, marginBottom: '1rem', pointerEvents: 'none', padding: '0 2rem' }}>
                {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} style={{ width: '8px', height: '5px', backgroundColor: '#FFFFFF', borderRadius: '1px' }} />
                ))}
            </div>

            <span style={{
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                fontWeight: 800,
                marginBottom: '0.5rem',
                padding: '0 2rem'
            }}>
                LENS FOCUS BARREL DIAL (CLICK OR DRAG SELECT)
            </span>

            {/* The Sliding Track Viewport */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: '140px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center'
            }}>
                {/* Cylinder barrel fade effect overlays */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: '180px',
                    background: 'linear-gradient(to right, rgba(10,10,10,0.95), transparent)',
                    zIndex: 3,
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    width: '180px',
                    background: 'linear-gradient(to left, rgba(10,10,10,0.95), transparent)',
                    zIndex: 3,
                    pointerEvents: 'none'
                }} />

                {/* Static horizontal guide scale line across the sliding track viewport */}
                <div style={{ position: 'absolute', bottom: '23px', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', zIndex: 1, pointerEvents: 'none' }} />

                {/* The Fixed Center Indicator Needle pointing upwards */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '6px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pointerEvents: 'none'
                    }}
                >
                    {/* Gold vertical needle line */}
                    <div
                        style={{
                            width: '2px',
                            height: '24px',
                            backgroundColor: '#C09A5A',
                            boxShadow: '0 0 8px #C09A5A',
                            marginBottom: '1px'
                        }}
                    />
                    {/* Small gold upward arrow */}
                    <div
                        style={{
                            width: 0,
                            height: 0,
                            borderLeft: '4px solid transparent',
                            borderRight: '4px solid transparent',
                            borderBottom: '6px solid #C09A5A',
                            filter: 'drop-shadow(0 0 3px #C09A5A)'
                        }}
                    />
                </div>

                {/* The Sliding Track containing the packages */}
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        display: 'flex',
                        transform: `translateX(-${(activeIdx * 240) + 120}px)`,
                        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                        width: 'fit-content',
                        height: '100%',
                        alignItems: 'center'
                    }}
                >
                    {packages.map((pkg, idx) => {
                        const isSelected = idx === activeIdx;
                        return (
                            <div
                                key={pkg.id}
                                onClick={() => setActiveIdx(idx)}
                                style={{
                                    width: '240px',
                                    flexShrink: 0,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    height: '100%',
                                    opacity: isSelected ? 1 : 0.3,
                                    transform: isSelected ? 'scale(1.06)' : 'scale(0.9)',
                                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                            >
                                {/* Viewfinder focus locked frame surrounding selected item */}
                                {isSelected && (
                                    <div style={{ position: 'absolute', inset: '10px 15px', pointerEvents: 'none' }}>
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '6px', borderTop: '2px solid #C09A5A', borderLeft: '2px solid #C09A5A' }} />
                                        <div style={{ position: 'absolute', top: 0, right: 0, width: '6px', height: '6px', borderTop: '2px solid #C09A5A', borderRight: '2px solid #C09A5A' }} />
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '6px', height: '6px', borderBottom: '2px solid #C09A5A', borderLeft: '2px solid #C09A5A' }} />
                                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '6px', height: '6px', borderBottom: '2px solid #C09A5A', borderRight: '2px solid #C09A5A' }} />
                                    </div>
                                )}

                                <span style={{
                                    fontSize: '0.6rem',
                                    fontFamily: 'monospace',
                                    color: isSelected ? '#C09A5A' : 'rgba(255,255,255,0.3)',
                                    letterSpacing: '0.15em',
                                    marginBottom: '0.2rem',
                                    fontWeight: 700
                                }}>
                                    {getFocalLength(idx).toUpperCase()}
                                </span>

                                <span style={{
                                    fontSize: '1rem',
                                    fontFamily: 'var(--font-display)',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                                    transition: 'color 0.4s ease',
                                    textAlign: 'center'
                                }}>
                                    {pkg.name}
                                </span>

                                {pkg.isPopular && (
                                    <span style={{
                                        marginTop: '0.3rem',
                                        fontSize: '0.5rem',
                                        color: '#C09A5A',
                                        letterSpacing: '0.08em',
                                        border: '1px solid rgba(192, 154, 90, 0.3)',
                                        backgroundColor: 'rgba(192, 154, 90, 0.08)',
                                        padding: '1px 5px',
                                        fontWeight: 800
                                    }}>
                                        POPULAR
                                    </span>
                                )}

                                {/* The Scale Ticks inside item */}
                                <div style={{ display: 'flex', gap: '6px', marginTop: '0.8rem', alignItems: 'flex-end', height: '12px' }}>
                                    <div style={{ width: '1px', height: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                                    <div style={{ width: '1px', height: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                                    <div style={{ width: '1px', height: '12px', backgroundColor: isSelected ? '#C09A5A' : 'rgba(255,255,255,0.4)', transition: 'background-color 0.4s' }} />
                                    <div style={{ width: '1px', height: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                                    <div style={{ width: '1px', height: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom cinematic filmstrip border */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', opacity: 0.15, marginTop: '1rem', pointerEvents: 'none', padding: '0 2rem' }}>
                {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} style={{ width: '8px', height: '5px', backgroundColor: '#FFFFFF', borderRadius: '1px' }} />
                ))}
            </div>
        </div>
    );
});
LensControlDial.displayName = 'LensControlDial';

interface SpecsMatrixTableProps {
    packages: Package[];
    activeIdx: number;
    handleCheckout: (pkg: Package) => void;
    formatPrice: (price: number) => string;
}

const SpecsMatrixTable: React.FC<SpecsMatrixTableProps> = React.memo(({ packages, activeIdx, handleCheckout, formatPrice }) => {
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
                    fontSize: '0.7rem',
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
                                            <span style={{ fontSize: '0.55rem', color: '#C09A5A', backgroundColor: 'rgba(192, 154, 90, 0.15)', padding: '2px 8px', letterSpacing: '0.05em', fontWeight: 800 }}>POPULAR</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { label: 'Thiết Bị Quay Phim', key: 'camera' },
                            { label: 'Chất Lượng Hình Ảnh', key: 'resolution' },
                            { label: 'Hệ Thống Chiếu Sáng', key: 'lighting' },
                            { label: 'Đội Ngũ Thực Hiện', key: 'crew' },
                            { label: 'Bàn Giao Sản Phẩm', key: 'rawFootage' },
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

const TrustSection: React.FC = React.memo(() => {
    return (
        <section style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '6rem 0',
            textAlign: 'center',
            backgroundColor: '#030303',
            position: 'relative',
            zIndex: 2
        }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 'clamp(2rem, 6vw, 6rem)',
                    flexWrap: 'wrap'
                }}>
                    {[
                        { value: '150+', label: 'DỰ ÁN CINE HOÀN THÀNH' },
                        { value: '99%', label: 'KHÁCH HÀNG THƯƠNG HIỆU HÀI LÒNG' },
                        { value: '4K+', label: 'TIÊU CHUẨN ĐỘ PHÂN GIẢI GỐC' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                            style={{ textAlign: 'center' }}
                        >
                            <div style={{
                                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                                fontFamily: 'var(--font-display)',
                                fontWeight: 900,
                                color: '#C09A5A',
                                lineHeight: 1,
                                letterSpacing: '0.02em'
                            }}>
                                {stat.value}
                            </div>
                            <div style={{
                                fontSize: '0.65rem',
                                color: 'rgba(255,255,255,0.4)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.2em',
                                fontWeight: 800,
                                marginTop: '0.8rem'
                            }}>
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
});
TrustSection.displayName = 'TrustSection';

// ─── MAIN PACKAGES PAGE COMPONENT ───

const Packages: React.FC = () => {
    const navigate = useNavigate();
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeIdx, setActiveIdx] = useState(0);

    // Ultimate Interactive states
    const [isFocusLocking, setIsFocusLocking] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    
    // DOM Viewport refs for high-performance direct GPU spotlight updates
    const viewportRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        packageApi.getAll(true)
            .then(res => {
                const pkgs = res.data || [];
                setPackages(pkgs);
                const popIdx = pkgs.findIndex(p => p.isPopular);
                if (popIdx !== -1) {
                    setActiveIdx(popIdx);
                }
            })
            .catch(() => setError('Không thể tải danh sách gói dịch vụ.'))
            .finally(() => setLoading(false));
    }, []);

    // Autofocus lock animation on index change
    useEffect(() => {
        if (packages.length > 0) {
            setIsFocusLocking(true);
            const timer = setTimeout(() => {
                setIsFocusLocking(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [activeIdx, packages]);

    const formatPrice = useCallback((price: number) => {
        return price.toLocaleString('vi-VN');
    }, []);

    const activePkg = packages[activeIdx] || packages[0];
    const activeSpecs = activePkg ? getCinematicSpecs(activePkg.name, activePkg.price) : null;
    const activeTelemetry = activePkg ? getTelemetryData(activeIdx) : null;
    const activeStoryboard = activePkg ? getStoryboardData(activePkg.name) : null;
    const ActiveTierIcon = activePkg ? tierIcons[activeIdx % tierIcons.length] : Zap;

    // ─── Direct DOM Mutation for High Performance 120 FPS Spotlight ───
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!viewportRef.current || !glowRef.current) return;
        const rect = viewportRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        // Mutate CSS variables directly to avoid triggering React re-renders!
        viewportRef.current.style.setProperty('--mouse-x', `${x}%`);
        viewportRef.current.style.setProperty('--mouse-y', `${y}%`);
        glowRef.current.style.setProperty('--mouse-x', `${x}%`);
        glowRef.current.style.setProperty('--mouse-y', `${y}%`);
    };

    const handleMouseLeave = () => {
        if (!viewportRef.current || !glowRef.current) return;
        viewportRef.current.style.setProperty('--mouse-x', '50%');
        viewportRef.current.style.setProperty('--mouse-y', '50%');
        glowRef.current.style.setProperty('--mouse-x', '50%');
        glowRef.current.style.setProperty('--mouse-y', '50%');
    };

    const handleCheckout = useCallback((pkg: Package) => {
        navigate(`/purchase/${pkg.id}`);
    }, [navigate]);

    return (
        <div style={{ paddingTop: '80px', backgroundColor: '#050505', minHeight: '100vh', color: '#FFFFFF', position: 'relative', overflowX: 'hidden' }}>

            {/* Film Grain atmospheric overlay */}
            <div style={{
                position: 'fixed',
                inset: 0,
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.012\'/%3E%3C/svg%3E")',
                pointerEvents: 'none',
                zIndex: 99
            }} />

            {/* Neon Bleed / Ambient Glow behind theater viewport */}
            <div 
                ref={glowRef}
                style={{
                    position: 'absolute',
                    top: '38%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '1200px',
                    height: '900px',
                    background: getAmbientGlowColor(activeIdx),
                    transition: 'background 0.5s ease',
                    pointerEvents: 'none',
                    zIndex: 0
                }} 
            />

            {/* Hero Header */}
            <section style={{
                position: 'relative',
                padding: 'clamp(4rem, 8vw, 6rem) 0 1rem',
                textAlign: 'center',
                overflow: 'hidden',
                zIndex: 1
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span style={{
                            color: '#C09A5A',
                            textTransform: 'uppercase',
                            letterSpacing: '0.4em',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'block',
                            marginBottom: '1.5rem'
                        }}>
                            THE CINE-THEATRE EXPERIENCE
                        </span>
                        <h1 style={{
                            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            color: '#FFFFFF',
                            margin: '0 0 1.5rem',
                            lineHeight: 1.1,
                            letterSpacing: '0.02em'
                        }}>
                            BẢNG GIÁ DỊCH VỤ SẢN XUẤT AURA
                        </h1>
                        <p style={{
                            color: 'rgba(255,255,255,0.45)',
                            fontSize: '0.95rem',
                            maxWidth: '650px',
                            margin: '0 auto',
                            lineHeight: 1.7
                        }}>
                            Hệ thống màn chiếu điện ảnh tương tác thông minh. Hãy xoay vòng ống kính tiêu cự phía dưới để khám phá cấu hình phần cứng và kịch bản thiết kế.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Interactive Stage Section */}
            <section style={{ padding: '1rem 0 6rem', position: 'relative', zIndex: 2 }}>
                <div className="container">

                    {loading && (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '8rem 0' }}>
                            <Loader2 size={36} style={{ animation: 'spin 1.5s linear infinite', color: '#C09A5A' }} />
                        </div>
                    )}

                    {error && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', padding: '5rem 0', color: '#ef4444' }}>
                            <AlertCircle size={20} /> {error}
                        </div>
                    )}

                    {!loading && !error && packages.length > 0 && (
                        <>
                            {/* --- THE LENS CONTROL CENTER / FOCUS SCALE CONTROLLER --- */}
                            <LensControlDial
                                packages={packages}
                                activeIdx={activeIdx}
                                setActiveIdx={setActiveIdx}
                            />

                            {/* --- CLAPPERBOARD 3D FLIP SWITCH TRIGGER --- */}
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem', zIndex: 10, position: 'relative' }}>
                                <button
                                    onClick={() => setIsFlipped(!isFlipped)}
                                    style={{
                                        background: 'none',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        backgroundColor: '#121212',
                                        border: '1px solid rgba(192, 154, 90, 0.3)',
                                        padding: '0.8rem 1.6rem',
                                        color: '#C09A5A',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                    }}
                                    className="clapper-btn"
                                >
                                    <Film size={14} style={{ transform: isFlipped ? 'rotate(15deg)' : 'rotate(0deg)', transition: 'transform 0.4s ease' }} />
                                    {isFlipped ? 'XEM CẤU HÌNH THIẾT BỊ (TECH SPECS)' : 'XEM KỊCH BẢN CẢM HỨNG (STORYBOARD)'}
                                </button>
                            </div>

                            {/* --- 21:9 WIDESCREEN PROJECTOR VIEWPORT SCREEN --- */}
                            <div
                                style={{
                                    perspective: '1200px',
                                    maxWidth: '1100px',
                                    margin: '0 auto',
                                    minHeight: '620px',
                                    position: 'relative'
                                }}
                            >
                                <div
                                    style={{
                                        position: 'relative',
                                        width: '100%',
                                        minHeight: '620px',
                                        transformStyle: 'preserve-3d', // Necessary for children 3D layering
                                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                        transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                                    }}
                                >

                                    {/* ==============================================
                                        SIDE A: TECHNICAL SPECIFICATIONS (CONFIG)
                                        ============================================== */}
                                    <div
                                        ref={viewportRef}
                                        onMouseMove={handleMouseMove}
                                        onMouseLeave={handleMouseLeave}
                                        className="cine-stage-viewport"
                                        style={{
                                            position: 'relative',
                                            width: '100%',
                                            height: '100%',
                                            minHeight: '620px',
                                            backgroundColor: '#0A0A0A',
                                            border: '1px solid rgba(255,255,255,0.06)',
                                            backfaceVisibility: 'hidden', // Hides when rotated
                                            zIndex: isFlipped ? 1 : 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {/* Subtly Integrated Atmospheric Cinematic Frame Background */}
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            backgroundImage: `url(${getCinematicPreviewImage(activeIdx)})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            opacity: 0.08,
                                            mixBlendMode: 'luminosity',
                                            filter: 'blur(1px) contrast(1.1) brightness(0.8)',
                                            pointerEvents: 'none',
                                            zIndex: 0,
                                            transition: 'all 0.8s ease'
                                        }} />

                                        {/* Focus viewfinder corner overlays */}
                                        <div style={{ position: 'absolute', inset: '1.5rem', pointerEvents: 'none', zIndex: 3 }}>
                                            <div style={{
                                                position: 'absolute', top: 0, left: 0, width: '24px', height: '24px',
                                                borderTop: `2px solid ${isFocusLocking ? '#22c55e' : 'rgba(192, 154, 90, 0.45)'}`,
                                                borderLeft: `2px solid ${isFocusLocking ? '#22c55e' : 'rgba(192, 154, 90, 0.45)'}`,
                                                transform: isFocusLocking ? 'scale(0.85) translate(8px, 8px)' : 'scale(1) translate(0px, 0px)',
                                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                            }} />
                                            <div style={{
                                                position: 'absolute', top: 0, right: 0, width: '24px', height: '24px',
                                                borderTop: `2px solid ${isFocusLocking ? '#22c55e' : 'rgba(192, 154, 90, 0.45)'}`,
                                                borderRight: `2px solid ${isFocusLocking ? '#22c55e' : 'rgba(192, 154, 90, 0.45)'}`,
                                                transform: isFocusLocking ? 'scale(0.85) translate(-8px, 8px)' : 'scale(1) translate(0px, 0px)',
                                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                            }} />
                                            <div style={{
                                                position: 'absolute', bottom: 0, left: 0, width: '24px', height: '24px',
                                                borderBottom: `2px solid ${isFocusLocking ? '#22c55e' : 'rgba(192, 154, 90, 0.45)'}`,
                                                borderLeft: `2px solid ${isFocusLocking ? '#22c55e' : 'rgba(192, 154, 90, 0.45)'}`,
                                                transform: isFocusLocking ? 'scale(0.85) translate(8px, -8px)' : 'scale(1) translate(0px, 0px)',
                                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                            }} />
                                            <div style={{
                                                position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px',
                                                borderBottom: `2px solid ${isFocusLocking ? '#22c55e' : 'rgba(192, 154, 90, 0.45)'}`,
                                                borderRight: `2px solid ${isFocusLocking ? '#22c55e' : 'rgba(192, 154, 90, 0.45)'}`,
                                                transform: isFocusLocking ? 'scale(0.85) translate(-8px, -8px)' : 'scale(1) translate(0px, 0px)',
                                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                            }} />
                                        </div>

                                        {/* HUD Letterbox Top */}
                                        <div style={{
                                            height: '50px',
                                            backgroundColor: '#000000',
                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '0 2.5rem',
                                            zIndex: 4,
                                            position: 'relative'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span className="rec-blinking-dot" style={{
                                                    width: '8px',
                                                    height: '8px',
                                                    backgroundColor: isFocusLocking ? '#22c55e' : '#ef4444',
                                                    borderRadius: '50%',
                                                    boxShadow: isFocusLocking ? '0 0 8px #22c55e' : 'none',
                                                    transition: 'all 0.3s ease'
                                                }} />
                                                <span style={{
                                                    fontSize: '0.65rem',
                                                    color: isFocusLocking ? '#22c55e' : '#ef4444',
                                                    fontWeight: 900,
                                                    letterSpacing: '0.2em',
                                                    transition: 'all 0.3s ease'
                                                }}>
                                                    {isFocusLocking ? 'LOCKING' : 'REC'}
                                                </span>
                                                <span style={{ fontSize: '0.7rem', color: '#CCCCCC', fontFamily: 'monospace', marginLeft: '12px', letterSpacing: '0.05em' }}>
                                                    TC 00:0{activeIdx + 1}:18:24
                                                </span>
                                            </div>
                                            <span style={{
                                                fontSize: '0.6rem',
                                                color: isFocusLocking ? '#22c55e' : 'rgba(255,255,255,0.3)',
                                                letterSpacing: '0.25em',
                                                fontWeight: 800,
                                                transition: 'all 0.3s ease'
                                            }} className="viewport-hud-title">
                                                {isFocusLocking ? '[ FOCUS LOCKING... ]' : '[ FOCUS LOCK ON ]'}
                                            </span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Film size={12} style={{ color: '#C09A5A' }} />
                                                <span style={{ fontSize: '0.65rem', color: '#C09A5A', fontWeight: 800, fontFamily: 'monospace' }}>
                                                    {activeSpecs?.resolution.split(' ')[0]} RAW
                                                </span>
                                            </div>
                                        </div>

                                        {/* Viewport Core Content Grid */}
                                        <div className="cine-stage-grid" style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1.25fr 1fr',
                                            position: 'relative',
                                            zIndex: 2,
                                            flex: 1
                                        }}>
                                            {/* Left Side: Specs & Metadata */}
                                            <div style={{
                                                padding: '3rem 3rem 2rem',
                                                borderRight: '1px solid rgba(255,255,255,0.05)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between'
                                            }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
                                                        <div style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            backgroundColor: 'rgba(192, 154, 90, 0.1)',
                                                            border: '1px solid rgba(192, 154, 90, 0.2)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                            <ActiveTierIcon size={16} style={{ color: '#C09A5A' }} />
                                                        </div>
                                                        <span style={{ fontSize: '0.7rem', color: '#C09A5A', letterSpacing: '0.2em', fontWeight: 800, textTransform: 'uppercase' }}>
                                                            TECHNICAL HARDWARE SPECS
                                                        </span>
                                                    </div>

                                                    <h2 style={{
                                                        fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                                                        fontFamily: 'var(--font-display)',
                                                        fontWeight: 900,
                                                        color: '#FFFFFF',
                                                        textTransform: 'uppercase',
                                                        marginBottom: '1rem',
                                                        letterSpacing: '0.02em',
                                                        lineHeight: 1.15
                                                    }}>
                                                        {activePkg.name}
                                                    </h2>

                                                    <p style={{
                                                        fontSize: '0.9rem',
                                                        color: 'rgba(255,255,255,0.5)',
                                                        lineHeight: 1.6,
                                                        marginBottom: '2rem',
                                                        maxWidth: '500px'
                                                    }}>
                                                        {activePkg.description}
                                                    </p>

                                                    {/* Tech Specs block */}
                                                    {activeSpecs && (
                                                        <div style={{
                                                            display: 'grid',
                                                            gridTemplateColumns: 'repeat(2, 1fr)',
                                                            gap: '1.5rem',
                                                            borderTop: '1px solid rgba(255,255,255,0.06)',
                                                            paddingTop: '2rem',
                                                            marginBottom: '2rem'
                                                        }} className="tech-specs-grid">
                                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                                                <Camera size={16} style={{ color: '#C09A5A', marginTop: '3px', flexShrink: 0 }} />
                                                                <div>
                                                                    <span style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>MÁY QUAY CHÍNH</span>
                                                                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{activeSpecs.camera}</span>
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                                                <Users size={16} style={{ color: '#C09A5A', marginTop: '3px', flexShrink: 0 }} />
                                                                <div>
                                                                    <span style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>ĐỘI NGŨ SẢN XUẤT</span>
                                                                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{activeSpecs.crew}</span>
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                                                <Download size={16} style={{ color: '#C09A5A', marginTop: '3px', flexShrink: 0 }} />
                                                                <div>
                                                                    <span style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>BÀN GIAO FILE</span>
                                                                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{activeSpecs.rawFootage}</span>
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                                                <Film size={16} style={{ color: '#C09A5A', marginTop: '3px', flexShrink: 0 }} />
                                                                <div>
                                                                    <span style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>CHẤT LƯỢNG HÌNH ẢNH</span>
                                                                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{activeSpecs.resolution}</span>
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                                                <Sparkles size={16} style={{ color: '#C09A5A', marginTop: '3px', flexShrink: 0 }} />
                                                                <div>
                                                                    <span style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>THIẾT BỊ CHIẾU SÁNG</span>
                                                                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{activeSpecs.lighting}</span>
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                                                <Award size={16} style={{ color: '#C09A5A', marginTop: '3px', flexShrink: 0 }} />
                                                                <div>
                                                                    <span style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>THỜI GIAN BÀN GIAO</span>
                                                                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{activeSpecs.deliveryTime}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Price tag */}
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    borderTop: '1px solid rgba(255,255,255,0.06)',
                                                    paddingTop: '1.5rem'
                                                }} className="viewport-price-section">
                                                    <span style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.15em', marginBottom: '0.2rem' }}>
                                                        CHI PHÍ HỢP ĐỒNG LIÊN KẾT
                                                    </span>
                                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                                        <span className="price-gradient" style={{
                                                            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                                                            fontWeight: 900,
                                                            fontFamily: 'monospace',
                                                            lineHeight: 1
                                                        }}>
                                                            {formatPrice(activePkg.price)}
                                                        </span>
                                                        <span style={{
                                                            fontSize: '0.7rem',
                                                            color: 'rgba(255,255,255,0.3)',
                                                            fontFamily: 'monospace',
                                                            fontWeight: 600
                                                        }}>
                                                            VND
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Side: Checklist & checkout */}
                                            <div style={{
                                                padding: '3rem 3rem 2rem',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                backgroundColor: 'rgba(12,12,12,0.95)',
                                                backdropFilter: 'blur(5px)',
                                                zIndex: 2
                                            }}>
                                                <div>
                                                    <span style={{
                                                        display: 'block',
                                                        fontSize: '0.65rem',
                                                        color: 'rgba(255,255,255,0.3)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.18em',
                                                        fontWeight: 800,
                                                        marginBottom: '1.8rem',
                                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                        paddingBottom: '0.8rem'
                                                    }}>
                                                        PRODUCTION CHECKLIST
                                                    </span>

                                                    <ul style={{ listStyle: 'none', margin: '0 0 2.5rem', padding: 0 }}>
                                                        {activePkg.benefits.map((benefit, i) => (
                                                            <li key={i} style={{
                                                                display: 'flex',
                                                                alignItems: 'flex-start',
                                                                gap: '12px',
                                                                marginBottom: '1rem',
                                                                color: 'rgba(255,255,255,0.75)',
                                                                fontSize: '0.82rem',
                                                                lineHeight: 1.5
                                                            }}>
                                                                <CheckCircle2
                                                                    size={15}
                                                                    style={{
                                                                        color: '#C09A5A',
                                                                        flexShrink: 0,
                                                                        marginTop: '2px'
                                                                    }}
                                                                />
                                                                <span>{benefit}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div style={{ marginTop: '2rem' }}>
                                                    <Button
                                                        onClick={() => handleCheckout(activePkg)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '1.4rem 2rem',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            borderRadius: 0,
                                                            backgroundColor: '#C09A5A',
                                                            color: '#050505',
                                                            border: 'none',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 900,
                                                            letterSpacing: '0.15em',
                                                            textTransform: 'uppercase',
                                                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                                            boxShadow: '0 10px 30px rgba(192, 154, 90, 0.25)'
                                                        }}
                                                        className="viewport-cta-btn"
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            KHỞI TẠO DỰ ÁN <ArrowRight size={16} className="viewport-cta-arrow" style={{ transition: 'transform 0.3s ease' }} />
                                                        </div>
                                                    </Button>
                                                    <span style={{
                                                        display: 'block',
                                                        textAlign: 'center',
                                                        fontSize: '0.6rem',
                                                        color: 'rgba(255,255,255,0.25)',
                                                        letterSpacing: '0.1em',
                                                        textTransform: 'uppercase',
                                                        marginTop: '1rem',
                                                        fontWeight: 600
                                                    }}>
                                                        * Tiến hành ký kết hợp đồng chuẩn hóa điện ảnh
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* HUD Letterbox Bottom */}
                                        <div style={{
                                            height: '40px',
                                            backgroundColor: '#000000',
                                            borderTop: '1px solid rgba(255,255,255,0.05)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '0 2.5rem',
                                            zIndex: 4,
                                            position: 'relative'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                                                    LENS: {activeSpecs?.lenses.split('&')[0].split('or')[0].trim()}
                                                </span>
                                                <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                                                    FPS: 24.00
                                                </span>
                                            </div>
                                            <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', fontFamily: 'monospace' }}>
                                                ISO: {activeTelemetry?.iso} | SHUTTER: {activeTelemetry?.shutter} | FOCUS: {activeTelemetry?.focal}
                                            </span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <Award size={10} style={{ color: '#C09A5A' }} />
                                                <span style={{ fontSize: '0.55rem', color: '#C09A5A', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                                                    AURA OPTICS
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ==============================================
                                        SIDE B: CREATIVE STORYBOARD (FLIPPED BACK)
                                        ============================================== */}
                                    <div
                                        className="cine-stage-viewport"
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            backgroundColor: '#070707',
                                            border: '1px solid rgba(192,154,90,0.25)',
                                            boxShadow: 'inset 0 0 45px rgba(192,154,90,0.03), 0 30px 60px rgba(0,0,0,0.9)',
                                            backfaceVisibility: 'hidden',
                                            transform: 'rotateY(180deg)', // Pre-rotated back side
                                            zIndex: isFlipped ? 2 : 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {/* Viewfinder focus locked corners on back side too */}
                                        <div style={{ position: 'absolute', inset: '1.5rem', pointerEvents: 'none', zIndex: 3 }}>
                                            <div style={{ position: 'absolute', top: 0, left: 0, width: '24px', height: '24px', borderTop: '2px solid rgba(192, 154, 90, 0.45)', borderLeft: '2px solid rgba(192, 154, 90, 0.45)' }} />
                                            <div style={{ position: 'absolute', top: 0, right: 0, width: '24px', height: '24px', borderTop: '2px solid rgba(192, 154, 90, 0.45)', borderRight: '2px solid rgba(192, 154, 90, 0.45)' }} />
                                            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '24px', height: '24px', borderBottom: '2px solid rgba(192, 154, 90, 0.45)', borderLeft: '2px solid rgba(192, 154, 90, 0.45)' }} />
                                            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px', borderBottom: '2px solid rgba(192, 154, 90, 0.45)', borderRight: '2px solid rgba(192, 154, 90, 0.45)' }} />
                                        </div>

                                        {/* HUD Letterbox Top */}
                                        <div style={{
                                            height: '50px',
                                            backgroundColor: '#000000',
                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '0 2.5rem',
                                            zIndex: 4,
                                            position: 'relative'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%', boxShadow: '0 0 8px #22c55e' }} />
                                                <span style={{ fontSize: '0.65rem', color: '#22c55e', fontWeight: 900, letterSpacing: '0.2em' }}>STORYBOARD</span>
                                                <span style={{ fontSize: '0.7rem', color: '#CCCCCC', fontFamily: 'monospace', marginLeft: '12px', letterSpacing: '0.05em' }}>
                                                    TC 00:0{activeIdx + 1}:45:00
                                                </span>
                                            </div>
                                            <span style={{ fontSize: '0.6rem', color: '#C09A5A', letterSpacing: '0.25em', fontWeight: 800 }}>
                                                CREATIVE STORYBOARD MOOD
                                            </span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Sparkles size={12} style={{ color: '#C09A5A' }} />
                                                <span style={{ fontSize: '0.65rem', color: '#C09A5A', fontWeight: 800, fontFamily: 'monospace' }}>
                                                    CONCEPT ACTIVE
                                                </span>
                                            </div>
                                        </div>

                                        {/* Viewport Core Flipped Grid */}
                                        <div className="cine-stage-grid" style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1.25fr 1fr',
                                            position: 'relative',
                                            zIndex: 2,
                                            flex: 1
                                        }}>
                                            {/* Left Column: Creative Moodboard Narrative */}
                                            <div style={{
                                                padding: '3rem 3rem 2rem',
                                                borderRight: '1px solid rgba(255,255,255,0.05)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between'
                                            }}>
                                                <div>
                                                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#C09A5A', letterSpacing: '0.2em', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.2rem' }}>
                                                        🎬 PHÂN CẢNH KỊCH BẢN / STORYBOARD
                                                    </span>

                                                    <h3 style={{
                                                        fontSize: '1.5rem',
                                                        fontFamily: 'var(--font-display)',
                                                        fontWeight: 900,
                                                        color: '#FFFFFF',
                                                        textTransform: 'uppercase',
                                                        marginBottom: '1rem',
                                                        letterSpacing: '0.02em',
                                                        lineHeight: 1.25
                                                    }}>
                                                        {activeStoryboard?.title}
                                                    </h3>

                                                    <p style={{
                                                        fontSize: '0.88rem',
                                                        color: 'rgba(255,255,255,0.5)',
                                                        lineHeight: 1.6,
                                                        marginBottom: '2rem',
                                                        maxWidth: '500px'
                                                    }}>
                                                        {activeStoryboard?.desc}
                                                    </p>

                                                    {/* Storyboard timeline scenes */}
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
                                                        {activeStoryboard?.scenes.map((scene, sIdx) => (
                                                            <div key={sIdx} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                                                <div style={{
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: 'rgba(192, 154, 90, 0.1)',
                                                                    border: '1px solid rgba(192, 154, 90, 0.3)',
                                                                    color: '#C09A5A',
                                                                    fontSize: '0.65rem',
                                                                    fontFamily: 'monospace',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    flexShrink: 0,
                                                                    marginTop: '2px'
                                                                }}>
                                                                    {sIdx + 1}
                                                                </div>
                                                                <div>
                                                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C09A5A', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{scene.label}</span>
                                                                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>{scene.detail}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column: Suitability and Checkout */}
                                            <div style={{
                                                padding: '3rem 3rem 2rem',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                backgroundColor: 'rgba(10,10,10,0.98)',
                                                zIndex: 2
                                            }}>
                                                <div>
                                                    <span style={{
                                                        display: 'block',
                                                        fontSize: '0.65rem',
                                                        color: 'rgba(255,255,255,0.3)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.18em',
                                                        fontWeight: 800,
                                                        marginBottom: '1.8rem',
                                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                        paddingBottom: '0.8rem'
                                                    }}>
                                                        PHÂN KHÚC PHÙ HỢP
                                                    </span>

                                                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                                        {activeStoryboard?.suitability.map((item, i) => (
                                                            <li key={i} style={{
                                                                display: 'flex',
                                                                alignItems: 'flex-start',
                                                                gap: '12px',
                                                                marginBottom: '1rem',
                                                                color: 'rgba(255,255,255,0.75)',
                                                                fontSize: '0.82rem',
                                                                lineHeight: 1.5
                                                            }}>
                                                                <PlayCircle
                                                                    size={15}
                                                                    style={{
                                                                        color: '#C09A5A',
                                                                        flexShrink: 0,
                                                                        marginTop: '2px'
                                                                    }}
                                                                />
                                                                <span>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div style={{ marginTop: '2rem' }}>
                                                    <Button
                                                        onClick={() => handleCheckout(activePkg)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '1.4rem 2rem',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            borderRadius: 0,
                                                            backgroundColor: 'transparent',
                                                            color: '#FFFFFF',
                                                            border: '1px solid rgba(192, 154, 90, 0.4)',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 900,
                                                            letterSpacing: '0.15em',
                                                            textTransform: 'uppercase',
                                                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                                        }}
                                                        className="viewport-cta-btn-flipped"
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            BẮT ĐẦU KỊCH BẢN <ArrowRight size={16} className="viewport-cta-arrow" style={{ transition: 'transform 0.3s ease' }} />
                                                        </div>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* HUD Letterbox Bottom */}
                                        <div style={{
                                            height: '40px',
                                            backgroundColor: '#000000',
                                            borderTop: '1px solid rgba(255,255,255,0.05)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '0 2.5rem',
                                            zIndex: 4,
                                            position: 'relative'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                                                    LUT SPACE: {activeTelemetry?.color}
                                                </span>
                                                <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                                                    EXPOSURE: {activeTelemetry?.exposure}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', fontFamily: 'monospace' }}>
                                                DIRECTOR EDIT STAGE // SCENARIO MOOD
                                            </span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <Eye size={10} style={{ color: '#C09A5A' }} />
                                                <span style={{ fontSize: '0.55rem', color: '#C09A5A', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                                                    AURA CINE-LENS
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* --- INTERACTIVE COMPARISON SPEC MATRIX --- */}
                            <SpecsMatrixTable
                                packages={packages}
                                activeIdx={activeIdx}
                                handleCheckout={handleCheckout}
                                formatPrice={formatPrice}
                            />
                        </>
                    )}
                </div>
            </section>

            {/* Bottom Trust Section */}
            <TrustSection />

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                
                @keyframes blinking {
                    0% { opacity: 0.2; }
                    50% { opacity: 1; }
                    100% { opacity: 0.2; }
                }

                .rec-blinking-dot {
                    animation: blinking 1.5s infinite;
                }

                .price-gradient {
                    background: linear-gradient(135deg, #FFFFFF 30%, #C09A5A 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .cine-stage-viewport {
                    box-shadow: 0 40px 100px rgba(0,0,0,0.95);
                    transition: border-color 0.5s ease, box-shadow 0.5s ease;
                }

                .clapper-btn:hover {
                    background-color: #C09A5A !important;
                    color: #000000 !important;
                    border-color: #C09A5A !important;
                    box-shadow: 0 0 20px rgba(192, 154, 90, 0.4) !important;
                }

                .viewport-cta-btn:hover {
                    background-color: #FFFFFF !important;
                    color: #000000 !important;
                    box-shadow: 0 15px 40px rgba(255, 255, 255, 0.15) !important;
                }

                .viewport-cta-btn:hover .viewport-cta-arrow {
                    transform: translateX(6px);
                }

                .viewport-cta-btn-flipped:hover {
                    background-color: #C09A5A !important;
                    color: #000000 !important;
                    border-color: #C09A5A !important;
                    box-shadow: 0 10px 30px rgba(192, 154, 90, 0.3) !important;
                }

                .viewport-cta-btn-flipped:hover .viewport-cta-arrow {
                    transform: translateX(6px);
                }

                .matrix-row-hover:hover {
                    background-color: rgba(192, 154, 90, 0.02) !important;
                }

                .matrix-row-hover:hover td {
                    color: #FFFFFF !important;
                }

                /* Mobile/Responsive styling */
                @media (max-width: 900px) {
                    .cine-stage-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .cine-stage-viewport {
                        border-radius: 0;
                    }
                    .tech-specs-grid {
                        grid-template-columns: 1fr !important;
                        gap: 1.2rem !important;
                    }
                    .viewport-hud-title {
                        display: none !important;
                    }
                    .viewport-price-section {
                        margin-top: 1.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Packages;

export const getCinematicSpecs = (pkgName: string, price: number) => {
    const nameLower = pkgName.toLowerCase();

    if (nameLower.includes('membership') || nameLower.includes('hội viên')) {
        return {
            useTemplates: 'Có',
            camera: '—',
            lenses: '—',
            resolution: '—',
            crew: '—',
            revisions: '—',
            rawFootage: '—',
            deliveryTime: '—',
            lighting: '—'
        };
    }

    // Tier 5 - Cao nhất (>= 20M)
    if (nameLower.includes('vip') || nameLower.includes('luxury') || nameLower.includes('cao cấp') || nameLower.includes('gold') || price >= 20_000_000) {
        return {
            useTemplates: 'Có',
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
            useTemplates: 'Có',
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
            useTemplates: 'Có',
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
            useTemplates: 'Có',
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
        useTemplates: 'Có',
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

export const getCinematicPreviewImage = (index: number) => {
    const images = [
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000', // Basic - camera setup
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1000', // Pro - filming set
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1000'  // VIP - anamorphic lighting set
    ];
    return images[index % images.length];
};

export const getFocalLength = (index: number) => {
    const focals = ['24mm', '50mm', '85mm Anamorphic'];
    return focals[index % focals.length];
};

export const getTelemetryData = (index: number) => {
    const telemetry = [
        { focal: '24mm', aperture: 'f/4.0', shutter: '1/100s', color: 'REC.709', iso: '400', exposure: '0.0EV' },
        { focal: '50mm', aperture: 'f/1.8', shutter: '1/48s', color: 'SLOG3-CINE', iso: '800', exposure: '-0.3EV' },
        { focal: '85mm Anamorphic', aperture: 'T1.5', shutter: '180°', color: 'REDCODE RAW', iso: '800', exposure: '0.0EV' }
    ];
    return telemetry[index % telemetry.length];
};

export const getAmbientGlowColor = (index: number) => {
    const glows = [
        `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(100, 149, 237, 0.08) 0%, transparent 60%)`, // Basic: blue tint
        `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(192, 154, 90, 0.12) 0%, transparent 60%)`, // Popular: gold glow
        `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(229, 62, 62, 0.1) 0%, transparent 60%)`    // VIP: warm ruby red
    ];
    return glows[index % glows.length];
};

export const getStoryboardData = (pkgName: string) => {
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

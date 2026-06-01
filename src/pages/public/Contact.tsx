import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Compass, Activity, ShieldCheck, ArrowRight } from 'lucide-react';
import { contactApi } from '../../services/contactApi';

const Contact: React.FC = () => {
    const [localTime, setLocalTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setLocalTime(now.toLocaleTimeString('en-US', { hour12: false }));
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{ paddingTop: '80px', backgroundColor: '#050505', minHeight: '100vh', color: '#FFFFFF', position: 'relative', overflowX: 'hidden' }}>

            {/* Cinematic background film grain overlay */}
            <div style={{
                position: 'fixed',
                inset: 0,
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.015\'/%3E%3C/svg%3E")',
                pointerEvents: 'none',
                zIndex: 99
            }} />

            {/* Glowing gold ambient neon bleed */}
            <div style={{
                position: 'absolute',
                top: '25%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '1000px',
                height: '800px',
                background: 'radial-gradient(circle, rgba(192, 154, 90, 0.05) 0%, transparent 70%)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            {/* Header Section */}
            <header style={{ padding: 'clamp(3rem, 6vw, 5rem) 0 2rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    <span style={{ color: '#C09A5A', textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '0.75rem', fontWeight: 800, display: 'block', marginBottom: '1.2rem' }}>
                        THE CINE-COMMISSION SYSTEM
                    </span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{
                            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            color: '#FFFFFF',
                            margin: 0,
                            lineHeight: 1.1,
                            letterSpacing: '0.01em'
                        }}
                    >
                        KẾT NỐI VỚI AURA STUDIO
                    </motion.h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.45)',
                        fontSize: '0.95rem',
                        maxWidth: '600px',
                        margin: '1.2rem auto 0',
                        lineHeight: 1.7
                    }}>
                        Hệ thống tiếp nhận thông tin dự án điện ảnh. Hãy điền cấu hình kịch bản hoặc liên hệ trực tiếp với chúng tôi để bắt đầu lập kế hoạch sản xuất.
                    </p>
                </div>
            </header>

            {/* Split Grid Section */}
            <section style={{ padding: '2rem 0 6rem', position: 'relative', zIndex: 2 }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div className="contact-split-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.25fr', gap: '3rem' }}>

                        {/* ==============================================
                            LEFT COLUMN: COORDINATES & TELEMETRY
                            ============================================== */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                            {/* main telemetry panel */}
                            <div style={{
                                backgroundColor: 'rgba(10,10,10,0.85)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                padding: '2rem',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '0 15px 40px rgba(0,0,0,0.6)'
                            }}>
                                {/* Viewfinder focus corner overlays */}
                                <div style={{ position: 'absolute', inset: '10px', pointerEvents: 'none', opacity: 0.3 }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '12px', height: '12px', borderTop: '2px solid #C09A5A', borderLeft: '2px solid #C09A5A' }} />
                                    <div style={{ position: 'absolute', top: 0, right: 0, width: '12px', height: '12px', borderTop: '2px solid #C09A5A', borderRight: '2px solid #C09A5A' }} />
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '12px', height: '12px', borderBottom: '2px solid #C09A5A', borderLeft: '2px solid #C09A5A' }} />
                                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderBottom: '2px solid #C09A5A', borderRight: '2px solid #C09A5A' }} />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1rem' }}>
                                    <Activity size={16} style={{ color: '#C09A5A' }} />
                                    <span style={{ fontSize: '0.7rem', color: '#C09A5A', letterSpacing: '0.2em', fontWeight: 800, textTransform: 'uppercase' }}>
                                        STUDIO COORDINATES & HUD STATUS
                                    </span>
                                </div>

                                {/* HUD System specifications */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.8rem', fontFamily: 'monospace' }}>
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>COORDINATES</span>
                                        <span style={{ fontSize: '0.75rem', color: '#FFFFFF', fontWeight: 600 }}>10.8411° N, 106.8073° E</span>
                                    </div>
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ALTITUDE / TIMEZONE</span>
                                        <span style={{ fontSize: '0.75rem', color: '#FFFFFF', fontWeight: 600 }}>12M / GMT+7</span>
                                    </div>
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SYSTEM LATENCY</span>
                                        <span style={{ fontSize: '0.75rem', color: '#C09A5A', fontWeight: 700 }}>REPLY &lt; 24H</span>
                                    </div>
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LOCAL TIME</span>
                                        <span style={{ fontSize: '0.75rem', color: '#FFFFFF', fontWeight: 600, letterSpacing: '0.1em' }}>[ {localTime || '14:49:00'} ]</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1rem', backgroundColor: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', width: 'fit-content', marginBottom: '2rem' }}>
                                    <span style={{ width: '6px', height: '6px', backgroundColor: '#22c55e', borderRadius: '50%', boxShadow: '0 0 8px #22c55e', animation: 'blinking 1.5s infinite' }} />
                                    <span style={{ fontSize: '0.6rem', color: '#22c55e', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase' }}>STUDIO STATUS: OPERATIONAL</span>
                                </div>

                                {/* Custom dark monochrome styled Google Map Embed */}
                                <div style={{
                                    width: '100%',
                                    aspectRatio: '16/9',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.5)'
                                }}>
                                    <iframe
                                        title="Studio Location"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.6099415305103!2d106.80730811162446!3d10.841133257950098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b94c37999914!2sFPT%20University%20HCMC!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                                        width="100%"
                                        height="100%"
                                        style={{
                                            border: 0,
                                            filter: 'invert(90%) hue-rotate(180deg) grayscale(100%) contrast(1.2) brightness(0.9)'
                                        }}
                                        allowFullScreen={false}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </div>

                            {/* Contact channels grid */}
                            <div className="contact-channels-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                                {[
                                    { icon: <Mail size={18} />, title: 'EMAIL CHANNEL', detail: 'auraproduction2512@gmail.com', sub: 'Hỗ trợ dự án 24/7' },
                                    { icon: <Phone size={18} />, title: 'DIRECT HOTLINE', detail: '0333 908 576', sub: 'Thứ 2 - Thứ 6, 9h - 18h' },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            backgroundColor: '#0F0F0F',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            padding: '1.8rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '1rem',
                                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                        }}
                                        className="channel-card-hover"
                                    >
                                        <div style={{ color: '#C09A5A' }}>{item.icon}</div>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '0.6rem', color: '#C09A5A', letterSpacing: '0.15em', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                                                {item.title}
                                            </span>
                                            <span style={{ display: 'block', fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 600, fontFamily: 'monospace' }}>
                                                {item.detail}
                                            </span>
                                            <span style={{ display: 'block', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>
                                                {item.sub}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Studio Address details */}
                            <div style={{
                                backgroundColor: '#0F0F0F',
                                border: '1px solid rgba(255,255,255,0.05)',
                                padding: '1.8rem',
                                display: 'flex',
                                gap: '1.2rem',
                                alignItems: 'flex-start'
                            }}>
                                <MapPin size={20} style={{ color: '#C09A5A', marginTop: '2px', flexShrink: 0 }} />
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.6rem', color: '#C09A5A', letterSpacing: '0.15em', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                                        STUDIO HEADQUARTERS
                                    </span>
                                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#FFFFFF', fontWeight: 500, lineHeight: 1.5 }}>
                                        Lô E2a-7, Đường D1, Đ. Võ Chí Công, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh
                                    </span>
                                    <span style={{ display: 'block', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.4rem' }}>
                                        * Tiếp khách và làm việc theo lịch đặt hẹn trước
                                    </span>
                                </div>
                            </div>

                        </div>

                        {/* ==============================================
                            RIGHT COLUMN: INITIATE BRIEFING CONSOLE
                            ============================================== */}
                        <div style={{
                            backgroundColor: 'rgba(10,10,10,0.85)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            padding: '3rem',
                            position: 'relative',
                            boxShadow: '0 15px 40px rgba(0,0,0,0.6)'
                        }} className="brief-console-viewport">

                            {/* Corner viewfinders */}
                            <div style={{ position: 'absolute', inset: '10px', pointerEvents: 'none', opacity: 0.3 }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '12px', height: '12px', borderTop: '2px solid #C09A5A', borderLeft: '2px solid #C09A5A' }} />
                                <div style={{ position: 'absolute', top: 0, right: 0, width: '12px', height: '12px', borderTop: '2px solid #C09A5A', borderRight: '2px solid #C09A5A' }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '12px', height: '12px', borderBottom: '2px solid #C09A5A', borderLeft: '2px solid #C09A5A' }} />
                                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', borderBottom: '2px solid #C09A5A', borderRight: '2px solid #C09A5A' }} />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1.2rem' }}>
                                <Compass size={16} style={{ color: '#C09A5A' }} />
                                <span style={{ fontSize: '0.7rem', color: '#C09A5A', letterSpacing: '0.2em', fontWeight: 800, textTransform: 'uppercase' }}>
                                    INITIATE PROJECT PRODUCTION BRIEFING
                                </span>
                            </div>

                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const target = e.target as any;
                                    const data = {
                                        name: target[0].value,
                                        email: target[1].value,
                                        phoneNumber: target[2].value,
                                        subject: target[3].value,
                                        message: target[4].value
                                    };

                                    try {
                                        const btn = document.getElementById('submit-btn');
                                        if (btn) {
                                            btn.innerText = 'TRANSMITTING BRIEFING...';
                                            btn.style.opacity = '0.7';
                                        }

                                        await contactApi.sendMessage(data);
                                        alert('Cảm ơn bạn! Hợp đồng kịch bản sơ bộ đã được truyền thành công tới máy chủ Aura.');
                                        target.reset();
                                    } catch (error) {
                                        alert('Có lỗi xảy ra trong quá trình truyền dữ liệu. Vui lòng thử lại sau.');
                                    } finally {
                                        const btn = document.getElementById('submit-btn');
                                        if (btn) {
                                            btn.innerText = 'GỬI TIN NHẮN';
                                            btn.style.opacity = '1';
                                        }
                                    }
                                }}
                                style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}
                            >
                                {/* Direct grid for inputs, keeping the absolute sequential order of inputs intact */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.8rem' }}>

                                    {/* Input 1: Name */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.55rem', color: '#C09A5A', letterSpacing: '0.12em', fontWeight: 800, textTransform: 'uppercase' }}>01 / HỌ VÀ TÊN *</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Nhập họ và tên..."
                                            style={{
                                                width: '100%', border: '1px solid rgba(255,255,255,0.06)', padding: '1.1rem 1.3rem',
                                                color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', backgroundColor: '#0B0B0B',
                                                borderRadius: 0, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                            }}
                                            className="console-input"
                                        />
                                    </div>

                                    {/* Input 2: Email */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.55rem', color: '#C09A5A', letterSpacing: '0.12em', fontWeight: 800, textTransform: 'uppercase' }}>02 / ĐỊA CHỈ EMAIL *</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="example@domain.com"
                                            style={{
                                                width: '100%', border: '1px solid rgba(255,255,255,0.06)', padding: '1.1rem 1.3rem',
                                                color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', backgroundColor: '#0B0B0B',
                                                borderRadius: 0, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                            }}
                                            className="console-input"
                                        />
                                    </div>

                                    {/* Input 3: Phone */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.55rem', color: '#C09A5A', letterSpacing: '0.12em', fontWeight: 800, textTransform: 'uppercase' }}>03 / SỐ ĐIỆN THOẠI *</label>
                                        <input
                                            required
                                            type="tel"
                                            placeholder="Nhập số điện thoại..."
                                            style={{
                                                width: '100%', border: '1px solid rgba(255,255,255,0.06)', padding: '1.1rem 1.3rem',
                                                color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', backgroundColor: '#0B0B0B',
                                                borderRadius: 0, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                            }}
                                            className="console-input"
                                        />
                                    </div>
                                </div>

                                {/* Input 4: Subject */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.55rem', color: '#C09A5A', letterSpacing: '0.12em', fontWeight: 800, textTransform: 'uppercase' }}>04 / CHỦ ĐỀ BRIEFING *</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ví dụ: Sản xuất TVC Commercial, Phim Thương Hiệu..."
                                        style={{
                                            width: '100%', border: '1px solid rgba(255,255,255,0.06)', padding: '1.1rem 1.3rem',
                                            color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', backgroundColor: '#0B0B0B',
                                            borderRadius: 0, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                                        }}
                                        className="console-input"
                                    />
                                </div>

                                {/* Input 5: Message */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.55rem', color: '#C09A5A', letterSpacing: '0.12em', fontWeight: 800, textTransform: 'uppercase' }}>05 / CHI TIẾT Ý TƯỞNG & YÊU CẦU DỰ ÁN *</label>
                                    <textarea
                                        required
                                        placeholder="Hãy chia sẻ định hướng, câu chuyện thương hiệu, thời lượng phim dự kiến hoặc các thiết bị mong muốn của bạn..."
                                        rows={7}
                                        style={{
                                            width: '100%', border: '1px solid rgba(255,255,255,0.06)', padding: '1.1rem 1.3rem',
                                            color: '#FFFFFF', fontSize: '0.85rem', outline: 'none', resize: 'vertical', backgroundColor: '#0B0B0B',
                                            borderRadius: 0, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', lineHeight: 1.6
                                        }}
                                        className="console-input"
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                    <button
                                        id="submit-btn"
                                        type="submit"
                                        style={{
                                            backgroundColor: '#C09A5A',
                                            color: '#050505',
                                            padding: '1.3rem 3rem',
                                            fontSize: '0.85rem',
                                            letterSpacing: '0.2em',
                                            textTransform: 'uppercase',
                                            fontWeight: 900,
                                            cursor: 'pointer',
                                            border: 'none',
                                            width: '100%',
                                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                            borderRadius: 0,
                                            boxShadow: '0 10px 30px rgba(192, 154, 90, 0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '12px'
                                        }}
                                        className="console-submit-btn"
                                    >
                                        GỬI KHỞI TẠO BẢN THẢO <ArrowRight size={16} className="submit-arrow" style={{ transition: 'transform 0.3s ease' }} />
                                    </button>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0.4 }}>
                                        <ShieldCheck size={12} style={{ color: '#C09A5A' }} />
                                        <span style={{ fontSize: '0.55rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
                                            Bảo mật dữ liệu tuyệt đối chuẩn hóa mã hóa
                                        </span>
                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </section>

            {/* Bottom trust stats overlay */}
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
                            { value: '100%', label: 'BẢO MẬT HỢP ĐỒNG SẢN XUẤT' },
                            { value: '05+', label: 'CHUYÊN GIA KỊCH BẢN ĐỒNG HÀNH' },
                            { value: '24H', label: 'TỐC ĐỘ PHẢN HỒI KỸ THUẬT' },
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

            <style>{`
                @keyframes blinking {
                    0% { opacity: 0.3; }
                    50% { opacity: 1; }
                    100% { opacity: 0.3; }
                }

                .console-input {
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
                }
                .console-input:focus {
                    border-color: #C09A5A !important;
                    background-color: #0F0F0F !important;
                    box-shadow: 0 0 15px rgba(192, 154, 90, 0.1) !important;
                }

                .channel-card-hover:hover {
                    background-color: #121212 !important;
                    border-color: rgba(192, 154, 90, 0.2) !important;
                    transform: translateY(-3px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                }

                .console-submit-btn:hover {
                    background-color: #FFFFFF !important;
                    color: #050505 !important;
                    box-shadow: 0 15px 40px rgba(255,255,255,0.1) !important;
                }
                
                .console-submit-btn:hover .submit-arrow {
                    transform: translateX(6px);
                }

                @media (max-width: 1024px) {
                    .contact-split-grid {
                        grid-template-columns: 1fr !important;
                        gap: 3.5rem !important;
                    }
                    .brief-console-viewport {
                        padding: 2.2rem 1.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Contact;

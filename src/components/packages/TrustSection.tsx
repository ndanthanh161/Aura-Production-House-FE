import React from 'react';
import { motion } from 'framer-motion';

export const TrustSection: React.FC = React.memo(() => {
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
export default TrustSection;

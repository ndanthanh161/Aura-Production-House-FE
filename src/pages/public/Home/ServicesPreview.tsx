import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Video, Monitor, PenTool, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
    {
        icon: <Camera size={28} strokeWidth={1.5} />,
        title: 'Photography',
        desc: 'Bespoke editorial and personal branding photography that captures your authentic essence.',
        features: ['Portrait Sessions', 'Brand Shoots', 'Event Coverage'],
    },
    {
        icon: <Video size={28} strokeWidth={1.5} />,
        title: 'Videography',
        desc: 'Cinematic storytelling and commercial video production that moves audiences.',
        features: ['Commercials', 'Music Videos', 'Documentaries'],
    },
    {
        icon: <PenTool size={28} strokeWidth={1.5} />,
        title: 'Creative Direction',
        desc: 'Strategic brand positioning and visual storytelling that elevates your presence.',
        features: ['Brand Strategy', 'Art Direction', 'Visual Identity'],
    },
    {
        icon: <Monitor size={28} strokeWidth={1.5} />,
        title: 'Content Production',
        desc: 'High-end content for social media and digital platforms that drives engagement.',
        features: ['Social Media', 'Web Content', 'Digital Ads'],
    },
];

export const ServicesPreview: React.FC = () => {
    return (
        <section style={{ backgroundColor: '#050505', overflow: 'hidden', paddingTop: '8rem', paddingBottom: '8rem' }}>
            <div className="container">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    style={{ textAlign: 'center', marginBottom: '6rem' }}
                >
                    <div>
                        <span style={{
                            color: 'var(--color-accent)', letterSpacing: 'var(--ls-wide)',
                            fontSize: '0.7rem', textTransform: 'uppercase', display: 'block', marginBottom: '1.5rem',
                        }}>
                            What We Do
                        </span>
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', margin: 0, lineHeight: 1 }}>
                            Our <br />
                            <span style={{
                                fontFamily: 'var(--font-serif)', fontWeight: 200, fontStyle: 'italic',
                                textTransform: 'none',
                            }}>
                                Services
                            </span>
                        </h2>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', fontSize: '1rem', lineHeight: 1.7, margin: '2rem auto 0' }}>
                        Transforming conceptual vision into cinematic reality through high-end production.
                    </p>
                </motion.div>

                {/* Service Cards Grid */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1px', backgroundColor: 'rgba(255,255,255,0.05)',
                }}>
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.12 }}
                            className="service-card-v2"
                            style={{
                                padding: '3.5rem 2.5rem', backgroundColor: '#050505',
                                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                                position: 'relative', cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                minHeight: '380px',
                            }}
                        >
                            {/* Number */}
                            <span style={{
                                position: 'absolute', top: '2rem', right: '2.5rem',
                                fontSize: '0.7rem', color: 'rgba(255,255,255,0.15)', fontWeight: 300,
                            }}>
                                0{index + 1}
                            </span>

                            <div>
                                {/* Icon */}
                                <div style={{
                                    color: 'var(--color-accent)', marginBottom: '2rem',
                                    width: '56px', height: '56px', borderRadius: '50%',
                                    border: '1px solid rgba(197, 160, 89, 0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.5s ease',
                                }} className="service-icon">
                                    {service.icon}
                                </div>

                                {/* Title */}
                                <h3 style={{
                                    fontSize: '1.5rem', marginBottom: '1rem', textTransform: 'none',
                                    fontWeight: 600, letterSpacing: '-0.01em',
                                }}>
                                    {service.title}
                                </h3>

                                {/* Description */}
                                <p style={{
                                    color: 'var(--color-text-muted)', fontSize: '0.85rem',
                                    lineHeight: 1.8, marginBottom: '2rem',
                                }}>
                                    {service.desc}
                                </p>

                                {/* Features */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {service.features.map((f, i) => (
                                        <span key={i} style={{
                                            fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)',
                                            textTransform: 'uppercase', letterSpacing: '0.1em',
                                            paddingLeft: '1rem',
                                            borderLeft: '1px solid rgba(197, 160, 89, 0.2)',
                                        }}>
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="service-arrow" style={{
                                marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                color: 'var(--color-accent)', fontSize: '0.7rem',
                                textTransform: 'uppercase', letterSpacing: '0.15em',
                                opacity: 0, transition: 'all 0.5s ease', transform: 'translateY(10px)',
                            }}>
                                Learn More <ArrowRight size={14} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: 'center', marginTop: '5rem' }}
                >
                    <Link to="/services" style={{
                        color: 'var(--color-accent)', fontSize: '0.8rem', letterSpacing: '0.2em',
                        textTransform: 'uppercase', borderBottom: '1px solid var(--color-accent)',
                        paddingBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
                    }}>
                        Explore All Services <ArrowRight size={14} />
                    </Link>
                </motion.div>
            </div>

            <style>{`
                .service-card-v2:hover {
                    background-color: #0a0a0a !important;
                    transform: translateY(-4px);
                }
                .service-card-v2:hover .service-icon {
                    background-color: rgba(197, 160, 89, 0.1) !important;
                    border-color: var(--color-accent) !important;
                }
                .service-card-v2:hover .service-arrow {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
            `}</style>
        </section>
    );
};

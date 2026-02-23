import React from 'react';
import { Hero } from './Hero';
import { FeaturedProjects } from './FeaturedProjects';
import { ServicesPreview } from './ServicesPreview';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Hero />

            {/* Brand Marquee Ticker */}
            <div style={{
                overflow: 'hidden', backgroundColor: '#000',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                padding: '1.5rem 0',
            }}>
                <motion.div
                    animate={{ x: [0, -1600] }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'flex', gap: '4rem', whiteSpace: 'nowrap', width: 'fit-content' }}
                >
                    {[...Array(3)].map((_, setIndex) => (
                        <div key={setIndex} style={{ display: 'flex', gap: '4rem', alignItems: 'center' }}>
                            {['PHOTOGRAPHY', 'VIDEOGRAPHY', 'BRANDING', 'CREATIVE DIRECTION', 'CONTENT PRODUCTION', 'POST-PRODUCTION', 'FILM MAKING', 'ART DIRECTION'].map((text, i) => (
                                <span key={i} style={{
                                    fontSize: '0.7rem', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.15)',
                                    textTransform: 'uppercase', fontWeight: 500,
                                    display: 'flex', alignItems: 'center', gap: '4rem',
                                }}>
                                    {text}
                                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', display: 'inline-block', opacity: 0.5 }} />
                                </span>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>

            <FeaturedProjects />

            {/* Cinematic Quote / Vision Statement */}
            <section style={{
                backgroundColor: '#000', padding: '10rem 0',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Large decorative text */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    fontSize: 'clamp(8rem, 25vw, 20rem)', fontWeight: 900, color: 'rgba(255,255,255,0.02)',
                    textTransform: 'uppercase', letterSpacing: '-0.05em', pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                }}>
                    AURA
                </div>

                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                    >
                        <div style={{
                            width: '1px', height: '60px', backgroundColor: 'var(--color-accent)',
                            margin: '0 auto 3rem', opacity: 0.5,
                        }} />
                        <h2 style={{
                            fontSize: 'clamp(1.8rem, 4vw, 3rem)', maxWidth: '800px', margin: '0 auto 2rem',
                            fontWeight: 300, lineHeight: 1.5, textTransform: 'none', letterSpacing: '-0.01em',
                        }}>
                            "Every frame we create becomes part of a
                            <span style={{
                                fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-accent)',
                            }}> visual legacy </span>
                            that transcends time."
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden',
                                border: '2px solid var(--color-accent)',
                            }}>
                                <img
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                                    alt="Founder"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <span style={{
                                    color: 'var(--color-accent)', fontSize: '0.8rem', fontWeight: 600,
                                    display: 'block',
                                }}>
                                    Jonathan Ross
                                </span>
                                <span style={{
                                    color: 'var(--color-text-muted)', fontSize: '0.7rem',
                                    textTransform: 'uppercase', letterSpacing: '0.1em',
                                }}>
                                    Creative Director
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <ServicesPreview />

            {/* Clients / Trust Bar */}
            <section style={{
                backgroundColor: '#050505', padding: '6rem 0',
                borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <span style={{
                            color: 'var(--color-text-muted)', fontSize: '0.7rem',
                            textTransform: 'uppercase', letterSpacing: '0.3em',
                        }}>
                            Trusted by industry leaders
                        </span>
                        <div style={{
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            gap: '5rem', marginTop: '3rem', flexWrap: 'wrap',
                        }}>
                            {['NIKE', 'ADIDAS', 'NETFLIX', 'SONY', 'APPLE'].map((brand, i) => (
                                <motion.span
                                    key={brand}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 0.2, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    style={{
                                        fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.2em',
                                        color: '#fff',
                                    }}
                                >
                                    {brand}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                backgroundColor: '#000', padding: '10rem 0',
                position: 'relative', overflow: 'hidden',
            }}>
                <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <span style={{
                            color: 'var(--color-accent)', letterSpacing: 'var(--ls-wide)',
                            fontSize: '0.7rem', textTransform: 'uppercase', display: 'block', marginBottom: '2rem',
                        }}>
                            Start Your Project
                        </span>
                        <h2 style={{
                            fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1, margin: '0 0 2rem',
                        }}>
                            Ready to Create <br />
                            <span style={{
                                fontFamily: 'var(--font-serif)', fontWeight: 200, fontStyle: 'italic',
                                textTransform: 'none',
                            }}>
                                Something Exceptional?
                            </span>
                        </h2>
                        <p style={{
                            color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto 3rem',
                            fontSize: '1.1rem', lineHeight: 1.7,
                        }}>
                            Let's discuss your vision and turn it into a cinematic reality that leaves a lasting impression.
                        </p>
                        <a href="/contact" style={{
                            display: 'inline-block', backgroundColor: 'var(--color-accent)',
                            color: '#000', padding: '1.25rem 3.5rem', fontSize: '0.75rem',
                            letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 800,
                            transition: 'all 0.5s ease',
                        }}>
                            Get In Touch
                        </a>
                    </motion.div>
                </div>
            </section>
        </motion.div>
    );
};

export default Home;

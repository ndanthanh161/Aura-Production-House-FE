import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 700], [0, 200]);
    const textY = useTransform(scrollY, [0, 700], [0, -80]);
    const opacity = useTransform(scrollY, [0, 500], [1, 0]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section style={{
            height: '100vh',
            width: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            overflow: 'hidden',
            backgroundColor: '#000',
            paddingBottom: '8vh',
        }}>
            {/* Parallax Cinematic Background */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: '-50px',
                    left: '-50px',
                    width: 'calc(100% + 100px)',
                    height: 'calc(100% + 100px)',
                    zIndex: 1,
                    y: bgY,
                    x: mousePos.x * 0.3,
                }}
            >
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.95) 100%)',
                    zIndex: 2,
                }} />
                <img
                    src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2070"
                    alt="Cinematic Background"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </motion.div>

            {/* Decorative: Floating Film Grain Overlay */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2,
                opacity: 0.04, pointerEvents: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            }} />

            {/* Decorative Lines */}
            <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1.5, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: 'absolute', right: '10%', top: '15%', width: '1px', height: '30%',
                    background: 'linear-gradient(180deg, transparent, var(--color-accent), transparent)',
                    zIndex: 3, opacity: 0.3, transformOrigin: 'top',
                }}
            />

            {/* Main Hero Content */}
            <motion.div
                className="container"
                style={{ position: 'relative', zIndex: 4, textAlign: 'center', y: textY, opacity }}
            >
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.15, delayChildren: 0.3 },
                            },
                        }}
                    >
                        {/* Accent Line + Tag */}
                        <motion.div
                            variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}
                        >
                            <div style={{ width: '60px', height: '1px', background: 'var(--color-accent)' }} />
                            <span style={{
                                color: 'var(--color-accent)', letterSpacing: 'var(--ls-wide)',
                                fontSize: '0.7rem', textTransform: 'uppercase',
                            }}>
                                Experience the Cinematic Presence
                            </span>
                        </motion.div>

                        {/* Title: AURA */}
                        <div style={{ overflow: 'hidden', marginBottom: '0.5rem' }}>
                            <motion.h1
                                variants={{ hidden: { y: '110%' }, visible: { y: 0 } }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    fontSize: 'clamp(4.5rem, 14vw, 12rem)',
                                    lineHeight: 0.85, margin: 0,
                                    background: 'linear-gradient(180deg, #FFFFFF 30%, rgba(255,255,255,0.5) 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                AURA
                            </motion.h1>
                        </div>

                        {/* Title: Productions */}
                        <div style={{ overflow: 'hidden', marginBottom: '3rem' }}>
                            <motion.h1
                                variants={{ hidden: { y: '110%' }, visible: { y: 0 } }}
                                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    fontSize: 'clamp(3.5rem, 11vw, 9rem)',
                                    lineHeight: 0.9, margin: 0,
                                    fontStyle: 'italic', fontWeight: '200',
                                    fontFamily: 'var(--font-serif)',
                                    textTransform: 'none', letterSpacing: '-0.02em',
                                    color: 'rgba(255,255,255,0.85)',
                                }}
                            >
                                Productions
                            </motion.h1>
                        </div>

                        {/* Description */}
                        <motion.p
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                            transition={{ duration: 0.8 }}
                            style={{
                                maxWidth: '480px', color: 'rgba(255,255,255,0.5)',
                                fontSize: '1.1rem', margin: '0 auto 3.5rem', lineHeight: '1.7',
                                fontWeight: 300,
                            }}
                        >
                            Crafting high-end visual legacies for visionaries who demand excellence.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                            transition={{ duration: 0.8 }}
                            style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Link to="/portfolio">
                                <Button size="lg" style={{ borderRadius: '0', padding: '1.5rem 3rem' }}>
                                    View Work <ArrowRight size={18} style={{ marginLeft: '12px' }} />
                                </Button>
                            </Link>
                            <button style={{
                                color: '#fff', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em',
                                opacity: 0.7, background: 'none', border: 'none', cursor: 'pointer',
                            }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '50%',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Play size={16} fill="#fff" />
                                </div>
                                Showreel
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 2.5, duration: 1 }}
                style={{
                    position: 'absolute', bottom: '4rem', right: '4rem', zIndex: 4,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                }}
            >
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.3em', writingMode: 'vertical-rl' }}>
                    Scroll
                </span>
                <motion.div
                    animate={{ height: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ width: '1px', height: '60px', backgroundColor: 'var(--color-accent)', transformOrigin: 'top' }}
                />
            </motion.div>

            {/* Bottom Stats Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1 }}
                style={{
                    position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 4,
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', justifyContent: 'center',
                }}
            >
                <div style={{
                    display: 'flex', gap: '0', maxWidth: '800px', width: '100%',
                }}>
                    {[
                        { num: '500+', label: 'Projects' },
                        { num: '15+', label: 'Awards' },
                        { num: '50+', label: 'Clients' },
                    ].map((stat, i) => (
                        <div key={i} style={{
                            flex: 1, padding: '1.5rem 2rem', textAlign: 'center',
                            borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                        }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-accent)' }}>{stat.num}</span>
                            <span style={{ display: 'block', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

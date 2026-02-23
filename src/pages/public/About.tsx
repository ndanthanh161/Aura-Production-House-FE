import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
    return (
        <div style={{ paddingTop: '100px', backgroundColor: '#000' }}>
            <header className="container" style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'left' }}>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: 'var(--ls-wide)', fontSize: '0.75rem' }}
                >
                    Manifesto
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', marginTop: '2rem', lineHeight: 0.9 }}
                >
                    Aura is where <br />
                    <span style={{ fontStyle: 'italic', fontWeight: '200', textTransform: 'none', fontFamily: 'var(--font-serif)' }}>Vision</span> Meets <span style={{ fontStyle: 'italic', fontWeight: '200', textTransform: 'none', fontFamily: 'var(--font-serif)' }}>Legacy</span>
                </motion.h1>
            </header>

            <section className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', alignItems: 'start' }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1000"
                        alt="Studio"
                        style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover' }}
                    />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '3rem', padding: '4rem' }}
                >
                    <h2 style={{ fontSize: '2.5rem', textTransform: 'none', lineHeight: 1.2 }}>Authentic Cinematic <br />Identity</h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', lineHeight: '1.8' }}>
                        Founded in 2020, Aura Production House was born from a desire to bridge the gap between commercial polish and authentic storytelling. We believe every individual and brand has a cinematic frequency—our mission is to find it and broadcast it.
                    </p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', lineHeight: '1.8' }}>
                        Based in New York but operating globally, our team of directors, photographers, and creative strategists work in tandem to create visual legacies that stand the test of time.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '3rem' }}>
                        <div>
                            <h4 style={{ color: 'var(--color-accent)', fontSize: '3rem', margin: 0 }}>500+</h4>
                            <p style={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.1em', marginTop: '1rem', fontStyle: 'normal' }}>Projects Completed</p>
                        </div>
                        <div>
                            <h4 style={{ color: 'var(--color-accent)', fontSize: '3rem', margin: 0 }}>15+</h4>
                            <p style={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.1em', marginTop: '1rem', fontStyle: 'normal' }}>Creative Awards</p>
                        </div>
                    </div>
                </motion.div>
            </section>

            <section className="section-padding" style={{ backgroundColor: '#050505', marginTop: 'var(--spacing-xl)' }}>
                <div className="container">
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: 'var(--spacing-xl)', textAlign: 'left' }}>The Philosophy</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1px', backgroundColor: 'var(--color-border)' }}>
                        {[
                            { title: 'Minimalism', desc: 'We remove the clutter to let your essence shine through.' },
                            { title: 'Cinematic', desc: 'We use lighting and composition techniques from the silver screen.' },
                            { title: 'Strategic', desc: 'Every shot serves a purpose in your brand\'s growth story.' }
                        ].map((item, i) => (
                            <div key={i} style={{ padding: '4rem', backgroundColor: '#050505' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--color-accent)', textTransform: 'uppercase' }}>{item.title}</h3>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.8 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;

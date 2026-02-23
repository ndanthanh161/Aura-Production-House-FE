import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact: React.FC = () => {
    return (
        <div style={{ paddingTop: '100px', backgroundColor: '#000', minHeight: '100vh' }}>
            <header className="container" style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'left' }}>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: 'var(--ls-wide)', fontSize: '0.75rem' }}
                >
                    Get In Touch
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', marginTop: '2rem', lineHeight: 0.9 }}
                >
                    Let's Create <br />
                    <span style={{ fontStyle: 'italic', fontWeight: '200', textTransform: 'none', fontFamily: 'var(--font-serif)' }}>Together</span>
                </motion.h1>
            </header>

            <section className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1px', backgroundColor: 'var(--color-border)' }}>
                {[
                    { icon: <Mail size={28} />, title: 'Email', detail: 'hello@auraproduction.com', sub: 'We respond within 24 hours' },
                    { icon: <Phone size={28} />, title: 'Phone', detail: '+1 (555) 123-4567', sub: 'Mon–Fri, 9am–6pm EST' },
                    { icon: <MapPin size={28} />, title: 'Studio', detail: 'New York City, NY', sub: 'By appointment only' },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.15 }}
                        style={{ padding: '4rem', backgroundColor: '#050505' }}
                    >
                        <div style={{ color: 'var(--color-accent)', marginBottom: '2rem' }}>{item.icon}</div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.title}</h3>
                        <p style={{ color: '#fff', fontSize: '1.125rem', marginBottom: '0.5rem' }}>{item.detail}</p>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{item.sub}</p>
                    </motion.div>
                ))}
            </section>

            <section className="section-padding" style={{ marginTop: 'var(--spacing-xl)' }}>
                <div className="container" style={{ maxWidth: '700px' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: 'var(--spacing-lg)', textAlign: 'left' }}>Send a Message</h2>
                    <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <input type="text" placeholder="Name" style={{
                                background: 'transparent', border: '1px solid var(--color-border)', padding: '1rem 1.25rem',
                                color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', outline: 'none',
                            }} />
                            <input type="email" placeholder="Email" style={{
                                background: 'transparent', border: '1px solid var(--color-border)', padding: '1rem 1.25rem',
                                color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', outline: 'none',
                            }} />
                        </div>
                        <input type="text" placeholder="Subject" style={{
                            background: 'transparent', border: '1px solid var(--color-border)', padding: '1rem 1.25rem',
                            color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', outline: 'none',
                        }} />
                        <textarea placeholder="Tell us about your project..." rows={6} style={{
                            background: 'transparent', border: '1px solid var(--color-border)', padding: '1rem 1.25rem',
                            color: '#fff', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', outline: 'none', resize: 'vertical',
                        }} />
                        <button type="submit" style={{
                            backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)', padding: '1rem 2.5rem',
                            fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 800,
                            alignSelf: 'flex-start', cursor: 'pointer', border: 'none',
                        }}>
                            Send Message
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Contact;

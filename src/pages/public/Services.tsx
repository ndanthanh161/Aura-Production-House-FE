import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Video, PenTool, Monitor, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const services = [
    {
        icon: <Camera size={40} />,
        title: 'Photography',
        desc: 'Beyond a simple picture. We capture the essence of your persona through architectural lighting and editorial composition.',
        features: ['Personal Branding', 'Editorial Fashion', 'Commercial Products', 'Architectural Portfolios']
    },
    {
        icon: <Video size={40} />,
        title: 'Videography',
        desc: 'Cinematic storytelling that resonates. From short-form social content to full-scale commercial productions.',
        features: ['Brand Films', 'Documentary Style', 'Commercial Adverts', 'Event Highlights']
    },
    {
        icon: <PenTool size={40} />,
        title: 'Creative Direction',
        desc: 'A cohesive vision is key. We curate your visual identity to ensure consistency across all platforms.',
        features: ['Visual Strategy', 'Moodboarding', 'Set Design', 'Styling Direction']
    },
    {
        icon: <Monitor size={40} />,
        title: 'Content Production',
        desc: 'Data-driven content that performs. We build assets designed specifically for engagement and conversion.',
        features: ['Social Media Reels', 'YouTube Strategy', 'Digital Assets', 'Motion Graphics']
    }
];

const workflow = [
    { step: '01', title: 'Consultation', desc: 'Understanding your goals and vision through deep architectural analysis.' },
    { step: '02', title: 'Pre-Production', desc: 'Detailed planning, location scouting, and moodboard finalization.' },
    { step: '03', title: 'The Shoot', desc: 'High-end production using state-of-the-art cinema equipment.' },
    { step: '04', title: 'Post-Production', desc: 'Cinematic color grading, sound design, and meticulous editing.' }
];

const Services: React.FC = () => {
    return (
        <div style={{ paddingTop: '100px', backgroundColor: '#000' }}>
            <section className="container" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <header style={{ maxWidth: '1000px', marginBottom: 'var(--spacing-lg)' }}>
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: 'var(--ls-wide)', fontSize: '0.75rem' }}
                    >
                        Capabilities
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', marginTop: '2rem', lineHeight: 0.9 }}
                    >
                        Premium <br />
                        <span style={{ fontStyle: 'italic', fontWeight: '200', textTransform: 'none', fontFamily: 'var(--font-serif)' }}>Visual Stories</span>
                    </motion.h1>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1px', backgroundColor: 'var(--color-border)' }}>
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            style={{
                                padding: '4rem',
                                backgroundColor: '#080808',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2rem'
                            }}
                        >
                            <div style={{ color: 'var(--color-accent)' }}>{service.icon}</div>
                            <h3 style={{ fontSize: '2rem', textTransform: 'none' }}>{service.title}</h3>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>{service.desc}</p>
                            <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: 'auto', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                                {service.features.map(f => (
                                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        <div style={{ width: '4px', height: '4px', backgroundColor: 'var(--color-accent)' }} /> {f}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Workflow Section */}
            <section style={{ backgroundColor: '#ffffff', color: '#000' }} className="section-padding">
                <div className="container">
                    <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', marginBottom: 'var(--spacing-xl)', textAlign: 'left', color: '#000', lineHeight: 0.9 }}>Production <br />Workflow</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem' }}>
                        {workflow.map((item, index) => (
                            <div key={index}>
                                <span style={{ fontSize: '1.25rem', fontWeight: '800', display: 'block', marginBottom: '1.5rem', fontFamily: 'var(--font-sans)', borderBottom: '2px solid #000', width: 'fit-content' }}>{item.step}</span>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#000', textTransform: 'none' }}>{item.title}</h3>
                                <p style={{ opacity: 0.7, fontSize: '0.9rem', lineHeight: 1.7 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding container" style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '3rem', textTransform: 'none' }}>Ready to elevate your <br />visual legacy?</h2>
                <Button size="lg" style={{ borderRadius: '0', padding: '1.5rem 3.5rem' }}>Project Inquiry <ArrowRight size={18} style={{ marginLeft: '12px' }} /></Button>
            </section>
        </div>
    );
};

export default Services;

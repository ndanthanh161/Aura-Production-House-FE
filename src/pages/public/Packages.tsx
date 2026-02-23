import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const packages = [
    {
        name: 'Essential',
        price: '$1,200',
        features: ['4 Hour Shoot', '10 Edits', '1 Cinema Teaser', 'Digital Delivery'],
        popular: false
    },
    {
        name: 'Premium',
        price: '$2,500',
        features: ['Full Day Shoot', '25 Edits', '3 Cinema Teasers', 'Creative Direction', 'BTS Coverage'],
        popular: true
    },
    {
        name: 'Executive',
        price: '$5,000',
        features: ['2 Day Production', '50 Edits', 'Full Brand Film', 'Strategic Consultation', 'Social Media Kit'],
        popular: false
    }
];

const Packages: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{ paddingTop: '100px', backgroundColor: '#000' }}>
            <header className="container" style={{ textAlign: 'left', marginBottom: 'var(--spacing-xl)' }}>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: 'var(--ls-wide)', fontSize: '0.75rem' }}
                >
                    Investment
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', marginTop: '2rem', lineHeight: 0.9 }}
                >
                    Production <br />
                    <span style={{ fontStyle: 'italic', fontWeight: '200', textTransform: 'none', fontFamily: 'var(--font-serif)' }}>Partnerships</span>
                </motion.h1>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1px', backgroundColor: 'var(--color-border)' }}>
                {packages.map((pkg, index) => (
                    <motion.div
                        key={pkg.name}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        style={{
                            padding: '4rem',
                            backgroundColor: '#080808',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            minHeight: '600px'
                        }}
                    >
                        {pkg.popular && (
                            <div style={{
                                position: 'absolute',
                                top: '2rem',
                                right: '4rem',
                                border: '1px solid var(--color-accent)',
                                color: 'var(--color-accent)',
                                padding: '4px 12px',
                                fontSize: '0.65rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em'
                            }}>
                                Signature
                            </div>
                        )}
                        <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', textTransform: 'none' }}>{pkg.name}</h3>
                        <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#fff', marginBottom: '3rem', letterSpacing: 'var(--ls-tight)' }}>{pkg.price}</div>

                        <ul style={{ listStyle: 'none', marginBottom: '4rem', flex: 1, borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                            {pkg.features.map(f => (
                                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                    <div style={{ width: '4px', height: '4px', backgroundColor: 'var(--color-accent)' }} /> {f}
                                </li>
                            ))}
                        </ul>

                        <Button
                            variant={pkg.popular ? 'primary' : 'outline'}
                            onClick={() => navigate('/payment')}
                            style={{ width: '100%', borderRadius: '0', padding: '1.5rem' }}
                        >
                            Select Partnership <ArrowRight size={18} style={{ marginLeft: '10px' }} />
                        </Button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Packages;

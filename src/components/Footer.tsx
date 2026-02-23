import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer style={{
            backgroundColor: 'var(--color-bg-secondary)',
            padding: 'var(--spacing-xl) 0 var(--spacing-md)',
            borderTop: '1px solid var(--color-border)'
        }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                    <div>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: 'var(--spacing-sm)', color: 'var(--color-text)' }}>AURA</h2>
                        <p style={{ color: 'var(--color-text-muted)', maxWidth: '300px', marginBottom: 'var(--spacing-md)' }}>
                            A premium creative production house specializing in cinematic storytelling and personal branding.
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <a href="#" className="social-icon"><Instagram size={20} /></a>
                            <a href="#" className="social-icon"><Twitter size={20} /></a>
                            <a href="#" className="social-icon"><Youtube size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-text)', letterSpacing: '0.1em' }}>QUICK LINKS</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <Link to="/portfolio" className="footer-link">Portfolio</Link>
                            <Link to="/services" className="footer-link">Services</Link>
                            <Link to="/packages" className="footer-link">Packages</Link>
                            <Link to="/about" className="footer-link">About Us</Link>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-text)', letterSpacing: '0.1em' }}>CONTACT</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-muted)' }}>
                                <Mail size={16} /> info@auraproduction.com
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-muted)' }}>
                                <Phone size={16} /> +1 (555) 123-4567
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-muted)' }}>
                                <MapPin size={16} /> 123 Creative Studio, NY
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        © {new Date().getFullYear()} Aura Production House. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <Link to="/privacy" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Privacy Policy</Link>
                        <Link to="/terms" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Terms of Service</Link>
                    </div>
                </div>
            </div>

            <style>{`
        .social-icon {
          color: var(--color-text-muted);
          transition: var(--color-accent);
        }
        .social-icon:hover {
          color: var(--color-accent);
        }
        .footer-link {
          color: var(--color-text-muted);
          font-size: 0.938rem;
          transition: var(--transition-smooth);
        }
        .footer-link:hover {
          color: var(--color-accent);
          transform: translateX(5px);
        }
      `}</style>
        </footer>
    );
};

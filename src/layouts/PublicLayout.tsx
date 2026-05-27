import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import logoColor from '../assets/LOGO COLOR.png';

export const PublicLayout: React.FC = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg)', overflow: isAuthPage ? 'hidden' : 'visible', position: 'relative' }}>
            <Navbar />
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ flex: 1, paddingTop: '0', display: isAuthPage ? 'flex' : 'block', flexDirection: 'column' }}
            >
                <Outlet />
            </motion.main>
            {!isAuthPage && <Footer />}
        </div>
    );
};

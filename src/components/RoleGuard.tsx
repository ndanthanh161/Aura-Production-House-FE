import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { Role } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: Role[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
    const { role, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-accent)'
            }}>
                <div className="loading-spinner">AURA</div>
            </div>
        );
    }

    if (!role || !allowedRoles.includes(role)) {
        // If user is logged in as staff/admin but trying to access something else, or not logged in
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

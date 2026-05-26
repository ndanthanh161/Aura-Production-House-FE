import React from 'react';
import type { ProjectStatus } from '../../types/project.types';
import { getStatusInfo } from './helpers';

interface ShutterIrisProps {
    status: ProjectStatus;
}

export const ShutterIris: React.FC<ShutterIrisProps> = React.memo(({ status }) => {
    const info = getStatusInfo(status);
    return (
        <div style={{
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            border: '2px solid rgba(192, 154, 90, 0.35)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            backgroundImage: 'radial-gradient(circle, rgba(192,154,90,0.05) 0%, transparent 70%)',
            overflow: 'hidden'
        }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'absolute', transform: 'rotate(25deg)', opacity: 0.3 }}>
                <path d="M50 0 L100 30 L60 40 Z" fill="var(--color-accent)" />
                <path d="M100 50 L70 100 L60 60 Z" fill="var(--color-accent)" />
                <path d="M50 100 L0 70 L40 60 Z" fill="var(--color-accent)" />
                <path d="M0 50 L30 0 L40 40 Z" fill="var(--color-accent)" />
            </svg>
            <div style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
            }}>
                <span style={{ fontSize: '0.52rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-text-muted)' }}>PRODUCTION</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: info.color, marginTop: '4px', letterSpacing: '0.05em' }}>{info.label.toUpperCase()}</span>
            </div>
        </div>
    );
});

ShutterIris.displayName = 'ShutterIris';

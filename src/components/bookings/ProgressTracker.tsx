import React from 'react';
import { Clock, Layers, ShieldCheck } from 'lucide-react';
import type { ProjectStatus } from '../../types/project.types';

interface ProgressTrackerProps {
    status: ProjectStatus;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = React.memo(({ status }) => {
    let fillWidth = '0%';
    let activeStep = 0;
    const isCancelled = status === 'Cancelled';

    if (status === 'Scheduled') {
        fillWidth = '15%';
        activeStep = 1;
    } else if (status === 'InProduction') {
        fillWidth = '55%';
        activeStep = 2;
    } else if (status === 'Completed') {
        fillWidth = '100%';
        activeStep = 3;
    }

    const steps = [
        { label: 'LÊN LỊCH', desc: 'Secure Booking', icon: Clock },
        { label: 'SẢN XUẤT', desc: 'Shooting & Editorial', icon: Layers },
        { label: 'BÀN GIAO', desc: 'Assets Delivered', icon: ShieldCheck }
    ];

    return (
        <div style={{ position: 'relative', marginTop: '2.5rem', marginBottom: '2rem', padding: '0 10px' }}>
            {/* Progress line */}
            <div style={{
                position: 'absolute',
                top: '18px',
                left: '20px',
                right: '20px',
                height: '2px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                zIndex: 1
            }}>
                <div style={{
                    width: fillWidth,
                    height: '100%',
                    background: isCancelled ? '#ef4444' : 'linear-gradient(90deg, var(--color-accent) 0%, #F3E5AB 100%)',
                    boxShadow: isCancelled ? '0 0 10px rgba(239, 68, 68, 0.5)' : '0 0 15px rgba(192, 154, 90, 0.4)',
                    transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />
            </div>

            {/* Steps container */}
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                {steps.map((step, idx) => {
                    const stepNum = idx + 1;
                    const isDone = activeStep >= stepNum && !isCancelled;
                    const isActive = activeStep === stepNum && !isCancelled;
                    const StepIcon = step.icon;

                    return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90px' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: isDone ? 'rgba(15, 15, 15, 0.95)' : 'rgba(10, 10, 10, 0.95)',
                                border: `2px solid ${isDone ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: isDone ? 'var(--color-accent)' : 'rgba(255,255,255,0.25)',
                                boxShadow: isActive ? '0 0 20px rgba(192, 154, 90, 0.4)' : 'none',
                                transition: 'all 0.5s ease',
                                transform: isActive ? 'scale(1.2)' : 'scale(1)'
                            }}>
                                <StepIcon size={15} className={isActive ? 'animate-pulse' : ''} />
                            </div>
                            <span style={{
                                fontSize: '0.62rem',
                                fontWeight: 800,
                                color: isDone ? 'var(--color-text)' : 'rgba(255,255,255,0.25)',
                                marginTop: '8px',
                                letterSpacing: '0.05em',
                                textAlign: 'center',
                                whiteSpace: 'nowrap'
                            }}>
                                {step.label}
                            </span>
                            <span style={{
                                fontSize: '0.52rem',
                                color: isDone ? 'var(--color-accent)' : 'rgba(255,255,255,0.15)',
                                marginTop: '2px',
                                letterSpacing: '0.02em',
                                textAlign: 'center',
                                whiteSpace: 'nowrap'
                            }}>
                                {step.desc}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

ProgressTracker.displayName = 'ProgressTracker';

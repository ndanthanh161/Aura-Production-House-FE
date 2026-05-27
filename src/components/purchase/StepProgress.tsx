import React from 'react';
import { CheckCircle2, type LucideIcon } from 'lucide-react';

interface Step {
    label: string;
    icon: LucideIcon;
}

interface StepProgressProps {
    step: number;
    steps: Step[];
}

export const StepProgress: React.FC<StepProgressProps> = React.memo(({ step, steps }) => {
    return (
        <div className="purchase-steps" style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '3rem' }}>
            {steps.map((s, i) => {
                const n = i + 1;
                const active = step === n;
                const done = step > n;
                return (
                    <React.Fragment key={s.label}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: '0 0 auto' }}>
                            <div className="step-circle" style={{
                                width: '38px', height: '38px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                backgroundColor: done ? 'var(--color-accent)' : active ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                                border: `2px solid ${done || active ? 'var(--color-accent)' : 'var(--color-border)'}`,
                                transition: 'all 0.3s ease',
                                color: done || active ? 'var(--color-bg)' : 'var(--color-text-muted)',
                                fontSize: '0.8rem', fontWeight: 700
                            }}>
                                {done ? <CheckCircle2 size={18} /> : n}
                            </div>
                            <span style={{ fontSize: '0.7rem', color: active ? 'var(--color-text)' : 'var(--color-text-muted)', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>
                                {s.label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div style={{ flex: 1, height: '2px', backgroundColor: step > n ? 'var(--color-accent)' : 'var(--color-border)', margin: '0 8px', marginBottom: '22px', transition: 'background-color 0.3s ease' }} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
});

StepProgress.displayName = 'StepProgress';

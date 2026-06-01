import React from 'react';
import type { Package } from '../../types/package.types';
import { getFocalLength } from './helpers';

interface LensControlDialProps {
    packages: Package[];
    activeIdx: number;
    setActiveIdx: (idx: number) => void;
}

export const LensControlDial: React.FC<LensControlDialProps> = React.memo(({ packages, activeIdx, setActiveIdx }) => {
    return (
        <div style={{
            margin: '0 auto 2.25rem',
            width: '100%',
            maxWidth: '900px',
            backgroundColor: 'rgba(10,10,10,0.85)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            padding: '0.75rem 0',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
            overflow: 'hidden'
        }}>
            {/* Perforations border to look like cinema reels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', opacity: 0.15, marginBottom: '0.5rem', pointerEvents: 'none', padding: '0 2rem' }}>
                {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} style={{ width: '8px', height: '5px', backgroundColor: '#FFFFFF', borderRadius: '1px' }} />
                ))}
            </div>

            <span style={{
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                fontWeight: 800,
                marginBottom: '0.25rem',
                padding: '0 2rem'
            }}>
                LENS FOCUS BARREL DIAL (CLICK OR DRAG SELECT)
            </span>

            {/* The Sliding Track Viewport */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center'
            }}>
                {/* Cylinder barrel fade effect overlays */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: '180px',
                    background: 'linear-gradient(to right, rgba(10,10,10,0.95), transparent)',
                    zIndex: 3,
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    width: '180px',
                    background: 'linear-gradient(to left, rgba(10,10,10,0.95), transparent)',
                    zIndex: 3,
                    pointerEvents: 'none'
                }} />

                {/* Static horizontal guide scale line across the sliding track viewport */}
                <div style={{ position: 'absolute', bottom: '16px', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', zIndex: 1, pointerEvents: 'none' }} />

                {/* The Fixed Center Indicator Needle pointing upwards */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '2px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pointerEvents: 'none'
                    }}
                >
                    {/* Gold vertical needle line */}
                    <div
                        style={{
                            width: '2px',
                            height: '18px',
                            backgroundColor: '#C09A5A',
                            boxShadow: '0 0 8px #C09A5A',
                            marginBottom: '1px'
                        }}
                    />
                    {/* Small gold upward arrow */}
                    <div
                        style={{
                            width: 0,
                            height: 0,
                            borderLeft: '4px solid transparent',
                            borderRight: '4px solid transparent',
                            borderBottom: '6px solid #C09A5A',
                            filter: 'drop-shadow(0 0 3px #C09A5A)'
                        }}
                    />
                </div>

                {/* The Sliding Track containing the packages */}
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        display: 'flex',
                        transform: `translateX(-${(activeIdx * 240) + 120}px)`,
                        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                        width: 'fit-content',
                        height: '100%',
                        alignItems: 'center'
                    }}
                >
                    {packages.map((pkg, idx) => {
                        const isSelected = idx === activeIdx;
                        return (
                             <div
                                key={pkg.id}
                                onClick={() => setActiveIdx(idx)}
                                style={{
                                    width: '240px',
                                    flexShrink: 0,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    height: '100%',
                                    opacity: isSelected ? 1 : 0.65,
                                    transform: isSelected ? 'scale(1.06)' : 'scale(0.9)',
                                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}
                            >
                                {/* Viewfinder focus locked frame surrounding selected item */}
                                {isSelected && (
                                    <div style={{ position: 'absolute', inset: '4px 15px', pointerEvents: 'none' }}>
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '6px', borderTop: '2px solid #C09A5A', borderLeft: '2px solid #C09A5A' }} />
                                        <div style={{ position: 'absolute', top: 0, right: 0, width: '6px', height: '6px', borderTop: '2px solid #C09A5A', borderRight: '2px solid #C09A5A' }} />
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '6px', height: '6px', borderBottom: '2px solid #C09A5A', borderLeft: '2px solid #C09A5A' }} />
                                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '6px', height: '6px', borderBottom: '2px solid #C09A5A', borderRight: '2px solid #C09A5A' }} />
                                    </div>
                                )}

                                <span style={{
                                    fontSize: '0.9rem',
                                    fontFamily: 'monospace',
                                    color: isSelected ? '#C09A5A' : 'rgba(255,255,255,0.5)',
                                    letterSpacing: '0.15em',
                                    marginBottom: '0.2rem',
                                    fontWeight: 700
                                }}>
                                    {getFocalLength(idx).toUpperCase()}
                                </span>

                                <span style={{
                                    fontSize: '1rem',
                                    fontFamily: 'var(--font-display)',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.75)',
                                    transition: 'color 0.4s ease',
                                    textAlign: 'center'
                                }}>
                                    {pkg.name}
                                </span>

                                {pkg.isPopular && (
                                    <span style={{
                                        marginTop: '0.3rem',
                                        fontSize: '0.8rem',
                                        color: '#C09A5A',
                                        letterSpacing: '0.08em',
                                        border: '1px solid rgba(192, 154, 90, 0.3)',
                                        backgroundColor: 'rgba(192, 154, 90, 0.08)',
                                        padding: '1px 5px',
                                        fontWeight: 800
                                    }}>
                                        POPULAR
                                    </span>
                                )}

                                {/* The Scale Ticks inside item */}
                                <div style={{ display: 'flex', gap: '6px', marginTop: '0.3rem', alignItems: 'flex-end', height: '12px' }}>
                                    <div style={{ width: '1px', height: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                                    <div style={{ width: '1px', height: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                                    <div style={{ width: '1px', height: '12px', backgroundColor: isSelected ? '#C09A5A' : 'rgba(255,255,255,0.4)', transition: 'background-color 0.4s' }} />
                                    <div style={{ width: '1px', height: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                                    <div style={{ width: '1px', height: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom cinematic filmstrip border */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', opacity: 0.15, marginTop: '1rem', pointerEvents: 'none', padding: '0 2rem' }}>
                {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} style={{ width: '8px', height: '5px', backgroundColor: '#FFFFFF', borderRadius: '1px' }} />
                ))}
            </div>
        </div>
    );
});
LensControlDial.displayName = 'LensControlDial';

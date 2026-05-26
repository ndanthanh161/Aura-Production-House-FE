import React, { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';

export const CustomCursor: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Mouse coordinates using Framer Motion motion values
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    useEffect(() => {
        // Detect if mobile/touch device to prevent rendering custom cursor
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeaveWindow = () => {
            setIsVisible(false);
        };

        const handleMouseEnterWindow = () => {
            setIsVisible(true);
        };

        // Add event listeners
        window.addEventListener('mousemove', moveCursor);
        document.addEventListener('mouseleave', handleMouseLeaveWindow);
        document.addEventListener('mouseenter', handleMouseEnterWindow);

        // Track hover state on interactive items
        const addHoverEvents = () => {
            const targets = document.querySelectorAll(
                'a, button, [role="button"], input, select, textarea, .pkg-card, .project-card-editorial, .carousel-horizon-cards-container div, .accordion-strip'
            );
            targets.forEach((el) => {
                el.addEventListener('mouseenter', () => setIsHovered(true));
                el.addEventListener('mouseleave', () => setIsHovered(false));
            });
        };

        // Initialize and setup mutation observer to track dynamic items
        addHoverEvents();
        const observer = new MutationObserver(addHoverEvents);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseleave', handleMouseLeaveWindow);
            document.removeEventListener('mouseenter', handleMouseEnterWindow);
            observer.disconnect();
        };
    }, [cursorX, cursorY, isVisible]);

    if (!isVisible) return null;

    return (
        <>
            {/* Inner Dot (Direct Position) */}
            <motion.div
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    width: isHovered ? 6 : 4,
                    height: isHovered ? 6 : 4,
                    borderRadius: '50%',
                    backgroundColor: '#C09A5A',
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    pointerEvents: 'none',
                    zIndex: 9999,
                }}
            />
        </>
    );
};

export default CustomCursor;

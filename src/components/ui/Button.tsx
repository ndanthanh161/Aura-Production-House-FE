import { motion, type HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    children,
    style,
    className,
    ...props
}) => {
    const baseStyles: any = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 500,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        fontSize: size === 'sm' ? '0.75rem' : size === 'lg' ? '1rem' : '0.875rem',
        padding: size === 'sm' ? '0.5rem 1rem' : size === 'lg' ? '1.25rem 2.5rem' : '0.875rem 1.75rem',
        transition: 'var(--transition-smooth)',
        position: 'relative',
        overflow: 'hidden',
        ...style
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-bg)',
            border: '1px solid var(--color-accent)',
        },
        secondary: {
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
        },
        outline: {
            backgroundColor: 'transparent',
            color: 'var(--color-text)',
            border: '1px solid var(--color-text)',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--color-text)',
            border: '1px solid transparent',
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ ...baseStyles, ...variants[variant] }}
            className={`btn-${variant} ${className || ''}`}
            {...props}
        >
            <span style={{ position: 'relative', zIndex: 1 }}>{children as React.ReactNode}</span>
            <style>{`
        .btn-primary:hover {
          background-color: var(--color-accent-hover);
          border-color: var(--color-accent-hover);
          box-shadow: 0 0 20px rgba(197, 160, 89, 0.3);
        }
        .btn-outline:hover {
          background-color: var(--color-text);
          color: var(--color-bg);
        }
      `}</style>
        </motion.button>
    );
};

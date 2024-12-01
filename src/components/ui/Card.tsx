import { HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'glass';
}

export default function Card({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}: CardProps) {
  const baseStyles = 'rounded-xl p-6 relative overflow-hidden';
  
  const variantStyles = {
    default: 'bg-[var(--card-bg)] border border-white/10',
    glass: 'glass-card backdrop-blur-sm'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {variant === 'glass' && (
        <>
          <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-5" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] opacity-10" />
        </>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
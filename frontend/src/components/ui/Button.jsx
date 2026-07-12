import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-primary text-surface hover:bg-primary-hover',
    secondary: 'bg-surface-secondary text-text-primary hover:bg-border-subtle',
    outline: 'border border-border-strong text-text-primary hover:bg-surface-secondary',
    danger: 'bg-danger text-surface hover:bg-danger/90',
    ghost: 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
    icon: 'h-10 w-10',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

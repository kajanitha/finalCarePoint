import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

const variantClasses = {
  default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  ghost: 'bg-transparent hover:bg-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
};

const sizeClasses = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-md',
  lg: 'px-6 py-3 text-lg',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const classes = `${variantClasses[variant]} ${sizeClasses[size]} rounded transition duration-300 ease-in-out ${className}`;
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`
        bg-card border border-border rounded-lg p-4
        shadow-sm
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', icon, headerAction }) => {
  return (
    <div className={`glass-card p-6 overflow-hidden transition-all duration-300 hover:shadow-cyan-950/20 hover:border-white/15 ${className}`}>
      {(title || icon || headerAction) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            {icon && <span className="text-cyan-400">{icon}</span>}
            {title && <h3 className="font-semibold text-lg text-white">{title}</h3>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

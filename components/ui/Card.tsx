import React from 'react';

type CardVariant = 'default' | 'bordered' | 'raised' | 'inset';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white border border-primary-200',
  bordered: 'bg-white border border-primary-300',
  raised: 'bg-white border border-primary-200 shadow-card hover:shadow-card-hover transition-shadow duration-200',
  inset: 'bg-primary-50 border border-primary-100',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ variant = 'default', padding = 'md', className = '', children, ...props }: CardProps) {
  return (
    <div className={`rounded-xl ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action, className = '' }: CardHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
      <div>
        <h3 className="font-sans font-semibold text-primary-900 text-base">{title}</h3>
        {subtitle && (
          <p className="text-sm text-primary-500 font-sans mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className = '', children, ...props }: CardFooterProps) {
  return (
    <div className={`flex items-center justify-end gap-3 mt-4 pt-4 border-t border-primary-100 ${className}`} {...props}>
      {children}
    </div>
  );
}

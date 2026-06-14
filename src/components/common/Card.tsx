import { type ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

const Card = ({ children, className, padding = true }: CardProps) => {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 shadow-sm', padding && 'p-6', className)}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

const CardHeader = ({ title, description, actions }: CardHeaderProps) => {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
      <div className="min-w-0">
        <h3 className="text-base font-semibold text-slate-900 truncate">{title}</h3>
        {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
      </div>
      {actions && <div className="flex-shrink-0">{actions}</div>}
    </div>
  );
};

export { Card, CardHeader };
export default Card;

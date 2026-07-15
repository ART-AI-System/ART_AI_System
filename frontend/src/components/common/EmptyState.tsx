import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  minHeight?: string;
  onClick?: () => void;
}

export const EmptyState = ({ 
  icon, 
  title, 
  description,
  action, 
  className = '', 
  minHeight = 'min-h-[300px]',
  onClick 
}: EmptyStateProps) => {
  return (
    <div 
      className={`bg-transparent rounded-[24px] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-[#4318FF] hover:border-[#4318FF] hover:bg-[#4318FF]/5 transition-all ${onClick ? 'cursor-pointer' : ''} ${minHeight} ${className}`}
      onClick={onClick}
    >
      {icon && (
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4 pointer-events-none text-current">
          {icon}
        </div>
      )}
      <p className="font-bold text-[#1B2559]">{title}</p>
      {description && <p className="text-sm font-medium text-gray-500 mt-2 text-center max-w-md">{description}</p>}
      {action && <div className="mt-4 pointer-events-auto">{action}</div>}
    </div>
  );
};

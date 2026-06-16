import type { ReactNode } from 'react';

type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

interface StatusBadgeProps {
  label: ReactNode;
  variant?: StatusVariant;
  className?: string;
}

export const StatusBadge = ({ label, variant = 'default', className = '' }: StatusBadgeProps) => {
  const getStyles = () => {
    switch(variant) {
      case 'success': return 'bg-green-100 text-green-700';
      case 'error': return 'bg-red-100 text-red-700';
      case 'warning': return 'bg-orange-50 text-orange-500';
      case 'info': return 'bg-blue-50 text-[#4318FF] border border-blue-100';
      default: return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center ${getStyles()} ${className}`}>
      {label}
    </span>
  );
};

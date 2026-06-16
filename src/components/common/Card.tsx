import type { ReactNode, CSSProperties } from 'react';
import { cn } from '../../utils/cn';

export interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  noPadding?: boolean;
}

export const Card = ({ children, className = '', style, noPadding = false }: CardProps) => {
  return (
    <div 
      className={cn('bg-white rounded-[24px] shadow-sm border border-gray-100', noPadding ? '' : 'p-6', className)}
      style={style}
    >
      {children}
    </div>
  );
};

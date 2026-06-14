import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; positive?: boolean };
  colorClass?: string;
}

const StatCard = ({ label, value, icon: Icon, trend, colorClass = 'bg-indigo-50 text-indigo-600' }: StatCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', colorClass)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide truncate">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
        {trend && (
          <p className={cn('text-xs mt-1 font-medium', trend.positive ? 'text-emerald-600' : 'text-slate-400')}>
            {trend.value}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;

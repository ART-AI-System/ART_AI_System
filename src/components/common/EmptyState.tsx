import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
}

const EmptyState = ({
  title = 'Module Under Development',
  description = 'This module has not been implemented yet.',
  actionText = 'Coming Soon',
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
        <PackageOpen className="w-8 h-8 text-indigo-400" />
      </div>
      <h2 className="text-xl font-semibold text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-500 max-w-sm mb-6">{description}</p>
      <span className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium border border-indigo-200">
        {actionText}
      </span>
    </div>
  );
};

export default EmptyState;

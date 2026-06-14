import { Bell, LogOut, HelpCircle, GraduationCap, User, BookOpen, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/App';

interface HeaderProps {
  onMenuClick: () => void;
}

const rolePills: Record<string, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  ADMIN: { label: 'Manager', className: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: User },
  LECTURER: { label: 'Lecturer', className: 'bg-blue-50 text-blue-700 border-blue-200', icon: BookOpen },
  SUBJECT_HEAD: { label: 'Head', className: 'bg-amber-50 text-amber-700 border-amber-200', icon: ShieldAlert },
  STUDENT: { label: 'Learner', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: GraduationCap },
};

const Header = ({ onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  // Safe check for session
  if (!user) return null;

  const initialLetter = user.name ? user.name.charAt(0).toUpperCase() : 'U';
  const pillConfig = rolePills[user.role] || { label: user.role, className: 'bg-slate-50 text-slate-700 border-slate-200', icon: User };
  const RoleIcon = pillConfig.icon;

  return (
    <header className="h-[var(--header-height)] flex items-center px-4 lg:px-6 bg-white border-b border-slate-200 flex-shrink-0 gap-4">
      {/* Mobile Sidebar Hamburger Toggle */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Open navigation menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Spacer to right-align actions */}
      <div className="flex-1 min-w-0" />

      {/* Actions & Profiles panel */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Help button */}
        <button
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors hidden sm:inline-flex cursor-pointer"
          aria-label="Help Documentation"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notification badge */}
        <button
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* User identification info */}
        <div className="flex items-center gap-2.5">
          {/* Avatar representation using initial */}
          <div className="w-8.5 h-8.5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm select-none shadow-sm">
            {initialLetter}
          </div>

          <div className="hidden sm:block text-left min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate max-w-[140px] leading-tight">
              {user.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-500 font-medium">
              <span className="truncate">{user.code}</span>
              <span className="text-slate-300">•</span>
              
              {/* Role badge pill */}
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full border text-[9px] font-bold leading-none ${pillConfig.className}`}>
                <RoleIcon className="w-2.5 h-2.5" />
                {pillConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs font-semibold text-slate-600 transition-all cursor-pointer"
          aria-label="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Header;

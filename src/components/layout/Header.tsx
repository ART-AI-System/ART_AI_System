import { Bell, ChevronDown, User, LogOut, Settings, HelpCircle, Shield } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_USER } from '../../config/roles';
import { useRole } from '../../app/App';
import type { Role } from '../../types/role.type';
import { cn } from '../../utils/cn';

interface HeaderProps {
  onMenuClick: () => void;
}

const roleLabels: Record<Role, string> = {
  STUDENT: 'Student',
  LECTURER: 'Lecturer',
  SUBJECT_HEAD: 'Subject Head',
  ADMIN: 'Administrator',
};

const Header = ({ onMenuClick }: HeaderProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Use the reactive role hook
  const { role, changeRole } = useRole();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-[var(--header-height)] flex items-center px-4 lg:px-6 bg-white border-b border-slate-200 flex-shrink-0 gap-4">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        aria-label="Open navigation menu"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Role Switcher for Developer Testing */}
      <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-lg px-2 py-1">
        <Shield className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
        <span className="text-xs font-semibold text-indigo-700 hidden sm:inline">Role Dev Mode:</span>
        <select
          value={role}
          onChange={(e) => {
            const newRole = e.target.value as Role;
            changeRole(newRole);
            // Auto redirect to dashboard when switching role to verify
            navigate('/dashboard');
          }}
          className="bg-transparent border-none text-xs font-bold text-indigo-900 focus:outline-none cursor-pointer pr-1"
          aria-label="Developer Role Switcher"
        >
          <option value="ADMIN">ADMIN</option>
          <option value="LECTURER">LECTURER</option>
          <option value="SUBJECT_HEAD">SUBJECT_HEAD</option>
          <option value="STUDENT">STUDENT</option>
        </select>
      </div>

      {/* Spacer */}
      <div className="flex-1 min-w-0" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Help */}
        <button
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors hidden sm:inline-flex"
          aria-label="Help & Documentation"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className={cn(
              'flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg transition-colors',
              dropdownOpen ? 'bg-slate-100' : 'hover:bg-slate-100',
            )}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="hidden md:block text-left min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate max-w-[120px]">{MOCK_USER.name}</p>
              <p className="text-xs text-slate-400">{roleLabels[role]}</p>
            </div>
            <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', dropdownOpen && 'rotate-180')} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-lg z-30 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-900 truncate">{MOCK_USER.name}</p>
                <p className="text-xs text-slate-500 truncate">{MOCK_USER.email}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  My Profile
                </button>
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Settings
                </button>
              </div>
              <div className="py-1 border-t border-slate-100">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

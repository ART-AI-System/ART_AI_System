import { NavLink, useLocation } from 'react-router-dom';
import { X, ChevronRight, Brain } from 'lucide-react';
import { navigationConfig } from '../../config/navigation';
import { useRole } from '../../app/App';
import { cn } from '../../utils/cn';
import type { NavItem } from '../../types/navigation.type';
import type { Role } from '../../types/role.type';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function hasAccess(allowedRoles: NavItem['allowedRoles'], currentRole: Role): boolean {
  if (allowedRoles === 'ALL') return true;
  return allowedRoles.includes(currentRole);
}

function NavItemLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const location = useLocation();
  const isActive =
    location.pathname === item.path ||
    (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
        isActive
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      )}
    >
      <item.icon
        className={cn(
          'w-4 h-4 flex-shrink-0 transition-colors',
          isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600',
        )}
      />
      <span className="truncate">{item.label}</span>
      {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto flex-shrink-0 opacity-70" />}
    </NavLink>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  // Use reactive role hook
  const { role } = useRole();

  const roleLabels: Record<Role, string> = {
    STUDENT: 'Student',
    LECTURER: 'Lecturer',
    SUBJECT_HEAD: 'Subject Head',
    ADMIN: 'Administrator',
  };

  const visibleGroups = navigationConfig
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasAccess(item.allowedRoles, role)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <span className="font-bold text-slate-900 text-sm tracking-tight">ART-AI System</span>
          <p className="text-[11px] font-semibold text-indigo-600 truncate">{roleLabels[role]}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {visibleGroups.map((group) => (
          <div key={group.groupLabel}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              {group.groupLabel}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.path}>
                  <NavItemLink item={item} onClick={onClose} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-slate-200">
        <p className="text-[10px] text-slate-400 text-center">© 2026 ART-AI System</p>
      </div>
    </div>
  );
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[var(--sidebar-width)] bg-white border-r border-slate-200 flex-shrink-0 h-full">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="relative flex flex-col w-[var(--sidebar-width)] max-w-[85vw] bg-white border-r border-slate-200 h-full z-10">
            <SidebarContent onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;

import { NavLink } from 'react-router-dom';
import { BrainCircuit, LayoutDashboard, BookOpen, FileCheck2, BarChart2, Newspaper, MessageCircle, Settings, LogOut } from 'lucide-react';
import { ROUTES } from '../../config/routes';
import { useAuth } from '../../context/AuthContext';

export const LecturerSidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="w-[280px] min-w-[280px] bg-[#1B2559] flex flex-col h-screen fixed left-0 top-0 shadow-2xl z-20">
      {/* Logo */}
      <NavLink to={ROUTES.DASHBOARD_LECTURER} className="h-24 flex items-center px-8 cursor-pointer border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F26F21] to-[#F79C65] flex items-center justify-center text-white font-bold text-xl mr-3 shadow-lg shadow-orange-500/30">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <span className="text-2xl font-extrabold text-white tracking-tight">ART-AI<span className="text-[#F26F21] text-xs align-top ml-1">LECTURER</span></span>
      </NavLink>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <NavLink
          to={ROUTES.DASHBOARD_LECTURER}
          className={({ isActive }) =>
            `flex items-center gap-4 px-5 py-4 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white font-bold'
                : 'text-blue-200 hover:text-white hover:bg-white/5'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>}
              <LayoutDashboard className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#F26F21]' : 'opacity-70'}`} />
              <span className="font-semibold">Dashboard</span>
            </>
          )}
        </NavLink>

        <NavLink
          to={ROUTES.CLASSES}
          className={({ isActive }) =>
            `flex items-center gap-4 px-5 py-4 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white font-bold'
                : 'text-blue-200 hover:text-white hover:bg-white/5'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>}
              <BookOpen className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#F26F21]' : 'opacity-70'}`} />
              <span className="font-semibold">My Subjects</span>
            </>
          )}
        </NavLink>

        <NavLink
          to={ROUTES.CLASS_GRADING.replace(':classId', 'PRJ301')} // Placeholder for global grading link or route
          className={({ isActive }) =>
            `flex items-center gap-4 px-5 py-4 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white font-bold'
                : 'text-blue-200 hover:text-white hover:bg-white/5'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>}
              <FileCheck2 className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#F26F21]' : 'opacity-70'}`} />
              <span className="font-semibold">Grading</span>
              <span className="ml-auto bg-[#F26F21] text-white text-xs font-bold px-2 py-0.5 rounded-full">12</span>
            </>
          )}
        </NavLink>

        <NavLink
          to={ROUTES.LECTURER_REPORTS}
          className={({ isActive }) =>
            `flex items-center gap-4 px-5 py-4 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white font-bold'
                : 'text-blue-200 hover:text-white hover:bg-white/5'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>}
              <BarChart2 className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#F26F21]' : 'opacity-70'}`} />
              <span className="font-semibold">Reports</span>
            </>
          )}
        </NavLink>

        <NavLink
          to={ROUTES.NEWS}
          className={({ isActive }) =>
            `flex items-center gap-4 px-5 py-4 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white font-bold'
                : 'text-blue-200 hover:text-white hover:bg-white/5'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>}
              <Newspaper className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#F26F21]' : 'opacity-70'}`} />
              <span className="font-semibold">News</span>
            </>
          )}
        </NavLink>

        <div className="pt-8 pb-2">
          <p className="px-4 text-xs font-bold text-blue-400 uppercase tracking-wider">Account</p>
        </div>

        <NavLink
          to={ROUTES.LECTURER_MESSAGES}
          className={({ isActive }) =>
            `flex items-center gap-4 px-5 py-4 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white font-bold'
                : 'text-blue-200 hover:text-white hover:bg-white/5'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>}
              <MessageCircle className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#F26F21]' : 'opacity-70'}`} />
              <span className="font-semibold">Messages</span>
            </>
          )}
        </NavLink>

        <NavLink
          to={ROUTES.LECTURER_SETTINGS}
          className={({ isActive }) =>
            `flex items-center gap-4 px-5 py-4 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white font-bold'
                : 'text-blue-200 hover:text-white hover:bg-white/5'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>}
              <Settings className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#F26F21]' : 'opacity-70'}`} />
              <span className="font-semibold">Settings</span>
            </>
          )}
        </NavLink>
      </nav>

      {/* User Profile */}
      <div className="p-6 border-t border-white/10">
        <div className="flex items-center">
          <img src="https://i.pravatar.cc/150?u=lecturer" alt="User Avatar" className="w-12 h-12 rounded-full border-2 border-[#F26F21] object-cover" />
          <div className="ml-3 flex-1 overflow-hidden">
            <p className="text-sm font-bold text-white truncate">Dr. Nguyen Van A</p>
            <p className="text-xs text-blue-300 truncate">Lecturer</p>
          </div>
          <button onClick={logout} className="p-2 text-blue-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-xl ml-2">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default LecturerSidebar;

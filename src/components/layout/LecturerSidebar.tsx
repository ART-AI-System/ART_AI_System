import { NavLink } from 'react-router-dom';
import { BrainCircuit, LayoutDashboard, BookOpen, FileCheck2, BarChart2, Newspaper, MessageCircle, Settings } from 'lucide-react';
import { ROUTES } from '../../config/routes';

export const LecturerSidebar = () => {
  return (
    <aside className="w-[280px] bg-[#1B2559] flex flex-col h-screen shadow-2xl fixed left-0 top-0 z-20">
      {/* Logo */}
      <NavLink to={ROUTES.DASHBOARD_LECTURER} className="h-24 flex items-center px-8 cursor-pointer border-b border-white/10">
        <div className="w-10 h-10 rounded-xl fpt-orange-gradient flex items-center justify-center text-white font-bold text-xl mr-3 shadow-lg shadow-orange-500/30">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <span className="text-2xl font-extrabold text-white tracking-tight">ART-AI<span className="text-[#F26F21] text-xs align-top ml-1">LECTURER</span></span>
      </NavLink>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto hide-scrollbar">
        <NavLink
          to={ROUTES.DASHBOARD_LECTURER}
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-bold rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white'
                : 'text-blue-200 hover:text-white hover:bg-white/5 font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>}
              <LayoutDashboard className={`w-5 h-5 mr-4 ${isActive ? 'text-[#F26F21]' : 'opacity-70'}`} />
              Dashboard
            </>
          )}
        </NavLink>

        <NavLink
          to={ROUTES.CLASSES}
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-bold rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white'
                : 'text-blue-200 hover:text-white hover:bg-white/5 font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>}
              <BookOpen className={`w-5 h-5 mr-4 ${isActive ? 'text-[#F26F21]' : 'opacity-70'}`} />
              My Subjects
            </>
          )}
        </NavLink>

        <NavLink
          to={ROUTES.GRADING_SUBJECTS}
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-bold rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white'
                : 'text-blue-200 hover:text-white hover:bg-white/5 font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>}
              <FileCheck2 className={`w-5 h-5 mr-4 ${isActive ? 'text-[#F26F21]' : 'opacity-70'}`} />
              Grading
              <span className="ml-auto bg-[#F26F21] text-white text-xs font-bold px-2 py-0.5 rounded-full">12</span>
            </>
          )}
        </NavLink>

        <NavLink
          to={ROUTES.LECTURER_REPORTS}
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-bold rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white'
                : 'text-blue-200 hover:text-white hover:bg-white/5 font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>}
              <BarChart2 className={`w-5 h-5 mr-4 ${isActive ? 'text-[#F26F21]' : 'opacity-70'}`} />
              Reports
            </>
          )}
        </NavLink>

        <NavLink
          to={ROUTES.NEWS}
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-bold rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white'
                : 'text-blue-200 hover:text-white hover:bg-white/5 font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>}
              <Newspaper className={`w-5 h-5 mr-4 ${isActive ? 'text-[#F26F21]' : 'opacity-70'}`} />
              News
            </>
          )}
        </NavLink>

        <div className="pt-8 pb-2">
          <p className="px-4 text-xs font-bold text-blue-400 uppercase tracking-wider">Account</p>
        </div>

        <NavLink
          to={ROUTES.LECTURER_MESSAGES}
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-bold rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white'
                : 'text-blue-200 hover:text-white hover:bg-white/5 font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>}
              <MessageCircle className={`w-5 h-5 mr-4 ${isActive ? 'text-[#F26F21]' : 'opacity-70'}`} />
              Messages
            </>
          )}
        </NavLink>

        <NavLink
          to={ROUTES.LECTURER_SETTINGS}
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-bold rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white'
                : 'text-blue-200 hover:text-white hover:bg-white/5 font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>}
              <Settings className={`w-5 h-5 mr-4 ${isActive ? 'text-[#F26F21]' : 'opacity-70'}`} />
              Settings
            </>
          )}
        </NavLink>
      </nav>
    </aside>
  );
};

export default LecturerSidebar;

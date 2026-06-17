import { NavLink } from 'react-router-dom';
import { BrainCircuit, Home, BookOpen, Calendar, FileCheck2, Award, MessageCircle, Settings } from 'lucide-react';
import { ROUTES } from '../../config/routes';

export const StudentSidebar = () => {
  return (
    <aside className="w-[280px] bg-white fixed h-full z-20 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-gray-100">
      {/* Logo */}
      <div className="h-24 flex items-center px-8 cursor-pointer">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F26F21] to-[#F79C65] flex items-center justify-center text-white mr-3 shadow-lg shadow-orange-200">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <span className="text-2xl font-extrabold text-[#1B2559]">ART-AI</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <NavLink
          to={ROUTES.DASHBOARD_STUDENT}
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-[#F4F7FE] text-[#4318FF] font-bold'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#4318FF] rounded-r-lg"></div>}
              <Home className="w-5 h-5 mr-4" /> Home Dashboard
            </>
          )}
        </NavLink>

        <NavLink
          to={ROUTES.CLASSES}
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-[#F4F7FE] text-[#4318FF] font-bold'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#4318FF] rounded-r-lg"></div>}
              <BookOpen className="w-5 h-5 mr-4" /> My Subjects
            </>
          )}
        </NavLink>

        <NavLink
          to={ROUTES.SCHEDULE}
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-[#F4F7FE] text-[#4318FF] font-bold'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#4318FF] rounded-r-lg"></div>}
              <Calendar className="w-5 h-5 mr-4" /> Schedule
            </>
          )}
        </NavLink>

        <NavLink
          to={ROUTES.MY_SUBMISSIONS}
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-[#F4F7FE] text-[#4318FF] font-bold'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#4318FF] rounded-r-lg"></div>}
              <FileCheck2 className="w-5 h-5 mr-4" /> Assignments
            </>
          )}
        </NavLink>

        <NavLink
          to={ROUTES.MY_RESULTS}
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-[#F4F7FE] text-[#4318FF] font-bold'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#4318FF] rounded-r-lg"></div>}
              <Award className="w-5 h-5 mr-4" /> Gradebook
            </>
          )}
        </NavLink>

        <div className="pt-8 pb-2">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Account</p>
        </div>

        <NavLink
          to={ROUTES.MESSAGES}
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-[#F4F7FE] text-[#4318FF] font-bold'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#4318FF] rounded-r-lg"></div>}
              <MessageCircle className="w-5 h-5 mr-4" /> Messages
            </>
          )}
        </NavLink>

        <NavLink
          to={ROUTES.SETTINGS}
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-[#F4F7FE] text-[#4318FF] font-bold'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#4318FF] rounded-r-lg"></div>}
              <Settings className="w-5 h-5 mr-4" /> Settings
            </>
          )}
        </NavLink>
      </nav>
    </aside>
  );
};

export default StudentSidebar;

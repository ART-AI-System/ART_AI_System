/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BrainCircuit, Home, BookOpen, Calendar, FileCheck2, MessageCircle, Settings, BarChart2, ChevronDown, Newspaper } from 'lucide-react';
import { ROUTES } from '../../config/routes';
import { useAuth } from '../../context/AuthContext';

export const StudentSidebar = () => {
  const { user } = useAuth();
  const isStudent = user?.role === 'STUDENT';
  const settingsRoute = isStudent ? ROUTES.STUDENT_SETTINGS : ROUTES.SETTINGS;
  const messagesRoute = isStudent ? ROUTES.STUDENT_MESSAGES : ROUTES.MESSAGES;
  const homeRoute = user?.role === 'SUBJECT_HEAD' ? ROUTES.DASHBOARD_SUBJECT_HEAD : 
                   user?.role === 'ADMIN' ? ROUTES.DASHBOARD_ADMIN : 
                   ROUTES.DASHBOARD_STUDENT;
  const location = useLocation();
  const reportRoutes = [
    ROUTES.STUDENT_ATTENDANCE,
    ROUTES.MY_RESULTS,
    ROUTES.STUDENT_TRANSCRIPT,
    ROUTES.STUDENT_CURRICULUM,
    ROUTES.STUDENT_TRANSACTIONS,
  ];

  const isReportRouteActive = reportRoutes.includes(location.pathname as any);
  const [isReportsOpen, setIsReportsOpen] = useState(isReportRouteActive);

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
          to={homeRoute}
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

        {/* Reports Dropdown */}
        <div className="relative">
          <button 
            className="w-full flex items-center justify-between px-4 py-3.5 text-gray-500 hover:text-gray-900 font-medium rounded-xl transition-all hover:bg-gray-50"
            onClick={() => setIsReportsOpen(!isReportsOpen)}
          >
            <div className="flex items-center">
              <BarChart2 className={`w-5 h-5 mr-4 ${isReportRouteActive ? 'text-[#4318FF]' : ''}`} /> 
              <span className={isReportRouteActive ? 'text-[#4318FF] font-bold' : ''}>Reports</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isReportsOpen ? 'rotate-180' : ''}`} />
          </button>
          <div className={`${isReportsOpen ? 'flex' : 'hidden'} flex-col pl-12 pr-4 py-1 space-y-1 mt-1 border-l-2 border-gray-100 ml-6`}>
            <NavLink
              to={ROUTES.STUDENT_ATTENDANCE}
              className={({ isActive }) => `block py-2 text-sm font-medium transition-colors relative before:absolute before:-left-[18px] before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-0.5 ${isActive ? 'text-[#4318FF] before:bg-[#4318FF]' : 'text-gray-500 hover:text-[#4318FF] before:bg-gray-200 hover:before:bg-[#4318FF]'}`}
            >
              Attendance
            </NavLink>
            <NavLink
              to={ROUTES.MY_RESULTS}
              className={({ isActive }) => `block py-2 text-sm font-medium transition-colors relative before:absolute before:-left-[18px] before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-0.5 ${isActive ? 'text-[#4318FF] before:bg-[#4318FF]' : 'text-gray-500 hover:text-[#4318FF] before:bg-gray-200 hover:before:bg-[#4318FF]'}`}
            >
              Mark Report
            </NavLink>
            <NavLink
              to={ROUTES.STUDENT_TRANSCRIPT}
              className={({ isActive }) => `block py-2 text-sm font-medium transition-colors relative before:absolute before:-left-[18px] before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-0.5 ${isActive ? 'text-[#4318FF] before:bg-[#4318FF]' : 'text-gray-500 hover:text-[#4318FF] before:bg-gray-200 hover:before:bg-[#4318FF]'}`}
            >
              Academic Transcript
            </NavLink>
            <NavLink
              to={ROUTES.STUDENT_CURRICULUM}
              className={({ isActive }) => `block py-2 text-sm font-medium transition-colors relative before:absolute before:-left-[18px] before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-0.5 ${isActive ? 'text-[#4318FF] before:bg-[#4318FF]' : 'text-gray-500 hover:text-[#4318FF] before:bg-gray-200 hover:before:bg-[#4318FF]'}`}
            >
              Curriculum
            </NavLink>
            <NavLink
              to={ROUTES.STUDENT_TRANSACTIONS}
              className={({ isActive }) => `block py-2 text-sm font-medium transition-colors relative before:absolute before:-left-[18px] before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-0.5 ${isActive ? 'text-[#4318FF] before:bg-[#4318FF]' : 'text-gray-500 hover:text-[#4318FF] before:bg-gray-200 hover:before:bg-[#4318FF]'}`}
            >
              Transaction History
            </NavLink>
          </div>
        </div>

        <NavLink
          to={ROUTES.STUDENT_NEWS}
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
              <Newspaper className="w-5 h-5 mr-4" /> News
            </>
          )}
        </NavLink>

        <div className="pt-8 pb-2">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Account</p>
        </div>

        <NavLink
          to={messagesRoute}
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
          to={settingsRoute}
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

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BrainCircuit, ChevronLeft, ChevronRight, X, Home, BookOpen, Calendar, 
  FileCheck2, BarChart2, ChevronDown, Newspaper, MessageCircle, Settings 
} from 'lucide-react';

interface StudentSidebarProps {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  setSidebarCollapsed: (val: boolean) => void;
  setMobileSidebarOpen: (val: boolean) => void;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({ 
  sidebarCollapsed, 
  mobileSidebarOpen, 
  setSidebarCollapsed, 
  setMobileSidebarOpen 
}) => {
  const [reportsOpen, setReportsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const navItemClass = (path: string) => {
    const isActive = location.pathname.includes(path);
    return `flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${
      isActive 
        ? 'bg-[#F4F7FE] text-[#4318FF] font-bold' 
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
    }`;
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-20 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`bg-white fixed h-full z-30 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-gray-100 transition-all duration-300 ${
          sidebarCollapsed ? 'w-[88px]' : 'w-[280px]'
        } ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo Area */}
        <div className="h-24 flex items-center px-4 lg:px-6 relative overflow-hidden shrink-0">
          <button 
            onClick={toggleSidebar}
            className="group relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#F26F21] to-[#F79C65] flex items-center justify-center text-white mr-3 shrink-0 shadow-lg shadow-orange-200 overflow-hidden z-20 outline-none hidden lg:flex"
          >
            <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 group-hover:rotate-180 group-hover:opacity-0">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 -rotate-180 opacity-0 group-hover:rotate-0 group-hover:opacity-100">
              {sidebarCollapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
            </div>
          </button>
          
          <Link to="/student" className={`text-2xl font-extrabold text-[#1B2559] whitespace-nowrap z-10 hover:text-[#4318FF] ${sidebarCollapsed ? 'hidden' : 'block'}`}>
            ART-AI
          </Link>
          
          {/* Mobile Close Button */}
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden absolute right-4 text-gray-400 hover:text-gray-600 z-20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <Link to="/student/home" className={navItemClass('/student/home')}>
            {location.pathname.includes('/student/home') && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#4318FF] rounded-r-lg"></div>}
            <Home className="w-5 h-5 mr-4 shrink-0" />
            {!sidebarCollapsed && <span className="whitespace-nowrap">Home Dashboard</span>}
          </Link>
          <Link to="/student/subjects" className={navItemClass('/student/subjects')}>
            {location.pathname.includes('/student/subjects') && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#4318FF] rounded-r-lg"></div>}
            <BookOpen className="w-5 h-5 mr-4 shrink-0" />
            {!sidebarCollapsed && <span className="whitespace-nowrap">My Subjects</span>}
          </Link>
          <Link to="/student/schedule" className={navItemClass('/student/schedule')}>
            {location.pathname.includes('/student/schedule') && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#4318FF] rounded-r-lg"></div>}
            <Calendar className="w-5 h-5 mr-4 shrink-0" />
            {!sidebarCollapsed && <span className="whitespace-nowrap">Schedule</span>}
          </Link>
          <Link to="/student/assignments" className={navItemClass('/student/assignments')}>
            {location.pathname.includes('/student/assignments') && <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#4318FF] rounded-r-lg"></div>}
            <FileCheck2 className="w-5 h-5 mr-4 shrink-0" />
            {!sidebarCollapsed && <span className="whitespace-nowrap">Assignments</span>}
          </Link>

          {/* Reports Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setReportsOpen(!reportsOpen)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-gray-500 hover:text-gray-900 font-medium rounded-xl transition-all hover:bg-gray-50"
            >
              <div className="flex items-center">
                <BarChart2 className="w-5 h-5 mr-4 shrink-0" /> 
                {!sidebarCollapsed && <span className="whitespace-nowrap">Reports</span>}
              </div>
              {!sidebarCollapsed && (
                <ChevronDown className={`w-4 h-4 transition-transform ${reportsOpen ? 'rotate-180' : ''}`} />
              )}
            </button>
            {reportsOpen && !sidebarCollapsed && (
              <div className="flex flex-col pl-12 pr-4 py-1 space-y-1 mt-1 border-l-2 border-gray-100 ml-6">
                <Link to="/student/attendance" className="block py-2 text-sm text-gray-500 hover:text-[#4318FF] font-medium transition-colors relative before:absolute before:-left-[18px] before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-0.5 before:bg-gray-200 hover:before:bg-[#4318FF]">Attendance</Link>
                <Link to="/student/grades" className="block py-2 text-sm text-gray-500 hover:text-[#4318FF] font-medium transition-colors relative before:absolute before:-left-[18px] before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-0.5 before:bg-gray-200 hover:before:bg-[#4318FF]">Mark Report</Link>
              </div>
            )}
          </div>

          <Link to="/student/news" className={navItemClass('/student/news')}>
            <Newspaper className="w-5 h-5 mr-4 shrink-0" />
            {!sidebarCollapsed && <span className="whitespace-nowrap">News</span>}
          </Link>

          <div className="pt-8 pb-2 relative flex items-center px-4">
            {!sidebarCollapsed ? (
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider w-full">Account</p>
            ) : (
              <div className="w-5 h-[2px] bg-gray-300 rounded-full"></div>
            )}
          </div>

          <Link to="/student/chat" className={navItemClass('/student/chat')}>
            <MessageCircle className="w-5 h-5 mr-4 shrink-0" />
            {!sidebarCollapsed && <span className="whitespace-nowrap">Messages</span>}
          </Link>
          <Link to="/student/settings" className={navItemClass('/student/settings')}>
            <Settings className="w-5 h-5 mr-4 shrink-0" />
            {!sidebarCollapsed && <span className="whitespace-nowrap">Settings</span>}
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default StudentSidebar;

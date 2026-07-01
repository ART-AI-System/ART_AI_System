import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BrainCircuit, LayoutDashboard, BookOpen, FileCheck2, BarChart2, 
  Newspaper, MessageCircle, Settings, X 
} from 'lucide-react';

interface LecturerSidebarProps {
  sidebarCollapsed?: boolean;
  mobileSidebarOpen?: boolean;
  setMobileSidebarOpen?: (val: boolean) => void;
}

const LecturerSidebar: React.FC<LecturerSidebarProps> = ({ 
  sidebarCollapsed = false, 
  mobileSidebarOpen = false, 
  setMobileSidebarOpen = () => {} 
}) => {
  const location = useLocation();

  const navItemClass = (path: string) => {
    const isActive = location.pathname.includes(path);
    return `flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${
      isActive 
        ? 'bg-white/10 text-white font-bold' 
        : 'text-blue-200 hover:text-white hover:bg-white/5'
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
        className={`bg-[#1B2559] fixed h-full z-30 flex flex-col shadow-2xl transition-all duration-300 ${
          sidebarCollapsed ? 'w-[88px]' : 'w-[280px]'
        } ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="h-24 flex items-center px-8 border-b border-white/10 shrink-0 relative overflow-hidden">
          <Link to="/lecturer" className="flex items-center w-full">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F26F21] to-[#F79C65] flex items-center justify-center text-white font-bold text-xl mr-3 shadow-lg shadow-orange-500/30 shrink-0">
              <BrainCircuit className="w-6 h-6" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-2xl font-extrabold text-white tracking-tight whitespace-nowrap">
                ART-AI<span className="text-[#F26F21] text-xs align-top ml-1">LECTURER</span>
              </span>
            )}
          </Link>
          
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden absolute right-4 text-blue-200 hover:text-white z-20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <Link to="/lecturer/dashboard" className={navItemClass('/lecturer/dashboard')}>
            {location.pathname.includes('/lecturer/dashboard') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>}
            <LayoutDashboard className={`w-5 h-5 mr-4 ${location.pathname.includes('/lecturer/dashboard') ? 'text-[#F26F21]' : 'opacity-70'} shrink-0`} />
            {!sidebarCollapsed && <span className="whitespace-nowrap">Dashboard</span>}
          </Link>
          
          <Link to="/lecturer/subjects" className={navItemClass('/lecturer/subjects')}>
            {location.pathname.includes('/lecturer/subjects') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>}
            <BookOpen className={`w-5 h-5 mr-4 ${location.pathname.includes('/lecturer/subjects') ? 'text-[#F26F21]' : 'opacity-70'} shrink-0`} />
            {!sidebarCollapsed && <span className="whitespace-nowrap">My Subjects</span>}
          </Link>

          <Link to="/lecturer/grading" className={navItemClass('/lecturer/grading')}>
            {location.pathname.includes('/lecturer/grading') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>}
            <FileCheck2 className={`w-5 h-5 mr-4 ${location.pathname.includes('/lecturer/grading') ? 'text-[#F26F21]' : 'opacity-70'} shrink-0`} />
            {!sidebarCollapsed && <span className="whitespace-nowrap">Grading</span>}
            {!sidebarCollapsed && <span className="ml-auto bg-[#F26F21] text-white text-xs font-bold px-2 py-0.5 rounded-full">12</span>}
          </Link>

          <Link to="/lecturer/reports" className={navItemClass('/lecturer/reports')}>
            {location.pathname.includes('/lecturer/reports') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>}
            <BarChart2 className={`w-5 h-5 mr-4 ${location.pathname.includes('/lecturer/reports') ? 'text-[#F26F21]' : 'opacity-70'} shrink-0`} />
            {!sidebarCollapsed && <span className="whitespace-nowrap">Reports</span>}
          </Link>

          <Link to="/lecturer/news" className={navItemClass('/lecturer/news')}>
            {location.pathname.includes('/lecturer/news') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>}
            <Newspaper className={`w-5 h-5 mr-4 ${location.pathname.includes('/lecturer/news') ? 'text-[#F26F21]' : 'opacity-70'} shrink-0`} />
            {!sidebarCollapsed && <span className="whitespace-nowrap">News</span>}
          </Link>

          <div className="pt-8 pb-2 relative flex items-center px-4">
            {!sidebarCollapsed ? (
              <p className="text-xs font-bold text-blue-400 uppercase tracking-wider w-full">Account</p>
            ) : (
              <div className="w-5 h-[2px] bg-white/20 rounded-full"></div>
            )}
          </div>
          
          <Link to="/lecturer/messages" className={navItemClass('/lecturer/messages')}>
            {location.pathname.includes('/lecturer/messages') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>}
            <MessageCircle className={`w-5 h-5 mr-4 ${location.pathname.includes('/lecturer/messages') ? 'text-[#F26F21]' : 'opacity-70'} shrink-0`} />
            {!sidebarCollapsed && <span className="whitespace-nowrap">Messages</span>}
          </Link>

          <Link to="/lecturer/settings" className={navItemClass('/lecturer/settings')}>
            {location.pathname.includes('/lecturer/settings') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F26F21] rounded-r-full"></div>}
            <Settings className={`w-5 h-5 mr-4 ${location.pathname.includes('/lecturer/settings') ? 'text-[#F26F21]' : 'opacity-70'} shrink-0`} />
            {!sidebarCollapsed && <span className="whitespace-nowrap">Settings</span>}
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default LecturerSidebar;

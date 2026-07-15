import { Bell, ChevronDown, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { NotificationDropdown } from '../common/NotificationDropdown';

export const LecturerHeader = () => {
  const location = useLocation();
  
  let title: string;
  let description: string;
  let showSearch = false;

  if (location.pathname === ROUTES.DASHBOARD_LECTURER) {
    title = 'Lecturer Dashboard';
    description = 'Overview of your classes and pending evaluations';
  } else if (location.pathname === ROUTES.CLASSES) {
    title = 'My Subjects';
    description = 'Manage your enrolled subjects and classes';
    showSearch = true;
  } else if (location.pathname === ROUTES.GRADING_SUBJECTS) {
    title = 'Grading';
    description = 'Manage your enrolled subjects and classes';
    showSearch = true;
  } else if (location.pathname === ROUTES.NEWS) {
    title = 'News & Announcements';
    description = 'Stay updated with the latest faculty news';
    showSearch = true;
  } else {
    // Hide default header for all other Lecturer pages (they use custom edge-to-edge headers)
    return null;
  }

  return (
    <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-10 shrink-0">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1B2559]">{title}</h1>
        {description && <p className="text-sm font-medium text-gray-500 mt-1">{description}</p>}
      </div>
      
      <div className="flex items-center space-x-6">
        {/* Search */}
        {showSearch && (
          <div className="flex items-center bg-gray-50 rounded-full px-5 py-2.5 border border-gray-200 w-64 hidden md:flex">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none ml-3 w-full text-sm font-medium text-gray-700 placeholder-gray-400" 
            />
          </div>
        )}

        {/* Semester Selector */}
        <div className="relative">
          <select className="appearance-none bg-gray-50 border border-gray-200 text-[#1B2559] text-sm font-bold rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#F26F21]/20 focus:border-[#F26F21] transition-all cursor-pointer">
            <option value="SP2026">Spring 2026</option>
            <option value="FA2025">Fall 2025</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <NotificationDropdown />

        <div className="flex items-center pl-6 border-l border-gray-200 gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-[#1B2559]">Dr. Nguyen Van A</p>
            <p className="text-xs font-medium text-gray-500">Lecturer</p>
          </div>
          <img src="https://ui-avatars.com/api/?name=Lecturer&background=f97316&color=fff" className="w-10 h-10 rounded-full shadow-md cursor-pointer border-2 border-white" alt="Avatar" />
        </div>
      </div>
    </header>
  );
};

export default LecturerHeader;

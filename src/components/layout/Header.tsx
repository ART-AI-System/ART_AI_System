import { Search, CalendarDays, ChevronDown, MessageSquare, Bell } from 'lucide-react';
import { useAuth } from '../../app/App';

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="h-24 bg-[#F4F7FE] flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
      {/* Search & Semester */}
      <div className="flex items-center space-x-6 w-full max-w-2xl">
        {/* Search */}
        <div className="flex items-center flex-1 bg-white rounded-full px-5 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search subjects, assignments..."
            className="bg-transparent border-none outline-none ml-3 w-full text-sm font-medium text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Global Semester Selector */}
        <div className="flex items-center bg-white rounded-full px-5 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)] relative">
          <CalendarDays className="w-5 h-5 text-[#4318FF] mr-3" />
          <select className="bg-transparent text-sm font-bold text-[#1B2559] outline-none cursor-pointer pr-8 appearance-none">
            <option value="Summer 2026">Summer 2026</option>
            <option value="Spring 2026">Spring 2026</option>
            <option value="Fall 2025">Fall 2025</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 pointer-events-none absolute right-4" />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <button className="relative p-2 text-gray-400 hover:text-[#4318FF] transition-colors">
            <MessageSquare className="w-6 h-6" />
          </button>
          <button className="relative p-2 text-gray-400 hover:text-orange-500 transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#F4F7FE]"></span>
          </button>
        </div>
        <div className="flex items-center pl-4 border-l border-gray-300 gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-[#1B2559]">{user?.name || 'User'}</p>
            <p className="text-xs font-medium text-gray-500 capitalize">{user?.role?.toLowerCase().replace('_', ' ') || 'Guest'}</p>
          </div>
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=F26F21&color=fff`}
            alt="Avatar"
            className="w-10 h-10 rounded-full shadow-md cursor-pointer"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;

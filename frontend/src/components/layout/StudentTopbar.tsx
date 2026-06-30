import React, { useState } from 'react';
import { Menu, Search, CalendarDays, ChevronDown, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StudentTopbarProps {
  setMobileSidebarOpen: (val: boolean) => void;
}

const StudentTopbar: React.FC<StudentTopbarProps> = ({ setMobileSidebarOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="h-24 bg-[#F4F7FE] flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
      <div className="flex items-center space-x-4 w-full max-w-2xl">
        <button 
          onClick={() => setMobileSidebarOpen(true)}
          className="mr-4 p-2 text-gray-500 hover:text-[#4318FF] transition-colors rounded-lg hover:bg-white lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden md:flex items-center flex-1 bg-white rounded-full px-5 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <Search className="w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none ml-3 w-full text-sm font-medium text-gray-700 placeholder-gray-400" />
        </div>
        
        <div className="flex items-center bg-white rounded-full px-5 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <CalendarDays className="w-5 h-5 text-[#4318FF] mr-3" />
          <select className="bg-transparent text-sm font-bold text-[#1B2559] outline-none cursor-pointer pr-4 appearance-none">
            <option>Summer 2026</option>
            <option>Spring 2026</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 pointer-events-none -ml-2" />
        </div>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-6">
        <div className="flex items-center space-x-3">
          <button className="relative p-2 text-gray-400 hover:text-orange-500 transition-colors block">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#F4F7FE]"></span>
          </button>
        </div>
        <div className="flex items-center pl-4 border-l border-gray-300 gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-[#1B2559]">Nguyen Van Duc</p>
            <p className="text-xs font-medium text-gray-500">Student</p>
          </div>
          <div className="relative">
            <img 
              src="https://ui-avatars.com/api/?name=Nguyen+Van+Duc&background=F26F21&color=fff" 
              className="w-10 h-10 rounded-full shadow-md cursor-pointer hover:ring-2 hover:ring-[#4318FF] transition-all" 
              alt="Avatar" 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            />
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-50 mb-1 sm:hidden">
                  <p className="text-sm font-bold text-[#1B2559]">Nguyen Van Duc</p>
                  <p className="text-xs font-medium text-gray-500">Student</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentTopbar;

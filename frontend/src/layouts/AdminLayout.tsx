import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  BrainCircuit, LayoutDashboard, GraduationCap, Briefcase, 
  CalendarDays, Library, BookOpen, MessageCircle, 
  ClipboardList, Settings, LogOut, Search, Bell, ChevronDown 
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route: string) => path.includes(route);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F7FE] font-inter">
      {/* ADMIN SIDEBAR (DARK THEME) */}
      <aside className="w-[280px] bg-[#064E3B] flex flex-col h-full shadow-2xl relative z-20 shrink-0">
        {/* Logo */}
        <Link to="/admin/dashboard" className="h-24 flex items-center px-8 cursor-pointer border-b border-white/10 shrink-0 hover:bg-white/5 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16A34A] to-[#4ADE80] flex items-center justify-center text-white font-bold text-xl mr-3 shadow-lg shadow-green-500/30">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight">
            ART-AI<span className="text-[#4ADE80] text-[10px] align-top ml-1">ADMIN</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <Link 
            to="/admin/dashboard" 
            className={`flex items-center px-4 py-3.5 font-bold rounded-xl transition-all relative ${isActive('dashboard') ? 'bg-white/10 text-white' : 'text-green-100 hover:text-white hover:bg-white/5'}`}
          >
            {isActive('dashboard') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#4ADE80] rounded-r-full"></div>}
            <LayoutDashboard className={`w-5 h-5 mr-4 ${isActive('dashboard') ? 'text-[#4ADE80]' : 'opacity-70'}`} />
            Dashboard
          </Link>
          
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-bold text-green-300 uppercase tracking-wider">Users</p>
          </div>

          <Link to="/admin/students" className={`flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${isActive('students') ? 'bg-white/10 text-white' : 'text-green-100 hover:text-white hover:bg-white/5'}`}>
            {isActive('students') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#4ADE80] rounded-r-full"></div>}
            <GraduationCap className={`w-5 h-5 mr-4 ${isActive('students') ? 'text-[#4ADE80]' : 'opacity-70'}`} />
            Students
          </Link>

          {/* Employees Dropdown - Simplified for React Router for now */}
          <Link to="/admin/teachers" className={`flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${isActive('teachers') ? 'bg-white/10 text-white' : 'text-green-100 hover:text-white hover:bg-white/5'}`}>
            {isActive('teachers') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#4ADE80] rounded-r-full"></div>}
            <Briefcase className={`w-5 h-5 mr-4 ${isActive('teachers') ? 'text-[#4ADE80]' : 'opacity-70'}`} />
            Lecturers
          </Link>

          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-bold text-green-300 uppercase tracking-wider">Academic</p>
          </div>

          <Link to="/admin/semesters" className={`flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${isActive('semesters') ? 'bg-white/10 text-white' : 'text-green-100 hover:text-white hover:bg-white/5'}`}>
            {isActive('semesters') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#4ADE80] rounded-r-full"></div>}
            <CalendarDays className={`w-5 h-5 mr-4 ${isActive('semesters') ? 'text-[#4ADE80]' : 'opacity-70'}`} />
            Semesters
          </Link>

          <Link to="/admin/subjects" className={`flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${isActive('subjects') ? 'bg-white/10 text-white' : 'text-green-100 hover:text-white hover:bg-white/5'}`}>
            {isActive('subjects') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#4ADE80] rounded-r-full"></div>}
            <Library className={`w-5 h-5 mr-4 ${isActive('subjects') ? 'text-[#4ADE80]' : 'opacity-70'}`} />
            Subjects
          </Link>

          <Link to="/admin/classes" className={`flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${isActive('classes') ? 'bg-white/10 text-white' : 'text-green-100 hover:text-white hover:bg-white/5'}`}>
            {isActive('classes') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#4ADE80] rounded-r-full"></div>}
            <BookOpen className={`w-5 h-5 mr-4 ${isActive('classes') ? 'text-[#4ADE80]' : 'opacity-70'}`} />
            Classes
          </Link>
          
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-bold text-green-300 uppercase tracking-wider">System</p>
          </div>

          <Link to="/admin/settings" className={`flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${isActive('settings') ? 'bg-white/10 text-white' : 'text-green-100 hover:text-white hover:bg-white/5'}`}>
            {isActive('settings') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#4ADE80] rounded-r-full"></div>}
            <Settings className={`w-5 h-5 mr-4 ${isActive('settings') ? 'text-[#4ADE80]' : 'opacity-70'}`} />
            Settings
          </Link>
        </nav>
        
        {/* Logout Section */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <Link to="/login" className="flex items-center px-4 py-3.5 text-red-300 hover:text-white hover:bg-red-500/20 font-medium rounded-xl transition-all group">
            <LogOut className="w-5 h-5 mr-4 opacity-90 group-hover:opacity-100" />
            Log Out
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* TOP HEADER */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-10 shrink-0">
          <div>
            <h1 className="text-2xl font-extrabold text-[#064E3B] capitalize">
              {path.split('/')[2] || 'Dashboard'}
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-1">
              Admin / {path.split('/')[2] ? path.split('/')[2].charAt(0).toUpperCase() + path.split('/')[2].slice(1) : 'Dashboard'}
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="What do you want to find?" 
                className="bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 pl-12 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm w-64 text-[#064E3B] font-medium placeholder-gray-400"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            <button className="relative p-2.5 text-gray-400 hover:text-[#16A34A] hover:bg-green-50 rounded-xl transition-all">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center pl-6 border-l border-gray-200 gap-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-bold text-[#064E3B] group-hover:text-[#16A34A] transition-colors">System Admin</p>
                <p className="text-xs font-medium text-gray-500">Admin</p>
              </div>
              <img src="https://ui-avatars.com/api/?name=Admin&background=16A34A&color=fff" alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#16A34A]" />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-10">
          <Outlet />
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
};

export default AdminLayout;

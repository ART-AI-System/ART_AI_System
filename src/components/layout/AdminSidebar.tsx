import { NavLink } from 'react-router-dom';
import { BrainCircuit, LayoutDashboard, GraduationCap, Briefcase, ChevronDown, CalendarDays, Library, BookOpen, MessageCircle, ClipboardList, Settings, LogOut } from 'lucide-react';
import { ROUTES } from '../../config/routes';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar = () => {
  const [isEmployeesOpen, setIsEmployeesOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <aside className="w-[280px] bg-[#064E3B] fixed h-full z-20 flex flex-col shadow-2xl">
      {/* Logo */}
      <div className="h-24 flex items-center px-8 cursor-pointer border-b border-white/10 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16A34A] to-[#4ADE80] flex items-center justify-center text-white mr-3 shadow-lg shadow-green-500/30">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <span className="text-2xl font-extrabold text-white tracking-tight">ART-AI<span className="text-[#4ADE80] text-xs align-top ml-1">ADMIN</span></span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#CBD5E1] [&::-webkit-scrollbar-thumb]:rounded-[10px]">
        <NavLink
          to={ROUTES.DASHBOARD_ADMIN}
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white font-bold'
                : 'text-green-100 hover:text-white hover:bg-white/5'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#4ADE80] rounded-r-full"></div>}
              <LayoutDashboard className={`w-5 h-5 mr-4 ${isActive ? 'text-[#4ADE80]' : 'opacity-70'}`} />
              Dashboard
            </>
          )}
        </NavLink>

        <div className="pt-4 pb-2">
          <p className="px-4 text-xs font-bold text-green-300 uppercase tracking-wider">Users</p>
        </div>

        <NavLink
          to="/dashboard/admin/students"
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white font-bold'
                : 'text-green-100 hover:text-white hover:bg-white/5'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#4ADE80] rounded-r-full"></div>}
              <GraduationCap className={`w-5 h-5 mr-4 ${isActive ? 'text-[#4ADE80]' : 'opacity-70'}`} />
              Students
            </>
          )}
        </NavLink>

        {/* Employees Dropdown */}
        <div className="relative group">
          <button 
            className="flex items-center px-4 py-3.5 text-green-100 hover:text-white font-medium rounded-xl transition-all hover:bg-white/5 w-full justify-between"
            onClick={() => setIsEmployeesOpen(!isEmployeesOpen)}
          >
            <div className="flex items-center">
              <Briefcase className="w-5 h-5 mr-4 opacity-70" />
              Employees
            </div>
            <ChevronDown className={`w-4 h-4 opacity-70 transition-transform ${isEmployeesOpen ? 'rotate-180' : ''}`} />
          </button>
          <div className={`${isEmployeesOpen ? 'block' : 'hidden'} pl-12 pr-4 py-2 space-y-1`}>
            <NavLink to="/dashboard/admin/teachers" className="block py-2 text-sm text-green-200 hover:text-white transition-colors">Lecturers</NavLink>
            <NavLink to="/dashboard/admin/head-subjects" className="block py-2 text-sm text-green-200 hover:text-white transition-colors">Head Subjects</NavLink>
          </div>
        </div>

        <div className="pt-4 pb-2">
          <p className="px-4 text-xs font-bold text-green-300 uppercase tracking-wider">Academic</p>
        </div>

        <NavLink
          to="/dashboard/admin/semesters"
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white font-bold'
                : 'text-green-100 hover:text-white hover:bg-white/5'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#4ADE80] rounded-r-full"></div>}
              <CalendarDays className={`w-5 h-5 mr-4 ${isActive ? 'text-[#4ADE80]' : 'opacity-70'}`} />
              Semesters
            </>
          )}
        </NavLink>

        <NavLink
          to="/dashboard/admin/subjects"
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white font-bold'
                : 'text-green-100 hover:text-white hover:bg-white/5'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#4ADE80] rounded-r-full"></div>}
              <Library className={`w-5 h-5 mr-4 ${isActive ? 'text-[#4ADE80]' : 'opacity-70'}`} />
              Subjects
            </>
          )}
        </NavLink>

        <NavLink
          to="/dashboard/admin/classes"
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white font-bold'
                : 'text-green-100 hover:text-white hover:bg-white/5'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#4ADE80] rounded-r-full"></div>}
              <BookOpen className={`w-5 h-5 mr-4 ${isActive ? 'text-[#4ADE80]' : 'opacity-70'}`} />
              Classes
            </>
          )}
        </NavLink>

        <div className="pt-4 pb-2">
          <p className="px-4 text-xs font-bold text-green-300 uppercase tracking-wider">Communication</p>
        </div>

        <NavLink
          to="/dashboard/admin/messages"
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white font-bold'
                : 'text-green-100 hover:text-white hover:bg-white/5'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#4ADE80] rounded-r-full"></div>}
              <MessageCircle className={`w-5 h-5 mr-4 ${isActive ? 'text-[#4ADE80]' : 'opacity-70'}`} />
              Messages
            </>
          )}
        </NavLink>

        <NavLink
          to="/dashboard/admin/feedback"
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white font-bold'
                : 'text-green-100 hover:text-white hover:bg-white/5'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#4ADE80] rounded-r-full"></div>}
              <ClipboardList className={`w-5 h-5 mr-4 ${isActive ? 'text-[#4ADE80]' : 'opacity-70'}`} />
              Feedback & Reports
            </>
          )}
        </NavLink>

        <div className="pt-4 pb-2">
          <p className="px-4 text-xs font-bold text-green-300 uppercase tracking-wider">System</p>
        </div>

        <NavLink
          to="/dashboard/admin/settings"
          className={({ isActive }) =>
            `flex items-center px-4 py-3.5 font-medium rounded-xl transition-all relative ${
              isActive
                ? 'bg-white/10 text-white font-bold'
                : 'text-green-100 hover:text-white hover:bg-white/5'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#4ADE80] rounded-r-full"></div>}
              <Settings className={`w-5 h-5 mr-4 ${isActive ? 'text-[#4ADE80]' : 'opacity-70'}`} />
              Settings
            </>
          )}
        </NavLink>
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-white/10 shrink-0">
        <button onClick={logout} className="flex w-full items-center px-4 py-3.5 text-red-300 hover:text-white hover:bg-red-500/20 font-medium rounded-xl transition-all">
          <LogOut className="w-5 h-5 mr-4 opacity-90" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

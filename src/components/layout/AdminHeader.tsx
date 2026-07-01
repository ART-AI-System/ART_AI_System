import { Search, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationDropdown } from '../common/NotificationDropdown';

export const AdminHeader = () => {
  const { user } = useAuth();

  return (
    <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-10 shrink-0 w-full">
      <div>
        <h1 className="text-2xl font-extrabold text-[#064E3B]">Admin Dashboard</h1>
        <p className="text-sm font-medium text-gray-500 mt-1">Home / Dashboard</p>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="What do you want to find?" 
            className="bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 pl-12 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm w-64 text-[#064E3B] font-medium"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        <NotificationDropdown />

        <div className="flex items-center pl-6 border-l border-gray-200 gap-3 cursor-pointer">
          <div className="text-right">
            <p className="text-sm font-bold text-[#064E3B]">{user?.fullName || 'Priscilla Lily'}</p>
            <p className="text-xs font-medium text-gray-500">Admin</p>
          </div>
          <img src={`https://ui-avatars.com/api/?name=${user?.fullName || 'Admin'}&background=16A34A&color=fff`} alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

import { User, Shield, Bell, LogOut, Camera, Mail, Badge } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LecturerSettingsPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex-1 overflow-y-auto p-10 scroll-smooth">
      <div className="max-w-6xl mx-auto flex flex-col xl:flex-row gap-8">
        {/* Settings Menu (Left Sidebar) */}
        <div className="w-full xl:w-64 shrink-0">
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-4 sticky top-0">
            <nav className="space-y-1">
              <a href="#" className="flex items-center px-4 py-3 bg-blue-50 text-[#4318FF] font-bold rounded-xl transition-all relative">
                <User className="w-5 h-5 mr-3" /> General
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#4318FF] rounded-r-lg"></div>
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-gray-500 hover:text-gray-900 font-medium rounded-xl transition-all hover:bg-gray-50">
                <Shield className="w-5 h-5 mr-3" /> Security
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-gray-500 hover:text-gray-900 font-medium rounded-xl transition-all hover:bg-gray-50">
                <Bell className="w-5 h-5 mr-3" /> Notifications
              </a>
            </nav>
            
            <div className="mt-8 pt-4 border-t border-gray-100">
              <button onClick={logout} className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 font-bold rounded-xl transition-all">
                <LogOut className="w-5 h-5 mr-3" /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Settings Forms (Right Content) */}
        <div className="flex-1">
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-extrabold text-[#1B2559]">General Information</h2>
              <p className="text-sm font-medium text-gray-500 mt-1">Update your profile details and avatar.</p>
            </div>
            
            <div className="p-8">
              {/* Avatar Upload */}
              <div className="flex items-center mb-8 pb-8 border-b border-gray-100">
                <div className="relative group cursor-pointer shrink-0">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=F26F21&color=fff`} className="w-24 h-24 rounded-full shadow-md object-cover border-4 border-white" alt="Avatar" />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="ml-6">
                  <div className="flex space-x-3 mb-2">
                    <button className="bg-[#4318FF] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 hover:bg-[#3311CC] transition-all">Upload New</button>
                    <button className="bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-100 transition-all">Remove</button>
                  </div>
                  <p className="text-xs text-gray-400 font-medium">Recommended: Square JPG, PNG. Max 2MB.</p>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">First Name</label>
                    <input type="text" value={user?.name?.split(' ')[1] || 'A'} disabled className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-bold cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Last Name</label>
                    <input type="text" value={user?.name?.split(' ')[0] || 'Nguyen'} disabled className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-bold cursor-not-allowed" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">FPT Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="email" value={user?.email || 'anv@fpt.edu.vn'} disabled className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-bold cursor-not-allowed" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Lecturer ID / Staff Code</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Badge className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" value={user?.id || 'GV01928'} disabled className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-bold cursor-not-allowed" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bio / Title</label>
                  <textarea rows={3} className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[#1B2559] font-medium focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] outline-none transition-all resize-none" defaultValue="Senior Lecturer, Software Engineering Department"></textarea>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-100 mt-8">
                  <button type="button" className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-200 mr-4 transition-all">Cancel</button>
                  <button type="button" className="bg-[#F26F21] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md shadow-orange-500/20 hover:bg-[#D95D1A] transition-all">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerSettingsPage;

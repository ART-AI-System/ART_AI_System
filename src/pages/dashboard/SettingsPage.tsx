import { User, Shield, Bell, Cpu, LogOut, Camera, Mail, Badge } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/routes';
import { Card } from '../../components/common/Card';

const SettingsPage = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1B2559]">Settings</h1>
        <p className="text-gray-500 font-medium mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* Settings Menu */}
        <div className="w-full xl:w-64 shrink-0">
          <Card className="p-4">
            <nav className="space-y-1">
              <Link to="#" className="flex items-center px-4 py-3 bg-[#F4F7FE] text-[#4318FF] font-bold rounded-xl transition-all">
                <User className="w-5 h-5 mr-3" /> General
              </Link>
              <Link to="#" className="flex items-center px-4 py-3 text-gray-500 hover:text-gray-900 font-medium rounded-xl transition-all hover:bg-gray-50">
                <Shield className="w-5 h-5 mr-3" /> Security
              </Link>
              <Link to="#" className="flex items-center px-4 py-3 text-gray-500 hover:text-gray-900 font-medium rounded-xl transition-all hover:bg-gray-50">
                <Bell className="w-5 h-5 mr-3" /> Notifications
              </Link>
              <Link to="#" className="flex items-center px-4 py-3 text-gray-500 hover:text-gray-900 font-medium rounded-xl transition-all hover:bg-gray-50">
                <Cpu className="w-5 h-5 mr-3" /> AI Preferences
              </Link>
            </nav>
            
            <div className="mt-8 pt-4 border-t border-gray-100">
              <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 font-bold rounded-xl transition-all">
                <LogOut className="w-5 h-5 mr-3" /> Sign Out
              </button>
            </div>
          </Card>
        </div>

        {/* Settings Forms */}
        <div className="flex-1">
          <Card className="overflow-hidden p-0">
            
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-[#1B2559]">General Information</h2>
              <p className="text-sm font-medium text-gray-500 mt-1">Update your profile details and avatar.</p>
            </div>
            
            <div className="p-8">
              {/* Avatar Upload */}
              <div className="flex items-center mb-8 pb-8 border-b border-gray-100">
                <div className="relative group cursor-pointer">
                  <img src={`https://ui-avatars.com/api/?name=${user?.name?.replace(' ', '+') || 'User'}&background=F26F21&color=fff`} alt="Avatar" className="w-24 h-24 rounded-full shadow-md object-cover" />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="ml-6">
                  <div className="flex space-x-3 mb-2">
                    <button className="bg-[#4318FF] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-200">Upload New</button>
                    <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200">Remove</button>
                  </div>
                  <p className="text-xs text-gray-400 font-medium">Recommended: Square JPG, PNG. Max 2MB.</p>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input type="text" defaultValue={user?.name} disabled className="block w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed transition-colors font-medium outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                    <input type="text" defaultValue={user?.role} disabled className="block w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed transition-colors font-medium outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">FPT Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="email" defaultValue={user?.email} disabled className="block w-full pl-11 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed" />
                  </div>
                  <p className="text-xs text-gray-400 font-medium mt-1">Email is managed by FPT University IT Department.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">User ID (Code)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Badge className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" defaultValue={user?.id} disabled className="block w-full pl-11 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bio / Status</label>
                  <textarea rows={3} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-[#4318FF] focus:border-[#4318FF] transition-colors font-medium outline-none" placeholder="A short bio about yourself"></textarea>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-100">
                  <button type="button" className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 mr-4">Cancel</button>
                  <button type="button" className="bg-gradient-to-br from-[#F26F21] to-[#F79C65] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-orange-200 hover:opacity-90">Save Changes</button>
                </div>
              </form>

            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;

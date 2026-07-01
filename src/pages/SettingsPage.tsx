import React, { useState } from 'react';
import { User, Bell, Shield, Monitor, LogOut, ArrowRight, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <User className="w-5 h-5" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'ai-preferences', label: 'AI Preferences', icon: <Monitor className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col space-y-6 animate-fade-in max-w-6xl mx-auto w-full">
      <div className="flex flex-col">
        <h1 className="text-3xl font-extrabold text-[#1B2559]">Settings</h1>
        <p className="text-gray-500 mt-2">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-5 py-3.5 rounded-2xl font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-50 text-[#4318FF] border border-blue-100 shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="mr-3">{tab.icon}</span>
              {tab.label}
              {activeTab === tab.id && <ArrowRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
          
          <div className="pt-6 mt-6 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-5 py-3.5 rounded-2xl font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors group"
            >
              <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
              Log Out
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
            {activeTab === 'general' && (
              <div className="animate-fade-in">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-lg font-bold text-[#1B2559]">General Information</h2>
                  <p className="text-sm font-medium text-gray-500 mt-1">Update your profile details and avatar.</p>
                </div>

                <div className="p-8">
                  {/* Avatar Upload */}
                  <div className="flex items-center mb-8 pb-8 border-b border-gray-100">
                    <img src="https://ui-avatars.com/api/?name=Viet+Khoa&background=F26F21&color=fff" className="w-24 h-24 rounded-full shadow-md object-cover" alt="Avatar" />
                    <div className="ml-6">
                      <div className="flex space-x-3 mb-2">
                        <button className="bg-[#4318FF] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-200 hover:opacity-90">Upload New</button>
                        <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200">Remove</button>
                      </div>
                      <p className="text-xs text-gray-400 font-medium">Recommended: Square JPG, PNG. Max 2MB.</p>
                    </div>
                  </div>

                  <div className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                        <input type="text" defaultValue="Viet" className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-[#4318FF] focus:border-[#4318FF] transition-colors font-medium outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                        <input type="text" defaultValue="Khoa" className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-[#4318FF] focus:border-[#4318FF] transition-colors font-medium outline-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">FPT Email Address</label>
                      <input type="email" disabled defaultValue="khoavse18d01@fpt.edu.vn" className="block w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed" />
                      <p className="text-xs text-gray-400 font-medium mt-1">Email is managed by FPT University IT Department.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Student Code</label>
                      <input type="text" disabled defaultValue="SE18D01" className="block w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Bio / Status</label>
                      <textarea rows={3} className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-[#4318FF] focus:border-[#4318FF] transition-colors font-medium outline-none" placeholder="A short bio about yourself"></textarea>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-100">
                      <button type="button" className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 mr-4">Cancel</button>
                      <button type="button" className="bg-gradient-to-br from-[#F26F21] to-[#F79C65] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-orange-200 hover:opacity-90">Save Changes</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab !== 'general' && (
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                <UserCircle className="w-16 h-16 mb-4 text-gray-200" />
                <h3 className="text-lg font-bold text-gray-600">Coming Soon</h3>
                <p className="text-sm">This settings module is under development.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

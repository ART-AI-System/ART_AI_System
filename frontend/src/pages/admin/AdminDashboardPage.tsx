import { GraduationCap, Users, BookOpen, Library, MoreVertical, UserPlus, ServerCrash } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 font-semibold text-sm mb-1">Students</h3>
            <p className="text-2xl font-extrabold text-[#064E3B]">3,450</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 font-semibold text-sm mb-1">Lecturers</h3>
            <p className="text-2xl font-extrabold text-[#064E3B]">120</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 font-semibold text-sm mb-1">Active Classes</h3>
            <p className="text-2xl font-extrabold text-[#064E3B]">84</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 font-semibold text-sm mb-1">Subjects</h3>
            <p className="text-2xl font-extrabold text-[#064E3B]">45</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
            <Library className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Middle Charts */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-[#064E3B] text-lg">System Activity</h3>
              <p className="text-sm text-gray-500">Logins & Test Attempts</p>
            </div>
            <div className="flex space-x-3 text-sm">
              <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>Students</span>
              <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>Lecturers</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between px-4 pb-2 space-x-2 border-b border-gray-100 relative">
            {/* Grid lines */}
            <div className="absolute w-full h-px bg-gray-100 bottom-[25%]"></div>
            <div className="absolute w-full h-px bg-gray-100 bottom-[50%]"></div>
            <div className="absolute w-full h-px bg-gray-100 bottom-[75%]"></div>
            <div className="absolute w-full h-px bg-gray-100 top-0"></div>
            {/* Bars */}
            <div className="w-full flex justify-around items-end z-10 h-full pt-4">
              <div className="flex space-x-1 items-end h-full"><div className="w-4 bg-purple-500 rounded-t-sm" style={{ height: '60%' }}></div><div className="w-4 bg-orange-500 rounded-t-sm" style={{ height: '40%' }}></div></div>
              <div className="flex space-x-1 items-end h-full"><div className="w-4 bg-purple-500 rounded-t-sm" style={{ height: '80%' }}></div><div className="w-4 bg-orange-500 rounded-t-sm" style={{ height: '50%' }}></div></div>
              <div className="flex space-x-1 items-end h-full"><div className="w-4 bg-purple-500 rounded-t-sm" style={{ height: '45%' }}></div><div className="w-4 bg-orange-500 rounded-t-sm" style={{ height: '30%' }}></div></div>
              <div className="flex space-x-1 items-end h-full"><div className="w-4 bg-purple-500 rounded-t-sm" style={{ height: '90%' }}></div><div className="w-4 bg-orange-500 rounded-t-sm" style={{ height: '60%' }}></div></div>
              <div className="flex space-x-1 items-end h-full"><div className="w-4 bg-purple-500 rounded-t-sm" style={{ height: '70%' }}></div><div className="w-4 bg-orange-500 rounded-t-sm" style={{ height: '40%' }}></div></div>
              <div className="flex space-x-1 items-end h-full"><div className="w-4 bg-purple-500 rounded-t-sm" style={{ height: '55%' }}></div><div className="w-4 bg-orange-500 rounded-t-sm" style={{ height: '35%' }}></div></div>
              <div className="flex space-x-1 items-end h-full"><div className="w-4 bg-purple-500 rounded-t-sm" style={{ height: '85%' }}></div><div className="w-4 bg-orange-500 rounded-t-sm" style={{ height: '65%' }}></div></div>
            </div>
          </div>
          <div className="flex justify-around text-xs text-gray-400 mt-3">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#064E3B] text-lg">Students</h3>
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="w-48 h-48 rounded-full" style={{ background: 'conic-gradient(#8B5CF6 0% 65%, #F97316 65% 100%)' }}></div>
            <div className="absolute inset-0 m-auto w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500 font-bold">Total</span>
              <span className="text-2xl font-extrabold text-[#064E3B]">3,450</span>
            </div>
          </div>
          <div className="flex justify-center space-x-6 mt-4 text-sm font-bold">
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-[#8B5CF6] mr-2"></div>Male</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-[#F97316] mr-2"></div>Female</div>
          </div>
        </div>
      </div>

      {/* Bottom Lists */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#064E3B] text-lg">Top Performers</h3>
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 text-xs">
                <th className="py-2 w-8"><input type="checkbox" className="rounded" /></th>
                <th className="py-2">Name</th>
                <th className="py-2">ID</th>
                <th className="py-2">Marks</th>
                <th className="py-2">Percent</th>
                <th className="py-2">Year</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3"><input type="checkbox" className="rounded" /></td>
                <td className="py-3 font-bold text-[#064E3B] flex items-center">
                  <img src="https://ui-avatars.com/api/?name=Evelyn+Harper&background=F3F4F6" className="w-6 h-6 rounded-full mr-2" alt="Avatar" />
                  Evelyn Harper
                </td>
                <td className="py-3 text-gray-500">HE150123</td>
                <td className="py-3 text-gray-500">1185</td>
                <td className="py-3 text-gray-500">98%</td>
                <td className="py-3 text-gray-500">2026</td>
              </tr>
              <tr className="border-b border-gray-50 bg-green-50/30">
                <td className="py-3"><input type="checkbox" className="rounded" defaultChecked /></td>
                <td className="py-3 font-bold text-[#064E3B] flex items-center">
                  <img src="https://ui-avatars.com/api/?name=Diana+Plenty&background=F3F4F6" className="w-6 h-6 rounded-full mr-2" alt="Avatar" />
                  Diana Plenty
                </td>
                <td className="py-3 text-gray-500">HE150124</td>
                <td className="py-3 text-gray-500">1165</td>
                <td className="py-3 text-gray-500">91%</td>
                <td className="py-3 text-gray-500">2026</td>
              </tr>
              <tr className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3"><input type="checkbox" className="rounded" /></td>
                <td className="py-3 font-bold text-[#064E3B] flex items-center">
                  <img src="https://ui-avatars.com/api/?name=John+Millar&background=F3F4F6" className="w-6 h-6 rounded-full mr-2" alt="Avatar" />
                  John Millar
                </td>
                <td className="py-3 text-gray-500">SE150125</td>
                <td className="py-3 text-gray-500">1175</td>
                <td className="py-3 text-gray-500">92%</td>
                <td className="py-3 text-gray-500">2026</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#064E3B] text-lg">System Notices</h3>
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4 flex-1">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 mr-3 mt-1">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#064E3B]">New Lecturer Added</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">Dr. Khue was added to IT Dept</p>
                <span className="text-[10px] text-gray-400 mt-1 block">Just now</span>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0 mr-3 mt-1">
                <ServerCrash className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#064E3B]">Server Maintenance</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">Scheduled for tonight at 2AM</p>
                <span className="text-[10px] text-gray-400 mt-1 block">Today</span>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-lg bg-green-50 text-green-500 flex items-center justify-center shrink-0 mr-3 mt-1">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#064E3B]">New Course Uploaded</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">Machine Learning Basics SP26</p>
                <span className="text-[10px] text-gray-400 mt-1 block">Yesterday</span>
              </div>
            </div>
          </div>
          <button className="w-full py-2.5 mt-4 bg-gray-50 hover:bg-green-50 text-[#16A34A] font-bold rounded-xl text-sm transition-colors border border-gray-100 hover:border-green-200">
            View All
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

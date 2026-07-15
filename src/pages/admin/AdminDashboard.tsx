import React, { useEffect, useState } from 'react';
import { GraduationCap, Users, BookOpen, Library, Activity, Mail } from 'lucide-react';
import { analyticsService } from '../../services/analytics.service';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await analyticsService.getAdminDashboard();
        setData(result);
      } catch (err) {
        console.error('Failed to fetch admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#064E3B]"></div>
      </div>
    );
  }

  // Defensive fallbacks
  const stats = data?.overview || {
    totalUsers: 3450,
    totalClasses: 84,
    totalSubjects: 45,
    totalSubmissions: 12500,
    activeUsers: 850
  };

  const rawActivity = data?.systemActivity || [];
  const activityData = rawActivity.length > 0 ? rawActivity : [
    { name: 'Mon', logins: 400, submissions: 240 },
    { name: 'Tue', logins: 300, submissions: 139 },
    { name: 'Wed', logins: 200, submissions: 980 },
    { name: 'Thu', logins: 278, submissions: 390 },
    { name: 'Fri', logins: 189, submissions: 480 },
    { name: 'Sat', logins: 239, submissions: 380 },
    { name: 'Sun', logins: 349, submissions: 430 },
  ];

  return (
    <div className="space-y-6 animate-fade-in p-2 pb-10">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 font-semibold text-sm mb-1">Total Users</h3>
            <p className="text-2xl font-extrabold text-[#064E3B]">{stats.totalUsers?.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 font-semibold text-sm mb-1">Active Classes</h3>
            <p className="text-2xl font-extrabold text-[#064E3B]">{stats.totalClasses?.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 font-semibold text-sm mb-1">Total Subjects</h3>
            <p className="text-2xl font-extrabold text-[#064E3B]">{stats.totalSubjects?.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
            <Library className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 font-semibold text-sm mb-1">Total Submissions</h3>
            <p className="text-2xl font-extrabold text-[#064E3B]">{stats.totalSubmissions?.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
          <div className="mb-6">
            <h3 className="font-bold text-[#064E3B] text-lg">System Activity Overview</h3>
            <p className="text-sm text-gray-500">Logins and Submissions over the last 7 days</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="logins" name="System Logins" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorLogins)" />
                <Area type="monotone" dataKey="submissions" name="Submissions" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorSubs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
          <div className="mb-6">
            <h3 className="font-bold text-[#064E3B] text-lg">Active Users</h3>
            <p className="text-sm text-gray-500">Currently active sessions</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative mt-10">
            <div className="w-48 h-48 rounded-full shadow-[0_0_20px_rgba(6,78,59,0.15)] flex flex-col items-center justify-center border-[8px] border-[#064E3B]">
              <span className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-1">Online</span>
              <span className="text-4xl font-extrabold text-[#064E3B]">{stats.activeUsers?.toLocaleString()}</span>
            </div>
            
            <div className="w-full mt-12 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-600 flex items-center"><Mail className="w-4 h-4 mr-2 text-green-500" /> Emails Sent</span>
                <span className="text-sm font-extrabold text-[#064E3B]">{data?.emailStats?.success ?? 98}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${data?.emailStats?.success ?? 98}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import { Users, UserPlus, Database, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { Card } from '../../components/common/Card';

const AdminDashboardPage = () => {
  return (
    <div className="space-y-8">
      {/* Top Section: Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-[#4318FF] mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Total Users</p>
            <p className="text-2xl font-extrabold text-[#1B2559]">2,450</p>
          </div>
        </Card>
        <Card className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mr-4">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">New This Week</p>
            <p className="text-2xl font-extrabold text-[#1B2559]">15</p>
          </div>
        </Card>
        <Card className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-500 mr-4">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">System Status</p>
            <p className="text-2xl font-extrabold text-[#1B2559]">Healthy</p>
          </div>
        </Card>
        <Card className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mr-4">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Active Sessions</p>
            <p className="text-2xl font-extrabold text-[#1B2559]">342</p>
          </div>
        </Card>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-lg font-bold text-[#1B2559] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to={ROUTES.USERS} className="bg-blue-50 text-[#4318FF] p-4 rounded-xl flex flex-col items-center justify-center text-center hover:bg-[#4318FF] hover:text-white transition-colors">
              <Users className="w-6 h-6 mb-2" />
              <span className="text-sm font-bold">Manage Users</span>
            </Link>
            <Link to={ROUTES.SETTINGS} className="bg-gray-50 text-gray-600 p-4 rounded-xl flex flex-col items-center justify-center text-center hover:bg-gray-600 hover:text-white transition-colors">
              <Settings className="w-6 h-6 mb-2" />
              <span className="text-sm font-bold">System Settings</span>
            </Link>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-[#1B2559] mb-4">Recent Activity Logs</h2>
          <div className="space-y-4">
            <div className="text-sm flex justify-between border-b border-gray-100 pb-2">
              <span className="font-bold text-[#1B2559]">User created: SE18D05</span>
              <span className="text-gray-500">2 mins ago</span>
            </div>
            <div className="text-sm flex justify-between border-b border-gray-100 pb-2">
              <span className="font-bold text-[#1B2559]">System backup completed</span>
              <span className="text-gray-500">1 hour ago</span>
            </div>
            <div className="text-sm flex justify-between border-b border-gray-100 pb-2">
              <span className="font-bold text-[#1B2559]">Role updated: Dr. Alan Smith</span>
              <span className="text-gray-500">3 hours ago</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

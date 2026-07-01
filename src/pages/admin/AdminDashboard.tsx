import React, { useEffect, useState } from 'react';
import { GraduationCap, Users, BookOpen, Library } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    lecturers: 0,
    classes: 0,
    subjects: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd fetch dashboard stats from an admin endpoint
    // For now, we simulate fetching stats from various endpoints or mock
    const fetchStats = async () => {
      setLoading(true);
      try {
        // We can fetch from real endpoints if available
        // For demonstration, we'll set mock stats matching the mockup
        setStats({
          students: 3450,
          lecturers: 120,
          classes: 84,
          subjects: 45
        });
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 font-semibold text-sm mb-1">Students</h3>
            <p className="text-2xl font-extrabold text-[#064E3B]">{stats.students.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 font-semibold text-sm mb-1">Lecturers</h3>
            <p className="text-2xl font-extrabold text-[#064E3B]">{stats.lecturers}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 font-semibold text-sm mb-1">Active Classes</h3>
            <p className="text-2xl font-extrabold text-[#064E3B]">{stats.classes}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 font-semibold text-sm mb-1">Subjects</h3>
            <p className="text-2xl font-extrabold text-[#064E3B]">{stats.subjects}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
            <Library className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Placeholder for charts/tables from mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <h3 className="font-bold text-[#064E3B] text-lg mb-2">System Activity Chart</h3>
            <p className="text-sm text-gray-500">Visualization to be implemented with chart library</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <h3 className="font-bold text-[#064E3B] text-lg mb-2">Demographics</h3>
            <p className="text-sm text-gray-500">Donut chart to be implemented</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

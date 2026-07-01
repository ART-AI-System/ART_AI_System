import React, { useEffect, useState } from 'react';
import { Users, FileCheck2, AlertTriangle, BrainCircuit, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const LecturerDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response: any = await axiosClient.get('/lecturers/home');
        setData(response.result);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F26F21]"></div>
      </div>
    );
  }

  const classes = data?.classes || [];
  const totalStudents = classes.reduce((sum: number, cls: any) => sum + (cls.totalStudents || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-[#4318FF] mr-4">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400">Total Students</p>
            <h3 className="text-2xl font-extrabold text-[#1B2559]">{totalStudents}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center">
          <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-[#F26F21] mr-4">
            <FileCheck2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400">Pending Grading</p>
            <h3 className="text-2xl font-extrabold text-[#1B2559]">12</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-500 mr-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400">AI Discrepancies</p>
            <h3 className="text-2xl font-extrabold text-[#1B2559]">3</h3>
          </div>
        </div>

        <div className="bg-[#1B2559] p-6 rounded-[24px] shadow-lg shadow-blue-900/20 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 opacity-10">
            <BrainCircuit className="w-32 h-32 text-white" />
          </div>
          <p className="text-sm font-bold text-blue-200 relative z-10">System Status</p>
          <div className="flex items-center mt-1 relative z-10">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full mr-2 shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
            <span className="text-white font-bold">All Services Online</span>
          </div>
        </div>
      </div>

      {/* Classes and Urgent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Classes List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#1B2559]">My Classes</h2>
            <Link to="/lecturer/subjects" className="text-sm font-bold text-[#F26F21] hover:underline">View All</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.slice(0, 4).map((cls: any, index: number) => (
              <Link key={cls.classId} to={`/lecturer/subjects/${cls.classId}`} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group block">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${index % 2 === 0 ? 'bg-orange-50 text-[#F26F21]' : 'bg-blue-50 text-[#4318FF]'}`}>
                    {cls.subjectCode?.substring(0, 3)}
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">Active</span>
                </div>
                <h3 className={`text-lg font-bold text-[#1B2559] transition-colors ${index % 2 === 0 ? 'group-hover:text-[#F26F21]' : 'group-hover:text-[#4318FF]'}`}>
                  {cls.subjectName}
                </h3>
                <p className="text-sm text-gray-500 font-medium mb-4">{cls.subjectCode} • Class {cls.classCode}</p>
                <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-4">
                  <span className="text-gray-500 font-medium">{cls.totalStudents} Students</span>
                  <span className="text-gray-400 font-bold flex items-center">
                    Manage <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
            
            {classes.length === 0 && (
              <div className="col-span-2 text-center text-gray-500 font-medium p-8 bg-white rounded-[24px] shadow-sm border border-gray-100">
                You are not assigned to any classes in this semester.
              </div>
            )}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-[#1B2559]">Needs Attention</h2>
          
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 space-y-4">
            {/* Action Item */}
            <div className="flex items-start pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 mr-3 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1B2559]">High AI Discrepancy</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">Student Nguyen Van Duc (PRJ301) submitted code with 95% AI detection vs 10% declared.</p>
                <Link to="/lecturer/grading" className="inline-block mt-2 text-xs font-bold text-[#F26F21] hover:underline">Review Submission</Link>
              </div>
            </div>

            {/* Action Item */}
            <div className="flex items-start pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#F26F21] mr-3 shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1B2559]">Grade Assignments</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">12 ungraded submissions waiting for review.</p>
                <Link to="/lecturer/grading" className="inline-block mt-2 text-xs font-bold text-[#F26F21] hover:underline">Go to Grading</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;

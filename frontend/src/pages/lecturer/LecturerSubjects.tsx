import React, { useEffect, useState } from 'react';
import { BookOpen, Users, FileCheck2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const LecturerSubjects = () => {
  const navigate = useNavigate();
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

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B2559]">My Subjects</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your classes, syllabuses, and assignments</p>
        </div>
        <div className="mt-4 md:mt-0 relative">
          <select className="appearance-none bg-white border border-gray-200 text-[#1B2559] text-sm font-bold rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#F26F21]/20 focus:border-[#F26F21] shadow-sm transition-all cursor-pointer">
            <option value="SP2026">{data?.currentSemester?.name || 'Current Semester'}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls: any, index: number) => {
          const isOrange = index % 2 === 0;
          return (
            <div 
              key={cls.classId} 
              className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer"
              onClick={() => navigate(`/lecturer/subjects/${cls.classId}`)}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold ${isOrange ? 'bg-orange-50 text-[#F26F21]' : 'bg-blue-50 text-[#4318FF]'}`}>
                  <BookOpen className="w-6 h-6 mb-1" />
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">Active</span>
              </div>
              
              <h3 className={`font-extrabold text-[#1B2559] text-xl mb-1 transition-colors ${isOrange ? 'group-hover:text-[#F26F21]' : 'group-hover:text-[#4318FF]'}`}>
                {cls.subjectName}
              </h3>
              <p className="text-sm font-medium text-gray-400 mb-6">{cls.subjectCode} • Class {cls.classCode}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-auto mb-4">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-xs font-medium text-gray-400 mb-1 flex items-center"><Users className="w-3 h-3 mr-1" /> Students</p>
                  <p className="text-lg font-bold text-[#1B2559]">{cls.totalStudents}</p>
                </div>
                <div className={`rounded-xl p-3 border ${isOrange ? 'bg-orange-50 border-orange-100' : 'bg-blue-50 border-blue-100'}`}>
                  <p className={`text-xs font-medium mb-1 flex items-center ${isOrange ? 'text-orange-500' : 'text-blue-500'}`}>
                    <FileCheck2 className="w-3 h-3 mr-1" /> Tasks
                  </p>
                  <p className={`text-lg font-bold ${isOrange ? 'text-[#F26F21]' : 'text-[#4318FF]'}`}>-</p>
                </div>
              </div>

              <div className="flex items-center justify-end text-sm font-bold text-gray-400 group-hover:text-[#1B2559] transition-colors border-t border-gray-50 pt-4">
                Manage Class <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LecturerSubjects;

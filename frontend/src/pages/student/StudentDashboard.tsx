import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Calendar, GraduationCap } from 'lucide-react';
import { analyticsService } from '../../services/analytics.service';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const result = await analyticsService.getStudentHome();
        setData(result);
      } catch (err: any) {
        console.error('Failed to fetch student home:', err);
        setError(err?.response?.data?.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const currentSemester = data?.currentSemester;
  const subjects = data?.subjects ?? [];

  return (
    <div className="flex flex-col h-full animate-fade-in p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1B2559]">Welcome back, {user?.fullName}!</h1>
        <p className="text-gray-500 font-medium mt-2">Here is your current academic overview.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 flex items-center space-x-6">
          <div className="w-16 h-16 bg-[#4318FF]/10 text-[#4318FF] rounded-2xl flex items-center justify-center">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-[#1B2559]">{currentSemester?.name || 'N/A'}</h3>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">Current Semester</p>
          </div>
        </div>

        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 flex items-center space-x-6">
          <div className="w-16 h-16 bg-[#00B5D8]/10 text-[#00B5D8] rounded-2xl flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-[#1B2559]">{subjects.length}</h3>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">Enrolled Subjects</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#1B2559] flex items-center">
            <GraduationCap className="w-6 h-6 mr-2 text-[#4318FF]" />
            Your Subjects & Classes
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4318FF]"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 font-bold p-4 bg-red-50 rounded-xl border border-red-100">
              {error}
            </div>
          ) : subjects.length === 0 ? (
            <div className="text-center text-gray-500 font-medium p-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>You are not enrolled in any subjects this semester.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((sub: any, idx: number) => (
                <Link 
                  key={idx} 
                  to={`/student/classes/${sub.classId}`}
                  className="bg-white border border-gray-100 rounded-[20px] p-6 hover:shadow-lg transition-all duration-200 group border-l-4 border-l-[#4318FF]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 bg-[#4318FF]/10 text-[#4318FF] text-xs font-bold rounded-lg mb-2">
                        {sub.subjectCode || 'N/A'}
                      </span>
                      <h3 className="text-lg font-bold text-[#1B2559] group-hover:text-[#4318FF] transition-colors line-clamp-1">
                        {sub.subjectName || 'Unknown Subject'}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
                    <div>
                      <span className="text-gray-400 font-medium">Class: </span>
                      <span className="font-bold text-[#1B2559]">{sub.classCode || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium">Lecturer: </span>
                      <span className="font-bold text-[#1B2559]">{sub.lecturerName || 'N/A'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

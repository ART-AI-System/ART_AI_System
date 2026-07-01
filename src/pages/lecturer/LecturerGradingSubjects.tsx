import React, { useEffect, useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const LecturerGradingSubjects = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
  
  const filteredClasses = classes.filter((cls: any) => 
    cls.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cls.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B2559]">Grading</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your enrolled subjects and classes</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-4">
          <div className="flex items-center bg-white rounded-full px-5 py-2.5 border border-gray-200 w-64 shadow-sm">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search subject code..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none ml-3 w-full text-sm font-medium text-gray-700 placeholder-gray-400"
            />
          </div>
          <select className="appearance-none bg-white border border-gray-200 text-[#1B2559] text-sm font-bold rounded-xl px-4 py-2.5 pr-10 shadow-sm cursor-pointer outline-none focus:border-[#F26F21]">
            <option value="SP2026">{data?.currentSemester?.name || 'Current Semester'}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls: any, index: number) => {
          // Determine a color theme based on index
          const isOrange = index % 2 === 0;
          const bgGradient = isOrange 
            ? 'from-[#F26F21]/80 to-[#1B2559]/90'
            : 'from-[#4318FF]/80 to-[#1B2559]/90';
            
          return (
            <div 
              key={cls.classId}
              onClick={() => navigate(`/lecturer/grading/${cls.classId}`)}
              className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
            >
              <div className="h-40 bg-gray-200 relative overflow-hidden">
                {/* Fallback pattern since we don't have images for each class */}
                <div className={`w-full h-full bg-gradient-to-br ${isOrange ? 'from-orange-400 to-red-500' : 'from-blue-400 to-indigo-600'} group-hover:scale-105 transition-transform duration-500`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B2559]/90 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <span className={`px-2.5 py-1 text-white text-xs font-bold rounded-lg shadow-sm mb-2 inline-block ${isOrange ? 'bg-[#F26F21]' : 'bg-[#4318FF]'}`}>
                      {cls.subjectCode}
                    </span>
                    <h3 className="font-bold text-white text-lg leading-tight">{cls.subjectName}</h3>
                  </div>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs font-medium text-gray-400 mb-1">Class</p>
                    <p className="text-lg font-bold text-[#1B2559]">{cls.classCode}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs font-medium text-gray-400 mb-1">Students</p>
                    <p className="text-lg font-bold text-[#1B2559]">{cls.totalStudents}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className={`text-sm font-bold flex items-center ${isOrange ? 'text-[#F26F21]' : 'text-[#4318FF]'}`}>
                    Manage Grading <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredClasses.length === 0 && (
          <div className="col-span-3 text-center text-gray-500 font-medium p-8 bg-white rounded-[24px] shadow-sm border border-gray-100">
            No classes found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default LecturerGradingSubjects;

import { Link } from 'react-router-dom';
import { ChevronRight, CornerUpLeft, Search, ArrowRight, Bell, ChevronDown } from 'lucide-react';
import { ROUTES } from '../../config/routes';

const LecturerGradingAssignmentsPage = () => {
  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* TOP HEADER */}
      <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-10 shrink-0">
        <div className="flex-1 flex justify-between items-center mr-6">
          <div>
            <div className="flex items-center text-sm font-bold text-gray-400 mb-1">
              <Link to={ROUTES.GRADING_SUBJECTS} className="hover:text-[#4318FF] transition-colors cursor-pointer">
                Grading
              </Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-[#4318FF]">PRJ301</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#1B2559]">PRJ301 - Java Web Application</h1>
          </div>
          <Link
            to={ROUTES.GRADING_SUBJECTS}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-50 hover:text-[#4318FF] transition-colors shadow-sm flex items-center"
          >
            <CornerUpLeft className="w-4 h-4 mr-2" /> Return
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          {/* Semester Selector */}
          <div className="relative">
            <select className="appearance-none bg-gray-50 border border-gray-200 text-[#1B2559] text-sm font-bold rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#F26F21]/20 focus:border-[#F26F21] transition-all cursor-pointer">
              <option value="SP2026">Spring 2026</option>
              <option value="FA2025">Fall 2025</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button className="relative p-2.5 text-gray-400 hover:text-[#F26F21] hover:bg-orange-50 rounded-xl transition-all">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <div className="flex-1 overflow-y-auto p-10 scroll-smooth">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-[#1B2559]">Classes & Assignments</h2>
            <div className="bg-white border border-gray-200 rounded-xl flex items-center px-4 py-2 shadow-sm w-72">
              <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search class or assignment..."
                className="w-full text-sm outline-none text-gray-700 bg-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Class 1 */}
            <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1B2559]">SE18D01</h3>
                  <p className="text-xs font-medium text-gray-500 mt-1">30 Students</p>
                </div>
                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-lg">
                  12 Pending
                </span>
              </div>

              <div className="space-y-3 mt-4">
                <Link
                  to={ROUTES.CLASS_GRADING.replace(':classId', '1')}
                  className="block bg-blue-50 border border-[#4318FF] rounded-xl p-4 hover:bg-blue-100 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-bold text-[#4318FF]">Practical Exam 1</h4>
                    <ArrowRight className="w-4 h-4 text-[#4318FF]" />
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#1B2559]">
                    <span>Graded: 15/30</span>
                    <div className="w-32 bg-gray-200 rounded-full h-1.5 ml-2">
                      <div className="bg-[#4318FF] h-1.5 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                </Link>

                <div className="block bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-bold text-gray-600">Assignment 1 (MVC)</h4>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                    <span>Graded: 0/30</span>
                    <div className="w-32 bg-gray-200 rounded-full h-1.5 ml-2"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Class 2 */}
            <div className="bg-white border border-gray-200 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1B2559]">SE18D02</h3>
                  <p className="text-xs font-medium text-gray-500 mt-1">28 Students</p>
                </div>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-lg">
                  All Graded
                </span>
              </div>

              <div className="space-y-3 mt-4">
                <div className="block bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-bold text-gray-600">Practical Exam 1</h4>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                    <span>Graded: 28/28</span>
                    <div className="w-32 bg-gray-200 rounded-full h-1.5 ml-2">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerGradingAssignmentsPage;

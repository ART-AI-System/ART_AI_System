import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ChevronRight, Download, Users, BarChart2, TrendingUp, TrendingDown, Eye, Search 
} from 'lucide-react';
import { ROUTES } from '../../config/routes';

const LecturerTestAnalyticsPage = () => {
  return (
    <div className="pb-10 flex flex-col h-full bg-[#F4F7FE]">
      {/* TOP HEADER */}
      <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-10 sticky top-0 z-30 shrink-0">
        <div className="flex items-center">
          <Link to={ROUTES.SUBJECT_DETAIL.replace(':id', '1')} className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 hover:bg-[#F26F21] hover:border-[#F26F21] text-gray-500 hover:text-white flex items-center justify-center transition-all mr-5 shadow-sm shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center text-sm font-bold text-gray-400 mb-1 gap-1">
              <Link to={ROUTES.CLASSES} className="hover:text-[#4318FF] transition-colors">My Subjects</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to={ROUTES.SUBJECT_DETAIL.replace(':id', '1')} className="hover:text-[#4318FF] transition-colors">PRJ301</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#F26F21]">Test Analytics</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#1B2559]">Pop Quiz 1: Servlets</h1>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <button className="bg-white border border-gray-200 hover:border-[#F26F21] hover:text-[#F26F21] text-[#1B2559] px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all flex items-center">
            <Download className="w-4 h-4 mr-2" /> Export Grades
          </button>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <div className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-10">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-md">95%</span>
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Completion</p>
              <h3 className="text-3xl font-extrabold text-[#1B2559]">62 <span className="text-lg text-gray-400">/ 65</span></h3>
            </div>

            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#F26F21] flex items-center justify-center">
                  <BarChart2 className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Average Score</p>
              <h3 className="text-3xl font-extrabold text-[#1B2559]">8.2 <span className="text-lg text-gray-400">/ 10</span></h3>
            </div>

            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Highest Score</p>
              <h3 className="text-3xl font-extrabold text-[#1B2559]">10.0</h3>
            </div>

            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Lowest Score</p>
              <h3 className="text-3xl font-extrabold text-[#1B2559]">4.5</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score Distribution Chart (Mock) */}
            <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-gray-100 lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-extrabold text-[#1B2559]">Score Distribution</h2>
              </div>
              
              {/* CSS Bar Chart */}
              <div className="h-64 flex items-end space-x-2 w-full pt-10">
                {/* 0-2 */}
                <div className="flex-1 flex flex-col items-center group">
                  <span className="text-xs font-bold text-gray-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">0</span>
                  <div className="w-full bg-red-100 rounded-t-md h-[5%] relative overflow-hidden group-hover:bg-red-200 transition-colors"></div>
                  <span className="text-xs font-medium text-gray-400 mt-2">0-2</span>
                </div>
                {/* 2-4 */}
                <div className="flex-1 flex flex-col items-center group">
                  <span className="text-xs font-bold text-gray-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">2</span>
                  <div className="w-full bg-red-200 rounded-t-md h-[15%] relative overflow-hidden group-hover:bg-red-300 transition-colors"></div>
                  <span className="text-xs font-medium text-gray-400 mt-2">2-4</span>
                </div>
                {/* 4-6 */}
                <div className="flex-1 flex flex-col items-center group">
                  <span className="text-xs font-bold text-[#1B2559] mb-2 opacity-0 group-hover:opacity-100 transition-opacity">8</span>
                  <div className="w-full bg-orange-200 rounded-t-md h-[40%] relative overflow-hidden group-hover:bg-orange-300 transition-colors"></div>
                  <span className="text-xs font-medium text-gray-400 mt-2">4-6</span>
                </div>
                {/* 6-8 */}
                <div className="flex-1 flex flex-col items-center group">
                  <span className="text-xs font-bold text-[#1B2559] mb-2 opacity-0 group-hover:opacity-100 transition-opacity">22</span>
                  <div className="w-full bg-blue-300 rounded-t-md h-[70%] relative overflow-hidden group-hover:bg-blue-400 transition-colors"></div>
                  <span className="text-xs font-medium text-gray-400 mt-2">6-8</span>
                </div>
                {/* 8-10 */}
                <div className="flex-1 flex flex-col items-center group">
                  <span className="text-xs font-bold text-[#1B2559] mb-2 opacity-0 group-hover:opacity-100 transition-opacity">30</span>
                  <div className="w-full bg-green-400 rounded-t-md h-[95%] relative overflow-hidden group-hover:bg-green-500 transition-colors"></div>
                  <span className="text-xs font-medium text-gray-400 mt-2">8-10</span>
                </div>
              </div>
            </div>

            {/* Hardest Questions */}
            <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-extrabold text-[#1B2559] mb-6">Hardest Questions</h2>
              <div className="space-y-4">
                {/* Q Item */}
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl border border-red-100">
                  <div>
                    <h4 className="font-bold text-red-800 text-sm mb-1">Question 4</h4>
                    <p className="text-xs text-red-600">JSP Implicit Objects</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-xl font-extrabold text-red-600">32%</span>
                    <span className="text-[10px] uppercase font-bold text-red-400">Correct</span>
                  </div>
                </div>
                {/* Q Item */}
                <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <div>
                    <h4 className="font-bold text-orange-800 text-sm mb-1">Question 9</h4>
                    <p className="text-xs text-orange-600">Servlet Lifecycle</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-xl font-extrabold text-orange-600">45%</span>
                    <span className="text-[10px] uppercase font-bold text-orange-400">Correct</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Students Results Table */}
          <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-gray-100 overflow-x-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-extrabold text-[#1B2559] whitespace-nowrap">Student Results</h2>
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search student..." className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F26F21]" />
              </div>
            </div>

            <div className="overflow-x-auto min-w-[800px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-3 px-4">Student</th>
                    <th className="pb-3 px-4">Class</th>
                    <th className="pb-3 px-4">Submitted At</th>
                    <th className="pb-3 px-4 text-center">Score</th>
                    <th className="pb-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {/* Row 1 */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mr-3 shrink-0">HN</div>
                      <div>
                        <p className="font-bold text-[#1B2559] text-sm whitespace-nowrap">HE160001 - Nguyen Van A</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-500 whitespace-nowrap">SE20A09</td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-500 whitespace-nowrap">Today, 10:45 AM</td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 whitespace-nowrap">
                        9.5 / 10
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button className="text-gray-400 hover:text-[#4318FF]"><Eye className="w-5 h-5 mx-auto" /></button>
                    </td>
                  </tr>
                  {/* Row 2 */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs mr-3 shrink-0">LT</div>
                      <div>
                        <p className="font-bold text-[#1B2559] text-sm whitespace-nowrap">HE160002 - Le Thi B</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-500 whitespace-nowrap">SE20A09</td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-500 whitespace-nowrap">Today, 10:42 AM</td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 whitespace-nowrap">
                        4.0 / 10
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button className="text-gray-400 hover:text-[#4318FF]"><Eye className="w-5 h-5 mx-auto" /></button>
                    </td>
                  </tr>
                  {/* Row 3 (Not submitted) */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-xs mr-3 shrink-0">TC</div>
                      <div>
                        <p className="font-bold text-[#1B2559] text-sm whitespace-nowrap">HE160003 - Tran C</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-500 whitespace-nowrap">SE20A10</td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-500 whitespace-nowrap">-</td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500 whitespace-nowrap">
                        Missing
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button className="text-gray-300 cursor-not-allowed"><Eye className="w-5 h-5 mx-auto" /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LecturerTestAnalyticsPage;

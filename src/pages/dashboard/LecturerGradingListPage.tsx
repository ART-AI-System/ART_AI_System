import { Link } from 'react-router-dom';
import { 
  ChevronRight, Download, FileSpreadsheet, Search, 
  FileArchive, AlertTriangle, FileCode, CheckCircle2 
} from 'lucide-react';
import { ROUTES } from '../../config/routes';

const LecturerGradingListPage = () => {
  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* TOP HEADER */}
      <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-10 sticky top-0 z-10 shrink-0">
        <div>
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-500 mb-1">
            <span className="hover:text-[#F26F21] cursor-pointer">Grading</span>
            <ChevronRight className="w-4 h-4" />
            <Link to={ROUTES.CLASS_DETAIL.replace(':id', '1')} className="hover:text-[#F26F21] cursor-pointer">PRJ301 (SE20A09)</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1B2559] font-bold">Practical Exam 1</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#1B2559]">Submissions: Practical Exam</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-3">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all flex items-center">
            <Download className="w-4 h-4 mr-2" /> Download All
          </button>
          <button className="bg-[#1B2559] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-[#2A3673] transition-all flex items-center">
            <FileSpreadsheet className="w-4 h-4 mr-2 text-green-400" /> Export Scores
          </button>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <div className="flex-1 p-4 md:p-10 relative">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Filters & Stats */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              <div className="bg-white border border-gray-200 rounded-xl flex items-center px-4 py-2 shadow-sm w-full md:w-72">
                <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input type="text" placeholder="Search student name or ID..." className="w-full text-sm outline-none text-gray-700 bg-transparent" />
              </div>
              <select className="bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2.5 outline-none shadow-sm cursor-pointer w-full md:w-auto">
                <option>All Status</option>
                <option>Pending (12)</option>
                <option>Graded (15)</option>
                <option>Late (0)</option>
              </select>
            </div>
            
            <div className="flex space-x-6 text-sm">
              <div className="text-center">
                <span className="block text-gray-400 font-bold">Total</span>
                <span className="text-xl font-extrabold text-[#1B2559]">27/35</span>
              </div>
              <div className="text-center">
                <span className="block text-gray-400 font-bold">Pending</span>
                <span className="text-xl font-extrabold text-[#F26F21]">12</span>
              </div>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white border border-gray-200 rounded-[24px] shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 min-w-[1000px]">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">No</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Status & Time</th>
                  <th className="px-6 py-4">File / Link</th>
                  <th className="px-6 py-4">AI Transparency Score</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                
                {/* Row 1: High Discrepancy Alert */}
                <tr className="hover:bg-orange-50/30 transition-colors bg-red-50/10">
                  <td className="px-6 py-4 font-medium">1</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#1B2559]">Nguyen Van Duc</p>
                    <p className="text-xs text-gray-500">270505nguyenvanduc@fpt.edu.vn</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 mb-1">
                      Submitted
                    </span>
                    <p className="text-xs text-gray-500">2026-03-20 10:58:29</p>
                  </td>
                  <td className="px-6 py-4">
                    <a href="#" className="text-[#4318FF] font-bold hover:underline flex items-center">
                      <FileArchive className="w-4 h-4 mr-1" /> PE_DucNV.zip
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col w-48">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-red-600">Declared: 10% | Detected: 95%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-red-500 h-1.5 rounded-full w-[95%]"></div>
                      </div>
                      <span className="text-[10px] font-bold text-red-500 uppercase mt-1 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" /> High Discrepancy
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-400">-</td>
                  <td className="px-6 py-4 text-center">
                    <Link to={ROUTES.GRADING_DETAIL.replace(':submissionId', '1')} className="inline-flex items-center px-4 py-2 bg-[#F26F21] text-white text-xs font-bold rounded-lg hover:bg-[#D95D1A] transition-colors shadow-sm shadow-orange-500/20">
                      Evaluate
                    </Link>
                  </td>
                </tr>

                {/* Row 2: Good AI Usage */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium">2</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#1B2559]">Pham Tuan Viet</p>
                    <p className="text-xs text-gray-500">tuanviet1520@fpt.edu.vn</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 mb-1">
                      Submitted
                    </span>
                    <p className="text-xs text-gray-500">2026-03-20 10:58:54</p>
                  </td>
                  <td className="px-6 py-4">
                    <a href="#" className="text-[#4318FF] font-bold hover:underline flex items-center">
                      <FileCode className="w-4 h-4 mr-1" /> Github Repo Link
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col w-48">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-green-600">Declared: 40% | Detected: 42%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full w-[42%]"></div>
                      </div>
                      <span className="text-[10px] font-bold text-green-600 uppercase mt-1 flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Transparent
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-400">-</td>
                  <td className="px-6 py-4 text-center">
                    <Link to={ROUTES.GRADING_DETAIL.replace(':submissionId', '2')} className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-[#1B2559] text-xs font-bold rounded-lg hover:border-[#4318FF] hover:text-[#4318FF] transition-colors shadow-sm">
                      Evaluate
                    </Link>
                  </td>
                </tr>

                {/* Row 3: Graded */}
                <tr className="hover:bg-gray-50 transition-colors bg-gray-50/50 opacity-80">
                  <td className="px-6 py-4 font-medium">3</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#1B2559]">Pham Chau Vinh</p>
                    <p className="text-xs text-gray-500">vinh0905@fpt.edu.vn</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 mb-1">
                      Graded
                    </span>
                    <p className="text-xs text-gray-500">2026-03-20 10:59:46</p>
                  </td>
                  <td className="px-6 py-4">
                    <a href="#" className="text-gray-500 font-bold hover:underline flex items-center">
                      <FileArchive className="w-4 h-4 mr-1" /> PE_VinhPC.zip
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col w-48">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-green-600">Declared: 0% | Detected: 0%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full w-[0%]"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-extrabold text-[#1B2559] text-lg">8.5</td>
                  <td className="px-6 py-4 text-center">
                    <Link to={ROUTES.GRADING_DETAIL.replace(':submissionId', '3')} className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors">
                      View
                    </Link>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LecturerGradingListPage;

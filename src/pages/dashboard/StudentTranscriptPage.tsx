
import { Download, TrendingUp, Award, Filter } from 'lucide-react';

const StudentTranscriptPage = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B2559]">Academic Transcript</h1>
          <p className="text-gray-500 font-medium mt-1">Software Engineering (SE)</p>
        </div>
        <button className="bg-[#4318FF] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 hover:bg-[#3311CC] transition-all flex items-center">
          <Download className="w-4 h-4 mr-2" /> Download Official Transcript
        </button>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Cumulative GPA</p>
            <h3 className="text-3xl font-extrabold text-[#1B2559]">8.2</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#4318FF] flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Credits Earned</p>
            <h3 className="text-3xl font-extrabold text-[#1B2559]">68</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Subjects Passed</p>
          <h3 className="text-3xl font-extrabold text-green-500">22</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Subjects Failed</p>
          <h3 className="text-3xl font-extrabold text-gray-400">0</h3>
        </div>
      </div>

      {/* GPA Chart Placeholder */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 mb-8 relative overflow-hidden flex flex-col justify-center min-h-[250px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#1B2559]">GPA Progression</h3>
          <div className="flex items-center text-xs font-bold text-gray-500">
            <span className="w-3 h-3 rounded-full bg-[#4318FF] mr-2"></span> Semester GPA
          </div>
        </div>
        {/* Mock SVG Chart */}
        <svg viewBox="0 0 800 150" className="w-full h-32 mt-4 overflow-visible">
          <defs>
            <linearGradient id="gradientLine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4318FF" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#4318FF" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d="M 0 100 L 160 80 L 320 110 L 480 60 L 640 40 L 800 50 L 800 150 L 0 150 Z" fill="url(#gradientLine)" />
          <polyline points="0,100 160,80 320,110 480,60 640,40 800,50" fill="none" stroke="#4318FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="160" cy="80" r="6" fill="#fff" stroke="#4318FF" strokeWidth="3" />
          <circle cx="320" cy="110" r="6" fill="#fff" stroke="#4318FF" strokeWidth="3" />
          <circle cx="480" cy="60" r="6" fill="#fff" stroke="#4318FF" strokeWidth="3" />
          <circle cx="640" cy="40" r="6" fill="#fff" stroke="#4318FF" strokeWidth="3" />
          <circle cx="800" cy="50" r="6" fill="#fff" stroke="#4318FF" strokeWidth="3" />
          
          <text x="160" y="140" textAnchor="middle" className="text-xs fill-gray-400 font-bold">Fall 2024</text>
          <text x="320" y="140" textAnchor="middle" className="text-xs fill-gray-400 font-bold">Spring 2025</text>
          <text x="480" y="140" textAnchor="middle" className="text-xs fill-gray-400 font-bold">Summer 2025</text>
          <text x="640" y="140" textAnchor="middle" className="text-xs fill-gray-400 font-bold">Fall 2025</text>
          <text x="800" y="140" textAnchor="middle" className="text-xs fill-gray-400 font-bold">Spring 2026</text>
        </svg>
      </div>

      {/* Transcript Table */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#1B2559]">Academic Record</h3>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-bold text-gray-500">Group by: Semester</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                <th className="p-4 font-bold">Subject Code</th>
                <th className="p-4 font-bold">Subject Name</th>
                <th className="p-4 font-bold text-center">Credits</th>
                <th className="p-4 font-bold text-center">Grade</th>
                <th className="p-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* Semester Group Header */}
              <tr className="bg-blue-50/30 border-b border-blue-100">
                <td colSpan={5} className="p-3 pl-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#4318FF]">Spring 2026 (Semester 5)</span>
                    <span className="text-xs font-bold text-blue-400">Term GPA: 8.5 • Credits Earned: 15</span>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-600">SWD392</td>
                <td className="p-4 font-bold text-[#1B2559]">Software Architecture & Design</td>
                <td className="p-4 text-center text-gray-500 font-medium">3</td>
                <td className="p-4 text-center font-extrabold text-[#1B2559]">8.8</td>
                <td className="p-4 text-center">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Passed</span>
                </td>
              </tr>
              <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-600">PRJ301</td>
                <td className="p-4 font-bold text-[#1B2559]">Java Web Application Development</td>
                <td className="p-4 text-center text-gray-500 font-medium">3</td>
                <td className="p-4 text-center font-extrabold text-[#1B2559]">8.2</td>
                <td className="p-4 text-center">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Passed</span>
                </td>
              </tr>
              
              {/* Semester Group Header */}
              <tr className="bg-blue-50/30 border-b border-blue-100 border-t-4 border-t-white">
                <td colSpan={5} className="p-3 pl-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#4318FF]">Fall 2025 (Semester 4)</span>
                    <span className="text-xs font-bold text-blue-400">Term GPA: 7.8 • Credits Earned: 15</span>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-600">DBI202</td>
                <td className="p-4 font-bold text-[#1B2559]">Database Systems</td>
                <td className="p-4 text-center text-gray-500 font-medium">3</td>
                <td className="p-4 text-center font-extrabold text-[#1B2559]">7.5</td>
                <td className="p-4 text-center">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Passed</span>
                </td>
              </tr>
              <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-600">PRO192</td>
                <td className="p-4 font-bold text-[#1B2559]">Object-Oriented Programming</td>
                <td className="p-4 text-center text-gray-500 font-medium">3</td>
                <td className="p-4 text-center font-extrabold text-[#1B2559]">8.0</td>
                <td className="p-4 text-center">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Passed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentTranscriptPage;

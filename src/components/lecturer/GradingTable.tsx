import React from 'react';
import { FileArchive, Eye, ShieldAlert, ShieldCheck, Shield, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StudentData {
  id: string;
  name: string;
  studentId: string;
  avatar: string;
  status: 'Submitted' | 'Graded';
  fileName: string;
  repoLink?: string;
  aiStatus: 'High Discrepancy' | 'Transparent' | 'No AI Used';
  declared: number;
  detected: number;
  score: string | number;
}

interface GradingTableProps {
  students: StudentData[];
  onOpenAiDrawer: (studentId: string) => void;
}

const GradingTable: React.FC<GradingTableProps> = ({ students, onOpenAiDrawer }) => {
  
  const getAiBadge = (student: StudentData) => {
    if (student.aiStatus === 'High Discrepancy') {
      return (
        <div 
          onClick={() => onOpenAiDrawer(student.id)}
          className="bg-red-50 border border-red-100 rounded-xl p-2 relative overflow-visible pr-8 cursor-pointer hover:shadow-md transition-all group hover:border-red-300"
        >
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 group-hover:text-red-600 transition-colors opacity-50 group-hover:opacity-100">
            <Eye className="w-4 h-4" />
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl"></div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-red-600 flex items-center uppercase ml-1"><ShieldAlert className="w-3 h-3 mr-1" /> High Discrepancy</span>
          </div>
          <div className="flex justify-between text-xs mt-1 ml-1">
            <div className="text-center w-1/2 border-r border-red-200/50">
              <div className="font-medium text-gray-500 text-[10px]">Declared</div>
              <div className="font-extrabold text-[#1B2559]">{student.declared}%</div>
            </div>
            <div className="text-center w-1/2">
              <div className="font-medium text-gray-500 text-[10px]">Detected</div>
              <div className="font-extrabold text-red-600">{student.detected}%</div>
            </div>
          </div>
        </div>
      );
    }
    
    if (student.aiStatus === 'Transparent') {
      return (
        <div 
          onClick={() => onOpenAiDrawer(student.id)}
          className="bg-green-50 border border-green-100 rounded-xl p-2 relative overflow-visible pr-8 cursor-pointer hover:shadow-md transition-all group hover:border-green-300"
        >
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-green-400 group-hover:text-green-600 transition-colors opacity-50 group-hover:opacity-100">
            <Eye className="w-4 h-4" />
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-xl"></div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-green-600 flex items-center uppercase ml-1"><ShieldCheck className="w-3 h-3 mr-1" /> Transparent</span>
          </div>
          <div className="flex justify-between text-xs mt-1 ml-1">
            <div className="text-center w-1/2 border-r border-green-200/50">
              <div className="font-medium text-gray-500 text-[10px]">Declared</div>
              <div className="font-extrabold text-[#1B2559]">{student.declared}%</div>
            </div>
            <div className="text-center w-1/2">
              <div className="font-medium text-gray-500 text-[10px]">Detected</div>
              <div className="font-extrabold text-green-600">{student.detected}%</div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div 
        onClick={() => onOpenAiDrawer(student.id)}
        className="bg-gray-50 border border-gray-200 rounded-xl p-2 relative overflow-visible pr-8 cursor-pointer hover:shadow-md transition-all group hover:border-gray-300"
      >
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600 transition-colors opacity-50 group-hover:opacity-100">
          <Eye className="w-4 h-4" />
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300 rounded-l-xl"></div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-bold text-gray-500 flex items-center uppercase ml-1"><Shield className="w-3 h-3 mr-1" /> No AI Used</span>
        </div>
        <div className="flex justify-between text-xs mt-1 ml-1">
          <div className="text-center w-1/2 border-r border-gray-200/50">
            <div className="font-medium text-gray-400 text-[10px]">Declared</div>
            <div className="font-extrabold text-gray-500">0%</div>
          </div>
          <div className="text-center w-1/2">
            <div className="font-medium text-gray-400 text-[10px]">Detected</div>
            <div className="font-extrabold text-gray-500">0%</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-[24px] shadow-sm overflow-visible">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4">Student</th>
            <th className="px-6 py-4">Submission</th>
            <th className="px-6 py-4 w-64 text-center">AI Audit</th>
            <th className="px-6 py-4">Score</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {students.map((student) => (
            <tr key={student.id} className={`hover:bg-gray-50 transition-colors group ${student.status === 'Graded' ? 'opacity-70' : ''}`}>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <img src={student.avatar} className={`w-10 h-10 rounded-full mr-3 border border-gray-200 ${student.status === 'Graded' ? 'grayscale' : ''}`} alt={student.name} />
                  <div>
                    <div className="font-extrabold text-[#1B2559]">{student.name}</div>
                    <div className="text-xs font-medium text-gray-400">{student.studentId}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className={`text-xs font-bold px-2 py-1 rounded w-fit mb-1 ${student.status === 'Graded' ? 'text-gray-500 bg-gray-100' : 'text-green-600 bg-green-50'}`}>
                    {student.status}
                  </span>
                  <a href="#" className={`text-sm font-bold flex items-center hover:underline ${student.status === 'Graded' ? 'text-gray-500' : 'text-[#4318FF]'}`}>
                    {student.repoLink ? <ExternalLink className="w-4 h-4 mr-1" /> : <FileArchive className="w-4 h-4 mr-1" />}
                    {student.fileName}
                  </a>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="group relative">
                  {getAiBadge(student)}
                </div>
              </td>
              <td className="px-6 py-4">
                {student.status === 'Graded' ? (
                  <span className="text-lg font-extrabold text-[#1B2559]">{student.score}</span>
                ) : (
                  <span className="text-gray-400 font-bold">-</span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                {student.status === 'Graded' ? (
                  <Link to={`/lecturer/grading/detail/${student.id}`} className="inline-flex px-4 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200 transition-all">
                    View Details
                  </Link>
                ) : student.aiStatus === 'High Discrepancy' ? (
                  <Link to={`/lecturer/grading/detail/${student.id}`} className="inline-flex px-4 py-2 bg-[#F26F21] text-white text-xs font-bold rounded-lg hover:bg-[#D95D1A] transition-all shadow-md shadow-orange-500/20">
                    Evaluate Now
                  </Link>
                ) : (
                  <Link to={`/lecturer/grading/detail/${student.id}`} className="inline-flex px-4 py-2 border-2 border-[#4318FF] text-[#4318FF] text-xs font-bold rounded-lg hover:bg-[#4318FF] hover:text-white transition-all">
                    Evaluate Now
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradingTable;

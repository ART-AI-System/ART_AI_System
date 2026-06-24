
import { Check, CheckCircle2, Loader2, Lock } from 'lucide-react';

const StudentCurriculumPage = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B2559]">Curriculum Roadmap</h1>
          <p className="text-gray-500 font-medium mt-1">Software Engineering (SE) - Catalog 2024</p>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center text-xs font-bold text-gray-500">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span> Passed
          </div>
          <div className="flex items-center text-xs font-bold text-gray-500">
            <span className="w-3 h-3 rounded-full bg-[#4318FF] mr-2"></span> Studying
          </div>
          <div className="flex items-center text-xs font-bold text-gray-500">
            <span className="w-3 h-3 rounded-full bg-gray-300 mr-2"></span> Upcoming
          </div>
        </div>
      </div>

      <div className="max-w-5xl">
        {/* Semester Block: Completed */}
        <div className="mb-12 relative pl-8 border-l-2 border-green-500">
          <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
            <Check className="w-3 h-3 text-green-500" />
          </div>
          <h2 className="text-xl font-extrabold text-[#1B2559] mb-6">Semester 1</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Subject Card */}
            <div className="bg-white border-2 border-green-500/20 rounded-xl p-4 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-full -z-0"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">CSI104</span>
                  <span className="text-xs font-bold text-gray-400">3 cr</span>
                </div>
                <h4 className="text-sm font-bold text-[#1B2559] leading-tight">Introduction to Computing</h4>
                <div className="mt-3 flex items-center text-xs font-bold text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" /> Passed
                </div>
              </div>
            </div>

            {/* Subject Card */}
            <div className="bg-white border-2 border-green-500/20 rounded-xl p-4 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-full -z-0"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">PRF192</span>
                  <span className="text-xs font-bold text-gray-400">3 cr</span>
                </div>
                <h4 className="text-sm font-bold text-[#1B2559] leading-tight">Programming Fundamentals</h4>
                <div className="mt-3 flex items-center text-xs font-bold text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" /> Passed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Semester Block: Current */}
        <div className="mb-12 relative pl-8 border-l-2 border-[#4318FF] border-dashed">
          <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-blue-100 border-2 border-[#4318FF] flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 rounded-full bg-[#4318FF]"></div>
          </div>
          <h2 className="text-xl font-extrabold text-[#1B2559] mb-6 flex items-center">
            Semester 5 <span className="ml-3 text-xs font-bold bg-[#4318FF]/10 text-[#4318FF] px-2 py-1 rounded-md">Current</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Subject Card */}
            <div className="bg-[#4318FF]/5 border-2 border-[#4318FF]/30 rounded-xl p-4 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#4318FF]/10 rounded-bl-full -z-0"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-[#4318FF] bg-white px-2 py-1 rounded shadow-sm">SWD392</span>
                  <span className="text-xs font-bold text-[#4318FF]">3 cr</span>
                </div>
                <h4 className="text-sm font-bold text-[#1B2559] leading-tight">Software Architecture & Design</h4>
                <div className="mt-3 flex items-center text-xs font-bold text-[#4318FF]">
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Studying
                </div>
              </div>
            </div>

            {/* Subject Card */}
            <div className="bg-[#4318FF]/5 border-2 border-[#4318FF]/30 rounded-xl p-4 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#4318FF]/10 rounded-bl-full -z-0"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-[#4318FF] bg-white px-2 py-1 rounded shadow-sm">PRJ301</span>
                  <span className="text-xs font-bold text-[#4318FF]">3 cr</span>
                </div>
                <h4 className="text-sm font-bold text-[#1B2559] leading-tight">Java Web Application</h4>
                <div className="mt-3 flex items-center text-xs font-bold text-[#4318FF]">
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Studying
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Semester Block: Future */}
        <div className="mb-12 relative pl-8 border-l-2 border-gray-200">
          <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
          <h2 className="text-xl font-extrabold text-gray-400 mb-6">Semester 6</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-70 grayscale">
            {/* Subject Card */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">PRN211</span>
                  <span className="text-xs font-bold text-gray-400">3 cr</span>
                </div>
                <h4 className="text-sm font-bold text-gray-600 leading-tight">C# and .NET Framework</h4>
                <div className="mt-3 flex items-center text-xs font-bold text-gray-400">
                  <Lock className="w-3 h-3 mr-1" /> Upcoming
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCurriculumPage;

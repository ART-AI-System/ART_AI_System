import { 
  Clock, ArrowRight
} from 'lucide-react';

const LecturerNewsPage = () => {
  return (
    <div className="flex flex-col h-full bg-[#F4F7FE]">
      {/* DASHBOARD CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth">
        <div className="max-w-5xl mx-auto">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex space-x-2 md:space-x-4">
              <button className="bg-[#1B2559] text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md">All News</button>
              <button className="bg-white text-gray-500 hover:text-[#1B2559] border border-gray-200 hover:border-gray-300 px-5 py-2 rounded-xl text-sm font-bold transition-all">Staff Only</button>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* Lecturer Internal News Item */}
            <article className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group flex flex-col md:flex-row">
              <div className="w-full md:w-64 h-48 md:h-auto bg-gray-200 shrink-0 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80" alt="News thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-[#1B2559]/80 backdrop-blur-md text-white text-[10px] font-bold rounded uppercase tracking-wider">Internal</div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#F26F21] uppercase tracking-wider">Grading Guideline</span>
                  <div className="flex items-center text-xs font-bold text-gray-400">
                    <Clock className="w-4 h-4 mr-1.5" /> June 16, 2026
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#1B2559] mb-2 leading-tight group-hover:text-[#F26F21] transition-colors">How to handle AI Discrepancies &gt; 80%</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  A new workflow has been approved by the Dean regarding how lecturers should process assignments where the system detects an AI likelihood of over 80% while the student declares 0%. Please review the penalty protocol before grading the final exams.
                </p>
                <div className="flex items-center text-sm font-bold text-[#4318FF] mt-auto">
                  Read details <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>

            {/* Public News Item (Shared with Students) */}
            <article className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group flex flex-col md:flex-row">
              <div className="w-full md:w-64 h-48 md:h-auto bg-gray-200 shrink-0 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80" alt="News thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-green-500/80 backdrop-blur-md text-white text-[10px] font-bold rounded uppercase tracking-wider">Public</div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#4318FF] uppercase tracking-wider">Policy Update</span>
                  <div className="flex items-center text-xs font-bold text-gray-400">
                    <Clock className="w-4 h-4 mr-1.5" /> June 15, 2026
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#1B2559] mb-2 leading-tight group-hover:text-[#4318FF] transition-colors">New AI Usage Policy for Summer 2026 Semester</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  Starting from the Summer 2026 semester, the Academic Department has updated the policy regarding the use of Generative AI (such as ChatGPT, Claude, and Copilot) in all coursework.
                </p>
                <div className="flex items-center text-sm font-bold text-[#4318FF] mt-auto">
                  Read details <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerNewsPage;

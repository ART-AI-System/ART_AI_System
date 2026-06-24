
import { ArrowRight, Clock } from 'lucide-react';

const StudentNewsPage = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Featured News Article */}
        <article className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer group">
          <div className="h-64 bg-gray-200 relative overflow-hidden">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80" alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-6 left-8 right-8 text-white">
              <span className="px-3 py-1.5 bg-[#4318FF] text-white text-xs font-bold rounded-lg shadow-sm mb-3 inline-block">Policy Update</span>
              <h2 className="text-3xl font-extrabold leading-tight mb-2">New AI Usage Policy for Summer 2026 Semester</h2>
              <p className="text-sm text-gray-300 font-medium">Published on June 15, 2026 by FPT University Academic Department</p>
            </div>
          </div>
          <div className="p-8">
            <p className="text-gray-600 leading-relaxed mb-6">
              Starting from the Summer 2026 semester, the Academic Department has updated the policy regarding the use of Generative AI (such as ChatGPT, Claude, and Copilot) in all coursework. Students are no longer penalized for using AI, provided that they **transparently declare** every interaction using the ART-AI system...
            </p>
            <button className="text-[#4318FF] font-bold flex items-center hover:underline">
              Read full article <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </article>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* News Item */}
          <article className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="h-40 bg-gray-200 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80" alt="System Maintenance" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <span className="text-xs font-bold text-orange-500 mb-2 block uppercase tracking-wider">System Maintenance</span>
              <h3 className="text-xl font-bold text-[#1B2559] mb-2 leading-tight group-hover:text-[#4318FF] transition-colors">ART-AI System Maintenance Scheduled</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                The system will undergo scheduled maintenance on Sunday, June 20th from 00:00 to 04:00 (GMT+7). During this time, submission functionalities will be temporarily unavailable.
              </p>
              <div className="flex items-center text-xs font-bold text-gray-400">
                <Clock className="w-4 h-4 mr-1.5" /> June 10, 2026
              </div>
            </div>
          </article>

          {/* News Item */}
          <article className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="h-40 bg-gray-200 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80" alt="Guide" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <span className="text-xs font-bold text-green-500 mb-2 block uppercase tracking-wider">Guide & Tutorial</span>
              <h3 className="text-xl font-bold text-[#1B2559] mb-2 leading-tight group-hover:text-[#4318FF] transition-colors">How to declare AI Usage properly</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                A comprehensive guide for students on how to declare prompts, AI responses, and self-reflections to ensure academic integrity and maximize transparency scores.
              </p>
              <div className="flex items-center text-xs font-bold text-gray-400">
                <Clock className="w-4 h-4 mr-1.5" /> May 25, 2026
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default StudentNewsPage;

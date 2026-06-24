import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ChevronRight, Info, Users, Calendar, Settings2, CheckCircle, BrainCircuit 
} from 'lucide-react';
import { ROUTES } from '../../config/routes';

const LecturerCreateAssignmentPage = () => {
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
              <span className="text-[#F26F21]">Create Global Assignment</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#1B2559]">Create New Assignment</h1>
          </div>
        </div>
      </header>

      {/* FORM CONTENT */}
      <div className="flex-1 p-4 md:p-10">
        <div className="max-w-4xl mx-auto">
          
          <form className="space-y-8">
            
            {/* Basic Info */}
            <div className="bg-white rounded-[24px] p-6 md:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-extrabold text-[#1B2559] mb-6 flex items-center">
                <Info className="w-5 h-5 mr-2 text-[#F26F21]" /> Basic Information
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Assignment Title <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] transition-all" placeholder="e.g. Practical Exam 1" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description / Instructions</label>
                  <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] transition-all" placeholder="Provide detailed instructions for the students..."></textarea>
                </div>
              </div>
            </div>

            {/* Target Classes */}
            <div className="bg-white rounded-[24px] p-6 md:p-8 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-extrabold text-[#1B2559] flex items-center">
                  <Users className="w-5 h-5 mr-2 text-[#4318FF]" /> Target Classes <span className="text-red-500 ml-1">*</span>
                </h2>
                <button type="button" className="text-sm font-bold text-[#4318FF] hover:underline">Select All</button>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">Choose which classes will receive this assignment slot. Each class will get an identical copy.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Class Checkbox */}
                <label className="flex items-start p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" className="mt-1 w-4 h-4 text-[#4318FF] border-gray-300 rounded focus:ring-[#4318FF]" />
                  <div className="ml-3">
                    <span className="block text-sm font-bold text-[#1B2559]">SE20A09</span>
                    <span className="block text-xs font-medium text-gray-400 mt-0.5">35 Students</span>
                  </div>
                </label>

                {/* Class Checkbox */}
                <label className="flex items-start p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" className="mt-1 w-4 h-4 text-[#4318FF] border-gray-300 rounded focus:ring-[#4318FF]" />
                  <div className="ml-3">
                    <span className="block text-sm font-bold text-[#1B2559]">SE20A10</span>
                    <span className="block text-xs font-medium text-gray-400 mt-0.5">30 Students</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Timeline & Deadlines */}
            <div className="bg-white rounded-[24px] p-6 md:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-extrabold text-[#1B2559] mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-500" /> Timeline & Schedule
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Start Date <span className="text-red-500">*</span></label>
                  <input type="datetime-local" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] transition-all" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Due Date <span className="text-red-500">*</span></label>
                  <input type="datetime-local" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] transition-all" />
                </div>
              </div>
            </div>

            {/* ART-AI Configurations */}
            <div className="bg-gradient-to-br from-[#1B2559] to-[#2B3A7A] rounded-[24px] p-6 md:p-8 shadow-lg shadow-blue-900/20 relative overflow-hidden">
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                <BrainCircuit className="w-48 h-48 text-white" />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-lg font-extrabold text-white mb-6 flex items-center">
                  <Settings2 className="w-5 h-5 mr-2 text-[#F26F21]" /> ART-AI Assessment Settings
                </h2>
                
                <div className="space-y-6">
                  {/* AI Usage Toggle */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-white">Allow Generative AI Usage</h4>
                      <p className="text-xs text-blue-200 mt-1">If enabled, students can use AI tools but must declare them in the transparency form.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F26F21]"></div>
                    </label>
                  </div>

                  {/* Plagiarism Threshold */}
                  <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                    <label className="block text-sm font-bold text-white mb-2">System AI Detection Threshold (%)</label>
                    <p className="text-xs text-blue-200 mb-4">Set the threshold above which the system will automatically flag the submission for review.</p>
                    <div className="flex items-center space-x-4">
                      <input type="range" min="0" max="100" defaultValue="30" className="w-full h-2 bg-blue-900 rounded-lg appearance-none cursor-pointer accent-[#F26F21]" />
                      <span className="text-white font-bold bg-[#F26F21] px-3 py-1 rounded-lg shrink-0">30%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 pb-10">
              <Link to={ROUTES.SUBJECT_DETAIL.replace(':id', '1')} className="px-6 py-3 rounded-xl font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-all text-center">
                Cancel
              </Link>
              <button type="button" className="px-8 py-3 rounded-xl font-bold text-white bg-[#F26F21] hover:bg-[#D95D1A] shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-2" /> Create Assignment
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default LecturerCreateAssignmentPage;

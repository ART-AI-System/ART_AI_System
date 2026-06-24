import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ChevronRight, Settings, ChevronDown, ChevronUp, Link as LinkIcon, Lock,
  BookOpen, ClipboardList, Clock, FileCode, Users, Plus, Edit2, Trash2
} from 'lucide-react';
import { ROUTES } from '../../config/routes';

const LecturerClassDetailPage = () => {
  const [expandedSlot, setExpandedSlot] = useState<number | null>(2);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  return (
    <div className="pb-10 flex flex-col h-full">
      {/* TOP HEADER */}
      <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-10 sticky top-0 z-30 shrink-0">
        <div className="flex items-center">
          <Link to={ROUTES.SUBJECT_DETAIL.replace(':id', '1')} className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 hover:bg-[#F26F21] hover:border-[#F26F21] text-gray-500 hover:text-white flex items-center justify-center transition-all mr-5 shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-500 mb-1">
              <Link to={ROUTES.CLASSES} className="hover:text-[#F26F21] transition-colors">My Subjects</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to={ROUTES.SUBJECT_DETAIL.replace(':id', '1')} className="hover:text-[#F26F21] transition-colors">PRJ301</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#1B2559] font-bold">SE20A09</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#1B2559]">PRJ301: Java Web Application</h1>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <button className="bg-[#1B2559] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-[#2A3673] transition-all flex items-center">
            <Settings className="w-4 h-4 mr-2" /> Class Settings
          </button>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <div className="flex-1 p-4 md:p-10 relative">
        <div className="max-w-5xl mx-auto">
          
          {/* Timeline/Slot List */}
          <div className="space-y-6">
            
            {/* SLOT 1 */}
            <div className="bg-white border border-gray-200 rounded-[24px] overflow-hidden shadow-sm">
              <div 
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedSlot(expandedSlot === 1 ? null : 1)}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#F26F21] flex flex-col items-center justify-center mr-4">
                    <span className="text-xs font-bold uppercase leading-none">Slot</span>
                    <span className="text-lg font-extrabold leading-none mt-0.5">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1B2559]">Introduction to Servlets</h3>
                    <p className="text-sm text-gray-500 font-medium">09/01/2026 • 09:30 - 11:45</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md mr-3 border border-blue-100 hidden sm:flex items-center" title="Synced from Master Syllabus">
                    <LinkIcon className="w-3 h-3 mr-1" /> Synced
                  </span>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 text-xs font-bold rounded-full mr-4 hidden sm:block">Finished</span>
                  {expandedSlot === 1 ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
              </div>
            </div>

            {/* SLOT 2 (Expanded) */}
            <div className={`bg-white rounded-[24px] overflow-hidden transition-all ${expandedSlot === 2 ? 'border-2 border-[#F26F21]/30 shadow-md' : 'border border-gray-200 shadow-sm'}`}>
              {/* Slot Header */}
              <div 
                className={`flex items-center justify-between p-6 cursor-pointer transition-colors ${expandedSlot === 2 ? 'bg-orange-50/50 border-b border-gray-100' : 'hover:bg-gray-50'}`}
                onClick={() => setExpandedSlot(expandedSlot === 2 ? null : 2)}
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center mr-4 transition-all ${expandedSlot === 2 ? 'bg-[#F26F21] text-white shadow-lg shadow-orange-500/30' : 'bg-orange-50 text-[#F26F21]'}`}>
                    <span className="text-xs font-bold uppercase leading-none">Slot</span>
                    <span className="text-lg font-extrabold leading-none mt-0.5">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1B2559]">Creating the first Application</h3>
                    <p className={`text-sm font-bold ${expandedSlot === 2 ? 'text-[#F26F21]' : 'text-gray-500 font-medium'}`}>11/01/2026 • 09:30 - 11:45</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md mr-4 border border-blue-100 hidden sm:flex items-center" title="Synced from Master Syllabus">
                    <LinkIcon className="w-3 h-3 mr-1" /> Synced
                  </span>
                  {expandedSlot === 2 ? <ChevronUp className="w-5 h-5 text-[#F26F21]" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
              </div>

              {/* Slot Content (Activities) */}
              {expandedSlot === 2 && (
                <div className="p-6 bg-white">
                  {/* Tabs */}
                  <div className="flex border-b border-gray-100 mb-6 overflow-x-auto hide-scrollbar">
                    <button className="px-6 py-3 border-b-2 border-[#F26F21] text-[#F26F21] font-bold text-sm whitespace-nowrap">Content</button>
                    <button className="px-6 py-3 border-b-2 border-transparent text-gray-500 hover:text-gray-900 font-bold text-sm whitespace-nowrap">Students (35)</button>
                  </div>

                  {/* Activities List */}
                  <div className="space-y-4 mb-6">
                    {/* Activity 1 */}
                    <div className="flex items-start p-4 border border-gray-100 rounded-2xl bg-gray-50/50 group hover:border-[#1B2559]/20 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mr-4 shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold text-[#1B2559]">Reading Materials</h4>
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 text-gray-400 hover:text-[#4318FF]"><Edit2 className="w-4 h-4" /></button>
                            <button className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Chapter 2: Servlets lifecycle</p>
                      </div>
                    </div>
                    
                    {/* Activity 2 */}
                    <div className="flex items-start p-4 border border-gray-100 rounded-2xl bg-gray-50/50 group hover:border-[#1B2559]/20 transition-all relative">
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-green-500 rounded-r-full"></div>
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#F26F21] flex items-center justify-center mr-4 shrink-0 ml-2">
                        <ClipboardList className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="bg-[#F26F21] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 inline-block">Assignment</span>
                            <h4 className="text-sm font-bold text-[#1B2559]">Practical Exam 1: Simple Calculator</h4>
                          </div>
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 text-gray-400 hover:text-[#4318FF]"><Edit2 className="w-4 h-4" /></button>
                            <button className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center text-xs text-gray-500 mt-2 gap-4">
                          <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> Due: 2026-03-20</span>
                          <span className="flex items-center text-green-600"><FileCode className="w-3 h-3 mr-1" /> Code Project</span>
                          <span className="flex items-center"><Users className="w-3 h-3 mr-1" /> 27/35 Submitted</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add Activity Button */}
                  <div className="relative">
                    <button 
                      onClick={() => setIsAddMenuOpen(!isAddMenuOpen)} 
                      className="border-2 border-dashed border-gray-200 text-gray-500 font-bold text-sm w-full py-4 rounded-2xl hover:border-[#F26F21] hover:text-[#F26F21] hover:bg-orange-50 transition-all flex items-center justify-center"
                    >
                      <Plus className="w-5 h-5 mr-2" /> Add New Activity
                    </button>
                    
                    {/* Add Menu Dropdown */}
                    {isAddMenuOpen && (
                      <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden">
                        <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center border-b border-gray-50">
                          <BookOpen className="w-4 h-4 mr-3 text-blue-500" /> Reading
                        </button>
                        <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center border-b border-gray-50">
                          <ClipboardList className="w-4 h-4 mr-3 text-green-500" /> Constructive Question
                        </button>
                        <Link to={ROUTES.CREATE_ASSIGNMENT} className="w-full text-left px-4 py-3 text-sm font-bold text-[#F26F21] bg-orange-50 hover:bg-orange-100 flex items-center">
                          <ClipboardList className="w-4 h-4 mr-3 text-[#F26F21]" /> Assignment (Create Slot)
                        </Link>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* SLOT 3 */}
            <div className="bg-white border border-gray-200 rounded-[24px] overflow-hidden shadow-sm opacity-60">
              <div className="flex items-center justify-between p-6 cursor-not-allowed">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-400 flex flex-col items-center justify-center mr-4">
                    <span className="text-xs font-bold uppercase leading-none">Slot</span>
                    <span className="text-lg font-extrabold leading-none mt-0.5">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-500">Session and Cookies</h3>
                    <p className="text-sm text-gray-400 font-medium">13/01/2026 • 09:30 - 11:45</p>
                  </div>
                </div>
                <Lock className="w-5 h-5 text-gray-300" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LecturerClassDetailPage;

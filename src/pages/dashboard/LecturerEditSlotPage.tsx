import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ChevronRight, Save, Info, Paperclip, Plus, FileText, Trash2, ClipboardList, Link as LinkIcon, Unlink
} from 'lucide-react';
import { ROUTES } from '../../config/routes';

const LecturerEditSlotPage = () => {
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
              <span className="text-[#F26F21]">Master Syllabus</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#1B2559]">Edit Slot 1: Intro to Java Web</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="bg-[#F26F21] text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-orange-500/20 hover:bg-[#D95D1A] transition-all flex items-center text-sm md:text-base">
            <Save className="w-4 h-4 mr-2" /> <span className="hidden sm:inline">Save & Sync</span><span className="sm:hidden">Save</span>
          </button>
        </div>
      </header>

      {/* FORM CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Notice */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start">
            <Info className="w-5 h-5 text-orange-500 mt-0.5 mr-3 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-orange-800">Master Slot Edition</h4>
              <p className="text-xs text-orange-600 mt-1">Changes made here will trigger an update notification for all local class instances synced with this Master Slot.</p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-[24px] p-6 md:p-8 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-extrabold text-[#1B2559] mb-6">Slot Information</h2>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Slot No.</label>
                  <input type="number" defaultValue="1" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-[#4318FF] outline-none transition-colors" />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Title <span className="text-red-500">*</span></label>
                  <input type="text" defaultValue="Introduction to Java Web" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:border-[#4318FF] outline-none transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea rows={3} defaultValue="Overview of web architecture and HTTP protocol." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:border-[#4318FF] outline-none transition-colors"></textarea>
              </div>
            </div>
          </div>

          {/* Materials & Assignments */}
          <div className="bg-white rounded-[24px] p-6 md:p-8 border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-lg font-extrabold text-[#1B2559]">Activities & Content</h2>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-4 py-2 text-sm font-bold text-[#4318FF] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center">
                  <Paperclip className="w-4 h-4 mr-2" /> Material
                </button>
                <button className="flex-1 sm:flex-none px-4 py-2 text-sm font-bold text-white bg-[#1B2559] hover:bg-[#2A3673] rounded-lg transition-colors flex items-center justify-center">
                  <Plus className="w-4 h-4 mr-2" /> Assignment
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Reading Material */}
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
                <div className="flex items-center w-full overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-4 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 pr-4">
                    <h4 className="text-sm font-bold text-[#1B2559] truncate">Chapter 1: HTTP Protocol.pdf</h4>
                    <p className="text-xs text-gray-500 truncate">Document • 2.4 MB</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-red-500 shrink-0"><Trash2 className="w-4 h-4" /></button>
              </div>

              {/* Linked Assignment */}
              <div className="flex items-center justify-between p-4 border border-[#F26F21]/30 rounded-xl bg-orange-50/50">
                <div className="flex items-center w-full overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-[#F26F21] text-white flex items-center justify-center mr-4 shadow-sm shrink-0">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 pr-4">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="bg-[#F26F21] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">Assignment</span>
                      <h4 className="text-sm font-bold text-[#1B2559] truncate">Practical Exam 1</h4>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center truncate">
                      <LinkIcon className="w-3 h-3 mr-1 shrink-0" /> <span className="truncate">Linked from Global Assignments</span>
                    </p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-red-500 shrink-0"><Unlink className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LecturerEditSlotPage;

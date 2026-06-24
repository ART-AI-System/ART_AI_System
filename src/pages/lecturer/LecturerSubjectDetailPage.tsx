import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, Bell, ChevronRight, Building2, Users, BookOpen, 
  ClipboardList, HelpCircle, Plus, RefreshCw, Check, Edit2, FileText,
  Calendar, Copy, UploadCloud, List, Clock
} from 'lucide-react';
import { ROUTES } from '../../config/routes';

type Tab = 'classes' | 'syllabus' | 'global' | 'tests';

const LecturerSubjectDetailPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('classes');

  return (
    <div className="pb-10 h-full flex flex-col">
      {/* PREMIUM SUBJECT HEADER */}
      <div className="bg-[#1B2559] pt-6 pb-20 px-10 relative overflow-hidden shrink-0">
        {/* Background Abstract Patterns */}
        <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#4318FF] opacity-30 blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-[-50%] right-[20%] w-[400px] h-[400px] rounded-full bg-[#F26F21] opacity-20 blur-[80px] pointer-events-none"></div>
        
        {/* Top Controls */}
        <div className="flex justify-end items-center space-x-6 mb-8 relative z-10">
          <div className="relative">
            <select className="appearance-none bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#F26F21] transition-all cursor-pointer">
              <option value="SP2026" className="text-gray-900">Spring 2026</option>
            </select>
            <ChevronDown className="w-4 h-4 text-blue-200 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button className="relative p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition-all">
            <Bell className="w-5 h-5" />
          </button>
        </div>

        <div className="relative z-10 flex justify-between items-end">
          <div>
            <div className="flex items-center text-sm font-bold text-blue-200 mb-3">
              <Link to={ROUTES.CLASSES} className="hover:text-white transition-colors">My Subjects</Link>
              <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
              <span className="text-[#F26F21]">PRJ301</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">PRJ301: Java Web Development</h1>
            <p className="text-blue-200 font-medium text-sm flex items-center">
              <Building2 className="w-4 h-4 mr-2 opacity-70" /> Software Engineering Department
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/10 hidden md:flex">
            <div className="px-4 py-2">
              <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Total Classes</p>
              <p className="text-xl font-extrabold text-white">2</p>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="px-4 py-2">
              <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Students</p>
              <p className="text-xl font-extrabold text-white">65</p>
            </div>
          </div>
        </div>
      </div>

      {/* TABS & CONTENT */}
      <div className="flex-1 overflow-y-auto scroll-smooth flex flex-col relative z-20 -mt-10">
        
        {/* Floating Tabs Row */}
        <div className="px-4 md:px-10 sticky top-0 z-30 overflow-x-auto hide-scrollbar pb-2">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-2 flex space-x-2 inline-flex backdrop-blur-xl bg-white/90 whitespace-nowrap">
            <button 
              onClick={() => setActiveTab('classes')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center ${
                activeTab === 'classes' 
                  ? 'bg-[#F26F21] text-white shadow-sm shadow-orange-500/20' 
                  : 'text-gray-500 hover:text-[#1B2559] hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4 mr-2" /> My Classes
            </button>
            <button 
              onClick={() => setActiveTab('syllabus')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center ${
                activeTab === 'syllabus' 
                  ? 'bg-[#F26F21] text-white shadow-sm shadow-orange-500/20' 
                  : 'text-gray-500 hover:text-[#1B2559] hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-4 h-4 mr-2" /> Master Syllabus
            </button>
            <button 
              onClick={() => setActiveTab('global')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center ${
                activeTab === 'global' 
                  ? 'bg-[#F26F21] text-white shadow-sm shadow-orange-500/20' 
                  : 'text-gray-500 hover:text-[#1B2559] hover:bg-gray-50'
              }`}
            >
              <ClipboardList className="w-4 h-4 mr-2" /> Global Assignments
            </button>
            <button 
              onClick={() => setActiveTab('tests')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center ${
                activeTab === 'tests' 
                  ? 'bg-[#F26F21] text-white shadow-sm shadow-orange-500/20' 
                  : 'text-gray-500 hover:text-[#1B2559] hover:bg-gray-50'
              }`}
            >
              <HelpCircle className="w-4 h-4 mr-2" /> Tests & Quizzes
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 md:p-10 max-w-7xl mx-auto w-full">
          {activeTab === 'classes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Class Card */}
              <Link to={ROUTES.CLASS_DETAIL.replace(':id', '1')} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-all hover:-translate-y-1 block">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#F26F21] flex flex-col items-center justify-center font-bold">
                    <Users className="w-6 h-6 mb-1" />
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">Active</span>
                </div>
                <h3 className="font-extrabold text-[#1B2559] text-xl mb-1 group-hover:text-[#F26F21] transition-colors">Class SE20A09</h3>
                <p className="text-sm font-medium text-gray-400 mb-6">Schedule: Mon & Wed, Slot 3</p>
                
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs font-medium text-gray-400 mb-1">Students</p>
                    <p className="text-lg font-bold text-[#1B2559]">35</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                    <p className="text-xs font-medium text-orange-500 mb-1">Pending Tasks</p>
                    <p className="text-lg font-bold text-[#F26F21]">12</p>
                  </div>
                </div>
              </Link>

              {/* Class Card */}
              <Link to={ROUTES.CLASS_DETAIL.replace(':id', '2')} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-all hover:-translate-y-1 block">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#4318FF] flex flex-col items-center justify-center font-bold">
                    <Users className="w-6 h-6 mb-1" />
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">Active</span>
                </div>
                <h3 className="font-extrabold text-[#1B2559] text-xl mb-1 group-hover:text-[#4318FF] transition-colors">Class SE20A10</h3>
                <p className="text-sm font-medium text-gray-400 mb-6">Schedule: Tue & Thu, Slot 2</p>
                
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs font-medium text-gray-400 mb-1">Students</p>
                    <p className="text-lg font-bold text-[#1B2559]">30</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs font-medium text-gray-400 mb-1">Pending Tasks</p>
                    <p className="text-lg font-bold text-[#1B2559]">0</p>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {activeTab === 'syllabus' && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#1B2559]">Master Syllabus (Slots)</h2>
                  <p className="text-sm font-medium text-gray-500 mt-1">Design your teaching slots here and sync them to all your classes.</p>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-white border border-gray-200 hover:border-[#F26F21] hover:text-[#F26F21] text-[#1B2559] px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all flex items-center">
                    <Plus className="w-4 h-4 mr-2" /> Create Slot
                  </button>
                  <button className="bg-[#4318FF] hover:bg-[#3210C4] text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-blue-500/30 transition-all flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2" /> Sync All to Classes
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Master Slot Item */}
                <div className="bg-white border-2 border-[#F26F21]/30 rounded-[24px] overflow-hidden shadow-md">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-orange-50/50 gap-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-xl bg-[#F26F21] text-white flex flex-col items-center justify-center mr-4 shadow-lg shadow-orange-500/30">
                        <span className="text-xs font-bold uppercase leading-none">Slot</span>
                        <span className="text-lg font-extrabold leading-none mt-0.5">1</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#1B2559]">Introduction to Java Web</h3>
                        <p className="text-sm text-[#F26F21] font-bold">Contains: 2 Materials, 1 Assignment</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 ml-16 sm:ml-0">
                      <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center">
                        <Check className="w-4 h-4 mr-1" /> Synced to 2 classes
                      </span>
                      <Link to={ROUTES.EDIT_SLOT.replace(':slotId', '1')} className="p-2 text-gray-400 hover:text-[#4318FF] transition-colors">
                        <Edit2 className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Master Slot Item */}
                <div className="bg-white border border-gray-200 rounded-[24px] overflow-hidden shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-400 flex flex-col items-center justify-center mr-4">
                        <span className="text-xs font-bold uppercase leading-none">Slot</span>
                        <span className="text-lg font-extrabold leading-none mt-0.5">2</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#1B2559]">Servlets Lifecycle</h3>
                        <p className="text-sm text-gray-400 font-medium">Empty slot</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 ml-16 sm:ml-0">
                      <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Not synced</span>
                      <Link to={ROUTES.EDIT_SLOT.replace(':slotId', '2')} className="p-2 text-gray-400 hover:text-[#4318FF] transition-colors">
                        <Edit2 className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'global' && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#1B2559]">Global Assignments</h2>
                  <p className="text-sm font-medium text-gray-500 mt-1">Create an assignment and push it to multiple classes simultaneously.</p>
                </div>
                <Link to={ROUTES.CREATE_ASSIGNMENT} className="bg-[#F26F21] hover:bg-[#E86115] text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-orange-500/20 transition-all flex items-center">
                  <Plus className="w-5 h-5 mr-2" /> Create Global Assignment
                </Link>
              </div>

              <div className="space-y-4">
                {/* Global Assignment Item */}
                <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between group gap-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#F26F21] flex items-center justify-center mr-4 shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1B2559] text-lg">Assignment 1: Database Setup</h3>
                      <div className="flex flex-wrap items-center text-sm font-medium text-gray-500 mt-1 gap-2">
                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> Due: June 25, 2026</span>
                        <span className="hidden md:inline text-gray-300">|</span>
                        <span className="flex items-center"><Copy className="w-4 h-4 mr-1" /> Cloned to 2 classes</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 ml-16 md:ml-0">
                    <div className="flex -space-x-2 mr-4">
                      <span className="w-8 h-8 rounded-full bg-gray-100 text-[#1B2559] flex items-center justify-center text-[10px] font-bold ring-2 ring-white" title="SE20A09">A09</span>
                      <span className="w-8 h-8 rounded-full bg-gray-100 text-[#1B2559] flex items-center justify-center text-[10px] font-bold ring-2 ring-white" title="SE20A10">A10</span>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-[#4318FF] transition-colors">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Global Assignment Item */}
                <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between group gap-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#4318FF] flex items-center justify-center mr-4 shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1B2559] text-lg">Assignment 2: API Endpoints</h3>
                      <div className="flex flex-wrap items-center text-sm font-medium text-gray-500 mt-1 gap-2">
                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> Due: July 10, 2026</span>
                        <span className="hidden md:inline text-gray-300">|</span>
                        <span className="flex items-center"><Copy className="w-4 h-4 mr-1" /> Cloned to 1 class</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 ml-16 md:ml-0">
                    <div className="flex -space-x-2 mr-4">
                      <span className="w-8 h-8 rounded-full bg-gray-100 text-[#1B2559] flex items-center justify-center text-[10px] font-bold ring-2 ring-white" title="SE20A09">A09</span>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-[#4318FF] transition-colors">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tests' && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#1B2559]">Tests & Quizzes</h2>
                  <p className="text-sm font-medium text-gray-500 mt-1">Manage question banks and create tests for this subject.</p>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-white border border-gray-200 hover:border-[#F26F21] hover:text-[#F26F21] text-[#1B2559] px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all flex items-center">
                    <UploadCloud className="w-4 h-4 mr-2" /> Import CSV
                  </button>
                  <Link to={ROUTES.CREATE_TEST} className="bg-[#F26F21] hover:bg-[#E86115] text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-orange-500/20 transition-all flex items-center">
                    <Plus className="w-5 h-5 mr-2" /> Create Test
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                {/* Test Item */}
                <Link to={ROUTES.TEST_ANALYTICS} className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between group hover:border-[#F26F21] transition-all block">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mr-4 shrink-0">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1B2559] text-lg group-hover:text-[#F26F21] transition-colors">Midterm Exam (Spring 2026)</h3>
                      <div className="flex items-center text-sm font-medium text-gray-500 mt-1">
                        <span className="flex items-center"><List className="w-4 h-4 mr-1" /> 50 Questions</span>
                        <span className="mx-3 text-gray-300">|</span>
                        <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> 60 Minutes</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 ml-16 md:ml-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">In Progress</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Completion</p>
                      <p className="font-bold text-[#1B2559]">45/65</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#F26F21]" />
                  </div>
                </Link>
                
                {/* Test Item */}
                <Link to={ROUTES.TEST_ANALYTICS} className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between group hover:border-[#F26F21] transition-all block">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mr-4 shrink-0">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1B2559] text-lg group-hover:text-[#F26F21] transition-colors">Pop Quiz 1: Servlets</h3>
                      <div className="flex items-center text-sm font-medium text-gray-500 mt-1">
                        <span className="flex items-center"><List className="w-4 h-4 mr-1" /> 10 Questions</span>
                        <span className="mx-3 text-gray-300">|</span>
                        <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> 15 Minutes</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 ml-16 md:ml-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                      <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold">Finished</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Avg Score</p>
                      <p className="font-bold text-green-600">8.5 / 10</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#F26F21]" />
                  </div>
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default LecturerSubjectDetailPage;

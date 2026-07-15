import { ChevronLeft, ChevronRight, RefreshCw, Book, Users, Clock, MapPin, Smartphone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';

const SchedulePage = () => {
  return (
    <div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (Calendar & Timeline) */}
        <div className="xl:col-span-2 flex flex-col space-y-6">
          
          {/* Calendar Strip Card */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="w-1.5 h-6 bg-orange-400 rounded-full mr-3"></div>
                <h2 className="text-lg font-bold text-[#1B2559]">My Schedule</h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <button className="p-1.5 text-gray-400 hover:text-[#1B2559]"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="px-4 text-sm font-bold text-[#1B2559]">June 2026</span>
                  <button className="p-1.5 text-gray-400 hover:text-[#1B2559]"><ChevronRight className="w-4 h-4" /></button>
                </div>
                <button className="bg-[#4318FF] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-md shadow-blue-200">
                  <RefreshCw className="w-4 h-4 mr-2" /> Sync EduNext
                </button>
              </div>
            </div>
            
            {/* Dates Strip */}
            <div className="flex justify-between items-center px-2">
              <div className="flex flex-col items-center cursor-pointer group">
                <span className="text-xs font-bold text-gray-400 mb-2 group-hover:text-[#1B2559]">Mon</span>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-gray-500 group-hover:bg-gray-100 transition-colors">15</div>
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <span className="text-xs font-bold text-gray-400 mb-2 group-hover:text-[#1B2559]">Tue</span>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-gray-500 group-hover:bg-gray-100 transition-colors">16</div>
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <span className="text-xs font-bold text-[#4318FF] mb-2">Wed</span>
                <div className="w-10 h-10 rounded-full bg-[#4318FF] text-white shadow-lg shadow-blue-200 flex items-center justify-center text-sm font-bold">17</div>
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <span className="text-xs font-bold text-gray-400 mb-2 group-hover:text-[#1B2559]">Thu</span>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-gray-500 group-hover:bg-gray-100 transition-colors">18</div>
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <span className="text-xs font-bold text-gray-400 mb-2 group-hover:text-[#1B2559]">Fri</span>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-gray-500 group-hover:bg-gray-100 transition-colors">19</div>
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <span className="text-xs font-bold text-gray-400 mb-2 group-hover:text-[#1B2559]">Sat</span>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-gray-500 group-hover:bg-gray-100 transition-colors">20</div>
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <span className="text-xs font-bold text-gray-400 mb-2 group-hover:text-[#1B2559]">Sun</span>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-gray-500 group-hover:bg-gray-100 transition-colors">21</div>
              </div>
            </div>
          </Card>

          {/* Vertical Timeline */}
          <Card 
            className="relative min-h-[600px] p-8"
            style={{ backgroundImage: 'linear-gradient(to bottom, transparent 49px, #f1f5f9 50px)', backgroundSize: '100% 100px' }}
          >
            
            {/* 08:00 AM */}
            <div className="flex absolute top-[0px] w-full items-start pr-8">
              <span className="w-20 text-xs font-bold text-gray-400 mt-2">08.00 AM</span>
              <div className="ml-4 flex-1 mt-6"></div>
            </div>

            {/* 09:00 AM */}
            <div className="flex absolute top-[100px] w-full items-start pr-8">
              <span className="w-20 text-xs font-bold text-gray-900 mt-2">09.00 AM</span>
              
              <div className="ml-4 flex-1 relative group z-10 cursor-pointer">
                <div className="bg-[#34d399] rounded-xl p-3 flex items-center justify-between shadow-md text-white border border-[#10b981]">
                  <div className="flex items-center">
                    <Book className="w-4 h-4 mr-2 opacity-80" />
                    <span className="font-bold text-sm">SWD392 - Software Architecture</span>
                  </div>
                  <div className="flex items-center text-xs font-bold bg-white/20 px-2 py-1 rounded-md backdrop-blur-sm">
                    <Users className="w-3 h-3 mr-1" /> Class SE18D01
                  </div>
                </div>
                
                {/* Hover Popup */}
                <div className="absolute left-1/2 -bottom-48 transform -translate-x-1/2 w-[320px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                  <div className="flex items-center mb-3">
                    <div className="w-1 h-4 bg-[#34d399] rounded-full mr-2"></div>
                    <h4 className="font-bold text-[#1B2559]">SWD392</h4>
                  </div>
                  <div className="flex justify-between items-center mb-3 text-xs text-gray-500 font-medium border-b border-gray-100 pb-2">
                    <span>Slot 3</span>
                    <span>(WED) Jun 17, 2026</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">Introduction to Architectural Patterns. Requires pre-reading chapter 3 and completing the Quiz on EduNext.</p>
                  <div className="flex flex-col space-y-2 mb-4 text-xs font-bold text-[#1B2559]">
                    <div className="flex items-center"><Clock className="w-3.5 h-3.5 mr-2 text-gray-400" /> 09.00 AM - 11.15 AM</div>
                    <div className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-2 text-gray-400" /> Room 302, Gamma Building</div>
                  </div>
                  <Link to="#" className="w-full block text-center py-2 bg-[#4318FF] text-white rounded-lg text-sm font-bold shadow-md shadow-blue-200 pointer-events-auto">Go to Class Material</Link>
                </div>
              </div>
            </div>

            {/* 11:00 AM */}
            <div className="flex absolute top-[300px] w-full items-start pr-8">
              <span className="w-20 text-xs font-bold text-gray-400 mt-2">11.00 AM</span>
              
              <div className="ml-4 flex-1">
                <div className="bg-orange-400 rounded-xl p-3 flex items-center justify-between shadow-md text-white border border-orange-500">
                  <div className="flex items-center">
                    <Smartphone className="w-4 h-4 mr-2 opacity-80" />
                    <span className="font-bold text-sm">PRM392 - Mobile Programming</span>
                  </div>
                  <div className="flex items-center text-xs font-bold bg-white/20 px-2 py-1 rounded-md backdrop-blur-sm">
                    <Users className="w-3 h-3 mr-1" /> Class SE18D01
                  </div>
                </div>
              </div>
            </div>

            {/* 01:00 PM */}
            <div className="flex absolute top-[500px] w-full items-start pr-8">
              <span className="w-20 text-xs font-bold text-gray-400 mt-2">01.00 PM</span>
              
              <div className="ml-4 flex-1">
                <div className="bg-[#4318FF] rounded-xl p-3 flex items-center justify-between shadow-md text-white border border-indigo-600">
                  <div className="flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2 opacity-80" />
                    <span className="font-bold text-sm">SWT301 - Software Testing</span>
                  </div>
                  <div className="flex items-center text-xs font-bold bg-white/20 px-2 py-1 rounded-md backdrop-blur-sm">
                    <Users className="w-3 h-3 mr-1" /> Class SE18D01
                  </div>
                </div>
              </div>
            </div>

          </Card>
        </div>

        {/* Right Column (Stats & Upcoming) */}
        <div className="xl:col-span-1 flex flex-col space-y-6">
          
          {/* Next Class Schedules */}
          <Card>
            <div className="flex items-center mb-6">
              <div className="w-1.5 h-5 bg-[#4318FF] rounded-full mr-3"></div>
              <h3 className="text-lg font-bold text-[#1B2559]">Upcoming Deadlines</h3>
            </div>
            
            <div className="space-y-5">
              {/* Item 1 */}
              <div className="flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-[#1B2559]">17 June, 2026</h4>
                  <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md">Due Today</span>
                </div>
                <p className="text-xs font-medium text-gray-500 mb-2">SWD392 - Assignment 1</p>
                <div className="flex items-center text-xs font-bold text-gray-400 mb-2">
                  <Clock className="w-3 h-3 mr-1" /> 11:59 PM
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                  <div className="bg-red-400 h-1.5 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              
              {/* Item 2 */}
              <div className="flex flex-col pt-5 border-t border-gray-50">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-[#1B2559]">20 June, 2026</h4>
                </div>
                <p className="text-xs font-medium text-gray-500 mb-2">PRM392 - UI Mockup</p>
                <div className="flex items-center text-xs font-bold text-gray-400 mb-2">
                  <Clock className="w-3 h-3 mr-1" /> 08:30 AM
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                  <div className="bg-[#4318FF] h-1.5 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Overall Statistics */}
          <Card className="flex-1">
            <div className="flex items-center mb-6">
              <div className="w-1.5 h-5 bg-[#00bcd4] rounded-full mr-3"></div>
              <h3 className="text-lg font-bold text-[#1B2559]">Overall Statistics</h3>
            </div>
            
            {/* Bar Chart (Attendance) */}
            <div className="mb-8 flex items-end h-20 space-x-2 w-full justify-between pr-8 border-b border-gray-100 pb-2">
              <div className="w-4 bg-[#4318FF] rounded-t-sm h-[60%]"></div>
              <div className="w-4 bg-[#4318FF] rounded-t-sm h-[80%]"></div>
              <div className="w-4 bg-[#4318FF] rounded-t-sm h-[40%]"></div>
              <div className="w-4 bg-[#4318FF] rounded-t-sm h-[100%]"></div>
              <div className="w-4 bg-[#4318FF] rounded-t-sm h-[70%]"></div>
              <div className="flex flex-col items-center justify-end h-full">
                <span className="text-xl font-extrabold text-[#1B2559]">83%</span>
                <span className="text-[10px] font-bold text-gray-400 text-center leading-tight">Avg. Attendance</span>
              </div>
            </div>
            
            {/* Donut Chart (Completion) */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center text-xs font-bold text-gray-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#34d399] mr-2"></span> 77% Completed
                </div>
                <div className="flex items-center text-xs font-bold text-gray-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200 mr-2"></span> 23% To Start
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-extrabold text-[#1B2559]">77%</span>
                  <p className="text-[10px] font-bold text-gray-400 uppercase leading-tight mt-1">Course Completion<br/>(All Subjects)</p>
                </div>
              </div>
              
              <div className="relative w-28 h-28 flex items-center justify-center shadow-sm rounded-full bg-[conic-gradient(#34d399_0%_77%,#e2e8f0_77%_100%)]">
                <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                  <span className="text-xl font-extrabold text-[#1B2559]">04</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Courses</span>
                </div>
              </div>
            </div>

          </Card>
        </div>

      </div>
    </div>
  );
};

export default SchedulePage;

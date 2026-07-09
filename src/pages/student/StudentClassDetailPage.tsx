import { useState } from 'react';
import { ArrowLeft, ChevronDown, FileText, CheckCircle2, FileVideo, Circle, ArrowRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { Card } from '../../components/common/Card';

const ClassDetailPage = () => {
  const [expandedSlots, setExpandedSlots] = useState<string[]>(['s2']);

  const toggleSlot = (slotId: string) => {
    setExpandedSlots(prev => 
      prev.includes(slotId) 
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId]
    );
  };

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <Link to={ROUTES.STUDENT_SUBJECTS} className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-[#4318FF] mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Subjects
          </Link>
          <h1 className="text-3xl font-extrabold text-[#1B2559]">SWD392 - Software Architecture</h1>
          <p className="text-gray-500 font-medium mt-1">Class: SE18D01 • Semester: Summer 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left/Center Column: Slots Accordion & Chart */}
        <div className="xl:col-span-2 flex flex-col space-y-8">
          
          {/* Course Sessions Accordion */}
          <Card className="overflow-hidden p-0">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#1B2559]">Course Sessions</h3>
              <button 
                onClick={() => setExpandedSlots(['s1', 's2'])}
                className="text-sm font-bold text-[#4318FF] hover:underline"
              >
                Expand All
              </button>
            </div>
            
            <div className="divide-y divide-gray-100">
              
              {/* Slot 1 */}
              <div className="group">
                <div 
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors" 
                  onClick={() => toggleSlot('s1')}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center font-bold mr-4">
                      S1
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1B2559] text-base group-hover:text-[#4318FF] transition-colors">Introduction to Design Thinking</h4>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">10 Jun 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full mr-4 hidden md:block">Completed</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedSlots.includes('s1') ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                {expandedSlots.includes('s1') && (
                  <div className="bg-gray-50/50">
                    <div className="p-6 pt-2 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Materials</h5>
                          <ul className="space-y-2">
                            <li>
                              <a href="#" className="flex items-center text-sm font-medium text-gray-700 hover:text-[#4318FF] transition-colors">
                                <FileText className="w-4 h-4 mr-2 text-red-500" /> Design_Thinking_Guide.pdf
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Activities</h5>
                          <ul className="space-y-2">
                            <li className="flex items-center text-sm font-medium text-gray-700">
                              <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Read chapter 1
                            </li>
                            <li className="flex items-center text-sm font-medium text-gray-700">
                              <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Proposal Draft Submitted
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Slot 2 */}
              <div className={`group ${expandedSlots.includes('s2') ? 'border-l-4 border-orange-500' : ''}`}>
                <div 
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors" 
                  onClick={() => toggleSlot('s2')}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold mr-4 shadow-sm">
                      S2
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1B2559] text-base group-hover:text-orange-500 transition-colors">Architectural Patterns (MVC vs MVVM)</h4>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">12 Jun 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full mr-4 hidden md:block border border-orange-100 animate-pulse">Due in 2 days</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedSlots.includes('s2') ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                {expandedSlots.includes('s2') && (
                  <div className="bg-white">
                    <div className="p-6 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                        <div>
                          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Materials</h5>
                          <ul className="space-y-3">
                            <li>
                              <a href="#" className="flex items-center text-sm font-medium text-gray-700 hover:text-[#4318FF] transition-colors p-2 -ml-2 rounded-lg hover:bg-blue-50">
                                <FileVideo className="w-5 h-5 mr-3 text-blue-500" /> 
                                <div>
                                  <p>MVC Pattern Overview</p>
                                  <p className="text-xs text-gray-400">15 mins video</p>
                                </div>
                              </a>
                            </li>
                            <li>
                              <a href="#" className="flex items-center text-sm font-medium text-gray-700 hover:text-[#4318FF] transition-colors p-2 -ml-2 rounded-lg hover:bg-blue-50">
                                <FileText className="w-5 h-5 mr-3 text-red-500" /> 
                                <div>
                                  <p>Microservices.pdf</p>
                                  <p className="text-xs text-gray-400">2.1 MB</p>
                                </div>
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Activities</h5>
                          <ul className="space-y-3">
                            <li className="flex items-start text-sm font-medium text-gray-700">
                              <Circle className="w-4 h-4 mr-2 mt-0.5 text-gray-300" />
                              <div>
                                <p>Quiz 1 (On EduNext)</p>
                                <p className="text-xs text-gray-400">Not started</p>
                              </div>
                            </li>
                            <li className="flex items-start text-sm font-medium text-[#1B2559]">
                              <Circle className="w-4 h-4 mr-2 mt-0.5 text-orange-500" />
                              <div>
                                <p className="font-bold">Assignment: Architecture Diagram</p>
                                <p className="text-xs text-red-500 font-bold">AI Declaration Required</p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      {/* Action Area */}
                      <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-[#1B2559]">Software Architecture Diagram</p>
                          <p className="text-xs text-gray-500 font-medium">Pending submission</p>
                        </div>
                        <Link 
                          to={`/student/assignments/1/submit`} 
                          className="px-6 py-2.5 bg-gradient-to-br from-[#F26F21] to-[#F79C65] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-200 hover:opacity-90 transition-opacity flex items-center"
                        >
                          Start Assignment <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Slot 3 */}
              <div className="group">
                <div className="p-5 flex items-center justify-between cursor-not-allowed opacity-60">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center font-bold mr-4">
                      S3
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-500 text-base">UML & System Design</h4>
                      <p className="text-xs font-medium text-gray-400 mt-0.5">15 Jun 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full mr-4 flex items-center">
                      <Lock className="w-3 h-3 mr-1" /> Locked
                    </span>
                    <ChevronDown className="w-5 h-5 text-gray-300" />
                  </div>
                </div>
              </div>

            </div>
          </Card>

          {/* Bottom Chart Area */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#1B2559]">AI Transparency Usage (By Slot)</h3>
              <div className="flex space-x-4 text-xs font-bold">
                <span className="flex items-center text-gray-500"><span className="w-3 h-3 rounded-full bg-green-400 mr-2"></span> High Transparency</span>
                <span className="flex items-center text-gray-500"><span className="w-3 h-3 rounded-full bg-orange-400 mr-2"></span> Moderate</span>
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between px-4 pb-2 relative border-b border-gray-100">
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs font-bold text-gray-400 pb-2">
                <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0</span>
              </div>
              
              <div className="ml-12 w-full flex justify-around items-end h-full pt-4">
                <div className="flex flex-col items-center group relative cursor-pointer">
                  <div className="absolute -top-16 bg-white p-3 rounded-xl shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-48 pointer-events-none">
                    <p className="text-xs font-bold text-gray-500 mb-1">SLOT 1</p>
                    <p className="text-sm font-bold text-[#1B2559]">Transparency: 85%</p>
                    <p className="text-xs text-green-500 font-medium">4 AI Interactions</p>
                  </div>
                  <div className="w-12 bg-green-400 rounded-t-lg h-[85%] hover:opacity-80 transition-opacity"></div>
                  <span className="text-xs font-bold text-gray-500 mt-3">Slot 1</span>
                </div>
                
                <div className="flex flex-col items-center group relative cursor-pointer">
                  <div className="absolute -top-16 bg-white p-3 rounded-xl shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-10 w-48 pointer-events-none">
                    <p className="text-xs font-bold text-gray-500 mb-1">SLOT 2</p>
                    <p className="text-sm font-bold text-[#1B2559]">Transparency: 40%</p>
                    <p className="text-xs text-orange-500 font-medium">High Dependency Risk</p>
                  </div>
                  <div className="w-12 bg-orange-400 rounded-t-lg h-[40%] hover:opacity-80 transition-opacity"></div>
                  <span className="text-xs font-bold text-gray-500 mt-3">Slot 2</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 bg-gray-200 rounded-t-lg h-[5%]"></div>
                  <span className="text-xs font-bold text-gray-500 mt-3">Slot 3</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 bg-gray-200 rounded-t-lg h-[5%]"></div>
                  <span className="text-xs font-bold text-gray-500 mt-3">Slot 4</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 bg-gray-200 rounded-t-lg h-[5%]"></div>
                  <span className="text-xs font-bold text-gray-500 mt-3">Slot 5</span>
                </div>
              </div>
            </div>
          </Card>

        </div>

        {/* Right Column: Stats & Teachers */}
        <div className="xl:col-span-1 flex flex-col space-y-6">
          
          <Card className="flex flex-col items-center">
            <h3 className="text-lg font-bold text-[#1B2559] w-full text-left mb-6">Class Progression</h3>
            
            <div className="relative w-48 h-48 flex items-center justify-center shadow-inner rounded-full bg-[conic-gradient(#4318FF_0%_10%,#E2E8F0_10%_100%)]">
              <div className="w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.05)]">
                <span className="text-3xl font-extrabold text-[#1B2559]">20</span>
                <span className="text-xs font-bold text-gray-400 uppercase">Slots Total</span>
              </div>
            </div>
            
            <div className="flex justify-between w-full mt-8">
              <div className="flex items-center text-sm font-bold text-gray-700">
                <span className="w-3 h-3 rounded-full bg-[#4318FF] mr-2"></span> 10% Completed
              </div>
              <div className="flex items-center text-sm font-bold text-gray-400">
                <span className="w-3 h-3 rounded-full bg-slate-200 mr-2"></span> 90% To Learn
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-[#1B2559] mb-4">Course Teachers</h3>
            
            <div className="flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
              <img src="https://ui-avatars.com/api/?name=Dr.Smith&background=EBF4FF&color=0072BC" alt="Dr. Smith" className="w-12 h-12 rounded-full shadow-sm" />
              <div className="ml-4">
                <h4 className="text-sm font-bold text-[#1B2559]">Dr. Alan Smith</h4>
                <p className="text-xs font-medium text-gray-500">Software Architecture</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 mt-2 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
              <img src="https://ui-avatars.com/api/?name=Mrs.Anna&background=FCE7F3&color=BE185D" alt="Mrs. Anna" className="w-12 h-12 rounded-full shadow-sm" />
              <div className="ml-4">
                <h4 className="text-sm font-bold text-[#1B2559]">Mrs. Anna Taylor</h4>
                <p className="text-xs font-medium text-gray-500">Subject Head</p>
              </div>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
};

export default ClassDetailPage;

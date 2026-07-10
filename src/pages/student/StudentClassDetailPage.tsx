import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, FileText, CheckCircle2, FileVideo, Circle, ArrowRight, Lock, Plus } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { Card } from '../../components/common/Card';
import axiosClient from '../../api/axiosClient';

const ClassDetailPage = () => {
  const { id } = useParams();
  const [expandedSlots, setExpandedSlots] = useState<string[]>(['1']);
  const [sessions, setSessions] = useState<any[]>([]);
  const [classOverview, setClassOverview] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [sessionRes, classRes, assignmentRes]: any = await Promise.all([
          axiosClient.get(`/classes/${id}/sessions?limit=100`),
          axiosClient.get(`/classes/${id}`).catch(() => ({ result: null })),
          axiosClient.get(`/classes/${id}/grade-items`).catch(() => ({ result: [] }))
        ]);
        
        let fetchedSessions = sessionRes.result?.docs || [];
        // Sort sessions ascending by sessionNo
        fetchedSessions.sort((a: any, b: any) => (a.sessionNo || 0) - (b.sessionNo || 0));
        
        setSessions(fetchedSessions);
        
        if (classRes?.result) {
          setClassOverview(classRes.result);
        }
        setAssignments(assignmentRes?.result || []);
      } catch (err) {
        console.error('Failed to load class details:', err);
      }
    };
    fetchData();
  }, [id]);

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
          <h1 className="text-3xl font-extrabold text-[#1B2559]">
            {classOverview?.subjectSnapshot?.code || 'Subject'} - {classOverview?.subjectSnapshot?.name || 'Class Details'}
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Class: {classOverview?.classCode || '...'} • Semester: {classOverview?.semester?.name || 'Current'}
          </p>
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
              
              {sessions.map((session, index) => (
                <div key={session._id} className="group">
                  <div 
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors" 
                    onClick={() => toggleSlot(session._id)}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#4318FF] flex items-center justify-center font-bold mr-4">
                        S{session.sessionNo}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1B2559] text-base group-hover:text-[#4318FF] transition-colors">{session.title}</h4>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">
                          {new Date(session.startTime).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedSlots.includes(session._id) ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  {expandedSlots.includes(session._id) && (
                    <div className="bg-gray-50/50">
                      <div className="p-6 pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                          {session.description || "No specific instructions for this session."}
                        </div>
                        
                        {assignments.filter((a: any) => a.sessionId === session._id).length > 0 ? (
                          <div className="mt-4 space-y-3">
                            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Assignments</h5>
                            {assignments.filter((a: any) => a.sessionId === session._id).map((assignment: any) => (
                              <div key={assignment._id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex flex-col items-center justify-center mr-4">
                                    <FileText className="w-5 h-5 text-orange-500" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-[#1B2559]">{assignment.title}</p>
                                    <p className="text-xs font-medium text-gray-500">Due: {new Date(assignment.deadline).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <Link 
                                  to={`/student/assignments/${assignment._id}/submit`} 
                                  className="px-4 py-2 bg-gradient-to-br from-[#F26F21] to-[#F79C65] text-white rounded-lg text-xs font-bold shadow-md shadow-orange-200 hover:opacity-90 transition-opacity flex items-center"
                                >
                                  View <ArrowRight className="w-3 h-3 ml-1" />
                                </Link>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-4 p-3 bg-white border border-gray-100 rounded-xl shadow-sm text-xs text-gray-400 text-center font-medium">
                            No assignments or materials for this session yet.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No sessions generated yet.
                </div>
              )}

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
              <img src={`https://ui-avatars.com/api/?name=${classOverview?.lecturer?.fullName || 'Lecturer'}&background=EBF4FF&color=0072BC`} alt="Lecturer" className="w-12 h-12 rounded-full shadow-sm" />
              <div className="ml-4">
                <h4 className="text-sm font-bold text-[#1B2559]">{classOverview?.lecturer?.fullName || 'Lecturer'}</h4>
                <p className="text-xs font-medium text-gray-500">{classOverview?.subjectSnapshot?.name || 'Subject Lecturer'}</p>
              </div>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
};

export default ClassDetailPage;

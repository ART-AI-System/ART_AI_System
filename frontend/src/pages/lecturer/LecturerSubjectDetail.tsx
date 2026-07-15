import React, { useState, useEffect } from 'react';
import { Users, BookOpen, ClipboardList, HelpCircle, Plus, RefreshCw, FileText, Calendar, Copy, Edit2, UploadCloud, ChevronRight, Check, Trash2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const LecturerSubjectDetail = () => {
  const { subjectId } = useParams();
  const [activeTab, setActiveTab] = useState('classes');
  const [classData, setClassData] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, you would fetch details for the specific subject/class based on ID
    // For now, we reuse the class overview or dashboard endpoint to simulate it
    const fetchClassOverview = async () => {
      try {
        const response: any = await axiosClient.get(`/lecturer/classes/${subjectId}/overview`);
        setClassData(response.result);
      } catch (error) {
        console.error('Failed to load subject details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchAssignments = async () => {
      try {
        const res: any = await axiosClient.get(`/classes/${subjectId}/grade-items`);
        setAssignments(res.result || []);
      } catch (error) {
        console.error('Failed to load assignments:', error);
      }
    };

    const fetchSessions = async () => {
      try {
        const res: any = await axiosClient.get(`/classes/${subjectId}/sessions?limit=100`);
        const sortedDocs = (res.result?.docs || []).sort((a: any, b: any) => (a.sessionNo || 0) - (b.sessionNo || 0));
        setSessions(sortedDocs);
      } catch (error) {
        console.error('Failed to load sessions:', error);
      }
    };

    if (subjectId) {
      fetchClassOverview();
      fetchAssignments();
      fetchSessions();
    }
  }, [subjectId]);

  const tabs = [
    { id: 'classes', label: 'My Classes', icon: Users },
    { id: 'syllabus', label: 'Master Syllabus', icon: BookOpen },
    { id: 'global', label: 'Global Assignments', icon: ClipboardList },
    { id: 'tests', label: 'Tests & Quizzes', icon: HelpCircle },
  ];

  return (
    <div className="flex flex-col h-full -mx-10 -mt-10 overflow-x-hidden">
      {/* PREMIUM SUBJECT HEADER */}
      <div className="bg-[#1B2559] pt-16 pb-24 px-10 relative overflow-hidden shrink-0">
        <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#4318FF] opacity-30 blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-[-50%] right-[20%] w-[400px] h-[400px] rounded-full bg-[#F26F21] opacity-20 blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 flex justify-between items-end max-w-7xl mx-auto">
          <div>
            <div className="flex items-center text-sm font-bold text-blue-200 mb-3">
              <Link to="/lecturer/subjects" className="hover:text-white transition-colors">My Subjects</Link>
              <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
              <span className="text-[#F26F21]">{classData?.classCode || 'PRJ301'}</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              {classData?.subjectName || 'Java Web Development'}
            </h1>
            <p className="text-blue-200 font-medium text-sm flex items-center">
               Software Engineering Department
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/10">
            <div className="px-4 py-2">
              <p className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">Students</p>
              <p className="text-xl font-extrabold text-white">{classData?.totalStudents || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* TABS & CONTENT */}
      <div className="flex-1 scroll-smooth flex flex-col relative z-20 -mt-10 mb-10">
        {/* Floating Tabs Row */}
        <div className="px-10 sticky top-0 z-30 flex justify-center mb-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-md border border-gray-100 p-2 flex space-x-2 w-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center ${isActive ? 'bg-[#F26F21] text-white shadow-sm shadow-orange-500/20' : 'text-gray-500 hover:text-[#1B2559] hover:bg-gray-50'}`}
                >
                  <Icon className="w-4 h-4 mr-2" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content: Classes */}
        {activeTab === 'classes' && (
          <div className="p-10 max-w-7xl mx-auto w-full animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col group hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#F26F21] flex flex-col items-center justify-center font-bold">
                    <Users className="w-6 h-6 mb-1" />
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">Active</span>
                </div>
                <h3 className="font-extrabold text-[#1B2559] text-xl mb-1">{classData?.classCode || 'Class'}</h3>
                <p className="text-sm font-medium text-gray-400 mb-6">Schedule: Mon & Wed, Slot 3</p>
                
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs font-medium text-gray-400 mb-1">Students</p>
                    <p className="text-lg font-bold text-[#1B2559]">{classData?.totalStudents || 0}</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                    <p className="text-xs font-medium text-orange-500 mb-1">Pending Tasks</p>
                    <p className="text-lg font-bold text-[#F26F21]">{classData?.pendingReviews || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Master Syllabus */}
        {activeTab === 'syllabus' && (
          <div className="p-10 max-w-7xl mx-auto w-full animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-extrabold text-[#1B2559]">Master Syllabus (Slots)</h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Design your teaching slots here and sync them to all your classes.</p>
              </div>
              <div className="flex space-x-3">
                <button className="bg-[#4318FF] hover:bg-[#3210C4] text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-blue-500/30 transition-all flex items-center">
                  <RefreshCw className="w-4 h-4 mr-2" /> Sync All to Classes
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {sessions.map((session, idx) => (
                <div key={session._id || idx} className="bg-white border border-gray-100 rounded-[24px] shadow-sm hover:shadow-md transition-all">
                  <div 
                    className="flex items-center justify-between p-6 cursor-pointer"
                    onClick={() => setExpandedSession(expandedSession === session._id ? null : session._id)}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#F26F21] flex items-center justify-center mr-4">
                        <span className="text-xl font-extrabold">{(session.sessionNo || idx + 1).toString().padStart(2, '0')}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#1B2559]">{(session.title || `Slot ${idx + 1}`).replace(/Session/gi, 'Slot')}</h3>
                        <p className="text-sm text-gray-500 font-medium">
                          {session.startTime ? new Date(session.startTime).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedSession === session._id ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                  
                  {expandedSession === session._id && (
                    <div className="px-6 pb-6 border-t border-gray-50 pt-4 bg-gray-50/50 rounded-b-[24px]">
                      
                      {/* List assignments for this slot */}
                      {assignments.filter((a: any) => a.sessionId === session._id).length > 0 && (
                        <div className="mb-4 space-y-2">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Assignments & Tasks</h4>
                          {assignments.filter((a: any) => a.sessionId === session._id).map((assignment: any) => (
                            <div key={assignment._id} className="bg-white border border-gray-200 rounded-xl p-3 flex justify-between items-center shadow-sm">
                              <div className="flex items-center">
                                <FileText className="w-5 h-5 text-orange-500 mr-3" />
                                <div>
                                  <p className="text-sm font-bold text-[#1B2559]">{assignment.title}</p>
                                  <p className="text-xs text-gray-400 font-medium">Due: {new Date(assignment.deadline).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                  <Link 
                                    to={`/lecturer/grading/${subjectId}`} 
                                    state={{ selectedGradeItemId: assignment._id }} 
                                    className="px-3 py-1.5 bg-indigo-50 text-[#4318FF] text-xs font-bold rounded-lg hover:bg-[#4318FF] hover:text-white transition-colors flex items-center"
                                  >
                                    Grade
                                  </Link>
                                  <Link 
                                    to={`/lecturer/assignments/${assignment._id}/edit`} 
                                    className="p-1.5 text-gray-400 hover:text-[#4318FF] rounded-lg transition-colors"
                                    title="Edit Assignment"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Link>
                                  <button 
                                    onClick={async () => {
                                      if (window.confirm('Are you sure you want to delete this assignment?')) {
                                        try {
                                          await axiosClient.delete(`/grade-items/standalone/${assignment._id}`);
                                          setAssignments(prev => prev.filter(a => a._id !== assignment._id));
                                        } catch (error) {
                                          console.error('Failed to delete assignment:', error);
                                          alert('Failed to delete assignment');
                                        }
                                      }
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                    title="Delete Assignment"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-200/50">
                        <Link to={`/lecturer/assignments/create?sessionId=${session._id}&classId=${subjectId}`} className="bg-white border border-gray-200 hover:border-orange-200 hover:text-[#F26F21] px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center shadow-sm">
                          <Plus className="w-4 h-4 mr-2" /> Add Assignment
                        </Link>
                        <Link to={`/lecturer/tests/create?sessionId=${session._id}&classId=${subjectId}`} className="bg-white border border-gray-200 hover:border-blue-200 hover:text-[#4318FF] px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center shadow-sm">
                          <Plus className="w-4 h-4 mr-2" /> Add Test
                        </Link>
                        <button className="bg-white border border-gray-200 hover:border-green-200 hover:text-green-600 px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center shadow-sm">
                          <UploadCloud className="w-4 h-4 mr-2" /> Upload Material
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {sessions.length === 0 && !loading && (
                <div className="text-center py-10 text-gray-500 font-medium">
                  No slots generated yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Global Assignments */}
        {activeTab === 'global' && (
          <div className="p-10 max-w-7xl mx-auto w-full animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-extrabold text-[#1B2559]">Global Assignments</h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Create an assignment and push it to multiple classes simultaneously.</p>
              </div>
              {/* HERE IS THE CREATE ASSIGNMENT BUTTON FROM THE MOCKUP */}
              <Link to={`/lecturer/assignments/create?classId=${subjectId}`} className="bg-[#F26F21] hover:bg-[#E86115] text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-orange-500/20 transition-all flex items-center">
                <Plus className="w-5 h-5 mr-2" /> Create Global Assignment
              </Link>
            </div>

            <div className="space-y-4">
              {assignments.length > 0 ? assignments.map((assignment, idx) => (
                <div key={assignment._id || idx} className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm flex items-center justify-between group">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#F26F21] flex items-center justify-center mr-4">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1B2559] text-lg">{assignment.title}</h3>
                      <div className="flex items-center text-sm font-medium text-gray-500 mt-1">
                        <Calendar className="w-4 h-4 mr-1" /> Due: {new Date(assignment.deadline).toLocaleDateString()}
                        <span className="mx-3 text-gray-300">|</span>
                        <Copy className="w-4 h-4 mr-1" /> Weight: {assignment.weight}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Link to={`/lecturer/assignments/${assignment._id}/edit`} className="p-2 text-gray-400 hover:text-[#4318FF] transition-colors"><Edit2 className="w-5 h-5" /></Link>
                    <button 
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this global assignment?')) {
                          try {
                            await axiosClient.delete(`/grade-items/standalone/${assignment._id}`);
                            setAssignments(prev => prev.filter(a => a._id !== assignment._id));
                          } catch (error) {
                            console.error('Failed to delete assignment:', error);
                            alert('Failed to delete assignment');
                          }
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete Assignment"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-gray-500 text-center py-10">No global assignments created yet.</div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Tests & Quizzes */}
        {activeTab === 'tests' && (
          <div className="p-10 max-w-7xl mx-auto w-full animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-extrabold text-[#1B2559]">Tests & Quizzes</h2>
                <p className="text-sm font-medium text-gray-500 mt-1">Manage question banks and create tests for this subject.</p>
              </div>
              <div className="flex space-x-3">
                <button className="bg-white border border-gray-200 hover:border-[#F26F21] hover:text-[#F26F21] text-[#1B2559] px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all flex items-center">
                  <UploadCloud className="w-4 h-4 mr-2" /> Import CSV
                </button>
                <Link to="/lecturer/tests/create" className="bg-[#F26F21] hover:bg-[#E86115] text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-orange-500/20 transition-all flex items-center">
                  <Plus className="w-5 h-5 mr-2" /> Create Test
                </Link>
              </div>
            </div>

            <div className="text-center text-gray-500 font-medium p-8 bg-white rounded-[24px] shadow-sm border border-gray-100">
              No tests created yet.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LecturerSubjectDetail;

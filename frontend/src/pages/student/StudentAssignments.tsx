import React, { useEffect, useState } from 'react';
import { Clock, Calendar, HelpCircle, ArrowRight, ExternalLink, Eye, X, CheckCircle2, Brain, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const StudentAssignments = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [classes, setClasses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [filter, setFilter] = useState('upcoming'); // upcoming, past_due, completed
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [viewingSubmission, setViewingSubmission] = useState<any>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        // 1. Fetch student's classes (from home API)
        const homeRes: any = await axiosClient.get('/student/home');
        const subjects = homeRes.result?.subjects || [];
        setClasses(subjects);
        
        // 2. Fetch gradeItems for each class
        if (subjects.length > 0) {
          const promises = subjects.map((subj: any) => 
            axiosClient.get(`/classes/${subj.classId}/grade-items`)
              .then((res: any) => {
                // Attach class info to each assignment
                return (res.result || []).map((item: any) => ({
                  ...item,
                  classInfo: subj
                }));
              })
              .catch(() => []) // Ignore errors for individual classes
          );
          
          const results = await Promise.all(promises);
          const allAssignments = results.flat();
          
          // 3. Fetch user's submissions to know what is submitted
          const submissionsRes: any = await axiosClient.get('/students/me/submissions');
          const submittedItems = submissionsRes.result || [];
          
          // 4. Merge data to determine status
          const finalAssignments = allAssignments.map((assignment: any) => {
            const submission = submittedItems.find((s: any) => s.gradeItemId === assignment._id);
            const now = new Date();
            const deadline = new Date(assignment.deadline);
            
            let status = 'pending';
            if (submission) {
              status = 'completed';
            } else if (now > deadline) {
              status = 'past_due';
            }
            
            return {
              ...assignment,
              submissionStatus: status,
              submission
            };
          });
          
          // Sort by deadline ascending
          finalAssignments.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
          
          setAssignments(finalAssignments);
        }
      } catch (err) {
        console.error('Failed to fetch assignments:', err);
        setError('Failed to load assignments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const filteredAssignments = assignments.filter(assignment => {
    // Status Filter
    if (filter === 'upcoming' && assignment.submissionStatus !== 'pending') return false;
    if (filter === 'past_due' && assignment.submissionStatus !== 'past_due') return false;
    if (filter === 'completed' && assignment.submissionStatus !== 'completed') return false;
    
    // Subject Filter
    if (subjectFilter !== 'all' && assignment.classInfo.classId !== subjectFilter) return false;
    
    return true;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B2559]">My Assignments</h1>
          <p className="text-gray-500 font-medium mt-1">Track your upcoming deadlines and past submissions</p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center space-x-3 mt-4 md:mt-0 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          <button 
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'upcoming' ? 'bg-[#4318FF] text-white shadow-sm' : 'text-gray-500 hover:text-[#1B2559] hover:bg-gray-50'}`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setFilter('past_due')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'past_due' ? 'bg-[#4318FF] text-white shadow-sm' : 'text-gray-500 hover:text-[#1B2559] hover:bg-gray-50'}`}
          >
            Past Due
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'completed' ? 'bg-[#4318FF] text-white shadow-sm' : 'text-gray-500 hover:text-[#1B2559] hover:bg-gray-50'}`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Subject Filter */}
      <div className="mb-6 shrink-0">
        <select 
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="bg-white border border-gray-200 text-sm font-bold text-gray-600 rounded-xl px-4 py-3 outline-none focus:border-[#4318FF] shadow-sm w-full max-w-xs"
        >
          <option value="all">All Subjects</option>
          {classes.map(cls => (
            <option key={cls.classId} value={cls.classId}>
              {cls.subjectCode} - {cls.classCode}
            </option>
          ))}
        </select>
      </div>

      {/* Assignments List */}
      <div className="flex-1 overflow-y-auto hide-scrollbar space-y-4 pb-10">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4318FF]"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-bold p-4 bg-red-50 rounded-xl border border-red-100">
            {error}
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="text-center text-gray-500 font-medium p-8 bg-white rounded-[24px] shadow-sm border border-gray-100">
            No assignments found for the selected filters.
          </div>
        ) : (
          filteredAssignments.map((assignment: any, index: number) => {
            const isUrgent = assignment.submissionStatus === 'pending' && new Date(assignment.deadline).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000;
            const isCompleted = assignment.submissionStatus === 'completed';
            const isPastDue = assignment.submissionStatus === 'past_due';
            
            return (
              <div 
                key={assignment._id} 
                className={`bg-white rounded-[24px] shadow-sm border p-6 flex flex-col md:flex-row md:items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow
                  ${isUrgent ? 'border-orange-200' : isCompleted ? 'border-green-200' : isPastDue ? 'border-red-200' : 'border-gray-100'}`}
              >
                <div className={`absolute top-0 left-0 w-1.5 h-full ${isUrgent ? 'bg-orange-500' : isCompleted ? 'bg-green-500' : isPastDue ? 'bg-red-500' : 'bg-blue-400'}`}></div>
                
                <div className="flex-1 flex flex-col md:flex-row md:items-center ml-2">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg mr-6 mb-4 md:mb-0 shrink-0
                    ${isUrgent ? 'bg-orange-50 text-orange-500' : isCompleted ? 'bg-green-50 text-green-500' : isPastDue ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                    <Calendar className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg border border-gray-200">
                        {assignment.classInfo.classCode}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${isUrgent ? 'text-orange-500 bg-orange-50' : isCompleted ? 'text-green-600 bg-green-50' : isPastDue ? 'text-red-500 bg-red-50' : 'text-gray-500'}`}>
                        {isCompleted ? 'Submitted' : `Due: ${new Date(assignment.deadline).toLocaleDateString()}`}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#1B2559]">{assignment.title}</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1 truncate max-w-2xl">
                      {assignment.description || 'No description provided.'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 md:mt-0 md:ml-8 flex flex-col items-start md:items-end shrink-0">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-3">
                    {isCompleted ? 'Completed' : isPastDue ? 'Overdue' : 'Not Submitted'}
                  </p>
                  {!isCompleted && !isPastDue && (
                    <button 
                      onClick={() => navigate(`/student/assignments/${assignment._id}/submit`)}
                      className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all flex items-center text-white
                        ${isUrgent ? 'bg-gradient-to-br from-[#F26F21] to-[#F79C65] hover:opacity-90 shadow-orange-200' : 'bg-[#4318FF] hover:bg-blue-700 shadow-blue-200'}`}
                    >
                      Start Assignment <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
                  {isCompleted && (
                    <button 
                      onClick={() => setViewingSubmission(assignment.submission)}
                      className="px-6 py-2.5 bg-green-50 text-green-600 rounded-xl text-sm font-bold shadow-sm hover:bg-green-100 transition-colors flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-2" /> View Details
                    </button>
                  )}
                  {isPastDue && (
                    <button 
                      onClick={() => navigate(`/student/assignments/${assignment._id}/submit`)}
                      className="px-6 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors flex items-center"
                    >
                      Submit Late <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submission Detail Modal */}
      {viewingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[24px] shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-[#1B2559]">Submission Details</h2>
              <button 
                onClick={() => setViewingSubmission(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="mb-6 flex items-center justify-between bg-green-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-800">Status: Submitted</p>
                    <p className="text-xs text-green-600">{new Date(viewingSubmission.updatedAt || viewingSubmission.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => window.open(viewingSubmission.fileUrl || '#', '_blank')}
                  className="px-4 py-2 bg-white border border-green-200 text-green-700 rounded-lg text-sm font-bold hover:bg-green-50 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" /> File
                </button>
              </div>

              <h3 className="text-lg font-bold text-[#1B2559] mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-[#4318FF]" /> AI Declaration Info
              </h3>
              
              {(!viewingSubmission.aiInteractions || viewingSubmission.aiInteractions.length === 0) ? (
                <div className="text-center p-6 bg-gray-50 rounded-xl text-gray-500 font-medium">
                  No AI declarations submitted.
                </div>
              ) : (
                <div className="space-y-4">
                  {viewingSubmission.aiInteractions.map((interaction: any, idx: number) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                          {interaction.aiTool || 'AI Tool'}
                        </span>
                        <span className="text-sm font-bold text-gray-500">
                          Purpose: {interaction.usagePurpose?.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-bold text-gray-700 mb-1">Prompt Used:</p>
                          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{interaction.promptContent || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="font-bold text-gray-700 mb-1">AI Response Summary:</p>
                          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{interaction.aiResponseSummary || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="font-bold text-gray-700 mb-1">Self Reflection:</p>
                          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{interaction.reflectionText || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setViewingSubmission(null)}
                className="px-6 py-2 bg-[#1B2559] text-white rounded-lg text-sm font-bold hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;

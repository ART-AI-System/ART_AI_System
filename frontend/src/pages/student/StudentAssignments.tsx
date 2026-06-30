import React, { useEffect, useState } from 'react';
import { Clock, Calendar, HelpCircle, ArrowRight, ExternalLink } from 'lucide-react';
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
                      className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold shadow-sm cursor-default"
                    >
                      Submitted
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
    </div>
  );
};

export default StudentAssignments;

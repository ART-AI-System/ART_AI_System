import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, Send, ChevronRight, 
  Download, FileText, AlertOctagon, CheckCircle2
} from 'lucide-react';
import { submissionService } from '../../services/submission.service';
import { gradeService } from '../../services/grade.service';
import { reviewService } from '../../services/review.service';
import axiosClient from '../../api/axiosClient';

type Tab = 'ai' | 'grade';

const LecturerGradingDetailPage = () => {
  const { submissionId: id } = useParams<{ submissionId: string }>();
  const [searchParams] = useSearchParams();
  const targetStudentId = searchParams.get('studentId');
  
  const [activeTab, setActiveTab] = useState<Tab>('ai');
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<any>(null);
  const [aiInteractions, setAiInteractions] = useState<any[]>([]);
  
  const [score, setScore] = useState<number | ''>('');
  const [feedback, setFeedback] = useState<string>('');
  const [reviewStatus, setReviewStatus] = useState<any>('pending');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradeSaved, setGradeSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [subRes, aiRes, gradeRes, reviewRes] = await Promise.all([
          submissionService.getSubmissionById(id).catch(() => null),
          submissionService.getAiInteractions(id).catch(() => null),
          targetStudentId ? axiosClient.get(`/submissions/${id}/grade?studentId=${targetStudentId}`).catch(() => null) : gradeService.getGrade(id).catch(() => null),
          reviewService.getReview(id).catch(() => null)
        ]);

        if (subRes) setSubmission((subRes as any).data?.result || (subRes as any).result || (subRes as any).data || subRes);
        if (aiRes) setAiInteractions((aiRes as any).data?.result || (aiRes as any).result || (aiRes as any).data || []);
        
        const gradeData = (gradeRes as any)?.data?.result || (gradeRes as any)?.result || (gradeRes as any)?.data;
        if (gradeData) {
          setScore(gradeData.score);
          setFeedback(gradeData.feedback || '');
          setGradeSaved(true);
        } else {
          setScore('');
          setFeedback('');
          setGradeSaved(false);
        }

        const reviewData = (reviewRes as any)?.data?.result || (reviewRes as any)?.result || (reviewRes as any)?.data;
        if (reviewData) {
          setReviewStatus(reviewData.reviewStatus);
          setComment(reviewData.comment || '');
        }
      } catch (err) {
        console.error('Failed to load grading details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePublishGrade = async () => {
    if (!id || score === '') return;
    setIsSubmitting(true);
    try {
      // Create/Update Grade and Review concurrently
      await Promise.all([
        gradeService.createGrade(id, { score: Number(score), maxScore: 10, feedback, studentId: targetStudentId || undefined }),
        reviewService.createReview(id, { reviewStatus, comment })
      ]);
      setGradeSaved(true);
      alert('Grade and Review saved successfully!');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save grade and review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    if (id) {
      submissionService.downloadSubmissionLatest(id).catch(console.error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12 h-full items-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4318FF]"></div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-full bg-gray-50">
        <h2 className="text-xl font-bold text-gray-700">Submission not found</h2>
        <Link to="/lecturer/dashboard" className="text-[#4318FF] mt-4 font-bold hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  const studentName = submission.studentId?.fullName || 'Unknown Student';
  const studentRoll = submission.studentId?.rollNumber || '';
  const assignmentTitle = submission.gradeItemId?.title || 'Assignment';
  const className = submission.classId?.classCode || 'Unknown Class';

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* TOP HEADER */}
      <header className="h-16 bg-[#1B2559] text-white flex items-center justify-between px-6 shrink-0 shadow-md relative z-20">
        <div className="flex items-center">
          <Link to={`/lecturer/classes/${submission.classId?._id || 'unknown'}/submissions`} className="p-2 mr-4 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div>
            <div className="flex items-center text-[10px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">
              <Link to="/classes" className="hover:text-white transition-colors">Grading</Link>
              <ChevronRight className="w-3 h-3 mx-1" />
              <Link to="#" className="hover:text-white transition-colors">{className}</Link>
              <ChevronRight className="w-3 h-3 mx-1" />
              <Link to="#" className="hover:text-white transition-colors">{assignmentTitle}</Link>
            </div>
            <h1 className="text-sm font-bold">{studentName} {studentRoll ? `(${studentRoll})` : ''}</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={handlePublishGrade}
            disabled={isSubmitting || score === ''}
            className={`px-6 py-2 text-white text-sm font-bold rounded-xl transition-all shadow-lg flex items-center ${isSubmitting || score === '' ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-br from-[#F26F21] to-[#F79C65] hover:opacity-90 shadow-orange-500/30'}`}
          >
            {isSubmitting ? 'Saving...' : gradeSaved ? 'Update Grade & Review' : 'Save Grade & Review'} <Send className="w-4 h-4 ml-2" />
          </button>
        </div>
      </header>

      {/* SPLIT VIEW CONTAINER */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANE: DOCUMENT VIEWER */}
        <div className="flex-1 flex flex-col border-r border-gray-200 bg-white min-w-0">
          
          {/* Toolbar */}
          <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4 justify-between shrink-0">
            <div className="flex items-center space-x-2 text-sm text-gray-600 font-medium overflow-hidden whitespace-nowrap">
              <FileText className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="font-bold text-[#1B2559] truncate">{submission.fileName || 'Document'}</span>
            </div>
            <div className="flex items-center space-x-2 shrink-0 ml-4">
              <button onClick={handleDownload} className="p-1.5 text-gray-500 hover:text-[#1B2559] hover:bg-gray-200 rounded transition-colors" title="Download File">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Embedded File Viewer */}
          <div className="flex-1 flex overflow-hidden bg-gray-100 items-center justify-center relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
              <FileText className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-700">Document Viewer Preview</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-md">The file is securely stored on the server. Please download the file to view its contents, or use a PDF integration.</p>
              <button 
                onClick={handleDownload}
                className="mt-6 px-6 py-2.5 bg-[#4318FF] text-white rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" /> Download Document
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: EVALUATION PANEL */}
        <div className="w-full md:w-[450px] lg:w-[500px] shrink-0 bg-white flex flex-col shadow-xl z-10 relative border-l border-gray-200">
          
          {/* Tabs Header */}
          <div className="flex border-b border-gray-200 shrink-0">
            <button 
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors relative ${activeTab === 'ai' ? 'border-[#F26F21] text-[#F26F21]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
              AI Declarations ({aiInteractions.length})
            </button>
            <button 
              onClick={() => setActiveTab('grade')}
              className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'grade' ? 'border-[#4318FF] text-[#4318FF]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
              Grading
            </button>
          </div>

          {/* Tab Content: AI Declaration */}
          {activeTab === 'ai' && (
            <div className="flex-1 overflow-y-auto hide-scrollbar p-6 bg-gray-50/30">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Student's AI Declarations</h3>
              
              {aiInteractions.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center shadow-sm">
                  <AlertOctagon className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-600">No AI Interactions Declared</p>
                  <p className="text-xs text-gray-400 mt-1">The student did not submit any AI declarations for this assignment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiInteractions.map((interaction, idx) => (
                    <div key={interaction._id || idx} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-50">
                        <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg uppercase tracking-wide">
                          {interaction.usagePurpose?.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-bold text-gray-400 flex items-center">
                          Tool: <span className="ml-1 text-gray-700 uppercase">{interaction.aiTool}</span>
                        </span>
                      </div>
                      
                      <div className="space-y-4 text-sm">
                        <div>
                          <p className="text-xs font-bold text-gray-500 mb-1">Prompt / Input</p>
                          <div className="bg-gray-50 p-3 rounded-xl text-gray-700 whitespace-pre-wrap">
                            {interaction.promptContent}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-500 mb-1">AI Response Summary</p>
                          <div className="bg-gray-50 p-3 rounded-xl text-gray-700 whitespace-pre-wrap">
                            {interaction.aiResponseSummary}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-500 mb-1 flex justify-between">
                            <span>Student's Reflection</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                              interaction.studentDecision === 'accepted' ? 'bg-green-100 text-green-700' : 
                              interaction.studentDecision === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                              {interaction.studentDecision?.replace('_', ' ')}
                            </span>
                          </p>
                          <div className="border border-blue-100 bg-blue-50/30 p-3 rounded-xl text-[#1B2559] italic whitespace-pre-wrap">
                            "{interaction.reflectionText}"
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Grading */}
          {activeTab === 'grade' && (
            <div className="flex-1 overflow-y-auto hide-scrollbar p-6 bg-gray-50/30">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Evaluation Details</h3>
              
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6">
                <label className="block text-sm font-bold text-[#1B2559] mb-3">Overall Score (out of 10)</label>
                <div className="flex items-center">
                  <input 
                    type="number" 
                    min="0" max="10" step="0.1"
                    value={score}
                    onChange={(e) => setScore(e.target.value !== '' ? Number(e.target.value) : '')}
                    className="w-24 text-center bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-2xl font-black text-[#4318FF] outline-none focus:border-[#4318FF] focus:ring-1 focus:ring-[#4318FF]"
                    placeholder="0.0"
                  />
                  <span className="text-xl font-bold text-gray-400 ml-3">/ 10</span>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6">
                <label className="block text-sm font-bold text-[#1B2559] mb-3">Review Status</label>
                <select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-[#4318FF] focus:ring-1 focus:ring-[#4318FF]"
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="reviewed">✅ Reviewed</option>
                  <option value="needs_revision">🔄 Needs Revision</option>
                  <option value="flagged">🚩 Flagged</option>
                </select>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6">
                <label className="block text-sm font-bold text-[#1B2559] mb-3">Review Comment</label>
                <textarea 
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-4 text-sm text-gray-700 outline-none focus:border-[#4318FF] focus:ring-1 focus:ring-[#4318FF]" 
                  placeholder="Provide review comments regarding AI declaration..."
                ></textarea>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <label className="block text-sm font-bold text-[#1B2559] mb-3">Lecturer Feedback</label>
                <textarea 
                  rows={8}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-4 text-sm text-gray-700 outline-none focus:border-[#4318FF] focus:ring-1 focus:ring-[#4318FF]" 
                  placeholder="Provide detailed feedback for the student here..."
                ></textarea>
              </div>

              {gradeSaved && (
                <div className="mt-6 flex items-center justify-center text-sm font-bold text-green-600 bg-green-50 p-4 rounded-xl border border-green-100">
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Grade has been successfully published
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LecturerGradingDetailPage;

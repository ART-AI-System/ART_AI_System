import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle, RefreshCcw, Save, Send, ChevronRight } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import SubmissionFileViewer from '../../components/lecturer/SubmissionFileViewer';
import EvaluationPanel from '../../components/lecturer/EvaluationPanel';
import axiosClient from '../../api/axiosClient';
import { gradeService } from '../../services/grade.service';
import { reviewService } from '../../services/review.service';

const LecturerGradingDetail: React.FC = () => {
  const { submissionId: id } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  const [gradeData, setGradeData] = useState({ score: 0, feedback: '', reviewStatus: 'pending', reviewComment: '' });
  const [isPublishing, setIsPublishing] = useState(false);
  const [submission, setSubmission] = useState<any>(null);
  const [aiEvaluation, setAiEvaluation] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const subRes: any = await axiosClient.get(`/submissions/${id}`);
        const subData = subRes.result || subRes.data || subRes;
        setSubmission(subData);

        if (subData?.studentId) {
          if (typeof subData.studentId === 'object' && subData.studentId.fullName) {
            setStudent(subData.studentId);
          } else {
            try {
              const stRes: any = await axiosClient.get(`/users/${subData.studentId}`);
              setStudent(stRes.result || stRes.data || stRes);
            } catch (e) {
              console.error('Failed to load student info', e);
            }
          }
        }

        try {
          const aiRes: any = await axiosClient.get(`/submissions/${id}/ai-evaluation`);
          setAiEvaluation(aiRes.result || aiRes.data || aiRes);
        } catch (e) {
          console.error('Failed to load ai evaluation', e);
        }
      } catch (err) {
        console.error('Failed to load submission detail', err);
      }
    };
    fetchData();
  }, [id]);

  const handlePublishGrade = async () => {
    setIsPublishing(true);
    try {
      if (id && submission) {
        await Promise.all([
          gradeService.createGrade(id, { 
            score: Number(gradeData.score), 
            maxScore: 10, 
            feedback: gradeData.feedback 
          }),
          reviewService.createReview(id, { 
            reviewStatus: gradeData.reviewStatus as 'pending' | 'reviewed' | 'needs_revision' | 'flagged', 
            comment: gradeData.reviewComment 
          })
        ]);
      }
      alert('Grade and Review published successfully');
      navigate(-1);
    } catch (err) {
      console.error('Failed to publish grade', err);
      alert('Failed to publish grade and review');
    } finally {
      setIsPublishing(false);
    }
  };

  const isFlagged = aiEvaluation?.flagStatus === 'FLAGGED' || (aiEvaluation?.aiMatchPercentage && aiEvaluation.aiMatchPercentage > 80);
  const matchPct = aiEvaluation?.aiMatchPercentage || 95;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 font-inter animate-fade-in absolute inset-0 z-50">
      {/* TOP HEADER (Compact) */}
      <header className="h-16 bg-[#1B2559] text-white flex items-center justify-between px-6 shrink-0 shadow-md relative z-20">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 mr-4 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center text-[10px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">
              <Link to="/lecturer/grading" className="hover:text-white transition-colors">Grading</Link>
              <ChevronRight className="w-3 h-3 mx-1" />
              <span className="hover:text-white transition-colors">{submission?.courseCode || 'Course'}</span>
              <ChevronRight className="w-3 h-3 mx-1" />
              <span className="hover:text-white transition-colors">{submission?.classCode || 'Class'} ({submission?.gradeItemName || 'Grade Item'})</span>
            </div>
            <h1 className="text-sm font-bold">{student ? `${student.fullName || student.username} (${student.studentCode || student.email || 'N/A'})` : 'Loading Student...'}</h1>
          </div>
          
          {isFlagged ? (
            <div className="ml-6 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full flex items-center">
              <AlertTriangle className="w-3 h-3 text-red-400 mr-2" />
              <span className="text-xs font-bold text-red-200">High Discrepancy Detected ({matchPct}% AI vs Declared)</span>
            </div>
          ) : (
            <div className="ml-6 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
              <span className="text-xs font-bold text-green-200">Normal AI Assessment ({matchPct || 15}% AI Match)</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-lg hover:bg-red-100 transition-all flex items-center">
            <RefreshCcw className="w-4 h-4 mr-2" /> Request Resubmit
          </button>
          <button className="px-4 py-2 bg-white/10 text-white border border-white/20 text-xs font-bold rounded-lg hover:bg-white/20 transition-all flex items-center">
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </button>
          <button 
            onClick={handlePublishGrade}
            disabled={isPublishing}
            className={`px-4 py-2 text-white text-xs font-bold rounded-lg transition-all shadow-lg flex items-center ${isPublishing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#F26F21] hover:bg-[#D95D1A] shadow-orange-500/30'}`}
          >
            <Send className="w-4 h-4 mr-2" /> {isPublishing ? 'Publishing...' : 'Publish Grade'}
          </button>
        </div>
      </header>

      {/* SPLIT VIEW CONTAINER */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANE: FILE VIEWER */}
        <SubmissionFileViewer submissionId={id || ''} submissionInfo={submission} />

        {/* RIGHT PANE: EVALUATION PANEL */}
        <EvaluationPanel submissionId={id || ''} aiEvaluation={aiEvaluation} onChange={(data) => setGradeData(data)} />
      </div>
    </div>
  );
};

export default LecturerGradingDetail;

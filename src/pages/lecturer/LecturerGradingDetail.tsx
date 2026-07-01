import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, RefreshCcw, Save, Send, ChevronRight } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import CodeReviewer from '../../components/lecturer/CodeReviewer';
import EvaluationPanel from '../../components/lecturer/EvaluationPanel';
import axiosClient from '../../api/axiosClient';

const LecturerGradingDetail = () => {
  const { id } = useParams(); // submissionId
  const navigate = useNavigate();
  const [gradeData, setGradeData] = useState({ score: 0, feedback: '' });
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishGrade = async () => {
    setIsPublishing(true);
    try {
      // Create/Update Grade
      await axiosClient.post(`/submissions/${id}/grade`, {
        score: gradeData.score,
        comment: gradeData.feedback,
        isFinal: true
      });
      // Mock alert since UI doesn't have a toast yet
      alert('Grade published successfully');
      navigate('/lecturer/grading');
    } catch (err) {
      console.error('Failed to publish grade', err);
      alert('Failed to publish grade');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 font-inter animate-fade-in absolute inset-0 z-50">
      {/* TOP HEADER (Compact) */}
      <header className="h-16 bg-[#1B2559] text-white flex items-center justify-between px-6 shrink-0 shadow-md relative z-20">
        <div className="flex items-center">
          <Link to="/lecturer/grading" className="p-2 mr-4 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex items-center text-[10px] font-bold text-gray-400 mb-0.5 uppercase tracking-wider">
              <Link to="/lecturer/grading" className="hover:text-white transition-colors">Grading</Link>
              <ChevronRight className="w-3 h-3 mx-1" />
              <span className="hover:text-white transition-colors">PRJ301</span>
              <ChevronRight className="w-3 h-3 mx-1" />
              <span className="hover:text-white transition-colors">SE18D01 (PE 1)</span>
            </div>
            <h1 className="text-sm font-bold">Nguyen Van Duc (HE150001)</h1>
          </div>
          
          <div className="ml-6 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full flex items-center">
            <AlertTriangle className="w-3 h-3 text-red-400 mr-2" />
            <span className="text-xs font-bold text-red-200">High Discrepancy Detected (95% AI vs 10% Declared)</span>
          </div>
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
        {/* LEFT PANE: CODE REVIEWER */}
        <CodeReviewer submissionId={id} />

        {/* RIGHT PANE: EVALUATION PANEL */}
        <EvaluationPanel onChange={setGradeData} />
      </div>
    </div>
  );
};

export default LecturerGradingDetail;

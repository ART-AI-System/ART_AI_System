import React, { useState, useEffect } from 'react';
import { AlertOctagon } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { gradeService } from '../../services/grade.service';
import { reviewService } from '../../services/review.service';

interface EvaluationPanelProps {
  submissionId?: string;
  aiEvaluation?: any;
  onChange?: (data: { score: number; feedback: string; reviewStatus: string; reviewComment: string }) => void;
}

const EvaluationPanel: React.FC<EvaluationPanelProps> = ({ submissionId, aiEvaluation, onChange }) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'grade'>('ai');
  const [funcScore, setFuncScore] = useState(0);
  const [codeScore, setCodeScore] = useState(0);
  const [docScore, setDocScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  // Review States
  const [reviewStatus, setReviewStatus] = useState<string>('pending');
  const [reviewComment, setReviewComment] = useState<string>('');

  const [declarations, setDeclarations] = useState<any[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);

  const totalScore = (funcScore + codeScore + docScore).toFixed(1);

  // Expose to parent
  useEffect(() => {
    if (onChange) {
      onChange({ score: parseFloat(totalScore), feedback, reviewStatus, reviewComment });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalScore, feedback, reviewStatus, reviewComment]);

  useEffect(() => {
    if (!submissionId) return;
    const fetchAiData = async () => {
      setLoadingAi(true);
      try {
        const [res, gradeRes, reviewRes] = await Promise.all([
          axiosClient.get(`/submissions/${submissionId}/ai-interactions`).catch(() => null),
          gradeService.getGrade(submissionId).catch(() => null),
          reviewService.getReview(submissionId).catch(() => null)
        ]);

        const data = (res as any)?.result || (res as any)?.data || res;
        if (Array.isArray(data)) {
          setDeclarations(data);
        } else if (data && Array.isArray(data.declarations)) {
          setDeclarations(data.declarations);
        } else if (data && data.result && Array.isArray(data.result)) {
          setDeclarations(data.result);
        }

        const gradeData = (gradeRes as any)?.data?.result || (gradeRes as any)?.result || (gradeRes as any)?.data;
        if (gradeData) {
          // If grade exists, we can reverse map it to sliders roughly, or just use one for simplicity
          setFuncScore(Math.min(4, gradeData.score * 0.4));
          setCodeScore(Math.min(3, gradeData.score * 0.3));
          setDocScore(Math.min(3, gradeData.score * 0.3));
          setFeedback(gradeData.feedback || '');
        }

        const reviewData = (reviewRes as any)?.data?.result || (reviewRes as any)?.result || (reviewRes as any)?.data;
        if (reviewData) {
          setReviewStatus(reviewData.reviewStatus);
          setReviewComment(reviewData.comment || '');
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoadingAi(false);
      }
    };
    fetchAiData();
  }, [submissionId]);

  const isFlagged = aiEvaluation?.flagStatus === 'FLAGGED' || (aiEvaluation?.aiMatchPercentage && aiEvaluation.aiMatchPercentage > 80);
  const matchPct = aiEvaluation?.aiMatchPercentage || 95;
  const discrepancyText = aiEvaluation?.discrepancies || 'Student declared low AI interaction, but system detected high AI signatures in codebase.';

  return (
    <div className="w-[450px] shrink-0 bg-white flex flex-col shadow-xl z-10 relative">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors relative ${activeTab === 'ai' ? 'border-[#F26F21] text-[#F26F21]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          {isFlagged && <span className="absolute top-3 right-8 w-2 h-2 rounded-full bg-red-500"></span>}
          AI Declaration Review
        </button>
        <button 
          onClick={() => setActiveTab('grade')}
          className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'grade' ? 'border-[#4318FF] text-[#4318FF]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          Academic Grading
        </button>
      </div>

      {/* Tab Content: AI Declaration */}
      {activeTab === 'ai' && (
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30" style={{ scrollbarWidth: 'thin' }}>
          
          {/* Discrepancy Alert Banner */}
          {isFlagged ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 shadow-sm">
              <div className="flex items-start">
                <AlertOctagon className="w-6 h-6 text-red-500 mr-3 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-red-800">High Discrepancy Found! ({matchPct}% AI Match)</h3>
                  <p className="text-xs text-red-600 mt-1">{discrepancyText}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 shadow-sm">
              <div className="flex items-start">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-3 mt-1 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-green-800">Normal AI Assessment ({matchPct || 15}% AI Match)</h3>
                  <p className="text-xs text-green-600 mt-1">Student declaration aligns well with system AI detection.</p>
                </div>
              </div>
            </div>
          )}

          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Student's AI Declaration (5 Steps)</h3>
          
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="max-h-[280px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase sticky top-0 bg-gray-50 z-10">
                  <tr>
                    <th className="px-4 py-3 w-1/5">Phase</th>
                    <th className="px-4 py-3 w-2/5">Prompt/Input</th>
                    <th className="px-4 py-3 w-2/5">AI Output/Suggestion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loadingAi ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-xs text-gray-400">Loading declarations...</td>
                    </tr>
                  ) : declarations.length > 0 ? (
                    declarations.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 font-bold text-[#1B2559] align-top">{item.step || item.usagePurpose || `Step ${idx + 1}`}</td>
                        <td className="px-4 py-3 text-xs italic align-top max-w-[150px]">
                          <div className="max-h-24 overflow-y-auto break-words pr-1">{item.promptContent || item.prompt || 'N/A'}</div>
                        </td>
                        <td className="px-4 py-3 text-xs align-top max-w-[150px]">
                          <div className="max-h-24 overflow-y-auto break-words pr-1">{item.aiResponseSummary || item.outputSummary || 'N/A'}</div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-10 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <h4 className="text-sm font-bold text-[#1B2559]">No AI Declarations</h4>
                          <p className="text-xs text-gray-500 mt-1">This student did not declare any AI interactions for this submission.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Lecturer Evaluation */}
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-bold text-[#1B2559] mb-2">Review Status</label>
            <select 
              value={reviewStatus}
              onChange={(e) => setReviewStatus(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1B2559] mb-4 outline-none focus:border-[#4318FF] focus:ring-1 focus:ring-[#4318FF]"
            >
              <option value="pending">⏳ Pending</option>
              <option value="reviewed">✅ Reviewed (Transparent)</option>
              <option value="needs_revision">🔄 Needs Revision (Inaccurate)</option>
              <option value="flagged">🚩 Flagged (Severe Plagiarism)</option>
            </select>
            
            <label className="block text-sm font-bold text-[#1B2559] mb-2">Review Comment / Verification</label>
            <textarea 
              rows={4} 
              className={`w-full bg-white border rounded-xl px-4 py-3 text-sm outline-none mb-6 ${
                reviewStatus === 'flagged' ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 
                'border-gray-200 focus:border-[#4318FF] focus:ring-[#4318FF]'
              }`}
              placeholder="Provide context on why this was flagged or approved..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Tab Content: Grading */}
      {activeTab === 'grade' && (
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30" style={{ scrollbarWidth: 'thin' }}>
          <div className="space-y-6">
            
            {/* Score Input */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
              <label className="block text-sm font-bold text-gray-500 mb-4">Final Score (0 - 10)</label>
              <div className="flex justify-center items-center">
                <input 
                  type="text" 
                  value={totalScore}
                  readOnly
                  className="w-32 text-center text-4xl font-extrabold text-[#1B2559] bg-gray-50 border-2 border-gray-200 rounded-2xl py-4 outline-none" 
                />
              </div>
            </div>

            {/* Grading Rubric Mockup */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h4 className="text-sm font-bold text-[#1B2559] mb-4">Grading Rubric</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                    <span>Functionality (40%)</span>
                    <span>{funcScore.toFixed(1)} / 4.0</span>
                  </div>
                  <input type="range" min="0" max="4" step="0.5" value={funcScore} onChange={(e) => setFuncScore(Number(e.target.value))} className="w-full accent-[#4318FF]" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                    <span>Code Quality (30%)</span>
                    <span>{codeScore.toFixed(1)} / 3.0</span>
                  </div>
                  <input type="range" min="0" max="3" step="0.5" value={codeScore} onChange={(e) => setCodeScore(Number(e.target.value))} className="w-full accent-[#4318FF]" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                    <span>Documentation (30%)</span>
                    <span>{docScore.toFixed(1)} / 3.0</span>
                  </div>
                  <input type="range" min="0" max="3" step="0.5" value={docScore} onChange={(e) => setDocScore(Number(e.target.value))} className="w-full accent-[#4318FF]" />
                </div>
              </div>
            </div>

            {/* Overall Feedback */}
            <div>
              <label className="block text-sm font-bold text-[#1B2559] mb-2">Academic Feedback</label>
              <textarea 
                rows={6} 
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#4318FF]" 
                placeholder="Write overall feedback for the student..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationPanel;

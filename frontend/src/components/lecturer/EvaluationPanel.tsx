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
  const [aiReflectionScore, setAiReflectionScore] = useState(0);
  const [decompositionScore, setDecompositionScore] = useState(0);
  const [patternRecognitionScore, setPatternRecognitionScore] = useState(0);
  const [abstractionScore, setAbstractionScore] = useState(0);
  const [algorithmicThinkingScore, setAlgorithmicThinkingScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  // Review States
  const [reviewStatus, setReviewStatus] = useState<string>('pending');
  const [reviewComment, setReviewComment] = useState<string>('');

  const [declarations, setDeclarations] = useState<any[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);

  const totalScore = (aiReflectionScore + decompositionScore + patternRecognitionScore + abstractionScore + algorithmicThinkingScore).toFixed(1);

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
          axiosClient.get(`/submissions/${submissionId}/ai-interactions`).catch((err) => null),
          gradeService.getGrade(submissionId).catch(() => null),
          reviewService.getReview(submissionId).catch(() => null)
        ]);

        const data = (res as any)?.data?.result || (res as any)?.result || (res as any)?.data || res;

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
          setAiReflectionScore(Math.min(3.0, gradeData.score * 0.3));
          setDecompositionScore(Math.min(2.0, gradeData.score * 0.2));
          setPatternRecognitionScore(Math.min(1.5, gradeData.score * 0.15));
          setAbstractionScore(Math.min(1.5, gradeData.score * 0.15));
          setAlgorithmicThinkingScore(Math.min(2.0, gradeData.score * 0.2));
          setFeedback(gradeData.feedback || '');
        }

        const reviewData = (reviewRes as any)?.data?.result || (reviewRes as any)?.result || (reviewRes as any)?.data;
        if (reviewData) {
          const reviewObj = reviewData.review || reviewData;
          setReviewStatus(reviewObj.reviewStatus?.toLowerCase() || 'pending');
          setReviewComment(reviewObj.comment || '');
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
  const matchPct = aiEvaluation?.aiMatchPercentage || 0;
  const discrepancyText = aiEvaluation?.discrepancies || 'System detected high AI signatures that do not align with student declarations.';

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
          {!aiEvaluation ? (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
              <div className="flex items-center mb-1">
                <div className="w-2.5 h-2.5 bg-gray-400 rounded-full mr-2"></div>
                <h3 className="font-bold text-gray-700 text-sm">AI Assessment Pending</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-4">The system has not yet analyzed this submission.</p>
            </div>
          ) : isFlagged ? (
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
                  <h3 className="text-sm font-bold text-green-800">Normal AI Assessment ({matchPct}% AI Match)</h3>
                  <p className="text-xs text-green-600 mt-1">Student declaration aligns well with system AI detection.</p>
                </div>
              </div>
            </div>
          )}

          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Student's AI Declaration (5 Steps)</h3>
          
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="max-h-[280px] overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'thin' }}>
              <table className="w-full table-fixed text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-3 w-1/4">Phase</th>
                    <th className="px-3 py-3 w-1/3">Prompt</th>
                    <th className="px-3 py-3 w-5/12">Response & Reflection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loadingAi ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-xs text-gray-400">Loading declarations...</td>
                    </tr>
                  ) : (
                    (() => {
                      const phaseMappings = [
                        { label: "AI Reflection", value: "reflection" },
                        { label: "Decomposition", value: "decomposition" },
                        { label: "Pattern Recognition", value: "pattern_recognition" },
                        { label: "Abstraction", value: "abstraction" },
                        { label: "Algorithmic Thinking", value: "algorithmic_thinking" }
                      ];

                      // Fallback: If declarations is empty or not loaded, we still show the 5 rows but with N/A
                      return phaseMappings.map((phase, idx) => {
                        // Find the item by usagePurpose
                        const item = declarations.find((d: any) => d.usagePurpose === phase.value) 
                                   || declarations[idx] 
                                   || {};

                        return (
                          <tr key={idx}>
                            <td className="px-3 py-3 font-bold text-[#1B2559] align-top text-xs truncate" title={phase.label}>{phase.label}</td>
                            <td className="px-3 py-3 text-xs align-top">
                              <div className="max-h-24 overflow-y-auto break-words break-all pr-1 bg-gray-50 p-2 rounded-lg border border-gray-100" style={{ scrollbarWidth: 'thin' }}>
                                {item.promptContent || item.prompt || 'N/A'}
                              </div>
                            </td>
                            <td className="px-3 py-3 text-xs align-top">
                              <div className="max-h-24 overflow-y-auto break-words break-all pr-1 space-y-2" style={{ scrollbarWidth: 'thin' }}>
                                <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                                  <span className="font-bold text-blue-700 block mb-1">AI:</span> 
                                  {item.aiResponseSummary || item.outputSummary || 'N/A'}
                                </div>
                                <div className="bg-green-50/50 p-2 rounded-lg border border-green-100">
                                  <span className="font-bold text-green-700 block mb-1">Ref:</span> 
                                  <span className="italic">{item.reflectionText || 'N/A'}</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      });
                    })()
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
                    <span>AI Reflection (30%)</span>
                    <span>{aiReflectionScore.toFixed(1)} / 3.0</span>
                  </div>
                  <input type="range" min="0" max="3" step="0.5" value={aiReflectionScore} onChange={(e) => setAiReflectionScore(Number(e.target.value))} className="w-full accent-[#4318FF]" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                    <span>Decomposition (20%)</span>
                    <span>{decompositionScore.toFixed(1)} / 2.0</span>
                  </div>
                  <input type="range" min="0" max="2" step="0.5" value={decompositionScore} onChange={(e) => setDecompositionScore(Number(e.target.value))} className="w-full accent-[#4318FF]" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                    <span>Pattern Recognition (15%)</span>
                    <span>{patternRecognitionScore.toFixed(1)} / 1.5</span>
                  </div>
                  <input type="range" min="0" max="1.5" step="0.5" value={patternRecognitionScore} onChange={(e) => setPatternRecognitionScore(Number(e.target.value))} className="w-full accent-[#4318FF]" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                    <span>Abstraction (15%)</span>
                    <span>{abstractionScore.toFixed(1)} / 1.5</span>
                  </div>
                  <input type="range" min="0" max="1.5" step="0.5" value={abstractionScore} onChange={(e) => setAbstractionScore(Number(e.target.value))} className="w-full accent-[#4318FF]" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                    <span>Algorithmic Thinking (20%)</span>
                    <span>{algorithmicThinkingScore.toFixed(1)} / 2.0</span>
                  </div>
                  <input type="range" min="0" max="2" step="0.5" value={algorithmicThinkingScore} onChange={(e) => setAlgorithmicThinkingScore(Number(e.target.value))} className="w-full accent-[#4318FF]" />
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

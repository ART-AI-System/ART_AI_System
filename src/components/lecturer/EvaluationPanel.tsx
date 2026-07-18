import React, { useState, useEffect } from 'react';
import { AlertOctagon, Sparkles, Loader2, Copy, CheckCircle2, Award, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
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

  // AI Grading Suggestion State (Person A Feature)
  const [loadingAiSuggestion, setLoadingAiSuggestion] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any | null>(null);
  const [aiSuggestionError, setAiSuggestionError] = useState<string>('');
  const [showBreakdown, setShowBreakdown] = useState<boolean>(true);

  // AI Audit States (Person B Feature)
  const [aiAuditResult, setAiAuditResult] = useState<any>(null);
  const [loadingAudit, setLoadingAudit] = useState<boolean>(false);
  const [visibleAnswers, setVisibleAnswers] = useState<Record<number, boolean>>({});

  // AI Holistic Synthesis States (Person A & B Linkage)
  const [synthesisResult, setSynthesisResult] = useState<any | null>(null);
  const [loadingSynthesis, setLoadingSynthesis] = useState<boolean>(false);

  // Panel Resizing State
  const [panelWidth, setPanelWidth] = useState<number>(460);
  const [isDraggingPanel, setIsDraggingPanel] = useState<boolean>(false);

  useEffect(() => {
    if (!isDraggingPanel) return;
    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      setPanelWidth(Math.max(380, Math.min(window.innerWidth * 0.7, newWidth)));
    };
    const handleMouseUp = () => {
      setIsDraggingPanel(false);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingPanel]);

  const handleFetchAiSuggestion = async () => {
    if (!submissionId) return;
    setLoadingAiSuggestion(true);
    setAiSuggestionError('');
    try {
      const res: any = await axiosClient.post(`/submissions/${submissionId}/ai-grade-suggestion`);
      const result = res.result ?? res.data?.result ?? res;
      setAiSuggestion(result);
    } catch (err: any) {
      setAiSuggestionError(err?.response?.data?.message || 'Could not fetch AI grade suggestion.');
    } finally {
      setLoadingAiSuggestion(false);
    }
  };

  const handleApplyAiSuggestion = (sug: any) => {
    if (!sug) return;
    const ratio = (sug.suggestedScore || 8) / (sug.maxScore || 10);
    setAiReflectionScore(Number((3 * ratio).toFixed(1)));
    setDecompositionScore(Number((2 * ratio).toFixed(1)));
    setPatternRecognitionScore(Number((1.5 * ratio).toFixed(1)));
    setAbstractionScore(Number((1.5 * ratio).toFixed(1)));
    setAlgorithmicThinkingScore(Number((2 * ratio).toFixed(1)));
    if (sug.suggestedFeedback && !feedback) {
      setFeedback(sug.suggestedFeedback);
    }
  };

  const handleRunAiAudit = async () => {
    if (!submissionId) return;
    setLoadingAudit(true);
    try {
      const res = await axiosClient.post(`/submissions/${submissionId}/ai-audit-viva`);
      const data = (res as any)?.data?.result || (res as any)?.result || (res as any)?.data || res;
      setAiAuditResult(data);
    } catch (err) {
      console.error('Failed to run AI Audit', err);
    } finally {
      setLoadingAudit(false);
    }
  };

  const handleRunSynthesis = async () => {
    if (!submissionId) return;
    setLoadingSynthesis(true);
    try {
      const res = await axiosClient.post(`/submissions/${submissionId}/ai-holistic-synthesis`, {
        gradingResult: aiSuggestion,
        auditResult: aiAuditResult
      });
      const data = (res as any)?.data?.result || (res as any)?.result || (res as any)?.data || res;
      setSynthesisResult(data);
    } catch (err) {
      console.error('Failed to run AI Holistic Synthesis', err);
    } finally {
      setLoadingSynthesis(false);
    }
  };

  const handleApplySynthesis = (syn: any) => {
    if (!syn) return;
    const recScore = typeof syn.holisticRecommendedScore === 'number' ? syn.holisticRecommendedScore : syn.rawRubricScore || 8;
    const ratio = recScore / 10;
    setAiReflectionScore(Number((3 * ratio).toFixed(1)));
    setDecompositionScore(Number((2 * ratio).toFixed(1)));
    setPatternRecognitionScore(Number((1.5 * ratio).toFixed(1)));
    setAbstractionScore(Number((1.5 * ratio).toFixed(1)));
    setAlgorithmicThinkingScore(Number((2 * ratio).toFixed(1)));
    if (syn.synergyAnalysis) {
      setFeedback(`[AI Holistic 360° Assessment]\n${syn.synergyAnalysis}\n\n[Mandatory Defense Verification]\n${(syn.actionableDefensePlan || []).map((item: any, idx: number) => `• Q${item.linkedVivaQuestionNumber} (${item.rubricCriteria}): ${item.lecturerAdvice}`).join('\n')}`);
    }
    if (syn.auditStatus === 'RED') {
      setReviewStatus('flagged');
    } else if (syn.auditStatus === 'YELLOW') {
      setReviewStatus('needs_revision');
    } else {
      setReviewStatus('reviewed');
    }
  };

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
    <div
      style={{ width: `${panelWidth}px` }}
      className="shrink-0 bg-white flex flex-col shadow-2xl z-10 relative transition-[width] duration-75 ease-out"
    >
      {/* Drag Handle Bar on Left Edge */}
      <div
        onMouseDown={(e) => { e.preventDefault(); setIsDraggingPanel(true); }}
        className="absolute left-0 top-0 bottom-0 w-2.5 -ml-1 hover:w-3 bg-transparent hover:bg-indigo-300/70 cursor-ew-resize flex items-center justify-center z-30 transition-all select-none group"
        title="Kéo trái/phải để thay đổi độ rộng khung chấm điểm"
      >
        <div className="w-1 h-16 bg-gray-300 group-hover:bg-indigo-600 rounded-full transition-colors shadow-sm" />
      </div>

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
          
          {/* AI Audit & Viva Defense Section (Person B Feature) */}
          <div className="mb-6 border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI Audit & Viva Defense</h3>
              <div className="flex gap-2">
                <button 
                  onClick={handleRunAiAudit}
                  disabled={loadingAudit}
                  className="flex items-center gap-2 bg-[#F26F21] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-[#d95c14] transition-colors disabled:opacity-50"
                >
                  🛡️ {loadingAudit ? 'Running Audit...' : 'Run AI Audit & Defense'}
                </button>
                <button 
                  onClick={() => { setActiveTab('grade'); handleRunSynthesis(); }}
                  disabled={loadingSynthesis || !submissionId}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold shadow-md hover:from-amber-700 hover:to-orange-700 transition-all disabled:opacity-50"
                >
                  ⚡ {loadingSynthesis ? 'Linking...' : 'Link with Rubric (360°)'}
                </button>
              </div>
            </div>

            {aiAuditResult && (
              <div className="space-y-4">
                {/* Status Badge */}
                <div className={`p-4 rounded-2xl border ${
                  aiAuditResult.status === 'RED' ? 'bg-red-50 border-red-200 text-red-800' :
                  aiAuditResult.status === 'YELLOW' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                  'bg-green-50 border-green-200 text-green-800'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-sm">Consistency Score: {aiAuditResult.consistencyScore}%</h4>
                    <span className="text-xs font-extrabold px-2 py-1 rounded bg-white bg-opacity-50 uppercase">{aiAuditResult.status}</span>
                  </div>
                  <p className="text-xs">{aiAuditResult.summaryAnalysis}</p>
                </div>

                {/* Red Flags */}
                {aiAuditResult.redFlags && aiAuditResult.redFlags.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                    <h4 className="font-bold text-red-800 text-sm mb-2">🚩 Red Flags</h4>
                    <ul className="list-disc pl-5 text-xs text-red-700 space-y-1">
                      {aiAuditResult.redFlags.map((flag: string, idx: number) => (
                        <li key={idx}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Viva Defense Cards */}
                {aiAuditResult.vivaQuestions && aiAuditResult.vivaQuestions.length > 0 && (
                  <div>
                    <h4 className="font-bold text-[#1B2559] text-sm mb-3 mt-6">Viva Defense Questions</h4>
                    <div className="space-y-3">
                      {aiAuditResult.vivaQuestions.map((q: any, idx: number) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-gray-400">Q{q.questionNumber} • {q.purpose}</span>
                            <span className="text-[10px] font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {q.targetFilePath}
                            </span>
                          </div>
                          <p className="font-bold text-[#1B2559] text-sm mb-3">{q.questionText}</p>
                          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <button 
                              onClick={() => setVisibleAnswers(prev => ({ ...prev, [idx]: !prev[idx] }))}
                              className="text-xs font-bold text-[#4318FF] mb-2 hover:underline"
                            >
                              {visibleAnswers[idx] ? 'Hide Expected Answer' : 'Show Expected Answer'}
                            </button>
                            {visibleAnswers[idx] && (
                              <p className="text-xs text-gray-600 mt-2 border-t border-gray-200 pt-2">{q.expectedAnswer}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
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
            
            {/* ── Person A Feature: AI Rubric Suggestion Card ── */}
            <div className="bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-white border border-indigo-200/80 rounded-2xl p-5 shadow-sm transition-all">
              <div className="flex flex-col gap-3.5 mb-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl shadow-md shrink-0">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-extrabold text-[#1B2559]">AI Rubric Evaluator & Assistant</h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Automated code inspection & grade proposal based on rubric criteria</p>
                  </div>
                </div>
                <button
                  onClick={handleFetchAiSuggestion}
                  disabled={loadingAiSuggestion || !submissionId}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.99] select-none"
                >
                  {loadingAiSuggestion ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing Source Code & Rubric Criteria...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" /> {aiSuggestion ? 'Re-Analyze Submission with AI' : '✨ Analyze & Suggest Grade with AI'}
                    </>
                  )}
                </button>
              </div>

              {aiSuggestionError && (
                <div className="mt-3 p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs flex items-center">
                  <AlertOctagon className="w-4 h-4 mr-2 shrink-0" /> {aiSuggestionError}
                </div>
              )}

              {aiSuggestion && (
                <div className="mt-4 pt-4 border-t border-indigo-100 space-y-4 animate-fadeIn">
                  {/* Summary */}
                  <div className="bg-white/90 border border-indigo-100 p-3.5 rounded-xl shadow-sm">
                    <span className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider block mb-1">Project Summary</span>
                    <p className="text-xs text-gray-700 leading-relaxed">{aiSuggestion.summary}</p>
                  </div>

                  {/* Proposed Score & Actions */}
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-4 rounded-xl shadow-md space-y-3">
                    <div className="flex items-center justify-between border-b border-indigo-400/30 pb-3">
                      <div className="flex items-center space-x-3">
                        <Award className="w-7 h-7 text-yellow-300 shrink-0" />
                        <div>
                          <span className="text-[11px] text-indigo-100 block font-semibold uppercase tracking-wider">Proposed Grade</span>
                          <span className="text-2xl font-extrabold">{aiSuggestion.suggestedScore} <span className="text-sm font-normal text-indigo-200">/ {aiSuggestion.maxScore || 10}</span></span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] bg-white/20 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">AI Recommendation</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <button
                        onClick={() => handleApplyAiSuggestion(aiSuggestion)}
                        className="w-full py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-extrabold rounded-lg transition-colors shadow-sm flex items-center justify-center select-none"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-green-600 shrink-0" /> Apply Rubric Scores
                      </button>
                      <button
                        onClick={() => setFeedback(aiSuggestion.suggestedFeedback)}
                        className="w-full py-2.5 bg-indigo-800/80 hover:bg-indigo-900 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center border border-indigo-400/40 select-none"
                      >
                        <Copy className="w-3.5 h-3.5 mr-1.5 shrink-0" /> Paste Feedback
                      </button>
                    </div>
                  </div>

                  {/* Breakdown Accordion */}
                  {aiSuggestion.rubricBreakdown && aiSuggestion.rubricBreakdown.length > 0 && (
                    <div className="bg-white/80 border border-indigo-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setShowBreakdown(o => !o)}
                        className="w-full flex items-center justify-between p-3.5 text-xs font-extrabold text-[#1B2559] hover:bg-indigo-50/50 transition-colors"
                      >
                        <span>Detailed Rubric Breakdown ({aiSuggestion.rubricBreakdown.length} criteria)</span>
                        {showBreakdown ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </button>
                      {showBreakdown && (
                        <div className="p-3.5 border-t border-indigo-50 space-y-3">
                          {aiSuggestion.rubricBreakdown.map((item: any, idx: number) => (
                            <div key={idx} className="bg-gray-50/80 p-3 rounded-lg border border-gray-100 text-xs">
                              <div className="flex justify-between items-center mb-1 font-bold text-[#1B2559]">
                                <span>{item.criteriaName}</span>
                                <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-extrabold">{item.score} / {item.maxScore}</span>
                              </div>
                              <p className="text-gray-600 leading-relaxed mt-1">{item.comment}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Person A & Person B Synergy: AI Holistic 360° Assessment Card ── */}
            <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-white border border-orange-200/80 rounded-2xl p-5 shadow-sm transition-all">
              <div className="flex flex-col gap-3.5 mb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2.5 bg-gradient-to-br from-[#F26F21] to-amber-600 text-white rounded-xl shadow-md shrink-0">
                      <AlertOctagon className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-[#1B2559]">AI Holistic 360° Assessment (Link Audit & Rubric)</h4>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Synthesizes Person B&apos;s Audit/Viva consistency with Person A&apos;s Rubric technical score</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleRunSynthesis}
                  disabled={loadingSynthesis || !submissionId}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#F26F21] via-orange-600 to-amber-600 hover:from-[#d95c14] hover:to-amber-700 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.99] select-none"
                >
                  {loadingSynthesis ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Synthesizing Rubric & Audit Findings...
                    </>
                  ) : (
                    <>
                      ⚡ Run Holistic 360° Assessment & Synergy Map
                    </>
                  )}
                </button>
              </div>

              {synthesisResult && (
                <div className="mt-4 pt-4 border-t border-orange-100 space-y-4 animate-fadeIn">
                  {/* Status & Scores comparison */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/90 border border-orange-100 p-3 rounded-xl">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">Raw Rubric Score</span>
                      <span className="text-lg font-extrabold text-[#1B2559]">{synthesisResult.rawRubricScore} <span className="text-xs font-normal">/ 10</span></span>
                    </div>
                    <div className={`p-3 rounded-xl border ${
                      synthesisResult.auditStatus === 'RED' ? 'bg-red-50 border-red-200 text-red-800' :
                      synthesisResult.auditStatus === 'YELLOW' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                      'bg-green-50 border-green-200 text-green-800'
                    }`}>
                      <span className="text-[10px] font-bold uppercase block">Consistency Status</span>
                      <span className="text-lg font-extrabold">{synthesisResult.consistencyScore}% ({synthesisResult.auditStatus})</span>
                    </div>
                  </div>

                  {/* Recommendation Card */}
                  <div className="bg-gradient-to-r from-[#F26F21] to-amber-600 text-white p-4 rounded-xl shadow-md space-y-3">
                    <div className="flex items-center justify-between border-b border-orange-400/30 pb-3">
                      <div>
                        <span className="text-[11px] text-orange-100 block font-semibold uppercase tracking-wider">Holistic Recommended Score</span>
                        <span className="text-2xl font-extrabold">{synthesisResult.holisticRecommendedScore} <span className="text-sm font-normal text-orange-200">/ 10</span></span>
                      </div>
                      <div className="text-right">
                        {synthesisResult.isDefenseMandatory ? (
                          <span className="text-[10px] bg-red-600 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">Mandatory Viva Required</span>
                        ) : (
                          <span className="text-[10px] bg-green-600 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">Confident Score</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-orange-50 leading-relaxed">{synthesisResult.synergyAnalysis}</p>
                    <button
                      onClick={() => handleApplySynthesis(synthesisResult)}
                      className="w-full py-2.5 bg-white text-orange-700 hover:bg-orange-50 text-xs font-extrabold rounded-lg transition-colors shadow-sm flex items-center justify-center select-none"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-green-600 shrink-0" /> Apply Holistic Score & Defense Plan to Review
                    </button>
                  </div>

                  {/* Actionable Defense Plan */}
                  {synthesisResult.actionableDefensePlan && synthesisResult.actionableDefensePlan.length > 0 && (
                    <div className="bg-white/90 border border-orange-100 rounded-xl p-3.5 space-y-2.5">
                      <h5 className="text-xs font-extrabold text-[#1B2559] uppercase tracking-wider">🎯 Actionable Viva-Rubric Synergy Checklist</h5>
                      {synthesisResult.actionableDefensePlan.map((item: any, idx: number) => (
                        <div key={idx} className="bg-orange-50/50 p-3 rounded-lg border border-orange-100/80 text-xs">
                          <div className="flex justify-between items-center mb-1 font-bold text-[#F26F21]">
                            <span>{item.rubricCriteria}</span>
                            <span className="bg-[#F26F21] text-white px-2 py-0.5 rounded text-[10px]">Linked to Q{item.linkedVivaQuestionNumber}</span>
                          </div>
                          <p className="text-gray-700 mt-1 leading-relaxed">{item.lecturerAdvice}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

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

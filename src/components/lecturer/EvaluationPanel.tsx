import React, { useState, useEffect } from 'react';
import { AlertOctagon, Sparkles, Loader2, Copy, CheckCircle2, Award, ChevronDown, ChevronUp, GripVertical, ShieldCheck, AlertTriangle, FileText, HelpCircle, RefreshCw, Layers } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { gradeService } from '../../services/grade.service';
import { reviewService } from '../../services/review.service';

interface EvaluationPanelProps {
  submissionId?: string;
  aiEvaluation?: any;
  onChange?: (data: { score: number; feedback: string; reviewStatus: string; reviewComment: string }) => void;
}

// ─── SHIMMERING SKELETON COMPONENTS ───
const SkeletonShimmer: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded-xl ${className}`} />
);

const SkeletonDeclarationTable: React.FC = () => (
  <div className="space-y-3 p-4">
    {[...Array(5)].map((_, idx) => (
      <div key={idx} className="flex gap-4 items-center bg-gray-50/60 p-3 rounded-xl border border-gray-100">
        <SkeletonShimmer className="h-6 w-24 shrink-0" />
        <SkeletonShimmer className="h-12 flex-1" />
        <SkeletonShimmer className="h-12 flex-1" />
      </div>
    ))}
  </div>
);

const SkeletonRubricCard: React.FC = () => (
  <div className="bg-white/80 border border-indigo-100 rounded-2xl p-4 space-y-3 shadow-sm animate-pulse">
    <div className="flex items-center justify-between border-b border-indigo-50 pb-3">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
          <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
        </div>
        <div>
          <SkeletonShimmer className="h-4 w-36 mb-1" />
          <SkeletonShimmer className="h-3 w-52" />
        </div>
      </div>
      <SkeletonShimmer className="h-6 w-16 rounded-full" />
    </div>
    <div className="space-y-2 pt-1">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-gray-50 p-2.5 rounded-xl flex justify-between items-center">
          <SkeletonShimmer className="h-3 w-32" />
          <SkeletonShimmer className="h-4 w-12" />
        </div>
      ))}
    </div>
  </div>
);

const SkeletonAuditCard: React.FC = () => (
  <div className="bg-white/80 border border-purple-100 rounded-2xl p-4 space-y-3 shadow-sm animate-pulse">
    <div className="flex items-center justify-between border-b border-purple-50 pb-3">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
          <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
        </div>
        <div>
          <SkeletonShimmer className="h-4 w-40 mb-1" />
          <SkeletonShimmer className="h-3 w-48" />
        </div>
      </div>
      <SkeletonShimmer className="h-6 w-20 rounded-full" />
    </div>
    <div className="space-y-2 pt-1">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-gray-50 p-3 rounded-xl space-y-2">
          <SkeletonShimmer className="h-3.5 w-3/4" />
          <SkeletonShimmer className="h-3 w-full" />
        </div>
      ))}
    </div>
  </div>
);

const SkeletonSynthesisBanner: React.FC = () => (
  <div className="bg-gradient-to-br from-indigo-900 via-[#1B2559] to-purple-900 rounded-2xl p-5 shadow-lg relative overflow-hidden space-y-4">
    <div className="flex items-center space-x-3">
      <div className="p-3 bg-white/10 rounded-xl">
        <Loader2 className="w-5 h-5 text-indigo-300 animate-spin" />
      </div>
      <div className="space-y-1.5 flex-1">
        <div className="h-4 w-48 bg-white/20 rounded animate-pulse" />
        <div className="h-3 w-64 bg-white/10 rounded animate-pulse" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-2.5">
      <div className="h-16 bg-white/10 rounded-xl animate-pulse" />
      <div className="h-16 bg-white/10 rounded-xl animate-pulse" />
      <div className="h-16 bg-white/10 rounded-xl animate-pulse" />
    </div>
    <div className="h-10 bg-white/15 rounded-xl animate-pulse" />
  </div>
);

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

  // Progressive Async AI States
  const [loadingAiSuggestion, setLoadingAiSuggestion] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any | null>(null);
  const [aiSuggestionError, setAiSuggestionError] = useState<string>('');
  const [showBreakdown, setShowBreakdown] = useState<boolean>(true);

  const [loadingAudit, setLoadingAudit] = useState<boolean>(false);
  const [aiAuditResult, setAiAuditResult] = useState<any>(null);
  const [visibleAnswers, setVisibleAnswers] = useState<Record<number, boolean>>({});

  const [loadingSynthesis, setLoadingSynthesis] = useState<boolean>(false);
  const [synthesisResult, setSynthesisResult] = useState<any | null>(null);

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

  // ─── PROGRESSIVE ASYNC AI EXECUTION ENGINE ───
  const handleRunProgressiveAI = () => {
    if (!submissionId) return;
    setLoadingSynthesis(true);
    setLoadingAiSuggestion(true);
    setLoadingAudit(true);
    setAiSuggestionError('');

    let currentRubric: any = null;
    let currentAudit: any = null;

    // 1. Trigger Block 1 (AI Rubric Suggestion) asynchronously
    const rubricPromise = axiosClient.post(`/submissions/${submissionId}/ai-grade-suggestion`)
      .then((res: any) => {
        const data = res?.data?.result || res?.result || res?.data || res;
        currentRubric = data;
        setAiSuggestion(data);
        setLoadingAiSuggestion(false);
        return data;
      })
      .catch((err) => {
        console.warn('Block 1 (Rubric) failed:', err);
        setLoadingAiSuggestion(false);
        return null;
      });

    // 2. Trigger Block 2 (AI Audit & Viva) asynchronously
    const auditPromise = axiosClient.post(`/submissions/${submissionId}/ai-audit-viva`)
      .then((res: any) => {
        const data = res?.data?.result || res?.result || res?.data || res;
        currentAudit = data;
        setAiAuditResult(data);
        setLoadingAudit(false);
        return data;
      })
      .catch((err) => {
        console.warn('Block 2 (Audit) failed:', err);
        setLoadingAudit(false);
        return null;
      });

    // 3. Block 3 (Synthesis) runs as soon as Block 1 & 2 complete
    Promise.all([rubricPromise, auditPromise]).then(([rubricRes, auditRes]) => {
      axiosClient.post(`/submissions/${submissionId}/ai-holistic-synthesis`, {
        gradingResult: rubricRes || currentRubric || aiSuggestion,
        auditResult: auditRes || currentAudit || aiAuditResult
      })
      .then((res: any) => {
        const data = res?.data?.result || res?.result || res?.data || res;
        setSynthesisResult(data);
        if (data.gradingBreakdown) {
          setAiSuggestion((prev: any) => ({
            ...prev,
            suggestedScore: data.rawRubricScore,
            maxScore: 10,
            rubricBreakdown: data.gradingBreakdown,
            suggestedFeedback: data.suggestedFeedback || data.synergyAnalysis,
            summary: data.summaryAnalysis || prev?.summary || 'Comprehensive analysis'
          }));
        }
        if (data.vivaQuestions) {
          setAiAuditResult((prev: any) => ({
            ...prev,
            consistencyScore: data.consistencyScore,
            status: data.auditStatus,
            summaryAnalysis: data.summaryAnalysis,
            redFlags: data.redFlags || prev?.redFlags || [],
            vivaQuestions: data.vivaQuestions
          }));
        }
      })
      .catch((err: any) => {
        setAiSuggestionError(err?.response?.data?.message || 'Could not complete 360° Synthesis.');
        console.error('Failed synthesis block:', err);
      })
      .finally(() => {
        setLoadingSynthesis(false);
      });
    });
  };

  // Aliases for triggers
  const handleRunSynthesis = handleRunProgressiveAI;
  const handleFetchAiSuggestion = handleRunProgressiveAI;
  const handleRunAiAudit = handleRunProgressiveAI;

  const handleApplySynthesis = (syn: any) => {
    if (!syn) return;
    const recScore = typeof syn.holisticRecommendedScore === 'number' ? syn.holisticRecommendedScore : syn.rawRubricScore || 8;
    const ratio = recScore / 10;
    setAiReflectionScore(Number((3 * ratio).toFixed(1)));
    setDecompositionScore(Number((2 * ratio).toFixed(1)));
    setPatternRecognitionScore(Number((1.5 * ratio).toFixed(1)));
    setAbstractionScore(Number((1.5 * ratio).toFixed(1)));
    setAlgorithmicThinkingScore(Number((2 * ratio).toFixed(1)));
    
    // Combine feedback cleanly
    const feedbackParts = [];
    if (syn.synergyAnalysis) {
      feedbackParts.push(`[Đánh giá tổng hợp AI 360°]\n${syn.synergyAnalysis}`);
    } else if (syn.suggestedFeedback) {
      feedbackParts.push(`[Nhận xét Kỹ thuật]\n${syn.suggestedFeedback}`);
    }
    if (syn.actionableDefensePlan && syn.actionableDefensePlan.length > 0) {
      feedbackParts.push(`\n[Vấn đáp Kiểm chứng & Chấm điểm có điều kiện]\n` + syn.actionableDefensePlan.map((item: any) => `• Q${item.linkedVivaQuestionNumber} (${item.rubricCriteria}): ${item.lecturerAdvice}`).join('\n'));
    }
    setFeedback(feedbackParts.join('\n'));

    if (syn.auditStatus === 'RED') {
      setReviewStatus('flagged');
    } else if (syn.auditStatus === 'YELLOW') {
      setReviewStatus('needs_revision');
    } else {
      setReviewStatus('reviewed');
    }
  };

  const handleApplyAiSuggestion = () => handleApplySynthesis(synthesisResult || aiSuggestion);

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
      <div className="flex border-b border-gray-200 bg-gray-50/50">
        <button 
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all relative flex items-center justify-center gap-2 ${
            activeTab === 'ai' ? 'border-[#F26F21] text-[#F26F21] bg-white shadow-sm' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          {isFlagged && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
          <ShieldCheck className="w-4 h-4" /> AI Declaration & Audit
        </button>
        <button 
          onClick={() => setActiveTab('grade')}
          className={`flex-1 py-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center justify-center gap-2 ${
            activeTab === 'grade' ? 'border-[#4318FF] text-[#4318FF] bg-white shadow-sm' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Award className="w-4 h-4" /> Academic Grading
        </button>
      </div>

      {/* ─── TAB 1: AI DECLARATION REVIEW & AUDIT ─── */}
      {activeTab === 'ai' && (
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30 space-y-6" style={{ scrollbarWidth: 'thin' }}>
          
          {/* Discrepancy Alert Banner */}
          {!aiEvaluation ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="font-extrabold text-gray-700 text-xs uppercase tracking-wide">AI Assessment Pending</h3>
                  <p className="text-[11px] text-gray-400">The system has not yet analyzed this submission.</p>
                </div>
              </div>
            </div>
          ) : isFlagged ? (
            <div className="bg-gradient-to-r from-red-500/10 via-red-500/5 to-white border border-red-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <AlertOctagon className="w-6 h-6 text-red-600 shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <h3 className="text-xs font-black text-red-800 uppercase tracking-wide">High Discrepancy Found! ({matchPct}% AI Match)</h3>
                  <p className="text-xs text-red-700 mt-1 leading-relaxed">{discrepancyText}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-green-500/10 via-green-500/5 to-white border border-green-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <ShieldCheck className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-black text-green-800 uppercase tracking-wide">Normal AI Assessment ({matchPct}% AI Match)</h3>
                  <p className="text-xs text-green-700 mt-1 leading-relaxed">Student declaration aligns well with system AI detection.</p>
                </div>
              </div>
            </div>
          )}

          {/* Student's AI Declaration Table Block */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-[#1B2559] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#F26F21]" /> Student AI Declaration (5 Phases)
              </h3>
              <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">Self-Reported</span>
            </div>
            
            <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
              {loadingAi ? (
                <SkeletonDeclarationTable />
              ) : (
                <div className="max-h-[300px] overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'thin' }}>
                  <table className="w-full text-left text-xs text-gray-600">
                    <thead className="bg-gray-50/90 border-b border-gray-100 font-extrabold text-[#1B2559] uppercase tracking-wider sticky top-0 z-10">
                      <tr>
                        <th className="px-3.5 py-3 w-1/4">Phase</th>
                        <th className="px-3.5 py-3 w-1/3">Prompt</th>
                        <th className="px-3.5 py-3 w-5/12">AI Output & Reflection</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(() => {
                        const phaseMappings = [
                          { label: "AI Reflection", value: "reflection", color: "bg-purple-50 text-purple-700 border-purple-100" },
                          { label: "Decomposition", value: "decomposition", color: "bg-blue-50 text-blue-700 border-blue-100" },
                          { label: "Pattern Recognition", value: "pattern_recognition", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
                          { label: "Abstraction", value: "abstraction", color: "bg-amber-50 text-amber-700 border-amber-100" },
                          { label: "Algorithmic Thinking", value: "algorithmic_thinking", color: "bg-emerald-50 text-emerald-700 border-emerald-100" }
                        ];

                        return phaseMappings.map((phase, idx) => {
                          const item = declarations.find((d: any) => d.usagePurpose === phase.value) 
                                     || declarations[idx] 
                                     || {};

                          return (
                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-3.5 py-3 align-top">
                                <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-black uppercase border ${phase.color}`}>
                                  {phase.label}
                                </span>
                              </td>
                              <td className="px-3.5 py-3 align-top">
                                <div className="max-h-20 overflow-y-auto pr-1 bg-gray-50/80 p-2 rounded-lg border border-gray-100/80 leading-relaxed font-mono text-[11px]" style={{ scrollbarWidth: 'thin' }}>
                                  {item.promptContent || item.prompt || 'N/A'}
                                </div>
                              </td>
                              <td className="px-3.5 py-3 align-top space-y-1.5">
                                <div className="bg-blue-50/60 p-2 rounded-lg border border-blue-100/70 text-[11px] leading-relaxed">
                                  <span className="font-extrabold text-blue-700 block mb-0.5">🤖 AI Output:</span> 
                                  {item.aiResponseSummary || item.outputSummary || 'N/A'}
                                </div>
                                <div className="bg-green-50/60 p-2 rounded-lg border border-green-100/70 text-[11px] leading-relaxed">
                                  <span className="font-extrabold text-green-700 block mb-0.5">💭 Reflection:</span> 
                                  <span className="italic text-gray-700">{item.reflectionText || 'N/A'}</span>
                                </div>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          {/* Progressive AI Integrity Audit & Viva Defense Block */}
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="text-xs font-black text-[#1B2559] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#4318FF]" /> Thanh tra Trung thực AI & Vấn đáp Viva
                </h3>
                <p className="text-[11px] text-gray-400">Kiểm định tự động độ khớp giữa lời khai và mã nguồn thực tế</p>
              </div>
              <button 
                onClick={handleRunProgressiveAI}
                disabled={loadingAudit || loadingSynthesis || !submissionId}
                className="flex items-center gap-2 bg-gradient-to-r from-[#4318FF] via-purple-600 to-[#F26F21] text-white px-4 py-2 rounded-xl text-xs font-black shadow-md hover:opacity-95 transition-all disabled:opacity-50"
              >
                {loadingAudit ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang thanh tra...</>
                ) : (
                  <>⚡ Chạy Thanh Tra & Tạo Vấn Đáp</>
                )}
              </button>
            </div>

            {loadingAudit && <SkeletonAuditCard />}

            {!loadingAudit && aiAuditResult && (
              <div className="space-y-3.5 animate-fadeIn">
                {/* Consistency Gauge Banner */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                  aiAuditResult.status === 'RED' ? 'bg-red-500/10 border-red-300 text-red-900' :
                  aiAuditResult.status === 'YELLOW' ? 'bg-yellow-500/10 border-yellow-300 text-yellow-900' :
                  'bg-green-500/10 border-green-300 text-green-900'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl font-black text-lg ${
                      aiAuditResult.status === 'RED' ? 'bg-red-600 text-white' :
                      aiAuditResult.status === 'YELLOW' ? 'bg-yellow-600 text-white' :
                      'bg-green-600 text-white'
                    }`}>
                      {aiAuditResult.consistencyScore}%
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-75 block">Độ Nhất Quán Lời Khai</span>
                      <p className="text-xs font-bold leading-relaxed">{aiAuditResult.summaryAnalysis}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-white shadow-sm uppercase tracking-wider">
                    {aiAuditResult.status || 'GREEN'}
                  </span>
                </div>

                {/* Red Flags List */}
                {aiAuditResult.redFlags && aiAuditResult.redFlags.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 space-y-1.5">
                    <h4 className="font-black text-red-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                      <AlertTriangle className="w-4 h-4 text-red-600" /> Điểm Đáng Ngờ Cần Lưu Ý (Red Flags)
                    </h4>
                    <ul className="list-disc pl-5 text-xs text-red-700 space-y-1">
                      {aiAuditResult.redFlags.map((flag: string, idx: number) => (
                        <li key={idx} className="leading-relaxed">{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Viva Defense Accordions */}
                {aiAuditResult.vivaQuestions && aiAuditResult.vivaQuestions.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="font-black text-[#1B2559] text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-[#4318FF]" /> Bộ Câu Hỏi Vấn Đáp Kiểm Chứng ({aiAuditResult.vivaQuestions.length})
                    </h4>
                    <div className="space-y-2.5">
                      {aiAuditResult.vivaQuestions.map((q: any, idx: number) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-3.5 shadow-sm space-y-2.5 hover:border-purple-200 transition-all">
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                              Q{q.questionNumber} • {q.purpose}
                            </span>
                            <span className="text-[10px] font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200/60 truncate max-w-[200px]" title={q.targetFilePath}>
                              {q.targetFilePath}
                            </span>
                          </div>
                          <p className="font-extrabold text-[#1B2559] text-xs leading-relaxed">{q.questionText}</p>
                          <div className="bg-gray-50/80 rounded-xl p-2.5 border border-gray-100">
                            <button 
                              onClick={() => setVisibleAnswers(prev => ({ ...prev, [idx]: !prev[idx] }))}
                              className="text-[11px] font-bold text-[#4318FF] hover:underline flex items-center gap-1"
                            >
                              {visibleAnswers[idx] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              {visibleAnswers[idx] ? 'Ẩn câu trả lời kỳ vọng' : 'Xem câu trả lời kỳ vọng & gợi ý chấm'}
                            </button>
                            {visibleAnswers[idx] && (
                              <p className="text-xs text-gray-700 mt-2 border-t border-gray-200/80 pt-2 leading-relaxed animate-fadeIn">
                                {q.expectedAnswer}
                              </p>
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
          
          {/* Lecturer Review Status & Verification Comment */}
          <div className="border-t border-gray-200 pt-5 space-y-3">
            <div>
              <label className="block text-xs font-black text-[#1B2559] uppercase tracking-wider mb-1.5">Trạng thái Phê duyệt</label>
              <select 
                value={reviewStatus}
                onChange={(e) => setReviewStatus(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-extrabold text-[#1B2559] outline-none focus:border-[#4318FF] focus:ring-1 focus:ring-[#4318FF] transition-all shadow-sm"
              >
                <option value="pending">⏳ Chờ duyệt (Pending)</option>
                <option value="reviewed">✅ Đã duyệt - Minh bạch (Transparent)</option>
                <option value="needs_revision">🔄 Cần xem xét lại (Needs Revision)</option>
                <option value="flagged">🚩 Đánh dấu vi phạm (Flagged Plagiarism)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-black text-[#1B2559] uppercase tracking-wider mb-1.5">Ghi chú Kiểm định (Lecturer Comment)</label>
              <textarea 
                rows={3} 
                className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs outline-none transition-all shadow-sm ${
                  reviewStatus === 'flagged' ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 
                  'border-gray-200 focus:border-[#4318FF] focus:ring-1 focus:ring-[#4318FF]'
                }`}
                placeholder="Ghi chú chi tiết lý do duyệt hoặc vi phạm..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: ACADEMIC GRADING & 360° COPILOT ─── */}
      {activeTab === 'grade' && (
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30 space-y-6" style={{ scrollbarWidth: 'thin' }}>
          
          {/* PROGRESSIVE 360° AI SMART COPILOT BANNER */}
          {loadingSynthesis ? (
            <SkeletonSynthesisBanner />
          ) : (
            <div className="bg-gradient-to-br from-indigo-900 via-[#1B2559] to-purple-900 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-[#4318FF] to-[#F26F21] rounded-xl shadow-md shrink-0">
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black tracking-wide text-white flex items-center gap-2">
                      AI 360° SMART COPILOT
                      <span className="text-[10px] bg-white/10 px-2.5 py-0.5 rounded-full font-mono text-indigo-200 border border-white/10">Progressive Engine</span>
                    </h4>
                    <p className="text-xs text-indigo-200 mt-0.5 leading-relaxed">
                      Tự động liên kết điểm Rubric kỹ thuật với mức độ trung thực lời khai Viva
                    </p>
                  </div>
                </div>
              </div>

              {aiSuggestionError && (
                <div className="mb-3 p-3 bg-red-500/20 text-red-200 border border-red-400/40 rounded-xl text-xs flex items-center">
                  <AlertOctagon className="w-4 h-4 mr-2 shrink-0" /> {aiSuggestionError}
                </div>
              )}

              {!synthesisResult ? (
                <button
                  onClick={handleRunProgressiveAI}
                  disabled={loadingSynthesis || !submissionId}
                  className="w-full flex items-center justify-center px-4 py-3.5 bg-gradient-to-r from-[#4318FF] via-purple-600 to-[#F26F21] hover:opacity-95 disabled:opacity-50 text-white text-xs font-black rounded-xl transition-all shadow-md hover:shadow-xl active:scale-[0.99] select-none uppercase tracking-wider"
                >
                  ⚡ Chạy Đánh Giá & Kiểm Định AI Toàn Diện (1-Click)
                </button>
              ) : (
                <div className="space-y-4 pt-2 border-t border-white/10 animate-fadeIn">
                  {/* Status Badges Row */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 text-center">
                      <span className="text-[10px] text-indigo-200 block uppercase font-semibold tracking-wider">Điểm Rubric</span>
                      <span className="text-lg font-black text-white">{synthesisResult.rawRubricScore || aiSuggestion?.suggestedScore || 0} <span className="text-xs font-normal text-indigo-300">/ 10</span></span>
                    </div>
                    <div className={`p-2.5 rounded-xl border text-center ${
                      synthesisResult.auditStatus === 'RED' ? 'bg-red-500/20 border-red-400/40 text-red-200' :
                      synthesisResult.auditStatus === 'YELLOW' ? 'bg-yellow-500/20 border-yellow-400/40 text-yellow-200' :
                      'bg-green-500/20 border-green-400/40 text-green-200'
                    }`}>
                      <span className="text-[10px] block uppercase font-semibold tracking-wider opacity-80">Độ Nhất Quán</span>
                      <span className="text-lg font-black">{synthesisResult.consistencyScore || aiAuditResult?.consistencyScore || 100}% ({synthesisResult.auditStatus || 'GREEN'})</span>
                    </div>
                    <div className="bg-gradient-to-br from-[#F26F21] to-amber-600 p-2.5 rounded-xl shadow-inner text-center">
                      <span className="text-[10px] text-amber-100 block uppercase font-semibold tracking-wider">Điểm Khuyến Nghị</span>
                      <span className="text-lg font-black text-white">{synthesisResult.holisticRecommendedScore || aiSuggestion?.suggestedScore || 0} <span className="text-xs font-normal text-amber-200">/ 10</span></span>
                    </div>
                  </div>

                  {/* Synergy Summary Text */}
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs text-indigo-100 leading-relaxed">
                    <span className="font-bold text-amber-300 block mb-1">💡 Phán quyết Tổng hợp:</span>
                    {synthesisResult.synergyAnalysis || aiSuggestion?.summary || 'Đánh giá hoàn tất.'}
                  </div>

                  {/* MASTER APPLY BUTTON */}
                  <button
                    onClick={() => handleApplySynthesis(synthesisResult)}
                    className="w-full py-3 bg-white text-[#1B2559] hover:bg-indigo-50 text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center select-none tracking-wide"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600 shrink-0" /> ✅ Áp Dụng Toàn Bộ Điểm & Vấn Đáp Vào Khung Chấm
                  </button>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={handleRunProgressiveAI}
                      disabled={loadingSynthesis}
                      title="Chạy lại đánh giá AI"
                      className="text-xs font-bold px-2.5 py-1 rounded-lg text-indigo-200 hover:bg-white/10 transition-colors flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Làm mới đánh giá
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PROGRESSIVE BLOCK 1: RUBRIC BREAKDOWN */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-[#1B2559] uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#4318FF]" /> Phân Tích Rubric Kỹ Thuật (Progressive Block)
            </h3>

            {loadingAiSuggestion ? (
              <SkeletonRubricCard />
            ) : aiSuggestion ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h4 className="text-xs font-black text-[#1B2559] uppercase tracking-wide">Điểm Kỹ Thuật Đề Xuất</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">{aiSuggestion.summary || 'Tự động phân tích từ mã nguồn'}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-[#4318FF]">{aiSuggestion.suggestedScore} <span className="text-xs font-normal text-gray-400">/ 10</span></span>
                  </div>
                </div>

                {aiSuggestion.rubricBreakdown && (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                    {aiSuggestion.rubricBreakdown.map((item: any, idx: number) => (
                      <div key={idx} className="bg-gray-50/80 p-2.5 rounded-xl border border-gray-100 text-xs flex flex-col gap-1">
                        <div className="flex justify-between items-center font-bold text-[#1B2559]">
                          <span>{item.criteriaName}</span>
                          <span className="text-[#4318FF] bg-indigo-50 px-2 py-0.5 rounded font-black">{item.score} / {item.maxScore}</span>
                        </div>
                        <p className="text-gray-600 text-[11px] leading-relaxed">{item.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm text-center text-xs text-gray-400">
                Chưa có dữ liệu chấm Rubric. Hãy bấm nút <strong>Chạy Đánh Giá AI 360°</strong> phía trên.
              </div>
            )}
          </div>

          {/* FINAL SCORE INPUT & INTERACTIVE SLIDER DECK */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-5">
            <div className="text-center pb-4 border-b border-gray-100">
              <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2">Điểm Tổng Kết (Final Score)</label>
              <div className="inline-block px-8 py-3 bg-gray-50/80 border-2 border-[#4318FF]/20 rounded-2xl shadow-inner">
                <span className="text-4xl font-black text-[#1B2559]">{totalScore}</span>
                <span className="text-sm font-bold text-gray-400 ml-1">/ 10</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black text-[#1B2559] uppercase tracking-wider">Điều Chỉnh Từng Tiêu Chí (Weight Sliders)</h4>
              
              <div className="space-y-3.5">
                <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <div className="flex justify-between text-xs font-bold text-[#1B2559] mb-1.5">
                    <span>AI Reflection (30%)</span>
                    <span className="text-[#4318FF] font-black">{aiReflectionScore.toFixed(1)} / 3.0</span>
                  </div>
                  <input type="range" min="0" max="3" step="0.5" value={aiReflectionScore} onChange={(e) => setAiReflectionScore(Number(e.target.value))} className="w-full accent-[#4318FF] cursor-pointer" />
                </div>

                <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <div className="flex justify-between text-xs font-bold text-[#1B2559] mb-1.5">
                    <span>Decomposition (20%)</span>
                    <span className="text-[#4318FF] font-black">{decompositionScore.toFixed(1)} / 2.0</span>
                  </div>
                  <input type="range" min="0" max="2" step="0.5" value={decompositionScore} onChange={(e) => setDecompositionScore(Number(e.target.value))} className="w-full accent-[#4318FF] cursor-pointer" />
                </div>

                <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <div className="flex justify-between text-xs font-bold text-[#1B2559] mb-1.5">
                    <span>Pattern Recognition (15%)</span>
                    <span className="text-[#4318FF] font-black">{patternRecognitionScore.toFixed(1)} / 1.5</span>
                  </div>
                  <input type="range" min="0" max="1.5" step="0.5" value={patternRecognitionScore} onChange={(e) => setPatternRecognitionScore(Number(e.target.value))} className="w-full accent-[#4318FF] cursor-pointer" />
                </div>

                <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <div className="flex justify-between text-xs font-bold text-[#1B2559] mb-1.5">
                    <span>Abstraction (15%)</span>
                    <span className="text-[#4318FF] font-black">{abstractionScore.toFixed(1)} / 1.5</span>
                  </div>
                  <input type="range" min="0" max="1.5" step="0.5" value={abstractionScore} onChange={(e) => setAbstractionScore(Number(e.target.value))} className="w-full accent-[#4318FF] cursor-pointer" />
                </div>

                <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <div className="flex justify-between text-xs font-bold text-[#1B2559] mb-1.5">
                    <span>Algorithmic Thinking (20%)</span>
                    <span className="text-[#4318FF] font-black">{algorithmicThinkingScore.toFixed(1)} / 2.0</span>
                  </div>
                  <input type="range" min="0" max="2" step="0.5" value={algorithmicThinkingScore} onChange={(e) => setAlgorithmicThinkingScore(Number(e.target.value))} className="w-full accent-[#4318FF] cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Overall Feedback */}
            <div className="pt-2">
              <label className="block text-xs font-black text-[#1B2559] uppercase tracking-wider mb-2">Nhận Xét Học Thuật (Academic Feedback)</label>
              <textarea 
                rows={5} 
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#4318FF] focus:ring-1 focus:ring-[#4318FF] transition-all shadow-sm leading-relaxed" 
                placeholder="Nhập nhận xét tổng quan cho sinh viên hoặc áp dụng từ AI..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationPanel;

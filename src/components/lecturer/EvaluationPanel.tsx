import React, { useState } from 'react';
import { AlertOctagon } from 'lucide-react';

interface EvaluationPanelProps {
  onChange?: (data: { score: number; feedback: string }) => void;
}

const EvaluationPanel: React.FC<EvaluationPanelProps> = ({ onChange }) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'grade'>('ai');
  const [funcScore, setFuncScore] = useState(0);
  const [codeScore, setCodeScore] = useState(0);
  const [docScore, setDocScore] = useState(0);
  const [feedback, setFeedback] = useState('');

  const totalScore = (funcScore + codeScore + docScore).toFixed(1);

  React.useEffect(() => {
    if (onChange) {
      onChange({ score: parseFloat(totalScore), feedback });
    }
  }, [totalScore, feedback, onChange]);

  return (
    <div className="w-[450px] shrink-0 bg-white flex flex-col shadow-xl z-10 relative">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors relative ${activeTab === 'ai' ? 'border-[#F26F21] text-[#F26F21]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          <span className="absolute top-3 right-8 w-2 h-2 rounded-full bg-red-500"></span>
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
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 shadow-sm">
            <div className="flex items-start">
              <AlertOctagon className="w-6 h-6 text-red-500 mr-3 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-red-800">High Discrepancy Found!</h3>
                <p className="text-xs text-red-600 mt-1">Student declared only 1 pair of AI interaction (est. 10% usage), but system detected AI signatures in 95% of the codebase.</p>
              </div>
            </div>
          </div>

          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Student's AI Declaration (5 Steps)</h3>
          
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="max-h-[280px] overflow-y-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase sticky top-0 bg-gray-50 z-10">
                  <tr>
                    <th className="px-4 py-3 w-1/5">Phase</th>
                    <th className="px-4 py-3 w-2/5">Prompt/Input</th>
                    <th className="px-4 py-3 w-2/5">AI Output/Suggestion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 font-bold text-[#1B2559] align-top">1. Decomposition</td>
                    <td className="px-4 py-3 text-xs italic align-top max-w-[150px]">
                      <div className="max-h-24 overflow-y-auto break-words pr-1">"Break down an e-commerce cart system."</div>
                    </td>
                    <td className="px-4 py-3 text-xs align-top max-w-[150px]">
                      <div className="max-h-24 overflow-y-auto break-words pr-1">Suggested 4 components: Cart, Session, DB, UI.</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-[#1B2559] align-top">2. Pattern Recognition</td>
                    <td className="px-4 py-3 text-xs italic align-top max-w-[150px]">
                      <div className="max-h-24 overflow-y-auto break-words pr-1">"MVC pattern for cart"</div>
                    </td>
                    <td className="px-4 py-3 text-xs align-top max-w-[150px]">
                      <div className="max-h-24 overflow-y-auto break-words pr-1">Provided MVC file structure for Java Servlet.</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-[#1B2559] align-top">5. Self-Reflection</td>
                    <td className="px-4 py-3 text-xs italic align-top max-w-[300px]" colSpan={2}>
                      <div className="max-h-24 overflow-y-auto break-words pr-1">"I used AI to understand how Session works in Servlets, but I implemented the checkout calculation myself to handle edge cases."</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Lecturer Evaluation */}
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-bold text-[#1B2559] mb-2">Lecturer's Verification</label>
            <div className="flex space-x-4 mb-3">
              <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                <input type="radio" name="overall_verify" className="text-green-500 focus:ring-green-500" /> <span>Accept</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                <input type="radio" name="overall_verify" defaultChecked className="text-red-500 focus:ring-red-500" /> <span>Reject / Invalid</span>
              </label>
            </div>
            <textarea 
              rows={3} 
              className="w-full bg-white border border-red-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 mb-6" 
              defaultValue="This reflection does not align with the system detection. You used AI for the core logic as well, not just the Session boilerplate."
            />
          </div>

          {/* Overall AI Feedback */}
          <div>
            <label className="block text-sm font-bold text-[#1B2559] mb-2">Overall Transparency Assessment</label>
            <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-red-600 mb-4 outline-none">
              <option>Fail (Severe Plagiarism / Dishonesty)</option>
              <option>Warning (Inaccurate Declaration)</option>
              <option>Pass (Transparent)</option>
            </select>
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

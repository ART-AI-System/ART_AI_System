import { useState } from 'react';
import { ArrowLeft, Clock, Paperclip, FileText, Download, Check, CheckCircle2, FileCode, Brain, Plus, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { Card } from '../../components/common/Card';

interface AIPair {
  id: number;
  prompt: string;
  reflection: string;
}

const SubmissionDetailPage = () => {
  const [pairs, setPairs] = useState<AIPair[]>([
    { id: 1, prompt: '', reflection: '' },
    { id: 2, prompt: '', reflection: '' },
    { id: 3, prompt: '', reflection: '' },
  ]);

  const addPair = () => {
    if (pairs.length < 10) {
      setPairs([...pairs, { id: pairs.length + 1, prompt: '', reflection: '' }]);
    }
  };

  return (
    <div>
      <Link to={ROUTES.CLASS_DETAIL.replace(':id', '1')} className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-[#4318FF] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to SWD392
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Assignment Details */}
        <div className="xl:col-span-4 flex flex-col space-y-6">
          <Card>
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 bg-blue-50 text-[#4318FF] text-xs font-bold rounded-lg border border-blue-100">Assignment 1</span>
              <span className="flex items-center text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5 mr-1.5" /> Due in 2 days
              </span>
            </div>
            
            <h2 className="text-2xl font-extrabold text-[#1B2559] mb-4 leading-tight">Software Architecture Diagram Proposal</h2>
            
            <div className="flex items-center text-sm text-gray-500 font-medium mb-6 pb-6 border-b border-gray-100">
              <img src="https://ui-avatars.com/api/?name=Dr.+Smith&background=EBF4FF&color=0072BC" alt="Dr. Smith" className="w-8 h-8 rounded-full mr-3" />
              <span>Posted by Dr. Alan Smith</span>
            </div>
            
            <div className="prose prose-sm text-gray-600 font-medium mb-6">
              <p>Please design the C4 Model diagram for the upcoming e-commerce system module. Your submission should include:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>System Context Diagram</li>
                <li>Container Diagram</li>
                <li>Component Diagram</li>
              </ul>
              <p className="mt-4 text-red-500">Note: You MUST declare any AI tools (ChatGPT, Claude, Draw.io AI) used during the ideation process.</p>
            </div>
            
            <div className="bg-[#F4F7FE] p-4 rounded-xl border border-blue-100">
              <h4 className="text-sm font-bold text-[#1B2559] mb-2 flex items-center">
                <Paperclip className="w-4 h-4 mr-2" /> Attached Resources
              </h4>
              <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-50 cursor-pointer hover:border-blue-200 transition-colors">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-red-500 mr-3" />
                  <div>
                    <p className="text-xs font-bold text-gray-700">Project_Brief.pdf</p>
                    <p className="text-[10px] text-gray-400">1.2 MB</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-gray-400 hover:text-[#4318FF]" />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Submission & AI Form */}
        <div className="xl:col-span-8 flex flex-col space-y-6">
          <Card className="relative overflow-hidden">
            
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="text-xl font-bold text-[#1B2559]">Submit Work</h3>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md">
                  <Check className="w-4 h-4" />
                </div>
                <div className="w-12 h-1 bg-green-500 rounded-full"></div>
                <div className="w-8 h-8 rounded-full border-2 border-[#4318FF] text-[#4318FF] flex items-center justify-center shadow-md bg-white font-bold text-sm">
                  2
                </div>
              </div>
            </div>

            {/* Step 1: File Upload */}
            <div className="mb-8 border-b border-gray-100 pb-8">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" /> Step 1: File Uploaded
                </h4>
                <button className="text-xs font-bold text-[#4318FF] hover:underline">Change File</button>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center mr-4">
                    <FileCode className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1B2559]">SE18D01_VietKhoa_C4Diagrams.pdf</p>
                    <p className="text-xs text-gray-500 font-medium">Uploaded 2 mins ago • 3.4 MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: AI Declaration */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <h4 className="text-sm font-bold text-[#4318FF] uppercase tracking-wider flex items-center">
                  <Brain className="w-4 h-4 mr-2" /> Step 2: AI Declaration
                </h4>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                  Requirement: Min 3, Max 10 pairs
                </span>
              </div>
              
              <div className="space-y-6 max-h-[480px] overflow-y-auto pr-2 pb-2" style={{ scrollbarWidth: 'thin' }}>
                {pairs.map((pair) => (
                  <div key={pair.id} className="bg-[#F4F7FE] border border-blue-100 p-6 rounded-2xl relative">
                    <div className="flex items-center mb-4 pb-3 border-b border-blue-100/50">
                      <div className="w-6 h-6 bg-[#4318FF] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md mr-3">
                        {pair.id}
                      </div>
                      <h5 className="text-sm font-bold text-[#1B2559]">AI Interaction Pair</h5>
                    </div>
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-600 mb-2">Prompt / Input used</label>
                      <textarea 
                        rows={2} 
                        className="block w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-[#4318FF]" 
                        placeholder={pair.id === 1 ? "e.g. Help me structure a C4 Component diagram for an e-commerce cart service..." : "Paste the prompt you used..."}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2">Student's Self-Reflection</label>
                      <textarea 
                        rows={3} 
                        className="block w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-[#4318FF]" 
                        placeholder={pair.id === 1 ? "Explain what you learned and how you verified the AI's output..." : "Your reflection..."}
                      />
                    </div>
                  </div>
                ))}
                
                {pairs.length < 10 && (
                  <button 
                    onClick={addPair}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-bold text-gray-400 hover:text-[#4318FF] hover:border-[#4318FF] hover:bg-blue-50 transition-all flex items-center justify-center mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Pair (Max 10)
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-200 mr-4">Save as Draft</button>
              <button className="bg-gradient-to-br from-[#F26F21] to-[#F79C65] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-orange-200 hover:opacity-90 flex items-center">
                <Send className="w-4 h-4 mr-2" /> Submit Final Work
              </button>
            </div>
            
          </Card>
        </div>

      </div>
    </div>
  );
};

export default SubmissionDetailPage;

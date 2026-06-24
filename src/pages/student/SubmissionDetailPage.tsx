import { useState } from 'react';
import { ArrowLeft, Clock, Paperclip, FileText, Download, Check, CheckCircle2, FileCode, Brain, Send, Puzzle, Scan, Layers, GitBranch, Lightbulb, ChevronRight, ChevronLeft, ImagePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { Card } from '../../components/common/Card';

const SubmissionDetailPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { title: 'Decomposition', desc: 'Breaking down complex problems into smaller, manageable parts.', icon: <Puzzle className="w-4 h-4 mr-2" />, id: 'decomposition' },
    { title: 'Pattern Recognition', desc: 'Finding similarities or patterns among small, decomposed problems.', icon: <Scan className="w-4 h-4 mr-2" />, id: 'pattern' },
    { title: 'Abstraction', desc: 'Focusing on the important information only, ignoring irrelevant detail.', icon: <Layers className="w-4 h-4 mr-2" />, id: 'abstraction' },
    { title: 'Algorithmic Thinking', desc: 'Developing a step-by-step solution to the problem.', icon: <GitBranch className="w-4 h-4 mr-2" />, id: 'algorithmic' },
    { title: 'Reflection', desc: 'Reviewing and evaluating the problem-solving process.', icon: <Lightbulb className="w-4 h-4 mr-2" />, id: 'reflection' }
  ];

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
            <div className="mt-8">
              <div className="flex justify-between items-end mb-6">
                <h4 className="text-sm font-bold text-[#4318FF] uppercase tracking-wider flex items-center">
                  <Brain className="w-4 h-4 mr-2" /> Step 2: AI Declaration
                </h4>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                  Requirement: Complete 5 sections
                </span>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-[24px] shadow-sm overflow-hidden flex flex-col h-[550px]">
                {/* Top Horizontal Tabs */}
                <div className="flex items-center justify-start border-b border-gray-100 p-3 w-full bg-white shrink-0 z-20 overflow-x-auto hide-scrollbar gap-1">
                  {tabs.map((tab, idx) => (
                    <div key={tab.id} className="flex items-center">
                      <button 
                        onClick={() => setActiveTab(idx)}
                        className={`whitespace-nowrap flex items-center px-2 py-1.5 rounded-lg font-medium text-[11px] transition-colors relative z-10 ${
                          activeTab === idx 
                            ? 'bg-blue-50 border border-[#4318FF] text-[#4318FF] font-bold shadow-sm' 
                            : 'text-gray-500 hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        {tab.icon} {tab.title}
                      </button>
                      {idx < tabs.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mx-1" />
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-6 thin-scrollbar flex flex-col justify-between">
                  <div>
                    <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#4318FF] flex items-center justify-center mr-4">
                        {tabs[activeTab].icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#1B2559]">{tabs[activeTab].title}</h3>
                        <p className="text-sm text-gray-500">{tabs[activeTab].desc}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Prompt / Input Used <span className="text-red-500">*</span></label>
                        <textarea rows={2} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#4318FF] focus:ring-1 focus:ring-[#4318FF]" placeholder="e.g., Help me split the system into modules."></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">AI Suggestion <span className="text-red-500">*</span></label>
                        <textarea rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#4318FF]" placeholder="Paste the AI's response here..."></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Student's Self-Reflection <span className="text-red-500">*</span></label>
                        <textarea rows={3} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#4318FF] focus:ring-1 focus:ring-[#4318FF]" placeholder="Explain how you modified or applied the AI suggestion..."></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Evidence (Screenshot) <span className="text-gray-400 font-normal ml-2">Optional</span></label>
                        <div className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer group">
                          <div className="w-12 h-12 bg-blue-50 text-[#4318FF] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <ImagePlus className="w-5 h-5" />
                          </div>
                          <p className="text-sm font-bold text-[#1B2559]">Click to upload or drag & drop</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                    <button 
                      onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                      disabled={activeTab === 0}
                      className={`px-5 py-2.5 font-bold text-sm flex items-center transition-colors ${activeTab === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#1B2559] hover:bg-gray-100 rounded-xl'}`}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                    </button>
                    <button 
                      onClick={() => setActiveTab(Math.min(tabs.length - 1, activeTab + 1))}
                      className={`px-5 py-2.5 text-white rounded-xl font-bold text-sm transition-colors flex items-center shadow-md ${activeTab === tabs.length - 1 ? 'bg-green-500 hover:bg-green-600' : 'bg-[#1B2559] hover:bg-gray-800'}`}
                    >
                      {activeTab === tabs.length - 1 ? 'Finish' : 'Next Category'} {activeTab !== tabs.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
                    </button>
                  </div>
                </div>
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

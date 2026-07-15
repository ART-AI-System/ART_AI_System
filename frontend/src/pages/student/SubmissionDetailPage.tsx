import { useState } from 'react';
import { ArrowLeft, Clock, Paperclip, FileText, Download, Check, CheckCircle2, FileCode, Brain, Send, Puzzle, Scan, Layers, GitBranch, Lightbulb, ChevronRight, ChevronLeft, ImagePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { Card } from '../../components/common/Card';
import { FileUpload } from '../../components/common/FileUpload';
import AiDeclarationForm from '../../components/student/AiDeclarationForm';
import type { AiInteractionData } from '../../components/student/AiDeclarationForm';

const SubmissionDetailPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [aiData, setAiData] = useState<AiInteractionData[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFinishDeclaration = () => {
    // Scroll to the submit button
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleSubmitFinalWork = () => {
    if (!selectedFile) {
      alert("Please upload your assignment file before submitting.");
      return;
    }
    const categoriesCount = aiData.length;
    if (categoriesCount < tabs.length) {
      const confirmSubmit = window.confirm(`You have only filled ${categoriesCount}/${tabs.length} AI declaration sections. Do you want to submit anyway?`);
      if (!confirmSubmit) return;
    }
    
    alert("Assignment submitted successfully! The AI Evaluation process has been started in the background.");
    setIsSubmitted(true);
    // In a real app, we would make a POST request to /api/submissions/:id/finalize here.
  };

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
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" /> Step 1: File Upload
                </h4>
                {selectedFile && (
                  <button onClick={() => setSelectedFile(null)} className="text-xs font-bold text-[#4318FF] hover:underline">Change File</button>
                )}
              </div>
              {!selectedFile ? (
                <FileUpload 
                  onFileSelect={setSelectedFile} 
                  onFileReject={(err) => alert(err)} 
                />
              ) : (
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center mr-4">
                      <FileCode className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1B2559]">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500 font-medium">Ready to submit • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: AI Declaration */}
            <div className="mt-8">
              <div className="flex justify-between items-end mb-6">
                <h4 className="text-sm font-bold text-[#4318FF] uppercase tracking-wider flex items-center">
                  <Brain className="w-4 h-4 mr-2" /> Step 2: AI Declaration
                </h4>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                  Requirement: Complete {tabs.length} sections
                </span>
              </div>
              
              <AiDeclarationForm data={aiData} onChange={setAiData} />
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-xl text-sm font-bold flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2" /> 
                  Submitted & Evaluated Successfully
                </div>
              ) : (
                <>
                  <button className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-200 mr-4">Save as Draft</button>
                  <button 
                    onClick={handleSubmitFinalWork}
                    className="bg-gradient-to-br from-[#F26F21] to-[#F79C65] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-orange-200 hover:opacity-90 flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" /> Submit Final Work
                  </button>
                </>
              )}
            </div>
            
          </Card>
        </div>

      </div>
    </div>
  );
};

export default SubmissionDetailPage;

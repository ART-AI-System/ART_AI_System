import React from 'react';
import { X, ExternalLink, ShieldAlert, AlertTriangle, FileCode } from 'lucide-react';

interface AIDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string | null;
}

const AIDrawer: React.FC<AIDrawerProps> = ({ isOpen, onClose, studentId }) => {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`} 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[900px] max-w-full bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] z-50 transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="h-24 bg-gray-50 border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <div>
            <div className="flex items-center mb-1">
              <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mr-2 flex items-center">
                <ShieldAlert className="w-3 h-3 mr-1" /> High Discrepancy
              </span>
              <span className="text-sm font-medium text-gray-500">AI Detection Report</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#1B2559]">Nguyen Van Duc <span className="text-sm font-medium text-gray-400 ml-2">HE150001</span></h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Student Declared</div>
              <div className="flex items-end">
                <span className="text-4xl font-extrabold text-[#1B2559]">10</span>
                <span className="text-xl font-bold text-gray-400 mb-1 ml-1">%</span>
              </div>
              <p className="text-xs font-medium text-gray-500 mt-2">Only used for Pattern Recognition</p>
            </div>
            
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500">
                <AlertTriangle className="w-16 h-16" />
              </div>
              <div className="text-sm font-bold text-red-400 uppercase tracking-wider mb-2 relative z-10">System Detected</div>
              <div className="flex items-end relative z-10">
                <span className="text-4xl font-extrabold text-red-600">95</span>
                <span className="text-xl font-bold text-red-400 mb-1 ml-1">%</span>
              </div>
              <p className="text-xs font-bold text-red-500 mt-2 relative z-10">High probability of full AI generation</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Confidence Score</div>
              <div className="flex items-end">
                <span className="text-4xl font-extrabold text-[#1B2559]">99</span>
                <span className="text-xl font-bold text-gray-400 mb-1 ml-1">%</span>
              </div>
              <p className="text-xs font-medium text-gray-500 mt-2">Based on DeepSeek & GPT-4o analysis</p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-[#1B2559] mb-4">Detailed Analysis</h3>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Analysis Header */}
            <div className="flex border-b border-gray-100">
              <button className="flex-1 py-4 text-sm font-bold text-[#4318FF] border-b-2 border-[#4318FF] bg-blue-50/50">
                Code Similarity
              </button>
              <button className="flex-1 py-4 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                Structural Patterns
              </button>
              <button className="flex-1 py-4 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                Stylistic Consistency
              </button>
            </div>

            {/* Analysis Body */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  The submitted PlantUML syntax for the C4 Component Diagram perfectly matches the output patterns of <span className="font-bold text-[#1B2559]">GPT-4</span>. Specific indicators include:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-3 shrink-0"></div>
                    <span className="text-sm font-medium text-gray-700">Use of overly verbose interface definitions that are not standard in C4-PlantUML.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-3 shrink-0"></div>
                    <span className="text-sm font-medium text-gray-700">Exact match with known LLM boilerplate for relational database container nodes.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-3 shrink-0"></div>
                    <span className="text-sm font-medium text-gray-700">Lack of human-like iterative layout adjustments (e.g., completely absent `Rel_Right`, only default `Rel` used).</span>
                  </li>
                </ul>
              </div>

              {/* Source Code Snippet */}
              <div className="bg-[#1E1E1E] rounded-xl overflow-hidden border border-gray-800">
                <div className="flex items-center justify-between px-4 py-2 bg-[#2D2D2D] border-b border-black">
                  <div className="flex items-center text-xs font-bold text-gray-400">
                    <FileCode className="w-4 h-4 mr-2" /> C4_Component_Diagram.puml
                  </div>
                  <button className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center">
                    Open Viewer <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="text-xs font-mono text-gray-300 leading-relaxed">
                    <code>
<span className="text-pink-400">@startuml</span>
<span className="text-blue-400">!include</span> https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

<span className="text-green-400">' AI generated boilerplate indicator</span>
<span className="text-gray-500 bg-red-900/30">Container_Boundary(api, "API Application") {'{'}</span>
<span className="text-gray-500 bg-red-900/30">    Component(sign, "Sign In Controller", "MVC Rest Controller", "Allows users to sign in")</span>
<span className="text-gray-500 bg-red-900/30">    Component(security, "Security Component", "Spring Security", "Provides functionality related to signing in")</span>
<span className="text-gray-500 bg-red-900/30">{'}'}</span>

<span className="text-gray-500 bg-red-900/30">Rel(sign, security, "Uses")</span>
<span className="text-pink-400">@enduml</span>
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-100 mr-3 transition-colors">
            Close Report
          </button>
          <a href="/lecturer/grading/1" className="px-6 py-2.5 bg-[#F26F21] text-white font-bold text-sm rounded-xl hover:bg-[#D95D1A] shadow-md shadow-orange-500/20 transition-all">
            Proceed to Grading
          </a>
        </div>
      </div>
    </>
  );
};

export default AIDrawer;

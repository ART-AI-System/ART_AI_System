import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, ImagePlus } from 'lucide-react';

export interface RubricCategory {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

export interface AiInteractionData {
  rubricCategory: string;
  inputUsed: string;
  aiResponse: string;
  studentReflection: string;
}

interface AiDeclarationFormProps {
  categories: RubricCategory[];
  onChange: (data: Record<string, AiInteractionData>) => void;
  data: Record<string, AiInteractionData>;
  onFinish?: () => void;
}

export const AiDeclarationForm: React.FC<AiDeclarationFormProps> = ({ categories, onChange, data, onFinish }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!categories || categories.length === 0) return null;

  const currentCategory = categories[activeTab];
  const currentData = data[currentCategory.id] || {
    rubricCategory: currentCategory.title,
    inputUsed: '',
    aiResponse: '',
    studentReflection: ''
  };

  const handleFieldChange = (field: keyof AiInteractionData, value: string) => {
    onChange({
      ...data,
      [currentCategory.id]: {
        ...currentData,
        rubricCategory: currentCategory.title,
        [field]: value
      }
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-[24px] shadow-sm overflow-hidden flex flex-col h-[550px]">
      {/* Top Horizontal Tabs */}
      <div className="flex items-center justify-start border-b border-gray-100 p-3 w-full bg-white shrink-0 z-20 overflow-x-auto hide-scrollbar gap-1">
        {categories.map((tab, idx) => (
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
              {data[tab.id]?.inputUsed && data[tab.id]?.aiResponse && data[tab.id]?.studentReflection && (
                <span className="ml-1 w-2 h-2 rounded-full bg-green-500"></span>
              )}
            </button>
            {idx < categories.length - 1 && (
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
              {currentCategory.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1B2559]">{currentCategory.title}</h3>
              <p className="text-sm text-gray-500">{currentCategory.desc}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Prompt / Input Used <span className="text-red-500">*</span></label>
              <textarea 
                rows={2} 
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#4318FF] focus:ring-1 focus:ring-[#4318FF]" 
                placeholder="e.g., Help me split the system into modules."
                value={currentData.inputUsed}
                onChange={(e) => handleFieldChange('inputUsed', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">AI Suggestion <span className="text-red-500">*</span></label>
              <textarea 
                rows={3} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#4318FF]" 
                placeholder="Paste the AI's response here..."
                value={currentData.aiResponse}
                onChange={(e) => handleFieldChange('aiResponse', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Student's Self-Reflection <span className="text-red-500">*</span></label>
              <textarea 
                rows={3} 
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#4318FF] focus:ring-1 focus:ring-[#4318FF]" 
                placeholder="Explain how you modified or applied the AI suggestion..."
                value={currentData.studentReflection}
                onChange={(e) => handleFieldChange('studentReflection', e.target.value)}
              />
            </div>
            
            {/* Optional screenshot upload */}
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
            onClick={() => {
              if (activeTab === categories.length - 1) {
                if (onFinish) onFinish();
              } else {
                setActiveTab(activeTab + 1);
              }
            }}
            className={`px-5 py-2.5 text-white rounded-xl font-bold text-sm transition-colors flex items-center shadow-md ${activeTab === categories.length - 1 ? 'bg-green-500 hover:bg-green-600' : 'bg-[#1B2559] hover:bg-gray-800'}`}
          >
            {activeTab === categories.length - 1 ? 'Finish' : 'Next Category'} {activeTab !== categories.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
};

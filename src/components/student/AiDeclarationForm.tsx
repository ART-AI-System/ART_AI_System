import React, { useState } from 'react';
import { Brain, Puzzle, Scan, Layers, GitMerge, Lightbulb, ImagePlus, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const defaultCategories = [
  { id: 'Decomposition', title: 'Decomposition', desc: 'Breaking down complex problems into smaller, manageable parts.', icon: <Puzzle className="w-5 h-5" /> },
  { id: 'Pattern Recognition', title: 'Pattern Recognition', desc: 'Finding similarities or patterns among small, decomposed problems.', icon: <Scan className="w-5 h-5" /> },
  { id: 'Abstraction', title: 'Abstraction', desc: 'Focusing on the important information only, ignoring irrelevant detail.', icon: <Layers className="w-5 h-5" /> },
  { id: 'Algorithmic Thinking', title: 'Algorithmic Thinking', desc: 'Developing a step-by-step solution to the problem, or the rules to follow to solve the problem.', icon: <GitMerge className="w-5 h-5" /> },
  { id: 'Reflection', title: 'Reflection', desc: 'Reflecting on the solution to check if it is correct and efficient.', icon: <Lightbulb className="w-5 h-5" /> }
];

interface AiDeclarationFormProps {
  handleSubmit?: (formData: any) => void;
  isSubmitting?: boolean;
  categories?: any[];
  data?: any;
  onChange?: (val: any) => void;
  onFinish?: () => void;
}

const AiDeclarationForm: React.FC<AiDeclarationFormProps> = ({ 
  handleSubmit, 
  isSubmitting = false, 
  categories = defaultCategories, 
  data, 
  onChange, 
  onFinish 
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<any>(data || {});
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const handleInputChange = (field: string, value: string) => {
    const nextData = {
      ...formData,
      [activeTab]: {
        ...formData[activeTab],
        [field]: value
      }
    };
    setFormData(nextData);
    onChange?.(nextData);
  };

  const handleNext = () => {
    if (activeTab < categories.length - 1) setActiveTab(activeTab + 1);
  };

  const handlePrev = () => {
    if (activeTab > 0) setActiveTab(activeTab - 1);
  };

  const isFormComplete = () => {
    for (let i = 0; i < categories.length; i++) {
      const tabData = formData[i];
      if (!tabData || !tabData.prompt || !tabData.ai || !tabData.reflection) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-end mb-6">
        <h4 className="text-sm font-bold text-[#4318FF] uppercase tracking-wider flex items-center">
          <Brain className="w-4 h-4 mr-2" /> Step 2: AI Declaration
        </h4>
        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
          Requirement: Complete 5 sections
        </span>
      </div>
      
      {/* Horizontal Tabs */}
      <div className="bg-white border border-gray-200 rounded-[24px] shadow-sm overflow-hidden flex flex-col h-[65vh] min-h-[450px] xl:h-[550px]">
        
        <div className="flex items-center justify-between border-b border-gray-100 p-4 w-full bg-white shrink-0 z-20 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {categories.map((cat, idx) => (
            <React.Fragment key={cat.id}>
              <button 
                onClick={() => setActiveTab(idx)}
                className={`flex items-center justify-center rounded-full font-bold text-sm transition-all relative z-10 p-0 ${
                  activeTab === idx 
                    ? 'bg-blue-50 border border-[#4318FF] text-[#4318FF] shadow-sm w-auto px-4 py-2' 
                    : 'text-gray-500 hover:bg-gray-50 border border-transparent w-10 h-10'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeTab === idx ? 'bg-[#4318FF] text-white' : 'w-8 h-8 bg-gray-100 text-gray-500'}`}>
                  {idx + 1}
                </span>
                {activeTab === idx && <span className="whitespace-nowrap ml-2 block">{cat.title}</span>}
              </button>
              {idx < categories.length - 1 && (
                <div className="flex-1 h-[2px] bg-gray-100 relative mx-1 md:mx-2 flex items-center justify-center shrink-0 min-w-[20px]"></div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#4318FF] flex items-center justify-center mr-4">
                {categories[activeTab].icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1B2559]">{categories[activeTab].title}</h3>
                <p className="text-sm text-gray-500">{categories[activeTab].desc}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Prompt / Input Used <span className="text-red-500">*</span></label>
                <textarea 
                  rows={2} 
                  value={formData[activeTab]?.prompt || ''}
                  onChange={(e) => handleInputChange('prompt', e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#4318FF] focus:ring-1 focus:ring-[#4318FF]" 
                  placeholder="e.g., Help me split the system into modules."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">AI Suggestion <span className="text-red-500">*</span></label>
                <textarea 
                  rows={3} 
                  value={formData[activeTab]?.ai || ''}
                  onChange={(e) => handleInputChange('ai', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#4318FF]" 
                  placeholder="Paste the AI's response here..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Student's Self-Reflection <span className="text-red-500">*</span></label>
                <textarea 
                  rows={3}
                  value={formData[activeTab]?.reflection || ''}
                  onChange={(e) => handleInputChange('reflection', e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#4318FF] focus:ring-1 focus:ring-[#4318FF]" 
                  placeholder="Explain how you modified or applied the AI suggestion..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Evidence (Screenshot) <span className="text-gray-400 font-normal ml-2">Optional</span></label>
                <div className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-blue-50 text-[#4318FF] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <ImagePlus className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-[#1B2559]">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
            <button 
              onClick={handlePrev} 
              disabled={activeTab === 0 || isSubmitting}
              className={`px-5 py-2.5 font-bold text-sm flex items-center transition-colors ${activeTab === 0 || isSubmitting ? 'text-gray-400 cursor-not-allowed' : 'text-[#1B2559] hover:bg-gray-100 rounded-xl'}`}
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Previous
            </button>
            <button 
              onClick={() => activeTab === categories.length - 1 ? (handleSubmit ? handleSubmit(formData) : onFinish?.()) : handleNext()}
              disabled={isSubmitting || (activeTab === categories.length - 1 && !isFormComplete())}
              className={`px-5 py-2.5 text-white rounded-xl font-bold text-sm transition-colors flex items-center shadow-md ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' :
                activeTab === categories.length - 1 
                  ? (!isFormComplete() ? 'bg-green-400 opacity-50 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600') 
                  : 'bg-[#1B2559] hover:bg-gray-800'
              }`}
            >
              {isSubmitting ? (
                'Submitting...'
              ) : activeTab === categories.length - 1 ? (
                <>Finish <Check className="w-4 h-4 ml-2" /></>
              ) : (
                <>Next Category <ChevronRight className="w-4 h-4 ml-2" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface AiInteractionData {
  [key: number]: {
    prompt?: string;
    ai?: string;
    reflection?: string;
    evidence?: string;
  };
}

export { AiDeclarationForm };
export default AiDeclarationForm;

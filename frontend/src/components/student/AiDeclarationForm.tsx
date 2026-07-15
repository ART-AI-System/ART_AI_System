import React, { useState } from 'react';
import { Brain, ChevronLeft, ChevronRight, Check, Puzzle, Scan, Layers, GitBranch, Lightbulb } from 'lucide-react';

export interface AiInteractionData {
  id: string;
  aiTool: string;
  usagePurpose: string;
  promptContent: string;
  aiResponseSummary: string;
  studentDecision: string;
  reflectionText: string;
}

interface AiDeclarationFormProps {
  handleSubmit?: (formData: AiInteractionData[]) => void;
  isSubmitting?: boolean;
  data?: AiInteractionData[];
  onChange?: (val: AiInteractionData[]) => void;
  aiDeclarationConfig?: { categoryId: string, weight: number }[];
}

const CATEGORIES = [
  { id: 'decomposition', title: 'Decomposition', desc: 'Breaking down complex problems into smaller, manageable parts.', icon: <Puzzle className="w-4 h-4 mr-2" /> },
  { id: 'pattern_recognition', title: 'Pattern Recognition', desc: 'Finding similarities or patterns among small, decomposed problems.', icon: <Scan className="w-4 h-4 mr-2" /> },
  { id: 'abstraction', title: 'Abstraction', desc: 'Focusing on the important information only, ignoring irrelevant detail.', icon: <Layers className="w-4 h-4 mr-2" /> },
  { id: 'algorithmic_thinking', title: 'Algorithmic Thinking', desc: 'Developing a step-by-step solution to the problem.', icon: <GitBranch className="w-4 h-4 mr-2" /> },
  { id: 'reflection', title: 'Reflection', desc: 'Reviewing and evaluating the problem-solving process.', icon: <Lightbulb className="w-4 h-4 mr-2" /> }
];

const defaultInteraction = (purpose: string): AiInteractionData => ({
  id: Math.random().toString(36).substring(7),
  aiTool: 'chatgpt',
  usagePurpose: purpose,
  promptContent: '',
  aiResponseSummary: '',
  studentDecision: 'accepted',
  reflectionText: ''
});

const AiDeclarationForm: React.FC<AiDeclarationFormProps> = ({ 
  handleSubmit, 
  isSubmitting = false, 
  data, 
  onChange,
  aiDeclarationConfig
}) => {
  const activeCategories = aiDeclarationConfig && aiDeclarationConfig.length > 0
    ? CATEGORIES.filter(c => aiDeclarationConfig.some(conf => conf.categoryId === c.id))
    : CATEGORIES;

  // Initialize state with the active items mapping to the active categories
  const [interactions, setInteractions] = useState<AiInteractionData[]>(() => {
    if (data && data.length === activeCategories.length) return data;
    const initialData = activeCategories.map(c => defaultInteraction(c.id));
    if (data && data.length > 0) {
      data.forEach(d => {
        const idx = activeCategories.findIndex(c => c.id === d.usagePurpose);
        if (idx !== -1) initialData[idx] = d;
      });
    }
    return initialData;
  });
  
  const [activeTab, setActiveTab] = useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [activeTab]);

  const handleInputChange = (field: keyof AiInteractionData, value: string) => {
    const newInteractions = [...interactions];
    newInteractions[activeTab] = {
      ...newInteractions[activeTab],
      [field]: value
    };
    setInteractions(newInteractions);
    
    // Only pass filled out interactions to the parent
    const filledOut = newInteractions.filter(item => item.promptContent.trim() !== '');
    onChange?.(filledOut);
  };

  const currentCategory = activeCategories[activeTab];

  return (
    <div className="mt-8">
      <div className="flex justify-between items-end mb-6">
        <h4 className="text-sm font-bold text-[#4318FF] uppercase tracking-wider flex items-center">
          <Brain className="w-4 h-4 mr-2" /> Step 2: AI Declaration (Optional)
        </h4>
        <div className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
          Complete the sections where you used AI
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-[24px] shadow-sm overflow-hidden flex flex-col xl:flex-row min-h-[500px]">
        
        {/* Vertical Tabs (Left) */}
        <div className="w-full xl:w-64 bg-gray-50 border-b xl:border-b-0 xl:border-r border-gray-100 flex flex-row xl:flex-col shrink-0 overflow-x-auto xl:overflow-y-auto custom-scrollbar">
          {activeCategories.map((cat, idx) => {
            const isFilled = interactions[idx]?.promptContent?.trim() !== '';
            return (
              <button 
                key={cat.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center text-left p-4 transition-all w-48 xl:w-full shrink-0 border-b xl:border-b-0 xl:border-l-4 ${
                  activeTab === idx 
                    ? 'bg-white border-b-[#4318FF] xl:border-b-0 xl:border-l-[#4318FF] text-[#1B2559] shadow-sm' 
                    : 'border-b-transparent xl:border-l-transparent text-gray-500 hover:bg-gray-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0 ${activeTab === idx ? 'bg-blue-50 text-[#4318FF]' : 'bg-white text-gray-400 border border-gray-200'}`}>
                  {isFilled ? <Check className="w-4 h-4 text-green-500" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                </div>
                <div className="truncate">
                  <p className={`text-sm font-bold truncate ${activeTab === idx ? 'text-[#1B2559]' : 'text-gray-600'}`}>{cat.title}</p>
                  <p className="text-[10px] uppercase font-bold text-gray-400 truncate mt-0.5">{isFilled ? 'Declared' : 'Not Declared'}</p>
                </div>
              </button>
            )
          })}
        </div>
        
        {/* Content Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col justify-between bg-white custom-scrollbar">
          <div>
            <div className="flex items-start mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#4318FF] flex items-center justify-center mr-4 shrink-0">
                {currentCategory.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1B2559]">{currentCategory.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{currentCategory.desc}</p>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">AI Tool Used</label>
                  <select 
                    value={interactions[activeTab]?.aiTool || 'chatgpt'}
                    onChange={(e) => handleInputChange('aiTool', e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#4318FF]"
                  >
                    <option value="chatgpt">ChatGPT</option>
                    <option value="gemini">Gemini</option>
                    <option value="claude">Claude</option>
                    <option value="copilot">GitHub Copilot</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Decision</label>
                  <select 
                    value={interactions[activeTab]?.studentDecision || 'accepted'}
                    onChange={(e) => handleInputChange('studentDecision', e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#4318FF]"
                  >
                    <option value="accepted">Fully Accepted</option>
                    <option value="partially_accepted">Partially Accepted</option>
                    <option value="reference_only">Used for Reference Only</option>
                    <option value="rejected">Rejected (Not useful)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Prompt / Input Used</label>
                <textarea 
                  rows={2} 
                  value={interactions[activeTab]?.promptContent || ''}
                  onChange={(e) => handleInputChange('promptContent', e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#4318FF] custom-scrollbar" 
                  placeholder={`e.g., Help me apply ${currentCategory.title.toLowerCase()} for this task...`}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">AI Response Summary</label>
                <textarea 
                  rows={2} 
                  value={interactions[activeTab]?.aiResponseSummary || ''}
                  onChange={(e) => handleInputChange('aiResponseSummary', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#4318FF] custom-scrollbar" 
                  placeholder="Briefly summarize what the AI suggested..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Self-Reflection</label>
                <textarea 
                  rows={2}
                  value={interactions[activeTab]?.reflectionText || ''}
                  onChange={(e) => handleInputChange('reflectionText', e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#4318FF] custom-scrollbar" 
                  placeholder="Explain how you used this suggestion in your work, what you changed, and why..."
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100 shrink-0">
            <button 
              onClick={() => setActiveTab(prev => Math.max(0, prev - 1))} 
              disabled={activeTab === 0 || isSubmitting}
              className={`px-5 py-2.5 font-bold text-sm flex items-center transition-colors ${activeTab === 0 || isSubmitting ? 'text-gray-400 cursor-not-allowed' : 'text-[#1B2559] hover:bg-gray-100 rounded-xl'}`}
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Previous
            </button>
            <button 
              onClick={() => {
                if (activeTab === activeCategories.length - 1) {
                  if (handleSubmit) {
                    const filledOut = interactions.filter(item => item.promptContent.trim() !== '');
                    handleSubmit(filledOut);
                  }
                } else {
                  setActiveTab(prev => prev + 1);
                }
              }}
              disabled={isSubmitting}
              className={`px-5 py-2.5 text-white rounded-xl font-bold text-sm transition-colors flex items-center shadow-md ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' :
                activeTab === activeCategories.length - 1 
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-[#1B2559] hover:bg-gray-800'
              }`}
            >
              {isSubmitting ? (
                'Submitting...'
              ) : activeTab === activeCategories.length - 1 ? (
                <>Finish <Check className="w-4 h-4 ml-2" /></>
              ) : (
                <>Next <ChevronRight className="w-4 h-4 ml-2" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiDeclarationForm;

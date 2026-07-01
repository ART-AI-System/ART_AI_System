import React from 'react';

interface CampusSelectionProps {
  handleCampusSelect: (campus: string) => void;
}

const CampusSelection: React.FC<CampusSelectionProps> = ({ handleCampusSelect }) => {
  const campuses = ['hanoi', 'hcm', 'danang', 'quynhon', 'cantho'];

  return (
    <div className="w-full max-w-sm mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-extrabold text-[#1B2559] mb-2">Select Campus</h2>
        <p className="text-gray-500 text-sm font-medium">Choose your campus to continue</p>
      </div>
      <div className="space-y-3">
        {campuses.map(campus => (
          <button 
            key={campus}
            onClick={() => handleCampusSelect(campus)} 
            className="w-full text-left bg-white/50 backdrop-blur-sm border-2 border-gray-100 p-4 rounded-xl hover:border-[#4318FF] hover:bg-white transition-all font-bold text-[#1B2559] capitalize"
          >
            {campus === 'hcm' ? 'Ho Chi Minh' : campus.replace('hanoi', 'Ha Noi').replace('danang', 'Da Nang').replace('quynhon', 'Quy Nhon').replace('cantho', 'Can Tho')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CampusSelection;

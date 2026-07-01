import React from 'react';
import { Menu, ChevronRight, Download, FileSpreadsheet } from 'lucide-react';

interface LecturerTopbarProps {
  setMobileSidebarOpen: (val: boolean) => void;
  breadcrumbs: string[];
  title: string;
}

const LecturerTopbar: React.FC<LecturerTopbarProps> = ({ setMobileSidebarOpen, breadcrumbs, title }) => {
  return (
    <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-10 shrink-0">
      <div className="flex items-center">
        <button 
          onClick={() => setMobileSidebarOpen(true)}
          className="mr-4 p-2 text-gray-500 hover:text-[#F26F21] transition-colors rounded-lg hover:bg-white lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <div className="hidden md:flex items-center space-x-2 text-sm font-medium text-gray-500 mb-1">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-4 h-4" />}
                <span className={idx === breadcrumbs.length - 1 ? 'text-[#1B2559] font-bold' : 'hover:text-[#F26F21] cursor-pointer'}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#1B2559]">{title}</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button className="hidden sm:flex bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all items-center">
          <Download className="w-4 h-4 mr-2" /> Download All
        </button>
        <button className="bg-[#1B2559] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-[#2A3673] transition-all flex items-center">
          <FileSpreadsheet className="w-4 h-4 mr-2 text-green-400" /> Export Scores
        </button>
      </div>
    </header>
  );
};

export default LecturerTopbar;

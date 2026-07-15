import React from 'react';
import { ArrowLeft, GraduationCap, Users, BookOpenCheck, ShieldCheck } from 'lucide-react';

interface RoleSelectionProps {
  handleBackToCampus: () => void;
  handleRoleSelect: (role: any) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ handleBackToCampus, handleRoleSelect }) => {
  return (
    <div className="w-full max-w-sm mx-auto animate-fade-in">
      <button onClick={handleBackToCampus} className="flex items-center text-sm font-bold text-gray-400 hover:text-[#1B2559] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Campus
      </button>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-extrabold text-[#1B2559] mb-2">Choose your role</h2>
        <p className="text-gray-500 text-sm font-medium">Select how you want to access the platform</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => handleRoleSelect('student')} className="w-full group bg-white/50 border-2 border-gray-100 p-4 rounded-2xl hover:border-[#4318FF] hover:bg-white hover:shadow-lg hover:shadow-blue-500/10 transition-all flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#4318FF] flex items-center justify-center mb-3 group-hover:bg-[#4318FF] group-hover:text-white transition-colors">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#1B2559]">Student</h3>
          <p className="text-[10px] text-gray-500 mt-1">Submit works &<br/>check grades</p>
        </button>
        <button onClick={() => handleRoleSelect('lecturer')} className="w-full group bg-white/50 border-2 border-gray-100 p-4 rounded-2xl hover:border-[#F26F21] hover:bg-white hover:shadow-lg transition-all flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#F26F21] flex items-center justify-center mb-3 group-hover:bg-[#F26F21] group-hover:text-white transition-colors">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#1B2559]">Lecturer</h3>
          <p className="text-[10px] text-gray-500 mt-1">Manage classes<br/>& evaluate</p>
        </button>
        <button onClick={() => handleRoleSelect('headsubject')} className="w-full group bg-white/50 border-2 border-gray-100 p-4 rounded-2xl hover:border-[#EAB308] hover:bg-white hover:shadow-lg transition-all flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-yellow-50 text-[#EAB308] flex items-center justify-center mb-3 group-hover:bg-[#EAB308] group-hover:text-white transition-colors">
            <BookOpenCheck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#1B2559]">Head Subject</h3>
          <p className="text-[10px] text-gray-500 mt-1">Manage subjects<br/>& curriculum</p>
        </button>
        <button onClick={() => handleRoleSelect('admin')} className="w-full group bg-white/50 border-2 border-gray-100 p-4 rounded-2xl hover:border-[#16A34A] hover:bg-white hover:shadow-lg transition-all flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-[#16A34A] flex items-center justify-center mb-3 group-hover:bg-[#16A34A] group-hover:text-white transition-colors">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#1B2559]">Admin</h3>
          <p className="text-[10px] text-gray-500 mt-1">System config<br/>& users</p>
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;

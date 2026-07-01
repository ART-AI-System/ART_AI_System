import React from 'react';
import { Clock, Paperclip, FileText, Download } from 'lucide-react';

interface AssignmentDetailsProps {
  assignment: any;
}

const AssignmentDetails: React.FC<AssignmentDetailsProps> = ({ assignment }) => {
  if (!assignment) return null;

  const dueDate = new Date(assignment.deadline);
  const isPastDue = new Date() > dueDate;

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-blue-50 text-[#4318FF] text-xs font-bold rounded-lg border border-blue-100">
          Assignment
        </span>
        <span className={`flex items-center text-xs font-bold px-3 py-1 rounded-lg ${isPastDue ? 'text-red-500 bg-red-50' : 'text-orange-500 bg-orange-50'}`}>
          <Clock className="w-3.5 h-3.5 mr-1.5" /> 
          {isPastDue ? 'Past Due' : `Due: ${dueDate.toLocaleDateString()}`}
        </span>
      </div>
      
      <h2 className="text-2xl font-extrabold text-[#1B2559] mb-4 leading-tight">{assignment.title}</h2>
      
      <div className="flex items-center text-sm text-gray-500 font-medium mb-6 pb-6 border-b border-gray-100">
        <img src="https://ui-avatars.com/api/?name=Lecturer&background=EBF4FF&color=0072BC" className="w-8 h-8 rounded-full mr-3" alt="Lecturer" />
        <span>Posted by Lecturer</span>
      </div>
      
      <div className="prose prose-sm text-gray-600 font-medium mb-6">
        <p className="whitespace-pre-wrap">{assignment.description || 'No detailed instructions provided.'}</p>
        
        {assignment.aiInteractionRequired && (
          <p className="mt-4 text-red-500">
            Note: You MUST declare any AI tools used. Minimum {assignment.minAiInteractions} interactions required.
          </p>
        )}
      </div>
    </div>
  );
};

export default AssignmentDetails;

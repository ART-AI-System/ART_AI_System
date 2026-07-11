import React from 'react';
import { Clock, Paperclip, FileText, Download } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

interface AssignmentDetailsProps {
  assignment: any;
  materials?: any[];
}

const AssignmentDetails: React.FC<AssignmentDetailsProps> = ({ assignment, materials = [] }) => {
  if (!assignment) return null;

  const dueDate = new Date(assignment.deadline);
  const isPastDue = new Date() > dueDate;

  const handleDownload = async (materialId: string, filename: string) => {
    try {
      const response = await axiosClient.get(`/grade-items/materials/${materialId}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data as any]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error('Download failed', err);
      alert('Failed to download material');
    }
  };

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
            Note: You MUST declare any AI tools used.
          </p>
        )}
      </div>

      {materials.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-bold text-[#1B2559] mb-4 flex items-center">
            <Paperclip className="w-4 h-4 mr-2 text-[#4318FF]" /> Reference Materials
          </h3>
          <div className="space-y-3">
            {materials.map(m => (
              <div key={m._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 text-[#4318FF] mr-3" />
                  <span className="text-sm font-bold text-[#1B2559] truncate max-w-[200px]">{m.originalFilename}</span>
                  <span className="text-xs text-gray-400 ml-2">({(m.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <button 
                  type="button"
                  onClick={() => handleDownload(m._id, m.originalFilename)}
                  className="p-1.5 text-gray-400 hover:text-[#4318FF] hover:bg-white rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentDetails;

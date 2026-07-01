import React from 'react';
import { CheckCircle, ArrowLeft, Home, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentSubmitSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto text-center animate-fade-in">
      <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-green-500/20">
        <CheckCircle className="w-12 h-12" />
      </div>
      
      <h1 className="text-4xl font-extrabold text-[#1B2559] mb-4">Submission Successful!</h1>
      <p className="text-gray-500 text-lg mb-8 max-w-xl">
        Your work "Software Architecture Diagram Proposal" has been successfully submitted and recorded in the system.
      </p>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full mb-10 text-left">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Submission Details</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Assignment</span>
            <span className="text-[#1B2559] font-bold">Software Architecture Diagram Proposal</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Subject</span>
            <span className="text-[#1B2559] font-bold">SWD392</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Submission Time</span>
            <span className="text-[#1B2559] font-bold">{new Date().toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-50">
            <span className="text-gray-500 font-medium">Attached File</span>
            <div className="flex items-center text-[#4318FF] font-bold bg-blue-50 px-3 py-1.5 rounded-lg">
              <FileText className="w-4 h-4 mr-2" />
              SE18D01_VietKhoa_C4Diagrams.pdf
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <Link to="/student/subjects" className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center shadow-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Subject
        </Link>
        <Link to="/student/home" className="px-6 py-3 bg-[#4318FF] text-white rounded-xl font-bold hover:bg-[#3311CC] transition-colors flex items-center shadow-lg shadow-blue-500/30">
          <Home className="w-4 h-4 mr-2" /> Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default StudentSubmitSuccess;

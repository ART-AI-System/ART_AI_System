import React, { useState, useEffect } from 'react';
import { Download, CheckCircle2, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { submissionService, type AiInteraction } from '../../services/submission.service';
import FileUploadSection from './FileUploadSection';
import AiDeclarationForm from './AiDeclarationForm';

interface Version {
  _id: string;
  versionNumber: number;
  fileName: string;
  createdAt: string;
}

interface StudentSubmissionPanelProps {
  assignment: any;
  submission: any;
  onRefresh: () => void;
}

const StudentSubmissionPanel: React.FC<StudentSubmissionPanelProps> = ({ assignment, submission, onRefresh }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [error, setError] = useState('');
  const [versions, setVersions] = useState<Version[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  
  // AI Interaction state from the form
  const [aiData, setAiData] = useState<any>({});

  const aiRequired = assignment?.aiInteractionRequired !== false; // assuming true by default or explicitly set
  const minAi = assignment?.minAiInteractions || 5;

  const status = submission?.status?.toUpperCase() || 'NOT_SUBMITTED';
  const [isResubmitting, setIsResubmitting] = useState(false);

  useEffect(() => {
    if (submission?._id) {
      submissionService.getSubmissionVersions(submission._id)
        .then((res: any) => setVersions(res.result || []))
        .catch(console.error);
    }
  }, [submission]);

  // If status becomes submitted/late, stop resubmitting mode
  useEffect(() => {
    if (status === 'SUBMITTED' || status === 'LATE') {
      setIsResubmitting(false);
    }
  }, [status]);

  const handleSaveDraft = async () => {
    if (!file && !submission) return;
    setIsUploading(true);
    setError('');
    try {
      if (file && !submission) {
        await submissionService.createSubmission(assignment._id, file);
      } else if (file && submission) {
        await submissionService.resubmitVersion(submission._id, file);
      }
      onRefresh(); // Trigger parent to refetch
      alert('Draft saved successfully!');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to upload file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFinalize = async (formData: any) => {
    setIsFinalizing(true);
    setError('');
    
    try {
      let currentSubmissionId = submission?._id;

      // 1. If there's a new file, upload it first to create/update draft
      if (file) {
        if (!submission) {
          const res: any = await submissionService.createSubmission(assignment._id, file);
          currentSubmissionId = res?.result?._id || res?.data?.result?._id;
        } else {
          const res: any = await submissionService.resubmitVersion(submission._id, file);
          currentSubmissionId = res?.result?._id || res?.data?.result?._id || currentSubmissionId;
        }
      }
      
      // 2. Finalize
      if (currentSubmissionId) {
        await submissionService.finalizeSubmission(currentSubmissionId);
        onRefresh();
      } else {
        throw new Error("No submission found to finalize. Please upload a file.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to finalize submission.');
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleDownload = (versionId: string) => {
    submissionService.downloadSubmissionVersion(versionId).catch(console.error);
  };

  const handleDownloadLatest = () => {
    if (submission) {
      submissionService.downloadSubmissionLatest(submission._id).catch(console.error);
    }
  };

  const showForm = status !== 'SUBMITTED' && status !== 'LATE' || isResubmitting;

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 relative overflow-hidden">
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-lg font-extrabold text-[#1B2559]">Submission Status</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          status === 'SUBMITTED' ? 'bg-green-100 text-green-700' :
          status === 'LATE' ? 'bg-orange-100 text-orange-700' :
          status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
          'bg-gray-50 text-gray-400'
        }`}>
          {status}
        </span>
      </div>

      {showForm && (
        <div className="flex items-center space-x-2 absolute top-8 right-32 z-10">
          <button 
            onClick={() => setCurrentStep(1)}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${currentStep === 1 ? 'bg-[#4318FF] text-white shadow-md' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}>
            1
          </button>
          <div className={`w-10 h-0.5 ${currentStep === 2 ? 'bg-green-400' : 'bg-gray-200'}`}></div>
          <button 
            onClick={() => (file || submission) ? setCurrentStep(2) : alert('Please upload a file first!')}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${currentStep === 2 ? 'bg-[#4318FF] text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            2
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-200 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {showForm && (
        <div>
          <div className={currentStep === 1 ? 'block animate-fade-in' : 'hidden'}>
            <FileUploadSection onFileSelect={setFile} />
            
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button 
                onClick={handleSaveDraft}
                disabled={isUploading || (!file && !submission)}
                className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-200 mr-4 disabled:opacity-50"
              >
                {isUploading ? 'Saving...' : 'Save as Draft'}
              </button>
              <button 
                onClick={() => {
                  if (!file && !submission) {
                    alert('Please upload a file first!');
                    return;
                  }
                  setCurrentStep(2);
                }} 
                className="bg-gradient-to-br from-[#F26F21] to-[#F79C65] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-orange-200 hover:opacity-90 flex items-center"
              >
                Next: AI Declaration <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </button>
            </div>
          </div>
          
          <div className={currentStep === 2 ? 'block animate-fade-in' : 'hidden'}>
            <AiDeclarationForm 
              data={aiData}
              onChange={setAiData}
              handleSubmit={handleFinalize} 
              isSubmitting={isFinalizing} 
            />
          </div>
        </div>
      )}

      {/* FINALIZED STATE */}
      {(status === 'SUBMITTED' || status === 'LATE') && !isResubmitting && (
        <div className="bg-green-50 rounded-2xl p-6 border border-green-100 mb-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h4 className="text-lg font-bold text-green-800 mb-1">Submission Successful</h4>
          <p className="text-sm text-green-600 mb-6">Your assignment has been finalized and submitted to the lecturer.</p>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleDownloadLatest}
              className="flex items-center px-6 py-2.5 bg-white border border-green-200 text-green-700 rounded-xl text-sm font-bold hover:bg-green-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" /> Download Final File
            </button>
            <button 
              onClick={() => {
                setIsResubmitting(true);
                setCurrentStep(1);
              }}
              className="flex items-center px-6 py-2.5 bg-[#1B2559] text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
            >
              Update Submission
            </button>
          </div>
        </div>
      )}

      {/* VERSION HISTORY */}
      {versions.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-100">
          <h4 className="text-md font-bold text-[#1B2559] mb-4">Version History</h4>
          <div className="space-y-3">
            {versions.map((ver) => (
              <div key={ver._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-gray-800">Version {ver.versionNumber}</p>
                  <p className="text-xs text-gray-500">{new Date(ver.createdAt).toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => handleDownload(ver._id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Download Version"
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

export default StudentSubmissionPanel;

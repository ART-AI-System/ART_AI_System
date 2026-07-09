import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AssignmentDetails from '../../components/student/AssignmentDetails';
import FileUploadSection from '../../components/student/FileUploadSection';
import AiDeclarationForm from '../../components/student/AiDeclarationForm';
import { assignmentService } from '../../services/assignment.service';
import { submissionService } from '../../services/submission.service';

const StudentSubmission = () => {
  const navigate = useNavigate();
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [assignment, setAssignment] = useState<unknown>(null);
  const [submission, setSubmission] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignmentAndSubmission = async () => {
      if (!assignmentId) return;
      try {
        const [assignmentRes, submissionRes] = await Promise.all([
          assignmentService.getAssignmentDetail(assignmentId),
          submissionService.getMySubmission(assignmentId).catch(() => null)
        ]);
        
        // Ensure we properly extract the data from AxiosResponse or API Wrapper
        const assignData: any = assignmentRes;
        setAssignment(assignData.data?.result || assignData.result || assignData);
        
        if (submissionRes) {
          const subData: any = submissionRes;
          const extractedSub = subData.data?.result || subData.result || subData;
          setSubmission(extractedSub);
          if (subData?.status === 'FINALIZED') {
            // Optional: redirect to success or show finalized view
            // navigate('/student/assignments/success');
          }
        }
      } catch (err) {
        console.error('Failed to load assignment details', err);
        setError('Failed to load assignment details.');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignmentAndSubmission();
  }, [assignmentId]);

  const handleSubmit = async () => {
    if (!file && !submission) {
      alert('Please upload a file first!');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      if (file) {
        await submissionService.createSubmission(assignmentId!, file);
      }
      navigate('/student/assignments/success');
    } catch (err) {
      console.error('Submission error:', err);
      const error = err as { response?: { data?: { message?: string } }, message?: string };
      setError(error.response?.data?.message || 'Failed to submit assignment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 animate-fade-in">
      <Link to="/student/subjects" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-[#4318FF] transition-colors w-fit">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to SWD392
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Assignment Details */}
        <div className="xl:col-span-4 flex flex-col space-y-6">
          {loading ? (
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4318FF]"></div>
            </div>
          ) : (
            <AssignmentDetails assignment={assignment} />
          )}
        </div>

        {/* Right Column: Submission & AI Form */}
        <div className="xl:col-span-8 flex flex-col space-y-6">
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 relative overflow-hidden">
            
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="text-lg font-extrabold text-[#1B2559]">Submit Assignment</h3>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentStep(1)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${currentStep === 1 ? 'bg-[#4318FF] text-white shadow-md' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}>
                  1
                </button>
                <div className={`w-10 h-0.5 ${currentStep === 2 ? 'bg-green-400' : 'bg-gray-200'}`}></div>
                <button 
                  onClick={() => file ? setCurrentStep(2) : alert('Please upload a file first!')}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${currentStep === 2 ? 'bg-[#4318FF] text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                  2
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-200">
                {error}
              </div>
            )}

            <div className={currentStep === 1 ? 'block animate-fade-in' : 'hidden'}>
              <FileUploadSection onFileSelect={setFile} />
              
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-200 mr-4">Save as Draft</button>
                <button 
                  onClick={() => {
                    if (!file) {
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
              <AiDeclarationForm handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentSubmission;

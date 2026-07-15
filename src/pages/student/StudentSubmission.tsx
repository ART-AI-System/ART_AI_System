import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AssignmentDetails from '../../components/student/AssignmentDetails';
import StudentSubmissionPanel from '../../components/student/StudentSubmissionPanel';
import { assignmentService } from '../../services/assignment.service';
import { submissionService } from '../../services/submission.service';
import axiosClient from '../../api/axiosClient';

const StudentSubmission = () => {
  const navigate = useNavigate();
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [assignment, setAssignment] = useState<any>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignmentAndSubmission = async () => {
      if (!assignmentId) return;
      try {
        const [assignmentRes, submissionRes, materialsRes] = await Promise.all([
          assignmentService.getAssignmentDetail(assignmentId),
          submissionService.getMySubmission(assignmentId).catch(() => null),
          axiosClient.get(`/grade-items/standalone/${assignmentId}/materials`).catch(() => ({ result: [] }))
        ]);
        
        const assignData: any = assignmentRes;
        setAssignment(assignData.data?.result || assignData.result || assignData);
        
        if (submissionRes) {
          const subData: any = submissionRes;
          const extractedSub = subData.data?.result || subData.result || subData;
          setSubmission(extractedSub);
        }

        const matData: any = materialsRes;
        setMaterials(matData.data?.result || matData.result || matData || []);
      } catch (err) {
        console.error('Failed to load assignment details', err);
        setError('Failed to load assignment details.');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignmentAndSubmission();
  }, [assignmentId]);

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
            <AssignmentDetails assignment={assignment} materials={materials} />
          )}
        </div>

        {/* Right Column: Submission Panel */}
        <div className="xl:col-span-8 flex flex-col space-y-6">
          <StudentSubmissionPanel 
            assignment={assignment} 
            submission={submission}
            onRefresh={() => {
              // Trigger a refetch
              assignmentService.getAssignmentDetail(assignmentId!)
                .then((res: any) => setAssignment(res.data?.result || res.result || res))
                .catch(console.error);
              submissionService.getMySubmission(assignmentId!)
                .then((res: any) => {
                  const data = res.data?.result || res.result || res;
                  setSubmission(data);
                })
                .catch(() => setSubmission(null));
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default StudentSubmission;

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { submissionService } from '../../services/submission.service';
import { assignmentService } from '../../services/assignment.service';
import LecturerSubmissionsTable from '../../components/lecturer/LecturerSubmissionsTable';

const LecturerSubmissionList = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!assignmentId) return;
      try {
        const [assignmentRes, submissionsRes] = await Promise.all([
          assignmentService.getAssignmentDetail(assignmentId),
          submissionService.getSubmissionsByAssignment(assignmentId)
        ]);
        
        const assignData: any = assignmentRes;
        const subData: any = submissionsRes;
        setAssignment(assignData.data?.result || assignData.result || assignData);
        setSubmissions(subData.data?.result || subData.result || subData || []);
      } catch (err) {
        console.error('Failed to load submissions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [assignmentId]);



  return (
    <div className="flex flex-col space-y-6 animate-fade-in">
      <Link to="/lecturer/dashboard" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-[#4318FF] transition-colors w-fit">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4318FF]"></div>
          </div>
        ) : (
          <LecturerSubmissionsTable assignment={assignment} submissions={submissions} />
        )}
      </div>
    </div>
  );
};

export default LecturerSubmissionList;

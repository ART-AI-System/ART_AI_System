import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Search } from 'lucide-react';
import { submissionService } from '../../services/submission.service';
import { assignmentService } from '../../services/assignment.service';

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

  const handleDownload = async (versionId: string, fileName: string) => {
    try {
      const response = await submissionService.downloadSubmissionVersion(versionId) as unknown as Blob;
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'submission.zip');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download', err);
      alert('Failed to download submission');
    }
  };

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
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-extrabold text-[#1B2559]">Submissions</h1>
                <p className="text-gray-500 font-medium mt-1">Assignment: {assignment?.title || 'Unknown'}</p>
              </div>
              <div className="mt-4 md:mt-0 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] w-full md:w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Student</th>
                    <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Submitted At</th>
                    <th className="text-right py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500 font-medium">
                        No submissions yet.
                      </td>
                    </tr>
                  ) : (
                    submissions.map((sub: any) => (
                      <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm mr-3">
                              {sub.user?.fullName?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#1B2559]">{sub.user?.fullName || 'Student Name'}</p>
                              <p className="text-xs text-gray-500">{sub.user?.email || 'student@example.com'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                            sub.status === 'FINALIZED' ? 'bg-green-100 text-green-700' : 
                            sub.status === 'DRAFT' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {sub.status || 'SUBMITTED'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-500 font-medium">
                            {new Date(sub.updatedAt || sub.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => {
                              const latestVersion = sub.versions?.[sub.versions.length - 1];
                              if (latestVersion) {
                                handleDownload(latestVersion._id, sub.fileName || 'file');
                              } else {
                                handleDownload(sub._id, sub.fileName || 'file');
                              }
                            }}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Download Submission"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LecturerSubmissionList;

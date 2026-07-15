import React from 'react';
import { Download, Search, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { submissionService } from '../../services/submission.service';

interface LecturerSubmissionsTableProps {
  assignment: any;
  submissions: any[];
}

const LecturerSubmissionsTable: React.FC<LecturerSubmissionsTableProps> = ({ assignment, submissions }) => {

  const handleDownload = (submission: any) => {
    if (submission.versions && submission.versions.length > 0) {
      const latest = submission.versions[submission.versions.length - 1];
      submissionService.downloadSubmissionVersion(latest._id).catch(console.error);
    } else {
      submissionService.downloadSubmissionLatest(submission._id).catch(console.error);
    }
  };

  return (
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
                    {sub.status === 'LATE' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-100 text-orange-700">
                        <Clock className="w-3 h-3 mr-1" /> Late
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Submitted
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-500 font-medium">
                      {new Date(sub.updatedAt || sub.createdAt).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-100 text-right">
                  <div className="flex items-center justify-end space-x-3">
                    <Link
                      to={ROUTES.LECTURER_SUBMISSION_REVIEW.replace(':id', sub._id)}
                      className="flex items-center px-4 py-2 bg-[#4318FF] text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <span className="text-sm font-bold">Grade</span>
                    </Link>
                    <button 
                      onClick={() => handleDownload(sub)}
                      className="flex items-center px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Download File"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LecturerSubmissionsTable;

import React, { useEffect, useState } from 'react';
import { FileText, Calendar, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import { assignmentService } from '../../services/assignment.service';
import { Link } from 'react-router-dom';

interface AssignmentListProps {
  classId: string;
  role: 'STUDENT' | 'LECTURER' | 'SUBJECT_HEAD' | 'ADMIN';
}

export const AssignmentList: React.FC<AssignmentListProps> = ({ classId, role }) => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await assignmentService.getAssignmentsByClass(classId) as { assignments?: any[] };
      setAssignments(res.assignments || []);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }, message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [classId]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT': return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-md">DRAFT</span>;
      case 'PUBLISHED': return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">PUBLISHED</span>;
      case 'CLOSED': return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md">CLOSED</span>;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4318FF]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start text-red-700">
        <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-[24px] border border-gray-100 shadow-sm">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-[#1B2559] mb-1">No Assignments Yet</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          {role === 'LECTURER' 
            ? 'Create an assignment to get started.' 
            : 'There are no assignments for this class yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map(assignment => (
        <Link 
          key={assignment._id}
          to={`/assignments/${assignment._id}`}
          className="block bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#4318FF] hover:shadow-md transition-all group"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-[#1B2559] font-bold text-lg group-hover:text-[#4318FF] transition-colors line-clamp-1">
                  {assignment.title}
                </h4>
                <div className="flex flex-wrap items-center mt-2 gap-3 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    Due: {formatDate(assignment.deadline)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-gray-400" />
                    Weight: {assignment.weight}%
                  </span>
                  {role === 'LECTURER' && getStatusBadge(assignment.status)}
                </div>
              </div>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#4318FF] group-hover:text-white text-gray-400 transition-colors shrink-0">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { Clock, FileText, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response: any = await axiosClient.get('/students/me/submissions');
        setSubmissions(response.result || []);
      } catch (err) {
        console.error('Failed to fetch submissions:', err);
        setError('Failed to load your submissions.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="flex flex-col h-full animate-fade-in p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#1B2559]">Welcome back, {user?.fullName}!</h1>
        <p className="text-gray-500 font-medium">Here's what's happening with your coursework.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 flex flex-col justify-center items-center">
          <div className="w-12 h-12 bg-blue-50 text-[#4318FF] rounded-full flex items-center justify-center mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-extrabold text-[#1B2559]">{submissions.length}</h3>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Submissions</p>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#1B2559]">Recent Submissions</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4318FF]"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 font-bold p-4 bg-red-50 rounded-xl border border-red-100">
              {error}
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center text-gray-500 font-medium p-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>You haven't made any submissions yet.</p>
              {/* Mock link for demonstration to go to a submission */}
              <Link to="/student/assignments/submit" className="mt-4 inline-block text-[#4318FF] font-bold hover:underline">
                Submit a mock assignment (Demo)
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub: any) => (
                <div key={sub._id} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1B2559]">{sub.fileName || 'Assignment Submission'}</h4>
                      <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                        <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {new Date(sub.createdAt).toLocaleDateString()}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sub.status === 'GRADED' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                          {sub.status || 'SUBMITTED'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {sub.status === 'GRADED' && sub.finalResult?.score ? (
                      <div className="text-center">
                        <span className="block text-2xl font-extrabold text-[#1B2559]">{sub.finalResult.score}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Score</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-gray-400">Pending Grade</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

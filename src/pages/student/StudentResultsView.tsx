import React, { useState, useEffect } from 'react';
import { resultService } from '../../services/result.service';
import { BookOpen, Award, CheckCircle2, AlertOctagon, RefreshCw, BarChart2 } from 'lucide-react';

const ClassificationBadge = ({ classification }: { classification: string }) => {
  let colorClass = 'bg-gray-100 text-gray-700 border-gray-200';
  let label = classification || 'N/A';
  
  if (classification) {
    switch (classification.toLowerCase()) {
      case 'excellent':
        colorClass = 'bg-purple-100 text-purple-700 border-purple-200';
        break;
      case 'very_good':
        colorClass = 'bg-green-100 text-green-700 border-green-200';
        break;
      case 'good':
        colorClass = 'bg-yellow-100 text-yellow-700 border-yellow-200';
        break;
      case 'average':
        colorClass = 'bg-orange-100 text-orange-700 border-orange-200';
        break;
      case 'poor':
        colorClass = 'bg-red-100 text-red-700 border-red-200';
        break;
    }
    label = classification.replace('_', ' ');
  }

  return (
    <span className={`px-3 py-1 text-xs font-bold uppercase rounded-lg border ${colorClass}`}>
      {label}
    </span>
  );
};

const StudentResultsView = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res: any = await resultService.getMyFinalResults();
        setResults(res.data?.result || res.result || res.data || []);
      } catch (err) {
        console.error('Failed to fetch results', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7FE] pb-20">
      {/* Header */}
      <div className="bg-[#1B2559] pt-12 pb-24 px-10">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">My Academic Results</h1>
            <p className="text-blue-200 mt-2 text-lg">View your finalized grades and classifications across all classes.</p>
          </div>
          <div>
            <div className="bg-white/10 px-6 py-4 rounded-xl backdrop-blur-md border border-white/20 flex items-center">
              <Award className="w-8 h-8 text-yellow-400 mr-4" />
              <div>
                <p className="text-sm font-bold text-blue-200 uppercase tracking-wider">Total Finalized Classes</p>
                <p className="text-2xl font-black text-white">{results.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto w-full px-10 -mt-12 relative z-10">
        <div className="grid grid-cols-1 gap-6">
          
          {loading ? (
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-20 text-center">
              <RefreshCw className="w-10 h-10 text-[#4318FF] animate-spin mx-auto mb-4" />
              <p className="text-gray-500 font-bold">Loading your results...</p>
            </div>
          ) : results.length > 0 ? (
            results.map((result, idx) => (
              <div key={idx} className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 flex items-center justify-between group hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mr-6">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#1B2559]">
                      {result.classId?.classCode || 'Unknown Class'}
                    </h2>
                    <p className="text-sm font-bold text-gray-500 mt-1">
                      {result.classId?.subjectId?.courseCode || 'Unknown Subject'} - {result.classId?.subjectId?.name || 'Subject Name'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-10">
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Final Score</p>
                    <p className="text-3xl font-black text-[#4318FF]">{result.finalScore != null ? result.finalScore.toFixed(2) : '--'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Classification</p>
                    <ClassificationBadge classification={result.classification} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-20 text-center">
              <BarChart2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700">No Final Results Yet</h3>
              <p className="text-sm text-gray-500 mt-2">Your finalized grades will appear here once published by your lecturer.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default StudentResultsView;

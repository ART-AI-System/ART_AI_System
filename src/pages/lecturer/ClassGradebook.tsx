import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calculator, Download, Search, RefreshCw, 
  ChevronLeft, FileText, CheckCircle2, AlertOctagon, TrendingUp
} from 'lucide-react';
import { gradeService } from '../../services/grade.service';
import { resultService } from '../../services/result.service';

const ClassGradebook = () => {
  const { classId } = useParams<{ classId: string }>();
  
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [gradebook, setGradebook] = useState<any[]>([]);
  const [finalResults, setFinalResults] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  
  // Toast states
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const showToast = (message: string, type: 'success'|'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    if (!classId) return;
    setLoading(true);
    try {
      const [gbRes, frRes] = await Promise.all([
        gradeService.getClassGradebook(classId).catch(() => null),
        resultService.getFinalResultsByClass(classId).catch(() => null)
      ]);

      if (gbRes) setGradebook((gbRes as any).data?.result || (gbRes as any).result || (gbRes as any).data || []);
      if (frRes) setFinalResults((frRes as any).data?.result || (frRes as any).result || (frRes as any).data || []);
    } catch (err) {
      console.error('Failed to load gradebook data', err);
      showToast('Failed to load gradebook', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [classId]);

  const handleCalculate = async () => {
    if (!classId) return;
    setCalculating(true);
    try {
      await resultService.calculateFinalResults(classId);
      showToast('Final results calculated successfully!', 'success');
      await fetchData(); // Refresh data
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to calculate final results.', 'error');
    } finally {
      setCalculating(false);
    }
  };

  const handleExport = async () => {
    if (!classId) return;
    try {
      const response: any = await resultService.exportFinalResults(classId);
      const url = window.URL.createObjectURL(new Blob([response.data || response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'class_final_results.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export', err);
      showToast('Failed to export final results', 'error');
    }
  };

  // Merge gradebook and final results by student for unified display
  // Usually, a gradebook gives a list of students with an array of their grades.
  // We will assume `finalResults` array contains `{ studentId: { _id, fullName, rollNumber }, finalScore, classification }`
  // We'll primarily map over finalResults if available, otherwise gradebook.
  // For simplicity, we just use finalResults to display the overall view, 
  // or a merged array.

  const mergedData = gradebook.map((gbItem: any) => {
    const frItem = finalResults.find((fr: any) => fr.studentId?._id === gbItem.studentId?._id);
    return {
      ...gbItem,
      finalScore: frItem?.finalScore || 0,
      classification: frItem?.classification || 'N/A'
    };
  });

  const getBadgeColor = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'excellent': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'very_good': return 'bg-green-100 text-green-700 border-green-200';
      case 'good': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'average': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'poor': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7FE] pb-20 relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-xl border flex items-center animate-fade-in ${
          toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 mr-3" /> : <AlertOctagon className="w-5 h-5 mr-3" />}
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#1B2559] pt-12 pb-24 px-10">
        <div className="max-w-7xl mx-auto">
          <Link to={`/lecturer/classes/${classId}`} className="inline-flex items-center text-sm font-bold text-gray-300 hover:text-white mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Class
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">Class Gradebook</h1>
              <p className="text-blue-200 mt-2 text-lg">Manage grades, calculate final results, and generate reports.</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={handleCalculate}
                disabled={calculating || loading}
                className={`px-6 py-3 rounded-xl font-bold shadow-lg flex items-center transition-all ${
                  calculating ? 'bg-gray-600 text-white cursor-wait' : 'bg-[#F26F21] hover:bg-[#E86115] text-white shadow-orange-500/20'
                }`}
              >
                {calculating ? (
                  <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Calculating...</>
                ) : (
                  <><Calculator className="w-5 h-5 mr-2" /> Calculate Final Results</>
                )}
              </button>
              <button 
                onClick={handleExport}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold backdrop-blur-md transition-all flex items-center border border-white/20"
              >
                <Download className="w-5 h-5 mr-2" /> Export Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto w-full px-10 -mt-12 relative z-10">
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8">
          
          <div className="flex justify-between items-center mb-8">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search students..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl w-80 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] transition-all"
              />
            </div>
            
            <div className="flex items-center text-sm font-bold text-gray-500 space-x-6">
              <span className="flex items-center"><FileText className="w-4 h-4 mr-2 text-[#4318FF]" /> Total Students: {mergedData.length}</span>
              <span className="flex items-center"><TrendingUp className="w-4 h-4 mr-2 text-[#F26F21]" /> Calculated: {finalResults.length > 0 ? 'Yes' : 'No'}</span>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <RefreshCw className="w-10 h-10 text-[#4318FF] animate-spin mx-auto mb-4" />
              <p className="text-gray-500 font-bold">Loading gradebook data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-black">
                    <th className="px-6 py-4 rounded-tl-xl">Student Info</th>
                    <th className="px-6 py-4">Total Score (Raw)</th>
                    <th className="px-6 py-4 text-center">Final Weighted Score</th>
                    <th className="px-6 py-4 text-center">Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mergedData.filter(d => 
                    d.studentId?.fullName?.toLowerCase().includes(search.toLowerCase()) || 
                    d.studentId?.rollNumber?.toLowerCase().includes(search.toLowerCase())
                  ).map((row: any, idx: number) => (
                    <tr key={row.studentId?._id || idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold mr-4 shrink-0 shadow-sm border border-indigo-50">
                            {row.studentId?.fullName?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <p className="text-sm font-extrabold text-[#1B2559]">{row.studentId?.fullName}</p>
                            <p className="text-xs font-bold text-gray-400 mt-0.5">{row.studentId?.rollNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-600">
                        {row.totalScore != null ? row.totalScore.toFixed(2) : '--'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-black text-[#4318FF]">
                          {row.finalScore != null ? row.finalScore.toFixed(2) : '--'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 text-xs font-bold uppercase rounded-lg border ${getBadgeColor(row.classification)}`}>
                          {row.classification.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {mergedData.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">
                        No gradebook records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassGradebook;

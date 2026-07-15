import React, { useEffect, useState } from 'react';
import { Users, FileCheck2, AlertTriangle, BrainCircuit, ChevronRight, Download, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/analytics.service';
import { reportService, downloadBlob } from '../../services/report.service';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const LecturerDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Analytics State
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [submissionStats, setSubmissionStats] = useState<any>(null);
  const [aiStats, setAiStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await analyticsService.getLecturerHome();
        setData(result);
        if (result?.classes && result.classes.length > 0) {
          setSelectedClassId(result.classes[0].classId);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  useEffect(() => {
    const fetchClassStats = async () => {
      if (!selectedClassId) return;
      setLoadingStats(true);
      try {
        const [subStats, ai] = await Promise.all([
          analyticsService.getSubmissionStatistics(selectedClassId).catch(() => null),
          analyticsService.getAiStatistics(selectedClassId).catch(() => null)
        ]);
        setSubmissionStats(subStats);
        setAiStats(ai);
      } catch (error) {
        console.error('Failed to load class stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchClassStats();
  }, [selectedClassId]);

  const handleExport = async (format: string) => {
    if (!selectedClassId) return;
    setExporting(true);
    try {
      const response: any = await reportService.exportClassReport(selectedClassId, 'grade-summary', format);
      downloadBlob(response.data, `Class_Report.${format}`, response.headers['content-disposition']);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F26F21]"></div>
      </div>
    );
  }

  const classes = data?.classes ?? [];
  const totalStudents = classes.reduce((sum: number, cls: any) => sum + (cls.totalStudents || 0), 0);
  const pendingReviews = submissionStats?.pendingReviews ?? 12; // fallback to hardcoded if not provided by backend yet
  const flaggedSubmissions = aiStats?.flaggedSubmissions ?? 3;
  const averageScore = submissionStats?.averageScore ?? 0;

  // Transform data for charts safely
  const rawSubChart = submissionStats?.statusDistribution ?? { draft: 0, submitted: 0, late: 0 };
  const subChartData = [
    { name: 'Draft', count: rawSubChart.draft ?? 0 },
    { name: 'Submitted', count: rawSubChart.submitted ?? 0 },
    { name: 'Late', count: rawSubChart.late ?? 0 }
  ];

  const rawAiChart = aiStats?.usageDistribution ?? { low: 0, medium: 0, high: 0 };
  const aiChartData = [
    { name: 'Low (0-20%)', value: rawAiChart.low ?? 0, color: '#4ADE80' },
    { name: 'Medium (21-60%)', value: rawAiChart.medium ?? 0, color: '#FBBF24' },
    { name: 'High (>60%)', value: rawAiChart.high ?? 0, color: '#EF4444' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in p-2 pb-10">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-[#4318FF] mr-4">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400">Total Students</p>
            <h3 className="text-2xl font-extrabold text-[#1B2559]">{totalStudents}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center">
          <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-[#F26F21] mr-4">
            <FileCheck2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400">Pending Grading</p>
            <h3 className="text-2xl font-extrabold text-[#1B2559]">{pendingReviews}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-500 mr-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400">Flagged Issues</p>
            <h3 className="text-2xl font-extrabold text-[#1B2559]">{flaggedSubmissions}</h3>
          </div>
        </div>

        <div className="bg-[#1B2559] p-6 rounded-[24px] shadow-lg shadow-blue-900/20 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 opacity-10">
            <BrainCircuit className="w-32 h-32 text-white" />
          </div>
          <p className="text-sm font-bold text-blue-200 relative z-10">Avg Class Score</p>
          <div className="flex items-center mt-1 relative z-10">
            <h3 className="text-2xl font-extrabold text-white">{averageScore.toFixed(1)} / 10</h3>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-xl font-extrabold text-[#1B2559] flex items-center">
            <BarChart2 className="w-6 h-6 mr-2 text-[#4318FF]" /> Class Analytics
          </h2>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-[#1B2559] outline-none focus:border-[#4318FF]"
            >
              <option value="" disabled>Select a class</option>
              {classes.map((cls: any) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.subjectCode} - {cls.classCode}
                </option>
              ))}
            </select>
            
            <div className="flex bg-gray-50 p-1 rounded-xl">
              <button 
                onClick={() => handleExport('xlsx')} 
                disabled={exporting || !selectedClassId}
                className="px-3 py-1.5 text-xs font-bold bg-white text-[#1B2559] shadow-sm rounded-lg flex items-center disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 mr-1" /> XLSX
              </button>
              <button 
                onClick={() => handleExport('csv')} 
                disabled={exporting || !selectedClassId}
                className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-[#1B2559] flex items-center disabled:opacity-50"
              >
                CSV
              </button>
            </div>
          </div>
        </div>

        {loadingStats ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4318FF]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Submission Stats */}
            <div className="border border-gray-100 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-gray-500 mb-4 text-center">Submission Status</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#9CA3AF' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#9CA3AF' }} />
                    <RechartsTooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Bar dataKey="count" fill="#4318FF" radius={[6, 6, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Stats */}
            <div className="border border-gray-100 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-gray-500 mb-4 text-center">AI Usage Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={aiChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {aiChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Classes List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#1B2559]">My Classes</h2>
          <Link to="/lecturer/subjects" className="text-sm font-bold text-[#F26F21] hover:underline">View All</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls: any, index: number) => (
            <Link key={cls.classId} to={`/lecturer/subjects/${cls.classId}`} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group block">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${index % 2 === 0 ? 'bg-orange-50 text-[#F26F21]' : 'bg-blue-50 text-[#4318FF]'}`}>
                  {cls.subjectCode?.substring(0, 3)}
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">Active</span>
              </div>
              <h3 className={`text-lg font-bold text-[#1B2559] transition-colors ${index % 2 === 0 ? 'group-hover:text-[#F26F21]' : 'group-hover:text-[#4318FF]'}`}>
                {cls.subjectName}
              </h3>
              <p className="text-sm text-gray-500 font-medium mb-4">{cls.subjectCode} • Class {cls.classCode}</p>
              <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-4">
                <span className="text-gray-500 font-medium">{cls.totalStudents} Students</span>
                <span className="text-gray-400 font-bold flex items-center group-hover:text-[#4318FF]">
                  Manage <ChevronRight className="w-4 h-4 ml-1" />
                </span>
              </div>
            </Link>
          ))}
          
          {classes.length === 0 && (
            <div className="col-span-full text-center text-gray-500 font-medium p-8 bg-white rounded-[24px] shadow-sm border border-gray-100">
              You are not assigned to any classes in this semester.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;

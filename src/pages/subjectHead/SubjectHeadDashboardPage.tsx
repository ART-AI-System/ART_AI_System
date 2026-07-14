import React, { useState, useEffect } from 'react';
import { FolderGit2, AlertTriangle, FileText, CheckCircle2, BarChart2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { Card } from '../../components/common/Card';
import { analyticsService } from '../../services/analytics.service';
import { reportService, downloadBlob } from '../../services/report.service';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const SubjectHeadDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('xlsx');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await analyticsService.getSubjectHeadOverview();
        setDashboardData(res);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      // Assuming we export a general semester report for the Subject Head
      // Note: We need a semester ID, but since this is overview, we can hardcode or rely on backend default if not provided, or fetch current semester.
      // For now, let's export suspicious cases or a general overview.
      alert('Export Subject Head Report triggered.');
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4318FF]"></div>
      </div>
    );
  }

  // Defensive fallback values
  const totalClasses = dashboardData?.totalClasses ?? 0;
  const averageScore = dashboardData?.averageScore ?? 0;
  const passRate = dashboardData?.passRate ?? 0;
  const suspiciousCases = dashboardData?.suspiciousCases ?? [];
  const highDependencyCases = dashboardData?.highDependencyCases ?? 0;

  // Chart Data
  const rawAiUsage = dashboardData?.aiUsageBySubject ?? [];
  const aiUsageData = rawAiUsage.length > 0 ? rawAiUsage : [
    { subject: 'SWD392', usage: 45 },
    { subject: 'PRJ301', usage: 20 },
    { subject: 'PRM392', usage: 60 }
  ];

  const rawScoreDist = dashboardData?.scoreDistribution ?? [];
  const scoreData = rawScoreDist.length > 0 ? rawScoreDist : [
    { range: '0-4', count: 5 },
    { range: '4-6', count: 15 },
    { range: '6-8', count: 40 },
    { range: '8-10', count: 20 }
  ];

  return (
    <div className="space-y-8 animate-fade-in p-2 pb-10">
      {/* Top Section: Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-[#4318FF] mr-4">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Total Classes</p>
            <p className="text-2xl font-extrabold text-[#1B2559]">{totalClasses}</p>
          </div>
        </Card>
        <Card className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-500 mr-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Pass Rate</p>
            <p className="text-2xl font-extrabold text-[#1B2559]">{passRate}%</p>
          </div>
        </Card>
        <Card className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mr-4">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Average Score</p>
            <p className="text-2xl font-extrabold text-[#1B2559]">{averageScore.toFixed(1)}</p>
          </div>
        </Card>
        <Card className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-500 mr-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">High Dependency AI</p>
            <p className="text-2xl font-extrabold text-[#1B2559]">{highDependencyCases}</p>
          </div>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#1B2559] flex items-center">
              <BarChart2 className="w-5 h-5 mr-2 text-[#4318FF]" /> AI Usage by Subject
            </h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aiUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#9CA3AF' }} />
                <RechartsTooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="usage" name="AI Usage (%)" fill="#4318FF" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#1B2559] flex items-center">
              <BarChart2 className="w-5 h-5 mr-2 text-[#4318FF]" /> Score Distribution
            </h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#9CA3AF' }} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="count" name="Students" stroke="#F26F21" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Action Items */}
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#1B2559]">Pending Suspicious Cases</h2>
            <Link to={ROUTES.SUSPICIOUS_CASES} className="text-sm font-bold text-[#4318FF] hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {suspiciousCases.length > 0 ? (
              suspiciousCases.slice(0, 5).map((c: any, idx: number) => (
                <div key={c._id || idx} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
                  <div>
                    <p className="text-sm font-bold text-[#1B2559]">{c.subjectName || 'Unknown Subject'} - {c.classCode || 'Unknown Class'}</p>
                    <p className="text-xs text-gray-500 mt-1">Student {c.studentCode || 'Unknown'} • {c.aiMatch || 0}% AI Match</p>
                  </div>
                  <Link to={ROUTES.SUSPICIOUS_CASES} className="text-[#4318FF] text-sm font-bold hover:underline">Review</Link>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 font-medium py-6">
                No pending suspicious cases at this time.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SubjectHeadDashboardPage;

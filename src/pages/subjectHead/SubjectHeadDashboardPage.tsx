import React, { useState, useEffect } from 'react';
import { FolderGit2, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { Card } from '../../components/common/Card';
import axiosClient from '../../api/axiosClient';

const SubjectHeadDashboardPage = () => {
  const [suspiciousCases, setSuspiciousCases] = useState<any[]>([]);
  const [stats, setStats] = useState({ managedSubjects: 15, suspicious: 3, cleared: 45, reports: 12 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res: any = await axiosClient.get('/reports/suspicious-cases');
        const data = res.result || res.data || res;
        if (Array.isArray(data) && data.length > 0) {
          setSuspiciousCases(data);
          setStats(prev => ({ ...prev, suspicious: data.filter((c: any) => !c.isResolved).length }));
        }
      } catch (err) {
        console.error('Failed to fetch dashboard reports data', err);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Section: Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-[#4318FF] mr-4">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Managed Subjects</p>
            <p className="text-2xl font-extrabold text-[#1B2559]">{stats.managedSubjects}</p>
          </div>
        </Card>
        <Card className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-500 mr-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Suspicious Cases</p>
            <p className="text-2xl font-extrabold text-[#1B2559]">{stats.suspicious}</p>
          </div>
        </Card>
        <Card className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-500 mr-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Cleared Cases</p>
            <p className="text-2xl font-extrabold text-[#1B2559]">{stats.cleared}</p>
          </div>
        </Card>
        <Card className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mr-4">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Reports Generated</p>
            <p className="text-2xl font-extrabold text-[#1B2559]">{stats.reports}</p>
          </div>
        </Card>
      </div>

      {/* Action Items */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-lg font-bold text-[#1B2559] mb-4">Pending Suspicious Cases</h2>
          <div className="space-y-4">
            {suspiciousCases.length > 0 ? (
              suspiciousCases.slice(0, 3).map((c, idx) => (
                <div key={c._id || idx} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
                  <div>
                    <p className="text-sm font-bold text-[#1B2559]">{c.subjectName || 'SWD392'} - {c.classCode || 'Assignment 1'}</p>
                    <p className="text-xs text-gray-500 mt-1">Student {c.studentCode || 'SE18D01'} • {c.aiMatch || 95}% AI Match</p>
                  </div>
                  <Link to={ROUTES.SUSPICIOUS_CASES} className="text-[#4318FF] text-sm font-bold hover:underline">Review</Link>
                </div>
              ))
            ) : (
              <>
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
                  <div>
                    <p className="text-sm font-bold text-[#1B2559]">SWD392 - Assignment 1</p>
                    <p className="text-xs text-gray-500 mt-1">Student SE18D01 • 98% AI Match</p>
                  </div>
                  <Link to={ROUTES.SUSPICIOUS_CASES} className="text-[#4318FF] text-sm font-bold hover:underline">Review</Link>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
                  <div>
                    <p className="text-sm font-bold text-[#1B2559]">PRM392 - Lab 3</p>
                    <p className="text-xs text-gray-500 mt-1">Student SE18D05 • 85% AI Match</p>
                  </div>
                  <Link to={ROUTES.SUSPICIOUS_CASES} className="text-[#4318FF] text-sm font-bold hover:underline">Review</Link>
                </div>
              </>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-[#1B2559] mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to={ROUTES.CLASSES} className="bg-blue-50 text-[#4318FF] p-4 rounded-xl flex flex-col items-center justify-center text-center hover:bg-[#4318FF] hover:text-white transition-colors">
              <FolderGit2 className="w-6 h-6 mb-2" />
              <span className="text-sm font-bold">Manage Subjects</span>
            </Link>
            <Link to={ROUTES.CLASS_REPORTS} className="bg-orange-50 text-orange-500 p-4 rounded-xl flex flex-col items-center justify-center text-center hover:bg-orange-500 hover:text-white transition-colors">
              <FileText className="w-6 h-6 mb-2" />
              <span className="text-sm font-bold">Generate Reports</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SubjectHeadDashboardPage;

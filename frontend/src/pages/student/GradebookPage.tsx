import React, { useState, useEffect } from 'react';
import { Download, GraduationCap, Brain, AlertTriangle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { Card } from '../../components/common/Card';
import { DataTable } from '../../components/common/DataTable';
import type { Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import axiosClient from '../../api/axiosClient';

const mockGrades = [
  {
    id: '1',
    subject: 'SWD392',
    assignment: 'Assignment 1',
    description: 'Architecture Diagram',
    date: '10 Jun 2026',
    score: 9.0,
    aiTransparency: 95,
    status: 'success',
    statusText: 'Passed'
  },
  {
    id: '2',
    subject: 'PRM392',
    assignment: 'Lab 2',
    description: 'React Native UI',
    date: '08 Jun 2026',
    score: 7.5,
    aiTransparency: 40,
    status: 'success',
    statusText: 'Passed'
  },
  {
    id: '3',
    subject: 'SWT301',
    assignment: 'Quiz 1',
    description: 'Blackbox testing',
    date: '01 Jun 2026',
    score: 4.0,
    aiTransparency: null,
    status: 'error',
    statusText: 'Failed'
  }
];

const GradebookPage = () => {
  const [grades, setGrades] = useState<any[]>(mockGrades);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res: any = await axiosClient.get('/students/me/results');
        const data = res.result || res.data || res;
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item: any, idx: number) => ({
            id: item._id || String(idx),
            subject: item.classCode || item.subjectName || 'SWD392',
            assignment: 'Final Result',
            description: item.classification || 'Academic Term Evaluation',
            date: item.calculatedAt ? new Date(item.calculatedAt).toLocaleDateString('en-GB') : '10 Jun 2026',
            score: item.finalScore || item.totalScore || 8.5,
            aiTransparency: 92,
            status: (item.finalScore || 8.5) >= 5 ? 'success' : 'error',
            statusText: (item.finalScore || 8.5) >= 5 ? 'Passed' : 'Failed'
          }));
          setGrades(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch student results, using fallback', err);
      }
    };
    fetchGrades();
  }, []);

  const columns: Column<any>[] = [
    {
      key: 'assignment',
      label: 'Subject & Assignment',
      render: (row) => (
        <>
          <p className="font-bold text-[#1B2559]">{row.subject} - {row.assignment}</p>
          <p className="text-xs text-gray-500">{row.description}</p>
        </>
      )
    },
    {
      key: 'date',
      label: 'Date Graded',
      cellClassName: 'text-gray-600 font-medium'
    },
    {
      key: 'score',
      label: 'Score',
      render: (row) => (
        <>
          <span className={`font-extrabold text-base ${row.score < 5 ? 'text-red-500' : 'text-[#1B2559]'}`}>{row.score.toFixed(1)}</span>
          <span className="text-xs text-gray-400">/10</span>
        </>
      )
    },
    {
      key: 'aiTransparency',
      label: 'AI Transparency',
      render: (row) => {
        if (row.aiTransparency === null) {
          return (
            <div className="flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300 mr-2"></span>
              <span className="font-bold text-gray-500">N/A</span>
            </div>
          );
        }
        
        const isHighWarning = row.aiTransparency < 50;
        return (
          <div className="flex items-center">
            <span className={`w-2.5 h-2.5 rounded-full mr-2 ${isHighWarning ? 'bg-orange-400' : 'bg-green-500'}`}></span>
            <span className="font-bold text-gray-700">{row.aiTransparency}%</span>
            {isHighWarning && <AlertTriangle className="w-3.5 h-3.5 text-orange-400 ml-2" />}
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      cellClassName: 'text-center',
      headerClassName: 'text-center',
      render: (row) => (
        <StatusBadge 
          label={row.statusText} 
          variant={row.status as 'success' | 'warning' | 'error' | 'info' | 'default'} 
        />
      )
    },
    {
      key: 'actions',
      label: 'Feedback',
      cellClassName: 'text-right',
      headerClassName: 'text-right',
      render: (row) => (
        <Link to={ROUTES.SUBMISSION_DETAIL.replace(':id', row.id)} className="inline-flex text-[#4318FF] hover:bg-blue-50 p-2 rounded-lg transition-colors font-bold text-xs items-center ml-auto">
          View <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B2559]">Gradebook</h1>
          <p className="text-gray-500 font-medium mt-1">Summer 2026 Academic Report</p>
        </div>
        <button className="bg-white text-[#4318FF] border border-blue-100 px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-sm hover:bg-blue-50">
          <Download className="w-4 h-4 mr-2" /> Export PDF
        </button>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stat 1 */}
        <Card className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-[#4318FF] flex items-center justify-center mr-4">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase">Average Score</p>
            <h3 className="text-2xl font-extrabold text-[#1B2559]">
              8.4 <span className="text-sm text-gray-400 font-medium">/10</span>
            </h3>
          </div>
        </Card>
        
        {/* Stat 2 */}
        <Card className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mr-4">
            <Brain className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase">AI Transparency Avg</p>
            <h3 className="text-2xl font-extrabold text-[#1B2559]">
              92% <span className="text-sm text-green-500 font-bold ml-2">Excellent</span>
            </h3>
          </div>
        </Card>
        
        {/* Stat 3 */}
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase mb-1">Passed Subjects</p>
            <h3 className="text-2xl font-extrabold text-[#1B2559]">
              2 <span className="text-sm text-gray-400 font-medium">/ 4</span>
            </h3>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-400 uppercase mb-1">Failed</p>
            <h3 className="text-2xl font-extrabold text-red-500">0</h3>
          </div>
        </Card>
      </div>

      {/* Data Table */}
      <Card noPadding className="overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-[#1B2559]">Recent Grades</h3>
          <select className="bg-white border border-gray-200 text-sm font-bold text-gray-600 rounded-lg px-3 py-2 outline-none">
            <option>All Subjects</option>
            <option>SWD392</option>
            <option>PRM392</option>
          </select>
        </div>
        
        <DataTable 
          columns={columns} 
          data={grades} 
          keyExtractor={(row) => row.id} 
        />
      </Card>
    </div>
  );
};

export default GradebookPage;

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, CheckCircle2, Search, Filter, ShieldAlert, Eye, 
  FileText, User, Calendar, BookOpen, ChevronRight, X, AlertOctagon, Check 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { Card } from '../../components/common/Card';
import axiosClient from '../../api/axiosClient';

const mockSuspiciousCases = [
  {
    _id: 'case-1',
    studentId: '661122334455667788990004',
    studentFullName: 'Nguyen Van An',
    studentCode: 'SE18D01',
    classId: '661122334455667788990021',
    classCode: 'SE20A09',
    subjectName: 'Software Architecture & Design (SWD392)',
    semester: 'SP26',
    flagType: 'high_ai_match',
    suspectLevel: 'high',
    description: 'AI usage detected at 98% (Exceeds 80% threshold). Significant code structure match with AI generated patterns.',
    createdAt: '2026-06-15T10:30:00Z',
    isResolved: false,
    aiTransparency: 2,
    aiMatch: 98
  },
  {
    _id: 'case-2',
    studentId: '661122334455667788990005',
    studentFullName: 'Tran Thi Binh',
    studentCode: 'SE18D05',
    classId: '661122334455667788990022',
    classCode: 'SE20A10',
    subjectName: 'React Native Mobile Development (PRM392)',
    semester: 'SP26',
    flagType: 'discrepancy_flag',
    suspectLevel: 'high',
    description: 'Declared 10% AI usage but system evaluation detected 85% AI match in UI state management modules.',
    createdAt: '2026-06-14T14:15:00Z',
    isResolved: false,
    aiTransparency: 15,
    aiMatch: 85
  },
  {
    _id: 'case-3',
    studentId: '661122334455667788990006',
    studentFullName: 'Le Hoang Cuong',
    studentCode: 'SE18D09',
    classId: '661122334455667788990023',
    classCode: 'SE20A11',
    subjectName: 'Database Systems (DBI202)',
    semester: 'SP26',
    flagType: 'high_ai_match',
    suspectLevel: 'high',
    description: 'SQL indexing optimization essay contains 88% AI generated text without proper attribution.',
    createdAt: '2026-06-12T09:00:00Z',
    isResolved: false,
    aiTransparency: 12,
    aiMatch: 88
  }
];

const SuspiciousCasesPage = () => {
  const [cases, setCases] = useState<any[]>(mockSuspiciousCases);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('ALL');
  const [selectedCase, setSelectedCase] = useState<any | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        const res: any = await axiosClient.get('/reports/suspicious-cases');
        const data = res.result || res.data || res;
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item: any, idx: number) => ({
            ...item,
            _id: item._id || `case-api-${idx}`,
            studentFullName: item.studentFullName || 'Student Account',
            studentCode: item.studentCode || `SE1800${idx}`,
            classCode: item.classCode || 'SE20A09',
            subjectName: item.subjectName || 'Course Assignment',
            aiMatch: item.aiMatch || (item.suspectLevel === 'high' ? 92 : 82),
            description: item.description || 'High AI generation match detected by automated evaluation engine.'
          }));
          setCases(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch suspicious cases from API, using mock data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const handleResolveCase = (id: string, action: 'clear' | 'penalty') => {
    setCases(prev => prev.map(c => c._id === id ? { ...c, isResolved: true, resolutionAction: action } : c));
    setSelectedCase(null);
    alert(action === 'clear' ? 'Case marked as Cleared / Resolved.' : 'Academic integrity penalty issued for this case.');
  };

  const filteredCases = cases.filter(c => {
    if (c.isResolved) return false;
    if (selectedSemester !== 'ALL' && c.semester !== selectedSemester) return false;
    if (searchTerm && !`${c.studentFullName} ${c.studentCode} ${c.classCode} ${c.subjectName}`.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sm font-bold text-gray-500 mb-1">
            <Link to={ROUTES.DASHBOARD_SUBJECT_HEAD} className="hover:text-[#4318FF] transition-colors">Subject Head Dashboard</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1B2559]">Academic Integrity Audit</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1B2559] flex items-center">
            <ShieldAlert className="w-8 h-8 text-red-500 mr-3" />
            Suspicious Cases Audit Logs
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Review submissions flagged with &gt;80% AI similarity or high discrepancy against declarations.
          </p>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="flex items-center justify-between border-l-4 border-l-red-500">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Pending Review</p>
            <h3 className="text-3xl font-extrabold text-red-600">{cases.filter(c => !c.isResolved).length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </Card>

        <Card className="flex items-center justify-between border-l-4 border-l-orange-500">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">&gt;90% AI Match</p>
            <h3 className="text-3xl font-extrabold text-[#1B2559]">{cases.filter(c => !c.isResolved && (c.aiMatch || 0) >= 90).length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </Card>

        <Card className="flex items-center justify-between border-l-4 border-l-blue-500">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Subjects Affected</p>
            <h3 className="text-3xl font-extrabold text-[#1B2559]">{new Set(cases.filter(c => !c.isResolved).map(c => c.subjectName)).size}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </Card>

        <Card className="flex items-center justify-between border-l-4 border-l-green-500">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Resolved / Cleared</p>
            <h3 className="text-3xl font-extrabold text-green-600">{cases.filter(c => c.isResolved).length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Search & Filter Toolbar */}
      <Card className="mb-8 p-4 bg-gray-50/50 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by student code, name, class or subject..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#4318FF] transition-colors"
          />
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-600">
            <Filter className="w-4 h-4 mr-2 text-gray-400" />
            <span className="mr-2">Semester:</span>
            <select 
              value={selectedSemester} 
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-transparent outline-none font-extrabold text-[#1B2559]"
            >
              <option value="ALL">All Semesters</option>
              <option value="SP26">Spring 2026</option>
              <option value="FA25">Fall 2025</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Cases List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="p-12 text-center text-gray-400 font-bold">
            Loading suspicious cases from AI evaluation engine...
          </Card>
        ) : filteredCases.length === 0 ? (
          <Card className="p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#1B2559]">No Pending Suspicious Cases Found</h3>
            <p className="text-gray-500 text-sm mt-1">All flagged submissions have been reviewed or cleared.</p>
          </Card>
        ) : (
          filteredCases.map(c => (
            <Card key={c._id} className="p-6 border-l-4 border-l-red-500 hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 font-extrabold text-lg">
                    {c.aiMatch || 90}%
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="bg-red-100 text-red-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                        High AI Similarity
                      </span>
                      <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {c.classCode}
                      </span>
                      <span className="text-xs font-bold text-gray-400">• {c.semester}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#1B2559]">
                      {c.studentFullName} <span className="text-gray-500 text-sm font-medium">({c.studentCode})</span>
                    </h3>
                    <p className="text-sm font-bold text-[#4318FF] mt-0.5">{c.subjectName}</p>
                    <p className="text-sm text-gray-600 mt-2 bg-red-50/50 p-3 rounded-xl border border-red-100 font-medium">
                      <span className="font-bold text-red-700 mr-1">AI Audit Flag:</span>
                      {c.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-end lg:self-center">
                  <button 
                    onClick={() => setSelectedCase(c)}
                    className="bg-[#1B2559] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#2A3673] transition-all flex items-center shadow-sm"
                  >
                    <Eye className="w-4 h-4 mr-2" /> Review Case
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Case Review Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[24px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedCase(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#1B2559]">Suspicious Case Investigation</h3>
                <p className="text-xs font-bold text-gray-400">ID: {selectedCase._id}</p>
              </div>
            </div>

            <div className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-6 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Student Name & Code</p>
                  <p className="font-extrabold text-[#1B2559] text-base mt-0.5">{selectedCase.studentFullName} ({selectedCase.studentCode})</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Class Code</p>
                  <p className="font-extrabold text-[#1B2559] text-base mt-0.5">{selectedCase.classCode} • {selectedCase.semester}</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <p className="text-xs font-bold text-gray-400 uppercase">Subject</p>
                <p className="font-extrabold text-[#4318FF] mt-0.5">{selectedCase.subjectName}</p>
              </div>
              <div className="border-t border-gray-200 pt-3 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">AI Similarity Match</p>
                  <p className="font-extrabold text-red-600 text-xl mt-0.5">{selectedCase.aiMatch}%</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Declared AI Usage</p>
                  <p className="font-extrabold text-gray-700 text-xl mt-0.5">{selectedCase.aiTransparency}%</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Audit Flag Description</p>
                <p className="text-gray-700 font-medium bg-white p-3 rounded-xl border border-gray-200">{selectedCase.description}</p>
              </div>
            </div>

            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-6 flex items-start space-x-3 text-xs text-blue-800 font-medium">
              <FileText className="w-5 h-5 text-[#4318FF] shrink-0 mt-0.5" />
              <p>
                As Subject Head, you can clear this case if the AI similarity is deemed acceptable (e.g. standard boilerplate/template usage), or issue an academic integrity penalty which flags the student record.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button 
                onClick={() => handleResolveCase(selectedCase._id, 'clear')}
                className="px-5 py-2.5 rounded-xl border-2 border-green-500 text-green-600 font-bold hover:bg-green-50 transition-all flex items-center justify-center"
              >
                <Check className="w-4 h-4 mr-2" /> Clear Flag (False Alarm)
              </button>
              <button 
                onClick={() => handleResolveCase(selectedCase._id, 'penalty')}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all flex items-center justify-center shadow-md shadow-red-500/20"
              >
                <ShieldAlert className="w-4 h-4 mr-2" /> Issue Integrity Penalty
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuspiciousCasesPage;

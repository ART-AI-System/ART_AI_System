import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { 
  ChevronRight, Download, FileSpreadsheet, Search, 
  FileArchive, AlertTriangle, FileCode, CheckCircle2, Eye, X
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { ROUTES } from '../../config/routes';
import { classService } from '../../services/class.service';
import { submissionService } from '../../services/submission.service';

const LecturerGradingListPage = () => {
  const { classId } = useParams<{ classId: string }>();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<any>(null);
  const [gradeItems, setGradeItems] = useState<any[]>([]);
  const [selectedGradeItemId, setSelectedGradeItemId] = useState<string>('');
  
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [viewingAiDeclaration, setViewingAiDeclaration] = useState<string | null>(null);
  const [aiInteractionsData, setAiInteractionsData] = useState<any[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleViewAiDeclaration = async (submissionId: string) => {
    setViewingAiDeclaration(submissionId);
    setLoadingAi(true);
    try {
      const res: any = await axiosClient.get(`/submissions/${submissionId}/ai-interactions`);
      setAiInteractionsData(res.result || res.data?.result || []);
    } catch (error) {
      console.error('Failed to fetch AI interactions', error);
      setAiInteractionsData([]);
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!classId) return;
      try {
        const [classRes, itemsRes] = await Promise.all([
          classService.getClassById(classId),
          submissionService.getGradeItemsByClass(classId)
        ]);
        
        setClassData(classRes);
        const items = (itemsRes as any).data?.result || (itemsRes as any).result || (itemsRes as any).data || [];
        setGradeItems(items);
        if (items.length > 0) {
          const preSelected = location.state?.selectedGradeItemId;
          const exists = items.some((i: any) => i._id === preSelected);
          setSelectedGradeItemId(exists ? preSelected : items[0]._id);
        }
      } catch (error) {
        console.error('Failed to fetch class and grade items', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [classId]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!selectedGradeItemId) return;
      setDataLoading(true);
      try {
        const [submissionsRes, gradesRes] = await Promise.all([
          submissionService.getSubmissionsByGradeItem(selectedGradeItemId).catch(() => null),
          submissionService.getGradesByGradeItem(selectedGradeItemId).catch(() => null)
        ]);

        const subs = (submissionsRes as any)?.data?.result || (submissionsRes as any)?.result || (submissionsRes as any)?.data || [];
        const grs = (gradesRes as any)?.data?.result || (gradesRes as any)?.result || (gradesRes as any)?.data || [];

        setSubmissions(subs);
        setGrades(grs);
      } catch (error) {
        console.error('Failed to fetch submissions', error);
      } finally {
        setDataLoading(false);
      }
    };
    fetchSubmissions();
  }, [selectedGradeItemId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-50/50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2559]"></div>
      </div>
    );
  }

  const selectedItemName = gradeItems.find(i => i._id === selectedGradeItemId)?.title || 'No Assignment Selected';
  const students = classData?.students || [];

  // Merge students with submissions and grades
  const mergedData = students.map((student: any) => {
    const submission = submissions.find(s => s.studentId?._id === student.studentId || s.studentId === student.studentId);
    const grade = grades.find(g => g.submissionId === submission?._id);
    
    return {
      student,
      submission,
      grade
    };
  });

  const filteredData = mergedData.filter((item: any) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return item.student.fullName.toLowerCase().includes(term) || item.student.studentCode.toLowerCase().includes(term);
  });

  const submittedCount = submissions.length;
  const pendingCount = students.length - submittedCount;

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* DASHBOARD CONTENT */}
      <div className="flex-1 p-4 md:p-10 relative">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Page Header & Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-500 mb-2">
                <Link to={`/lecturer/grading`} className="hover:text-[#F26F21] cursor-pointer">
                  {classData?.subjectSnapshot?.code || 'Subject'} ({classData?.classCode || 'Class'})
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#1B2559] font-bold">
                  <select 
                    value={selectedGradeItemId} 
                    onChange={e => setSelectedGradeItemId(e.target.value)}
                    className="bg-white border border-gray-200 text-[#1B2559] px-3 py-1.5 rounded-lg outline-none font-bold"
                  >
                    {gradeItems.map(item => (
                      <option key={item._id} value={item._id}>{item.title}</option>
                    ))}
                    {gradeItems.length === 0 && <option value="">No Assignments</option>}
                  </select>
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#1B2559]">Submissions: {selectedItemName}</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all flex items-center">
                <Download className="w-4 h-4 mr-2" /> Download All
              </button>
              <button className="bg-[#1B2559] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-[#2A3673] transition-all flex items-center">
                <FileSpreadsheet className="w-4 h-4 mr-2 text-green-400" /> Export Scores
              </button>
            </div>
          </div>
          
          {/* Filters & Stats */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              <div className="bg-white border border-gray-200 rounded-xl flex items-center px-4 py-2 shadow-sm w-full md:w-72">
                <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search student name or ID..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-sm outline-none text-gray-700 bg-transparent" 
                />
              </div>
            </div>
            
            <div className="flex space-x-6 text-sm">
              <div className="text-center">
                <span className="block text-gray-400 font-bold">Total Enrolled</span>
                <span className="text-xl font-extrabold text-[#1B2559]">{students.length}</span>
              </div>
              <div className="text-center">
                <span className="block text-gray-400 font-bold">Submitted</span>
                <span className="text-xl font-extrabold text-green-600">{submittedCount}</span>
              </div>
              <div className="text-center">
                <span className="block text-gray-400 font-bold">Pending</span>
                <span className="text-xl font-extrabold text-[#F26F21]">{pendingCount}</span>
              </div>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-white border border-gray-200 rounded-[24px] shadow-sm overflow-hidden overflow-x-auto relative min-h-[400px]">
            {dataLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2559]"></div>
              </div>
            )}
            
            <table className="w-full text-left text-sm text-gray-600 min-w-[1000px]">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">No</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Status & Time</th>
                  <th className="px-6 py-4">File / Link</th>
                  <th className="px-6 py-4">AI Transparency</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((row: any, index: number) => (
                  <tr key={`${row.student?.studentId || row.submission?._id || 'row'}-${index}`} className={`hover:bg-gray-50 transition-colors ${row.grade ? 'bg-gray-50/50 opacity-80' : ''}`}>
                    <td className="px-6 py-4 font-medium">{index + 1}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#1B2559]">{row.student.fullName}</p>
                      <p className="text-xs text-gray-500">{row.student.studentCode || row.student.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      {row.submission ? (
                        <>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mb-1 ${row.grade ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                            {row.grade ? 'Graded' : 'Submitted'}
                          </span>
                          <p className="text-xs text-gray-500">{new Date(row.submission.submittedAt).toLocaleString()}</p>
                        </>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {row.submission ? (
                        <button 
                          onClick={async () => {
                            try {
                              const { submissionService } = await import('../../services/submission.service');
                              await submissionService.downloadSubmissionLatest(row.submission._id, row.submission.fileName);
                            } catch (e: any) {
                              console.error('Download Error:', e);
                              alert('Could not download file. ' + (e?.response?.data?.message || e.message || ''));
                            }
                          }}
                          className="text-[#4318FF] font-bold hover:underline flex items-center cursor-pointer bg-transparent border-none p-0"
                        >
                          <FileArchive className="w-4 h-4 mr-1 shrink-0" /> <span className="truncate max-w-[120px]">{row.submission.fileName || 'Download Zip'}</span>
                        </button>
                      ) : (
                        <span className="text-gray-400 italic">No file</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {row.submission ? (
                        <div className="flex flex-col w-48">
                           {/* Using static AI values for now unless API returns them */}
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-gray-500">Declared AI Usage</span>
                            <button 
                              onClick={() => handleViewAiDeclaration(row.submission._id)}
                              className="text-[#4318FF] hover:bg-blue-50 p-1 rounded-full transition-colors"
                              title="View AI Declarations"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-gray-400 h-1.5 rounded-full w-[50%]"></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-[#1B2559] text-lg">
                      {row.grade ? row.grade.score : <span className="text-gray-400 text-sm font-normal">-</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.submission ? (
                        <Link 
                          to={`/lecturer/grading/detail/${row.submission._id}`} 
                          className={`inline-flex items-center px-4 py-2 text-xs font-bold rounded-lg transition-colors shadow-sm ${
                            row.grade 
                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                              : 'bg-[#F26F21] text-white hover:bg-[#D95D1A] shadow-orange-500/20'
                          }`}
                        >
                          {row.grade ? 'View' : 'Evaluate'}
                        </Link>
                      ) : (
                        <button disabled className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg cursor-not-allowed">
                          Evaluate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-medium">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* AI Declaration Sidebar Panel */}
      {viewingAiDeclaration && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setViewingAiDeclaration(null)}
          ></div>
          
          {/* Sidebar */}
          <div className="absolute inset-y-0 right-0 w-1/2 min-w-[700px] flex">
            <div className="w-full h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
              
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-50 p-2.5 rounded-xl text-[#4318FF]">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#1B2559]">AI Declarations</h3>
                    <p className="text-sm font-medium text-gray-500 mt-0.5">Quick view of student's AI usage report</p>
                  </div>
                </div>
                <button 
                  onClick={() => setViewingAiDeclaration(null)}
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
                {loadingAi ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1B2559]"></div>
                  </div>
                ) : aiInteractionsData.length > 0 ? (
                  <div className="rounded-2xl border border-gray-200 shadow-sm bg-white overflow-hidden">
                    <table className="w-full text-left text-sm text-gray-600 table-fixed">
                      <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-[#1B2559] uppercase tracking-wider">
                        <tr>
                          <th className="px-3 py-4 w-[16%]">Tool & Purpose</th>
                          <th className="px-3 py-4 w-[35%]">Prompt Content</th>
                          <th className="px-3 py-4 w-[35%]">Response & Reflection</th>
                          <th className="px-3 py-4 w-[14%] text-center">Decision</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {aiInteractionsData.map((interaction: any, idx: number) => {
                          const phaseLabels = [
                            "AI Reflection",
                            "Decomposition",
                            "Pattern Recognition",
                            "Abstraction",
                            "Algorithmic Thinking"
                          ];
                          return (
                          <tr key={`${interaction._id || 'ai'}-${idx}`} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-3 py-5 align-top">
                              <div className="font-black text-[#4318FF] uppercase text-sm mb-2 break-all">
                                {interaction.aiTool}
                              </div>
                              <div className="inline-flex items-center px-2 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200 text-center break-words max-w-full">
                                {phaseLabels[idx] || interaction.usagePurpose?.replace(/_/g, ' ')}
                              </div>
                            </td>
                            <td className="px-3 py-5 align-top">
                              <div className="text-sm bg-gray-50/80 p-3 rounded-xl border border-gray-200 h-40 overflow-y-auto whitespace-pre-wrap break-all font-medium text-gray-700 leading-relaxed shadow-sm">
                                {interaction.promptContent}
                              </div>
                            </td>
                            <td className="px-3 py-5 align-top">
                              <div className="text-sm space-y-3">
                                <div>
                                  <div className="font-bold text-[#1B2559] mb-1.5 flex items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 shrink-0"></div>
                                    AI Response:
                                  </div>
                                  <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 h-20 overflow-y-auto whitespace-pre-wrap break-all text-gray-700 leading-relaxed shadow-sm">
                                    {interaction.aiResponseSummary}
                                  </div>
                                </div>
                                <div>
                                  <div className="font-bold text-[#1B2559] mb-1.5 flex items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 shrink-0"></div>
                                    Student Reflection:
                                  </div>
                                  <div className="bg-green-50/50 p-3 rounded-xl border border-green-100 h-20 overflow-y-auto whitespace-pre-wrap break-all text-gray-700 italic leading-relaxed shadow-sm">
                                    {interaction.reflectionText}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-5 align-top text-center">
                              <span className={`inline-flex items-center justify-center px-2 py-1.5 rounded-lg text-[11px] font-bold shadow-sm border w-full max-w-full break-words ${
                                interaction.studentDecision === 'accepted' ? 'bg-green-50 text-green-700 border-green-200' :
                                interaction.studentDecision === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-orange-50 text-orange-700 border-orange-200'
                              }`}>
                                {interaction.studentDecision.replace(/_/g, ' ')}
                              </span>
                            </td>
                          </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="bg-gray-100 p-6 rounded-full mb-4">
                      <FileArchive className="w-12 h-12 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-bold text-[#1B2559] mb-1">No AI Declarations</h4>
                    <p className="text-gray-500 max-w-sm">This student did not declare any AI interactions for this submission.</p>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button
                  onClick={() => setViewingAiDeclaration(null)}
                  className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Close Panel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerGradingListPage;

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ChevronRight, Download, FileSpreadsheet, Search, 
  FileArchive, AlertTriangle, FileCode, CheckCircle2 
} from 'lucide-react';
import { ROUTES } from '../../config/routes';
import { classService } from '../../services/class.service';
import { submissionService } from '../../services/submission.service';

const LecturerGradingListPage = () => {
  const { classId } = useParams<{ classId: string }>();
  
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<any>(null);
  const [gradeItems, setGradeItems] = useState<any[]>([]);
  const [selectedGradeItemId, setSelectedGradeItemId] = useState<string>('');
  
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
          setSelectedGradeItemId(items[0]._id);
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
        const [subRes, gradeRes] = await Promise.all([
          submissionService.getSubmissionsByGradeItem(selectedGradeItemId).catch(() => null),
          submissionService.getGradesByGradeItem(selectedGradeItemId).catch(() => null)
        ]);

        setSubmissions((subRes as any)?.data?.result || (subRes as any)?.result || (subRes as any)?.data || []);
        setGrades((gradeRes as any)?.data?.result || (gradeRes as any)?.result || (gradeRes as any)?.data || []);
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
  const rawStudents = classData?.students || [];
  const students = Array.from(new Map(rawStudents.map((s: any) => [s.studentId, s])).values());

  // Merge students with submissions and grades
  const mergedData = students.map((student: any) => {
    const submission = submissions.find(s => 
      s.studentId?._id === student.studentId || 
      s.studentId === student.studentId || 
      (s.groupMembers && s.groupMembers.some((id: any) => (id?._id || id) === student.studentId))
    );
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

  const submittedCount = mergedData.filter((item: any) => item.submission).length;
  const pendingCount = students.length - submittedCount;

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* TOP HEADER */}
      <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-10 sticky top-0 z-10 shrink-0">
        <div>
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-500 mb-1">
            <span className="hover:text-[#F26F21] cursor-pointer">Grading</span>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/lecturer/classes/${classId}/submissions`} className="hover:text-[#F26F21] cursor-pointer">
              {classData?.subjectSnapshot?.code || 'Subject'} ({classData?.classCode || 'Class'})
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1B2559] font-bold">
              <select 
                value={selectedGradeItemId} 
                onChange={e => setSelectedGradeItemId(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer font-bold"
              >
                {gradeItems.map(item => (
                  <option key={item._id} value={item._id}>{item.title}</option>
                ))}
                {gradeItems.length === 0 && <option value="">No Assignments</option>}
              </select>
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#1B2559]">Submissions: {selectedItemName}</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-3">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all flex items-center">
            <Download className="w-4 h-4 mr-2" /> Download All
          </button>
          <button className="bg-[#1B2559] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-[#2A3673] transition-all flex items-center">
            <FileSpreadsheet className="w-4 h-4 mr-2 text-green-400" /> Export Scores
          </button>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <div className="flex-1 p-4 md:p-10 relative">
        <div className="max-w-[1400px] mx-auto">
          
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
                  <tr key={row.student.studentId} className={`hover:bg-gray-50 transition-colors ${row.grade ? 'bg-gray-50/50 opacity-80' : ''}`}>
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
                      {row.submission?.fileUrl ? (
                        <a href={row.submission.fileUrl} target="_blank" rel="noreferrer" className="text-[#4318FF] font-bold hover:underline flex items-center">
                          <FileArchive className="w-4 h-4 mr-1" /> {row.submission.fileName || 'View File'}
                        </a>
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
    </div>
  );
};

export default LecturerGradingListPage;

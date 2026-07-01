import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import GradingTable from '../../components/lecturer/GradingTable';
import AIDrawer from '../../components/lecturer/AIDrawer';
import { useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const MOCK_STUDENTS: any[] = [
  {
    id: '1',
    name: 'Nguyen Van Duc',
    studentId: 'HE150001',
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+Duc&background=F26F21&color=fff',
    status: 'Submitted',
    fileName: 'PE_DucNV.zip',
    aiStatus: 'High Discrepancy',
    declared: 10,
    detected: 95,
    score: '-'
  },
  {
    id: '2',
    name: 'Pham Tuan Viet',
    studentId: 'HE150002',
    avatar: 'https://ui-avatars.com/api/?name=Pham+Tuan+Viet&background=4318FF&color=fff',
    status: 'Submitted',
    fileName: 'Github Repo Link',
    repoLink: 'https://github.com/phamtuanviet/pe1',
    aiStatus: 'Transparent',
    declared: 40,
    detected: 42,
    score: '-'
  },
  {
    id: '3',
    name: 'Pham Chau Vinh',
    studentId: 'HE150003',
    avatar: 'https://ui-avatars.com/api/?name=Pham+Chau+Vinh&background=16A34A&color=fff',
    status: 'Graded',
    fileName: 'PE_VinhPC.zip',
    aiStatus: 'No AI Used',
    declared: 0,
    detected: 0,
    score: '8.5'
  }
];

const LecturerGradingList = () => {
  const { classId } = useParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>(MOCK_STUDENTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Example: Fetch submissions for a specific gradeItem or assignment
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!classId) return;
      setLoading(true);
      try {
        // First fetch assignments for this class
        const assignmentsRes: any = await axiosClient.get(`/classes/${classId}/grade-items`);
        if (assignmentsRes.result && assignmentsRes.result.length > 0) {
          const firstAssignmentId = assignmentsRes.result[0]._id;
          const response: any = await axiosClient.get(`/assignments/${firstAssignmentId}/submissions`);
          if (response.result && response.result.length > 0) {
            // Map backend submissions to our UI structure
            const formattedStudents = response.result.map((sub: any) => ({
              id: sub._id,
              name: sub.student?.fullName || 'Unknown Student',
              studentId: sub.student?.studentCode || 'N/A',
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(sub.student?.fullName || 'U S')}&background=F26F21&color=fff`,
              status: sub.status,
              fileName: sub.fileName,
              aiStatus: 'Transparent', // We'd derive this from sub.aiReport
              declared: 0,
              detected: 0,
              score: sub.finalResult?.score || '-'
            }));
            setStudents(formattedStudents);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch real submissions, falling back to mock data', err);
        // Fallback to mock data is already set in initial state
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [classId]);

  const handleOpenDrawer = (studentId: string) => {
    setSelectedStudentId(studentId);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedStudentId(null), 300);
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1B2559]">Practical Exam 1</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Class SE18D01 • {students.length} Students</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-white border border-gray-200 rounded-xl flex items-center px-4 py-2 shadow-sm w-64">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input type="text" placeholder="Search student..." className="w-full text-sm outline-none text-gray-700 bg-transparent" />
          </div>
          <select className="bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl px-4 py-2.5 outline-none shadow-sm cursor-pointer">
            <option>All Status</option>
            <option>Pending (15)</option>
            <option>Graded (15)</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4318FF]"></div>
        </div>
      ) : (
        <GradingTable students={students} onOpenAiDrawer={handleOpenDrawer} />
      )}
      
      <AIDrawer isOpen={drawerOpen} onClose={handleCloseDrawer} studentId={selectedStudentId} />
    </div>
  );
};

export default LecturerGradingList;

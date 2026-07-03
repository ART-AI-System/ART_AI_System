/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { SubjectCard } from '../../components/common/SubjectCard';
import { Card } from '../../components/common/Card';
import { classService } from '../../services/class.service';
import { Heatmap } from '../../components/common/Heatmap';
import { EmptyState } from '../../components/common/EmptyState';

const StudentDashboardPage = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await classService.getStudentHome();
        const subjects = response?.subjects || [];
        
        const mappedClasses = subjects.map((sub: any) => ({
          id: sub.classId,
          code: sub.subjectCode || 'UNK',
          name: sub.subjectName || 'Unknown Subject',
          classCode: sub.classCode || 'Unknown Class',
          slots: 30, // Fallback as backend doesn't provide slots currently
          image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80', // Fallback
          lecturerName: sub.lecturerName || 'Unknown Lecturer',
          lecturerAvatarColor: { bg: 'EBF4FF', text: '0072BC' }
        }));
        
        setClasses(mappedClasses);
      } catch (err) {
        console.error('Failed to fetch student classes:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClasses();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Section: Semester Selector & Heatmap */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* Left: Semester Info / Quick Stats */}
        <Card className="xl:col-span-1 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-orange-50 rounded-full opacity-50 blur-2xl pointer-events-none"></div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">My Progress</h2>
          
          <p className="text-3xl font-extrabold text-[#1B2559] mb-4">Summer 2026</p>
          
          <div className="flex items-center mt-2">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#4318FF] mr-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1B2559]">4 Subjects</p>
              <p className="text-sm font-medium text-gray-500">Enrolled this term</p>
            </div>
          </div>
        </Card>

        {/* Right: Learning Activity Heatmap */}
        <Card className="xl:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#1B2559]">Learning & AI Activity</h3>
            <div className="flex items-center text-xs text-gray-400 font-medium space-x-2">
              <span>Less</span>
              <div className="w-3 h-3 rounded-sm bg-[#f1f5f9]"></div>
              <div className="w-3 h-3 rounded-sm bg-[#fed7aa]"></div>
              <div className="w-3 h-3 rounded-sm bg-[#fb923c]"></div>
              <div className="w-3 h-3 rounded-sm bg-[#ea580c]"></div>
              <div className="w-3 h-3 rounded-sm bg-[#9a3412]"></div>
              <span>More</span>
            </div>
          </div>
          
          <Heatmap />
        </Card>
      </div>

      {/* Subjects Grid Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-[#1B2559]">Recently Accessed</h2>
          <Link 
            to={ROUTES.CLASSES} 
            className="text-sm font-bold text-[#4318FF] bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            View All Subjects
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40 col-span-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {classes.map((subject) => (
              <SubjectCard key={subject.id} {...subject} />
            ))}

            <EmptyState 
              icon={<Plus className="w-6 h-6" />} 
              title="Enroll New Subject" 
              onClick={() => {}} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboardPage;

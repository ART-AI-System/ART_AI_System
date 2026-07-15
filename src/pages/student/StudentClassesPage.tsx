/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { SubjectCard } from '../../components/common/SubjectCard';
import { classService } from '../../services/class.service';

const ClassesPage = () => {
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B2559]">My Subjects</h1>
          <p className="text-gray-500 font-medium mt-1">All enrolled subjects for the selected semester</p>
        </div>
        
        <div className="flex items-center bg-white rounded-lg p-1 shadow-sm border border-gray-100">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-bold">
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button className="px-4 py-2 text-gray-400 hover:text-gray-700 rounded-md text-sm font-bold">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : classes.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100">
          <h3 className="text-lg font-bold text-gray-700 mb-2">No Classes Found</h3>
          <p className="text-gray-500">You are not enrolled in any classes for this semester.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {classes.map(subject => (
            <SubjectCard key={subject.id} {...subject} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassesPage;

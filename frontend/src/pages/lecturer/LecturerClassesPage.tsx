/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import LecturerSubjectCard from '../../components/common/LecturerSubjectCard';
import { classService } from '../../services/class.service';

const LecturerClassesPage = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await classService.getLecturerHome();
        const rawClasses = response?.classes || [];
        
        const mappedClasses = rawClasses.map((cls: any) => ({
          id: cls.classId,
          code: cls.subjectCode || 'UNK',
          name: cls.subjectName || 'Unknown Subject',
          imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
          classesCount: 1,
          studentsCount: cls.totalStudents || 0,
          classes: [{ id: cls.classId, name: cls.classCode || 'Unknown Class' }]
        }));
        
        setClasses(mappedClasses);
      } catch (err) {
        console.error('Failed to fetch lecturer classes:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClasses();
  }, []);

  return (
    <div className="p-10 max-w-7xl mx-auto">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F26F21]"></div>
        </div>
      ) : classes.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100">
          <h3 className="text-lg font-bold text-gray-700 mb-2">No Classes Found</h3>
          <p className="text-gray-500">You have no assigned classes for this semester.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((subject) => (
            <LecturerSubjectCard key={subject.id} {...subject} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LecturerClassesPage;

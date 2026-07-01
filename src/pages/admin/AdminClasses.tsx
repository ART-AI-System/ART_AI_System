import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, GraduationCap, Users } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const AdminClasses = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [formData, setFormData] = useState({
    classCode: '',
    semesterId: '',
    subjectId: '',
    lecturerId: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [clsRes, semRes, subRes, tchrRes] = await Promise.all([
        axiosClient.get('/classes'),
        axiosClient.get('/semesters'),
        axiosClient.get('/subjects'),
        axiosClient.get('/users?role=LECTURER')
      ]);
      setClasses((clsRes as any).result || []);
      setSemesters((semRes as any).result || []);
      setSubjects((subRes as any).result || []);
      setTeachers((tchrRes as any).result?.users || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the selected subject and teacher to build snapshots
    const selectedSubject = subjects.find(s => s._id === formData.subjectId);
    const selectedTeacher = teachers.find(t => t._id === formData.lecturerId);
    
    if (!selectedSubject || !selectedTeacher) {
      alert('Please select a valid subject and lecturer.');
      return;
    }
    
    const payload = {
      classCode: formData.classCode,
      semesterId: formData.semesterId,
      subjectId: formData.subjectId,
      subjectSnapshot: {
        subjectId: selectedSubject._id,
        code: selectedSubject.code,
        name: selectedSubject.name
      },
      lecturer: {
        lecturerId: selectedTeacher._id,
        fullName: selectedTeacher.fullName,
        email: selectedTeacher.email
      }
    };
    
    try {
      await axiosClient.post('/classes', payload);
      setShowAddModal(false);
      setFormData({
        classCode: '',
        semesterId: '',
        subjectId: '',
        lecturerId: ''
      });
      fetchData();
    } catch (err: any) {
      alert('Failed to add class: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-[#064E3B]">Class Management</h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#16A34A] text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center shadow-md shadow-green-500/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Class
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#16A34A]"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-[#064E3B] mb-2">No Classes Found</h3>
            <p className="text-gray-500 max-w-md">You haven't created any classes yet. Create classes to assign subjects and lecturers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <div key={cls._id} className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-green-50 text-[#16A34A] rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${cls.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {cls.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-[#064E3B]">{cls.classCode}</h3>
                <p className="text-sm font-bold text-gray-700 mt-1">{cls.subjectSnapshot?.code} - {cls.subjectSnapshot?.name}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Lecturer: <span className="font-semibold">{cls.lecturer?.fullName}</span></span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Students: <span className="font-semibold">{cls.students?.length || 0}</span></span>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 flex justify-between items-center">
                  <button className="text-[#16A34A] text-sm font-bold hover:underline">Manage Students</button>
                  <button className="text-gray-500 text-sm font-bold hover:underline">Edit</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-[#064E3B] px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center"><BookOpen className="w-5 h-5 mr-2" /> Create New Class</h3>
            </div>
            
            <form onSubmit={handleAddClass} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#064E3B] mb-1">Class Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. SE18D01"
                  value={formData.classCode}
                  onChange={e => setFormData({...formData, classCode: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20 transition-all uppercase" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#064E3B] mb-1">Semester</label>
                  <select 
                    required
                    value={formData.semesterId}
                    onChange={e => setFormData({...formData, semesterId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20 transition-all bg-white appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select Semester</option>
                    {semesters.map(sem => (
                      <option key={sem._id} value={sem._id}>{sem.code} - {sem.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-[#064E3B] mb-1">Subject</label>
                  <select 
                    required
                    value={formData.subjectId}
                    onChange={e => setFormData({...formData, subjectId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20 transition-all bg-white appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select Subject</option>
                    {subjects.map(sub => (
                      <option key={sub._id} value={sub._id}>{sub.code}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#064E3B] mb-1">Assign Lecturer</label>
                <select 
                  required
                  value={formData.lecturerId}
                  onChange={e => setFormData({...formData, lecturerId: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20 transition-all bg-white appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Lecturer</option>
                  {teachers.map(teacher => (
                    <option key={teacher._id} value={teacher._id}>{teacher.fullName} ({teacher.email})</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#16A34A] text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-md shadow-green-500/20"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClasses;

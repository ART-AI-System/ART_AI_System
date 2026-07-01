import React, { useState, useEffect } from 'react';
import { Plus, Users, Briefcase, Mail, Key } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'LECTURER'
  });

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res: any = await axiosClient.get('/users?role=LECTURER');
      setTeachers(res.result?.users || []);
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosClient.post('/users', formData);
      setShowAddModal(false);
      setFormData({
        fullName: '',
        email: '',
        password: '',
        role: 'LECTURER'
      });
      fetchTeachers();
    } catch (err: any) {
      alert('Failed to add lecturer: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-[#064E3B]">Lecturers Management</h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#16A34A] text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center shadow-md shadow-green-500/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lecturer
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#16A34A]"></div>
          </div>
        ) : teachers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-[#064E3B] mb-2">No Lecturers Found</h3>
            <p className="text-gray-500 max-w-md">You haven't added any lecturers yet. Add lecturers to assign them to classes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <div key={teacher._id} className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-5 flex flex-col hover:shadow-md transition-all">
                <div className="flex items-start mb-4">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.fullName)}&background=16A34A&color=fff`} 
                    alt={teacher.fullName} 
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-extrabold text-[#064E3B]">{teacher.fullName}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{teacher.role}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{teacher.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Lecturer ID: {teacher._id.substring(teacher._id.length - 6).toUpperCase()}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${teacher.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {teacher.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button className="text-[#16A34A] text-sm font-bold hover:underline">Edit</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-[#064E3B] px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center"><Users className="w-5 h-5 mr-2" /> Add New Lecturer</h3>
            </div>
            
            <form onSubmit={handleAddTeacher} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#064E3B] mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Alan Smith"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20 transition-all" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#064E3B] mb-1">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. alan@fpt.edu.vn"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-xl outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20 transition-all" 
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#064E3B] mb-1">Initial Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    required
                    placeholder="Set an initial password"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-xl outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20 transition-all" 
                  />
                  <Key className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
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
                  Save Lecturer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeachers;

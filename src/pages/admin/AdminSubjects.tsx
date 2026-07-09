/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Plus, Library, BookOpen } from 'lucide-react';
import { subjectService } from '../../services/subject.service';
import type { Subject } from '../../types/subject';

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    defaultSlots: 10
  });

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const result = await subjectService.getSubjects();
      setSubjects(result || []);
    } catch (err: any) {
      console.error('Failed to fetch subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSubjects();
  }, []);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await subjectService.createSubject(formData);
      setShowAddModal(false);
      setFormData({
        code: '',
        name: '',
        description: '',
        defaultSlots: 10
      });
      fetchSubjects();
    } catch (err: any) {
      alert('Failed to add subject: ' + (err.response?.data?.message || err.message));
    }
  };

  const openEditModal = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      code: subject.code,
      name: subject.name,
      description: subject.description || '',
      defaultSlots: subject.defaultSlots || 10
    });
    setShowEditModal(true);
  };

  const handleEditSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject?._id) return;
    try {
      await subjectService.updateSubject(editingSubject._id, formData);
      setShowEditModal(false);
      setEditingSubject(null);
      setFormData({
        code: '',
        name: '',
        description: '',
        defaultSlots: 10
      });
      fetchSubjects();
    } catch (err: any) {
      alert('Failed to update subject: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-[#064E3B]">Subject Management</h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#16A34A] text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center shadow-md shadow-green-500/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Subject
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#16A34A]"></div>
          </div>
        ) : subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-[#064E3B] mb-2">No Subjects Found</h3>
            <p className="text-gray-500 max-w-md">You haven't created any subjects yet. Add subjects to start assigning them to classes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((sub) => (
              <div key={sub._id} className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-50 text-[#16A34A] rounded-xl flex items-center justify-center mb-4">
                  <Library className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-[#064E3B]">{sub.code}</h3>
                <p className="text-sm font-bold text-gray-700 mt-1">{sub.name}</p>
                {sub.description && (
                  <p className="text-xs text-gray-500 mt-3 line-clamp-2">{sub.description}</p>
                )}
                <div className="mt-auto pt-4 flex justify-between items-center">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${sub.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {sub.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button 
                    onClick={() => openEditModal(sub)}
                    className="text-xs font-bold text-gray-500 hover:text-[#4318FF] flex items-center p-2"
                  >
                    Edit
                  </button>
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
              <h3 className="font-bold text-lg flex items-center"><Library className="w-5 h-5 mr-2" /> Add New Subject</h3>
            </div>
            
            <form onSubmit={handleAddSubject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#064E3B] mb-1">Subject Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. PRJ301"
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20 transition-all uppercase" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#064E3B] mb-1">Subject Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Java Web Development"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20 transition-all" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#064E3B] mb-1">Description</label>
                <textarea 
                  rows={3}
                  placeholder="Optional description"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20 transition-all" 
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#064E3B] mb-1">Default Slots</label>
                <input 
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={formData.defaultSlots}
                  onChange={e => setFormData({...formData, defaultSlots: parseInt(e.target.value) || 10})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20 transition-all" 
                />
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
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-[#4318FF] px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center"><Library className="w-5 h-5 mr-2" /> Edit Subject</h3>
            </div>
            
            <form onSubmit={handleEditSubject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#1B2559] mb-1">Subject Code</label>
                <input 
                  type="text" 
                  required
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#4318FF] focus:ring-2 focus:ring-blue-500/20 transition-all uppercase" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#1B2559] mb-1">Subject Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#4318FF] focus:ring-2 focus:ring-blue-500/20 transition-all" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1B2559] mb-1">Description</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#4318FF] focus:ring-2 focus:ring-blue-500/20 transition-all" 
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1B2559] mb-1">Default Slots</label>
                <input 
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={formData.defaultSlots}
                  onChange={e => setFormData({...formData, defaultSlots: parseInt(e.target.value) || 10})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#4318FF] focus:ring-2 focus:ring-blue-500/20 transition-all" 
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#4318FF] text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
                >
                  Update Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubjects;

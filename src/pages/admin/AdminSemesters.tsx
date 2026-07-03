import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Calendar, CalendarOff } from 'lucide-react';
import { semesterService } from '../../services/semester.service';
import type { Semester } from '../../services/semester.service';

const AdminSemesters = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    academicYear: new Date().getFullYear().toString(),
    startDate: '',
    endDate: '',
    isCurrent: false
  });

  const fetchSemesters = async () => {
    try {
      const result = await semesterService.getSemesters();
      setSemesters(result || []);
    } catch (err) {
      console.error('Failed to fetch semesters:', err);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchSemesters();
      setLoading(false);
    };
    load();
  }, []);

  const handleAddSemester = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await semesterService.createSemester(formData);
      setShowAddModal(false);
      setFormData({
        code: '',
        name: '',
        academicYear: new Date().getFullYear().toString(),
        startDate: '',
        endDate: '',
        isCurrent: false
      });
      fetchSemesters();
    } catch (err) {
      const error = err as Error & { response?: { data?: { message?: string } } };
      alert('Failed to add semester: ' + (error.response?.data?.message || error.message));
    }
  };

  const setAsCurrent = async (id: string) => {
    try {
      await semesterService.setAsCurrent(id);
      fetchSemesters();
    } catch {
      alert('Failed to set current semester');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-[#064E3B]">Semester Management</h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#16A34A] text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center shadow-md shadow-green-500/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Semester
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#16A34A]"></div>
          </div>
        ) : semesters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <CalendarOff className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-[#064E3B] mb-2">No Semesters Found</h3>
            <p className="text-gray-500 max-w-md">You haven't created any semesters yet. Add a semester to start organizing academic periods.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {semesters.map((sem) => (
              <li key={sem._id}>
                <div className={`flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-xl transition-all ${sem.isCurrent ? 'border-green-200 bg-green-50' : 'border-gray-100 hover:border-green-200 hover:shadow-sm'}`}>
                  <div>
                    <div className="flex items-center">
                      <span className={`font-bold ${sem.isCurrent ? 'text-[#064E3B]' : 'text-gray-700'}`}>
                        {sem.name} ({sem.code})
                      </span>
                      {sem.isCurrent && (
                        <span className="ml-3 bg-[#16A34A] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" /> Current
                        </span>
                      )}
                      {!sem.isActive && (
                        <span className="ml-3 bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 flex items-center space-x-4">
                      <span><span className="font-medium">Year:</span> {sem.academicYear}</span>
                      <span>
                        <span className="font-medium">Period:</span> {new Date(sem.startDate).toLocaleDateString()} - {new Date(sem.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {!sem.isCurrent && sem.isActive && (
                    <button 
                      onClick={() => setAsCurrent(sem._id)}
                      className="mt-4 md:mt-0 px-4 py-2 border border-[#16A34A] text-[#16A34A] text-sm font-bold rounded-lg hover:bg-green-50 transition-colors"
                    >
                      Set as Current
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-[#064E3B] px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center"><Calendar className="w-5 h-5 mr-2" /> Add New Semester</h3>
            </div>
            
            <form onSubmit={handleAddSemester} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#064E3B] mb-1">Code</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. SP26"
                      value={formData.code}
                      onChange={e => setFormData({...formData, code: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#064E3B] mb-1">Year</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 2026"
                      value={formData.academicYear}
                      onChange={e => setFormData({...formData, academicYear: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20 transition-all" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-[#064E3B] mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Spring 2026"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20 transition-all" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#064E3B] mb-1">Start Date</label>
                    <input 
                      type="date" 
                      required
                      value={formData.startDate}
                      onChange={e => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20 transition-all text-sm text-gray-700" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#064E3B] mb-1">End Date</label>
                    <input 
                      type="date" 
                      required
                      value={formData.endDate}
                      onChange={e => setFormData({...formData, endDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20 transition-all text-sm text-gray-700" 
                    />
                  </div>
                </div>

                <div className="flex items-center pt-2">
                  <input 
                    type="checkbox" 
                    id="isCurrent"
                    checked={formData.isCurrent}
                    onChange={e => setFormData({...formData, isCurrent: e.target.checked})}
                    className="w-4 h-4 text-[#16A34A] rounded border-gray-300 focus:ring-[#16A34A]" 
                  />
                  <label htmlFor="isCurrent" className="ml-2 text-sm font-bold text-gray-700 cursor-pointer">
                    Set as Current Semester
                  </label>
                </div>
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
                  Save Semester
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSemesters;

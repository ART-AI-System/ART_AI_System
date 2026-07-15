import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { classService } from '../../services/class.service';
import type { Class } from '../../types/class';

interface PromoteCohortModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceClass: Class;
  semesters: any[];
  subjects: any[];
  lecturers: any[];
  onSuccess: () => void;
}

export const PromoteCohortModal: React.FC<PromoteCohortModalProps> = ({
  isOpen,
  onClose,
  sourceClass,
  semesters,
  subjects,
  lecturers,
  onSuccess
}) => {
  const [targetSemesterId, setTargetSemesterId] = useState('');
  const [assignments, setAssignments] = useState([{ id: '1', subjectId: '', lecturerId: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddAssignment = () => {
    setAssignments([...assignments, { id: Math.random().toString(), subjectId: '', lecturerId: '' }]);
  };

  const handleRemoveAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const handleChangeAssignment = (id: string, field: 'subjectId' | 'lecturerId', value: string) => {
    setAssignments(assignments.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSemesterId) {
      alert('Please select a target semester');
      return;
    }
    
    // Filter out incomplete assignments
    const validAssignments = assignments.filter(a => a.subjectId && a.lecturerId);
    if (validAssignments.length === 0) {
      alert('Please add at least one valid subject assignment');
      return;
    }

    const subjectIds = validAssignments.map(a => a.subjectId);
    if (new Set(subjectIds).size !== subjectIds.length) {
      alert('You have selected the same subject multiple times. Please ensure each subject is unique.');
      return;
    }

    setIsSubmitting(true);
    try {
      await classService.promoteCohort(sourceClass._id, targetSemesterId, validAssignments);
      onSuccess();
      onClose();
    } catch (err: any) {
      alert('Failed to promote cohort: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#064E3B] text-white">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="text-green-400">Promote Cohort:</span> {sourceClass.classCode}
            </h3>
            <p className="text-sm text-green-100 mt-1">
              Clone this cohort of {sourceClass.students?.length || 0} students to a new semester with multiple subjects.
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <label className="block text-sm font-bold text-[#064E3B] mb-2">Target Semester</label>
            <select
              value={targetSemesterId}
              onChange={e => setTargetSemesterId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20 bg-gray-50"
              required
            >
              <option value="" disabled>Select Target Semester</option>
              {semesters.map(s => (
                <option key={s._id} value={s._id}>{s.code} - {s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-bold text-[#064E3B]">Subject Assignments</label>
              <button
                type="button"
                onClick={handleAddAssignment}
                className="flex items-center gap-1 text-sm font-bold text-[#16A34A] hover:text-green-700 bg-green-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus size={16} /> Add Subject
              </button>
            </div>
            
            <div className="space-y-4">
              {assignments.map((assignment, index) => (
                <div key={assignment.id} className="flex gap-4 items-start p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Subject {index + 1}</label>
                    <select
                      value={assignment.subjectId}
                      onChange={e => handleChangeAssignment(assignment.id, 'subjectId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20 text-sm"
                      required
                    >
                      <option value="" disabled>Select Subject</option>
                      {subjects.map(s => (
                        <option key={s._id} value={s._id}>{s.code} - {s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Lecturer</label>
                    <select
                      value={assignment.lecturerId}
                      onChange={e => handleChangeAssignment(assignment.id, 'lecturerId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20 text-sm"
                      required
                    >
                      <option value="" disabled>Select Lecturer</option>
                      {lecturers.map(l => (
                        <option key={l._id} value={l._id}>{l.fullName}</option>
                      ))}
                    </select>
                  </div>
                  {assignments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAssignment(assignment.id)}
                      className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#16A34A] text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors shadow-lg shadow-green-500/30"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Promoting...
              </>
            ) : 'Promote Cohort'}
          </button>
        </div>
      </div>
    </div>
  );
};

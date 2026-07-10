import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, ChevronRight, Info, Users, Calendar, Settings2, CheckCircle, BrainCircuit, AlertCircle
} from 'lucide-react';
import { ROUTES } from '../../config/routes';
import { assignmentService } from '../../services/assignment.service';
import type { AssignmentPayload } from '../../services/assignment.service';

const LecturerCreateAssignmentPage = () => {
  const { id: subjectId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<AssignmentPayload>({
    title: '',
    description: '',
    instructions: '',
    deadline: '',
    maxScore: 10,
    weight: 20,
    aiDeclarationRequired: true,
    minAiInteractions: 5,
    maxAiInteractions: 10,
    allowResubmission: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate deadline is in the future
    if (new Date(formData.deadline).getTime() <= new Date().getTime()) {
      setError('Deadline must be in the future.');
      return;
    }

    setLoading(true);
    try {
      const res = await assignmentService.createGlobalAssignment(subjectId!, formData) as { assignment?: { _id?: string }, id?: string };
      alert('Assignment created successfully!');
      navigate(`/assignments/${res.assignment?._id || res.id || ''}`);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }, message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-10 flex flex-col h-full bg-[#F4F7FE] animate-fade-in">
      {/* TOP HEADER */}
      <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-10 sticky top-0 z-30 shrink-0">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 hover:bg-[#F26F21] hover:border-[#F26F21] text-gray-500 hover:text-white flex items-center justify-center transition-all mr-5 shadow-sm shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center text-sm font-bold text-gray-400 mb-1 gap-1">
              <Link to={ROUTES.CLASSES} className="hover:text-[#4318FF] transition-colors">My Subjects</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#F26F21]">Create Global Assignment</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#1B2559]">Create New Assignment</h1>
          </div>
        </div>
      </header>

      {/* FORM CONTENT */}
      <div className="flex-1 p-4 md:p-10">
        <div className="max-w-4xl mx-auto">
          
          <form className="space-y-8" onSubmit={handleSubmit}>
            
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start text-red-700">
                <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            {/* Basic Info */}
            <div className="bg-white rounded-[24px] p-6 md:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-extrabold text-[#1B2559] mb-6 flex items-center">
                <Info className="w-5 h-5 mr-2 text-[#F26F21]" /> Basic Information
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Assignment Title <span className="text-red-500">*</span></label>
                  <input required name="title" value={formData.title} onChange={handleChange} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] transition-all" placeholder="e.g. Practical Exam 1" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] transition-all" placeholder="Brief description..."></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Instructions</label>
                  <textarea name="instructions" value={formData.instructions} onChange={handleChange} rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] transition-all" placeholder="Provide detailed instructions for the students..."></textarea>
                </div>
              </div>
            </div>

            {/* Timeline & Settings */}
            <div className="bg-white rounded-[24px] p-6 md:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-extrabold text-[#1B2559] mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-500" /> Timeline & Scoring
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Deadline <span className="text-red-500">*</span></label>
                  <input required name="deadline" value={formData.deadline} onChange={handleChange} type="datetime-local" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] transition-all" />
                </div>
                
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Max Score <span className="text-red-500">*</span></label>
                    <input required name="maxScore" value={formData.maxScore} onChange={handleChange} type="number" min="1" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] transition-all" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Weight (%) <span className="text-red-500">*</span></label>
                    <input required name="weight" value={formData.weight} onChange={handleChange} type="number" min="0" max="100" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] transition-all" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center">
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" name="allowResubmission" checked={formData.allowResubmission} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16A34A]"></div>
                </label>
                <span className="ml-3 text-sm font-bold text-gray-700">Allow Resubmission before Deadline</span>
              </div>
            </div>

            {/* ART-AI Configurations */}
            <div className="bg-gradient-to-br from-[#1B2559] to-[#2B3A7A] rounded-[24px] p-6 md:p-8 shadow-lg shadow-blue-900/20 relative overflow-hidden">
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                <BrainCircuit className="w-48 h-48 text-white" />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-lg font-extrabold text-white mb-6 flex items-center">
                  <Settings2 className="w-5 h-5 mr-2 text-[#F26F21]" /> ART-AI Assessment Settings
                </h2>
                
                <div className="space-y-6">
                  {/* AI Usage Toggle */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-white">Require AI Declaration</h4>
                      <p className="text-xs text-blue-200 mt-1">If enabled, students must declare their AI usage in the transparency form.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" name="aiDeclarationRequired" checked={formData.aiDeclarationRequired} onChange={handleChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F26F21]"></div>
                    </label>
                  </div>


                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 pb-10">
              <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 rounded-xl font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-all text-center">
                Cancel
              </button>
              <button disabled={loading} type="submit" className="px-8 py-3 rounded-xl font-bold text-white bg-[#F26F21] hover:bg-[#D95D1A] shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center disabled:opacity-50">
                {loading ? 'Creating...' : <><CheckCircle className="w-5 h-5 mr-2" /> Create Assignment</>}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default LecturerCreateAssignmentPage;

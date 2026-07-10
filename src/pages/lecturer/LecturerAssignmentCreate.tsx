import React, { useEffect, useState } from 'react';
import { ArrowLeft, Info, Users, Calendar, Settings2, CheckCircle, BrainCircuit } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const LecturerAssignmentCreate = () => {
  const navigate = useNavigate();
  const { assignmentId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const isEditMode = !!assignmentId;

  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [weight, setWeight] = useState(10);
  const [maxScore, setMaxScore] = useState(10);
  const [aiInteractionRequired, setAiInteractionRequired] = useState(true);
  const [minAiInteractions, setMinAiInteractions] = useState(5);
  const [maxAiInteractions, setMaxAiInteractions] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await axiosClient.get('/lecturer/home');
        if (response.result && response.result.classes) {
          setClasses(response.result.classes);
        }

        if (isEditMode) {
          const assignmentRes: any = await axiosClient.get(`/grade-items/standalone/${assignmentId}`);
          const item = assignmentRes.result;
          if (item) {
            setTitle(item.title || '');
            setDescription(item.description || '');
            if (item.deadline) {
              const date = new Date(item.deadline);
              const formatted = date.toISOString().slice(0, 16);
              setDeadline(formatted);
            }
            setWeight(item.weight || 10);
            setMaxScore(item.maxScore || 10);
            setAiInteractionRequired(item.aiInteractionRequired !== false);
            setMinAiInteractions(item.minAiInteractions || 5);
            setMaxAiInteractions(item.maxAiInteractions || 10);
            if (item.classId) {
              setSelectedClasses([item.classId]);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [assignmentId, isEditMode]);

  const handleClassToggle = (classId: string) => {
    setSelectedClasses(prev => 
      prev.includes(classId) ? prev.filter(id => id !== classId) : [...prev, classId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClasses.length === classes.length) {
      setSelectedClasses([]);
    } else {
      setSelectedClasses(classes.map(c => c.classId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !deadline || selectedClasses.length === 0) {
      setError('Please fill all required fields and select at least one class.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload: any = {
        title,
        description,
        weight,
        maxScore,
        deadline: new Date(deadline).toISOString(),
        aiInteractionRequired,
        minAiInteractions,
        maxAiInteractions
      };
      
      if (sessionId) {
        payload.sessionId = sessionId;
      }

      if (isEditMode) {
        // Edit mode: only update this specific assignment
        await axiosClient.put(`/grade-items/standalone/${assignmentId}`, payload);
      } else {
        // Create mode: For each selected class, create a grade item (assignment)
        const promises = selectedClasses.map(classId => 
          axiosClient.post(`/classes/${classId}/grade-items`, payload)
        );
        await Promise.all(promises);
      }
      
      navigate(-1);
    } catch (err: any) {
      console.error('Failed to save assignment:', err);
      setError(err.response?.data?.message || 'An error occurred while saving the assignment.');
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-10 shrink-0">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 hover:bg-[#F26F21] hover:border-[#F26F21] text-gray-500 hover:text-white flex items-center justify-center transition-all mr-5 shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-extrabold text-[#1B2559]">Create New Assignment</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-10 scroll-smooth">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Info */}
            <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-extrabold text-[#1B2559] mb-6 flex items-center">
                <Info className="w-5 h-5 mr-2 text-[#F26F21]" /> Basic Information
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Assignment Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] transition-all" 
                    placeholder="e.g. Practical Exam 1" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description / Instructions</label>
                  <textarea 
                    rows={4} 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] transition-all" 
                    placeholder="Provide detailed instructions for the students..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Weight (%)</label>
                    <input 
                      type="number" 
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Max Score</label>
                    <input 
                      type="number" 
                      value={maxScore}
                      onChange={(e) => setMaxScore(Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] transition-all" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Target Classes */}
            <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-extrabold text-[#1B2559] flex items-center">
                  <Users className="w-5 h-5 mr-2 text-[#4318FF]" /> Target Classes <span className="text-red-500 ml-1">*</span>
                </h2>
                <button type="button" onClick={handleSelectAll} className="text-sm font-bold text-[#4318FF] hover:underline">
                  {selectedClasses.length === classes.length && classes.length > 0 ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">Choose which classes will receive this assignment slot. Each class will get an identical copy.</p>
              
              {loading ? (
                <div className="text-sm text-gray-500">Loading classes...</div>
              ) : classes.length === 0 ? (
                <div className="text-sm text-gray-500">No classes found.</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {classes.map((cls) => (
                    <label key={cls.classId} className="flex items-start p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={selectedClasses.includes(cls.classId)}
                        onChange={() => handleClassToggle(cls.classId)}
                        className="mt-1 w-4 h-4 text-[#4318FF] border-gray-300 rounded focus:ring-[#4318FF]" 
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-bold text-[#1B2559]">{cls.subjectCode} - {cls.classCode}</span>
                        <span className="block text-xs font-medium text-gray-400 mt-0.5">{cls.totalStudents || 0} Students</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-extrabold text-[#1B2559] mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-500" /> Timeline & Schedule
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Due Date <span className="text-red-500">*</span></label>
                  <input 
                    type="datetime-local" 
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] transition-all" 
                  />
                </div>
              </div>
            </div>

            {/* AI Config */}
            <div className="bg-gradient-to-br from-[#1B2559] to-[#2B3A7A] rounded-[24px] p-8 shadow-lg shadow-blue-900/20 relative overflow-hidden">
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                <BrainCircuit className="w-48 h-48 text-white" />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-lg font-extrabold text-white mb-6 flex items-center">
                  <Settings2 className="w-5 h-5 mr-2 text-[#F26F21]" /> ART-AI Assessment Settings
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                    <div>
                      <h4 className="text-sm font-bold text-white">Require AI Declaration</h4>
                      <p className="text-xs text-blue-200 mt-1">If enabled, students must declare their AI usage.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={aiInteractionRequired}
                        onChange={(e) => setAiInteractionRequired(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F26F21]"></div>
                    </label>
                  </div>


                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 pb-10">
              <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 rounded-xl font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={submitting}
                className="px-8 py-3 rounded-xl font-bold text-white bg-[#F26F21] hover:bg-[#D95D1A] shadow-lg shadow-orange-500/30 transition-all flex items-center disabled:opacity-50"
              >
                {submitting ? 'Creating...' : <><CheckCircle className="w-5 h-5 mr-2" /> Create Assignment</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LecturerAssignmentCreate;

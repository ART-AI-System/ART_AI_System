import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, Info, Users, Calendar, Settings2, CheckCircle, BrainCircuit,
  Upload, Trash2, Download, FileText
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const LecturerAssignmentCreate = () => {
  const navigate = useNavigate();
  const { assignmentId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const classId = searchParams.get('classId');
  const isEditMode = !!assignmentId;

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
  const [isGroupAssignment, setIsGroupAssignment] = useState(false);
  
  // Materials state
  const [materials, setMaterials] = useState<any[]>([]);
  const [uploadingMaterial, setUploadingMaterial] = useState(false);
  const [materialError, setMaterialError] = useState('');

  const fetchMaterials = async (id: string) => {
    try {
      const res: any = await axiosClient.get(`/grade-items/standalone/${id}/materials`);
      setMaterials(res.result || []);
    } catch (err) {
      console.error('Failed to load materials', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
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
            setIsGroupAssignment(item.isGroupAssignment || false);
            
            await fetchMaterials(assignmentId);
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

  const handleUploadMaterial = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    // Quick validation
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExts = ['pdf', 'docx', 'pptx', 'zip'];
    if (!ext || !validExts.includes(ext)) {
      setMaterialError('Invalid file type. Allowed: PDF, DOCX, PPTX, ZIP');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setMaterialError('File size exceeds 10MB limit.');
      return;
    }

    setMaterialError('');
    setUploadingMaterial(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axiosClient.post(`/grade-items/standalone/${assignmentId}/materials`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchMaterials(assignmentId!);
    } catch (err: any) {
      console.error('Upload failed', err);
      setMaterialError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploadingMaterial(false);
      // clear input
      e.target.value = '';
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    try {
      await axiosClient.delete(`/grade-items/materials/${materialId}`);
      setMaterials(prev => prev.filter(m => m._id !== materialId));
    } catch (err: any) {
      console.error('Delete failed', err);
      setMaterialError('Delete failed');
    }
  };

  const handleDownloadMaterial = async (materialId: string, filename: string) => {
    try {
      const response = await axiosClient.get(`/grade-items/materials/${materialId}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data as any]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error('Download failed', err);
      alert('Failed to download material');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required.');
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
        maxAiInteractions,
        isGroupAssignment
      };
      
      if (sessionId) {
        payload.sessionId = sessionId;
      }

      if (isEditMode) {
        // Edit mode: only update this specific assignment
        await axiosClient.put(`/grade-items/standalone/${assignmentId}`, payload);
      } else {
        // Create mode: Create assignment for the specific class
        if (!classId) {
          throw new Error('No class specified for this assignment.');
        }
        await axiosClient.post(`/classes/${classId}/grade-items`, payload);
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
            <h1 className="text-2xl font-extrabold text-[#1B2559]">{isEditMode ? 'Edit Assignment' : 'Create New Assignment'}</h1>
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

              <div className="mt-6 flex items-center">
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input 
                    type="checkbox" 
                    checked={isGroupAssignment} 
                    onChange={(e) => setIsGroupAssignment(e.target.checked)} 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F26F21]"></div>
                </label>
                <span className="ml-3 text-sm font-bold text-gray-700">Project (Group Assignment)</span>
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

            {/* Materials */}
            {isEditMode && (
              <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-extrabold text-[#1B2559] mb-6 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-[#4318FF]" /> Reference Materials
                </h2>
                
                {materialError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
                    {materialError}
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  {materials.length === 0 ? (
                    <div className="text-sm text-gray-400 italic py-2">No materials uploaded yet.</div>
                  ) : (
                    materials.map(m => (
                      <div key={m._id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-[#4318FF] mr-3" />
                          <span className="text-sm font-bold text-[#1B2559]">{m.originalFilename}</span>
                          <span className="text-xs text-gray-400 ml-3">
                            {(m.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            type="button"
                            onClick={() => handleDownloadMaterial(m._id, m.originalFilename)}
                            className="p-2 text-gray-400 hover:text-[#4318FF] transition-colors rounded-lg hover:bg-white"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDeleteMaterial(m._id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-white"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-[#4318FF] transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className={`w-8 h-8 mb-3 ${uploadingMaterial ? 'text-gray-400 animate-bounce' : 'text-gray-400'}`} />
                      <p className="mb-2 text-sm text-gray-500">
                        {uploadingMaterial ? (
                          <span className="font-semibold">Uploading...</span>
                        ) : (
                          <><span className="font-semibold">Click to upload</span> or drag and drop</>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOCX, PPTX or ZIP (MAX. 10MB)</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleUploadMaterial}
                      disabled={uploadingMaterial}
                      accept=".pdf,.docx,.pptx,.zip"
                    />
                  </label>
                </div>
              </div>
            )}


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

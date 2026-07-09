import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, Clock, AlertCircle, Download, Trash2, CheckCircle, UploadCloud, File, FileArchive, CheckSquare } from 'lucide-react';
import { assignmentService } from '../../services/assignment.service';
import { UploadMaterialModal } from '../../components/assignments/UploadMaterialModal';

export const AssignmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Determine role (in a real app, from auth context)
  // For demonstration, let's parse from localStorage or default to LECTURER if not found
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role || 'LECTURER'; 

  const fetchAssignmentData = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all([
        assignmentService.getAssignmentDetail(id!),
        assignmentService.getAssignmentMaterials(id!)
      ]);
      const assignmentRes = results[0] as { assignment?: any } | any;
      const materialsRes = results[1] as { materials?: any[] } | any;

      setAssignment(assignmentRes.assignment || assignmentRes);
      setMaterials(materialsRes.materials || []);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }, message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to load assignment details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAssignmentData();
    }
  }, [id]);

  const fetchMaterials = async () => {
    try {
      const materialsRes = await assignmentService.getAssignmentMaterials(id!) as { materials?: any[] };
      setMaterials(materialsRes.materials || []);
    } catch (err) {
      console.error('Failed to fetch materials:', err);
    }
  };

  const handlePublish = async () => {
    if (!window.confirm('Are you sure you want to publish this assignment? Students will be notified.')) return;
    setActionLoading(true);
    try {
      await assignmentService.publishAssignment(id!);
      setSuccessMsg('Assignment published successfully!');
      fetchAssignmentData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }, message?: string };
      alert(error.response?.data?.message || error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = async () => {
    if (!window.confirm('Are you sure you want to close this assignment? No more submissions will be accepted.')) return;
    setActionLoading(true);
    try {
      await assignmentService.closeAssignment(id!);
      setSuccessMsg('Assignment closed successfully!');
      fetchAssignmentData();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }, message?: string };
      alert(error.response?.data?.message || error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('WARNING: Are you sure you want to delete this assignment and all its data? This cannot be undone.')) return;
    setActionLoading(true);
    try {
      await assignmentService.deleteAssignment(id!);
      navigate(-1);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }, message?: string };
      alert(error.response?.data?.message || error.message);
      setActionLoading(false);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!window.confirm('Delete this material?')) return;
    try {
      await assignmentService.deleteMaterial(materialId);
      setSuccessMsg('Material deleted.');
      fetchMaterials();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }, message?: string };
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleDownload = async (materialId: string, filename: string) => {
    try {
      const response = await assignmentService.downloadMaterial(materialId) as unknown as Blob;
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert('Failed to download material');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4318FF]"></div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-start text-red-700">
          <AlertCircle className="w-6 h-6 mr-3 shrink-0" />
          <div>
            <h3 className="font-bold text-lg mb-1">Error Loading Assignment</h3>
            <p>{error || 'Assignment not found'}</p>
            <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-white text-red-600 rounded-lg shadow-sm border border-red-200 font-bold hover:bg-red-50">Go Back</button>
          </div>
        </div>
      </div>
    );
  }

  const isLecturer = role === 'LECTURER' || role === 'SUBJECT_HEAD' || role === 'ADMIN';

  return (
    <div className="pb-10 flex flex-col h-full bg-[#F4F7FE] animate-fade-in">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-500 flex items-center justify-center transition-colors mr-4">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-[#1B2559]">{assignment.title}</h1>
            <div className="flex items-center text-sm text-gray-500 mt-1 gap-4">
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> Due: {new Date(assignment.deadline).toLocaleString()}</span>
              <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> Weight: {assignment.weight}%</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${assignment.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : assignment.status === 'CLOSED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                {assignment.status || 'DRAFT'}
              </span>
            </div>
          </div>
        </div>

        {/* Lecturer Actions */}
        {isLecturer && (
          <div className="flex space-x-3">
            {assignment.status === 'DRAFT' && (
              <button 
                onClick={handlePublish} disabled={actionLoading}
                className="px-4 py-2 bg-[#16A34A] text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
              >
                Publish
              </button>
            )}
            {assignment.status === 'PUBLISHED' && (
              <button 
                onClick={handleClose} disabled={actionLoading}
                className="px-4 py-2 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-sm disabled:opacity-50"
              >
                Close Assignment
              </button>
            )}
            <button 
              onClick={handleDelete} disabled={actionLoading}
              className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-50 transition-colors shadow-sm disabled:opacity-50 flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </button>
          </div>
        )}
      </header>

      {successMsg && (
        <div className="mx-6 mt-4 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-center shadow-sm">
          <CheckCircle className="w-5 h-5 mr-3 shrink-0" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-extrabold text-[#1B2559] mb-4">Description</h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {assignment.description || 'No description provided.'}
            </div>
            
            {assignment.instructions && (
              <>
                <h3 className="text-md font-bold text-[#1B2559] mt-6 mb-2">Instructions</h3>
                <div className="p-4 bg-indigo-50 text-indigo-900 rounded-xl text-sm whitespace-pre-wrap border border-indigo-100">
                  {assignment.instructions}
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-extrabold text-[#1B2559] flex items-center">
                <FileArchive className="w-5 h-5 mr-2 text-[#4318FF]" /> Reference Materials
              </h2>
              {isLecturer && (
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="px-3 py-1.5 bg-[#4318FF] text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <UploadCloud className="w-4 h-4 mr-1.5" /> Upload File
                </button>
              )}
            </div>

            {materials.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <File className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No materials have been uploaded yet.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {materials.map(mat => (
                  <li key={mat._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#4318FF] transition-colors group">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-500 mr-4 shadow-sm border border-gray-100">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1B2559] text-sm group-hover:text-[#4318FF] transition-colors">{mat.title || mat.fileName}</h4>
                        <p className="text-xs text-gray-500">{mat.description || `${(mat.fileSize / 1024 / 1024).toFixed(2)} MB`}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleDownload(mat._id, mat.fileName)}
                        className="p-2 text-gray-400 hover:text-[#4318FF] hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      {isLecturer && (
                        <button 
                          onClick={() => handleDeleteMaterial(mat._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column: Rules & Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-extrabold text-[#1B2559] mb-4">Settings</h2>
            
            <ul className="space-y-4">
              <li className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Max Score</span>
                <span className="font-bold text-[#1B2559]">{assignment.maxScore}</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Weight in Final Grade</span>
                <span className="font-bold text-[#1B2559]">{assignment.weight}%</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Resubmission</span>
                <span className={`font-bold ${assignment.allowResubmission ? 'text-green-600' : 'text-red-500'}`}>
                  {assignment.allowResubmission ? 'Allowed' : 'Not Allowed'}
                </span>
              </li>
            </ul>

            {assignment.aiDeclarationRequired && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold text-[#1B2559] mb-3 flex items-center">
                  <CheckSquare className="w-4 h-4 mr-2 text-[#4318FF]" /> AI Declaration Rules
                </h3>
                <div className="bg-[#4318FF]/5 rounded-xl p-4">
                  <p className="text-xs text-[#4318FF] font-medium mb-3">
                    Students must declare AI usage using the ART-AI system before finalizing submission.
                  </p>
                  <ul className="space-y-2 text-sm text-[#1B2559] font-bold">
                    <li className="flex justify-between">
                      <span className="text-gray-500 font-normal">Min Interactions</span>
                      <span>{assignment.minAiInteractions || 0}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-500 font-normal">Max Interactions</span>
                      <span>{assignment.maxAiInteractions || 'Unlimited'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showUploadModal && (
        <UploadMaterialModal 
          assignmentId={id!} 
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            setSuccessMsg('Material uploaded successfully!');
            fetchMaterials();
            setTimeout(() => setSuccessMsg(null), 3000);
          }}
        />
      )}
    </div>
  );
};

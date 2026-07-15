import React, { useState } from 'react';
import { X, UploadCloud, AlertCircle } from 'lucide-react';
import { assignmentService } from '../../services/assignment.service';

interface UploadMaterialModalProps {
  assignmentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'pptx', 'zip'];

export const UploadMaterialModal: React.FC<UploadMaterialModalProps> = ({ assignmentId, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Validate File Size
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError('File size exceeds the 20MB limit.');
        setFile(null);
        e.target.value = '';
        return;
      }
      
      // Validate File Type
      const extension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
        setError('Invalid file type. Allowed formats: PDF, DOCX, PPTX, ZIP.');
        setFile(null);
        e.target.value = '';
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await assignmentService.uploadMaterial(assignmentId, file, title, description);
      onSuccess();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }, message?: string };
      setError(error.response?.data?.message || error.message || 'Failed to upload material');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-[#064E3B] px-6 py-4 flex justify-between items-center text-white shrink-0">
          <h3 className="font-bold text-lg flex items-center">
            <UploadCloud className="w-5 h-5 mr-2" /> Upload Material
          </h3>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
          {error && (
            <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-start border border-red-100">
              <AlertCircle className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">File <span className="text-red-500">*</span></label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 font-bold">
                      {file ? <span className="text-[#16A34A]">{file.name}</span> : <span>Click to select or drag and drop</span>}
                    </p>
                    <p className="text-xs text-gray-400">PDF, DOCX, PPTX, ZIP (MAX. 100MB)</p>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.pptx,.zip" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Title (Optional)</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20" 
                placeholder="e.g. Lecture 1 Slides"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Description (Optional)</label>
              <textarea 
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-green-500/20 resize-none" 
                placeholder="Provide details about this material..."
              ></textarea>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end space-x-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleSubmit}
            disabled={loading || !file}
            className="bg-[#16A34A] text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-md shadow-green-500/20 flex items-center disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span> Uploading...
              </span>
            ) : 'Upload Material'}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useRef, useState } from 'react';
import { CheckCircle2, FileCode, Upload, X } from 'lucide-react';

interface FileUploadSectionProps {
  onFileSelect: (file: File | null) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mb-8 border-b border-gray-100 pb-8">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center">
          {selectedFile ? (
            <><CheckCircle2 className="w-4 h-4 text-green-500 mr-2" /> Step 1: File Uploaded</>
          ) : (
            <><Upload className="w-4 h-4 text-blue-500 mr-2" /> Step 1: Upload Submission File</>
          )}
        </h4>
        {selectedFile && (
          <button onClick={() => fileInputRef.current?.click()} className="text-xs font-bold text-[#4318FF] hover:underline">
            Change File
          </button>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {!selectedFile ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#4318FF] hover:bg-blue-50/50 transition-colors"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <Upload className="w-6 h-6 text-[#4318FF]" />
          </div>
          <p className="text-sm font-bold text-[#1B2559]">Click to browse or drag and drop</p>
          <p className="text-xs text-gray-500 mt-1">PDF, ZIP, RAR, DOCX (Max 10MB)</p>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center mr-4">
              <FileCode className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1B2559]">{selectedFile.name}</p>
              <p className="text-xs text-gray-500 font-medium">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button onClick={clearFile} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;

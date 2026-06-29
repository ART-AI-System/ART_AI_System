import React, { useRef, useState } from 'react';

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileReject?: (error: string) => void;
  maxSizeMB?: number;
  accept?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileReject,
  maxSizeMB = 10,
  accept = '.pdf,.docx,.zip,.xlsx,.pptx',
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    // Check max size
    if (file.size > maxSizeMB * 1024 * 1024) {
      if (onFileReject) {
        onFileReject(`File size exceeds the limit of ${maxSizeMB}MB.`);
      }
      return;
    }

    // MIME type/extension check is partially handled by the 'accept' attribute,
    // but we can also manually check extension if needed.
    const ext = file.name.split('.').pop()?.toLowerCase();
    const acceptedExtensions = accept.split(',').map((s) => s.trim().replace('.', '').toLowerCase());
    
    if (ext && !acceptedExtensions.includes(ext) && !accept.includes(file.type)) {
       if (onFileReject) {
          onFileReject(`File type not allowed. Accepted types: ${accept}`);
       }
       return;
    }

    setSelectedFileName(file.name);
    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      className={`relative w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
      } ${className}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleChange}
      />
      {selectedFileName ? (
        <div className="flex flex-col items-center">
          <svg className="w-8 h-8 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span className="text-gray-700 font-medium">{selectedFileName}</span>
          <span className="text-sm text-gray-500 mt-1">Click or drag to replace</span>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
          </svg>
          <span className="text-gray-700 font-medium">Click to upload or drag and drop</span>
          <span className="text-sm text-gray-500 mt-1">Accepted formats: {accept} (Max {maxSizeMB}MB)</span>
        </div>
      )}
    </div>
  );
};

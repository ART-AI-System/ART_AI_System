import React, { useState, useEffect } from 'react';
import { Download, Sidebar, Folder, FolderOpen, FileCode2, FileText, File as FileIcon, ChevronDown, ChevronRight, LayoutTemplate } from 'lucide-react';
import JSZip from 'jszip';
// @ts-ignore
import mammoth from 'mammoth/mammoth.browser';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import ts from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml'; // for HTML/XML
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import axiosClient from '../../api/axiosClient';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('html', xml);
SyntaxHighlighter.registerLanguage('xml', xml);

interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children: { [name: string]: FileNode };
  file?: JSZip.JSZipObject;
}

interface SubmissionFileViewerProps {
  submissionId: string;
  submissionInfo?: any;
}

const getLanguageFromExtension = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js': case 'jsx': return 'javascript';
    case 'ts': case 'tsx': return 'typescript';
    case 'java': return 'java';
    case 'py': return 'python';
    case 'css': return 'css';
    case 'html': case 'htm': case 'xml': return 'xml';
    case 'json': return 'json';
    default: return 'text';
  }
};

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js': case 'jsx': case 'ts': case 'tsx': return <FileCode2 className="w-4 h-4 text-blue-500" />;
    case 'java': return <FileCode2 className="w-4 h-4 text-orange-500" />;
    case 'pdf': return <FileText className="w-4 h-4 text-red-500" />;
    case 'docx': case 'doc': return <FileText className="w-4 h-4 text-blue-700" />;
    case 'txt': case 'md': return <FileText className="w-4 h-4 text-gray-500" />;
    default: return <FileIcon className="w-4 h-4 text-gray-400" />;
  }
};

const FileTreeNodeComponent: React.FC<{
  node: FileNode;
  activePath: string | null;
  onSelect: (node: FileNode) => void;
  level?: number;
}> = ({ node, activePath, onSelect, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(level < 1); // Expand root by default
  const isSelected = activePath === node.path;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.isDirectory) {
      setIsOpen(!isOpen);
    } else {
      onSelect(node);
    }
  };

  const childrenNodes = Object.values(node.children).sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="select-none">
      <div 
        className={`flex items-center py-1.5 px-2 cursor-pointer hover:bg-gray-200 transition-colors ${isSelected ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-700'}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        <span className="w-4 h-4 mr-1 flex items-center justify-center shrink-0">
          {node.isDirectory ? (
            isOpen ? <ChevronDown className="w-3 h-3 text-gray-500" /> : <ChevronRight className="w-3 h-3 text-gray-500" />
          ) : null}
        </span>
        <span className="mr-1.5 shrink-0">
          {node.isDirectory ? (
            isOpen ? <FolderOpen className="w-4 h-4 text-[#F26F21]" /> : <Folder className="w-4 h-4 text-[#F26F21]" />
          ) : (
            getFileIcon(node.name)
          )}
        </span>
        <span className="truncate text-sm">{node.name}</span>
      </div>
      
      {node.isDirectory && isOpen && (
        <div>
          {childrenNodes.map(child => (
            <FileTreeNodeComponent 
              key={child.path} 
              node={child} 
              activePath={activePath} 
              onSelect={onSelect} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};


const SubmissionFileViewer: React.FC<SubmissionFileViewerProps> = ({ submissionId, submissionInfo }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isZip, setIsZip] = useState(false);
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [treeOpen, setTreeOpen] = useState(true);
  
  // Single file or current active file from zip
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [singleFileBlob, setSingleFileBlob] = useState<Blob | null>(null);
  
  // Preview state
  const [previewContent, setPreviewContent] = useState<{ type: 'text' | 'html' | 'pdf' | 'none'; content?: string; url?: string }>({ type: 'none' });
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    if (!submissionId) return;

    const fetchAndProcess = async () => {
      setLoading(true);
      setError('');
      try {
        const response: any = await axiosClient.get(`/submissions/${submissionId}/download`, {
          responseType: 'arraybuffer',
        });

        const arrayBuffer = response.data || response;
        const blob = new Blob([arrayBuffer]);

        // Try to parse as zip
        try {
          // Check if it's a specific archive type we shouldn't unzip (like docx)
          const filename = submissionInfo?.fileName || submissionInfo?.file_name || 'downloaded_file';
          const ext = filename.split('.').pop()?.toLowerCase();
          const isDocumentArchive = ['docx', 'doc', 'xlsx', 'pptx'].includes(ext);

          // Check magic bytes for ZIP (PK\x03\x04)
          const view = new DataView(arrayBuffer);
          const isZipMagic = view.byteLength >= 4 && view.getUint32(0, false) === 0x504b0304;

          if (!isZipMagic || isDocumentArchive) {
            throw new Error('Not a generic zip file');
          }

          const zip = await JSZip.loadAsync(arrayBuffer);
          setIsZip(true);
          
          const root: FileNode = { name: 'root', path: '', isDirectory: true, children: {} };
          const extractedFiles: JSZip.JSZipObject[] = [];

          zip.forEach((relativePath, file) => {
            if (relativePath.includes('__MACOSX/')) return;
            
            const parts = relativePath.split('/').filter(p => p);
            let current = root;
            
            for (let i = 0; i < parts.length; i++) {
              const part = parts[i];
              if (i === parts.length - 1 && !file.dir) {
                current.children[part] = { name: part, path: relativePath, isDirectory: false, children: {}, file };
                extractedFiles.push(file);
              } else {
                const dirPath = parts.slice(0, i + 1).join('/');
                if (!current.children[part]) {
                  current.children[part] = { name: part, path: dirPath, isDirectory: true, children: {} };
                }
                current = current.children[part];
              }
            }
          });

          setFileTree(root);
          
          // Auto select first file
          const firstFileNode = findFirstFile(root);
          if (firstFileNode) {
            handleFileSelect(firstFileNode);
          }

        } catch (zipErr) {
          // Not a zip file, handle as single file
          setIsZip(false);
          setTreeOpen(false);
          setSingleFileBlob(blob);
          
          const renderFilename = submissionInfo?.fileName || submissionInfo?.file_name || 'downloaded_file';
          renderSingleFile(blob, renderFilename);
        }

      } catch (err) {
        console.error('Download failed', err);
        setError('Failed to fetch submission file. The file may not exist or network error.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcess();
  }, [submissionId, submissionInfo]);

  const findFirstFile = (node: FileNode): FileNode | null => {
    if (!node.isDirectory) return node;
    for (const child of Object.values(node.children)) {
      const found = findFirstFile(child);
      if (found) return found;
    }
    return null;
  };

  const renderSingleFile = async (blob: Blob, filename: string) => {
    setPreviewLoading(true);
    setPreviewContent({ type: 'none' });
    try {
      const ext = filename.split('.').pop()?.toLowerCase();
      
      if (ext === 'pdf') {
        const url = window.URL.createObjectURL(blob);
        setPreviewContent({ type: 'pdf', url });
      } else if (ext === 'docx' || ext === 'doc') {
        const arrayBuffer = await blob.arrayBuffer();
        try {
          const result = await mammoth.convertToHtml({ arrayBuffer });
          setPreviewContent({ type: 'html', content: result.value });
        } catch (e) {
          console.error('Mammoth err', e);
          setPreviewContent({ type: 'text', content: 'Failed to preview DOCX locally.' });
        }
      } else {
        const text = await blob.text();
        setPreviewContent({ type: 'text', content: text });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleFileSelect = async (node: FileNode) => {
    setActiveFile(node);
    if (!node.file) return;

    setPreviewLoading(true);
    setPreviewContent({ type: 'none' });

    try {
      const ext = node.name.split('.').pop()?.toLowerCase();
      
      if (ext === 'pdf') {
        const blob = await node.file.async('blob');
        const url = window.URL.createObjectURL(blob);
        setPreviewContent({ type: 'pdf', url });
      } else if (ext === 'docx' || ext === 'doc') {
        const arrayBuffer = await node.file.async('arraybuffer');
        try {
          const result = await mammoth.convertToHtml({ arrayBuffer });
          setPreviewContent({ type: 'html', content: result.value });
        } catch (e) {
          setPreviewContent({ type: 'text', content: 'Failed to extract DOCX locally.' });
        }
      } else if (ext?.match(/(png|jpe?g|gif|webp)$/i)) {
         setPreviewContent({ type: 'text', content: 'Image preview not implemented. Please download to view.' });
      } else {
        const text = await node.file.async('string');
        setPreviewContent({ type: 'text', content: text });
      }
    } catch (e) {
      console.error(e);
      setPreviewContent({ type: 'text', content: 'Failed to read file contents.' });
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownloadOriginal = async () => {
    try {
      const { submissionService } = await import('../../services/submission.service');
      await submissionService.downloadSubmissionLatest(submissionId, submissionInfo?.fileName);
    } catch (e) {
      alert('Could not download file');
    }
  };

  return (
    <div className="flex-1 flex flex-col border-r border-gray-200 bg-white h-full overflow-hidden">
      {/* Toolbar */}
      <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4 justify-between shrink-0 shadow-sm z-10 relative">
        <div className="flex items-center space-x-3 text-sm text-gray-700 font-medium overflow-hidden">
          <LayoutTemplate className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="font-bold text-[#1B2559] truncate max-w-[250px]">
            {isZip && activeFile ? activeFile.name : submissionInfo?.fileName || 'Submission Preview'}
          </span>
          {previewLoading && <span className="text-xs text-gray-400 animate-pulse">Processing...</span>}
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button 
            onClick={handleDownloadOriginal}
            className="flex items-center px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download className="w-3 h-3 mr-1.5" /> Download
          </button>
          {isZip && (
            <button 
              className={`p-1.5 rounded transition-colors ${treeOpen ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-200'}`}
              title="Toggle File Tree" 
              onClick={() => setTreeOpen(!treeOpen)}
            >
              <Sidebar className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden bg-[#fafafa]">
        
        {/* Loading State */}
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium text-sm animate-pulse">Fetching and extracting submission...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
              <FileIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No File Available</h3>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        )}

        {/* File Tree Sidebar (Only for ZIP) */}
        {!loading && !error && isZip && treeOpen && fileTree && (
          <div className="w-[280px] bg-gray-50 border-r border-gray-200 overflow-y-auto shrink-0 py-2" style={{ scrollbarWidth: 'thin' }}>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4 mt-2">Repository Files</div>
            <div className="px-2">
              {Object.values(fileTree.children).map(child => (
                <FileTreeNodeComponent 
                  key={child.path} 
                  node={child} 
                  activePath={activeFile?.path || null} 
                  onSelect={handleFileSelect} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Preview Pane */}
        {!loading && !error && (
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
            {previewLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : previewContent.type === 'pdf' ? (
              <iframe 
                src={previewContent.url} 
                className="w-full h-full border-none"
                title="PDF Preview"
              />
            ) : previewContent.type === 'html' ? (
              <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-100">
                <div 
                  className="bg-white w-full max-w-[850px] min-h-[1056px] shadow-lg p-12 text-gray-800 docx-preview"
                  dangerouslySetInnerHTML={{ __html: previewContent.content || '' }}
                  style={{
                    fontFamily: 'Times New Roman, serif',
                    lineHeight: '1.5'
                  }}
                />
              </div>
            ) : previewContent.type === 'text' ? (
              <div className="flex-1 overflow-auto" style={{ scrollbarWidth: 'thin' }}>
                <SyntaxHighlighter
                  language={getLanguageFromExtension(activeFile ? activeFile.name : (submissionInfo?.fileName || ''))}
                  style={docco}
                  customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    fontSize: '13px',
                    fontFamily: '"Fira Code", "Consolas", monospace',
                    minHeight: '100%',
                    background: '#ffffff'
                  }}
                  showLineNumbers={true}
                  wrapLines={true}
                >
                  {previewContent.content || 'File is empty.'}
                </SyntaxHighlighter>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                Select a file from the repository to preview its contents.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionFileViewer;

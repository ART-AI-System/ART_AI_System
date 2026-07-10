import React, { useState, useEffect } from 'react';
import { Download, Sidebar, Folder, FileCode2, ChevronDown, ChevronRight, File as FileIcon } from 'lucide-react';
import JSZip from 'jszip';
import axiosClient from '../../api/axiosClient';

interface CodeReviewerProps {
  submissionId?: string;
}

const CodeReviewer: React.FC<CodeReviewerProps> = ({ submissionId }) => {
  const [viewMode, setViewMode] = useState<'code' | 'pdf'>('code');
  const [treeOpen, setTreeOpen] = useState(true);
  const [files, setFiles] = useState<{ [path: string]: JSZip.JSZipObject }>({});
  const [fileTree, setFileTree] = useState<any>({});
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [expandedFolders, setExpandedFolders] = useState<{ [path: string]: boolean }>({});

  useEffect(() => {
    if (!submissionId) return;

    const fetchAndUnzip = async () => {
      setLoading(true);
      setError('');
      try {
        const response: any = await axiosClient.get(`/submissions/${submissionId}/download`, {
          responseType: 'arraybuffer',
        });
        
        const zip = await JSZip.loadAsync(response);
        const extractedFiles: { [path: string]: JSZip.JSZipObject } = {};
        const tree: any = {};

        zip.forEach((relativePath: string, file: any) => {
          extractedFiles[relativePath] = file;
          
          // Build basic tree
          const parts = relativePath.split('/');
          let currentLevel = tree;
          
          for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (!part) continue;
            
            if (i === parts.length - 1 && !file.dir) {
              currentLevel[part] = { isFile: true, path: relativePath };
            } else {
              currentLevel[part] = currentLevel[part] || { isFile: false, children: {}, path: relativePath };
              currentLevel = currentLevel[part].children;
            }
          }
        });

        setFiles(extractedFiles);
        setFileTree(tree);
        
        // Auto-expand root folders
        const initialExpanded: any = {};
        Object.keys(tree).forEach(k => initialExpanded[tree[k].path] = true);
        setExpandedFolders(initialExpanded);

        // Auto select first file
        const firstFile = Object.values(extractedFiles).find(f => !f.dir);
        if (firstFile) {
          handleFileSelect(firstFile.name);
        }

      } catch (err) {
        console.error('Failed to load zip', err);
        setError('Could not load submission file (or it is not a valid zip). Using mock view.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndUnzip();
  }, [submissionId]);

  const handleFileSelect = async (path: string) => {
    setSelectedFilePath(path);
    const file = files[path];
    if (file) {
      if (file.name.match(/\.(png|jpe?g|gif|pdf|zip|rar)$/i)) {
        setFileContent('Binary file preview not supported.');
      } else {
        const text = await file.async('string');
        setFileContent(text);
      }
    }
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const renderTree = (nodes: any, pathPrefix = '') => {
    return (
      <ul className={`${pathPrefix ? 'pl-4 border-l border-gray-200 ml-3' : 'space-y-0.5'} text-sm font-medium text-gray-700`}>
        {Object.keys(nodes).map(key => {
          const node = nodes[key];
          if (node.isFile) {
            const isSelected = selectedFilePath === node.path;
            return (
              <li key={node.path}>
                <button 
                  onClick={() => handleFileSelect(node.path)}
                  className={`w-full flex items-center px-2 py-1.5 rounded text-left truncate ${isSelected ? 'bg-[#4318FF]/10 text-[#4318FF]' : 'hover:bg-gray-200'}`}
                  title={node.path}
                >
                  <FileCode2 className={`w-4 h-4 mr-2 shrink-0 ${isSelected ? 'text-[#F26F21]' : 'text-gray-500'}`} />
                  <span className="truncate">{key}</span>
                </button>
              </li>
            );
          } else {
            const isExpanded = expandedFolders[node.path];
            return (
              <li key={node.path}>
                <button 
                  onClick={() => toggleFolder(node.path)}
                  className="w-full flex items-center px-2 py-1.5 hover:bg-gray-200 rounded text-left truncate"
                  title={node.path}
                >
                  {isExpanded ? <ChevronDown className="w-3 h-3 mr-1 shrink-0 text-gray-400" /> : <ChevronRight className="w-3 h-3 mr-1 shrink-0 text-gray-400" />}
                  <Folder className="w-4 h-4 mr-2 shrink-0 text-blue-400" />
                  <span className="truncate">{key}</span>
                </button>
                {isExpanded && renderTree(node.children, node.path)}
              </li>
            );
          }
        })}
      </ul>
    );
  };

  // Removed mock code

  return (
    <div className="flex-1 flex flex-col border-r border-gray-200 bg-white">
      {/* Toolbar */}
      <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center space-x-2 text-sm text-gray-600 font-medium overflow-hidden">
          <button 
            className={`px-3 py-1 border rounded text-xs font-bold shadow-sm transition-colors ${viewMode === 'code' ? 'bg-white border-gray-200' : 'bg-transparent border-transparent hover:bg-gray-100'}`}
            onClick={() => setViewMode('code')}
          >
            Code View
          </button>
          <button 
            className={`px-3 py-1 border rounded text-xs font-bold shadow-sm transition-colors ${viewMode === 'pdf' ? 'bg-white border-gray-200' : 'bg-transparent border-transparent hover:bg-gray-100'}`}
            onClick={() => setViewMode('pdf')}
          >
            Document View
          </button>
          <span className="mx-2 text-gray-300">|</span>
          <FileCode2 className="w-4 h-4 text-[#F26F21] shrink-0" />
          <span className="font-bold text-[#1B2559] truncate max-w-[200px]">
            {selectedFilePath ? selectedFilePath.split('/').pop() : 'CartServlet.java'}
          </span>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button className="p-1.5 text-gray-500 hover:text-[#1B2559] hover:bg-gray-200 rounded transition-colors" title="Download File">
            <Download className="w-4 h-4" />
          </button>
          <button 
            className={`p-1.5 rounded transition-colors ${treeOpen ? 'bg-gray-200 text-[#1B2559]' : 'text-gray-500 hover:bg-gray-200'}`}
            title="Toggle File Tree" 
            onClick={() => setTreeOpen(!treeOpen)}
          >
            <Sidebar className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code Editor Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree Sidebar */}
        {treeOpen && (
          <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto shrink-0 p-2" style={{ scrollbarWidth: 'thin' }}>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2 mt-2">Files</div>
            {loading ? (
               <div className="px-2 text-sm text-gray-500">Loading zip...</div>
            ) : Object.keys(fileTree).length > 0 ? (
               renderTree(fileTree)
            ) : (
               <div className="px-2 text-sm text-gray-500">
                 {error ? <span className="text-red-500">{error}</span> : 'No files found.'}
                 <div className="mt-4 text-xs text-gray-400">
                   <p>No valid zip file was found for this submission.</p>
                 </div>
               </div>
            )}
          </div>
        )}

        {/* View Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {viewMode === 'code' ? (
            <div className="flex-1 overflow-auto bg-white p-4" style={{ scrollbarWidth: 'thin' }}>
              <pre className="text-sm font-mono leading-relaxed text-gray-800 whitespace-pre-wrap">
                {Object.keys(fileTree).length > 0 
                  ? fileContent || 'Select a file to view its content.'
                  : 'No file selected or no submission file available.'}
              </pre>
            </div>
          ) : (
            <div className="flex-1 overflow-auto bg-gray-200 p-8 flex justify-center">
              <div className="bg-white w-[800px] min-h-[1100px] shadow-2xl p-12 text-gray-800">
                <h1 className="text-3xl font-bold mb-6 border-b pb-4">Architecture Design Report</h1>
                <p className="mb-4">This document outlines the system architecture...</p>
                <div className="bg-gray-100 h-64 flex items-center justify-center border border-gray-300 mb-4 text-gray-400">
                  [Diagram Image Mockup]
                </div>
                <p>As seen in the diagram above, the client connects to the Load Balancer...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeReviewer;

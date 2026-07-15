import React, { useState, useEffect, useCallback } from 'react';
import {
  Download, Sidebar, Folder, FolderOpen, FileCode2, FileText,
  File as FileIcon, ChevronDown, ChevronRight, LayoutTemplate,
  AlertTriangle, Loader2, Sparkles, AlertOctagon, CheckCircle, ShieldAlert, Bug, Lightbulb, Copy, X, ArrowRight
} from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import ts from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import axiosClient from '../../api/axiosClient';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('html', xml);
SyntaxHighlighter.registerLanguage('xml', xml);

// ─── Types ───────────────────────────────────────────────────────────────────

interface ServerTreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  size?: number;
  mimeType?: string;
  children?: ServerTreeNode[];
}

interface FilePreviewState {
  type: 'text' | 'binary' | 'none';
  content?: string;
  language?: string;
  fileName?: string;
  isTooLarge?: boolean;
  downloadUrl?: string;
}

interface SubmissionFileViewerProps {
  submissionId: string;
  submissionInfo?: any;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getLanguageFromExtension = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js': case 'jsx': return 'javascript';
    case 'ts': case 'tsx': return 'typescript';
    case 'java': return 'java';
    case 'py': return 'python';
    case 'css': return 'css';
    case 'html': case 'htm': case 'xml': return 'html';
    case 'json': return 'json';
    case 'md': return 'markdown';
    default: return 'text';
  }
};

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js': case 'jsx': case 'ts': case 'tsx':
      return <FileCode2 className="w-4 h-4 text-blue-500" />;
    case 'java':
      return <FileCode2 className="w-4 h-4 text-orange-500" />;
    case 'py':
      return <FileCode2 className="w-4 h-4 text-yellow-500" />;
    case 'pdf':
      return <FileText className="w-4 h-4 text-red-500" />;
    case 'docx': case 'doc':
      return <FileText className="w-4 h-4 text-blue-700" />;
    case 'md': case 'txt':
      return <FileText className="w-4 h-4 text-gray-500" />;
    case 'json':
      return <FileCode2 className="w-4 h-4 text-yellow-400" />;
    default:
      return <FileIcon className="w-4 h-4 text-gray-400" />;
  }
};

// ─── File Tree Node Component ─────────────────────────────────────────────────

const FileTreeNode: React.FC<{
  node: ServerTreeNode;
  activePath: string | null;
  onSelect: (node: ServerTreeNode) => void;
  level?: number;
}> = ({ node, activePath, onSelect, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(level < 1);
  const isSelected = activePath === node.path;
  const isFolder = node.type === 'folder';

  const sortedChildren = [...(node.children || [])].sort((a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    return a.name.localeCompare(b.name);
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      setIsOpen(o => !o);
    } else {
      onSelect(node);
    }
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center py-1.5 px-2 cursor-pointer hover:bg-gray-200 transition-colors ${
          isSelected ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-700'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        <span className="w-4 h-4 mr-1 flex items-center justify-center shrink-0">
          {isFolder ? (
            isOpen
              ? <ChevronDown className="w-3 h-3 text-gray-500" />
              : <ChevronRight className="w-3 h-3 text-gray-500" />
          ) : null}
        </span>
        <span className="mr-1.5 shrink-0">
          {isFolder
            ? isOpen
              ? <FolderOpen className="w-4 h-4 text-[#F26F21]" />
              : <Folder className="w-4 h-4 text-[#F26F21]" />
            : getFileIcon(node.name)
          }
        </span>
        <span className="truncate text-sm">{node.name}</span>
      </div>

      {isFolder && isOpen && sortedChildren.length > 0 && (
        <div>
          {sortedChildren.map(child => (
            <FileTreeNode
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

// ─── Main Component ───────────────────────────────────────────────────────────

const SubmissionFileViewer: React.FC<SubmissionFileViewerProps> = ({ submissionId, submissionInfo }) => {
  const [treeLoading, setTreeLoading] = useState(true);
  const [treeError, setTreeError] = useState('');
  const [treeData, setTreeData] = useState<{ tree: ServerTreeNode; isArchive: boolean; fileName: string } | null>(null);
  const [treeOpen, setTreeOpen] = useState(true);

  const [activePath, setActivePath] = useState<string | null>(null);
  const [activeFileName, setActiveFileName] = useState<string>('');
  const [fileLoading, setFileLoading] = useState(false);
  const [preview, setPreview] = useState<FilePreviewState>({ type: 'none' });

  // ── AI Code Annotator States ────────────────────────────────────────────────
  const [loadingAnnotations, setLoadingAnnotations] = useState(false);
  const [annotationsResult, setAnnotationsResult] = useState<{ overallQuality: string; annotations: any[] } | null>(null);
  const [annotationsError, setAnnotationsError] = useState('');
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [showAnnotationsDrawer, setShowAnnotationsDrawer] = useState(false);

  // ── Phase 1: Load tree via server API ──────────────────────────────────────
  useEffect(() => {
    if (!submissionId) return;
    setTreeLoading(true);
    setTreeError('');
    setTreeData(null);
    setActivePath(null);
    setPreview({ type: 'none' });

    axiosClient
      .get(`/submissions/${submissionId}/tree`)
      .then((res: any) => {
        const result = res.result ?? res.data?.result ?? res;
        if (!result || !result.tree) throw new Error('Invalid tree response');
        setTreeData({
          tree: result.tree,
          isArchive: result.isArchive ?? false,
          fileName: result.fileName ?? submissionInfo?.fileName ?? 'Submission',
        });
        // Auto-select first file
        const firstFile = findFirstFile(result.tree);
        if (firstFile) {
          fetchFileContent(firstFile);
        }
      })
      .catch(() => {
        // Graceful fallback for single-file or non-zip submissions
        const name = submissionInfo?.fileName || 'submission';
        const fallbackNode: ServerTreeNode = { name, path: name, type: 'file' };
        setTreeData({ tree: fallbackNode, isArchive: false, fileName: name });
        setTreeOpen(false);
        fetchFileContent(fallbackNode);
      })
      .finally(() => setTreeLoading(false));
  }, [submissionId]);

  // ── Phase 2: Fetch individual file content on demand ──────────────────────
  const fetchFileContent = useCallback(async (node: ServerTreeNode) => {
    if (node.type === 'folder') return;
    setActivePath(node.path);
    setActiveFileName(node.name);
    setFileLoading(true);
    setPreview({ type: 'none' });
    setAnnotationsResult(null);
    setSelectedLine(null);
    setAnnotationsError('');
    setShowAnnotationsDrawer(false);

    try {
      const res: any = await axiosClient.get(
        `/submissions/${submissionId}/file`,
        { params: { path: node.path } }
      );
      const result = res.result ?? res.data?.result ?? res;

      if (!result.isText || result.content === null) {
        // Binary file or too large to preview
        setPreview({
          type: 'binary',
          fileName: node.name,
          isTooLarge: result.truncated ?? false,
          downloadUrl: result.downloadUrl,
        });
      } else {
        setPreview({
          type: 'text',
          content: result.content,
          language: getLanguageFromExtension(node.name),
          fileName: node.name,
        });
      }
    } catch {
      setPreview({
        type: 'text',
        content: '// Could not load file content.',
        language: 'text',
        fileName: node.name,
      });
    } finally {
      setFileLoading(false);
    }
  }, [submissionId]);

  const handleDownloadOriginal = async () => {
    try {
      const { submissionService } = await import('../../services/submission.service');
      await submissionService.downloadSubmissionLatest(submissionId, treeData?.fileName);
    } catch {
      alert('Could not download file');
    }
  };

  const handleAIAnnotateFile = async () => {
    if (!submissionId || !activePath) return;
    setLoadingAnnotations(true);
    setAnnotationsError('');
    try {
      const res: any = await axiosClient.post(`/submissions/${submissionId}/ai-annotate-file`, { filePath: activePath });
      const result = res.result ?? res.data?.result ?? res;
      setAnnotationsResult(result);
      setShowAnnotationsDrawer(true);
    } catch (err: any) {
      setAnnotationsError(err?.response?.data?.message || 'Could not analyze file with AI.');
    } finally {
      setLoadingAnnotations(false);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const findFirstFile = (node: ServerTreeNode): ServerTreeNode | null => {
    if (node.type === 'file') return node;
    for (const child of node.children || []) {
      const found = findFirstFile(child);
      if (found) return found;
    }
    return null;
  };

  const isZip = treeData?.isArchive ?? false;
  const rootChildren = isZip
    ? (treeData?.tree?.children || [])
    : treeData?.tree
      ? [treeData.tree]
      : [];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col border-r border-gray-200 bg-white h-full overflow-hidden">

      {/* Toolbar */}
      <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4 justify-between shrink-0 shadow-sm z-10 relative">
        <div className="flex items-center space-x-3 text-sm text-gray-700 font-medium overflow-hidden">
          <LayoutTemplate className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="font-bold text-[#1B2559] truncate max-w-[250px]">
            {activeFileName || treeData?.fileName || 'Submission Preview'}
          </span>
          {fileLoading && (
            <span className="flex items-center text-xs text-gray-400 animate-pulse gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Loading...
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          {preview.type === 'text' && (
            <button
              onClick={handleAIAnnotateFile}
              disabled={loadingAnnotations || !activePath}
              className="flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white text-xs font-extrabold rounded-lg transition-all shadow-sm"
            >
              {loadingAnnotations ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Auditing File...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" /> {annotationsResult ? `AI Annotations (${annotationsResult.annotations?.length || 0})` : 'AI Code Annotate'}
                </>
              )}
            </button>
          )}
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
              onClick={() => setTreeOpen(o => !o)}
            >
              <Sidebar className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden bg-[#fafafa]">

        {/* Tree Loading */}
        {treeLoading && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-500 font-medium text-sm animate-pulse">Loading submission structure...</p>
          </div>
        )}

        {/* Tree Error (unrecoverable) */}
        {!treeLoading && treeError && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">File Not Available</h3>
            <p className="text-gray-500 text-sm">{treeError}</p>
          </div>
        )}

        {/* File Tree Sidebar */}
        {!treeLoading && !treeError && isZip && treeOpen && treeData && (
          <div
            className="w-[280px] bg-gray-50 border-r border-gray-200 overflow-y-auto shrink-0 py-2"
            style={{ scrollbarWidth: 'thin' }}
          >
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4 mt-2">
              Repository Files
            </div>
            <div className="px-2">
              {rootChildren.map(child => (
                <FileTreeNode
                  key={child.path}
                  node={child}
                  activePath={activePath}
                  onSelect={fetchFileContent}
                />
              ))}
            </div>
          </div>
        )}

        {/* Preview Pane */}
        {!treeLoading && !treeError && (
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
            {fileLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              </div>
            ) : preview.type === 'text' ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {annotationsError && (
                  <div className="p-3 bg-red-50 text-red-600 border-b border-red-200 text-xs flex items-center shrink-0">
                    <AlertOctagon className="w-4 h-4 mr-2 shrink-0" /> {annotationsError}
                  </div>
                )}

                {/* Main Code View */}
                <div className="flex-1 overflow-auto" style={{ scrollbarWidth: 'thin' }}>
                  <SyntaxHighlighter
                    language={preview.language || 'text'}
                    style={docco}
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem',
                      fontSize: '13px',
                      fontFamily: '"Fira Code", "Consolas", monospace',
                      minHeight: '100%',
                      background: '#ffffff',
                    }}
                    showLineNumbers
                    wrapLines
                    lineProps={(lineNumber: number) => {
                      const annotation = annotationsResult?.annotations?.find((a: any) => a.lineNumber === lineNumber);
                      const isSelected = selectedLine === lineNumber;
                      let style: React.CSSProperties = { display: 'block' };

                      if (annotation || isSelected) {
                        const sev = annotation?.severity;
                        style = {
                          display: 'block',
                          backgroundColor:
                            isSelected ? '#e0e7ff' :
                            sev === 'SECURITY' ? '#fee2e2' :
                            sev === 'BUG' ? '#fef3c7' :
                            sev === 'BEST_PRACTICE' ? '#e0f2fe' :
                            sev === 'PRAISE' ? '#dcfce7' : 'transparent',
                          borderLeft:
                            sev === 'SECURITY' ? '4px solid #ef4444' :
                            sev === 'BUG' ? '4px solid #f59e0b' :
                            sev === 'BEST_PRACTICE' ? '4px solid #0ea5e9' :
                            sev === 'PRAISE' ? '4px solid #22c55e' : 'none',
                          paddingLeft: annotation ? '8px' : '0px',
                          cursor: annotation ? 'pointer' : 'default',
                        };
                      }

                      return {
                        style,
                        onClick: () => {
                          if (annotation) {
                            setSelectedLine(lineNumber);
                            setShowAnnotationsDrawer(true);
                          }
                        }
                      };
                    }}
                  >
                    {preview.content || ''}
                  </SyntaxHighlighter>
                </div>

                {/* AI Annotations Bottom Panel */}
                {showAnnotationsDrawer && annotationsResult && (
                  <div className="max-h-[220px] bg-white border-t-2 border-indigo-200 shadow-xl overflow-y-auto shrink-0 flex flex-col z-20">
                    <div className="p-3 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between shrink-0">
                      <div className="flex items-center space-x-2 text-xs font-bold text-indigo-900">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>AI Code Audit Summary: {annotationsResult.overallQuality}</span>
                      </div>
                      <button
                        onClick={() => setShowAnnotationsDrawer(false)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto">
                      {annotationsResult.annotations?.map((ann: any, idx: number) => {
                        const isActive = selectedLine === ann.lineNumber;
                        const icon =
                          ann.severity === 'SECURITY' ? <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" /> :
                          ann.severity === 'BUG' ? <Bug className="w-4 h-4 text-amber-600 shrink-0" /> :
                          ann.severity === 'BEST_PRACTICE' ? <Lightbulb className="w-4 h-4 text-sky-600 shrink-0" /> :
                          <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />;

                        const bgClass =
                          ann.severity === 'SECURITY' ? 'bg-red-50/70 border-red-200' :
                          ann.severity === 'BUG' ? 'bg-amber-50/70 border-amber-200' :
                          ann.severity === 'BEST_PRACTICE' ? 'bg-sky-50/70 border-sky-200' :
                          'bg-green-50/70 border-green-200';

                        return (
                          <div
                            key={idx}
                            onClick={() => setSelectedLine(ann.lineNumber)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${bgClass} ${isActive ? 'ring-2 ring-indigo-500 scale-[1.01]' : 'hover:opacity-90'}`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-1.5 font-extrabold text-[#1B2559]">
                                {icon}
                                <span>Line {ann.lineNumber}: {ann.title}</span>
                              </div>
                              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/80 shadow-sm text-gray-700">
                                {ann.severity}
                              </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-1.5">{ann.comment}</p>
                            {ann.suggestedFix && (
                              <div className="bg-gray-900 text-green-400 font-mono p-2 rounded-lg text-[11px] overflow-x-auto">
                                <span className="text-gray-500 select-none block text-[10px]">💡 Suggested Fix:</span>
                                {ann.suggestedFix}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : preview.type === 'binary' ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                  <FileIcon className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-gray-700 mb-1">{preview.fileName}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {preview.isTooLarge
                    ? 'File is too large to preview inline.'
                    : 'Binary file — cannot display as text.'}
                </p>
                <button
                  onClick={handleDownloadOriginal}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" /> Download to View
                </button>
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

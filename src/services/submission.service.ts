import axiosClient from '../api/axiosClient';

export interface AiInteraction {
  prompt: string;
  aiResponse: string;
  toolUsed: string;
  explanation: string;
}

// Helper function to extract filename and trigger download
const handleFileDownload = async (promise: Promise<any>, fallbackFileName?: string) => {
  const response = await promise;
  
  // Extract filename from Content-Disposition header if available
  let fileName = fallbackFileName || 'downloaded_file';
  const disposition = response.headers && response.headers['content-disposition'];
  if (disposition && disposition.indexOf('attachment') !== -1) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) { 
      fileName = matches[1].replace(/['"]/g, '');
    }
  }

  // Create Blob and trigger download
  // Note: axiosClient might automatically extract data if interceptors are set up.
  // If response.data is the Blob, we use it. Otherwise, use response.
  const blobData = response.data instanceof Blob ? response.data : response;
  const blob = new Blob([blobData]);
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const submissionService = {
  // --- Student Methods ---

  getMySubmission: async (assignmentId: string) => {
    return await axiosClient.get(`/assignments/${assignmentId}/submissions/my`);
  },

  getAllMySubmissions: async () => {
    return await axiosClient.get(`/students/me/submissions`);
  },

  createSubmission: async (assignmentId: string, file: File, note?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (note) {
      formData.append('note', note);
    }
    
    return await axiosClient.post(`/assignments/${assignmentId}/submissions`, formData);
  },

  resubmitVersion: async (submissionId: string, file: File, note?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (note) {
      formData.append('note', note);
    }
    
    return await axiosClient.post(`/submissions/${submissionId}/versions`, formData);
  },

  finalizeSubmission: async (submissionId: string) => {
    return await axiosClient.post(`/submissions/${submissionId}/finalize`);
  },

  withdrawSubmission: async (submissionId: string) => {
    return await axiosClient.delete(`/submissions/${submissionId}`);
  },

  // --- Common & Lecturer Methods ---

  getSubmissionsByAssignment: async (assignmentId: string) => {
    return await axiosClient.get(`/assignments/${assignmentId}/submissions`);
  },

  getSubmissionById: async (submissionId: string) => {
    return await axiosClient.get(`/submissions/${submissionId}`);
  },

  getSubmissionVersions: async (submissionId: string) => {
    return await axiosClient.get(`/submissions/${submissionId}/versions`);
  },

  getSubmissionVersionById: async (versionId: string) => {
    return await axiosClient.get(`/submission-versions/${versionId}`);
  },

  downloadSubmissionLatest: async (submissionId: string, expectedFileName?: string) => {
    const promise = axiosClient.get(`/submissions/${submissionId}/download`, {
      responseType: 'blob'
    });
    return handleFileDownload(promise, expectedFileName);
  },

  downloadSubmissionVersion: async (versionId: string) => {
    const promise = axiosClient.get(`/submission-versions/${versionId}/download`, {
      responseType: 'blob'
    });
    return handleFileDownload(promise);
  },

  // --- AI Interactions Methods ---
  
  createAiInteractions: async (submissionId: string, payload: any) => {
    return await axiosClient.post(`/submissions/${submissionId}/ai-interactions`, payload);
  },

  getAiInteractions: async (submissionId: string) => {
    return await axiosClient.get(`/submissions/${submissionId}/ai-interactions`);
  },

  // --- Grading Methods ---

  gradeSubmission: async (submissionId: string, payload: { score: number, feedback: string }) => {
    return await axiosClient.post(`/submissions/${submissionId}/grade`, payload);
  },

  getGrade: async (submissionId: string) => {
    return await axiosClient.get(`/submissions/${submissionId}/grade`);
  },

  // --- Lecturer Dashboard Methods ---

  getGradeItemsByClass: async (classId: string) => {
    return await axiosClient.get(`/classes/${classId}/grade-items`);
  },

  getSubmissionsByGradeItem: async (gradeItemId: string) => {
    return await axiosClient.get(`/grade-items/${gradeItemId}/submissions`);
  },

  getGradesByGradeItem: async (gradeItemId: string) => {
    return await axiosClient.get(`/grade-items/${gradeItemId}/grades`);
  }
};

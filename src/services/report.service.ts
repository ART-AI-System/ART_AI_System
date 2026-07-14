import axiosClient from '../api/axiosClient';

export interface ChatApiResponse<T> {
  message: string;
  result: T;
}

export const downloadBlob = (blob: Blob, defaultFilename: string, contentDisposition?: string) => {
  let filename = defaultFilename;
  
  if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(contentDisposition);
    if (matches != null && matches[1]) { 
      filename = matches[1].replace(/['"]/g, '');
    }
  }

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export const reportService = {
  // Academic Reports
  getGradeSummary: async (classId: string) => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>(`/reports/classes/${classId}/grade-summary`);
    return response.result;
  },
  getFinalResults: async (classId: string) => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>(`/reports/classes/${classId}/final-results`);
    return response.result;
  },
  getRankings: async (classId: string) => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>(`/reports/classes/${classId}/rankings`);
    return response.result;
  },
  getClassifications: async (classId: string) => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>(`/reports/classes/${classId}/classifications`);
    return response.result;
  },

  // AI Usage Reports
  getClassAiUsage: async (classId: string) => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>(`/reports/classes/${classId}/ai-usage`);
    return response.result;
  },
  getSubjectAiUsage: async (subjectId: string) => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>(`/reports/subjects/${subjectId}/ai-usage`);
    return response.result;
  },
  getSemesterAiUsage: async (semesterId: string) => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>(`/reports/semesters/${semesterId}/ai-usage`);
    return response.result;
  },
  getSuspiciousCases: async () => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>(`/reports/suspicious-cases`);
    return response.result;
  },

  // Export APIs
  exportClassReport: async (classId: string, type: string, format: string) => {
    const response = await axiosClient.get(`/reports/classes/${classId}/export`, {
      params: { type, format },
      responseType: 'blob'
    });
    
    // axiosClient intercepts responses, so we need to ensure we return the full raw response or handle it properly.
    // If the interceptor unwraps data, we can just use the blob.
    // Assuming axiosClient returns the data directly if it's not a standard JSON response wrapper.
    // Let's return the full response object if possible, or just the data.
    return response;
  },
  exportSubjectReport: async (subjectId: string, type: string, format: string) => {
    const response = await axiosClient.get(`/reports/subjects/${subjectId}/export`, {
      params: { type, format },
      responseType: 'blob'
    });
    return response;
  },
  exportSemesterReport: async (semesterId: string, type: string, format: string) => {
    const response = await axiosClient.get(`/reports/semesters/${semesterId}/export`, {
      params: { type, format },
      responseType: 'blob'
    });
    return response;
  },
};

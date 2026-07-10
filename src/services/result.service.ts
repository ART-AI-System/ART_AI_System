import axiosClient from '../api/axiosClient';

export const resultService = {
  calculateFinalResults: async (classId: string) => {
    return axiosClient.post(`/classes/${classId}/final-results/calculate`);
  },

  getFinalResultsByClass: async (classId: string) => {
    return axiosClient.get(`/classes/${classId}/final-results`);
  },

  getStudentFinalResultInClass: async (studentId: string, classId: string) => {
    return axiosClient.get(`/students/${studentId}/classes/${classId}/final-result`);
  },

  getMyFinalResults: async () => {
    return axiosClient.get(`/students/me/results`);
  },

  exportFinalResults: async (classId: string) => {
    return axiosClient.get(`/classes/${classId}/final-results/export`, { responseType: 'blob' });
  },

  getClassClassifications: async (classId: string) => {
    return axiosClient.get(`/classes/${classId}/classifications`);
  },

  getClassRankings: async (classId: string) => {
    return axiosClient.get(`/classes/${classId}/rankings`);
  },

  getStudentClassification: async (studentId: string, classId?: string) => {
    const params = classId ? { classId } : undefined;
    return axiosClient.get(`/students/${studentId}/classification`, { params });
  }
};

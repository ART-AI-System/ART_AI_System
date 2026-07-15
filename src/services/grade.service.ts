import axiosClient from '../api/axiosClient';

export interface GradePayload {
  score: number;
  maxScore: number;
  feedback?: string;
  studentId?: string;
}

export const gradeService = {
  createGrade: async (submissionId: string, payload: GradePayload) => {
    return axiosClient.post(`/submissions/${submissionId}/grade`, payload);
  },

  getGrade: async (submissionId: string) => {
    return axiosClient.get(`/submissions/${submissionId}/grade`);
  },

  updateGrade: async (submissionId: string, payload: GradePayload) => {
    return axiosClient.put(`/submissions/${submissionId}/grade`, payload);
  },

  deleteGrade: async (submissionId: string) => {
    return axiosClient.delete(`/submissions/${submissionId}/grade`);
  },

  getAssignmentGrades: async (assignmentId: string) => {
    return axiosClient.get(`/assignments/${assignmentId}/grades`);
  },

  getClassGradebook: async (classId: string) => {
    return axiosClient.get(`/classes/${classId}/gradebook`);
  },

  bulkUpdateGradebook: async (classId: string, payload: any) => {
    return axiosClient.patch(`/classes/${classId}/gradebook/bulk-update`, payload);
  },

  exportGradebook: async (classId: string) => {
    return axiosClient.get(`/classes/${classId}/gradebook/export`, { responseType: 'blob' });
  }
};

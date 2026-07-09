import axiosClient from '../api/axiosClient';

export interface AssignmentPayload {
  title: string;
  description?: string;
  instructions?: string;
  deadline: string;
  maxScore: number;
  weight: number;
  aiDeclarationRequired: boolean;
  minAiInteractions?: number;
  maxAiInteractions?: number;
  allowResubmission?: boolean;
}

export const assignmentService = {
  // ==========================
  // ASSIGNMENTS
  // ==========================
  
  getAssignmentsByClass: async (classId: string) => {
    return axiosClient.get(`/classes/${classId}/assignments`);
  },

  getAssignmentsBySession: async (sessionId: string) => {
    return axiosClient.get(`/sessions/${sessionId}/assignments`);
  },

  createAssignment: async (sessionId: string, payload: AssignmentPayload) => {
    return axiosClient.post(`/sessions/${sessionId}/assignments`, payload);
  },

  createGlobalAssignment: async (subjectId: string, payload: AssignmentPayload & { targetClassIds?: string[] }) => {
    return axiosClient.post(`/subjects/${subjectId}/global-assignments`, payload);
  },

  getAssignmentDetail: async (assignmentId: string) => {
    return axiosClient.get(`/grade-items/standalone/${assignmentId}`);
  },

  updateAssignment: async (assignmentId: string, payload: Partial<AssignmentPayload>) => {
    return axiosClient.put(`/assignments/${assignmentId}`, payload);
  },

  deleteAssignment: async (assignmentId: string) => {
    return axiosClient.delete(`/assignments/${assignmentId}`);
  },

  publishAssignment: async (assignmentId: string) => {
    return axiosClient.patch(`/assignments/${assignmentId}/publish`);
  },

  closeAssignment: async (assignmentId: string) => {
    return axiosClient.patch(`/assignments/${assignmentId}/close`);
  },

  // ==========================
  // MATERIALS
  // ==========================
  
  getAssignmentMaterials: async (assignmentId: string) => {
    return axiosClient.get(`/assignments/${assignmentId}/materials`);
  },

  uploadMaterial: async (assignmentId: string, file: File, title?: string, description?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);

    // axiosClient will automatically handle the boundary for FormData
    return axiosClient.post(`/assignments/${assignmentId}/materials`, formData);
  },

  downloadMaterial: async (materialId: string) => {
    // Usually download endpoints are better handled via direct link or Blob response
    // For Blob response, you might need a separate Axios instance or config
    return axiosClient.get(`/materials/${materialId}/download`, {
      responseType: 'blob'
    });
  },

  deleteMaterial: async (materialId: string) => {
    return axiosClient.delete(`/materials/${materialId}`);
  }
};

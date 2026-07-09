import axiosClient from '../api/axiosClient';

export interface AiInteraction {
  prompt: string;
  aiResponse: string;
  toolUsed: string;
  explanation: string;
}

export const submissionService = {
  // --- Student Methods ---

  /**
   * Get the current student's submission for a specific assignment
   */
  getMySubmission: async (assignmentId: string) => {
    return await axiosClient.get(`/assignments/${assignmentId}/submissions/my`);
  },

  /**
   * Create a new submission (or the first version) for an assignment
   */
  createSubmission: async (assignmentId: string, file: File, aiInteractions?: AiInteraction[]) => {
    const formData = new FormData();
    formData.append('file', file);
    if (aiInteractions && aiInteractions.length > 0) {
      formData.append('aiInteractions', JSON.stringify(aiInteractions));
    }
    
    // Do not set Content-Type to multipart/form-data manually
    // axiosClient will let the browser set it with the correct boundary
    return await axiosClient.post(`/assignments/${assignmentId}/submissions`, formData);
  },

  /**
   * Resubmit (upload a new version) for an existing submission
   */
  resubmitVersion: async (submissionId: string, file: File, aiInteractions?: AiInteraction[]) => {
    const formData = new FormData();
    formData.append('file', file);
    if (aiInteractions && aiInteractions.length > 0) {
      formData.append('aiInteractions', JSON.stringify(aiInteractions));
    }
    
    return await axiosClient.post(`/submissions/${submissionId}/versions`, formData);
  },

  /**
   * Finalize the submission
   */
  finalizeSubmission: async (submissionId: string) => {
    return await axiosClient.post(`/submissions/${submissionId}/finalize`);
  },

  /**
   * Withdraw/Delete a submission
   */
  withdrawSubmission: async (submissionId: string) => {
    return await axiosClient.delete(`/submissions/${submissionId}`);
  },

  // --- Lecturer Methods ---

  /**
   * Get all submissions for a specific assignment
   */
  getSubmissionsByAssignment: async (assignmentId: string) => {
    return await axiosClient.get(`/assignments/${assignmentId}/submissions`);
  },

  /**
   * Get a specific submission by its ID
   */
  getSubmissionById: async (submissionId: string) => {
    return await axiosClient.get(`/submissions/${submissionId}`);
  },

  /**
   * Download a specific submission version's file
   */
  downloadSubmissionVersion: async (versionId: string) => {
    return await axiosClient.get(`/submission-versions/${versionId}/download`, {
      responseType: 'blob'
    });
  }
};

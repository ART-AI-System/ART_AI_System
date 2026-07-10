import axiosClient from '../api/axiosClient';

export interface ReviewPayload {
  reviewStatus: 'pending' | 'reviewed' | 'needs_revision' | 'flagged';
  comment?: string;
}

export const reviewService = {
  getSubmissionOverview: async (classId: string) => {
    return axiosClient.get(`/lecturer/classes/${classId}/submission-overview`);
  },

  getReview: async (submissionId: string) => {
    return axiosClient.get(`/submissions/${submissionId}/review`);
  },

  createReview: async (submissionId: string, payload: ReviewPayload) => {
    return axiosClient.post(`/submissions/${submissionId}/review`, payload);
  },

  updateReviewStatus: async (submissionId: string, status: string) => {
    return axiosClient.patch(`/submissions/${submissionId}/review-status`, { reviewStatus: status });
  },

  addReviewComment: async (submissionId: string, comment: string) => {
    return axiosClient.post(`/submissions/${submissionId}/comments`, { comment });
  }
};

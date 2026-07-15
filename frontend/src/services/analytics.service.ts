import axiosClient from '../api/axiosClient';

export interface ChatApiResponse<T> {
  message: string;
  result: T;
}

export const analyticsService = {
  // Student Home
  getStudentHome: async () => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>('/student/home');
    return response.result;
  },
  getEnrolledSubjects: async (semesterId: string) => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>(`/student/semesters/${semesterId}/subjects`);
    return response.result;
  },
  getClassSessions: async (classId: string) => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>(`/student/classes/${classId}/sessions`);
    return response.result;
  },

  // Lecturer Analytics
  getLecturerHome: async () => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>('/lecturer/home');
    return response.result;
  },
  getClassOverview: async (classId: string) => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>(`/lecturer/classes/${classId}/overview`);
    return response.result;
  },
  getSubmissionStatistics: async (classId: string) => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>(`/lecturer/classes/${classId}/submission-statistics`);
    return response.result;
  },
  getAiStatistics: async (classId: string) => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>(`/lecturer/classes/${classId}/ai-statistics`);
    return response.result;
  },

  // Subject Head Analytics
  getSubjectHeadOverview: async () => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>('/subject-head/overview');
    return response.result;
  },
  getSubjectHeadClasses: async () => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>('/subject-head/classes');
    return response.result;
  },
  getSubjectHeadClassAnalytics: async (classId: string) => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>(`/subject-head/classes/${classId}/analytics`);
    return response.result;
  },
  getSubjectHeadSubjectAnalytics: async (subjectId: string) => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>(`/subject-head/subjects/${subjectId}/analytics`);
    return response.result;
  },
  getSubjectHeadStudentDetail: async (studentId: string) => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>(`/subject-head/students/${studentId}/detail`);
    return response.result;
  },
  getSubjectHeadLecturerAnalytics: async (lecturerId: string) => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>(`/subject-head/lecturers/${lecturerId}/analytics`);
    return response.result;
  },

  // Admin Dashboard
  getAdminDashboard: async () => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>('/admin/dashboard');
    return response.result;
  },
  getSystemActivity: async () => {
    const response = await axiosClient.get<any, ChatApiResponse<any>>('/admin/system-activity');
    return response.result;
  },
};

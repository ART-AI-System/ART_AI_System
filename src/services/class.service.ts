/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../api/axiosClient';
import type { UserApiResponse } from './user.service';
import type { 
  Class, 
  CreateClassDto, 
  UpdateClassDto 
} from '../types/class';

export const classService = {
  getClasses: async (): Promise<Class[]> => {
    const response = await axiosClient.get<any, UserApiResponse<Class[]>>('/classes');
    return response.result;
  },

  getClassById: async (id: string): Promise<Class> => {
    const response = await axiosClient.get<any, UserApiResponse<Class>>(`/classes/${id}`);
    return response.result;
  },

  addStudentToClass: async (classId: string, studentId: string): Promise<any> => {
    const response = await axiosClient.post<any, UserApiResponse<any>>(`/classes/${classId}/students`, { studentId });
    return response.result;
  },

  removeStudentFromClass: async (classId: string, studentId: string): Promise<any> => {
    const response = await axiosClient.delete<any, UserApiResponse<any>>(`/classes/${classId}/students/${studentId}`);
    return response.result;
  },

  promoteCohort: async (classId: string, targetSemesterId: string, assignments: { subjectId: string; lecturerId: string }[]): Promise<any> => {
    const response = await axiosClient.post<any, UserApiResponse<any>>(`/classes/${classId}/promote`, {
      targetSemesterId,
      assignments
    });
    return response.result;
  },

  importStudents: async (classId: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosClient.post<any, UserApiResponse<any>>(`/classes/${classId}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.result;
  },

  createClass: async (data: CreateClassDto): Promise<Class> => {
    const response = await axiosClient.post<any, UserApiResponse<Class>>('/classes', data);
    return response.result;
  },

  updateClass: async (id: string, data: UpdateClassDto): Promise<Class> => {
    const response = await axiosClient.put<any, UserApiResponse<Class>>(`/classes/${id}`, data);
    return response.result;
  },

  deleteClass: async (id: string): Promise<Class> => {
    const response = await axiosClient.delete<any, UserApiResponse<Class>>(`/classes/${id}`);
    return response.result;
  },

  getStudentHome: async (): Promise<any> => {
    const response = await axiosClient.get<any, UserApiResponse<any>>('/student/home');
    return response.result;
  },

  getLecturerHome: async (): Promise<any> => {
    const response = await axiosClient.get<any, UserApiResponse<any>>('/lecturer/home');
    return response.result;
  }
};

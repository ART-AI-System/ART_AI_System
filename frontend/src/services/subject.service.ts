/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../api/axiosClient';
import type { UserApiResponse } from './user.service';
import type { 
  Subject, 
  CreateSubjectDto, 
  UpdateSubjectDto 
} from '../types/subject';

export const subjectService = {
  getSubjects: async (): Promise<Subject[]> => {
    const response = await axiosClient.get<any, UserApiResponse<Subject[]>>('/subjects');
    return response.result;
  },

  getSubjectById: async (id: string): Promise<Subject> => {
    const response = await axiosClient.get<any, UserApiResponse<Subject>>(`/subjects/${id}`);
    return response.result;
  },

  createSubject: async (data: CreateSubjectDto): Promise<Subject> => {
    const response = await axiosClient.post<any, UserApiResponse<Subject>>('/subjects', data);
    return response.result;
  },

  updateSubject: async (id: string, data: UpdateSubjectDto): Promise<Subject> => {
    const response = await axiosClient.put<any, UserApiResponse<Subject>>(`/subjects/${id}`, data);
    return response.result;
  },

  toggleStatus: async (id: string): Promise<Subject> => {
    const response = await axiosClient.patch<any, UserApiResponse<Subject>>(`/subjects/${id}/status`);
    return response.result;
  }
};

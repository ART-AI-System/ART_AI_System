/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../api/axiosClient';
import type { UserApiResponse } from './user.service';
import type { 
  Semester, 
  CreateSemesterDto, 
  UpdateSemesterDto 
} from '../types/semester';

export const semesterService = {
  getSemesters: async (): Promise<Semester[]> => {
    const response = await axiosClient.get<any, UserApiResponse<Semester[]>>('/semesters');
    return response.result;
  },

  getCurrentSemester: async (): Promise<Semester> => {
    const response = await axiosClient.get<any, UserApiResponse<Semester>>('/semesters/current');
    return response.result;
  },

  getSemesterById: async (id: string): Promise<Semester> => {
    const response = await axiosClient.get<any, UserApiResponse<Semester>>(`/semesters/${id}`);
    return response.result;
  },

  createSemester: async (data: CreateSemesterDto): Promise<Semester> => {
    const response = await axiosClient.post<any, UserApiResponse<Semester>>('/semesters', data);
    return response.result;
  },

  updateSemester: async (id: string, data: UpdateSemesterDto): Promise<Semester> => {
    const response = await axiosClient.put<any, UserApiResponse<Semester>>(`/semesters/${id}`, data);
    return response.result;
  },

  setAsCurrent: async (id: string): Promise<Semester> => {
    const response = await axiosClient.patch<any, UserApiResponse<Semester>>(`/semesters/${id}/current`);
    return response.result;
  },

  toggleStatus: async (id: string): Promise<Semester> => {
    const response = await axiosClient.patch<any, UserApiResponse<Semester>>(`/semesters/${id}/status`);
    return response.result;
  }
};

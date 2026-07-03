import axiosClient from '../api/axiosClient';
import type { UserApiResponse } from './user.service';

export interface Semester {
  _id: string;
  code: string;
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSemesterDto {
  code: string;
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}

export interface UpdateSemesterDto extends Partial<CreateSemesterDto> {
  isActive?: boolean;
}

export const semesterService = {
  getSemesters: async (): Promise<Semester[]> => {
    const response = await axiosClient.get<unknown, UserApiResponse<Semester[]>>('/semesters');
    return response.result;
  },

  getCurrentSemester: async (): Promise<Semester> => {
    const response = await axiosClient.get<unknown, UserApiResponse<Semester>>('/semesters/current');
    return response.result;
  },

  getSemesterById: async (id: string): Promise<Semester> => {
    const response = await axiosClient.get<unknown, UserApiResponse<Semester>>(`/semesters/${id}`);
    return response.result;
  },

  createSemester: async (data: CreateSemesterDto): Promise<Semester> => {
    const response = await axiosClient.post<unknown, UserApiResponse<Semester>>('/semesters', data);
    return response.result;
  },

  updateSemester: async (id: string, data: UpdateSemesterDto): Promise<Semester> => {
    const response = await axiosClient.put<unknown, UserApiResponse<Semester>>(`/semesters/${id}`, data);
    return response.result;
  },

  setAsCurrent: async (id: string): Promise<Semester> => {
    const response = await axiosClient.patch<unknown, UserApiResponse<Semester>>(`/semesters/${id}/current`);
    return response.result;
  },

  toggleStatus: async (id: string): Promise<Semester> => {
    const response = await axiosClient.patch<unknown, UserApiResponse<Semester>>(`/semesters/${id}/status`);
    return response.result;
  }
};

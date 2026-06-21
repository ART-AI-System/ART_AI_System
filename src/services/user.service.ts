/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../api/axiosClient';
import type { 
  User, 
  UserListParams, 
  UserListResponse, 
  CreateUserDto, 
  UpdateUserDto, 
  ChangeStatusDto, 
  ChangeRoleDto, 
  ResetPasswordDto 
} from '../types/user';
// The backend returns responses like { message: "...", result: { ... } }
// We assume axiosClient is intercepting or we can extract `result` properly.
// Based on the spec: "Always use: response.data.result. Do not assume: response.data.data"
// Our axiosClient returns `response.data` in the interceptor.
// So `await axiosClient.get()` returns `{ message, result }`.
// Wait, authApi uses ApiResponse which has `data`. Let's define a new interface for user response.

export interface UserApiResponse<T> {
  message: string;
  result: T;
}

export const userService = {
  getMe: async (): Promise<User> => {
    const response = await axiosClient.get<any, UserApiResponse<User>>('/users/me');
    return response.result;
  },

  updateMe: async (data: UpdateUserDto): Promise<User> => {
    const response = await axiosClient.patch<any, UserApiResponse<User>>('/users/me', data);
    return response.result;
  },

  getUsers: async (params: UserListParams): Promise<UserListResponse> => {
    const response = await axiosClient.get<any, UserApiResponse<UserListResponse>>('/users', { params });
    return response.result;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await axiosClient.get<any, UserApiResponse<User>>(`/users/${id}`);
    return response.result;
  },

  createUser: async (data: CreateUserDto): Promise<User> => {
    const response = await axiosClient.post<any, UserApiResponse<User>>('/users', data);
    return response.result;
  },

  updateUser: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await axiosClient.put<any, UserApiResponse<User>>(`/users/${id}`, data);
    return response.result;
  },

  changeStatus: async (id: string, data: ChangeStatusDto): Promise<User> => {
    const response = await axiosClient.patch<any, UserApiResponse<User>>(`/users/${id}/status`, data);
    return response.result;
  },

  changeRole: async (id: string, data: ChangeRoleDto): Promise<User> => {
    const response = await axiosClient.patch<any, UserApiResponse<User>>(`/users/${id}/role`, data);
    return response.result;
  },

  resetPassword: async (id: string, data?: ResetPasswordDto): Promise<any> => {
    const response = await axiosClient.patch<any, UserApiResponse<any>>(`/users/${id}/reset-password`, data || {});
    return response.result;
  },

  deleteUser: async (id: string): Promise<User> => {
    const response = await axiosClient.delete<any, UserApiResponse<User>>(`/users/${id}`);
    return response.result;
  },

  importUsers: async (formData: FormData): Promise<any> => {
    const response = await axiosClient.post<any, UserApiResponse<any>>('/users/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.result;
  }
};

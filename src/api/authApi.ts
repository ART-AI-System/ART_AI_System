import axiosClient from './axiosClient';
import type { User } from '../mocks/mockDatabase'; // We'll reuse the User interface for now

// Common Response format as defined in your spec
export interface ApiResponse<T> {
  message: string;
  data: T;
  meta?: any;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  /**
   * Login using studentCode or staff username
   */
  login: (loginId: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    // Detect if input is a student code (e.g., SE12345) or a username (e.g., lecturer01)
    // Typical student code: 2 letters followed by digits.
    const isStudentCode = /^[a-zA-Z]{2}\d+$/.test(loginId);
    
    const payload: any = { password: password };
    if (isStudentCode) {
      payload.studentCode = loginId;
    } else {
      payload.username = loginId;
    }

    return axiosClient.post('/auth/login', payload);
  },

  /**
   * Future Auth Endpoints
   */
  // register: (data) => axiosClient.post('/auth/register/student', data),
  // refreshToken: () => axiosClient.post('/auth/refresh-token'),
  // logout: () => axiosClient.post('/auth/logout'),
};

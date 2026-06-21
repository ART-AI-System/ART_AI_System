export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  studentCode?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  role?: string;
  isActive?: boolean | string;
  search?: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateUserDto {
  fullName: string;
  email: string;
  password?: string;
  role: string;
  studentCode?: string;
}

export interface UpdateUserDto {
  fullName?: string;
  email?: string;
  studentCode?: string;
}

export interface ChangeStatusDto {
  isActive: boolean;
}

export interface ChangeRoleDto {
  role: string;
}

export interface ResetPasswordDto {
  newPassword?: string; // Sometimes the backend auto-generates, or we might need to pass one. Let's make it optional.
}

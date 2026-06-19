import { mockDatabase } from './mockDatabase';
import type { User, Semester, Class, Session, Assignment, News } from './mockDatabase';

// --- Types ---

export interface CommonMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface CommonResponse<T> {
  message: string;
  data: T;
  meta?: CommonMeta;
}

export interface CommonError {
  message: string;
  errors: { field: string; message: string }[];
  stack?: string;
}

export interface EnrolledClass extends Class {
  subjectCode: string;
  subjectName: string;
  lecturerName: string;
}

export interface StudentHomeData {
  currentSemester: Semester | null;
  enrolledClasses: EnrolledClass[];
}

// --- Helper ---

/**
 * 1. Hàm Generic Helper wrapResponse
 * Bọc dữ liệu trả về theo đúng cấu trúc Common Response Format { message, data, meta }
 * Kèm theo độ trễ mạng 300ms bằng setTimeout.
 */
export function wrapResponse<T>(data: T, message: string = 'Success', meta?: CommonMeta): Promise<CommonResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const response: CommonResponse<T> = { message, data };
      if (meta) {
        response.meta = meta;
      }
      resolve(response);
    }, 300);
  });
}

/**
 * Helper để mô phỏng lỗi chuẩn API (Common Error Format)
 */
export function rejectResponse(errorMsg: string, errors: { field: string; message: string }[] = []): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      const error: CommonError = {
        message: errorMsg,
        errors,
        stack: 'Error stack trace in development only'
      };
      reject(error);
    }, 300);
  });
}

// --- API Mock Modules ---

/**
 * 2. Hàm login (Module 1.3)
 */
export const login = async (studentCode: string, password: string): Promise<CommonResponse<{ user: User; accessToken: string; refreshToken: string }>> => {
  const user = mockDatabase.users.find(u => u.studentCode === studentCode);

  if (!user) {
    return rejectResponse('Validation error', [{ field: 'studentCode', message: 'Student code not found' }]);
  }

  if (password !== 'Password@123' && password !== 'pass') {
    return rejectResponse('Validation error', [{ field: 'password', message: 'Incorrect password' }]);
  }

  const mockAccessToken = `jwt_access_token_${user.id}`;
  const mockRefreshToken = `jwt_refresh_token_${user.id}`;

  // Lưu token vào localStorage theo yêu cầu
  localStorage.setItem('accessToken', mockAccessToken);

  return wrapResponse({
    user,
    accessToken: mockAccessToken,
    refreshToken: mockRefreshToken
  }, 'Login successfully');
};

/**
 * 3. Hàm getStudentHome (Module 3 - Academic)
 * Lấy thông tin học kỳ hiện tại và danh sách các lớp học đã được map đầy đủ thông tin.
 */
export const getStudentHome = async (): Promise<CommonResponse<StudentHomeData>> => {
  // Tìm học kỳ hiện tại (active)
  const currentSemester = mockDatabase.semesters.find(s => s.status === 'active') || null;

  let enrolledClasses: EnrolledClass[] = [];

  if (currentSemester) {
    // Lấy các lớp học thuộc học kỳ hiện tại
    const classesInSemester = mockDatabase.classes.filter(c => c.semesterId === currentSemester.id);
    
    // Map thêm thông tin Subject và Lecturer
    enrolledClasses = classesInSemester.map(c => {
      const subject = mockDatabase.subjects.find(s => s.id === c.subjectId);
      const lecturer = mockDatabase.users.find(u => u.id === c.lecturerId);

      return {
        ...c,
        subjectCode: subject?.code || 'UNKNOWN',
        subjectName: subject?.name || 'Unknown Subject',
        lecturerName: lecturer?.fullName || 'Unknown Lecturer',
      };
    });
  }

  return wrapResponse({
    currentSemester,
    enrolledClasses
  });
};

/**
 * 4. Hàm getClassSessions (Module 4.1 - Session)
 * Trả về danh sách các Slot học tương ứng với classId kèm pagination mẫu.
 */
export const getClassSessions = async (classId: string): Promise<CommonResponse<Session[]>> => {
  const sessions = mockDatabase.sessions.filter(s => s.classId === classId);
  
  const meta: CommonMeta = {
    page: 1,
    limit: 10,
    totalItems: sessions.length,
    totalPages: 1
  };

  return wrapResponse(sessions, 'Success', meta);
};

/**
 * 5. Hàm getAssignmentDetail (Module 5.1 - Assignment)
 * Trả về thông tin chi tiết bài tập theo id.
 */
export const getAssignmentDetail = async (id: string): Promise<CommonResponse<Assignment>> => {
  const assignment = mockDatabase.assignments.find(a => a.id === id);
  
  if (!assignment) {
    return rejectResponse('Validation error', [{ field: 'id', message: 'Assignment not found' }]);
  }

  return wrapResponse(assignment);
};

/**
 * 6. Hàm getNews (Module 14 - News)
 * Trả về danh sách bảng tin.
 */
export const getNews = async (): Promise<CommonResponse<News[]>> => {
  const sortedNews = [...mockDatabase.news].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const meta: CommonMeta = {
    page: 1,
    limit: 10,
    totalItems: sortedNews.length,
    totalPages: 1
  };

  return wrapResponse(sortedNews, 'Success', meta);
};

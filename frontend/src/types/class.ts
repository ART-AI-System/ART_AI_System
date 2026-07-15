/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Class {
  _id: string;
  classCode: string;
  semesterId: string;
  subjectId: string;
  subjectSnapshot: {
    subjectId: string;
    code: string;
    name: string;
  };
  lecturer: {
    lecturerId: string;
    fullName: string;
    email: string;
  };
  isActive: boolean;
  students?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClassDto {
  classCode: string;
  semesterId: string;
  subjectId: string;
  subjectSnapshot: {
    subjectId: string;
    code: string;
    name: string;
  };
  lecturer: {
    lecturerId: string;
    fullName: string;
    email: string;
  };
}

export interface UpdateClassDto extends Partial<CreateClassDto> {
  isActive?: boolean;
}

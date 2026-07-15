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

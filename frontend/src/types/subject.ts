export interface Subject {
  _id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubjectDto {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateSubjectDto extends Partial<CreateSubjectDto> {
  isActive?: boolean;
}

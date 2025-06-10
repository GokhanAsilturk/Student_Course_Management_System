export interface UserNested {
  username: string;
  email: string;
  role: 'admin' | 'student';
  firstName: string;
  lastName: string;
}

export interface Student {
  id: string;
  userId: string;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
  user: UserNested;
  status?: 'active' | 'inactive' | 'graduated' | 'suspended';
  isActive?: boolean;
}

export interface CreateStudentRequest {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface UpdateStudentRequest extends Partial<CreateStudentRequest> {
  isActive?: boolean;
  birthDate?: string; // Update sırasında da gönderilebilir
  status?: 'active' | 'inactive' | 'graduated' | 'suspended';
}

export interface StudentFilters {
  search?: string;
  isActive?: boolean;
  enrollmentDateFrom?: string;
  enrollmentDateTo?: string;
}

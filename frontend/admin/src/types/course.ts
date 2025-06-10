export interface Course {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseRequest {
  name: string;
  description?: string;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
}

export interface CourseFilters {
  search?: string;
  name?: string;
}

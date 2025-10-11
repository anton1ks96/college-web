export interface StudentInfo {
  id: string;
  username: string;
}

export interface StudentSearchResponse {
  students: StudentInfo[];
  total: number;
}

export interface CreateTopicRequest {
  title: string;
  description: string;
  students: StudentInfo[];
}

export interface CreateTopicResponse {
  id: string;
  title: string;
  description: string;
  created_at: string;
  message: string;
}

export interface TeacherTopic {
  id: string;
  title: string;
  description: string;
  created_by: string;
  created_by_id: string;
  created_at: string;
  updated_at: string;
  student_count?: number;
  students?: StudentInfo[];
}

export interface TeacherTopicsResponse {
  topics: TeacherTopic[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AddStudentsRequest {
  students: StudentInfo[];
}

export interface AddStudentsResponse {
  message: string;
  added_count: number;
}

export interface TopicStudentsResponse {
  students: Array<{
    id: string;
    student: {
      id: string;
      username: string;
    };
    assigned_at: string;
  }>;
}

export interface TeacherInfo {
  id: string;
  username: string;
}

export interface TeacherSearchResponse {
  teachers: TeacherInfo[];
  total: number;
}

export interface DatasetPermission {
  id: string;
  teacher_id: string;
  teacher_name: string;
  granted_by: string;
  granted_at: string;
}

export interface GrantDatasetPermissionRequest {
  teacher_id: string;
  teacher_name: string;
}

export interface DatasetPermissionsResponse {
  permissions: DatasetPermission[];
}

export interface AllDatasetPermission {
  id: string;
  dataset_id: string;
  dataset_title?: string | null;
  teacher_id: string;
  teacher_name: string;
  granted_by: string;
  granted_at: string;
}

export interface AllPermissionsResponse {
  permissions: AllDatasetPermission[];
  total: number;
}
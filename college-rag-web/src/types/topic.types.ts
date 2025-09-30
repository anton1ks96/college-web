export interface Topic {
  id: string;
  title: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TopicAssignment {
  id: string;
  topic_id: string;
  student_id: string;
  student_name: string;
  assigned_by: string;
  assigned_at: string;
}

export interface TopicWithAssignment {
  id: string;
  topic: Topic;
  assignment_id: string;
  assigned_at: string;
  has_dataset: boolean;
}

export interface GetAssignedTopicsResponse {
  assignments: TopicWithAssignment[];
}

export interface TopicDetailResponse {
  assignment: TopicWithAssignment;
}
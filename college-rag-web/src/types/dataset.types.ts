export interface Dataset {
  id: string;
  title: string;
  content?: string;
  author?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  indexed_at?: string | null;
}

export interface DatasetListResponse {
  datasets: Dataset[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateDatasetResponse {
  dataset_id: string;
  title: string;
  created_at: string;
  message: string;
}

export interface CreateDatasetForm {
  title: string;
  content: string;
  assignmentId?: string;
}

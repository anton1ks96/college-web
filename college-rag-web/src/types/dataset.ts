export interface Dataset {
  id: string;
  title: string;
  createdAt: string;
  created_at?: string; // Alternative field name
  indexed: boolean;
  is_indexed?: boolean; // Alternative field name
  selected?: boolean;
}

export interface CreateDatasetRequest {
  title: string;
  description?: string;
}

export interface UpdateDatasetRequest {
  title?: string;
  description?: string;
}

export interface DatasetError {
  message: string;
  status?: number;
}
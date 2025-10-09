import {coreAPI} from "../api/client";
import type {CreateDatasetResponse, Dataset, DatasetListResponse,} from "../types/dataset.types";

class DatasetService {
  async createDataset(
    title: string,
    content: string,
    assignmentId?: string,
  ): Promise<CreateDatasetResponse> {
    const blob = new Blob([content], { type: "text/markdown" });
    const file = new File(
      [blob],
      `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`,
      {
        type: "text/markdown",
        lastModified: Date.now(),
      },
    );

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    if (assignmentId) {
      formData.append("assignment_id", assignmentId);
    }

    const response = await coreAPI.post<CreateDatasetResponse>(
      "/api/v1/datasets",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  }

  async getDatasets(
    page: number = 1,
    limit: number = 20,
  ): Promise<DatasetListResponse> {
    const response = await coreAPI.get<DatasetListResponse>(
      "/api/v1/datasets",
      {
        params: { page, limit },
      },
    );
    return response.data;
  }

  async getDataset(id: string): Promise<Dataset> {
    const response = await coreAPI.get<Dataset>(`/api/v1/datasets/${id}`);
    return response.data;
  }

  async deleteDataset(id: string): Promise<void> {
    await coreAPI.delete(`/api/v1/datasets/${id}`);
  }

  async updateDataset(
    id: string,
    title: string,
    content: string,
  ): Promise<Dataset> {
    const response = await coreAPI.put<Dataset>(
      `/api/v1/datasets/${id}`,
      {
        title,
        content
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  }

  async reindexDataset(id: string): Promise<void> {
      await coreAPI.post(`/api/v1/datasets/${id}/reindex`);
  }
}

export const datasetService = new DatasetService();

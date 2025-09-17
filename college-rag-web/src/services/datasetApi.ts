import type {Dataset, CreateDatasetRequest, UpdateDatasetRequest} from "../types/dataset";
import {getAccessToken} from "../utils/cookies.ts";

const DATASETS_API_BASE_URL = "http://localhost:8081";

export const datasetApi = {
    async getDatasets(): Promise<Dataset[]> {
        const accessToken = getAccessToken();
        if (!accessToken) {
            throw new Error("No access token found");
        }

        const response = await fetch(`${DATASETS_API_BASE_URL}/api/v1/datasets`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return [];
            }
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data.datasets || [];
    },

    async getDataset(id: string): Promise<Dataset> {
        const accessToken = getAccessToken();
        if (!accessToken) {
            throw new Error("No access token found");
        }

        const response = await fetch(`${DATASETS_API_BASE_URL}/api/v1/datasets/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
    },

    async createDataset(dataset: CreateDatasetRequest): Promise<Dataset> {
        const accessToken = getAccessToken();
        if (!accessToken) {
            throw new Error("No access token found");
        }

        const response = await fetch(`${DATASETS_API_BASE_URL}/api/v1/datasets`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(dataset),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
    },

    async updateDataset(id: string, updates: UpdateDatasetRequest): Promise<Dataset> {
        const accessToken = getAccessToken();
        if (!accessToken) {
            throw new Error("No access token found");
        }

        const response = await fetch(`${DATASETS_API_BASE_URL}/api/v1/datasets/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(updates),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
    },

    async deleteDataset(id: string): Promise<void> {
        const accessToken = getAccessToken();
        if (!accessToken) {
            throw new Error("No access token found");
        }

        const response = await fetch(`${DATASETS_API_BASE_URL}/api/v1/datasets/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
    },

    async reindexDataset(id: string): Promise<void> {
        const accessToken = getAccessToken();
        if (!accessToken) {
            throw new Error("No access token found");
        }

        const response = await fetch(`${DATASETS_API_BASE_URL}/api/v1/datasets/${id}/reindex`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
    },
};
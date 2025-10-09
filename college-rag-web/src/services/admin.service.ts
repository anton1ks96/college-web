import {coreAPI} from '../api/client';
import type {TeacherTopicsResponse} from '../types/teacher.types';
import type {DatasetListResponse} from '../types/dataset.types';

export interface AdminStats {
  usersCount: number;
  teachersCount: number;
  studentsCount: number;
  topicsCount: number;
  datasetsCount: number;
}

class AdminService {
  async getStats(): Promise<AdminStats> {
    // Получаем данные параллельно
    const [topicsRes, datasetsRes] = await Promise.all([
      this.getAllTopics(1, 1000), // Получаем большой лимит чтобы посчитать всех преподавателей
      this.getAllDatasets(1, 1000) // Получаем большой лимит чтобы посчитать всех студентов
    ]);

    // Считаем уникальных преподавателей по имени
    const uniqueTeacherNames = new Set(
      topicsRes.topics.map(topic => topic.created_by)
    );

    // Считаем уникальных студентов по user_id из датасетов
    const uniqueStudentIds = new Set(
      datasetsRes.datasets.map(dataset => dataset.user_id)
    );

    // Также добавляем студентов из тем, которые могут не иметь датасетов
    topicsRes.topics.forEach(topic => {
      if (topic.students) {
        topic.students.forEach(student => {
          uniqueStudentIds.add(student.id);
        });
      }
    });

    return {
      usersCount: 0, // TODO: добавить endpoint для подсчета пользователей
      teachersCount: uniqueTeacherNames.size,
      studentsCount: uniqueStudentIds.size,
      topicsCount: topicsRes.total,
      datasetsCount: datasetsRes.total
    };
  }

  async getAllTopics(page: number = 1, limit: number = 20): Promise<TeacherTopicsResponse> {
    const response = await coreAPI.get<TeacherTopicsResponse>(
      '/api/v1/topics/all',
      {
        params: { page, limit }
      }
    );
    return response.data;
  }

  async getAllDatasets(page: number = 1, limit: number = 20): Promise<DatasetListResponse> {
    const response = await coreAPI.get<DatasetListResponse>(
      '/api/v1/datasets',
      {
        params: { page, limit }
      }
    );
    return response.data;
  }

  async deleteTopic(topicId: string): Promise<void> {
    await coreAPI.delete(`/api/v1/topics/${topicId}`);
  }

  async deleteDataset(datasetId: string): Promise<void> {
    await coreAPI.delete(`/api/v1/datasets/${datasetId}`);
  }
}

export const adminService = new AdminService();

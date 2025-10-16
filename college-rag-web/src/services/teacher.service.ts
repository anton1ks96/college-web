import {coreAPI} from '../api/client';
import type {
    AddStudentsRequest,
    AddStudentsResponse,
    CreateTopicRequest,
    CreateTopicResponse,
    StudentSearchResponse,
    TeacherTopic,
    TeacherTopicsResponse,
    TopicStudentsResponse
} from '../types/teacher.types';

class TeacherService {
  async searchStudents(query: string): Promise<StudentSearchResponse> {
    const response = await coreAPI.post<StudentSearchResponse>(
      '/api/v1/search/students',
      { query }
    );
    return response.data;
  }

  async createTopic(data: CreateTopicRequest): Promise<CreateTopicResponse> {
    const response = await coreAPI.post<CreateTopicResponse>(
      '/api/v1/topics',
      data
    );
    return response.data;
  }

  async getMyTopics(page: number = 1, limit: number = 20): Promise<TeacherTopicsResponse> {
    const response = await coreAPI.get<TeacherTopicsResponse>(
      '/api/v1/topics',
      {
        params: { page, limit }
      }
    );
    return response.data;
  }

  async getTopicDetails(topicId: string): Promise<TeacherTopic> {
    const response = await coreAPI.get<TeacherTopic>(
      `/api/v1/topics/${topicId}`
    );
    return response.data;
  }

  async addStudentsToTopic(topicId: string, students: AddStudentsRequest): Promise<AddStudentsResponse> {
    const response = await coreAPI.post<AddStudentsResponse>(
      `/api/v1/topics/${topicId}/students`,
      students
    );
    return response.data;
  }

  async getTopicStudents(topicId: string): Promise<TopicStudentsResponse> {
    const response = await coreAPI.get<TopicStudentsResponse>(
      `/api/v1/topics/${topicId}/students`
    );
    return response.data;
  }

  async removeStudentFromTopic(topicId: string, studentId: string): Promise<void> {
    await coreAPI.delete(`/api/v1/topics/${topicId}/students/${studentId}`);
  }

  // Переиспользуем метод для получения датасетов студентов
  async getStudentDatasets(page: number = 1, limit: number = 20) {
    const response = await coreAPI.get(
      '/api/v1/datasets/students',
      {
        params: { page, limit }
      }
    );
    return response.data;
  }
}

export const teacherService = new TeacherService();
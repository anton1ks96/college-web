import { coreAPI } from '../api/client';
import type {GetAssignedTopicsResponse, TopicDetailResponse} from '../types/topic.types';

class TopicService {
  async getAssignedTopics(): Promise<GetAssignedTopicsResponse> {
    const response = await coreAPI.get<GetAssignedTopicsResponse>('/api/v1/topics/assigned');
    return response.data;
  }

  async getTopicDetails(topicId: string): Promise<TopicDetailResponse> {
    const response = await coreAPI.get<TopicDetailResponse>(`/topics/${topicId}`);
    return response.data;
  }
}

export const topicService = new TopicService();
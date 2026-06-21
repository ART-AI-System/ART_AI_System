import axiosClient from '../api/axiosClient';
import type { ChatRoom, ChatMessage, ChatUser } from '../types/chat';

export interface ChatApiResponse<T> {
  message: string;
  result: T;
}

export const chatService = {
  getContacts: async (): Promise<ChatUser[]> => {
    const response = await axiosClient.get<any, ChatApiResponse<ChatUser[]>>('/chat/contacts');
    return response.result;
  },

  getRooms: async (): Promise<ChatRoom[]> => {
    const response = await axiosClient.get<any, ChatApiResponse<ChatRoom[]>>('/chat/rooms');
    return response.result;
  },

  getRoom: async (roomId: string): Promise<ChatRoom> => {
    const response = await axiosClient.get<any, ChatApiResponse<ChatRoom>>(`/chat/rooms/${roomId}`);
    return response.result;
  },

  createRoom: async (memberIds: string[], type: 'direct' | 'group' = 'direct'): Promise<ChatRoom> => {
    const response = await axiosClient.post<any, ChatApiResponse<ChatRoom>>('/chat/rooms', { memberIds, type });
    return response.result;
  },

  archiveRoom: async (roomId: string): Promise<any> => {
    const response = await axiosClient.patch<any, ChatApiResponse<any>>(`/chat/rooms/${roomId}/archive`);
    return response.result;
  },

  getMessages: async (roomId: string, page = 1, limit = 50): Promise<ChatMessage[]> => {
    const response = await axiosClient.get<any, ChatApiResponse<ChatMessage[]>>(`/chat/rooms/${roomId}/messages`, {
      params: { page, limit }
    });
    return response.result;
  },

  sendMessage: async (roomId: string, content: string, messageType: string = 'text', fileMetadata?: any): Promise<ChatMessage> => {
    const response = await axiosClient.post<any, ChatApiResponse<ChatMessage>>(`/chat/rooms/${roomId}/messages`, {
      content,
      messageType,
      fileMetadata
    });
    return response.result;
  },

  markRead: async (messageId: string): Promise<any> => {
    const response = await axiosClient.patch<any, ChatApiResponse<any>>(`/chat/messages/${messageId}/read`);
    return response; // Return full since it might not have 'result' wrapper
  },

  deleteMessage: async (messageId: string): Promise<any> => {
    const response = await axiosClient.delete<any, ChatApiResponse<any>>(`/chat/messages/${messageId}`);
    return response;
  },

  searchMessages: async (q: string, page = 1, limit = 20): Promise<ChatMessage[]> => {
    const response = await axiosClient.get<any, ChatApiResponse<ChatMessage[]>>('/chat/messages/search', {
      params: { q, page, limit }
    });
    return response.result;
  },

  searchGlobalUsers: async (query: string): Promise<ChatUser[]> => {
    if (!query) return [];
    const response = await axiosClient.get<any, ChatApiResponse<ChatUser[]>>('/chat/search-users', {
      params: { q: query }
    });
    return response.result;
  }
};

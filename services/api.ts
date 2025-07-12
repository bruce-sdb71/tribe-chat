import { ServerInfo, TMessage, TParticipant } from '../types/chat';

const BASE_URL = 'https://dummy-chat-server.tribechat.com/api';

class ChatAPI {
  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.log(`API Error for ${url}:`, error);
      throw error;
    }
  }

  async getServerInfo(): Promise<ServerInfo> {
    return this.fetchWithErrorHandling<ServerInfo>('/info');
  }

  async getAllMessages(): Promise<TMessage[]> {
    return this.fetchWithErrorHandling<TMessage[]>('/messages/all');
  }

  async getLatestMessages(): Promise<TMessage[]> {
    return this.fetchWithErrorHandling<TMessage[]>('/messages/latest');
  }

  async getOlderMessages(refMessageUuid: string): Promise<TMessage[]> {
    return this.fetchWithErrorHandling<TMessage[]>(`/messages/older/${refMessageUuid}`);
  }

  async getMessageUpdates(time: number): Promise<TMessage[]> {
    return this.fetchWithErrorHandling<TMessage[]>(`/messages/updates/${time}`);
  }

  async sendMessage(text: string): Promise<TMessage> {
    return this.fetchWithErrorHandling<TMessage>('/messages/new', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async getAllParticipants(): Promise<TParticipant[]> {
    return this.fetchWithErrorHandling<TParticipant[]>('/participants/all');
  }

  async getParticipantUpdates(time: number): Promise<TParticipant[]> {
    return this.fetchWithErrorHandling<TParticipant[]>(`/participants/updates/${time}`);
  }
}

export const chatAPI = new ChatAPI();
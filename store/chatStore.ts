import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { chatAPI } from "../services/api";
import { ChatState } from "../types/chat";

interface ChatActions {
  initializeChat: () => Promise<void>;
  loadMessages: () => Promise<void>;
  loadOlderMessages: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  updateMessages: () => Promise<void>;
  updateParticipants: () => Promise<void>;
  clearData: () => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState & ChatActions>()(
  persist(
    (set, get) => ({
      // State
      messages: [],
      participants: [],
      sessionUuid: null,
      lastUpdateTime: 0,
      isLoading: false,
      error: null,

      // Actions
      initializeChat: async () => {
        set({ isLoading: true, error: null });

        try {
          // Check server info
          const serverInfo = await chatAPI.getServerInfo();
          const currentState = get();

          // Clear data if session changed
          if (
            currentState.sessionUuid &&
            currentState.sessionUuid !== serverInfo.sessionUuid
          ) {
            get().clearData();
          }

          set({ sessionUuid: serverInfo.sessionUuid });

          // Load initial data
          await Promise.all([get().loadMessages(), get().updateParticipants()]);
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to initialize chat",
          });
        } finally {
          set({ isLoading: false });
        }
      },

      loadMessages: async () => {
        try {
          const messages = await chatAPI.getLatestMessages();
          set({
            messages: messages.sort((a, b) => a.sentAt - b.sentAt),
            lastUpdateTime: Date.now(),
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to load messages",
          });
        }
      },

      loadOlderMessages: async () => {
        const { messages } = get();
        if (messages.length === 0) return;

        try {
          const oldestMessage = messages[0];
          const olderMessages = await chatAPI.getOlderMessages(
            oldestMessage.uuid
          );

          if (olderMessages.length > 0) {
            const sortedOlderMessages = olderMessages.sort(
              (a, b) => a.sentAt - b.sentAt
            );
            set({
              messages: [...sortedOlderMessages, ...messages],
            });
          }
        } catch (error) {
          console.error("Failed to load older messages:", error);
        }
      },

      sendMessage: async (text: string) => {
        try {
          const newMessage = await chatAPI.sendMessage(text);
          const { messages } = get();
          set({
            messages: [...messages, newMessage].sort(
              (a, b) => a.sentAt - b.sentAt
            ),
          });
        } catch (error) {
          set({ 
            error:
              error instanceof Error ? error.message : "Failed to send message",
          });
        }
      },

      updateMessages: async () => {
        const { lastUpdateTime } = get();
        try {
          const updatedMessages = await chatAPI.getMessageUpdates(
            lastUpdateTime
          );
          if (updatedMessages.length > 0) {
            const { messages } = get();
            const messageMap = new Map(messages.map((msg) => [msg.uuid, msg]));

            updatedMessages.forEach((updatedMsg) => {
              messageMap.set(updatedMsg.uuid, updatedMsg);
            });

            set({
              messages: Array.from(messageMap.values()).sort(
                (a, b) => a.sentAt - b.sentAt
              ),
              lastUpdateTime: Date.now(),
            });
          }
        } catch (error) {
          console.error("Failed to update messages:", error);
        }
      },

      updateParticipants: async () => {
        const { lastUpdateTime } = get();
        try {
          const participants =
            lastUpdateTime === 0
              ? await chatAPI.getAllParticipants()
              : await chatAPI.getParticipantUpdates(lastUpdateTime);

          if (participants.length > 0) {
            const { participants: currentParticipants } = get();
            const participantMap = new Map(
              currentParticipants.map((p) => [p.uuid, p])
            );

            participants.forEach((participant) => {
              participantMap.set(participant.uuid, participant);
            });

            set({ participants: Array.from(participantMap.values()) });
          }
        } catch (error) {
          console.error("Failed to update participants:", error);
        }
      },

      clearData: () => {
        set({
          messages: [],
          participants: [],
          sessionUuid: null,
          lastUpdateTime: 0,
          error: null,
        });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: "tribe-chat-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        messages: state.messages,
        participants: state.participants,
        sessionUuid: state.sessionUuid,
        lastUpdateTime: state.lastUpdateTime,
      }),
    }
  )
);

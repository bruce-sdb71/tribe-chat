// Type definitions based on the API specification

export interface ServerInfo {
  sessionUuid: string;
  apiVersion: number;
}

export interface ChatState {
  messages: TMessage[];
  participants: TParticipant[];
  sessionUuid: string | null;
  lastUpdateTime: number;
  isLoading: boolean;
  error: string | null;
}

export type TMessageAttachment = {
  uuid: string;
  type: "image";
  url: string;
  width: number;
  height: number;
};

export type TReaction = {
  uuid: string;
  participantUuid: string;
  value: string;
};

export type TParticipant = {
  uuid: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  email?: string;
  jobTitle?: string;
  createdAt: number;
  updatedAt: number;
};


export type TMessage = {
  uuid: string;
  text: string;
  attachments: TMessageAttachment[];
  replyToMessage: TMessage;
  reactions: TReaction[];
  authorUuid: string;
  sentAt: number;
  updatedAt: number;
  isEdited  : boolean
  
};

// export type TMessageJSON = Omit<TMessage, "replyToMessageUuid"> & {
//   replyToMessage?: Omit<TMessage, "replyToMessageUuid">;
// };
// types/chat.ts
export type ChatMessage = {
  id: string;
  text: string;
  time: string;
  sender: string;
  isMe: boolean;
  avatar?: string;
};

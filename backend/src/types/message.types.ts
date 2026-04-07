export interface MessageListItem {
  id: number;
  content: string;
  userId: number;
  senderName: string | null;
  createdAt: Date;
  username: string | null;
}

export interface SavedMessage {
  id: number;
  roomId: number;
  userId: number;
  content: string;
  senderName: string | null;
  createdAt: Date;
}

export interface NewMessagePayload {
  id: number;
  roomId: number;
  userId: number;
  content: string;
  senderName: string | null;
  createdAt: Date;
  username: string;
}
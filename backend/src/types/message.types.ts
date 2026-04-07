export interface MessageListItem {
  id: number;
  content: string;
  user_id: number;
  senderName: string | null;
  createdAt: Date;
  username: string | null;
}

export interface SavedMessage {
  id: number;
  room_id: number;
  user_id: number;
  content: string;
  senderName: string | null;
  createdAt: Date;
}

export interface NewMessagePayload {
  id: number;
  room_id: number;
  user_id: number;
  content: string;
  senderName: string | null;
  createdAt: Date;
  username: string;
}
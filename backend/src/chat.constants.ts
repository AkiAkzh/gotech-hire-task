export const WS_EVENTS = {
  JOIN_ROOM: 'joinRoom',
  SEND_MESSAGE: 'sendMessage',
  LEAVE_ROOM: 'leaveRoom',
  NEW_MESSAGE: 'newMessage',
} as const;

export const ROOM_CHANNEL_PREFIX = 'room_';

export const DEFAULT_MESSAGE_LIMIT = 25;
export const DEFAULT_MESSAGE_OFFSET = 0;
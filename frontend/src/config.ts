export const API_BASE_URL = 'http://localhost:3000';
 
export const STORAGE_KEYS = {
  token: 'token',
  userId: 'userId',
} as const;

export const ROUTES = {
  login: '/login',
  register: '/register',
  chat: '/chat',
} as const;

export const SOCKET_EVENTS = {
  connect: 'connect',
  disconnect: 'disconnect',
  newMessage: 'newMessage',
  joinRoom: 'joinRoom',
  leaveRoom: 'leaveRoom',
  sendMessage: 'sendMessage',
} as const;
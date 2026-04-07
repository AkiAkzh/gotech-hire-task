export interface AuthResponse {
  token: string;
  userId: number;
}

export interface VerifiedJwtPayload {
  userId: number;
  username: string;
  iat?: number;
  exp?: number;
}
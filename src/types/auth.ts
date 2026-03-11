export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: "ADMIN" | "MODERATOR" | "MEMBER";
  avatarUrl?: string | null;
}

export interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterDto {
  email: string;
  displayName: string;
  password: string;
}


export interface AuthSuccessResponse {
  user: AuthUser;
  accessToken?: string;
}

export type SessionResponse = AuthUser;


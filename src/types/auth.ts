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
}

export interface RegisterDto {
  email: string;
  username: string;
  displayName: string;
  password: string;
}


export interface AuthSuccessResponse {
  user: AuthUser;
  accessToken?: string;
}

export interface SessionResponse {
  user: AuthUser;
}


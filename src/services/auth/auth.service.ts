import { axiosInstance } from "@/services/axiosInstance";
import type {
  AuthSuccessResponse,
  LoginDto,
  RegisterDto,
  SessionResponse,
  VerifyEmailDto,
} from "@/types/auth";

const AUTH_BASE_PATH = "/auth";

export const authService = {
  login: async (payload: LoginDto): Promise<AuthSuccessResponse> => {
    const { rememberMe, ...apiPayload } = payload;
    const response = await axiosInstance.post<AuthSuccessResponse>(
      `${AUTH_BASE_PATH}/login`,
      apiPayload,
    );

    return response.data;
  },

  register: async (payload: RegisterDto): Promise<{ user: AuthUser; message: string }> => {
    const response = await axiosInstance.post<{ user: AuthUser; message: string }>(
      `${AUTH_BASE_PATH}/register`,
      payload,
    );

    return response.data;
  },

  getSession: async (): Promise<SessionResponse> => {
    const response = await axiosInstance.get<SessionResponse>(
      `${AUTH_BASE_PATH}/me`,
      {
        headers: {
          "x-silent-error": "true",
        },
      },
    );

    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post(`${AUTH_BASE_PATH}/logout`);
  },

  verifyEmail: async (payload: VerifyEmailDto): Promise<AuthSuccessResponse & { message: string }> => {
    const response = await axiosInstance.post<AuthSuccessResponse & { message: string }>(
      `${AUTH_BASE_PATH}/verify-email`,
      payload,
    );
    return response.data;
  },
};


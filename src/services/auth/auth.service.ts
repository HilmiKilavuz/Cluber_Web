import { axiosInstance } from "@/services/axiosInstance";
import type {
  AuthSuccessResponse,
  LoginDto,
  RegisterDto,
  SessionResponse,
} from "@/types/auth";

const AUTH_BASE_PATH = "/auth";

export const authService = {
  login: async (payload: LoginDto): Promise<AuthSuccessResponse> => {
    const response = await axiosInstance.post<AuthSuccessResponse>(
      `${AUTH_BASE_PATH}/login`,
      payload,
    );

    return response.data;
  },

  register: async (payload: RegisterDto): Promise<AuthSuccessResponse> => {
    const response = await axiosInstance.post<AuthSuccessResponse>(
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
};


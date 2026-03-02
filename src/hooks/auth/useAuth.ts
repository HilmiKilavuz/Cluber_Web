"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import { authService } from "@/services/auth/auth.service";
import type {
  AuthSuccessResponse,
  AuthUser,
  LoginDto,
  RegisterDto,
} from "@/types/auth";

const AUTH_SESSION_QUERY_KEY = ["auth", "session"] as const;

const persistAccessToken = (accessToken?: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  if (!accessToken) {
    window.localStorage.removeItem("access_token");
    return;
  }

  window.localStorage.setItem("access_token", accessToken);
};

const resolveUser = (response: AuthSuccessResponse): AuthUser => response.user;

interface UseAuthResult {
  sessionQuery: UseQueryResult<AuthUser | null, Error>;
  loginMutation: UseMutationResult<AuthUser, Error, LoginDto>;
  registerMutation: UseMutationResult<AuthUser, Error, RegisterDto>;
  logoutMutation: UseMutationResult<void, Error, void>;
}

export const useAuth = (): UseAuthResult => {
  const queryClient = useQueryClient();

  const sessionQuery = useQuery<AuthUser | null, Error>({
    queryKey: AUTH_SESSION_QUERY_KEY,
    queryFn: async () => {
      const response = await authService.getSession();
      return response.user;
    },
    retry: false,
  });

  const loginMutation = useMutation<AuthUser, Error, LoginDto>({
    mutationFn: async (payload) => {
      const response = await authService.login(payload);
      persistAccessToken(response.accessToken);
      return resolveUser(response);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, user);
    },
  });

  const registerMutation = useMutation<AuthUser, Error, RegisterDto>({
    mutationFn: async (payload) => {
      const response = await authService.register(payload);
      persistAccessToken(response.accessToken);
      return resolveUser(response);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, user);
    },
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      await authService.logout();
      persistAccessToken();
    },
    onSuccess: () => {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, null);
      queryClient.invalidateQueries({ queryKey: AUTH_SESSION_QUERY_KEY });
    },
  });

  return {
    sessionQuery,
    loginMutation,
    registerMutation,
    logoutMutation,
  };
};


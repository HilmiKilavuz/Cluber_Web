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
  VerifyEmailDto,
} from "@/types/auth";

const AUTH_SESSION_QUERY_KEY = ["auth", "session"] as const;

const persistAccessToken = (accessToken?: string, remember: boolean = false): void => {
  if (typeof window === "undefined") {
    return;
  }

  if (!accessToken) {
    window.localStorage.removeItem("access_token");
    window.sessionStorage.removeItem("access_token");
    return;
  }

  if (remember) {
    window.localStorage.setItem("access_token", accessToken);
    window.sessionStorage.removeItem("access_token");
  } else {
    window.sessionStorage.setItem("access_token", accessToken);
    window.localStorage.removeItem("access_token");
  }
};

const resolveUser = (response: AuthSuccessResponse): AuthUser => response.user;

interface UseAuthResult {
  sessionQuery: UseQueryResult<AuthUser | null, Error>;
  loginMutation: UseMutationResult<AuthUser, Error, LoginDto>;
  registerMutation: UseMutationResult<{ user: AuthUser; message: string }, Error, RegisterDto>;
  logoutMutation: UseMutationResult<void, Error, void>;
  verifyEmailMutation: UseMutationResult<AuthSuccessResponse & { message: string }, Error, VerifyEmailDto>;
}

export const useAuth = (): UseAuthResult => {
  const queryClient = useQueryClient();

  const sessionQuery = useQuery<AuthUser | null, Error>({
    queryKey: AUTH_SESSION_QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await authService.getSession();
        return response ?? null;
      } catch {
        return null;
      }
    },
    retry: false,
  });

  const loginMutation = useMutation<AuthUser, Error, LoginDto>({
    mutationFn: async (payload) => {
      const response = await authService.login(payload);
      persistAccessToken(response.accessToken, payload.rememberMe);
      return resolveUser(response);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, user);
    },
  });

  const registerMutation = useMutation<{ user: AuthUser; message: string }, Error, RegisterDto>({
    mutationFn: async (payload) => {
      const response = await authService.register(payload);
      return response;
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

  const verifyEmailMutation = useMutation<AuthSuccessResponse & { message: string }, Error, VerifyEmailDto>({
    mutationFn: async (payload) => {
      const response = await authService.verifyEmail(payload);
      persistAccessToken(response.accessToken, true); // log the user in
      return response;
    },
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, response.user);
    },
  });

  return {
    sessionQuery,
    loginMutation,
    registerMutation,
    logoutMutation,
    verifyEmailMutation,
  };
};


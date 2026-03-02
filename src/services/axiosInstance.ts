import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

import { mapAxiosErrorToApiError } from "@/lib/api/handleApiError";
import { env } from "@/lib/constants/env";

const attachAuthHeader = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  if (typeof window === "undefined") {
    return config;
  }

  const token = window.localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

export const axiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(attachAuthHeader);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const mappedError = mapAxiosErrorToApiError(error);
    const shouldSkipToast =
      error.config?.headers?.["x-silent-error"] === "true";

    if (typeof window !== "undefined" && !shouldSkipToast) {
      toast.error(mappedError.message);
    }

    return Promise.reject(mappedError);
  },
);


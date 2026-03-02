import { AxiosError } from "axios";

import type { ApiError, ApiErrorPayload } from "@/types/api";

const getDefaultError = (): ApiError => ({
  message: "Beklenmeyen bir hata oluştu.",
  statusCode: 500,
});

export const mapAxiosErrorToApiError = (error: unknown): ApiError => {
  if (!(error instanceof AxiosError)) {
    return getDefaultError();
  }

  const payload = error.response?.data as ApiErrorPayload | undefined;

  // Debug log for troubleshooting 400 errors
  if (error.response?.status === 400) {
    console.error("API 400 Error Details:", payload);
  }

  const statusCode = error.response?.status ?? payload?.statusCode ?? 500;
  const message = payload?.message ?? error.message ?? getDefaultError().message;

  return {
    message,
    statusCode,
    details: payload,
  };
};


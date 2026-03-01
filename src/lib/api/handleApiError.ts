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
  const statusCode = error.response?.status ?? payload?.statusCode ?? 500;
  const message = payload?.message ?? error.message ?? getDefaultError().message;

  return {
    message,
    statusCode,
    details: payload,
  };
};


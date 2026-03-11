import { AxiosError } from "axios";

import type { ApiError, ApiErrorPayload } from "@/types/api";

const getStatusMessage = (statusCode: number, errorCode?: string): string => {
  // Zaman aşımı hataları
  if (errorCode === "ECONNABORTED" || errorCode === "ETIMEDOUT") {
    return "İstek zaman aşımına uğradı. Lütfen tekrar deneyin.";
  }

  switch (statusCode) {
    case 400:
      return "Gönderilen bilgilerde hata var. Lütfen girişlerinizi kontrol edin.";
    case 401:
      return "Bu işlem için giriş yapmanız gerekiyor.";
    case 403:
      return "Bu işlemi gerçekleştirme yetkiniz yok.";
    case 404:
      return "Aradığınız içerik bulunamadı.";
    case 408:
      return "İstek zaman aşımına uğradı. Lütfen tekrar deneyin.";
    case 409:
      return "Bu bilgi zaten kullanımda. Lütfen farklı bir değer deneyin.";
    case 422:
      return "Bilgileriniz doğrulanamadı. Lütfen tekrar kontrol edin.";
    case 429:
      return "Çok fazla istek gönderildi. Lütfen biraz bekleyin.";
    case 500:
    case 502:
    case 503:
    case 504:
      return "Sunucuda bir sorun oluştu. Lütfen daha sonra tekrar deneyin.";
    default:
      return "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.";
  }
};

export const mapAxiosErrorToApiError = (error: unknown): ApiError => {
  if (!(error instanceof AxiosError)) {
    return {
      message: "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.",
      statusCode: 500,
    };
  }

  const payload = error.response?.data as ApiErrorPayload | undefined;
  const statusCode = error.response?.status ?? payload?.statusCode ?? 500;
  const message = getStatusMessage(statusCode, error.code);

  return {
    message,
    statusCode,
    details: payload,
  };
};


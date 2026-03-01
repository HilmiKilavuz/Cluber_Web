export interface ApiErrorPayload {
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  details?: ApiErrorPayload;
}


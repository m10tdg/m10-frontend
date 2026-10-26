// src/shared/lib/apiError.ts
import { isAxiosError } from "axios";

// Our services answer errors with `{ error: string }`.
export function getApiErrorMessage(
  error: unknown,
  fallback = "The request failed. Please try again.",
): string {
  if (isAxiosError<{ error?: unknown }>(error)) {
    const message = error.response?.data?.error;
    if (typeof message === "string") return message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export function getApiErrorStatus(error: unknown): number | undefined {
  return isAxiosError(error) ? error.response?.status : undefined;
}

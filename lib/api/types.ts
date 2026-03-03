/**
 * @file types.ts
 * @description Types and ApiError for the generic API client.
 */

/**
 * Thrown on non-2xx responses, timeouts, network errors, or parse failures.
 */
export class ApiError extends Error {
  name = 'ApiError' as const;

  constructor(
    message: string,
    public readonly status?: number,
    public readonly body?: unknown,
    public readonly cause?: Error
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/** Response shape: data plus status and headers for inspection */
export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

/** Client-level config (baseUrl, defaults, timeout, retries) */
export interface ApiClientConfig {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
}

/** Per-request options: body, headers, signal, query params */
export interface RequestOptions<B = unknown> {
  body?: B;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  params?: Record<string, string>;
}

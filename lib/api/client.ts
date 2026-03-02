/**
 * @file client.ts
 * @description Generic API client: fetch wrapper with baseUrl, timeout, retries, and typed responses.
 */

import type { ApiClientConfig, ApiResponse, RequestOptions } from './types';
import { ApiError } from './types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

function isAbsoluteUrl(path: string): boolean {
  return path.startsWith('http://') || path.startsWith('https://');
}

function buildUrl(
  path: string,
  baseUrl?: string,
  params?: Record<string, string>
): string {
  let url: string;
  if (baseUrl && !isAbsoluteUrl(path)) {
    const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const p = path.startsWith('/') ? path : `/${path}`;
    url = `${base}${p}`;
  } else {
    url = path;
  }

  const parsed = new URL(url);
  if (params && Object.keys(params).length > 0) {
    Object.entries(params).forEach(([key, value]) => {
      parsed.searchParams.set(key, value);
    });
  }
  return parsed.toString();
}

function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 429 || (status >= 500 && status < 600);
}

function isRetryableError(err: unknown): boolean {
  return err instanceof TypeError || (err instanceof ApiError && err.status !== undefined && isRetryableStatus(err.status));
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function parseResponseBody<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  const text = await response.text();
  if (!text.trim()) {
    return undefined as T;
  }

  if (isJson) {
    try {
      return JSON.parse(text) as T;
    } catch (e) {
      throw new ApiError(
        'Invalid JSON in response',
        response.status,
        text,
        e instanceof Error ? e : new Error(String(e))
      );
    }
  }

  return text as unknown as T;
}

/**
 * Creates an API client with optional baseUrl, default headers, timeout, and retries.
 * Safe to use on server and client. Each integration should create its own instance.
 */
export function createApiClient(config: ApiClientConfig = {}) {
  const {
    baseUrl = '',
    defaultHeaders = {},
    timeoutMs,
    retries = 0,
    retryDelayMs = 1000,
  } = config;

  async function request<T, B = unknown>(
    method: HttpMethod,
    path: string,
    options: RequestOptions<B> = {}
  ): Promise<ApiResponse<T>> {
    const { body, headers: reqHeaders = {}, signal: reqSignal, params } = options;

    const url = buildUrl(path, baseUrl || undefined, params);
    const headers = { ...defaultHeaders, ...reqHeaders };

    let bodySerialized: string | FormData | undefined;
    if (body !== undefined && body !== null) {
      if (body instanceof FormData) {
        bodySerialized = body;
      } else {
        bodySerialized = JSON.stringify(body);
        if (!headers['Content-Type'] && !headers['content-type']) {
          headers['Content-Type'] = 'application/json';
        }
      }
    }

    // Do not send Content-Type for FormData (browser sets multipart boundary)
    const fetchHeaders =
      bodySerialized instanceof FormData
        ? Object.fromEntries(Object.entries(headers).filter(([k]) => k.toLowerCase() !== 'content-type'))
        : headers;

    const controller = timeoutMs != null && !reqSignal ? new AbortController() : null;
    const signal = reqSignal ?? controller?.signal;

    if (controller && timeoutMs != null) {
      setTimeout(() => controller.abort(), timeoutMs);
    }

    let lastError: unknown;
    const maxAttempts = 1 + (retries ?? 0);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await fetch(url, {
          method,
          headers: fetchHeaders,
          body: method !== 'GET' && method !== 'DELETE' ? bodySerialized : undefined,
          signal,
        });

        if (!response.ok) {
          let errorBody: unknown;
          try {
            errorBody = await parseResponseBody<unknown>(response);
          } catch {
            errorBody = await response.text();
          }
          const err = new ApiError(
            `Request failed with status ${response.status}`,
            response.status,
            errorBody
          );
          if (attempt < maxAttempts && isRetryableStatus(response.status)) {
            lastError = err;
            await delay(retryDelayMs);
            continue;
          }
          throw err;
        }

        const data = await parseResponseBody<T>(response);
        return { data, status: response.status, headers: response.headers };
      } catch (err) {
        if (err instanceof ApiError) {
          throw err;
        }
        const isAbort = err instanceof Error && err.name === 'AbortError';
        const wrapped = new ApiError(
          isAbort ? 'Request timeout' : (err instanceof Error ? err.message : 'Request failed'),
          undefined,
          undefined,
          err instanceof Error ? err : new Error(String(err))
        );
        if (attempt < maxAttempts && (isRetryableError(err) || isAbort)) {
          lastError = wrapped;
          await delay(retryDelayMs);
          continue;
        }
        throw wrapped;
      }
    }

    throw lastError ?? new ApiError('Request failed after retries');
  }

  return {
    get<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
      return request<T>('GET', path, options);
    },

    post<T, B = unknown>(path: string, options?: RequestOptions<B>): Promise<ApiResponse<T>> {
      return request<T, B>('POST', path, options);
    },

    put<T, B = unknown>(path: string, options?: RequestOptions<B>): Promise<ApiResponse<T>> {
      return request<T, B>('PUT', path, options);
    },

    patch<T, B = unknown>(path: string, options?: RequestOptions<B>): Promise<ApiResponse<T>> {
      return request<T, B>('PATCH', path, options);
    },

    delete<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
      return request<T>('DELETE', path, options);
    },
  };
}

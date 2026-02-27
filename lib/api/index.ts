/**
 * @file index.ts
 * @description Re-exports for the generic API client. Use createApiClient per integration (no default instance).
 */

export { createApiClient } from './client';
export { ApiError, type ApiResponse, type ApiClientConfig, type RequestOptions } from './types';

import {
  apiClient,
  setApiAccessToken,
  getApiAccessToken,
  subscribeToTokenUpdates,
  subscribeToUnauthorized,
  type ApiResponse,
} from "./apiClient";
import { authService, DEMO_USERS } from "./authService";

/**
 * Standard API Service Facade
 */
export const api = {
  get: <T = unknown>(url: string, options?: RequestInit) =>
    apiClient<T>(url, { ...options, method: "GET" }),

  post: <T = unknown>(url: string, body?: unknown, options?: RequestInit) =>
    apiClient<T>(url, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = unknown>(url: string, body?: unknown, options?: RequestInit) =>
    apiClient<T>(url, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = unknown>(url: string, body?: unknown, options?: RequestInit) =>
    apiClient<T>(url, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = unknown>(url: string, options?: RequestInit) =>
    apiClient<T>(url, { ...options, method: "DELETE" }),
};

export {
  apiClient,
  setApiAccessToken,
  getApiAccessToken,
  subscribeToTokenUpdates,
  subscribeToUnauthorized,
  authService,
  DEMO_USERS,
  type ApiResponse,
};

export default api;

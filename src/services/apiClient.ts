import { authService } from "./authService";

type TokenProvider = () => string | null;
type TokenConsumer = (token: string | null) => void;
type UnauthorizedHandler = () => void;

let inMemoryAccessToken: string | null = null;
let onTokenUpdateCallback: TokenConsumer | null = null;
let onUnauthorizedCallback: UnauthorizedHandler | null = null;

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Configure API Client Token handlers
 */
export const setApiAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
  onTokenUpdateCallback?.(token);
};

export const getApiAccessToken: TokenProvider = () => {
  return inMemoryAccessToken;
};

export const subscribeToTokenUpdates = (cb: TokenConsumer) => {
  onTokenUpdateCallback = cb;
};

export const subscribeToUnauthorized = (cb: UnauthorizedHandler) => {
  onUnauthorizedCallback = cb;
};

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  ok: boolean;
}

/**
 * Enterprise Fetch Client with 401 Interceptors & Concurrency Queue
 */
export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers || {});
  
  if (inMemoryAccessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${inMemoryAccessToken}`);
  }
  
  headers.set("Content-Type", "application/json");

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    // For demo/simulated routes that are handled in memory
    if (endpoint.startsWith("/api/simulated/")) {
      return handleSimulatedApi<T>(endpoint, config);
    }

    const response = await fetch(endpoint, config);

    // 401 Interceptor with Silent Token Refresh
    if (response.status === 401) {
      if (isRefreshing) {
        // Enqueue request while another refresh is in progress
        const newToken = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        
        headers.set("Authorization", `Bearer ${newToken}`);
        return apiClient<T>(endpoint, { ...options, headers });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await authService.refreshAccessToken();
        const newToken = refreshResponse.tokens.accessToken;
        
        setApiAccessToken(newToken);
        processQueue(null, newToken);

        headers.set("Authorization", `Bearer ${newToken}`);
        return apiClient<T>(endpoint, { ...options, headers });
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        setApiAccessToken(null);
        onUnauthorizedCallback?.();
        throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
      } finally {
        isRefreshing = false;
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { data, status: response.status, ok: response.ok };
  } catch (error) {
    throw error;
  }
}

/**
 * Helper to simulate backend endpoints for testing interceptors
 */
async function handleSimulatedApi<T>(
  _endpoint: string,
  config: RequestInit
): Promise<ApiResponse<T>> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const authHeader = (config.headers as Headers).get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      data: { error: "Unauthorized" } as unknown as T,
      status: 401,
      ok: false,
    };
  }

  return {
    data: { success: true, timestamp: Date.now() } as unknown as T,
    status: 200,
    ok: true,
  };
}

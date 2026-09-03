import { isMockEnabled, getApiBaseUrl } from "@/lib/config";

/**
 * Universal typed API client.
 * Dispatches to backend API when mock mode is disabled (NEXT_PUBLIC_USE_MOCK_DATA=false).
 * Gracefully falls back to mockFallback() when mock is enabled or if the backend endpoint is unreachable.
 */
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
  mockFallback?: () => T | Promise<T>
): Promise<T> {
  const mockActive = isMockEnabled();

  // If mock mode is forced and we have a mock provider, return mock directly
  if (mockActive && mockFallback) {
    return Promise.resolve(mockFallback());
  }

  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = endpoint.startsWith("http") ? endpoint : `${baseUrl}${cleanEndpoint}`;

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      if (mockFallback) {
        console.warn(`[apiClient] Backend endpoint ${endpoint} returned ${res.status}. Falling back to mock data.`);
        return Promise.resolve(mockFallback());
      }
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }

    return (await res.json()) as T;
  } catch (err) {
    if (mockFallback) {
      console.warn(`[apiClient] Backend connection failed for ${endpoint}. Falling back to mock data:`, err);
      return Promise.resolve(mockFallback());
    }
    throw err;
  }
}

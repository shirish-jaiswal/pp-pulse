import axios, { AxiosRequestConfig, Method } from "axios";

type ApiRequestOptions<T = unknown> = {
  method: Method;
  endpoint: string;
  data?: T;
  body?: T; // Added support for 'body' keyword
  params?: Record<string, any>;
  requireCookie?: boolean;
  headers?: Record<string, string>;
  baseURL?: string;
};

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "";

if (!DEFAULT_BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_BACKEND_URL");
}

async function apiRequest<R = any, T = unknown>({
  method,
  endpoint,
  data,
  body,
  params,
  requireCookie = true,
  headers = {},
  baseURL,
}: ApiRequestOptions<T>): Promise<R> {
  try {
    if (!endpoint) throw new Error("Endpoint is required");
    
    const cleanEndpoint = endpoint.replace(/^\//, "");
    const finalBaseURL = (baseURL || (DEFAULT_BASE_URL as string)).replace(/\/$/, "");
    
    // Fallback to 'data' if 'body' is provided, matching Axios expectations
    const payload = data !== undefined ? data : body;

    const config: AxiosRequestConfig = {
      method,
      url: `${finalBaseURL}/${cleanEndpoint}`,
      data: payload,
      params,
      withCredentials: requireCookie,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };
    
    const response = await axios.request<R>(config);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "API request failed"
      );
    }
    throw new Error("Unknown error occurred");
  }
}

export default apiRequest;
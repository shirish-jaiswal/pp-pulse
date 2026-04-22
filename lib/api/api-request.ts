import axios, { AxiosRequestConfig, Method } from "axios";

type ApiRequestOptions<T = unknown> = {
  method: Method;
  endpoint: string;
  data?: T;
  params?: Record<string, any>;
  requireCookie?: boolean;
  headers?: Record<string, string>;
};

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");

if (!BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_BACKEND_URL");
}

async function apiRequest<R = any, T = unknown>({
  method,
  endpoint,
  data,
  params,
  requireCookie = true,
  headers = {},
}: ApiRequestOptions<T>): Promise<R> {
  try {
    if (!endpoint) throw new Error("Endpoint is required");

    const cleanEndpoint = endpoint.replace(/^\//, "");

    const config: AxiosRequestConfig = {
      method,
      url: `${BASE_URL}/${cleanEndpoint}`,
      data,
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
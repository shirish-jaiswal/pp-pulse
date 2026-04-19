import axios, { AxiosRequestConfig, Method } from "axios";

type ApiRequestOptions<T = unknown> = {
  method: Method;
  endpoint: string;
  data?: T;
  params?: Record<string, any>;
  requireCookie?: boolean;
  headers?: Record<string, string>;
};

type ApiResponse<R> = {
  success: boolean;
  data: R;
  message?: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");

if (!BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_BACKEND_URL");
}

async function apiRequest<R = unknown, T = unknown>({
  method,
  endpoint,
  data,
  params,
  requireCookie = false,
  headers = {},
}: ApiRequestOptions<T>): Promise<ApiResponse<R>> {
  try {
    if (!endpoint) throw new Error("Endpoint is required");

    const config: AxiosRequestConfig = {
      method,
      url: `${BASE_URL}/${endpoint.replace(/^\//, "")}`,
      data,
      params,
      withCredentials: requireCookie,

      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    const response = await axios.request<ApiResponse<R>>(config);

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        data: {} as R,
        message:
          error.response?.data?.message ||
          error.message ||
          "API request failed",
      };
    }

    return {
      success: false,
      data: {} as R,
      message: "Unknown error",
    };
  }
}

export default apiRequest;
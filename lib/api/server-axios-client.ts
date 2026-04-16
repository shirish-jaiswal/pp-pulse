import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { cookies } from "next/headers";

const BASE_URL =
  (process.env.NEXT_PUBLIC_NEXT_URL as string).replace(/\/$/, "");

export const serverAxiosClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

/**
 * REQUEST INTERCEPTOR (SERVER ONLY)
 */
serverAxiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // =========================
    // Attach ONLY JSESSIONID
    // =========================
    const cookieStore = await cookies();

    const cookieHeader = cookieStore
      .getAll()
      .filter((c) => c.name === "JSESSIONID")
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    if (cookieHeader) {
      config.headers = config.headers ?? {};
      config.headers.Cookie = cookieHeader;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(normalizeError(error))
);

/**
 * RESPONSE INTERCEPTOR
 */
serverAxiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (!error.response) {
      return Promise.reject({
        message: "Network error. Please check your connection.",
        status: 0,
        data: null,
      });
    }

    const status = error.response.status;
    const data = error.response.data as any;

    return Promise.reject({
      message: data?.message || error.message,
      status,
      data,
    });
  }
);

/**
 * GLOBAL ERROR NORMALIZER
 */
function normalizeError(error: AxiosError) {
  return {
    message:
      (error.response?.data as any)?.message ||
      error.message ||
      "Unexpected error occurred",
    status: error.response?.status || 0,
    data: error.response?.data || null,
  };
}

/**
 * SAFE HELPERS
 */
export const safeGet = async <T>(
  url: string,
  config?: AxiosRequestConfig
) => {
  const res = await serverAxiosClient.get<T>(url, config);
  return res.data;
};

export const safePost = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) => {
  const res = await serverAxiosClient.post<T>(url, data, config);
  return res.data;
};
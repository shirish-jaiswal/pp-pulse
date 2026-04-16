import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL =
  (process.env.NEXT_PUBLIC_NEXT_URL as string).replace(/\/$/, "");

/**
 * Create Axios instance
 */
export const axiosClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

const pendingRequests = new Map<string, AbortController>();

const createRequestKey = (config: AxiosRequestConfig) => {
  return `${config.method}-${config.url}-${JSON.stringify(config.params || {})}`;
};

/**
 * REQUEST INTERCEPTOR
 * - SSR safe
 * - Attach token
 * - Prevent duplicate requests
 * - Attach AbortController
 */
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // SSR guard
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Prevent duplicate requests (optional but useful for forms)
    const key = createRequestKey(config);
    const controller = new AbortController();

    // Cancel previous same request
    if (pendingRequests.has(key)) {
      pendingRequests.get(key)?.abort();
      pendingRequests.delete(key);
    }

    pendingRequests.set(key, controller);
    config.signal = controller.signal;

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(normalizeError(error));
  }
);

/**
 * RESPONSE INTERCEPTOR
 * - Cleanup request cache
 * - Normalize errors
 * - Handle auth failures
 */
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const key = createRequestKey(response.config);
    pendingRequests.delete(key);

    return response;
  },
  (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig;

    if (config) {
      const key = createRequestKey(config);
      pendingRequests.delete(key);
    }

    // Handle network error
    if (!error.response) {
      return Promise.reject({
        message: "Network error. Please check your connection.",
        status: 0,
        data: null,
      });
    }

    const status = error.response.status;
    const data = error.response.data as any;

    // Handle unauthorized globally
    if (status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // optional: redirect hook
      window.location.href = "/login";
    }

    return Promise.reject({
      message: data?.message || error.message || "Request failed",
      status,
      data,
    });
  }
);

/**
 * =========================
 * GLOBAL ERROR NORMALIZER
 * =========================
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
 * =========================
 * OPTIONAL HELPERS
 * =========================
 */

/**
 * Cancel all pending requests (useful on route change)
 */
export const cancelAllRequests = () => {
  pendingRequests.forEach((controller) => controller.abort());
  pendingRequests.clear();
};

/**
 * Safe GET wrapper
 */
export const safeGet = async <T>(url: string, config?: AxiosRequestConfig) => {
  const res = await axiosClient.get<T>(url, config);
  return res.data;
};

/**
 * Safe POST wrapper
 */
export const safePost = async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
  const res = await axiosClient.post<T>(url, data, config);
  return res.data;
};
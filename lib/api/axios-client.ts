import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL =
  (process.env.NEXT_PUBLIC_NEXT_URL as string).replace(/\/$/, "");

export const axiosClient: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}`,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const pendingRequests = new Map<string, AbortController>();

const createRequestKey = (config: AxiosRequestConfig) =>
  `${config.method}-${config.url}-${JSON.stringify(config.params || {})}`;

/**
 * REQUEST INTERCEPTOR (CLIENT SAFE ONLY)
 */
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // browser token only
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // dedupe requests
    const key = createRequestKey(config);
    const controller = new AbortController();

    if (pendingRequests.has(key)) {
      pendingRequests.get(key)?.abort();
      pendingRequests.delete(key);
    }

    pendingRequests.set(key, controller);
    config.signal = controller.signal;

    return config;
  },
  (error: AxiosError) => Promise.reject(normalizeError(error))
);

/**
 * RESPONSE INTERCEPTOR
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

    if (!error.response) {
      return Promise.reject({
        message: "Network error. Please check your connection.",
        status: 0,
        data: null,
      });
    }

    const status = error.response.status;
    const data = error.response.data as any;

    if (status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject({
      message: data?.message || error.message,
      status,
      data,
    });
  }
);

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

export const cancelAllRequests = () => {
  pendingRequests.forEach((c) => c.abort());
  pendingRequests.clear();
};

export const safeGet = async <T>(url: string, config?: AxiosRequestConfig) => {
  const res = await axiosClient.get<T>(url, config);
  return res.data;
};

export const safePost = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) => {
  const res = await axiosClient.post<T>(url, data, config);
  return res.data;
};
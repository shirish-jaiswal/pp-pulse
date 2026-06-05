"use server";
import axios, { AxiosRequestConfig, Method } from "axios";

type KibanaRequestOptions<T = unknown> = {
  method: Method;
  endpoint: string;
  data?: T;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  baseURL?: string;
};

const KIBANA_BASE_URL = process.env.NEXT_PUBLIC_KIBANA_URL || "";
const KIBANA_API_KEY = process.env.NEXT_PUBLIC_KIBANA_API_KEY || "";

if (!KIBANA_BASE_URL || KIBANA_BASE_URL === "") {
  throw new Error("Missing KIBANA_URL or NEXT_PUBLIC_KIBANA_URL");
}

if (!KIBANA_API_KEY || KIBANA_API_KEY === "") {
  throw new Error("Missing KIBANA_API_KEY or NEXT_PUBLIC_KIBANA_API_KEY");
}

const normalizeUrl = (url: string) => url.replace(/\/$/, "");

export async function kibanaRequest<R = any, T = unknown>({
  method,
  endpoint,
  data,
  params,
  headers = {},
  baseURL,
}: KibanaRequestOptions<T>): Promise<R> {
  try {
    if (!endpoint) {
      throw new Error("Endpoint is required");
    }
    const finalBaseURL = normalizeUrl(baseURL || (KIBANA_BASE_URL as string));
    const cleanEndpoint = endpoint.replace(/^\//, "");

    const config: AxiosRequestConfig = {
      method,
      url: `${finalBaseURL}/${cleanEndpoint}`,
      data,
      params,
      // 1. INCREASED TIMEOUT HERE: Changed from 65000 to 120000 (2 minutes)
      timeout: 120000,
      headers: {
        "Content-Type": "application/json",
        "kbn-xsrf": "true",
        Authorization: `ApiKey ${KIBANA_API_KEY}`,
        ...headers,
      },
    };

    const response = await axios.request<R>(config);
    return response.data;
  } catch (error: any) {
    // 2. Handle the specific Axios timeout error gracefully in logs
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED") {
        console.error("❌ Kibana Request Timed Out after 120 seconds");
      } else {
        console.error("❌ Kibana Request Failed:", {
          url: error.config?.url,
          status: error.response?.status,
          data: error.message,
        });
      }

      throw new Error(
        error.response?.data?.error?.reason ||
        error.response?.data?.message ||
        error.message ||
        "Kibana request failed"
      );
    }

    throw new Error("Unknown Kibana error occurred");
  }
}
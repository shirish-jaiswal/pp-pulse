import { getSessionData } from "@/utils/storage/local/session-operations";
import axios from "axios";

export const axiosClientInstance = (customheaders?: any) => {

  return axios.create({
    baseURL: (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081").replace(
      /\/$/,
      ""
    ),
    timeout: 15000,
    headers: { "Content-Type": "application/x-www-form-urlencoded", ...customheaders },
  });
}

axiosClientInstance().interceptors.request.use(async (config) => {
  const jsessionId = getSessionData()?.jsessionId;

  if (jsessionId) {
    if (jsessionId && config.headers) {
      config.headers.set("Cookie", `JSESSIONID=${jsessionId}`);
    }
  }

  return config;
});

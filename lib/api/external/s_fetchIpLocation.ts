"use server";

import apiRequest from "../api-request";

export type IpLocationData = {
  ipAddress: string;
  ipVersion: number;
  countryName: string;
  countryCode: string;
  cityName: string;
  regionName: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  asnOrganization: string;
};

export async function s_fetchIpLocation(targetIp?: string) {
  try {
    // Construct request endpoint. If blank, freeipapi defaults to the user's current request IP
    const endpoint = targetIp ? `/api/json/${targetIp.trim()}` : "/api/json";

    const data = await apiRequest({
      method: "GET",
      endpoint: endpoint,
      baseURL: "https://free.freeipapi.com",
      requireCookie: false,
    });

    if (!data || !data.ipAddress) {
      throw new Error("Could not find any location record for this IP address.");
    }

    const formatted: IpLocationData = {
      ipAddress: data.ipAddress,
      ipVersion: data.ipVersion || 4,
      countryName: data.countryName || "Unknown Country",
      countryCode: data.countryCode ? data.countryCode.toLowerCase() : "un",
      cityName: data.cityName || "Unknown City",
      regionName: data.regionName || "Unknown Region",
      zipCode: data.zipCode || "N/A",
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      timezone: data.timeZones?.[0] || "UTC",
      asnOrganization: data.asnOrganization || "Unknown Provider",
    };

    return { success: true, data: formatted };
  } catch (error: any) {
    console.error("IP Lookup Server Error:", error?.message || error);
    return {
      success: false,
      data: null,
      error: error?.message || "An unexpected error occurred while resolving the network host.",
    };
  }
}
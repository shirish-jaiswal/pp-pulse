"use server";

import apiRequest from "../api-request";

export type CountryZone = {
  country: string;
  code: string;
  timezone: string;
};

export async function s_fetchCountryZones() {
  try {
    // 1. Fetch the flat array of available IANA timezones from the Time.Now production API
    const response = await apiRequest({
      method: "GET",
      endpoint: "/timezone",
      baseURL: "https://time.now/developer/api",
      requireCookie: false,
    });

    // Handle case where apiRequest passes back raw array directly vs wrapping in .data
    const timezonesArray: string[] = Array.isArray(response) 
      ? response 
      : response?.data;

    if (!timezonesArray || !Array.isArray(timezonesArray) || timezonesArray.length === 0) {
      throw new Error("Invalid or empty data array received from the Time.Now API.");
    }

    // 2. Transform the IANA strings into structured CountryZone objects
    const formatted: CountryZone[] = timezonesArray
      .map((tz: string) => {
        // IANA strings format: "Continent/City" or "Continent/Region/City"
        const parts = tz.split("/");
        
        let displayLocation = "Unknown";
        if (parts.length > 1) {
          // Extracts the final modifier (e.g., "Los_Angeles" -> "Los Angeles")
          displayLocation = parts[parts.length - 1].replace(/_/g, " ");
        }

        // Generate a stable 2-letter fallback code based on the parsed name for flag components
        const countryCode = displayLocation !== "Unknown" 
          ? displayLocation.substring(0, 2).toLowerCase() 
          : "un";

        return {
          country: displayLocation,
          code: countryCode,
          timezone: tz,
        };
      })
      // Exclude base global configurations like generic "UTC", "GMT", or "CET" strings
      .filter((item: CountryZone) => item.country !== "Unknown" && item.timezone.includes("/"))
      // Alpha sort by the location name
      .sort((a: CountryZone, b: CountryZone) => a.country.localeCompare(b.country));

    return {
      success: true,
      data: formatted,
    };
  } catch (error: any) {
    console.error(
      "Fetch Country Zones Server Error (Time.Now API):",
      error?.message || error
    );

    return {
      success: false,
      data: [],
      error: error?.message || "Unknown error occurred while processing country zones.",
    };
  }
}
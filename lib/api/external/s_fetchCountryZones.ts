"use server";

import apiRequest from "../api-request";

export type CountryZone = {
  country: string;
  code: string;
  timezone: string;
};

const ianaFallbackMap: Record<string, string> = {
  romania: "Europe/Bucharest",
  india: "Asia/Kolkata",
  "united states": "America/New_York",
  "united kingdom": "Europe/London",
  france: "Europe/Paris",
  germany: "Europe/Paris",
  australia: "Australia/Sydney",
  canada: "America/Toronto",
  japan: "Asia/Tokyo",
  china: "Asia/Shanghai",
  brazil: "America/Sao_Paulo",
};

export async function s_fetchCountryZones() {
  try {
    // Utilize your shared apiRequest utility
    const data = await apiRequest({
      method: "GET",
      endpoint: "/v3.1/all?fields=name,cca2,timezones",
      baseURL: "https://restcountries.com",
      requireCookie: false,
    });

    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid or empty data received from the RestCountries API.");
    }

    const formatted: CountryZone[] = data
      .map((item: any) => {
        const countryName = item.name?.common || "Unknown";
        const lowerName = countryName.toLowerCase();

        // 1. Check DST override map first.
        // 2. Look for a valid standard IANA string in their timezone list.
        // 3. Fall back to generic UTC.
        let chosenTz = ianaFallbackMap[lowerName];

        if (!chosenTz) {
          const standardIana = item.timezones?.find((tz: string) => tz.includes("/"));
          chosenTz = standardIana || "UTC";
        }

        return {
          country: countryName,
          code: item.cca2 ? item.cca2.toLowerCase() : "un",
          timezone: chosenTz,
        };
      })
      .sort((a: CountryZone, b: CountryZone) => a.country.localeCompare(b.country));

    return {
      success: true,
      data: formatted,
    };
  } catch (error: any) {
    console.error(
      "Fetch Country Zones Server Error:",
      error?.message || error
    );

    return {
      success: false,
      data: [],
      error: error?.message || "Unknown error occurred while processing country zones.",
    };
  }
}
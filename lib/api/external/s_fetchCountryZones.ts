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

const REST_COUNTRIES = process.env.REST_COUNTRIES_API_KEY
export async function s_fetchCountryZones() {
  try {
    let allCountries: any[] = [];
    let offset = 0;
    const limit = 100; 
    let hasMore = true;

    while (hasMore) {
      const urlParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        response_fields: "names.common,codes.alpha_2,timezones",
      });

      const response = await apiRequest({
        method: "GET",
        endpoint: `/countries/v5?${urlParams.toString()}`,
        baseURL: "https://api.restcountries.com",
        requireCookie: false,
        headers: {
          Authorization: `Bearer ${REST_COUNTRIES}`,
        },
      });

      const countriesArray = response?.data?.objects;

      if (!countriesArray || !Array.isArray(countriesArray) || countriesArray.length === 0) {
        hasMore = false;
      } else {
        allCountries = allCountries.concat(countriesArray);
        
        if (countriesArray.length < limit) {
          hasMore = false;
        } else {
          offset += limit;
        }
      }
    }

    if (allCountries.length === 0) {
      throw new Error("Invalid or empty data array received from the RestCountries v5 API.");
    }

    const formatted: CountryZone[] = allCountries
      .map((item: any) => {
        const countryName = item.names?.common || "Unknown";
        const lowerName = countryName.toLowerCase();
        
        let chosenTz = ianaFallbackMap[lowerName];
        if (!chosenTz) {
          const standardIana = item.timezones?.find((tz: string) => tz.includes("/"));
          chosenTz = standardIana || "UTC";
        }

        const rawCode = item.codes?.alpha_2;
        const countryCode = typeof rawCode === "string" ? rawCode.toLowerCase() : "un";

        return {
          country: countryName,
          code: countryCode,
          timezone: chosenTz,
        };
      })
      .filter((item: CountryZone) => item.country !== "Unknown")
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
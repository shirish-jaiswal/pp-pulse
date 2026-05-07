export function parseSettings(settings: any) {
  if (!settings) return {};
  if (typeof settings === "object") return settings;

  try {
    return JSON.parse(settings);
  } catch (e) {
    console.error("Failed to parse settings:", e);
    return {};
  }
}
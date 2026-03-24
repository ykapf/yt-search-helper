import { DEFAULT_PREFERENCES, type UserPreferences } from "./contracts";

const KEYS = {
  enabled: "sfa_enabled",
  correctionMode: "sfa_correction_mode",
  debugOverlay: "sfa_debug_overlay",
  lastUpdated: "sfa_last_updated",
} as const;

type PartialPrefs = Partial<UserPreferences>;

export async function readPreferences(): Promise<UserPreferences> {
  const result = await chrome.storage.sync.get(Object.values(KEYS));
  return {
    enabled:
      typeof result[KEYS.enabled] === "boolean"
        ? result[KEYS.enabled]
        : DEFAULT_PREFERENCES.enabled,
    correctionMode:
      result[KEYS.correctionMode] === "strict" ? "strict" : "balanced",
    debugOverlay:
      typeof result[KEYS.debugOverlay] === "boolean"
        ? result[KEYS.debugOverlay]
        : DEFAULT_PREFERENCES.debugOverlay,
    lastUpdated:
      typeof result[KEYS.lastUpdated] === "number"
        ? result[KEYS.lastUpdated]
        : DEFAULT_PREFERENCES.lastUpdated,
  };
}

export async function writePreferences(update: PartialPrefs): Promise<void> {
  const next = {
    [KEYS.enabled]:
      update.enabled === undefined ? undefined : Boolean(update.enabled),
    [KEYS.correctionMode]:
      update.correctionMode === undefined
        ? undefined
        : update.correctionMode === "strict"
          ? "strict"
          : "balanced",
    [KEYS.debugOverlay]:
      update.debugOverlay === undefined ? undefined : Boolean(update.debugOverlay),
    [KEYS.lastUpdated]: Date.now(),
  };

  const payload = Object.fromEntries(
    Object.entries(next).filter(([, value]) => value !== undefined),
  );
  if (Object.keys(payload).length > 0) {
    await chrome.storage.sync.set(payload);
  }
}

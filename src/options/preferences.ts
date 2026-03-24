import type {
  CorrectionMode,
  UserPreferences,
} from "../shared/contracts";
import { readPreferences, writePreferences } from "../shared/storage";

export async function loadPreferences(): Promise<UserPreferences> {
  return readPreferences();
}

export async function saveTogglePreference(
  key: "enabled" | "debugOverlay",
  value: boolean,
): Promise<void> {
  await writePreferences({ [key]: value });
}

export async function saveModePreference(value: CorrectionMode): Promise<void> {
  await writePreferences({ correctionMode: value });
}

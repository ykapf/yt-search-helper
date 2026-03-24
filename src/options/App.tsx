import { useEffect, useState } from "react";
import type { CorrectionMode, UserPreferences } from "../shared/contracts";
import { DEFAULT_PREFERENCES } from "../shared/contracts";
import {
  loadPreferences,
  saveModePreference,
  saveTogglePreference,
} from "./preferences";
import "./options.css";

function Row(props: {
  label: string;
  helper: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="row">
      <div>
        <div className="row-label">{props.label}</div>
        <div className="row-helper">{props.helper}</div>
      </div>
      <input
        type="checkbox"
        checked={props.checked}
        onChange={(event) => props.onChange(event.target.checked)}
      />
    </label>
  );
}

export default function OptionsApp() {
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void loadPreferences().then((value) => {
      setPrefs(value);
      setReady(true);
    });
  }, []);

  const setMode = async (mode: CorrectionMode) => {
    await saveModePreference(mode);
    setPrefs((previous) => ({ ...previous, correctionMode: mode }));
  };

  const setToggle = async (
    key: "enabled" | "debugOverlay",
    value: boolean,
  ) => {
    await saveTogglePreference(key, value);
    setPrefs((previous) => ({ ...previous, [key]: value }));
  };

  return (
    <main className="panel">
      <h1>Search Flow Assistant</h1>
      <p className="subtitle">
        Configure how YouTube search URLs are normalized before the page fully
        renders.
      </p>

      <section className="group">
        <Row
          label="Enable correction"
          helper="When disabled, all redirects are skipped."
          checked={prefs.enabled}
          onChange={(value) => void setToggle("enabled", value)}
        />
        <Row
          label="Show debug toast"
          helper="Display a short overlay when a redirect is applied."
          checked={prefs.debugOverlay}
          onChange={(value) => void setToggle("debugOverlay", value)}
        />
      </section>

      <section className="group">
        <div className="row-label">Correction mode</div>
        <div className="mode-grid">
          <button
            className={prefs.correctionMode === "balanced" ? "active" : ""}
            onClick={() => void setMode("balanced")}
            type="button"
          >
            Balanced
          </button>
          <button
            className={prefs.correctionMode === "strict" ? "active" : ""}
            onClick={() => void setMode("strict")}
            type="button"
          >
            Strict
          </button>
        </div>
      </section>

      <footer>{ready ? "Saved automatically" : "Loading preferences..."}</footer>
    </main>
  );
}

import { resolveSearchState } from "./correctionEngine";
import { createNavigationGate } from "./navigationGate";
import { parseUrlState } from "./urlState";
import { readPreferences } from "../shared/storage";

function isYouTubeSurface(url: URL): boolean {
  return url.hostname === "www.youtube.com" || url.hostname === "m.youtube.com";
}

function renderDebugBanner(message: string) {
  const banner = document.createElement("div");
  banner.textContent = message;
  banner.style.position = "fixed";
  banner.style.bottom = "12px";
  banner.style.right = "12px";
  banner.style.zIndex = "2147483647";
  banner.style.padding = "8px 10px";
  banner.style.background = "#0f172a";
  banner.style.color = "#f8fafc";
  banner.style.borderRadius = "8px";
  banner.style.font = "12px/1.2 sans-serif";
  banner.style.boxShadow = "0 6px 18px rgba(0,0,0,0.25)";
  document.documentElement.appendChild(banner);
  setTimeout(() => banner.remove(), 1800);
}

export async function runPageObserver(rawUrl: string): Promise<void> {
  const currentUrl = new URL(rawUrl);
  if (!isYouTubeSurface(currentUrl)) {
    return;
  }

  const preferences = await readPreferences();
  const state = parseUrlState(rawUrl);
  const decision = resolveSearchState(state, preferences);

  if (!decision.shouldRedirect || !decision.targetUrl) {
    return;
  }

  const gate = createNavigationGate();
  const mayNavigate = gate.canNavigate(rawUrl, decision.targetUrl);
  if (!mayNavigate) {
    return;
  }

  if (preferences.debugOverlay) {
    renderDebugBanner(`Search Flow: ${decision.reasonCode}`);
  }
  location.replace(decision.targetUrl);
}

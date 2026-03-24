export type PageKind = "results" | "shorts" | "watch" | "other";

export interface ParsedUrlState {
  rawUrl: string;
  pageKind: PageKind;
  searchTerm: string | null;
  filters: Record<string, string>;
  continuationToken: string | null;
  isShorts: boolean;
  isResultsPage: boolean;
}

export type CorrectionMode = "balanced" | "strict";

export interface UserPreferences {
  enabled: boolean;
  correctionMode: CorrectionMode;
  debugOverlay: boolean;
  lastUpdated: number;
}

export interface RedirectDecision {
  shouldRedirect: boolean;
  targetUrl: string | null;
  reasonCode: "shorts_surface" | "canonical_results" | "none";
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  enabled: true,
  correctionMode: "balanced",
  debugOverlay: false,
  lastUpdated: Date.now(),
};

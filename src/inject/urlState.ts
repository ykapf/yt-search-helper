import type { ParsedUrlState } from "../shared/contracts";

function normalizeSearchTerm(url: URL): string | null {
  const term = url.searchParams.get("search_query") ?? url.searchParams.get("q");
  if (!term) {
    return null;
  }
  const clean = term.trim();
  return clean.length > 0 ? clean : null;
}

export function parseUrlState(rawUrl: string): ParsedUrlState {
  const url = new URL(rawUrl);
  const pathname = url.pathname;
  const searchTerm = normalizeSearchTerm(url);

  const pageKind: ParsedUrlState["pageKind"] =
    pathname === "/results"
      ? "results"
      : pathname.startsWith("/shorts")
        ? "shorts"
        : pathname === "/watch"
          ? "watch"
          : "other";

  const filters: Record<string, string> = {};
  for (const [key, value] of url.searchParams.entries()) {
    filters[key] = value;
  }

  return {
    rawUrl,
    pageKind,
    searchTerm,
    filters,
    continuationToken: url.searchParams.get("ctoken"),
    isShorts: pageKind === "shorts",
    isResultsPage: pageKind === "results",
  };
}

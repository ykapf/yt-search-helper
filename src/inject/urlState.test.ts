import { describe, expect, it } from "vitest";
import { parseUrlState } from "./urlState";

describe("parseUrlState", () => {
  it("parses results page search term", () => {
    const state = parseUrlState(
      "https://www.youtube.com/results?search_query=lofi+beats&sp=EgIQAQ%3D%3D",
    );
    expect(state.pageKind).toBe("results");
    expect(state.searchTerm).toBe("lofi beats");
    expect(state.isResultsPage).toBe(true);
  });

  it("parses shorts page as shorts surface", () => {
    const state = parseUrlState(
      "https://www.youtube.com/shorts/abc123?search_query=rock",
    );
    expect(state.pageKind).toBe("shorts");
    expect(state.isShorts).toBe(true);
    expect(state.searchTerm).toBe("rock");
  });
});

import { describe, expect, it } from "vitest";
import { createNavigationGate } from "./navigationGate";

describe("createNavigationGate", () => {
  it("blocks repeated redirects inside cooldown window", () => {
    let nowValue = 1000;
    let memory: unknown = null;
    const gate = createNavigationGate({
      now: () => nowValue,
      cooldownMs: 1500,
      readStamp: () => memory as never,
      writeStamp: (value) => {
        memory = value;
      },
    });

    const source = "https://www.youtube.com/results?search_query=metal";
    const target = "https://www.youtube.com/results?search_query=metal&hl=en";

    expect(gate.canNavigate(source, target)).toBe(true);
    nowValue += 500;
    expect(gate.canNavigate(source, target)).toBe(false);
    nowValue += 1600;
    expect(gate.canNavigate(source, target)).toBe(true);
  });
});

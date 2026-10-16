import { describe, it, expect } from "vitest";
import { mapRuleToWcagCriteria, WCAG_CATALOG } from "@/lib/wcag/catalog";

describe("WCAG 2.2 Criterion Mapping Suite", () => {
  it("maps image-alt rule directly to WCAG 1.1.1 Non-text Content", () => {
    const criteria = mapRuleToWcagCriteria("image-alt", ["wcag111"]);
    expect(criteria.some((c) => c.num === "1.1.1")).toBe(true);
    const c111 = criteria.find((c) => c.num === "1.1.1");
    expect(c111?.level).toBe("A");
    expect(c111?.principle).toBe("Perceivable");
  });

  it("maps color-contrast to WCAG 1.4.3 Contrast Minimum Level AA", () => {
    const criteria = mapRuleToWcagCriteria("color-contrast", ["wcag143", "wcag2aa"]);
    expect(criteria.some((c) => c.num === "1.4.3")).toBe(true);
    const c143 = criteria.find((c) => c.num === "1.4.3");
    expect(c143?.level).toBe("AA");
  });

  it("maps button-name to WCAG 4.1.2 Name Role Value Level A", () => {
    const criteria = mapRuleToWcagCriteria("button-name", ["wcag412"]);
    expect(criteria.some((c) => c.num === "4.1.2")).toBe(true);
    const c412 = criteria.find((c) => c.num === "4.1.2");
    expect(c412?.principle).toBe("Robust");
  });

  it("catalog contains all 4 WCAG principles", () => {
    const all = Object.values(WCAG_CATALOG);
    const principles = new Set(all.map((c) => c.principle));
    expect(principles.has("Perceivable")).toBe(true);
    expect(principles.has("Operable")).toBe(true);
    expect(principles.has("Understandable")).toBe(true);
    expect(principles.has("Robust")).toBe(true);
  });
});

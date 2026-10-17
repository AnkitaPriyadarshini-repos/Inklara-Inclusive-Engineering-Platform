import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Inklara Brand Identity & Design System Assets", () => {
  const rootDir = process.cwd();

  it("ensures vector SVG brand symbol exists and contains aperture, doorway and check geometry", () => {
    const symbolPath = path.join(rootDir, "public", "brand", "inklara-symbol.svg");
    expect(fs.existsSync(symbolPath)).toBe(true);
    const content = fs.readFileSync(symbolPath, "utf-8");
    expect(content).toContain("<svg");
    expect(content).toContain("inklara-portal");
    expect(content).toContain("inklara-lens");
    expect(content).toContain("inklara-verify");
  });

  it("ensures SVG favicon is present in public root", () => {
    const faviconPath = path.join(rootDir, "public", "favicon.svg");
    expect(fs.existsSync(faviconPath)).toBe(true);
    const content = fs.readFileSync(faviconPath, "utf-8");
    expect(content).toContain("<svg");
  });

  it("ensures both dark and light horizontal logo lockups exist", () => {
    const darkLogoPath = path.join(rootDir, "public", "brand", "inklara-logo-dark.svg");
    const lightLogoPath = path.join(rootDir, "public", "brand", "inklara-logo-light.svg");
    expect(fs.existsSync(darkLogoPath)).toBe(true);
    expect(fs.existsSync(lightLogoPath)).toBe(true);

    const darkContent = fs.readFileSync(darkLogoPath, "utf-8");
    const lightContent = fs.readFileSync(lightLogoPath, "utf-8");
    expect(darkContent).toContain("Inklara");
    expect(lightContent).toContain("Inklara");
  });

  it("ensures brand specification document exists with color tokens", () => {
    const specPath = path.join(rootDir, "docs", "brand-specification.md");
    expect(fs.existsSync(specPath)).toBe(true);
    const specContent = fs.readFileSync(specPath, "utf-8");
    expect(specContent).toContain("Inklara reveals what interfaces leave behind");
    expect(specContent).toContain("#6366f1"); // Primary Brand Indigo
    expect(specContent).toContain("#10b981"); // Verification Emerald
  });
});

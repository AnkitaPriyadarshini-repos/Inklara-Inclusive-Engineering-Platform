import { describe, it, expect } from "vitest";
import {
  escapeHtml,
  sanitizeHtmlSnippet,
  computeFindingFingerprint,
} from "@/lib/scanner/sanitizer";

describe("HTML Sanitizer & Fingerprinting Suite", () => {
  it("escapes dangerous HTML characters to prevent XSS in audit reports", () => {
    const raw = `<script>alert('xss')</script><img src="x" onerror="steal()">`;
    const escaped = escapeHtml(raw);
    expect(escaped).not.toContain("<script>");
    expect(escaped).toContain("&lt;script&gt;");
    expect(escaped).toContain("&quot;x&quot;");
    expect(escaped).toContain("&#039;xss&#039;");
  });

  it("truncates excessively long HTML snippets safely", () => {
    const huge = "<div>" + "a".repeat(1500) + "</div>";
    const sanitized = sanitizeHtmlSnippet(huge, 100);
    expect(sanitized.length).toBeLessThanOrEqual(200);
    expect(sanitized).toContain("[truncated]");
  });

  it("produces deterministic fingerprints for equivalent findings", () => {
    const fp1 = computeFindingFingerprint(
      "color-contrast",
      "main > p.text-gray-400",
      '<p class="text-gray-400">Hello</p>'
    );
    const fp2 = computeFindingFingerprint(
      "color-contrast",
      "main > p.text-gray-400",
      '<p class="text-gray-400">Hello</p>'
    );
    expect(fp1).toBe(fp2);
    expect(fp1.length).toBe(16);
  });

  it("differentiates findings with different selectors or rule IDs", () => {
    const fp1 = computeFindingFingerprint(
      "color-contrast",
      "main > p.first",
      "<p>First</p>"
    );
    const fp2 = computeFindingFingerprint(
      "color-contrast",
      "main > p.second",
      "<p>Second</p>"
    );
    expect(fp1).not.toBe(fp2);
  });
});

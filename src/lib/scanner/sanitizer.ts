import crypto from "node:crypto";

/**
 * Escapes raw HTML text to prevent XSS attacks when rendering audited evidence.
 */
export function escapeHtml(unsafeText: string): string {
  if (!unsafeText) return "";
  return unsafeText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sanitizes and truncates HTML snippet evidence to a safe readable length.
 */
export function sanitizeHtmlSnippet(rawHtml: string, maxLength = 800): string {
  if (!rawHtml) return "";
  const trimmed = rawHtml.trim();
  const truncated =
    trimmed.length > maxLength
      ? `${trimmed.substring(0, maxLength)} ... [truncated]`
      : trimmed;
  return escapeHtml(truncated);
}

/**
 * Computes a deterministic fingerprint for an accessibility finding.
 * Uses ruleId, selector, and normalized HTML to track findings reliably across audit runs.
 */
export function computeFindingFingerprint(
  ruleId: string,
  selector: string,
  htmlSnippet: string
): string {
  // Normalize selector and html to avoid trivial whitespace variances
  const normalizedSelector = selector.trim().toLowerCase();
  const normalizedSnippet = htmlSnippet.trim().replace(/\s+/g, " ").slice(0, 300);
  const data = `${ruleId}::${normalizedSelector}::${normalizedSnippet}`;
  return crypto.createHash("sha256").update(data).digest("hex").slice(0, 16);
}

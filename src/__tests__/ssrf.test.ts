import { describe, it, expect } from "vitest";
import {
  validateTargetUrl,
  isPrivateOrReservedIpv4,
  isPrivateOrReservedIpv6,
} from "@/lib/scanner/ssrf";

describe("SSRF Protection Security Suite", () => {
  it("blocks non-HTTP protocols like file:, gopher:, ftp:, javascript:", async () => {
    const fileResult = await validateTargetUrl("file:///etc/passwd");
    expect(fileResult.isValid).toBe(false);
    expect(fileResult.error).toContain("Protocol 'file:' is forbidden");

    const jsResult = await validateTargetUrl("javascript:alert(1)");
    expect(jsResult.isValid).toBe(false);

    const ftpResult = await validateTargetUrl("ftp://example.com");
    expect(ftpResult.isValid).toBe(false);
  });

  it("blocks AWS / GCP / Azure cloud metadata IP (169.254.169.254)", async () => {
    const res = await validateTargetUrl("http://169.254.169.254/latest/meta-data/");
    expect(res.isValid).toBe(false);
    expect(res.error).toContain("private, link-local, or reserved");
  });

  it("blocks internal cloud metadata hostnames", async () => {
    const res = await validateTargetUrl("http://metadata.google.internal/computeMetadata/v1/");
    expect(res.isValid).toBe(false);
    expect(res.error).toContain("Access to internal metadata host");
  });

  it("blocks private IPv4 ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)", () => {
    expect(isPrivateOrReservedIpv4("10.0.0.1")).toBe(true);
    expect(isPrivateOrReservedIpv4("10.255.255.255")).toBe(true);
    expect(isPrivateOrReservedIpv4("172.16.0.5")).toBe(true);
    expect(isPrivateOrReservedIpv4("172.31.255.255")).toBe(true);
    expect(isPrivateOrReservedIpv4("192.168.1.1")).toBe(true);
    expect(isPrivateOrReservedIpv4("192.168.0.254")).toBe(true);
    expect(isPrivateOrReservedIpv4("169.254.1.1")).toBe(true);
    expect(isPrivateOrReservedIpv4("127.0.0.1")).toBe(true);
    expect(isPrivateOrReservedIpv4("0.0.0.0")).toBe(true);
  });

  it("permits public non-reserved IPv4 addresses", () => {
    expect(isPrivateOrReservedIpv4("8.8.8.8")).toBe(false);
    expect(isPrivateOrReservedIpv4("1.1.1.1")).toBe(false);
    expect(isPrivateOrReservedIpv4("142.250.190.46")).toBe(false);
  });

  it("blocks loopback and unique-local IPv6 addresses", () => {
    expect(isPrivateOrReservedIpv6("::1")).toBe(true);
    expect(isPrivateOrReservedIpv6("::")).toBe(true);
    expect(isPrivateOrReservedIpv6("fc00::1")).toBe(true);
    expect(isPrivateOrReservedIpv6("fe80::1")).toBe(true);
  });

  it("blocks IPv4-mapped IPv6 addresses (both dotted and hex format)", () => {
    // Dotted IPv4-mapped IPv6
    expect(isPrivateOrReservedIpv6("::ffff:127.0.0.1")).toBe(true);
    expect(isPrivateOrReservedIpv6("::ffff:169.254.169.254")).toBe(true);
    expect(isPrivateOrReservedIpv6("::ffff:10.0.0.1")).toBe(true);
    expect(isPrivateOrReservedIpv6("::ffff:192.168.1.1")).toBe(true);

    // Hex-encoded IPv4-mapped IPv6 (e.g. 7f00:1 is 127.0.0.1, a9fe:a9fe is 169.254.169.254)
    expect(isPrivateOrReservedIpv6("::ffff:7f00:1")).toBe(true);
    expect(isPrivateOrReservedIpv6("::ffff:a9fe:a9fe")).toBe(true);
    expect(isPrivateOrReservedIpv6("[::ffff:a9fe:a9fe]")).toBe(true);

    // Public IPv4-mapped IPv6
    expect(isPrivateOrReservedIpv6("::ffff:8.8.8.8")).toBe(false);
  });

  it("blocks URLs with alternative IP representations (integer dwords and octal/hex notation)", async () => {
    // Integer dwords
    const loopbackDword = await validateTargetUrl("http://2130706433/"); // 127.0.0.1
    expect(loopbackDword.isValid).toBe(false);

    const metadataDword = await validateTargetUrl("http://2852039166/"); // 169.254.169.254
    expect(metadataDword.isValid).toBe(false);
    expect(metadataDword.error).toMatch(/private, link-local, or reserved|Integer IP address/);

    // Octal and hex dotted notation (WHATWG parser normalizes to 127.0.0.1, which is blocked as loopback)
    const octalResult = await validateTargetUrl("http://0177.0.0.1/");
    expect(octalResult.isValid).toBe(false);

    const hexResult = await validateTargetUrl("http://0x7f.0.0.1/");
    expect(hexResult.isValid).toBe(false);
  });

  it("blocks URLs containing embedded authentication credentials", async () => {
    const res = await validateTargetUrl("http://admin:secret123@example.com/api");
    expect(res.isValid).toBe(false);
    expect(res.error).toContain("authentication credentials are not permitted");
  });

  it("handles bracketed IPv6 loopback URLs correctly", async () => {
    const blockedRes = await validateTargetUrl("http://[::1]:3000/demo", {
      allowLocalScanning: false,
    });
    expect(blockedRes.isValid).toBe(false);

    const allowedRes = await validateTargetUrl("http://[::1]:3000/demo", {
      allowLocalScanning: true,
    });
    expect(allowedRes.isValid).toBe(true);
  });

  it("fails closed in production environment even if allowLocalScanning is requested", async () => {
    const originalEnv = process.env.NODE_ENV;
    try {
      (process.env as Record<string, string | undefined>).NODE_ENV = "production";
      const res = await validateTargetUrl("http://localhost:3000/demo", {
        allowLocalScanning: true,
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toContain("Scanning localhost is disabled by security policy");
    } finally {
      (process.env as Record<string, string | undefined>).NODE_ENV = originalEnv;
    }
  });
});

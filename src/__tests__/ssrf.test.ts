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

  it("blocks localhost when allowLocalScanning is disabled", async () => {
    const res = await validateTargetUrl("http://localhost:3000/demo", {
      allowLocalScanning: false,
    });
    expect(res.isValid).toBe(false);
    expect(res.error).toContain("Scanning localhost is disabled");
  });

  it("permits localhost when allowLocalScanning is deliberately enabled for dev fixtures", async () => {
    const res = await validateTargetUrl("http://localhost:3000/demo/inaccessible", {
      allowLocalScanning: true,
    });
    expect(res.isValid).toBe(true);
    expect(res.sanitizedUrl).toBe("http://localhost:3000/demo/inaccessible");
  });
});

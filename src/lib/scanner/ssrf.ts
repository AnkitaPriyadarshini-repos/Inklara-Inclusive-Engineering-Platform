import dns from "node:dns/promises";
import net from "node:net";

export interface SsrfValidationResult {
  isValid: boolean;
  sanitizedUrl?: string;
  error?: string;
  resolvedIps?: string[];
}

/**
 * Checks if an IPv4 address is in private, link-local, loopback, or reserved ranges.
 */
export function isPrivateOrReservedIpv4(ip: string): boolean {
  const parts = ip.split(".").map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true; // Malformed is treated as dangerous
  }

  const [a, b] = parts;

  // 0.0.0.0/8 (Broadcast/Current network)
  if (a === 0) return true;
  // 10.0.0.0/8 (Private network)
  if (a === 10) return true;
  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;
  // 169.254.0.0/16 (Link-local & Cloud Metadata 169.254.169.254)
  if (a === 169 && b === 254) return true;
  // 172.16.0.0/12 (Private network: 172.16 - 172.31)
  if (a === 172 && b >= 16 && b <= 31) return true;
  // 192.168.0.0/16 (Private network)
  if (a === 192 && b === 168) return true;
  // 100.64.0.0/10 (Carrier-grade NAT)
  if (a === 100 && b >= 64 && b <= 127) return true;
  // 224.0.0.0/4 (Multicast)
  if (a >= 224 && a <= 239) return true;
  // 240.0.0.0/4 (Reserved)
  if (a >= 240) return true;

  return false;
}

/**
 * Checks if an IPv6 address is loopback, unique-local, link-local, or IPv4-mapped private.
 */
export function isPrivateOrReservedIpv6(ip: string): boolean {
  let normalized = ip.toLowerCase();
  if (normalized.startsWith("[") && normalized.endsWith("]")) {
    normalized = normalized.slice(1, -1);
  }

  // Loopback and unspecified
  if (normalized === "::1" || normalized === "::") return true;

  // IPv4-mapped IPv6 (e.g. ::ffff:127.0.0.1 or ::ffff:7f00:1 or ::ffff:a9fe:a9fe)
  if (normalized.startsWith("::ffff:") || normalized.startsWith("0:0:0:0:0:ffff:")) {
    const v4Part = normalized.replace(/^.*ffff:/, "");
    if (net.isIPv4(v4Part)) {
      return isPrivateOrReservedIpv4(v4Part);
    }
    // Handle hex-encoded IPv4 e.g. 7f00:1 or a9fe:a9fe
    const hexParts = v4Part.split(":");
    if (hexParts.length === 2) {
      const high = parseInt(hexParts[0], 16);
      const low = parseInt(hexParts[1], 16);
      if (!isNaN(high) && !isNaN(low)) {
        const byte1 = (high >> 8) & 0xff;
        const byte2 = high & 0xff;
        const byte3 = (low >> 8) & 0xff;
        const byte4 = low & 0xff;
        return isPrivateOrReservedIpv4(`${byte1}.${byte2}.${byte3}.${byte4}`);
      }
    }
    return true; // Malformed IPv4-mapped IPv6 fails closed
  }

  // Unique local addresses fc00::/7 (fc00:: - fdff::)
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;

  // Link-local addresses fe80::/10 (fe80:: - febf::)
  if (
    normalized.startsWith("fe8") ||
    normalized.startsWith("fe9") ||
    normalized.startsWith("fea") ||
    normalized.startsWith("feb")
  ) {
    return true;
  }

  // Multicast ff00::/8
  if (normalized.startsWith("ff")) return true;

  return false;
}

/**
 * Validates a target URL against SSRF attacks.
 * Verifies protocol, parses hostname, resolves DNS, and blocks private/cloud-metadata targets.
 */
export async function validateTargetUrl(
  inputUrl: string,
  options?: { allowLocalScanning?: boolean }
): Promise<SsrfValidationResult> {
  const isProduction = process.env.NODE_ENV === "production";
  const allowLocal =
    !isProduction &&
    (options?.allowLocalScanning ?? process.env.ALLOW_LOCAL_SCANNING === "true");

  let parsed: URL;
  try {
    parsed = new URL(inputUrl);
  } catch {
    return { isValid: false, error: "Invalid URL format." };
  }

  // Only permit HTTP and HTTPS
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return {
      isValid: false,
      error: `Protocol '${parsed.protocol}' is forbidden. Only http:// and https:// are permitted.`,
    };
  }

  const rawHost = parsed.hostname.toLowerCase();
  // Strip IPv6 brackets if present e.g. [::1] -> ::1
  const cleanHost =
    rawHost.startsWith("[") && rawHost.endsWith("]")
      ? rawHost.slice(1, -1)
      : rawHost;

  // Reject credentials in URL
  if (parsed.username || parsed.password) {
    return {
      isValid: false,
      error: "URLs containing authentication credentials are not permitted.",
    };
  }

  // Check known dangerous hostnames
  const forbiddenHostnames = [
    "metadata.google.internal",
    "metadata.azure.com",
    "instance-data",
    "localhost.localdomain",
  ];
  if (forbiddenHostnames.includes(cleanHost)) {
    return {
      isValid: false,
      error: `Access to internal metadata host '${cleanHost}' is strictly blocked.`,
    };
  }

  // Extract the unnormalized host string from inputUrl to detect obfuscated representations
  const rawUrlHostMatch = inputUrl.match(/^[a-zA-Z]+:\/\/([^/:]+)/);
  const rawUrlHost = rawUrlHostMatch ? rawUrlHostMatch[1].toLowerCase() : cleanHost;

  // Check for decimal / Dword integer IP literals e.g. 2130706433 (127.0.0.1) or 2852039166 (169.254.169.254)
  if (/^\d+$/.test(rawUrlHost) || /^\d+$/.test(cleanHost)) {
    return {
      isValid: false,
      error: `Integer IP address notation in '${rawUrlHost}' is forbidden.`,
    };
  }

  // Check for octal or hex dotted IP notation e.g. 0177.0.0.1 or 0x7f.0.0.1
  if (
    /^0x[0-9a-fA-F]+/i.test(rawUrlHost) ||
    /(^|\.)0\d+/.test(rawUrlHost) ||
    /^0x[0-9a-fA-F]+/i.test(cleanHost) ||
    /(^|\.)0\d+/.test(cleanHost)
  ) {
    return {
      isValid: false,
      error: `Non-standard octal or hex IP representation in '${rawUrlHost}' is forbidden.`,
    };
  }

  // Check local loopback explicitly
  const isLoopbackHost =
    cleanHost === "localhost" ||
    cleanHost === "127.0.0.1" ||
    cleanHost === "::1" ||
    cleanHost.endsWith(".localhost");

  if (isLoopbackHost) {
    if (!allowLocal) {
      return {
        isValid: false,
        error:
          "Scanning localhost is disabled by security policy. Enable ALLOW_LOCAL_SCANNING in development.",
      };
    }
    return {
      isValid: true,
      sanitizedUrl: parsed.toString(),
      resolvedIps: ["127.0.0.1"],
    };
  }

  // If host is an IPv4 literal
  if (net.isIPv4(cleanHost)) {
    if (isPrivateOrReservedIpv4(cleanHost)) {
      return {
        isValid: false,
        error: `Target IP ${cleanHost} is in a private, link-local, or reserved network range.`,
      };
    }
    return {
      isValid: true,
      sanitizedUrl: parsed.toString(),
      resolvedIps: [cleanHost],
    };
  }

  // If host is an IPv6 literal
  if (net.isIPv6(cleanHost)) {
    if (isPrivateOrReservedIpv6(cleanHost)) {
      return {
        isValid: false,
        error: `Target IPv6 ${cleanHost} is in a private, unique-local, or reserved network range.`,
      };
    }
    return {
      isValid: true,
      sanitizedUrl: parsed.toString(),
      resolvedIps: [cleanHost],
    };
  }

  // Resolve DNS to verify all IP addresses
  try {
    const lookupResults = await dns.lookup(cleanHost, { all: true });
    if (!lookupResults || lookupResults.length === 0) {
      return {
        isValid: false,
        error: `DNS resolution failed for hostname '${cleanHost}'.`,
      };
    }

    const resolvedIps = lookupResults.map((r) => r.address);

    for (const res of lookupResults) {
      if (res.family === 4 && isPrivateOrReservedIpv4(res.address)) {
        return {
          isValid: false,
          error: `Hostname '${cleanHost}' resolves to restricted internal IP ${res.address}.`,
          resolvedIps,
        };
      }
      if (res.family === 6 && isPrivateOrReservedIpv6(res.address)) {
        return {
          isValid: false,
          error: `Hostname '${cleanHost}' resolves to restricted internal IPv6 ${res.address}.`,
          resolvedIps,
        };
      }
    }

    return {
      isValid: true,
      sanitizedUrl: parsed.toString(),
      resolvedIps,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      isValid: false,
      error: `DNS lookup failed for '${cleanHost}': ${message}`,
    };
  }
}

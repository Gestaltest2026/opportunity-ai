import { DiscoverySource } from "./sourceUniverseSchema";

export function normalizeDiscoveryUrl(rawUrl: string, baseUrl?: string): string {
  const url = baseUrl ? new URL(rawUrl, baseUrl) : new URL(rawUrl);

  url.hash = "";
  url.hostname = url.hostname.toLowerCase();

  if ((url.protocol === "https:" && url.port === "443") || (url.protocol === "http:" && url.port === "80")) {
    url.port = "";
  }

  const removableParams = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "fbclid",
  ];
  for (const key of removableParams) {
    url.searchParams.delete(key);
  }

  url.searchParams.sort();

  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.replace(/\/+$/, "");
  }

  return url.toString();
}

function registrableDomain(hostname: string): string {
  const parts = hostname.toLowerCase().split(".").filter(Boolean);
  if (parts.length <= 2) return parts.join(".");
  return parts.slice(-2).join(".");
}

export function isTrustedDiscoveryUrl(candidateUrl: string, source: DiscoverySource): boolean {
  const candidate = new URL(candidateUrl);
  const origin = new URL(source.url);

  if (!['http:', 'https:'].includes(candidate.protocol)) return false;

  return registrableDomain(candidate.hostname) === registrableDomain(origin.hostname);
}

export function canTraverseDepth(source: DiscoverySource, depth: number): boolean {
  return Number.isInteger(depth) && depth >= 0 && depth <= source.discovery_depth;
}

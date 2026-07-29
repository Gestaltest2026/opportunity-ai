import { createHash } from "node:crypto";
import { normalizeDiscoveryUrl } from "./urlPolicy";

export function opportunityIdFromUrl(url: string): string {
  const normalized = normalizeDiscoveryUrl(url);
  const digest = createHash("sha256").update(normalized).digest("hex").slice(0, 16);
  return `opp-url-${digest}`;
}

export function sourceIdForOpportunity(opportunityId: string): string {
  return `source-${opportunityId}`;
}

import { createHash } from "node:crypto";
import {
  DiscoveryCandidate,
  DiscoveryCandidateSet,
} from "./candidateSchema";
import { DiscoverySource } from "./sourceUniverseSchema";
import {
  canTraverseDepth,
  isTrustedDiscoveryUrl,
  normalizeDiscoveryUrl,
} from "./urlPolicy";

interface ExtractCandidatesInput {
  source: DiscoverySource;
  pageUrl: string;
  html: string;
  depth: number;
  discoveredAt?: string;
}

interface LinkRecord {
  href: string;
  text: string | null;
}

function decodeBasicEntities(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function cleanAnchorText(value: string): string | null {
  const text = decodeBasicEntities(value.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
  return text || null;
}

export function extractHtmlLinks(html: string): LinkRecord[] {
  const links: LinkRecord[] = [];
  const anchorPattern = /<a\b[^>]*\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>([\s\S]*?)<\/a>/gi;

  for (const match of html.matchAll(anchorPattern)) {
    const href = decodeBasicEntities(match[1] ?? match[2] ?? match[3] ?? "").trim();
    if (!href) continue;
    links.push({ href, text: cleanAnchorText(match[4] ?? "") });
  }

  return links;
}

function candidateId(sourceId: string, url: string): string {
  return `candidate-${createHash("sha256")
    .update(`${sourceId}\n${url}`)
    .digest("hex")
    .slice(0, 16)}`;
}

export function extractDiscoveryCandidates({
  source,
  pageUrl,
  html,
  depth,
  discoveredAt = new Date().toISOString(),
}: ExtractCandidatesInput): DiscoveryCandidateSet {
  if (!canTraverseDepth(source, depth)) {
    return { candidates: [] };
  }

  const seen = new Set<string>();
  const candidates: DiscoveryCandidate[] = [];

  for (const link of extractHtmlLinks(html)) {
    let normalizedUrl: string;
    try {
      normalizedUrl = normalizeDiscoveryUrl(link.href, pageUrl);
    } catch {
      continue;
    }

    if (!isTrustedDiscoveryUrl(normalizedUrl, source)) continue;
    if (seen.has(normalizedUrl)) continue;
    seen.add(normalizedUrl);

    candidates.push({
      candidate_id: candidateId(source.source_id, normalizedUrl),
      source_id: source.source_id,
      provider: source.provider,
      url: normalizedUrl,
      title_hint: link.text,
      status: "discovered",
      discovered_at: discoveredAt,
      rejection_reason: null,
    });
  }

  return { candidates };
}

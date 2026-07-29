import { DiscoverySourceSchema } from "./sourceUniverseSchema";
import { extractDiscoveryCandidates } from "./extractDiscoveryCandidates";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const source = DiscoverySourceSchema.parse({
  source_id: "source-test-index",
  provider: "Example University",
  url: "https://example.edu/scholarships",
  source_type: "provider_index",
  enabled: true,
  discovery_depth: 1,
  refresh_interval_hours: 24,
  last_scanned_at: null,
  last_success_at: null,
  failure_count: 0,
});

const html = `
<html><body>
  <a href="/scholarships/alpha?utm_source=test#details">Alpha Scholarship</a>
  <a href="https://example.edu/scholarships/alpha">Alpha duplicate</a>
  <a href="https://example.edu/scholarships/beta?b=2&a=1">Beta <strong>Award</strong></a>
  <a href="https://external.example.com/scholarship">External</a>
  <a href="mailto:test@example.edu">Email</a>
  <a href="javascript:void(0)">Non-web link</a>
</body></html>`;

const result = extractDiscoveryCandidates({
  source,
  pageUrl: source.url,
  html,
  depth: 1,
  discoveredAt: "2026-07-29T00:00:00.000Z",
});

assert(result.candidates.length === 2, `Expected 2 candidates, found ${result.candidates.length}`);

const urls = result.candidates.map((candidate) => candidate.url).sort();
assert(
  urls[0] === "https://example.edu/scholarships/alpha",
  `Unexpected normalized alpha URL: ${urls[0]}`
);
assert(
  urls[1] === "https://example.edu/scholarships/beta?a=1&b=2",
  `Unexpected normalized beta URL: ${urls[1]}`
);
assert(
  result.candidates.every((candidate) => candidate.status === "discovered"),
  "All extracted candidates must start as discovered"
);
assert(
  result.candidates.some((candidate) => candidate.title_hint === "Beta Award"),
  "Expected cleaned anchor text as title hint"
);

const blockedByDepth = extractDiscoveryCandidates({
  source,
  pageUrl: source.url,
  html,
  depth: 2,
  discoveredAt: "2026-07-29T00:00:00.000Z",
});
assert(blockedByDepth.candidates.length === 0, "Depth overflow must produce no candidates");

console.log(
  JSON.stringify(
    {
      deterministic_link_extraction: "valid",
      trusted_domain_filter: "valid",
      normalized_deduplication: "valid",
      depth_enforcement: "valid",
      candidate_creation: "valid",
    },
    null,
    2
  )
);

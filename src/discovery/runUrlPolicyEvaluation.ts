import {
  canTraverseDepth,
  isTrustedDiscoveryUrl,
  normalizeDiscoveryUrl,
} from "./urlPolicy";
import { DiscoverySource } from "./sourceUniverseSchema";

const source: DiscoverySource = {
  source_id: "source-universe-test",
  provider: "FGCU",
  url: "https://www.fgcu.edu/academics/studyabroad/",
  source_type: "provider_index",
  enabled: true,
  discovery_depth: 1,
  refresh_interval_hours: 24,
  last_scanned_at: null,
  last_success_at: null,
  failure_count: 0,
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const normalized = normalizeDiscoveryUrl(
  "../studyabroad/scholarships/?utm_source=test&b=2&a=1#awards",
  source.url
);
assert(
  normalized === "https://www.fgcu.edu/academics/studyabroad/scholarships?a=1&b=2",
  `Unexpected normalized URL: ${normalized}`
);

assert(
  isTrustedDiscoveryUrl("https://www.fgcu.edu/admissionsandaid/", source),
  "Expected FGCU URL to be trusted"
);
assert(
  !isTrustedDiscoveryUrl("https://example.com/scholarships", source),
  "Expected external domain to be rejected"
);
assert(canTraverseDepth(source, 0), "Depth 0 should be allowed");
assert(canTraverseDepth(source, 1), "Depth 1 should be allowed");
assert(!canTraverseDepth(source, 2), "Depth 2 should exceed configured boundary");
assert(!canTraverseDepth(source, -1), "Negative depth should be rejected");

console.log(
  JSON.stringify(
    {
      url_normalization: "valid",
      trusted_domain_boundary: "valid",
      discovery_depth_boundary: "valid",
    },
    null,
    2
  )
);

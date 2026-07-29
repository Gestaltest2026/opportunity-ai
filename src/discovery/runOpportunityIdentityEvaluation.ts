import { opportunityIdFromUrl, sourceIdForOpportunity } from "./opportunityIdentity";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const a = opportunityIdFromUrl("https://Example.edu/scholarships/alpha/?utm_source=test#details");
const b = opportunityIdFromUrl("https://example.edu/scholarships/alpha");
const c = opportunityIdFromUrl("https://example.edu/scholarships/beta");

assert(a === b, "Normalized equivalent URLs must produce the same opportunity identity.");
assert(a !== c, "Distinct normalized URLs must produce distinct opportunity identities.");
assert(sourceIdForOpportunity(a) === `source-${a}`, "Source ID must derive deterministically from opportunity ID.");

console.log(
  JSON.stringify(
    {
      normalized_url_identity: "valid",
      distinct_url_identity: "valid",
      deterministic_source_identity: "valid",
    },
    null,
    2
  )
);

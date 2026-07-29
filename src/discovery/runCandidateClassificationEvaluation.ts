import { DiscoveryCandidateSchema } from "./candidateSchema";
import { classifyCandidate } from "./classifyCandidate";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function candidate(id: string, url: string, titleHint: string | null) {
  return DiscoveryCandidateSchema.parse({
    candidate_id: id,
    source_id: "source-test",
    provider: "Example University",
    url,
    title_hint: titleHint,
    status: "discovered",
    discovered_at: "2026-07-29T00:00:00.000Z",
    rejection_reason: null,
  });
}

const detail = classifyCandidate(
  candidate("detail", "https://example.edu/funding/alpha-scholarship", "Alpha Scholarship")
);
assert(detail.category === "opportunity_detail", "Expected opportunity detail classification");
assert(detail.disposition === "accept", "Opportunity detail should be accepted");

const news = classifyCandidate(
  candidate("news", "https://example.edu/news/new-scholarship-announced", "New scholarship announced")
);
assert(news.category === "news_or_article", "Expected news/article classification");
assert(news.disposition === "reject", "News/article should be rejected");

const general = classifyCandidate(
  candidate("general", "https://example.edu/about", "About Example University")
);
assert(general.category === "general_information", "Expected general information classification");
assert(general.disposition === "reject", "General information should be rejected");

const portal = classifyCandidate(
  candidate("portal", "https://example.edu/apply/scholarship-portal", "Scholarship Application Portal")
);
assert(portal.category === "application_portal", "Expected application portal classification");
assert(portal.disposition === "human_review", "Application portal should require human review");

const ambiguous = classifyCandidate(
  candidate("ambiguous", "https://example.edu/programs/community", "Community Programs")
);
assert(ambiguous.category === "unknown", "Expected unknown classification");
assert(ambiguous.disposition === "human_review", "Unknown candidates must require human review");

console.log(
  JSON.stringify(
    {
      opportunity_detail_accept: "valid",
      news_reject: "valid",
      general_information_reject: "valid",
      application_portal_human_review: "valid",
      unknown_human_review: "valid",
    },
    null,
    2
  )
);

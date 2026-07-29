import { z } from "zod";
import { DiscoveryCandidate } from "./candidateSchema";

export const CandidateClassificationSchema = z
  .object({
    candidate_id: z.string(),
    category: z.enum([
      "opportunity_detail",
      "application_portal",
      "provider_index",
      "news_or_article",
      "general_information",
      "unknown",
    ]),
    confidence: z.number().min(0).max(1),
    reason: z.string(),
    disposition: z.enum(["accept", "reject", "human_review"]),
  })
  .strict();

export type CandidateClassification = z.infer<typeof CandidateClassificationSchema>;

const OPPORTUNITY_TERMS = [
  "scholarship",
  "fellowship",
  "grant",
  "award",
  "waiver",
  "internship",
  "residency",
  "accelerator",
];

const INDEX_TERMS = ["scholarships", "fellowships", "grants", "opportunities", "financial-aid"];
const NEWS_TERMS = ["news", "press", "article", "blog", "story"];
const PORTAL_TERMS = ["apply", "application", "portal"];

function text(candidate: DiscoveryCandidate): string {
  return `${candidate.url} ${candidate.title_hint ?? ""}`.toLowerCase();
}

export function classifyCandidate(candidate: DiscoveryCandidate): CandidateClassification {
  const haystack = text(candidate);
  const url = new URL(candidate.url);
  const path = url.pathname.toLowerCase();

  if (NEWS_TERMS.some((term) => path.includes(`/${term}`))) {
    return {
      candidate_id: candidate.candidate_id,
      category: "news_or_article",
      confidence: 0.9,
      reason: "URL path contains a news/article signal.",
      disposition: "reject",
    };
  }

  if (PORTAL_TERMS.some((term) => haystack.includes(term)) && /apply|application|portal/.test(path)) {
    return {
      candidate_id: candidate.candidate_id,
      category: "application_portal",
      confidence: 0.85,
      reason: "URL/title contains an application portal signal.",
      disposition: "human_review",
    };
  }

  const opportunityHits = OPPORTUNITY_TERMS.filter((term) => haystack.includes(term)).length;
  const indexHits = INDEX_TERMS.filter((term) => path.includes(term)).length;

  if (opportunityHits >= 1 && indexHits === 0) {
    return {
      candidate_id: candidate.candidate_id,
      category: "opportunity_detail",
      confidence: 0.8,
      reason: "Candidate contains an opportunity-type signal without a strong index-page signal.",
      disposition: "accept",
    };
  }

  if (indexHits >= 1 && opportunityHits >= 1) {
    return {
      candidate_id: candidate.candidate_id,
      category: "provider_index",
      confidence: 0.75,
      reason: "Path and title resemble a provider opportunity index rather than a single detail page.",
      disposition: "human_review",
    };
  }

  if (["/", "/about", "/admissions", "/financialaid", "/financial-aid"].includes(path)) {
    return {
      candidate_id: candidate.candidate_id,
      category: "general_information",
      confidence: 0.8,
      reason: "Candidate points to a general provider/information page.",
      disposition: "reject",
    };
  }

  return {
    candidate_id: candidate.candidate_id,
    category: "unknown",
    confidence: 0.4,
    reason: "Deterministic signals are insufficient for safe classification.",
    disposition: "human_review",
  };
}

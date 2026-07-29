import { OpportunityDatabank } from "../databank/schema";
import { upsertOpportunity } from "../databank/upsertOpportunity";
import { extractOpportunity } from "../opportunity/extractOpportunity";
import { fetchSource } from "./fetchSource";
import { CandidateClassification } from "./classifyCandidate";
import { DiscoveryCandidate } from "./candidateSchema";
import { SourceRegistry } from "./schema";
import { opportunityIdFromUrl, sourceIdForOpportunity } from "./opportunityIdentity";

export interface IntakeAcceptedCandidateResult {
  databank: OpportunityDatabank;
  registry: SourceRegistry;
  opportunity_id: string;
}

export async function intakeAcceptedCandidate(args: {
  candidate: DiscoveryCandidate;
  classification: CandidateClassification;
  databank: OpportunityDatabank;
  registry: SourceRegistry;
  checkedAt?: string;
}): Promise<IntakeAcceptedCandidateResult> {
  const { candidate, classification } = args;

  if (classification.candidate_id !== candidate.candidate_id) {
    throw new Error("Candidate/classification identity mismatch.");
  }

  if (classification.disposition !== "accept" || classification.category !== "opportunity_detail") {
    throw new Error("Only accepted opportunity-detail candidates may enter Opportunity intake.");
  }

  const fetched = await fetchSource(candidate.url);
  const opportunityId = opportunityIdFromUrl(fetched.url);
  const opportunity = await extractOpportunity(opportunityId, fetched.source_text);
  const checkedAt = args.checkedAt ?? fetched.fetched_at;

  const databank = upsertOpportunity(
    args.databank,
    opportunity,
    fetched.url,
    fetched.source_text,
    checkedAt
  );

  const sourceId = sourceIdForOpportunity(opportunityId);
  const existingIndex = args.registry.sources.findIndex(
    (source) => source.opportunity_id === opportunityId || source.source_id === sourceId
  );

  const nextSource = {
    source_id: sourceId,
    opportunity_id: opportunityId,
    url: fetched.url,
    provider: opportunity.provider,
    source_type: "official_opportunity_page" as const,
    enabled: true,
    refresh_interval_hours: 24,
    last_fetched_at: checkedAt,
    last_success_at: checkedAt,
    failure_count: 0,
  };

  const registry: SourceRegistry = {
    sources:
      existingIndex === -1
        ? [...args.registry.sources, nextSource]
        : args.registry.sources.map((source, index) =>
            index === existingIndex ? { ...source, ...nextSource } : source
          ),
  };

  return { databank, registry, opportunity_id: opportunityId };
}

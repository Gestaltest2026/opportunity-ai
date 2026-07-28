import { Applicant } from "../extraction/applicantSchema";
import { OpportunityDatabank } from "../databank/schema";
import { evaluateMatch } from "./evaluateMatch";
import { Match } from "./schema";

export interface RankedMatch {
  match: Match;
  rank: number;
}

function sortKey(match: Match): number {
  if (match.eligibility_status === "ineligible") return -2;
  if (match.eligibility_status === "needs_clarification") return -1;
  return match.score ?? 0;
}

export async function rankDatabank(
  applicantId: string,
  applicant: Applicant,
  databank: OpportunityDatabank
): Promise<RankedMatch[]> {
  const openRecords = databank.records.filter(
    (record) => record.opportunity.availability_status === "open"
  );

  const matches = await Promise.all(
    openRecords.map((record) =>
      evaluateMatch(applicantId, applicant, record.opportunity)
    )
  );

  return matches
    .sort((a, b) => sortKey(b) - sortKey(a))
    .map((match, index) => ({ match, rank: index + 1 }));
}

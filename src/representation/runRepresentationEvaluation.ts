import { readFile } from "node:fs/promises";
import {
  OpportunitySpecificRepresentationSchema,
  type OpportunitySpecificRepresentation,
} from "./schema";

function jaccard(a: string[], b: string[]): number {
  const left = new Set(a.map((value) => value.toLowerCase()));
  const right = new Set(b.map((value) => value.toLowerCase()));
  const union = new Set([...left, ...right]);
  if (union.size === 0) return 1;
  let intersection = 0;
  for (const value of left) {
    if (right.has(value)) intersection += 1;
  }
  return intersection / union.size;
}

function primaryClaims(representation: OpportunitySpecificRepresentation): string[] {
  return representation.selected_claims
    .filter((claim) => claim.role === "primary")
    .map((claim) => claim.claim_text);
}

async function main() {
  const raw = JSON.parse(
    await readFile("examples/applicant-001/representations-v0.json", "utf8")
  );

  const representations = OpportunitySpecificRepresentationSchema.array().parse(raw);
  if (representations.length !== 3) {
    throw new Error(`Expected exactly 3 representations, got ${representations.length}`);
  }

  const comparisons = [];
  for (let i = 0; i < representations.length; i += 1) {
    for (let j = i + 1; j < representations.length; j += 1) {
      const left = representations[i];
      const right = representations[j];
      const primaryClaimOverlap = jaccard(primaryClaims(left), primaryClaims(right));
      const themeOverlap = jaccard(
        left.primary_narrative_themes,
        right.primary_narrative_themes
      );

      comparisons.push({
        pair: `${left.opportunity_id}:${right.opportunity_id}`,
        primary_claim_overlap: primaryClaimOverlap,
        theme_overlap: themeOverlap,
      });

      if (primaryClaimOverlap === 1 && themeOverlap === 1) {
        throw new Error(
          `Representations ${left.opportunity_id} and ${right.opportunity_id} are not materially differentiated`
        );
      }
    }
  }

  console.log(
    JSON.stringify(
      {
        representation_count: representations.length,
        schema_valid: true,
        comparisons,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

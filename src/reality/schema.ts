import { z } from "zod";
import {
  OpportunityAvailabilityStatusSchema,
  OpportunityTypeSchema,
} from "../opportunity/schema";

export const RealityDatasetEntrySchema = z.object({
  opportunity_id: z.string(),
  source_url: z.string().url(),
  source_type: z.literal("official"),
  applicant_relevance: z.enum([
    "direct",
    "plausible",
    "contrast_case",
  ]),
  verification_status: z.enum([
    "source_verified",
    "ground_truth_verified",
    "llm_evaluated",
  ]),
  expected_branch: z.enum([
    "eligible_actionable",
    "eligible_unavailable",
    "ineligible",
    "needs_clarification",
  ]),
  opportunity_type: OpportunityTypeSchema,
  availability_status: OpportunityAvailabilityStatusSchema,
  notes: z.string(),
});

export const RealityDatasetManifestSchema = z.object({
  dataset_id: z.string(),
  applicant_id: z.string(),
  target_size: z.number().int().min(10).max(20),
  entries: z.array(RealityDatasetEntrySchema),
});

export type RealityDatasetEntry = z.infer<typeof RealityDatasetEntrySchema>;
export type RealityDatasetManifest = z.infer<
  typeof RealityDatasetManifestSchema
>;

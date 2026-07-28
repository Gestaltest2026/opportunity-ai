import { z } from "zod";
import {
  Opportunity,
  OpportunitySchema,
} from "../opportunity/schema";

export const OPPORTUNITY_RECORD_STATUSES = [
  "active",
  "upcoming",
  "closed",
  "unknown",
] as const;

export const OpportunityRecordStatusSchema = z.enum(OPPORTUNITY_RECORD_STATUSES);

export const OpportunityRecordSchema = z
  .object({
    opportunity: OpportunitySchema,
    source_url: z.string(),
    first_seen_at: z.string(),
    last_checked_at: z.string(),
    last_changed_at: z.string(),
    raw_source_hash: z.string(),
    semantic_hash: z.string(),
    source_hash: z.string().optional(),
  })
  .strict();

export const OpportunityDatabankSchema = z
  .object({
    records: z.array(OpportunityRecordSchema),
  })
  .strict();

export type OpportunityRecordStatus = z.infer<
  typeof OpportunityRecordStatusSchema
>;
export type OpportunityRecord = z.infer<typeof OpportunityRecordSchema>;
export type OpportunityDatabank = z.infer<typeof OpportunityDatabankSchema>;

export function deriveOpportunityRecordStatus(
  opportunity: Opportunity
): OpportunityRecordStatus {
  switch (opportunity.availability_status) {
    case "open":
      return "active";
    case "closed":
      return "closed";
    case "upcoming":
      return "upcoming";
    default:
      return "unknown";
  }
}

export function isOpportunityDatabank(value: unknown): value is OpportunityDatabank {
  return OpportunityDatabankSchema.safeParse(value).success;
}

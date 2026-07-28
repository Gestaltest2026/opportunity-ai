import { z } from "zod";

export const SOURCE_TYPES = [
  "official_opportunity_page",
  "provider_index",
  "directory",
  "other",
] as const;

export const SourceTypeSchema = z.enum(SOURCE_TYPES);

export const OpportunitySourceSchema = z.object({
  source_id: z.string(),
  opportunity_id: z.string(),
  url: z.string().url(),
  provider: z.string(),
  source_type: SourceTypeSchema,
  enabled: z.boolean(),
  refresh_interval_hours: z.number().positive(),
  last_fetched_at: z.string().nullable(),
  last_success_at: z.string().nullable(),
  failure_count: z.number().int().nonnegative(),
});

export const SourceRegistrySchema = z.object({
  sources: z.array(OpportunitySourceSchema),
});

export type SourceType = z.infer<typeof SourceTypeSchema>;
export type OpportunitySource = z.infer<typeof OpportunitySourceSchema>;
export type SourceRegistry = z.infer<typeof SourceRegistrySchema>;

export function isOpportunitySource(value: unknown): value is OpportunitySource {
  return OpportunitySourceSchema.safeParse(value).success;
}

export function isSourceRegistry(value: unknown): value is SourceRegistry {
  return SourceRegistrySchema.safeParse(value).success;
}

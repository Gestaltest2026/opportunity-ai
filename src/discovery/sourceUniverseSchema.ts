import { z } from "zod";

export const DISCOVERY_SOURCE_TYPES = [
  "provider_home",
  "provider_index",
  "official_opportunity_page",
  "directory",
] as const;

export const DiscoverySourceTypeSchema = z.enum(DISCOVERY_SOURCE_TYPES);

export const DiscoverySourceSchema = z
  .object({
    source_id: z.string(),
    provider: z.string(),
    url: z.string().url(),
    source_type: DiscoverySourceTypeSchema,
    enabled: z.boolean(),
    discovery_depth: z.number().int().min(0).max(2),
    refresh_interval_hours: z.number().positive(),
    last_scanned_at: z.string().nullable(),
    last_success_at: z.string().nullable(),
    failure_count: z.number().int().nonnegative(),
  })
  .strict();

export const SourceUniverseSchema = z
  .object({
    sources: z.array(DiscoverySourceSchema),
  })
  .strict();

export type DiscoverySource = z.infer<typeof DiscoverySourceSchema>;
export type SourceUniverse = z.infer<typeof SourceUniverseSchema>;

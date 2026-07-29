import { z } from "zod";

export const DiscoveryCandidateStatusSchema = z.enum([
  "discovered",
  "accepted",
  "rejected",
]);

export const DiscoveryCandidateSchema = z
  .object({
    candidate_id: z.string(),
    source_id: z.string(),
    provider: z.string(),
    url: z.string().url(),
    title_hint: z.string().nullable(),
    status: DiscoveryCandidateStatusSchema,
    discovered_at: z.string(),
    rejection_reason: z.string().nullable(),
  })
  .strict();

export const DiscoveryCandidateSetSchema = z
  .object({
    candidates: z.array(DiscoveryCandidateSchema),
  })
  .strict();

export type DiscoveryCandidate = z.infer<typeof DiscoveryCandidateSchema>;
export type DiscoveryCandidateSet = z.infer<typeof DiscoveryCandidateSetSchema>;

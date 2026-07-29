import { z } from "zod";

export const CURATED_SOURCE_TIERS = [
  "official",
  "semi_official",
  "aggregator",
  "archive",
] as const;

export const CURATED_SOURCE_ROLES = [
  "application_source",
  "discovery_source",
  "monitoring_source",
  "pattern_archive",
] as const;

export const USER_RELEVANCE_LEVELS = [
  "high",
  "medium",
  "low",
  "pattern_only",
] as const;

export const WATCHLIST_ACTIONABILITY_LEVELS = [
  "application_ready",
  "needs_verification",
  "watch_next_cycle",
  "monitor_only",
  "pattern_only",
] as const;

export const WATCHLIST_CURRENT_STATUSES = [
  "open",
  "closed",
  "upcoming",
  "recurring",
  "unknown",
  "pattern_only",
] as const;

export const WATCHLIST_VERIFICATION_POLICIES = [
  "official_source_required",
  "aggregator_must_be_verified_at_sponsor",
  "pattern_only_no_recommendation",
] as const;

export const CuratedSourceTierSchema = z.enum(CURATED_SOURCE_TIERS);
export const CuratedSourceRoleSchema = z.enum(CURATED_SOURCE_ROLES);
export const UserRelevanceLevelSchema = z.enum(USER_RELEVANCE_LEVELS);
export const WatchlistActionabilityLevelSchema = z.enum(
  WATCHLIST_ACTIONABILITY_LEVELS
);
export const WatchlistCurrentStatusSchema = z.enum(WATCHLIST_CURRENT_STATUSES);
export const WatchlistVerificationPolicySchema = z.enum(
  WATCHLIST_VERIFICATION_POLICIES
);

export const CuratedOpportunitySourceSchema = z
  .object({
    source_id: z.string().min(1),
    name: z.string().min(1),
    url: z.string().url(),
    provider: z.string().min(1),
    source_tier: CuratedSourceTierSchema,
    source_role: CuratedSourceRoleSchema,
    opportunity_classes: z.array(z.string().min(1)),
    eligibility_signals: z.array(z.string().min(1)),
    narrative_signals: z.array(z.string().min(1)),
    funder_intent_signals: z.array(z.string().min(1)),
    user_001_relevance: UserRelevanceLevelSchema,
    watch_reason: z.array(z.string().min(1)),
    actionability: WatchlistActionabilityLevelSchema,
    current_status: WatchlistCurrentStatusSchema,
    verification_policy: WatchlistVerificationPolicySchema,
    enabled: z.boolean(),
    refresh_interval_hours: z.number().positive(),
    last_checked_at: z.string().nullable(),
    last_success_at: z.string().nullable(),
    last_changed_at: z.string().nullable(),
    content_hash: z.string().nullable(),
    last_observed_signal_summary: z.string().nullable(),
    failure_count: z.number().int().nonnegative(),
    notes: z.array(z.string().min(1)),
  })
  .strict();

export const CuratedOpportunityWatchlistSchema = z
  .object({
    applicant_id: z.string().min(1),
    generated_for: z.string().min(1),
    purpose: z.string().min(1),
    rules: z.array(z.string().min(1)),
    sources: z.array(CuratedOpportunitySourceSchema),
  })
  .strict();

export type CuratedSourceTier = z.infer<typeof CuratedSourceTierSchema>;
export type CuratedSourceRole = z.infer<typeof CuratedSourceRoleSchema>;
export type UserRelevanceLevel = z.infer<typeof UserRelevanceLevelSchema>;
export type WatchlistActionabilityLevel = z.infer<
  typeof WatchlistActionabilityLevelSchema
>;
export type WatchlistCurrentStatus = z.infer<typeof WatchlistCurrentStatusSchema>;
export type WatchlistVerificationPolicy = z.infer<
  typeof WatchlistVerificationPolicySchema
>;
export type CuratedOpportunitySource = z.infer<
  typeof CuratedOpportunitySourceSchema
>;
export type CuratedOpportunityWatchlist = z.infer<
  typeof CuratedOpportunityWatchlistSchema
>;

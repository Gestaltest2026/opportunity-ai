import type {
  CuratedOpportunitySource,
  CuratedOpportunityWatchlist,
} from "./schema";

export const SOURCE_COVERAGE_CATEGORIES = [
  "FGCU_INTERNAL",
  "FLORIDA_PUBLIC_AID",
  "ADULT_RETURNING_LEARNER",
  "WOMEN_MOTHERS_CAREGIVERS",
  "LEGAL_PARALEGAL_PUBLIC_SERVICE",
  "LOCAL_SOUTHWEST_FLORIDA",
  "DISCOVERY_AGGREGATOR_ARCHIVE",
] as const;

export type SourceCoverageCategory = (typeof SOURCE_COVERAGE_CATEGORIES)[number];

export interface SourceUniverseCompletionCriteria {
  min_total_sources: number;
  min_source_categories: number;
  min_official_or_semi_official_sources: number;
  min_official_application_sources: number;
  min_pattern_or_archive_sources: number;
  min_high_relevance_sources: number;
  min_watch_next_cycle_sources: number;
  max_unclassified_sources: number;
}

export const PHASE_2_SOURCE_UNIVERSE_COMPLETION_CRITERIA: SourceUniverseCompletionCriteria = {
  min_total_sources: 50,
  min_source_categories: SOURCE_COVERAGE_CATEGORIES.length,
  min_official_or_semi_official_sources: 30,
  min_official_application_sources: 10,
  min_pattern_or_archive_sources: 10,
  min_high_relevance_sources: 15,
  min_watch_next_cycle_sources: 10,
  max_unclassified_sources: 0,
};

export interface SourceCoverageThreshold {
  id: string;
  label: string;
  operator: "at_least" | "at_most";
  target: number;
  actual: number;
  passed: boolean;
}

export interface SourceCoverageReport {
  applicant_id: string;
  generated_at: string;
  phase: "PHASE_2";
  purpose: string;
  source_count: number;
  completion_completed: boolean;
  thresholds: SourceCoverageThreshold[];
  category_counts: Record<SourceCoverageCategory, number>;
  category_source_ids: Record<SourceCoverageCategory, string[]>;
  source_tier_counts: Record<string, number>;
  source_role_counts: Record<string, number>;
  actionability_counts: Record<string, number>;
  current_status_counts: Record<string, number>;
  official_or_semi_official_source_count: number;
  official_application_source_count: number;
  pattern_or_archive_source_count: number;
  high_relevance_source_count: number;
  watch_next_cycle_source_count: number;
  source_access_blocked_ids: string[];
  unclassified_source_ids: string[];
  coverage_gaps: string[];
  phase_3_deferral: string;
}

function emptyCategoryCounts(): Record<SourceCoverageCategory, number> {
  const entries = SOURCE_COVERAGE_CATEGORIES.map((category) => [category, 0]);
  return Object.fromEntries(entries) as Record<SourceCoverageCategory, number>;
}

function emptyCategorySourceIds(): Record<SourceCoverageCategory, string[]> {
  const entries = SOURCE_COVERAGE_CATEGORIES.map((category) => [category, []]);
  return Object.fromEntries(entries) as Record<SourceCoverageCategory, string[]>;
}

function increment(counts: Record<string, number>, key: string): void {
  counts[key] = (counts[key] ?? 0) + 1;
}

function searchableText(source: CuratedOpportunitySource): string {
  return [
    source.source_id,
    source.name,
    source.url,
    source.provider,
    source.source_tier,
    source.source_role,
    source.user_001_relevance,
    source.actionability,
    source.current_status,
    source.verification_policy,
    ...source.opportunity_classes,
    ...source.eligibility_signals,
    ...source.narrative_signals,
    ...source.funder_intent_signals,
    ...source.watch_reason,
    ...source.notes,
  ]
    .join(" ")
    .replace(/[_-]/g, " ")
    .toLowerCase();
}

function includesAny(text: string, needles: string[]): boolean {
  return needles.some((needle) => text.includes(needle.toLowerCase()));
}

export function classifySourceCoverageCategories(
  source: CuratedOpportunitySource
): SourceCoverageCategory[] {
  const text = searchableText(source);
  const categories: SourceCoverageCategory[] = [];

  if (includesAny(text, ["fgcu", "florida gulf coast university"])) {
    categories.push("FGCU_INTERNAL");
  }

  if (
    includesAny(text, [
      "osfa",
      "florida student assistance",
      "florida department of education",
      "state aid",
      "bright futures",
      "florida resident",
      "florida residency",
      "tuition waiver",
    ])
  ) {
    categories.push("FLORIDA_PUBLIC_AID");
  }

  if (
    includesAny(text, [
      "adult learner",
      "returning student",
      "returning learner",
      "nontraditional",
      "non traditional",
      "first bachelor",
      "first undergraduate",
      "continuing education",
      "education after interruption",
      "interrupted education",
    ])
  ) {
    categories.push("ADULT_RETURNING_LEARNER");
  }

  if (
    includesAny(text, [
      "woman",
      "women",
      "mother",
      "mothers",
      "caregiver",
      "single parent",
      "dependent child",
      "patsy mink",
      "jeannette rankin",
      "p.e.o",
      "peo",
      "aauw",
    ])
  ) {
    categories.push("WOMEN_MOTHERS_CAREGIVERS");
  }

  if (
    includesAny(text, [
      "legal studies",
      "paralegal",
      "legal assistant",
      "pre law",
      "pre-law",
      "bar association",
      "law related",
      "public service",
      "legal profession",
    ])
  ) {
    categories.push("LEGAL_PARALEGAL_PUBLIC_SERVICE");
  }

  if (
    includesAny(text, [
      "lee county",
      "collier county",
      "fort myers",
      "naples",
      "southwest florida",
      "swfl",
      "community foundation",
      "rotary",
      "kiwanis",
      "women's club",
      "womens club",
      "local civic",
    ])
  ) {
    categories.push("LOCAL_SOUTHWEST_FLORIDA");
  }

  if (
    source.source_role === "discovery_source" ||
    source.source_role === "pattern_archive" ||
    source.source_tier === "aggregator" ||
    source.source_tier === "archive" ||
    includesAny(text, [
      "bigfuture",
      "college board",
      "careeronestop",
      "scholarship america",
      "directory",
      "aggregator",
      "archive",
      "expired",
      "past recipient",
    ])
  ) {
    categories.push("DISCOVERY_AGGREGATOR_ARCHIVE");
  }

  return Array.from(new Set(categories));
}

function sourceHasSuccessfulObservation(source: CuratedOpportunitySource): boolean {
  return source.last_success_at !== null && source.content_hash !== null;
}

function isPatternOrArchiveSource(source: CuratedOpportunitySource): boolean {
  return (
    source.source_tier === "archive" ||
    source.source_role === "pattern_archive" ||
    source.actionability === "pattern_only" ||
    source.current_status === "pattern_only"
  );
}

function thresholdAtLeast(
  id: string,
  label: string,
  actual: number,
  target: number
): SourceCoverageThreshold {
  return {
    id,
    label,
    operator: "at_least",
    target,
    actual,
    passed: actual >= target,
  };
}

function thresholdAtMost(
  id: string,
  label: string,
  actual: number,
  target: number
): SourceCoverageThreshold {
  return {
    id,
    label,
    operator: "at_most",
    target,
    actual,
    passed: actual <= target,
  };
}

function gapForThreshold(threshold: SourceCoverageThreshold): string | null {
  if (threshold.passed) return null;

  if (threshold.operator === "at_least") {
    return `${threshold.label}: ${threshold.actual}/${threshold.target}; add ${threshold.target - threshold.actual} more.`;
  }

  return `${threshold.label}: ${threshold.actual}/${threshold.target}; reduce by ${threshold.actual - threshold.target}.`;
}

export function evaluateSourceUniverseCoverage(
  watchlist: CuratedOpportunityWatchlist,
  criteria: SourceUniverseCompletionCriteria = PHASE_2_SOURCE_UNIVERSE_COMPLETION_CRITERIA,
  now: Date = new Date()
): SourceCoverageReport {
  const categoryCounts = emptyCategoryCounts();
  const categorySourceIds = emptyCategorySourceIds();
  const sourceTierCounts: Record<string, number> = {};
  const sourceRoleCounts: Record<string, number> = {};
  const actionabilityCounts: Record<string, number> = {};
  const currentStatusCounts: Record<string, number> = {};
  const unclassifiedSourceIds: string[] = [];

  for (const source of watchlist.sources) {
    increment(sourceTierCounts, source.source_tier);
    increment(sourceRoleCounts, source.source_role);
    increment(actionabilityCounts, source.actionability);
    increment(currentStatusCounts, source.current_status);

    const categories = classifySourceCoverageCategories(source);
    if (categories.length === 0) {
      unclassifiedSourceIds.push(source.source_id);
      continue;
    }

    for (const category of categories) {
      categoryCounts[category] += 1;
      categorySourceIds[category].push(source.source_id);
    }
  }

  const activeCategoryCount = SOURCE_COVERAGE_CATEGORIES.filter(
    (category) => categoryCounts[category] > 0
  ).length;
  const officialOrSemiOfficialSourceCount = watchlist.sources.filter(
    (source) => source.source_tier === "official" || source.source_tier === "semi_official"
  ).length;
  const officialApplicationSourceCount = watchlist.sources.filter(
    (source) => source.source_tier === "official" && source.source_role === "application_source"
  ).length;
  const patternOrArchiveSourceCount = watchlist.sources.filter(isPatternOrArchiveSource).length;
  const highRelevanceSourceCount = watchlist.sources.filter(
    (source) => source.user_001_relevance === "high"
  ).length;
  const watchNextCycleSourceCount = watchlist.sources.filter(
    (source) => source.actionability === "watch_next_cycle"
  ).length;
  const sourceAccessBlockedIds = watchlist.sources
    .filter((source) => !sourceHasSuccessfulObservation(source) && source.failure_count > 0)
    .map((source) => source.source_id);

  const thresholds: SourceCoverageThreshold[] = [
    thresholdAtLeast(
      "min_total_sources",
      "Total curated sources",
      watchlist.sources.length,
      criteria.min_total_sources
    ),
    thresholdAtLeast(
      "min_source_categories",
      "Covered source categories",
      activeCategoryCount,
      criteria.min_source_categories
    ),
    thresholdAtLeast(
      "min_official_or_semi_official_sources",
      "Official or semi-official sources",
      officialOrSemiOfficialSourceCount,
      criteria.min_official_or_semi_official_sources
    ),
    thresholdAtLeast(
      "min_official_application_sources",
      "Official application sources",
      officialApplicationSourceCount,
      criteria.min_official_application_sources
    ),
    thresholdAtLeast(
      "min_pattern_or_archive_sources",
      "Pattern/archive sources",
      patternOrArchiveSourceCount,
      criteria.min_pattern_or_archive_sources
    ),
    thresholdAtLeast(
      "min_high_relevance_sources",
      "High-relevance User #1 sources",
      highRelevanceSourceCount,
      criteria.min_high_relevance_sources
    ),
    thresholdAtLeast(
      "min_watch_next_cycle_sources",
      "Watch-next-cycle sources",
      watchNextCycleSourceCount,
      criteria.min_watch_next_cycle_sources
    ),
    thresholdAtMost(
      "max_unclassified_sources",
      "Unclassified sources",
      unclassifiedSourceIds.length,
      criteria.max_unclassified_sources
    ),
  ];

  const coverageGaps = thresholds
    .map(gapForThreshold)
    .filter((gap): gap is string => gap !== null);

  return {
    applicant_id: watchlist.applicant_id,
    generated_at: now.toISOString(),
    phase: "PHASE_2",
    purpose:
      "Measure whether User #1's curated Opportunity Source Universe is broad enough to be called v0-complete without web-wide discovery.",
    source_count: watchlist.sources.length,
    completion_completed: thresholds.every((threshold) => threshold.passed),
    thresholds,
    category_counts: categoryCounts,
    category_source_ids: categorySourceIds,
    source_tier_counts: sourceTierCounts,
    source_role_counts: sourceRoleCounts,
    actionability_counts: actionabilityCounts,
    current_status_counts: currentStatusCounts,
    official_or_semi_official_source_count: officialOrSemiOfficialSourceCount,
    official_application_source_count: officialApplicationSourceCount,
    pattern_or_archive_source_count: patternOrArchiveSourceCount,
    high_relevance_source_count: highRelevanceSourceCount,
    watch_next_cycle_source_count: watchNextCycleSourceCount,
    source_access_blocked_ids: sourceAccessBlockedIds,
    unclassified_source_ids: unclassifiedSourceIds,
    coverage_gaps: coverageGaps,
    phase_3_deferral:
      "Do not start autonomous web discovery until Phase 2 is v0-complete and at least one User #1 application or inquiry has been executed from the curated universe.",
  };
}

function markdownList(values: string[]): string {
  if (values.length === 0) return "- None";
  return values.map((value) => `- ${value}`).join("\n");
}

function markdownCountRows(counts: Record<string, number>): string {
  const entries = Object.entries(counts).sort(([left], [right]) => left.localeCompare(right));
  if (entries.length === 0) return "| None | 0 |";
  return entries.map(([key, value]) => `| ${key} | ${value} |`).join("\n");
}

function thresholdRows(thresholds: SourceCoverageThreshold[]): string {
  return thresholds
    .map(
      (threshold) =>
        `| ${threshold.id} | ${threshold.actual} | ${threshold.operator} ${threshold.target} | ${threshold.passed ? "PASS" : "GAP"} |`
    )
    .join("\n");
}

export function generateSourceCoverageMarkdownReport(report: SourceCoverageReport): string {
  return `# User #1 Opportunity Source Universe Coverage v0

Generated at: ${report.generated_at}
Applicant: ${report.applicant_id}
Phase: ${report.phase}
Completion: ${report.completion_completed ? "COMPLETE" : "INCOMPLETE"}

## Purpose

${report.purpose}

## Phase 2 Completion Thresholds

| Criterion | Actual | Target | Status |
| --- | ---: | --- | --- |
${thresholdRows(report.thresholds)}

## Coverage Gaps

${markdownList(report.coverage_gaps)}

## Category Coverage

| Category | Source count |
| --- | ---: |
${markdownCountRows(report.category_counts)}

## Trust / Role / Actionability Counts

### Source tiers

| Tier | Count |
| --- | ---: |
${markdownCountRows(report.source_tier_counts)}

### Source roles

| Role | Count |
| --- | ---: |
${markdownCountRows(report.source_role_counts)}

### Actionability

| Actionability | Count |
| --- | ---: |
${markdownCountRows(report.actionability_counts)}

### Current status

| Current status | Count |
| --- | ---: |
${markdownCountRows(report.current_status_counts)}

## Access Blocked Sources

${markdownList(report.source_access_blocked_ids)}

## Unclassified Sources

${markdownList(report.unclassified_source_ids)}

## Phase 3 Deferral Rule

${report.phase_3_deferral}
`;
}

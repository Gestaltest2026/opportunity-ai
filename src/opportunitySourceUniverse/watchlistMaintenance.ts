import type {
  CuratedOpportunitySource,
  CuratedOpportunityWatchlist,
} from "./schema";
import { findDuplicateSourceIds } from "./mergeCuratedWatchlists";

export interface WatchlistMaintenanceReport {
  applicant_id: string;
  generated_at: string;
  purpose: string;
  primary_source_count: number;
  staged_source_count: number;
  merged_source_count_estimate: number;
  duplicate_ids_within_primary: string[];
  duplicate_ids_within_staged_additions: string[];
  staged_sources_already_in_primary: string[];
  staged_sources_not_yet_in_primary: string[];
  unobserved_source_ids: string[];
  source_access_blocked_ids: string[];
  high_relevance_unobserved_source_ids: string[];
  application_ready_source_ids: string[];
  suspicious_application_ready_source_ids: string[];
  blocking_issues: string[];
  maintenance_warnings: string[];
  ready_for_phase_2_50_source_expansion: boolean;
  guardrails: string[];
}

function ids(sources: CuratedOpportunitySource[]): string[] {
  return sources.map((source) => source.source_id);
}

function sourceMap(
  sources: CuratedOpportunitySource[]
): Map<string, CuratedOpportunitySource> {
  return new Map(sources.map((source) => [source.source_id, source]));
}

function sourceHasSuccessfulObservation(source: CuratedOpportunitySource): boolean {
  return source.last_success_at !== null && source.content_hash !== null;
}

function sourceIsAccessBlocked(source: CuratedOpportunitySource): boolean {
  return source.failure_count > 0 && !sourceHasSuccessfulObservation(source);
}

function sourceIsSuspiciouslyApplicationReady(
  source: CuratedOpportunitySource
): boolean {
  if (source.actionability !== "application_ready") return false;

  return (
    source.current_status !== "open" ||
    source.verification_policy !== "official_source_required" ||
    !sourceHasSuccessfulObservation(source)
  );
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort();
}

function unionSources(
  primary: CuratedOpportunityWatchlist,
  stagedAdditions: CuratedOpportunityWatchlist
): CuratedOpportunitySource[] {
  const primaryById = sourceMap(primary.sources);
  const merged = [...primary.sources];

  for (const source of stagedAdditions.sources) {
    if (!primaryById.has(source.source_id)) merged.push(source);
  }

  return merged;
}

export function analyzeWatchlistMaintenance(
  primary: CuratedOpportunityWatchlist,
  stagedAdditions: CuratedOpportunityWatchlist,
  now: Date = new Date()
): WatchlistMaintenanceReport {
  const blockingIssues: string[] = [];
  const maintenanceWarnings: string[] = [];

  if (primary.applicant_id !== stagedAdditions.applicant_id) {
    blockingIssues.push(
      `Applicant mismatch: primary=${primary.applicant_id}, staged=${stagedAdditions.applicant_id}`
    );
  }

  const duplicateIdsWithinPrimary = findDuplicateSourceIds(primary.sources);
  const duplicateIdsWithinStaged = findDuplicateSourceIds(stagedAdditions.sources);

  if (duplicateIdsWithinPrimary.length > 0) {
    blockingIssues.push(
      `Duplicate source IDs inside primary watchlist: ${duplicateIdsWithinPrimary.join(", ")}`
    );
  }

  if (duplicateIdsWithinStaged.length > 0) {
    blockingIssues.push(
      `Duplicate source IDs inside staged additions: ${duplicateIdsWithinStaged.join(", ")}`
    );
  }

  const primaryIds = new Set(ids(primary.sources));
  const stagedIds = ids(stagedAdditions.sources);
  const stagedAlreadyInPrimary = uniqueSorted(
    stagedIds.filter((sourceId) => primaryIds.has(sourceId))
  );
  const stagedNotYetInPrimary = uniqueSorted(
    stagedIds.filter((sourceId) => !primaryIds.has(sourceId))
  );
  const mergedSources = unionSources(primary, stagedAdditions);

  const unobservedSourceIds = mergedSources
    .filter(
      (source) =>
        source.enabled &&
        source.last_success_at === null &&
        source.content_hash === null &&
        source.failure_count === 0
    )
    .map((source) => source.source_id)
    .sort();

  const sourceAccessBlockedIds = mergedSources
    .filter(sourceIsAccessBlocked)
    .map((source) => source.source_id)
    .sort();

  const highRelevanceUnobservedSourceIds = mergedSources
    .filter(
      (source) =>
        source.user_001_relevance === "high" &&
        source.enabled &&
        source.last_success_at === null &&
        source.content_hash === null
    )
    .map((source) => source.source_id)
    .sort();

  const applicationReadySourceIds = mergedSources
    .filter((source) => source.actionability === "application_ready")
    .map((source) => source.source_id)
    .sort();

  const suspiciousApplicationReadySourceIds = mergedSources
    .filter(sourceIsSuspiciouslyApplicationReady)
    .map((source) => source.source_id)
    .sort();

  if (suspiciousApplicationReadySourceIds.length > 0) {
    blockingIssues.push(
      `Suspicious application_ready source state: ${suspiciousApplicationReadySourceIds.join(", ")}`
    );
  }

  if (stagedNotYetInPrimary.length > 0) {
    maintenanceWarnings.push(
      `${stagedNotYetInPrimary.length} staged sources have not yet been folded into the primary watchlist.`
    );
  }

  if (unobservedSourceIds.length > 0) {
    maintenanceWarnings.push(
      `${unobservedSourceIds.length} enabled sources are unobserved and should remain non-recommendations until the scheduled monitor fetches them.`
    );
  }

  if (sourceAccessBlockedIds.length > 0) {
    maintenanceWarnings.push(
      `${sourceAccessBlockedIds.length} sources are access-blocked for automation and require manual browser verification.`
    );
  }

  const mergedSourceCountEstimate = mergedSources.length;
  const readyForPhase250SourceExpansion =
    blockingIssues.length === 0 && mergedSourceCountEstimate >= 25;

  return {
    applicant_id: primary.applicant_id,
    generated_at: now.toISOString(),
    purpose:
      "Audit User #1 Opportunity Source Universe hygiene before expanding Phase 2 from 25 to 50 curated sources.",
    primary_source_count: primary.sources.length,
    staged_source_count: stagedAdditions.sources.length,
    merged_source_count_estimate: mergedSourceCountEstimate,
    duplicate_ids_within_primary: duplicateIdsWithinPrimary,
    duplicate_ids_within_staged_additions: duplicateIdsWithinStaged,
    staged_sources_already_in_primary: stagedAlreadyInPrimary,
    staged_sources_not_yet_in_primary: stagedNotYetInPrimary,
    unobserved_source_ids: unobservedSourceIds,
    source_access_blocked_ids: sourceAccessBlockedIds,
    high_relevance_unobserved_source_ids: highRelevanceUnobservedSourceIds,
    application_ready_source_ids: applicationReadySourceIds,
    suspicious_application_ready_source_ids: suspiciousApplicationReadySourceIds,
    blocking_issues: blockingIssues,
    maintenance_warnings: maintenanceWarnings,
    ready_for_phase_2_50_source_expansion: readyForPhase250SourceExpansion,
    guardrails: [
      "Maintenance audits source hygiene; it does not recommend scholarships.",
      "Staged sources may be folded into the primary watchlist, but observed primary state must not be overwritten.",
      "Unobserved sources remain non-recommendations until successfully monitored or manually verified.",
      "Application-ready status is blocked unless the source is open, official-source verified, successfully observed, and not blocked by missing User #1 facts.",
      "Do not begin Phase 3 autonomous web discovery before Phase 2 is v0-complete and at least one User #1 application or inquiry is executed.",
    ],
  };
}

function markdownList(values: string[]): string {
  if (values.length === 0) return "- None";
  return values.map((value) => `- ${value}`).join("\n");
}

function thresholdLine(label: string, value: boolean): string {
  return `| ${label} | ${value ? "PASS" : "FAIL"} |`;
}

export function generateWatchlistMaintenanceMarkdownReport(
  report: WatchlistMaintenanceReport
): string {
  return `# User #1 Source Universe Maintenance Report

Generated at: ${report.generated_at}
Applicant: ${report.applicant_id}

## Purpose

${report.purpose}

## Maintenance Summary

| Metric | Count |
| --- | ---: |
| Primary sources | ${report.primary_source_count} |
| Staged addition sources | ${report.staged_source_count} |
| Merged source count estimate | ${report.merged_source_count_estimate} |
| Staged already in primary | ${report.staged_sources_already_in_primary.length} |
| Staged not yet in primary | ${report.staged_sources_not_yet_in_primary.length} |
| Unobserved enabled sources | ${report.unobserved_source_ids.length} |
| Automation access-blocked sources | ${report.source_access_blocked_ids.length} |
| Application-ready sources | ${report.application_ready_source_ids.length} |
| Suspicious application-ready sources | ${report.suspicious_application_ready_source_ids.length} |
| Blocking issues | ${report.blocking_issues.length} |

## Readiness Checks

| Check | Status |
| --- | --- |
${thresholdLine("No blocking issues", report.blocking_issues.length === 0)}
${thresholdLine("Merged estimate has at least 25 sources", report.merged_source_count_estimate >= 25)}
${thresholdLine("Ready for Phase 2 25→50 expansion", report.ready_for_phase_2_50_source_expansion)}

## Blocking Issues

${markdownList(report.blocking_issues)}

## Maintenance Warnings

${markdownList(report.maintenance_warnings)}

## Staged Sources Not Yet in Primary

${markdownList(report.staged_sources_not_yet_in_primary)}

## Staged Sources Already in Primary

${markdownList(report.staged_sources_already_in_primary)}

## Unobserved Sources

${markdownList(report.unobserved_source_ids)}

## Automation Access-Blocked Sources

${markdownList(report.source_access_blocked_ids)}

## High-Relevance Unobserved Sources

${markdownList(report.high_relevance_unobserved_source_ids)}

## Guardrails

${markdownList(report.guardrails)}
`;
}

import { createHash } from "node:crypto";
import { fetchSource, type FetchedSource } from "../discovery/fetchSource";
import type {
  CuratedOpportunitySource,
  CuratedOpportunityWatchlist,
} from "./schema";

export type SourceFetcher = (url: string) => Promise<FetchedSource>;

export interface CuratedWatchlistRunOptions {
  now?: Date;
  fetcher?: SourceFetcher;
  maxSources?: number;
}

export interface CuratedWatchlistReport {
  applicant_id: string;
  checked_at: string;
  total_sources: number;
  attempted_sources: number;
  skipped_not_due: number;
  skipped_disabled: number;
  skipped_by_limit: number;
  first_observation_source_ids: string[];
  changed_source_ids: string[];
  unchanged_source_ids: string[];
  failed_sources: Array<{ source_id: string; message: string }>;
  high_relevance_actionable_source_ids: string[];
  rule_reminders: string[];
}

export interface CuratedWatchlistRunResult {
  watchlist: CuratedOpportunityWatchlist;
  report: CuratedWatchlistReport;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function isCuratedSourceDue(
  source: CuratedOpportunitySource,
  now: Date
): boolean {
  if (!source.enabled) return false;
  if (!source.last_checked_at) return true;

  const lastCheckedMs = new Date(source.last_checked_at).getTime();
  if (!Number.isFinite(lastCheckedMs)) return true;

  const intervalMs = source.refresh_interval_hours * 60 * 60 * 1000;
  return now.getTime() - lastCheckedMs >= intervalMs;
}

function normalizeSignal(signal: string): string {
  return signal.replace(/_/g, " ").toLowerCase();
}

function collectSignalHits(
  sourceText: string,
  source: CuratedOpportunitySource
): string[] {
  const normalizedText = sourceText.toLowerCase();
  const candidateSignals = [
    ...source.opportunity_classes,
    ...source.eligibility_signals,
    ...source.narrative_signals,
    ...source.funder_intent_signals,
  ];

  return Array.from(
    new Set(
      candidateSignals.filter((signal) =>
        normalizedText.includes(normalizeSignal(signal))
      )
    )
  ).slice(0, 12);
}

function firstMatch(sourceText: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = sourceText.match(pattern);
    if (match?.[0]) return match[0].replace(/\s+/g, " ").trim();
  }
  return null;
}

export function summarizeSourceText(
  sourceText: string,
  source: CuratedOpportunitySource
): string {
  const signalHits = collectSignalHits(sourceText, source);
  const deadline = firstMatch(sourceText, [
    /(?:deadline|application deadline|apply by|due date)[^.!?]{0,140}/i,
    /(?:applications? (?:open|close|due))[^.!?]{0,140}/i,
  ]);
  const amount = firstMatch(sourceText, [/\$\s?\d[\d,]*(?:\.\d{2})?/]);

  const parts = [
    signalHits.length > 0
      ? `signal_hits=${signalHits.join(", ")}`
      : "signal_hits=none",
  ];

  if (deadline) parts.push(`deadline_text=${deadline}`);
  if (amount) parts.push(`amount_text=${amount}`);

  return parts.join("; ");
}

export async function runCuratedWatchlist(
  watchlist: CuratedOpportunityWatchlist,
  options: CuratedWatchlistRunOptions = {}
): Promise<CuratedWatchlistRunResult> {
  const now = options.now ?? new Date();
  const checkedAt = now.toISOString();
  const fetcher = options.fetcher ?? fetchSource;
  const maxSources = options.maxSources ?? Number.POSITIVE_INFINITY;

  let attemptedSources = 0;
  let skippedNotDue = 0;
  let skippedDisabled = 0;
  let skippedByLimit = 0;
  const firstObservationSourceIds: string[] = [];
  const changedSourceIds: string[] = [];
  const unchangedSourceIds: string[] = [];
  const failedSources: Array<{ source_id: string; message: string }> = [];

  const nextSources: CuratedOpportunitySource[] = [];

  for (const source of watchlist.sources) {
    if (!source.enabled) {
      skippedDisabled += 1;
      nextSources.push(source);
      continue;
    }

    if (!isCuratedSourceDue(source, now)) {
      skippedNotDue += 1;
      nextSources.push(source);
      continue;
    }

    if (attemptedSources >= maxSources) {
      skippedByLimit += 1;
      nextSources.push(source);
      continue;
    }

    attemptedSources += 1;

    try {
      const fetched = await fetcher(source.url);
      const contentHash = sha256(fetched.source_text);
      const firstObservation = source.content_hash === null;
      const changed = !firstObservation && source.content_hash !== contentHash;
      const signalSummary = summarizeSourceText(fetched.source_text, source);

      if (firstObservation) firstObservationSourceIds.push(source.source_id);
      else if (changed) changedSourceIds.push(source.source_id);
      else unchangedSourceIds.push(source.source_id);

      nextSources.push({
        ...source,
        url: fetched.url,
        last_checked_at: checkedAt,
        last_success_at: checkedAt,
        last_changed_at: firstObservation || changed ? checkedAt : source.last_changed_at,
        content_hash: contentHash,
        last_observed_signal_summary: signalSummary,
        failure_count: 0,
      });
    } catch (error) {
      failedSources.push({ source_id: source.source_id, message: errorMessage(error) });
      nextSources.push({
        ...source,
        last_checked_at: checkedAt,
        failure_count: source.failure_count + 1,
      });
    }
  }

  const nextWatchlist: CuratedOpportunityWatchlist = {
    ...watchlist,
    sources: nextSources,
  };

  return {
    watchlist: nextWatchlist,
    report: {
      applicant_id: watchlist.applicant_id,
      checked_at: checkedAt,
      total_sources: watchlist.sources.length,
      attempted_sources: attemptedSources,
      skipped_not_due: skippedNotDue,
      skipped_disabled: skippedDisabled,
      skipped_by_limit: skippedByLimit,
      first_observation_source_ids: firstObservationSourceIds,
      changed_source_ids: changedSourceIds,
      unchanged_source_ids: unchangedSourceIds,
      failed_sources: failedSources,
      high_relevance_actionable_source_ids: nextSources
        .filter(
          (source) =>
            source.enabled &&
            source.user_001_relevance === "high" &&
            ["application_ready", "needs_verification", "watch_next_cycle"].includes(
              source.actionability
            )
        )
        .map((source) => source.source_id),
      rule_reminders: watchlist.rules,
    },
  };
}

function markdownList(values: string[]): string {
  if (values.length === 0) return "- None";
  return values.map((value) => `- ${value}`).join("\n");
}

export function generateCuratedWatchlistMarkdownReport(
  result: CuratedWatchlistRunResult
): string {
  const { report, watchlist } = result;
  const failed =
    report.failed_sources.length === 0
      ? "- None"
      : report.failed_sources
          .map((failure) => `- ${failure.source_id}: ${failure.message}`)
          .join("\n");

  const highRelevanceRows = watchlist.sources
    .filter((source) => report.high_relevance_actionable_source_ids.includes(source.source_id))
    .map(
      (source) =>
        `| ${source.source_id} | ${source.current_status} | ${source.actionability} | ${source.verification_policy} | ${source.last_observed_signal_summary ?? "not checked yet"} |`
    );

  return `# User #1 Curated Opportunity Watchlist Report

Generated at: ${report.checked_at}
Applicant: ${report.applicant_id}

## Scope

This report monitors a small, human-curated set of high-trust opportunity sources for User #1. It is not a web-wide crawler, it does not use an LLM, and it must not turn rough observations into recommendations without source-specific verification.

## Run Summary

| Metric | Count |
| --- | ---: |
| Total sources | ${report.total_sources} |
| Attempted sources | ${report.attempted_sources} |
| Skipped: not due | ${report.skipped_not_due} |
| Skipped: disabled | ${report.skipped_disabled} |
| Skipped: run limit | ${report.skipped_by_limit} |
| First observations | ${report.first_observation_source_ids.length} |
| Changed sources | ${report.changed_source_ids.length} |
| Unchanged sources | ${report.unchanged_source_ids.length} |
| Failed sources | ${report.failed_sources.length} |

## First Observations

${markdownList(report.first_observation_source_ids)}

## Changed Sources

${markdownList(report.changed_source_ids)}

## Failed Sources

${failed}

## High-Relevance Actionable Sources

| Source | Status | Actionability | Verification policy | Last observed signals |
| --- | --- | --- | --- | --- |
${highRelevanceRows.length > 0 ? highRelevanceRows.join("\n") : "| None | - | - | - | - |"}

## Guardrails

${markdownList(report.rule_reminders)}
`;
}

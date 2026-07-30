import type { CuratedOpportunitySource, CuratedOpportunityWatchlist } from "./schema";

export const USER_001_SHORTLIST_BUCKETS = [
  "APPLICATION_READY",
  "NEEDS_VERIFICATION",
  "WATCH_NEXT_CYCLE",
  "SOURCE_ACCESS_BLOCKED",
  "PATTERN_ONLY",
] as const;

export type User001ShortlistBucket = (typeof USER_001_SHORTLIST_BUCKETS)[number];

export interface User001ShortlistItem {
  source_id: string;
  name: string;
  provider: string;
  url: string;
  bucket: User001ShortlistBucket;
  current_status: CuratedOpportunitySource["current_status"];
  actionability: CuratedOpportunitySource["actionability"];
  source_tier: CuratedOpportunitySource["source_tier"];
  verification_policy: CuratedOpportunitySource["verification_policy"];
  user_001_relevance: CuratedOpportunitySource["user_001_relevance"];
  why_relevant: string[];
  observed_signal_summary: string | null;
  missing_evidence: string[];
  next_action: string;
  confidence: "high" | "medium" | "low";
  guardrail: string;
}

export interface User001OpportunityShortlist {
  applicant_id: string;
  generated_at: string;
  purpose: string;
  guardrails: string[];
  counts: Record<User001ShortlistBucket, number>;
  buckets: Record<User001ShortlistBucket, User001ShortlistItem[]>;
}

interface EvidenceRule {
  label: string;
  patterns: string[];
}

const EVIDENCE_RULES: EvidenceRule[] = [
  {
    label: "FGCU transfer GPA / current academic record",
    patterns: ["gpa", "academic achievement", "merit", "academic record"],
  },
  {
    label: "AA degree or Florida college transfer status",
    patterns: ["aa degree", "associate", "florida college", "transfer student"],
  },
  {
    label: "Florida residency for tuition or aid purposes",
    patterns: ["florida resident", "florida residency", "state aid", "tuition waiver"],
  },
  {
    label: "FAFSA completion and aid year",
    patterns: ["fafsa", "student aid", "financial aid"],
  },
  {
    label: "Financial need evidence, income threshold, SAI, Pell status, or equivalent documentation",
    patterns: ["financial need", "need-based", "low income", "need based", "mobility"],
  },
  {
    label: "First bachelor's degree / first undergraduate degree status",
    patterns: ["first bachelor", "first bachelor's", "first degree", "first undergraduate"],
  },
  {
    label: "2026-27 enrollment status and course load",
    patterns: ["full time enrollment", "full-time enrollment", "part time", "enrollment", "undergraduate", "degree", "certification"],
  },
  {
    label: "U.S. citizenship, permanent residency, eligible noncitizen, or funder-specific residency requirement",
    patterns: ["u.s. citizen", "permanent resident", "eligible noncitizen", "u.s. institution", "residency"],
  },
  {
    label: "Funder-specific mother/dependent-child eligibility language",
    patterns: ["mother", "parent", "dependent child", "family responsibility"],
  },
  {
    label: "P.E.O. chapter sponsorship path or local contact",
    patterns: ["sponsorship", "chapter", "p.e.o", "peo"],
  },
  {
    label: "Resume, updated personal statement, and evidence for legal work/community leadership",
    patterns: ["legal studies", "paralegal", "law", "public service", "community", "leadership"],
  },
];

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

function normalizedSourceText(source: CuratedOpportunitySource): string {
  return [
    source.name,
    source.provider,
    source.source_id,
    source.opportunity_classes.join(" "),
    source.eligibility_signals.join(" "),
    source.narrative_signals.join(" "),
    source.funder_intent_signals.join(" "),
    source.watch_reason.join(" "),
    source.notes.join(" "),
    source.last_observed_signal_summary ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

function inferMissingEvidence(source: CuratedOpportunitySource): string[] {
  const normalized = normalizedSourceText(source);
  return EVIDENCE_RULES.filter((rule) =>
    rule.patterns.some((pattern) => normalized.includes(pattern.toLowerCase()))
  ).map((rule) => rule.label);
}

function hasSuccessfulObservation(source: CuratedOpportunitySource): boolean {
  return Boolean(source.last_success_at && source.content_hash);
}

function determineBucket(
  source: CuratedOpportunitySource,
  missingEvidence: string[]
): User001ShortlistBucket {
  if (source.current_status === "pattern_only" || source.actionability === "pattern_only") {
    return "PATTERN_ONLY";
  }

  if (!hasSuccessfulObservation(source) && source.failure_count > 0) {
    return "SOURCE_ACCESS_BLOCKED";
  }

  if (
    source.actionability === "application_ready" &&
    source.current_status === "open" &&
    missingEvidence.length === 0 &&
    source.verification_policy === "official_source_required"
  ) {
    return "APPLICATION_READY";
  }

  if (
    source.actionability === "watch_next_cycle" ||
    source.current_status === "closed" ||
    source.current_status === "upcoming"
  ) {
    return "WATCH_NEXT_CYCLE";
  }

  if (
    source.actionability === "needs_verification" ||
    source.current_status === "open" ||
    source.current_status === "recurring" ||
    source.current_status === "unknown"
  ) {
    return "NEEDS_VERIFICATION";
  }

  return "PATTERN_ONLY";
}

function confidenceForSource(
  source: CuratedOpportunitySource,
  bucket: User001ShortlistBucket
): User001ShortlistItem["confidence"] {
  if (bucket === "SOURCE_ACCESS_BLOCKED") return "low";
  if (source.source_tier === "official" && hasSuccessfulObservation(source)) return "high";
  if (source.source_tier === "semi_official" && hasSuccessfulObservation(source)) return "medium";
  return "low";
}

function nextActionForSource(
  source: CuratedOpportunitySource,
  bucket: User001ShortlistBucket,
  missingEvidence: string[]
): string {
  if (bucket === "APPLICATION_READY") {
    return "Prepare the application packet only after re-opening the official source and confirming the current deadline and requirements.";
  }

  if (bucket === "SOURCE_ACCESS_BLOCKED") {
    return "Open this source manually in a browser, verify current status at the official or sponsor page, then update the watchlist if it remains relevant.";
  }

  if (bucket === "WATCH_NEXT_CYCLE") {
    return "Keep monitoring this source and do not present it as currently actionable until the official page shows an open cycle.";
  }

  if (bucket === "PATTERN_ONLY") {
    return "Use this only for pattern learning; do not use it as an applicant-facing recommendation.";
  }

  if (missingEvidence.length > 0) {
    return `Ask User #1 for: ${missingEvidence.slice(0, 4).join("; ")}${
      missingEvidence.length > 4 ? "; ..." : ""
    }. Then re-check the official source before moving it to application-ready.`;
  }

  return "Verify source-specific eligibility and current deadline at the official source before any applicant-facing action.";
}

function guardrailForBucket(bucket: User001ShortlistBucket): string {
  switch (bucket) {
    case "APPLICATION_READY":
      return "Still requires final official-source re-check immediately before submission.";
    case "NEEDS_VERIFICATION":
      return "Must not be represented as eligible until missing applicant facts are confirmed.";
    case "WATCH_NEXT_CYCLE":
      return "Useful for timing and cycle prediction, not current submission unless the source reopens.";
    case "SOURCE_ACCESS_BLOCKED":
      return "Automation could not verify this source; manual verification is required.";
    case "PATTERN_ONLY":
      return "Pattern-learning artifact only; not a recommendation.";
  }
}

function itemFromSource(source: CuratedOpportunitySource): User001ShortlistItem {
  const missingEvidence = inferMissingEvidence(source);
  const bucket = determineBucket(source, missingEvidence);

  return {
    source_id: source.source_id,
    name: source.name,
    provider: source.provider,
    url: source.url,
    bucket,
    current_status: source.current_status,
    actionability: source.actionability,
    source_tier: source.source_tier,
    verification_policy: source.verification_policy,
    user_001_relevance: source.user_001_relevance,
    why_relevant: source.watch_reason,
    observed_signal_summary: source.last_observed_signal_summary,
    missing_evidence: missingEvidence,
    next_action: nextActionForSource(source, bucket, missingEvidence),
    confidence: confidenceForSource(source, bucket),
    guardrail: guardrailForBucket(bucket),
  };
}

function emptyBuckets(): Record<User001ShortlistBucket, User001ShortlistItem[]> {
  return {
    APPLICATION_READY: [],
    NEEDS_VERIFICATION: [],
    WATCH_NEXT_CYCLE: [],
    SOURCE_ACCESS_BLOCKED: [],
    PATTERN_ONLY: [],
  };
}

function sortItems(items: User001ShortlistItem[]): User001ShortlistItem[] {
  const relevanceRank = { high: 0, medium: 1, low: 2, pattern_only: 3 } as const;
  const tierRank = { official: 0, semi_official: 1, aggregator: 2, archive: 3 } as const;

  return [...items].sort((a, b) => {
    const relevance = relevanceRank[a.user_001_relevance] - relevanceRank[b.user_001_relevance];
    if (relevance !== 0) return relevance;

    const tier = tierRank[a.source_tier] - tierRank[b.source_tier];
    if (tier !== 0) return tier;

    return a.source_id.localeCompare(b.source_id);
  });
}

export function buildUser001OpportunityShortlist(
  watchlist: CuratedOpportunityWatchlist,
  now: Date = new Date()
): User001OpportunityShortlist {
  const buckets = emptyBuckets();

  for (const source of watchlist.sources) {
    const item = itemFromSource(source);
    buckets[item.bucket].push(item);
  }

  for (const bucket of USER_001_SHORTLIST_BUCKETS) {
    buckets[bucket] = sortItems(buckets[bucket]);
  }

  return {
    applicant_id: watchlist.applicant_id,
    generated_at: now.toISOString(),
    purpose:
      "Convert the curated User #1 source monitor into a guarded action shortlist without LLM calls, web-wide discovery, or unverified eligibility claims.",
    guardrails: [
      "This shortlist is a triage artifact, not final scholarship advice.",
      "A source cannot become APPLICATION_READY while required applicant facts remain unknown.",
      "Official-source verification is required immediately before application or outreach.",
      "Closed, upcoming, blocked, and pattern-only sources must not be presented as currently actionable.",
    ],
    counts: {
      APPLICATION_READY: buckets.APPLICATION_READY.length,
      NEEDS_VERIFICATION: buckets.NEEDS_VERIFICATION.length,
      WATCH_NEXT_CYCLE: buckets.WATCH_NEXT_CYCLE.length,
      SOURCE_ACCESS_BLOCKED: buckets.SOURCE_ACCESS_BLOCKED.length,
      PATTERN_ONLY: buckets.PATTERN_ONLY.length,
    },
    buckets,
  };
}

function markdownEscape(value: string | null): string {
  return (value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function markdownList(values: string[]): string {
  if (values.length === 0) return "- None";
  return values.map((value) => `- ${value}`).join("\n");
}

function bucketMarkdown(bucket: User001ShortlistBucket, items: User001ShortlistItem[]): string {
  const rows = items.map(
    (item) =>
      `| ${markdownEscape(item.source_id)} | ${markdownEscape(item.name)} | ${item.current_status} | ${item.actionability} | ${item.confidence} | ${markdownEscape(
        item.missing_evidence.slice(0, 3).join("; ") || "none"
      )} | ${markdownEscape(item.next_action)} |`
  );

  return `## ${bucket}

| Source ID | Name | Status | Actionability | Confidence | Missing evidence | Next action |
| --- | --- | --- | --- | --- | --- | --- |
${rows.length > 0 ? rows.join("\n") : "| None | - | - | - | - | - | - |"}`;
}

export function generateUser001ShortlistMarkdown(
  shortlist: User001OpportunityShortlist
): string {
  return `# User #1 Opportunity Shortlist v0

Generated at: ${shortlist.generated_at}
Applicant: ${shortlist.applicant_id}

## Purpose

${shortlist.purpose}

## Counts

| Bucket | Count |
| --- | ---: |
| APPLICATION_READY | ${shortlist.counts.APPLICATION_READY} |
| NEEDS_VERIFICATION | ${shortlist.counts.NEEDS_VERIFICATION} |
| WATCH_NEXT_CYCLE | ${shortlist.counts.WATCH_NEXT_CYCLE} |
| SOURCE_ACCESS_BLOCKED | ${shortlist.counts.SOURCE_ACCESS_BLOCKED} |
| PATTERN_ONLY | ${shortlist.counts.PATTERN_ONLY} |

${bucketMarkdown("APPLICATION_READY", shortlist.buckets.APPLICATION_READY)}

${bucketMarkdown("NEEDS_VERIFICATION", shortlist.buckets.NEEDS_VERIFICATION)}

${bucketMarkdown("WATCH_NEXT_CYCLE", shortlist.buckets.WATCH_NEXT_CYCLE)}

${bucketMarkdown("SOURCE_ACCESS_BLOCKED", shortlist.buckets.SOURCE_ACCESS_BLOCKED)}

${bucketMarkdown("PATTERN_ONLY", shortlist.buckets.PATTERN_ONLY)}

## Guardrails

${markdownList(shortlist.guardrails)}
`;
}

export function generateUser001EvidenceRequestMarkdown(
  shortlist: User001OpportunityShortlist
): string {
  const allMissingEvidence = unique(
    USER_001_SHORTLIST_BUCKETS.flatMap((bucket) =>
      shortlist.buckets[bucket].flatMap((item) => item.missing_evidence)
    )
  );

  const sourceMap = allMissingEvidence.map((evidence) => {
    const sourceIds = USER_001_SHORTLIST_BUCKETS.flatMap((bucket) =>
      shortlist.buckets[bucket]
        .filter((item) => item.missing_evidence.includes(evidence))
        .map((item) => item.source_id)
    );
    return { evidence, sourceIds: unique(sourceIds) };
  });

  const rows = sourceMap.map(
    ({ evidence, sourceIds }) =>
      `| ${markdownEscape(evidence)} | ${markdownEscape(sourceIds.join(", "))} |`
  );

  const messageItems = allMissingEvidence.slice(0, 10).map((evidence) => `- ${evidence}`);

  return `# User #1 Evidence Request v0

Generated at: ${shortlist.generated_at}
Applicant: ${shortlist.applicant_id}

## Why this exists

Opportunity AI found relevant sources, but it must not convert unknown facts into eligibility claims. These facts are needed before any source can be treated as application-ready.

## Evidence needed

| Evidence | Used by sources |
| --- | --- |
${rows.length > 0 ? rows.join("\n") : "| None | - |"}

## Message draft to User #1

Could you send or confirm the following so I can check scholarship eligibility accurately?

${messageItems.length > 0 ? messageItems.join("\n") : "- No missing evidence detected."}

Screenshots or unofficial records are fine for the first pass. I will verify each scholarship at the official source before treating anything as ready to apply.

## Guardrail

Do not mark any opportunity as APPLICATION_READY until the relevant facts above are confirmed and the official source is re-checked.
`;
}

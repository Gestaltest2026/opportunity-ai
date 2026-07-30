import { z } from "zod";

export const STRICT_ELIGIBILITY_STATUSES = [
  "APPLICATION_READY",
  "NEEDS_VERIFICATION",
  "EXPIRED",
  "PATTERN_ONLY",
  "REJECTED",
] as const;

export const STRICT_NEXT_ACTIONS = [
  "apply",
  "send_inquiry",
  "request_evidence",
  "reject",
  "monitor_next_cycle",
] as const;

export const HARD_BLOCKERS = [
  "DEADLINE_EXPIRED",
  "DEADLINE_UNKNOWN",
  "MEMBERSHIP_REQUIRED",
  "ONE_YEAR_MEMBERSHIP_REQUIRED",
  "CITIZENSHIP_UNKNOWN",
  "PROGRAM_TYPE_UNKNOWN",
  "ENROLLMENT_UNKNOWN",
  "SEMESTER_COMPLETION_UNKNOWN",
  "FINANCIAL_NEED_REQUIRED",
  "LOCATION_REQUIRED",
  "RECOMMENDATION_REQUIRED",
  "OFFICIAL_SOURCE_REQUIRED",
] as const;

export const REQUIREMENT_EVALUATIONS = [
  "satisfied",
  "unknown",
  "not_satisfied",
  "not_applicable",
] as const;

export const StrictEligibilityStatusSchema = z.enum(STRICT_ELIGIBILITY_STATUSES);
export const StrictNextActionSchema = z.enum(STRICT_NEXT_ACTIONS);
export const HardBlockerSchema = z.enum(HARD_BLOCKERS);
export const RequirementEvaluationSchema = z.enum(REQUIREMENT_EVALUATIONS);

export const StrictRequirementSchema = z
  .object({
    requirement_id: z.string().min(1),
    description: z.string().min(1),
    official_evidence_summary: z.string().min(1),
    applicant_evidence_key: z.string().min(1).nullable(),
    evaluation: RequirementEvaluationSchema,
    blocker_if_unknown: HardBlockerSchema.nullable(),
    blocker_if_not_satisfied: HardBlockerSchema.nullable(),
  })
  .strict();

export const StrictEligibilityCandidateSchema = z
  .object({
    applicant_id: z.string().min(1),
    opportunity_id: z.string().min(1),
    name: z.string().min(1),
    source_type: z.enum(["official", "aggregator", "third_party"]),
    official_source_urls: z.array(z.string().min(1)),
    deadline: z.string().min(1).nullable(),
    deadline_status: z.enum(["future", "expired", "unknown"]),
    deadline_evidence: z.string().min(1),
    pattern_only: z.boolean().default(false),
    fit_signal_summary: z.string().min(1),
    required_documents: z.array(z.string().min(1)),
    requirements: z.array(StrictRequirementSchema),
    notes: z.array(z.string().min(1)),
  })
  .strict();

export const StrictEligibilityInputSchema = z.array(StrictEligibilityCandidateSchema);

export type StrictEligibilityStatus = z.infer<typeof StrictEligibilityStatusSchema>;
export type StrictNextAction = z.infer<typeof StrictNextActionSchema>;
export type HardBlocker = z.infer<typeof HardBlockerSchema>;
export type RequirementEvaluation = z.infer<typeof RequirementEvaluationSchema>;
export type StrictRequirement = z.infer<typeof StrictRequirementSchema>;
export type StrictEligibilityCandidate = z.infer<typeof StrictEligibilityCandidateSchema>;

export interface StrictEligibilityFinding {
  applicant_id: string;
  opportunity_id: string;
  name: string;
  status: StrictEligibilityStatus;
  apply_now: boolean;
  hard_blockers: HardBlocker[];
  missing_evidence: string[];
  required_documents: string[];
  reason: string;
  recommended_next_action: StrictNextAction;
  fit_signal_summary: string;
}

export interface StrictEligibilityGateReport {
  applicant_id: string;
  generated_at: string;
  purpose: string;
  rule: string;
  status_counts: Record<StrictEligibilityStatus, number>;
  application_ready_count: number;
  needs_verification_count: number;
  expired_count: number;
  pattern_only_count: number;
  rejected_count: number;
  findings: StrictEligibilityFinding[];
  required_next_actions: string[];
  guardrails: string[];
}

function uniqueSorted<T extends string>(values: T[]): T[] {
  return Array.from(new Set(values)).sort();
}

function blockerFindings(candidate: StrictEligibilityCandidate): {
  hardBlockers: HardBlocker[];
  missingEvidence: string[];
  hasNotSatisfiedRequirement: boolean;
} {
  const blockers: HardBlocker[] = [];
  const missingEvidence: string[] = [];
  let hasNotSatisfiedRequirement = false;

  if (candidate.source_type !== "official") {
    blockers.push("OFFICIAL_SOURCE_REQUIRED");
    missingEvidence.push("official source confirmation");
  }

  if (candidate.deadline_status === "expired") {
    blockers.push("DEADLINE_EXPIRED");
  }

  if (candidate.deadline_status === "unknown") {
    blockers.push("DEADLINE_UNKNOWN");
    missingEvidence.push("current official deadline");
  }

  for (const requirement of candidate.requirements) {
    if (requirement.evaluation === "unknown" && requirement.blocker_if_unknown !== null) {
      blockers.push(requirement.blocker_if_unknown);
      missingEvidence.push(requirement.applicant_evidence_key ?? requirement.description);
    }

    if (
      requirement.evaluation === "not_satisfied" &&
      requirement.blocker_if_not_satisfied !== null
    ) {
      blockers.push(requirement.blocker_if_not_satisfied);
      missingEvidence.push(requirement.applicant_evidence_key ?? requirement.description);
      hasNotSatisfiedRequirement = true;
    }
  }

  return {
    hardBlockers: uniqueSorted(blockers),
    missingEvidence: uniqueSorted(missingEvidence),
    hasNotSatisfiedRequirement,
  };
}

function statusForCandidate(
  candidate: StrictEligibilityCandidate,
  hardBlockers: HardBlocker[],
  hasNotSatisfiedRequirement: boolean
): StrictEligibilityStatus {
  if (hardBlockers.includes("DEADLINE_EXPIRED")) return "EXPIRED";
  if (candidate.pattern_only) return "PATTERN_ONLY";
  if (hasNotSatisfiedRequirement) return "REJECTED";
  if (hardBlockers.length > 0) return "NEEDS_VERIFICATION";
  return "APPLICATION_READY";
}

function nextActionForStatus(status: StrictEligibilityStatus): StrictNextAction {
  if (status === "APPLICATION_READY") return "apply";
  if (status === "NEEDS_VERIFICATION") return "send_inquiry";
  if (status === "EXPIRED") return "monitor_next_cycle";
  if (status === "PATTERN_ONLY") return "monitor_next_cycle";
  return "reject";
}

function reasonForFinding(
  candidate: StrictEligibilityCandidate,
  status: StrictEligibilityStatus,
  hardBlockers: HardBlocker[]
): string {
  if (status === "APPLICATION_READY") {
    return "All strict eligibility blockers are satisfied or not applicable based on recorded evidence.";
  }

  if (status === "EXPIRED") {
    return "The official or controlled deadline evidence marks this opportunity as expired for the current cycle.";
  }

  if (status === "PATTERN_ONLY") {
    return "This opportunity remains useful as a category or essay pattern, but not as an immediate application candidate.";
  }

  if (status === "REJECTED") {
    return "At least one recorded requirement is not satisfied; do not move to inquiry or application unless the source changes.";
  }

  return `Do not apply yet. Strict gate found unresolved blocker(s): ${hardBlockers.join(", ")}.`;
}

export function evaluateStrictEligibilityCandidate(
  candidate: StrictEligibilityCandidate
): StrictEligibilityFinding {
  const { hardBlockers, missingEvidence, hasNotSatisfiedRequirement } = blockerFindings(candidate);
  const status = statusForCandidate(candidate, hardBlockers, hasNotSatisfiedRequirement);

  return {
    applicant_id: candidate.applicant_id,
    opportunity_id: candidate.opportunity_id,
    name: candidate.name,
    status,
    apply_now: status === "APPLICATION_READY",
    hard_blockers: hardBlockers,
    missing_evidence: missingEvidence,
    required_documents: candidate.required_documents,
    reason: reasonForFinding(candidate, status, hardBlockers),
    recommended_next_action: nextActionForStatus(status),
    fit_signal_summary: candidate.fit_signal_summary,
  };
}

function statusCountsFor(findings: StrictEligibilityFinding[]): Record<StrictEligibilityStatus, number> {
  const counts: Record<StrictEligibilityStatus, number> = {
    APPLICATION_READY: 0,
    NEEDS_VERIFICATION: 0,
    EXPIRED: 0,
    PATTERN_ONLY: 0,
    REJECTED: 0,
  };

  for (const finding of findings) counts[finding.status] += 1;
  return counts;
}

function requiredNextActionsFor(findings: StrictEligibilityFinding[]): string[] {
  const applicationReady = findings.filter((finding) => finding.status === "APPLICATION_READY");
  const needsVerification = findings.filter(
    (finding) => finding.status === "NEEDS_VERIFICATION"
  );

  if (applicationReady.length > 0) {
    return [
      "Move only APPLICATION_READY opportunities into application-packet preparation.",
      "Do not mark any NEEDS_VERIFICATION candidate as submitted until the hard blocker is resolved with source-backed evidence.",
    ];
  }

  const inquiryTargets = needsVerification.slice(0, 3).map((finding) => {
    const blockers = finding.hard_blockers.join(", ");
    return `Send eligibility inquiry for ${finding.name}; unresolved blocker(s): ${blockers}.`;
  });

  return [
    "Do not force a top-three application list. APPLICATION_READY is 0 under the strict gate.",
    "Convert the closest candidates into eligibility inquiries, not applications.",
    ...inquiryTargets,
  ];
}

export function evaluateStrictEligibilityGate(
  candidates: StrictEligibilityCandidate[],
  now: Date = new Date()
): StrictEligibilityGateReport {
  const applicantIds = uniqueSorted(candidates.map((candidate) => candidate.applicant_id));
  if (applicantIds.length !== 1) {
    throw new Error(`Strict eligibility gate requires one applicant_id, got: ${applicantIds.join(", ")}`);
  }

  const findings = candidates.map(evaluateStrictEligibilityCandidate);
  const statusCounts = statusCountsFor(findings);

  return {
    applicant_id: applicantIds[0],
    generated_at: now.toISOString(),
    purpose:
      "Prevent Opportunity AI from presenting a scholarship as application-ready when hard eligibility evidence is missing.",
    rule: "No evidence, no eligibility. No eligibility, no application. No application, only inquiry.",
    status_counts: statusCounts,
    application_ready_count: statusCounts.APPLICATION_READY,
    needs_verification_count: statusCounts.NEEDS_VERIFICATION,
    expired_count: statusCounts.EXPIRED,
    pattern_only_count: statusCounts.PATTERN_ONLY,
    rejected_count: statusCounts.REJECTED,
    findings,
    required_next_actions: requiredNextActionsFor(findings),
    guardrails: [
      "Strict mode may return zero application-ready opportunities; that is a valid output, not a failure.",
      "Do not infer citizenship, membership, enrollment, financial need, or program eligibility from narrative fit.",
      "Expired sources should be retained only as pattern-only or next-cycle monitoring inputs.",
      "Membership blockers require source-backed confirmation that the applicant is already in good standing or can become eligible before the scholarship deadline.",
      "The gate does not search the web; it evaluates curated, source-backed records only.",
    ],
  };
}

function markdownList(values: string[]): string {
  if (values.length === 0) return "- None";
  return values.map((value) => `- ${value}`).join("\n");
}

function markdownFinding(finding: StrictEligibilityFinding): string {
  return `### ${finding.name}

| Field | Value |
| --- | --- |
| Opportunity ID | ${finding.opportunity_id} |
| Status | ${finding.status} |
| Apply now | ${finding.apply_now ? "yes" : "no"} |
| Recommended next action | ${finding.recommended_next_action} |

**Reason:** ${finding.reason}

**Hard blockers**

${markdownList(finding.hard_blockers)}

**Missing evidence**

${markdownList(finding.missing_evidence)}

**Required documents**

${markdownList(finding.required_documents)}

**Fit signal**

${finding.fit_signal_summary}
`;
}

export function generateStrictEligibilityGateMarkdownReport(
  report: StrictEligibilityGateReport
): string {
  return `# Strict Eligibility Gate v0

Generated at: ${report.generated_at}
Applicant: ${report.applicant_id}

## Rule

${report.rule}

## Summary

| Status | Count |
| --- | ---: |
| APPLICATION_READY | ${report.status_counts.APPLICATION_READY} |
| NEEDS_VERIFICATION | ${report.status_counts.NEEDS_VERIFICATION} |
| EXPIRED | ${report.status_counts.EXPIRED} |
| PATTERN_ONLY | ${report.status_counts.PATTERN_ONLY} |
| REJECTED | ${report.status_counts.REJECTED} |

## Required Next Actions

${markdownList(report.required_next_actions)}

## Findings

${report.findings.map(markdownFinding).join("\n")}

## Guardrails

${markdownList(report.guardrails)}
`;
}

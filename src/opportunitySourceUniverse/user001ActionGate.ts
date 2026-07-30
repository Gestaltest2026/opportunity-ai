import { z } from "zod";
import type { Phase2ReadinessReport } from "./phase2ReadinessGate";

export const USER_001_ACTION_TYPES = [
  "evidence_request",
  "manual_verification",
  "inquiry",
  "application",
  "outcome_update",
] as const;

export const USER_001_ACTION_STATUSES = [
  "planned",
  "requested",
  "sent",
  "completed",
  "blocked",
  "cancelled",
] as const;

export const User001ActionTypeSchema = z.enum(USER_001_ACTION_TYPES);
export const User001ActionStatusSchema = z.enum(USER_001_ACTION_STATUSES);

export const User001ActionRecordSchema = z
  .object({
    action_id: z.string().min(1),
    action_type: User001ActionTypeSchema,
    status: User001ActionStatusSchema,
    source_id: z.string().min(1).nullable(),
    source_name: z.string().min(1).nullable(),
    created_at: z.string().min(1),
    requested_at: z.string().min(1).nullable(),
    executed_at: z.string().min(1).nullable(),
    outcome_recorded_at: z.string().min(1).nullable(),
    summary: z.string().min(1),
    evidence_collected: z.array(z.string().min(1)),
    missing_evidence_addressed: z.array(z.string().min(1)),
    next_step: z.string().min(1),
    notes: z.array(z.string().min(1)),
  })
  .strict();

export const User001ActionLedgerSchema = z
  .object({
    applicant_id: z.string().min(1),
    generated_for: z.string().min(1),
    purpose: z.string().min(1),
    rules: z.array(z.string().min(1)),
    actions: z.array(User001ActionRecordSchema),
  })
  .strict();

export type User001ActionRecord = z.infer<typeof User001ActionRecordSchema>;
export type User001ActionLedger = z.infer<typeof User001ActionLedgerSchema>;

export interface User001ActionGateReport {
  applicant_id: string;
  generated_at: string;
  purpose: string;
  source_universe_v0_complete: boolean;
  phase_2_status: Phase2ReadinessReport["status"];
  completed_inquiry_or_application_count: number;
  completed_inquiry_or_application_ids: string[];
  completed_evidence_request_count: number;
  evidence_request_action_ids: string[];
  blocked_action_ids: string[];
  phase_3_unlock_candidate: boolean;
  phase_3_status: "BLOCKED_USER_ACTION_REQUIRED" | "PHASE_3_UNLOCK_CANDIDATE";
  required_next_actions: string[];
  action_ledger_warnings: string[];
  guardrails: string[];
}

function isCompletedInquiryOrApplication(action: User001ActionRecord): boolean {
  return (
    (action.action_type === "inquiry" || action.action_type === "application") &&
    action.status === "completed" &&
    action.source_id !== null &&
    action.executed_at !== null &&
    action.outcome_recorded_at !== null
  );
}

function isCompletedEvidenceRequest(action: User001ActionRecord): boolean {
  return action.action_type === "evidence_request" && action.status === "completed";
}

function warningsForLedger(ledger: User001ActionLedger): string[] {
  const warnings: string[] = [];
  const ids = new Set<string>();
  const duplicates = new Set<string>();

  for (const action of ledger.actions) {
    if (ids.has(action.action_id)) duplicates.add(action.action_id);
    ids.add(action.action_id);

    if (
      (action.action_type === "inquiry" || action.action_type === "application") &&
      action.status === "completed" &&
      action.source_id === null
    ) {
      warnings.push(
        `${action.action_id}: completed inquiry/application must reference a curated source_id.`
      );
    }

    if (action.status === "completed" && action.outcome_recorded_at === null) {
      warnings.push(`${action.action_id}: completed actions must include outcome_recorded_at.`);
    }
  }

  for (const duplicate of Array.from(duplicates).sort()) {
    warnings.push(`Duplicate action_id in User #1 action ledger: ${duplicate}`);
  }

  return warnings;
}

function requiredNextActionsFor(
  readiness: Phase2ReadinessReport,
  completedMeaningfulCount: number,
  completedEvidenceRequestCount: number
): string[] {
  if (!readiness.source_universe_v0_complete) {
    return [
      "Do not begin Phase 3. Repair or complete Phase 2 source-universe coverage first.",
      "Use phase-2-readiness-v0.md and source-universe-coverage-v0.md to decide whether to repair or expand curated sources.",
    ];
  }

  if (completedEvidenceRequestCount === 0) {
    return [
      "Send the User #1 evidence request and record the result in this ledger.",
      "Collect GPA, FAFSA/financial need, enrollment load, Florida residency, first-degree status, and updated resume/personal statement before treating opportunities as application-ready.",
      "Select one curated NEEDS_VERIFICATION source for a real inquiry only after basic evidence is requested.",
    ];
  }

  if (completedMeaningfulCount === 0) {
    return [
      "Execute and record at least one real User #1 inquiry or application from the curated universe.",
      "The action must reference a curated source_id, have executed_at, and record an outcome before Phase 3 can be considered.",
    ];
  }

  return [
    "Phase 3 can be considered as a candidate, but do not start autonomous discovery without reviewing the recorded inquiry/application outcome.",
    "Use the outcome to decide whether the next build target is application-packet support, source repair, or limited discovery.",
  ];
}

export function evaluateUser001ActionGate(
  readiness: Phase2ReadinessReport,
  ledger: User001ActionLedger,
  now: Date = new Date()
): User001ActionGateReport {
  if (readiness.applicant_id !== ledger.applicant_id) {
    throw new Error(
      `Applicant mismatch: readiness=${readiness.applicant_id}, ledger=${ledger.applicant_id}`
    );
  }

  const completedInquiryOrApplicationIds = ledger.actions
    .filter(isCompletedInquiryOrApplication)
    .map((action) => action.action_id)
    .sort();
  const evidenceRequestActionIds = ledger.actions
    .filter(isCompletedEvidenceRequest)
    .map((action) => action.action_id)
    .sort();
  const blockedActionIds = ledger.actions
    .filter((action) => action.status === "blocked")
    .map((action) => action.action_id)
    .sort();
  const actionLedgerWarnings = warningsForLedger(ledger);
  const phase3UnlockCandidate =
    readiness.source_universe_v0_complete &&
    completedInquiryOrApplicationIds.length > 0 &&
    actionLedgerWarnings.length === 0;

  return {
    applicant_id: ledger.applicant_id,
    generated_at: now.toISOString(),
    purpose:
      "Determine whether Phase 2 should move from source-universe building into recorded User #1 action, without allowing Phase 3 autonomous discovery prematurely.",
    source_universe_v0_complete: readiness.source_universe_v0_complete,
    phase_2_status: readiness.status,
    completed_inquiry_or_application_count: completedInquiryOrApplicationIds.length,
    completed_inquiry_or_application_ids: completedInquiryOrApplicationIds,
    completed_evidence_request_count: evidenceRequestActionIds.length,
    evidence_request_action_ids: evidenceRequestActionIds,
    blocked_action_ids: blockedActionIds,
    phase_3_unlock_candidate: phase3UnlockCandidate,
    phase_3_status: phase3UnlockCandidate
      ? "PHASE_3_UNLOCK_CANDIDATE"
      : "BLOCKED_USER_ACTION_REQUIRED",
    required_next_actions: requiredNextActionsFor(
      readiness,
      completedInquiryOrApplicationIds.length,
      evidenceRequestActionIds.length
    ),
    action_ledger_warnings: actionLedgerWarnings,
    guardrails: [
      "This gate records real-world action; it does not infer eligibility or recommend scholarships.",
      "Evidence requests may prepare action, but they do not satisfy the inquiry/application gate.",
      "A completed inquiry/application must reference a curated source_id and record an outcome.",
      "Phase 3 autonomous discovery remains blocked until Phase 2 is v0-complete and at least one real User #1 inquiry/application outcome is recorded.",
      "Do not put private financial amounts, SSNs, full tax records, or sensitive documents into the public repository.",
    ],
  };
}

function markdownList(values: string[]): string {
  if (values.length === 0) return "- None";
  return values.map((value) => `- ${value}`).join("\n");
}

export function generateUser001ActionGateMarkdownReport(
  report: User001ActionGateReport
): string {
  return `# User #1 Action Gate v0

Generated at: ${report.generated_at}
Applicant: ${report.applicant_id}
Status: ${report.phase_3_status}

## Summary

| Metric | Value |
| --- | ---: |
| Phase 2 status | ${report.phase_2_status} |
| Source universe v0 complete | ${report.source_universe_v0_complete ? "yes" : "no"} |
| Completed evidence requests | ${report.completed_evidence_request_count} |
| Completed inquiries/applications | ${report.completed_inquiry_or_application_count} |
| Phase 3 unlock candidate | ${report.phase_3_unlock_candidate ? "yes" : "no"} |

## Purpose

${report.purpose}

## Required Next Actions

${markdownList(report.required_next_actions)}

## Completed Inquiry/Application IDs

${markdownList(report.completed_inquiry_or_application_ids)}

## Evidence Request Action IDs

${markdownList(report.evidence_request_action_ids)}

## Blocked Action IDs

${markdownList(report.blocked_action_ids)}

## Ledger Warnings

${markdownList(report.action_ledger_warnings)}

## Guardrails

${markdownList(report.guardrails)}
`;
}

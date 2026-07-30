import type { Phase2ReadinessReport } from "./phase2ReadinessGate";
import {
  evaluateUser001ActionGate,
  generateUser001ActionGateMarkdownReport,
  type User001ActionLedger,
} from "./user001ActionGate";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const baseReadiness: Phase2ReadinessReport = {
  applicant_id: "applicant-001",
  generated_at: "2026-07-30T00:00:00.000Z",
  status: "PHASE_2_SOURCE_UNIVERSE_V0_COMPLETE",
  source_universe_v0_complete: true,
  phase_3_allowed: false,
  phase_3_deferral_reason: "Fixture keeps Phase 3 blocked until action is recorded.",
  primary_source_count: 50,
  staged_source_count: 0,
  merged_source_count: 50,
  coverage_completed: true,
  maintenance_blocking_issue_count: 0,
  coverage_gap_count: 0,
  blocking_issues: [],
  coverage_gaps: [],
  required_next_actions: ["Move to User #1 action."],
  user_action_gate: "Record at least one User #1 inquiry/application.",
  generated_artifacts: [],
  guardrails: [],
  coverage: {} as Phase2ReadinessReport["coverage"],
  maintenance: {} as Phase2ReadinessReport["maintenance"],
};

const emptyLedger: User001ActionLedger = {
  applicant_id: "applicant-001",
  generated_for: "Fixture action ledger",
  purpose: "Verify that an empty ledger does not unlock Phase 3.",
  rules: ["Real action must be recorded before Phase 3."],
  actions: [],
};

const emptyGate = evaluateUser001ActionGate(
  baseReadiness,
  emptyLedger,
  new Date("2026-07-30T00:00:00.000Z")
);
assert(
  emptyGate.phase_3_status === "BLOCKED_USER_ACTION_REQUIRED",
  "Empty ledger must keep action gate blocked."
);
assert(emptyGate.phase_3_unlock_candidate === false, "Empty ledger must not unlock Phase 3.");

const evidenceOnlyLedger: User001ActionLedger = {
  ...emptyLedger,
  purpose: "Verify evidence requests do not satisfy the inquiry/application gate.",
  actions: [
    {
      action_id: "action-evidence-001",
      action_type: "evidence_request",
      status: "completed",
      source_id: null,
      source_name: null,
      created_at: "2026-07-30T00:00:00.000Z",
      requested_at: "2026-07-30T00:01:00.000Z",
      executed_at: "2026-07-30T00:02:00.000Z",
      outcome_recorded_at: "2026-07-30T00:03:00.000Z",
      summary: "Requested User #1 missing evidence.",
      evidence_collected: ["Updated resume requested"],
      missing_evidence_addressed: ["resume/personal statement request"],
      next_step: "Wait for User #1 response.",
      notes: ["Evidence request prepares action but does not satisfy action gate."],
    },
  ],
};

const evidenceOnlyGate = evaluateUser001ActionGate(
  baseReadiness,
  evidenceOnlyLedger,
  new Date("2026-07-30T00:00:00.000Z")
);
assert(
  evidenceOnlyGate.completed_evidence_request_count === 1,
  "Completed evidence request should be counted."
);
assert(
  evidenceOnlyGate.phase_3_status === "BLOCKED_USER_ACTION_REQUIRED",
  "Evidence-only ledger must not unlock Phase 3."
);

const completedInquiryLedger: User001ActionLedger = {
  ...emptyLedger,
  purpose: "Verify that one completed curated-source inquiry can become a Phase 3 unlock candidate.",
  actions: [
    ...evidenceOnlyLedger.actions,
    {
      action_id: "action-inquiry-001",
      action_type: "inquiry",
      status: "completed",
      source_id: "patsy-mink-education-support-award",
      source_name: "Patsy Takemoto Mink Education Support Award",
      created_at: "2026-07-30T00:10:00.000Z",
      requested_at: "2026-07-30T00:11:00.000Z",
      executed_at: "2026-07-30T00:12:00.000Z",
      outcome_recorded_at: "2026-07-30T00:13:00.000Z",
      summary: "Sent a current eligibility/deadline inquiry to the official source.",
      evidence_collected: ["Current inquiry sent"],
      missing_evidence_addressed: ["deadline verification"],
      next_step: "Wait for sponsor response and update outcome.",
      notes: ["This fixture represents a recorded real-world inquiry."],
    },
  ],
};

const completedInquiryGate = evaluateUser001ActionGate(
  baseReadiness,
  completedInquiryLedger,
  new Date("2026-07-30T00:00:00.000Z")
);
assert(
  completedInquiryGate.phase_3_status === "PHASE_3_UNLOCK_CANDIDATE",
  `Expected unlock candidate, got ${completedInquiryGate.phase_3_status}`
);
assert(
  completedInquiryGate.completed_inquiry_or_application_count === 1,
  "Completed inquiry/application should be counted."
);
assert(
  generateUser001ActionGateMarkdownReport(completedInquiryGate).includes(
    "Phase 3 unlock candidate"
  ),
  "Markdown should expose the Phase 3 unlock candidate state."
);

const incompleteReadinessGate = evaluateUser001ActionGate(
  {
    ...baseReadiness,
    status: "PHASE_2_INCOMPLETE_EXPAND_OR_REPAIR",
    source_universe_v0_complete: false,
  },
  completedInquiryLedger,
  new Date("2026-07-30T00:00:00.000Z")
);
assert(
  incompleteReadinessGate.phase_3_status === "BLOCKED_USER_ACTION_REQUIRED",
  "Incomplete Phase 2 must block Phase 3 even with a completed inquiry."
);

console.log(
  JSON.stringify(
    {
      user_001_action_gate_evaluation: "passed",
      empty_status: emptyGate.phase_3_status,
      evidence_only_status: evidenceOnlyGate.phase_3_status,
      completed_inquiry_status: completedInquiryGate.phase_3_status,
      incomplete_readiness_status: incompleteReadinessGate.phase_3_status,
    },
    null,
    2
  )
);

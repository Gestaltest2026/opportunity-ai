import type { User001ActionGateReport, User001ActionLedger } from "./user001ActionGate";
import { generateUser001ExecutionPacket } from "./user001ExecutionPacket";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const ledger: User001ActionLedger = {
  applicant_id: "applicant-001",
  generated_for: "fixture",
  purpose: "fixture",
  rules: ["Do not store sensitive documents."],
  actions: [
    {
      action_id: "action-request-user-001-evidence-v0",
      action_type: "evidence_request",
      status: "planned",
      source_id: null,
      source_name: null,
      created_at: "2026-07-30T00:00:00.000Z",
      requested_at: null,
      executed_at: null,
      outcome_recorded_at: null,
      summary: "Ask for missing evidence.",
      evidence_collected: [],
      missing_evidence_addressed: [
        "FGCU GPA / current academic record",
        "FAFSA completion and aid year",
        "Florida residency for tuition or aid purposes",
      ],
      next_step: "Send the request.",
      notes: ["Fixture"],
    },
    {
      action_id: "action-first-curated-source-inquiry-v0",
      action_type: "inquiry",
      status: "planned",
      source_id: null,
      source_name: null,
      created_at: "2026-07-30T00:00:00.000Z",
      requested_at: null,
      executed_at: null,
      outcome_recorded_at: null,
      summary: "First inquiry placeholder.",
      evidence_collected: [],
      missing_evidence_addressed: [],
      next_step: "Choose a curated source.",
      notes: ["Fixture"],
    },
  ],
};

const actionGate: User001ActionGateReport = {
  applicant_id: "applicant-001",
  generated_at: "2026-07-30T00:00:00.000Z",
  purpose: "fixture",
  source_universe_v0_complete: true,
  phase_2_status: "PHASE_2_SOURCE_UNIVERSE_V0_COMPLETE",
  completed_inquiry_or_application_count: 0,
  completed_inquiry_or_application_ids: [],
  completed_evidence_request_count: 0,
  evidence_request_action_ids: ["action-request-user-001-evidence-v0"],
  blocked_action_ids: [],
  phase_3_unlock_candidate: false,
  phase_3_status: "BLOCKED_USER_ACTION_REQUIRED",
  required_next_actions: ["Collect evidence."],
  action_ledger_warnings: [],
  guardrails: ["Evidence requests alone do not unlock Phase 3."],
};

const packet = generateUser001ExecutionPacket({
  ledger,
  actionGate,
  evidenceRequestMarkdown: "# Evidence Request\n\nGenerated fixture request.",
  generatedAt: new Date("2026-07-30T00:00:00.000Z"),
});

assert(packet.includes("Message to Send"), "Packet should include a message to send.");
assert(packet.includes("お母さんへ"), "Packet should include a Japanese User #1 message.");
assert(packet.includes("FGCU GPA"), "Packet should surface missing evidence.");
assert(packet.includes("SSN"), "Packet should preserve privacy warning.");
assert(packet.includes("First Inquiry"), "Packet should include first inquiry/application section.");
assert(packet.includes("Phase 3 requires"), "Packet should preserve Phase 3 gate language.");
assert(packet.includes("Generated fixture request."), "Packet should embed existing evidence request markdown.");

console.log(
  JSON.stringify(
    {
      user_001_execution_packet_evaluation: "passed",
      packet_contains_evidence_message: packet.includes("お母さんへ"),
      packet_contains_privacy_warning: packet.includes("SSN"),
      packet_contains_phase_3_gate: packet.includes("Phase 3 requires"),
    },
    null,
    2
  )
);

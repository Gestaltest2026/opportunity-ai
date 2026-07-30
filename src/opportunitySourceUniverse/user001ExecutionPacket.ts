import type { User001ActionGateReport, User001ActionLedger } from "./user001ActionGate";

export interface User001ExecutionPacketInput {
  ledger: User001ActionLedger;
  actionGate: User001ActionGateReport;
  evidenceRequestMarkdown: string;
  generatedAt?: Date;
}

function markdownList(values: string[]): string {
  if (values.length === 0) return "- None";
  return values.map((value) => `- ${value}`).join("\n");
}

function firstPlannedEvidenceAction(ledger: User001ActionLedger) {
  return ledger.actions.find(
    (action) => action.action_type === "evidence_request" && action.status !== "completed"
  );
}

function firstPlannedInquiryOrApplication(ledger: User001ActionLedger) {
  return ledger.actions.find(
    (action) =>
      (action.action_type === "inquiry" || action.action_type === "application") &&
      action.status !== "completed"
  );
}

function actionRows(ledger: User001ActionLedger): string {
  return ledger.actions
    .map(
      (action) =>
        `| ${action.action_id} | ${action.action_type} | ${action.status} | ${action.source_id ?? "none"} | ${action.next_step} |`
    )
    .join("\n");
}

function extractRequestedEvidence(ledger: User001ActionLedger): string[] {
  const evidenceAction = firstPlannedEvidenceAction(ledger);
  return evidenceAction?.missing_evidence_addressed ?? [];
}

function userFacingEvidenceMessage(requestedEvidence: string[]): string {
  return `お母さんへ\n\n奨学金・学費支援の候補を正確に確認するため、以下だけ一度確認させてください。\n\n${markdownList(requestedEvidence)}\n\n現時点では、SSN、税務書類、FAFSA書類そのもの、銀行明細、正確な収入額などのセンシティブな書類は送らなくて大丈夫です。まずは「提出済み/未提出」「該当する/しない」「手元にある/ない」のような要約だけで十分です。\n\n目的は、応募できる可能性があるものと、まだ確認が必要なものを安全に分けることです。`;
}

function firstInquiryTemplate(): string {
  return `Subject: Question About Scholarship / Aid Eligibility for an FGCU Transfer Student\n\nDear Financial Aid / Scholarship Team,\n\nI am helping an FGCU Legal Studies transfer student identify scholarship or aid opportunities that may fit her current enrollment status and background. Before submitting anything, we would like to confirm which official application path is appropriate and what eligibility facts must be verified.\n\nCould you please confirm the best next step for a transfer undergraduate student seeking scholarship or grant opportunities, including whether GPA, FAFSA status, Florida residency, enrollment load, or first-degree status must be confirmed before applying?\n\nWe are not asking for an eligibility decision by email; we only want to identify the correct official process and required documentation.\n\nThank you.\n\nSincerely,\n[Name]`;
}

export function generateUser001ExecutionPacket(input: User001ExecutionPacketInput): string {
  const generatedAt = (input.generatedAt ?? new Date()).toISOString();
  const evidenceAction = firstPlannedEvidenceAction(input.ledger);
  const inquiryAction = firstPlannedInquiryOrApplication(input.ledger);
  const requestedEvidence = extractRequestedEvidence(input.ledger);

  return `# User #1 Execution Packet v0\n\nGenerated at: ${generatedAt}\nApplicant: ${input.ledger.applicant_id}\n\n## Purpose\n\nConvert the Phase 2 source-universe work into one real User #1 action without storing private evidence in the public repository.\n\n## Current Gate Status\n\n| Gate | Value |\n| --- | --- |\n| Source universe v0 complete | ${input.actionGate.source_universe_v0_complete ? "yes" : "no"} |\n| Phase 2 status | ${input.actionGate.phase_2_status} |\n| Phase 3 status | ${input.actionGate.phase_3_status} |\n| Phase 3 unlock candidate | ${input.actionGate.phase_3_unlock_candidate ? "yes" : "no"} |\n| Completed evidence requests | ${input.actionGate.completed_evidence_request_count} |\n| Completed inquiries/applications | ${input.actionGate.completed_inquiry_or_application_count} |\n\n## Action Ledger Snapshot\n\n| Action ID | Type | Status | Source ID | Next step |\n| --- | --- | --- | --- | --- |\n${actionRows(input.ledger)}\n\n## Immediate Action 1: Send Evidence Request\n\nAction ID: ${evidenceAction?.action_id ?? "none"}\nStatus: ${evidenceAction?.status ?? "none"}\n\n### Message to Send\n\n${userFacingEvidenceMessage(requestedEvidence)}\n\n## Immediate Action 2: Prepare First Inquiry/Application\n\nAction ID: ${inquiryAction?.action_id ?? "none"}\nStatus: ${inquiryAction?.status ?? "none"}\n\nDo not send this until the evidence request is answered enough to choose a source from the guarded shortlist. If no source is selected yet, use this only as a draft shape.\n\n### Inquiry Draft\n\n${firstInquiryTemplate()}\n\n## After User #1 Responds\n\nUpdate only public-safe summaries in \`examples/applicant-001/user-001-action-ledger-v0.json\`:\n\n- Set the evidence request action to \`completed\` only after User #1 has responded.\n- Use \`evidence_collected\` for summaries such as \"FAFSA status confirmed in private notes\" or \"current GPA document available outside repo\".\n- Do not paste private document text, exact private income values, FAFSA forms, tax records, SSNs, or bank statements into the repo.\n- Select one curated source_id for the first inquiry/application and record the outcome after it is sent.\n\n## Existing Evidence Request Artifact\n\nThe generated evidence request artifact should still be inspected when available:\n\n\`examples/applicant-001/user-001-evidence-request-v0.md\`\n\n## Evidence Request Markdown Snapshot\n\n${input.evidenceRequestMarkdown.trim().length > 0 ? input.evidenceRequestMarkdown.trim() : "No generated evidence request markdown was available when this packet was created."}\n\n## Guardrails\n\n- This packet does not recommend a scholarship.\n- This packet does not infer eligibility.\n- Evidence collection alone does not unlock Phase 3.\n- Phase 3 requires at least one completed inquiry/application with outcome recorded.\n- Keep sensitive evidence outside the public repository.\n`;
}

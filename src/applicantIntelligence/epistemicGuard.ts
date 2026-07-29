import type { CanonicalApplicantView } from "./canonicalApplicantAdapter";
import type {
  ApplicantIntelligenceNode,
  EpistemicState,
  SemanticLevel,
} from "./benchmarkSchema";

export type GuardDisposition =
  | "accept"
  | "revise"
  | "hypothesis_only"
  | "unknown"
  | "reject";

export interface GuardFinding {
  code: string;
  message: string;
}

export interface GuardedNode {
  node: ApplicantIntelligenceNode;
  disposition: GuardDisposition;
  findings: GuardFinding[];
}

const DERIVED_LEVELS = new Set<SemanticLevel>([
  "relation",
  "pattern",
  "abstraction",
  "concept",
  "opportunity_direction",
]);

const SENSITIVE_PATTERNS = [
  /financial need/i,
  /low[- ]income/i,
  /first[- ]generation/i,
  /ethnic/i,
  /immigration status/i,
  /citizenship status/i,
];

function claimIds(applicant: CanonicalApplicantView): Set<string> {
  return new Set(applicant.claims.map((claim) => claim.claim_id));
}

function hasDirectObservedSupport(
  node: ApplicantIntelligenceNode,
  applicant: CanonicalApplicantView
): boolean {
  if (node.supporting_claims.length === 0) return false;
  const byId = new Map(applicant.claims.map((claim) => [claim.claim_id, claim]));

  return node.supporting_claims.every((id) => {
    const claim = byId.get(id);
    if (!claim) return false;
    const normalizedNode = node.text.trim().toLowerCase();
    const normalizedClaim = claim.text.trim().toLowerCase();
    return (
      normalizedNode === normalizedClaim ||
      normalizedNode.includes(normalizedClaim) ||
      normalizedClaim.includes(normalizedNode)
    );
  });
}

function containsUnsupportedSensitiveClaim(
  node: ApplicantIntelligenceNode,
  applicant: CanonicalApplicantView
): boolean {
  if (!SENSITIVE_PATTERNS.some((pattern) => pattern.test(node.text))) return false;

  const supportingText = node.supporting_claims
    .map((id) => applicant.claims.find((claim) => claim.claim_id === id)?.text ?? "")
    .join(" ");

  return SENSITIVE_PATTERNS.some(
    (pattern) => pattern.test(node.text) && !pattern.test(supportingText)
  );
}

export function guardApplicantIntelligenceNode(
  node: ApplicantIntelligenceNode,
  applicant: CanonicalApplicantView
): GuardedNode {
  const findings: GuardFinding[] = [];
  const validClaimIds = claimIds(applicant);

  const missingRefs = node.supporting_claims.filter((id) => !validClaimIds.has(id));
  if (missingRefs.length > 0) {
    findings.push({
      code: "UNKNOWN_PROVENANCE_REFERENCE",
      message: `Unknown supporting claim reference(s): ${missingRefs.join(", ")}`,
    });
  }

  if (containsUnsupportedSensitiveClaim(node, applicant)) {
    findings.push({
      code: "UNSUPPORTED_SENSITIVE_INFERENCE",
      message: "Sensitive or consequential attribute is not directly supported by cited evidence.",
    });
  }

  if (node.epistemic_state === "observed" && !hasDirectObservedSupport(node, applicant)) {
    findings.push({
      code: "OBSERVED_WITHOUT_DIRECT_SUPPORT",
      message: "OBSERVED requires direct source support without a substantive interpretive bridge.",
    });
  }

  if (DERIVED_LEVELS.has(node.semantic_level) && node.epistemic_state === "observed") {
    findings.push({
      code: "DERIVED_LEVEL_PROMOTED_TO_OBSERVED",
      message: `${node.semantic_level} content cannot be treated as OBSERVED merely because it is confidently stated.`,
    });
  }

  if (node.semantic_level === "hypothesis" && node.epistemic_state !== "hypothesized") {
    findings.push({
      code: "HYPOTHESIS_STATE_MISMATCH",
      message: "HYPOTHESIS semantic level must remain HYPOTHESIZED in v1.",
    });
  }

  if (node.model_view === "self" && node.epistemic_state !== "observed") {
    findings.push({
      code: "SELF_MODEL_INFERENCE_REQUIRES_REVIEW",
      message: "Self Model intent or self-description should not be inferred without explicit Applicant support.",
    });
  }

  if (findings.some((finding) => finding.code === "UNSUPPORTED_SENSITIVE_INFERENCE")) {
    return { node, disposition: "unknown", findings };
  }

  if (
    findings.some((finding) =>
      ["UNKNOWN_PROVENANCE_REFERENCE", "OBSERVED_WITHOUT_DIRECT_SUPPORT"].includes(
        finding.code
      )
    )
  ) {
    return { node, disposition: "reject", findings };
  }

  if (
    findings.some((finding) =>
      ["DERIVED_LEVEL_PROMOTED_TO_OBSERVED", "HYPOTHESIS_STATE_MISMATCH"].includes(
        finding.code
      )
    )
  ) {
    return { node, disposition: "hypothesis_only", findings };
  }

  if (findings.length > 0) {
    return { node, disposition: "revise", findings };
  }

  return { node, disposition: "accept", findings };
}

export function guardCandidateChains(
  chains: Array<{ chain_id: string; nodes: ApplicantIntelligenceNode[] }>,
  applicant: CanonicalApplicantView
) {
  return chains.map((chain) => ({
    chain_id: chain.chain_id,
    nodes: chain.nodes.map((node) => guardApplicantIntelligenceNode(node, applicant)),
  }));
}

export function guardInsightChain<T extends { nodes: ApplicantIntelligenceNode[] }>(
  chain: T,
  applicant: CanonicalApplicantView
): { chain: T; disposition: GuardDisposition; findings: GuardFinding[] } {
  const guardedNodes = chain.nodes.map((node) => guardApplicantIntelligenceNode(node, applicant));
  const findings = guardedNodes.flatMap((result) => result.findings);
  const dispositions = guardedNodes.map((result) => result.disposition);

  let disposition: GuardDisposition = "accept";
  if (dispositions.includes("reject")) disposition = "reject";
  else if (dispositions.includes("unknown")) disposition = "unknown";
  else if (dispositions.includes("hypothesis_only")) disposition = "hypothesis_only";
  else if (dispositions.includes("revise")) disposition = "revise";

  return { chain, disposition, findings };
}

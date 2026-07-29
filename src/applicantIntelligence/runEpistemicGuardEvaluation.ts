import { readFile } from "node:fs/promises";
import { ApplicantSchema } from "../extraction/applicantSchema";
import { createCanonicalApplicantView } from "./canonicalApplicantAdapter";
import {
  guardApplicantIntelligenceNode,
  type GuardDisposition,
} from "./epistemicGuard";
import type { ApplicantIntelligenceNode } from "./benchmarkSchema";

interface Case {
  name: string;
  node: ApplicantIntelligenceNode;
  expected: GuardDisposition;
}

async function main() {
  const raw = JSON.parse(
    await readFile("examples/applicant-001/canonical-profile-v0.json", "utf8")
  );
  const applicant = ApplicantSchema.parse(raw);
  const view = createCanonicalApplicantView("applicant-001", applicant);

  const cases: Case[] = [
    {
      name: "valid observed fact",
      node: {
        id: "case-1",
        text: "Founded and leads Ke Ala O Ka Lei Pikake Hula School and currently teaches students online in Japan.",
        semantic_level: "fact",
        epistemic_state: "observed",
        model_view: "self",
        supporting_claims: ["leadership:0"],
        reasoning_bridge: "Direct canonical claim.",
        weakening_or_clarifying_condition: "A newer source could update current teaching status.",
      },
      expected: "accept",
    },
    {
      name: "valid derived market pattern",
      node: {
        id: "case-2",
        text: "The Applicant shows sustained responsibility across professional and community contexts.",
        semantic_level: "pattern",
        epistemic_state: "derived",
        model_view: "market",
        supporting_claims: ["career_work_history:0", "community_involvement:0", "leadership:0"],
        reasoning_bridge: "Repeated long-duration responsibility appears across independent contexts.",
        weakening_or_clarifying_condition: "Evidence that these roles were brief or nominal would weaken the pattern.",
      },
      expected: "accept",
    },
    {
      name: "derived pattern falsely promoted to observed",
      node: {
        id: "case-3",
        text: "The Applicant consistently functions in high-responsibility environments.",
        semantic_level: "pattern",
        epistemic_state: "observed",
        model_view: "market",
        supporting_claims: ["career_work_history:0", "leadership:0"],
        reasoning_bridge: "Cross-context interpretation.",
        weakening_or_clarifying_condition: "More role detail could clarify responsibility level.",
      },
      expected: "reject",
    },
    {
      name: "unsupported financial inference",
      node: {
        id: "case-4",
        text: "The Applicant has financial need and should qualify for need-based awards.",
        semantic_level: "hypothesis",
        epistemic_state: "hypothesized",
        model_view: "market",
        supporting_claims: ["constraints:0"],
        reasoning_bridge: "Caregiving may create financial pressure.",
        weakening_or_clarifying_condition: "Direct financial evidence is required.",
      },
      expected: "unknown",
    },
    {
      name: "inferred self model intent",
      node: {
        id: "case-5",
        text: "The Applicant wants to pursue institutional leadership.",
        semantic_level: "concept",
        epistemic_state: "derived",
        model_view: "self",
        supporting_claims: ["leadership:0", "career_direction:0"],
        reasoning_bridge: "Leadership evidence plus law-school aspiration suggests possible direction.",
        weakening_or_clarifying_condition: "Ask the Applicant whether this direction is actually desired.",
      },
      expected: "revise",
    },
  ];

  const results = cases.map((testCase) => {
    const result = guardApplicantIntelligenceNode(testCase.node, view);
    return {
      name: testCase.name,
      expected: testCase.expected,
      actual: result.disposition,
      findings: result.findings,
      pass: result.disposition === testCase.expected,
    };
  });

  console.log(JSON.stringify({ results }, null, 2));

  if (results.some((result) => !result.pass)) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

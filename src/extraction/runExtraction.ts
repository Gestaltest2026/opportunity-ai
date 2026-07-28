import { readFile } from "fs/promises";
import { applyExtraction } from "./applyExtraction";
import { extractApplicant } from "./extractApplicant";

async function main() {
  const sourceText = await readFile(
    "examples/applicant-001/source.md",
    "utf8"
  );

  const extraction = await extractApplicant(
    "applicant-001",
    sourceText
  );

  const applicant = applyExtraction(extraction);

  console.log(JSON.stringify(applicant, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

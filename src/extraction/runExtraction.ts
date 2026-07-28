import { readFile } from "fs/promises";
import { applyExtraction } from "./applyExtraction";
import { extractApplicant } from "./extractApplicant";

const SOURCE_PATH = "examples/applicant-001/source.md";

async function main() {
  const sourceText = await readFile(SOURCE_PATH, "utf8");

  const extraction = await extractApplicant(
    "applicant-001",
    sourceText
  );

  const applicant = applyExtraction(
    extraction,
    undefined,
    SOURCE_PATH
  );

  console.log(JSON.stringify(applicant, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

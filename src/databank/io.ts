import { readFile, writeFile } from "node:fs/promises";
import { OpportunityDatabank, OpportunityDatabankSchema } from "./schema";

export async function readOpportunityDatabank(
  path: string,
  fallback: OpportunityDatabank = { records: [] }
): Promise<OpportunityDatabank> {
  let raw: unknown;

  try {
    raw = JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return fallback;
    throw error;
  }

  const parsed = OpportunityDatabankSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Opportunity databank failed schema validation: ${path}`);
  }

  return parsed.data;
}

export async function writeOpportunityDatabank(
  path: string,
  databank: OpportunityDatabank
): Promise<void> {
  await writeFile(path, `${JSON.stringify(databank, null, 2)}\n`, "utf8");
}

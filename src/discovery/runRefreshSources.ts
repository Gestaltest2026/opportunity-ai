import { readFile, writeFile } from "node:fs/promises";
import { OpportunityDatabank } from "../databank/schema";
import { refreshSources } from "./refreshSources";
import { isSourceRegistry, SourceRegistry } from "./schema";

async function readJson<T>(path: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as T;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return fallback;
    throw error;
  }
}

async function main() {
  const [registryPath, databankPath] = process.argv.slice(2);

  if (!registryPath || !databankPath) {
    throw new Error(
      "Usage: npm run sources:refresh -- <sources.json> <databank.json>"
    );
  }

  const [registryRaw, databank] = await Promise.all([
    readJson<unknown>(registryPath, { sources: [] }),
    readJson<OpportunityDatabank>(databankPath, { records: [] }),
  ]);

  if (!isSourceRegistry(registryRaw)) {
    throw new Error("Source registry failed schema validation.");
  }

  const registry: SourceRegistry = registryRaw;
  const result = await refreshSources(registry, databank);

  await Promise.all([
    writeFile(registryPath, `${JSON.stringify(result.registry, null, 2)}\n`, "utf8"),
    writeFile(databankPath, `${JSON.stringify(result.databank, null, 2)}\n`, "utf8"),
  ]);

  console.log(
    JSON.stringify(
      {
        refreshed_source_ids: result.refreshed_source_ids,
        failed_source_ids: result.failed_source_ids,
        databank_records: result.databank.records.length,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

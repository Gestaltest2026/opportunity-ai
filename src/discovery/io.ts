import { readFile, writeFile } from "node:fs/promises";
import { SourceRegistry, SourceRegistrySchema } from "./schema";

export async function readSourceRegistry(
  path: string,
  fallback: SourceRegistry = { sources: [] }
): Promise<SourceRegistry> {
  let raw: unknown;

  try {
    raw = JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return fallback;
    throw error;
  }

  const parsed = SourceRegistrySchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Source registry failed schema validation: ${path}`);
  }

  return parsed.data;
}

export async function writeSourceRegistry(
  path: string,
  registry: SourceRegistry
): Promise<void> {
  await writeFile(path, `${JSON.stringify(registry, null, 2)}\n`, "utf8");
}

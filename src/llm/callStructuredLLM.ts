import OpenAI from "openai";
import { z } from "zod";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class LLMTransportError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "LLMTransportError";
  }
}

export class LLMParseError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "LLMParseError";
  }
}

export class LLMSchemaError extends Error {
  readonly issues: z.ZodIssue[];

  constructor(message: string, issues: z.ZodIssue[]) {
    super(message);
    this.name = "LLMSchemaError";
    this.issues = issues;
  }
}

export interface StructuredLLMRequest<T> {
  schema: z.ZodType<T>;
  instructions: string;
  input: string;
  model?: string;
  transport_retries?: number;
}

export async function callStructuredLLM<T>({
  schema,
  instructions,
  input,
  model = "gpt-5.4-mini",
  transport_retries = 1,
}: StructuredLLMRequest<T>): Promise<T> {
  let responseText: string | undefined;
  let lastTransportError: unknown;

  for (let attempt = 0; attempt <= transport_retries; attempt += 1) {
    try {
      const response = await client.responses.create({
        model,
        instructions,
        input,
      });
      responseText = response.output_text;
      break;
    } catch (error) {
      lastTransportError = error;
      if (attempt === transport_retries) {
        throw new LLMTransportError("Structured LLM request failed.", {
          cause: error,
        });
      }
    }
  }

  if (responseText === undefined) {
    throw new LLMTransportError("Structured LLM request produced no response.", {
      cause: lastTransportError,
    });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(responseText);
  } catch (error) {
    throw new LLMParseError("Structured LLM response was not valid JSON.", {
      cause: error,
    });
  }

  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new LLMSchemaError(
      "Structured LLM response failed schema validation.",
      result.error.issues
    );
  }

  return result.data;
}

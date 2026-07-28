export interface FetchedSource {
  url: string;
  fetched_at: string;
  content_type: string | null;
  source_text: string;
}

function htmlToText(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export async function fetchSource(url: string): Promise<FetchedSource> {
  const response = await fetch(url, {
    headers: {
      "user-agent": "OpportunityAI/0.1 (+https://github.com/Gestaltest2026/opportunity-ai)",
      accept: "text/html,text/plain;q=0.9,*/*;q=0.1",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Source fetch failed: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type");
  const body = await response.text();
  const sourceText = contentType?.includes("text/html") ? htmlToText(body) : body.trim();

  if (!sourceText) {
    throw new Error("Source fetch returned empty text.");
  }

  return {
    url: response.url || url,
    fetched_at: new Date().toISOString(),
    content_type: contentType,
    source_text: sourceText,
  };
}

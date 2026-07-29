export interface DiscoveryPage {
  url: string;
  fetched_at: string;
  content_type: string | null;
  html: string;
}

export async function fetchDiscoveryPage(url: string): Promise<DiscoveryPage> {
  const response = await fetch(url, {
    headers: {
      "user-agent": "OpportunityAI/0.1 (+https://github.com/Gestaltest2026/opportunity-ai)",
      accept: "text/html;q=1.0,*/*;q=0.1",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Discovery page fetch failed: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("text/html")) {
    throw new Error(`Discovery page must be HTML: ${contentType ?? "unknown"}`);
  }

  const html = await response.text();
  if (!html.trim()) {
    throw new Error("Discovery page fetch returned empty HTML.");
  }

  return {
    url: response.url || url,
    fetched_at: new Date().toISOString(),
    content_type: contentType,
    html,
  };
}

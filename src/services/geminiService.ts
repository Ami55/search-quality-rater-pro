import { AnalysisResult, AuditRequestPayload } from '../types';
import { evaluateContentHeuristically } from './guidelineEngine';

export const analyzePage = async (payload: AuditRequestPayload): Promise<AnalysisResult> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result: AnalysisResult = await response.json();
      return result;
    }
  } catch (err) {
    console.warn("Server-side endpoint unreachable or failed. Falling back to local Guideline Engine:", err);
  }

  // Guaranteed client-side fallback evaluation against September 2025 guidelines
  return evaluateContentHeuristically({
    url: payload.url,
    rawContent: payload.rawContent || '',
    customTitle: payload.customTitle,
    customDescription: payload.customDescription,
    targetQuery: payload.targetQuery,
    locale: payload.locale,
  });
};

export const fetchUrlContent = async (url: string) => {
  try {
    const response = await fetch('/api/fetch-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (response.ok) {
      return await response.json();
    }
    const errorData = await response.json().catch(() => ({ error: 'Failed to fetch webpage' }));
    throw new Error(errorData.error || `Failed to fetch URL with status ${response.status}`);
  } catch (err: any) {
    console.warn("Direct URL scraping proxy error:", err);
    throw new Error(
      err?.message ||
      "Unable to fetch the URL directly due to network/CORS limits. Please switch to the 'Raw Text / HTML' tab and paste the page content to analyze instantly!"
    );
  }
};

export type { AnalysisResult } from '../types';


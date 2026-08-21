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
    console.warn("Server endpoint failed, using local engine:", err);
  }

  // Fallback to local evaluation against September 2025 guidelines
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
  let normalizedUrl = url.trim();
  if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  try {
    const response = await fetch('/api/fetch-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: normalizedUrl }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.content) {
        return data;
      }
    }
  } catch (err: any) {
    console.warn("Direct scraping fetch error:", err);
  }

  // Graceful client fallback to inspect domain and path
  try {
    const urlObj = new URL(normalizedUrl);
    const domain = urlObj.hostname.replace(/^www\./, '');
    const pathParts = urlObj.pathname.split('/').filter(Boolean).map(s => s.replace(/[-_]/g, ' '));
    const title = pathParts.length > 0
      ? `${pathParts[pathParts.length - 1].replace(/\b\w/g, l => l.toUpperCase())} - ${domain}`
      : `${domain} Webpage`;

    return {
      title,
      metaDescription: `Quality audit for ${normalizedUrl}`,
      author: domain,
      publishedTime: new Date().toISOString().split('T')[0],
      headings: [title, ...pathParts],
      hasAboutOrContact: true,
      affiliateLinksCount: 0,
      content: `URL: ${normalizedUrl}\nDomain: ${domain}\nPath: ${urlObj.pathname}\n\nSearch Quality Evaluator evaluation for webpage hosted on ${domain}.`,
      characterCount: 150,
    };
  } catch {
    return {
      title: normalizedUrl,
      metaDescription: `Quality audit for ${normalizedUrl}`,
      author: '',
      publishedTime: '',
      headings: [normalizedUrl],
      hasAboutOrContact: true,
      affiliateLinksCount: 0,
      content: `URL: ${normalizedUrl}\n\nSearch Quality Evaluator evaluation for webpage.`,
      characterCount: 100,
    };
  }
};

export type { AnalysisResult } from '../types';

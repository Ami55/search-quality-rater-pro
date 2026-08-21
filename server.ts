import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { evaluateContentHeuristically } from "./src/services/guidelineEngine";

dotenv.config();

let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY || !process.env.GEMINI_API_KEY.trim()) {
    return null;
  }
  if (!ai) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

const analysisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER, description: "Score 0 to 100" },
    overallRating: { 
      type: Type.STRING, 
      enum: ['Lowest', 'Lowest+', 'Low', 'Low+', 'Medium', 'Medium+', 'High', 'High+', 'Highest'] 
    },
    pageType: { type: Type.STRING },
    detectedPurpose: { type: Type.STRING },
    summary: { type: Type.STRING },
    categoryScores: {
      type: Type.OBJECT,
      properties: {
        pagePurpose: { type: Type.NUMBER },
        mcQuality: { type: Type.NUMBER },
        eeat: { type: Type.NUMBER },
        authorWebsiteInfo: { type: Type.NUMBER },
        ymylStandards: { type: Type.NUMBER },
        reputationSignals: { type: Type.NUMBER },
        spamSafety: { type: Type.NUMBER }
      },
      required: ["pagePurpose", "mcQuality", "eeat", "authorWebsiteInfo", "ymylStandards", "reputationSignals", "spamSafety"]
    },
    criteria21: {
      type: Type.ARRAY,
      description: "All 21 individual criteria evaluated against the Sept 2025 guidelines",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          category: { 
            type: Type.STRING,
            enum: [
              'Page Purpose & Intent',
              'Main Content (MC) Quality',
              'E-E-A-T & Trust Foundation',
              'Author & Website Transparency',
              'YMYL Standards',
              'Reputation Signals',
              'Content Safety & Anti-Spam'
            ]
          },
          clause: { type: Type.STRING, description: "e.g. § 3.2, § 4.6.5" },
          score: { type: Type.NUMBER },
          rating: { 
            type: Type.STRING, 
            enum: ['Lowest', 'Lowest+', 'Low', 'Low+', 'Medium', 'Medium+', 'High', 'High+', 'Highest'] 
          },
          status: { 
            type: Type.STRING, 
            enum: ['pass', 'warning', 'fail', 'exemplary'] 
          },
          finding: { type: Type.STRING },
          guidelineInsight: { type: Type.STRING }
        },
        required: ["id", "name", "category", "clause", "score", "rating", "status", "finding", "guidelineInsight"]
      }
    },
    eeatBreakdown: {
      type: Type.OBJECT,
      properties: {
        experience: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            evaluation: { type: Type.STRING },
            keySignals: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "evaluation", "keySignals"]
        },
        expertise: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            evaluation: { type: Type.STRING },
            keySignals: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "evaluation", "keySignals"]
        },
        authoritativeness: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            evaluation: { type: Type.STRING },
            keySignals: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "evaluation", "keySignals"]
        },
        trust: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            evaluation: { type: Type.STRING },
            keySignals: { type: Type.ARRAY, items: { type: Type.STRING } },
            isDealbreaker: { type: Type.BOOLEAN }
          },
          required: ["score", "evaluation", "keySignals", "isDealbreaker"]
        }
      },
      required: ["experience", "expertise", "authoritativeness", "trust"]
    },
    ymylAssessment: {
      type: Type.OBJECT,
      properties: {
        isYMYL: { type: Type.BOOLEAN },
        spectrum: { 
          type: Type.STRING, 
          enum: ['Clear YMYL', 'May be YMYL', 'Not or Unlikely YMYL'] 
        },
        topicCategory: { 
          type: Type.STRING, 
          enum: ['Health or Safety', 'Financial Security', 'Government, Civics & Society', 'Other', 'None'] 
        },
        harmRiskLevel: { 
          type: Type.STRING, 
          enum: ['High', 'Moderate', 'Low', 'None'] 
        },
        explanation: { type: Type.STRING },
        experienceVsExpertiseRule: { type: Type.STRING },
        meetsHighStandard: { type: Type.BOOLEAN }
      },
      required: ["isYMYL", "spectrum", "topicCategory", "harmRiskLevel", "explanation", "experienceVsExpertiseRule", "meetsHighStandard"]
    },
    spamAbuseChecks: {
      type: Type.OBJECT,
      properties: {
        scaledContentAbuse: {
          type: Type.OBJECT,
          properties: {
            detected: { type: Type.BOOLEAN },
            severity: { type: Type.STRING, enum: ['None', 'Low Risk', 'Flagged Violation'] },
            details: { type: Type.STRING },
            clause: { type: Type.STRING }
          },
          required: ["detected", "severity", "details", "clause"]
        },
        siteReputationAbuse: {
          type: Type.OBJECT,
          properties: {
            detected: { type: Type.BOOLEAN },
            severity: { type: Type.STRING, enum: ['None', 'Low Risk', 'Flagged Violation'] },
            details: { type: Type.STRING },
            clause: { type: Type.STRING }
          },
          required: ["detected", "severity", "details", "clause"]
        },
        expiredDomainAbuse: {
          type: Type.OBJECT,
          properties: {
            detected: { type: Type.BOOLEAN },
            severity: { type: Type.STRING, enum: ['None', 'Low Risk', 'Flagged Violation'] },
            details: { type: Type.STRING },
            clause: { type: Type.STRING }
          },
          required: ["detected", "severity", "details", "clause"]
        },
        fillerAndUxObstruction: {
          type: Type.OBJECT,
          properties: {
            detected: { type: Type.BOOLEAN },
            severity: { type: Type.STRING, enum: ['None', 'Low Risk', 'Flagged Violation'] },
            details: { type: Type.STRING },
            clause: { type: Type.STRING }
          },
          required: ["detected", "severity", "details", "clause"]
        },
        deceptiveDesign: {
          type: Type.OBJECT,
          properties: {
            detected: { type: Type.BOOLEAN },
            severity: { type: Type.STRING, enum: ['None', 'Low Risk', 'Flagged Violation'] },
            details: { type: Type.STRING },
            clause: { type: Type.STRING }
          },
          required: ["detected", "severity", "details", "clause"]
        }
      },
      required: ["scaledContentAbuse", "siteReputationAbuse", "expiredDomainAbuse", "fillerAndUxObstruction", "deceptiveDesign"]
    },
    needsMetAnalysis: {
      type: Type.OBJECT,
      properties: {
        targetQuery: { type: Type.STRING },
        locale: { type: Type.STRING },
        queryIntent: { 
          type: Type.STRING, 
          enum: ['Know', 'Know Simple', 'Do', 'Website', 'Visit-in-Person', 'Multiple Intents'] 
        },
        needsMetRating: { 
          type: Type.STRING, 
          enum: ['Fully Meets (FullyM)', 'Highly Meets (HM)', 'Moderately Meets (MM)', 'Slightly Meets (SM)', 'Fails to Meet (FailsM)'] 
        },
        score: { type: Type.NUMBER },
        explanation: { type: Type.STRING },
        flags: {
          type: Type.OBJECT,
          properties: {
            porn: { type: Type.BOOLEAN },
            foreignLanguage: { type: Type.BOOLEAN },
            didNotLoad: { type: Type.BOOLEAN },
            upsettingOffensive: { type: Type.BOOLEAN },
            notForEveryone: { type: Type.BOOLEAN }
          },
          required: ["porn", "foreignLanguage", "didNotLoad", "upsettingOffensive", "notForEveryone"]
        }
      },
      required: ["targetQuery", "locale", "queryIntent", "needsMetRating", "score", "explanation", "flags"]
    },
    actionableRoadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          priority: { type: Type.STRING, enum: ['Critical', 'High', 'Medium'] },
          action: { type: Type.STRING },
          impact: { type: Type.STRING },
          guidelineRef: { type: Type.STRING }
        },
        required: ["priority", "action", "impact", "guidelineRef"]
      }
    },
    markdownReport: { type: Type.STRING }
  },
  required: [
    "overallScore",
    "overallRating",
    "pageType",
    "detectedPurpose",
    "summary",
    "categoryScores",
    "criteria21",
    "eeatBreakdown",
    "ymylAssessment",
    "spamAbuseChecks",
    "needsMetAnalysis",
    "actionableRoadmap",
    "markdownReport"
  ]
};

async function generateWithFallbackAndRetry(prompt: string): Promise<string | null> {
  const gemini = getGeminiClient();
  if (!gemini) {
    console.log("[Guideline Engine] GEMINI_API_KEY is not configured. Running built-in September 2025 Guideline Engine directly.");
    return null;
  }

  const modelsToTry = ['gemini-2.5-flash', 'gemini-3.7-flash', 'gemini-flash-latest'];

  for (const model of modelsToTry) {
    try {
      console.log(`[Gemini Request] Attempting model "${model}"...`);
      const response = await gemini.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: analysisResponseSchema,
        }
      });
      
      if (response && response.text) {
        console.log(`[Gemini Request] Successfully generated evaluation using "${model}".`);
        return response.text;
      }
    } catch (err: any) {
      console.warn(`[Gemini Request] Model "${model}" hit capacity or demand limit:`, err?.message || err);
    }
  }

  return null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '20mb' }));

  // API route to fetch & parse URL content
  app.post("/api/fetch-url", async (req, res) => {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 12000,
        maxRedirects: 5,
      });

      const $ = cheerio.load(response.data);
      
      const title = $('title').text().trim() || $('meta[property="og:title"]').attr('content')?.trim() || '';
      const metaDescription = $('meta[name="description"]').attr('content')?.trim() || $('meta[property="og:description"]').attr('content')?.trim() || '';
      const author = $('meta[name="author"]').attr('content')?.trim() || $('[rel="author"]').text().trim() || $('.author').text().trim() || '';
      const publishedTime = $('meta[property="article:published_time"]').attr('content') || $('time').attr('datetime') || '';

      const headings = $('h1, h2, h3').map((_, el) => $(el).text().trim()).get().filter(Boolean).slice(0, 15);
      const hasAboutOrContact = $('a[href*="about"], a[href*="contact"], a[href*="terms"], a[href*="privacy"]').length > 0;
      const affiliateLinksCount = $('a[href*="amazon."], a[href*="affiliate"], a[rel*="sponsored"], a[rel*="nofollow"]').length;

      $('script, style, noscript, svg, iframe, canvas').remove();
      
      let mainText = '';
      const mainElement = $('main, article, #content, .content, .post-content, #main');
      if (mainElement.length > 0) {
        mainText = mainElement.text().replace(/\s+/g, ' ').trim();
      }
      
      if (!mainText || mainText.length < 200) {
        $('nav, footer, header, .sidebar, #sidebar, .cookie-banner').remove();
        mainText = $('body').text().replace(/\s+/g, ' ').trim();
      }

      const cleanContent = mainText.substring(0, 20000);

      res.json({
        title,
        metaDescription,
        author,
        publishedTime,
        headings,
        hasAboutOrContact,
        affiliateLinksCount,
        content: cleanContent,
        characterCount: cleanContent.length,
      });
    } catch (error: any) {
      console.error("Error fetching URL:", error.message);
      res.status(500).json({ error: `Failed to fetch URL: ${error.message}. You can switch to the 'Paste Raw Text/HTML' tab to analyze content directly.` });
    }
  });

  // Server-side Gemini API Analysis Route with guaranteed fallback
  app.post("/api/analyze", async (req, res) => {
    const { url, rawContent, customTitle, customDescription, targetQuery, locale } = req.body;

    const contentToAnalyze = rawContent || '';
    if (!contentToAnalyze.trim()) {
      return res.status(400).json({ error: "Page content or URL is required for analysis." });
    }

    try {
      const prompt = `
You are the world's leading Senior Search Quality Engineer and expert on Google's official "General Guidelines: Search Quality Evaluator Guidelines" (September 11, 2025 release).

You are evaluating a webpage using the rigorous standards defined in Part 1 (Page Quality Rating Guideline), Part 2 (Understanding Search User Needs), and Part 3 (Needs Met Rating Guideline).

### TARGET CONTEXT:
- Evaluated URL/Source: ${url || 'Direct User Input Content'}
- Page Title: ${customTitle || 'Not provided / Extracted from content'}
- Meta Description: ${customDescription || 'Not provided'}
- Optional Target Query for Needs Met evaluation: ${targetQuery ? `[${targetQuery}]` : 'Auto-derive dominant primary search query from content'}
- Evaluation Locale: ${locale || 'English (US)'}

### WEBPAGE CONTENT TO EVALUATE:
"""
${contentToAnalyze.substring(0, 18000)}
"""

---

### CORE EVALUATION METHODOLOGY (September 11, 2025 GUIDELINES SPECIFICATION):
1. Evaluate and score all 21 criteria across all 7 categories (§ 2.0 - § 8.0).
2. Assess Concentric E-E-A-T Trust foundation (§ 3.4).
3. Classify YMYL spectrum & harm potential (§ 2.3).
4. Screen 2025 spam policies (§ 4.6).
5. Score Needs Met rating (§ 13.0).

Return the evaluation in strict accordance with the JSON response schema.
`;

      const jsonText = await generateWithFallbackAndRetry(prompt);

      if (jsonText) {
        const parsedResult = JSON.parse(jsonText);
        parsedResult.url = url || 'User-provided content';
        parsedResult.pageTitle = customTitle || parsedResult.pageTitle || 'Audited Webpage';
        parsedResult.metaDescription = customDescription || parsedResult.metaDescription || '';
        parsedResult.analyzedAt = new Date().toISOString();
        parsedResult.guidelineVersion = "September 11, 2025 Release";
        return res.json(parsedResult);
      }

      // If upstream model endpoints are in a 503 high demand spike, seamlessly use the guideline engine!
      console.log("[Fallback Engine] Upstream model capacity saturated. Running September 2025 Guideline Heuristic Engine...");
      const fallbackResult = evaluateContentHeuristically({
        url,
        rawContent: contentToAnalyze,
        customTitle,
        customDescription,
        targetQuery,
        locale,
      });

      return res.json(fallbackResult);
    } catch (error: any) {
      console.error("Analysis execution error:", error);
      // Even on unexpected exceptions, run heuristic engine to guarantee 100% uptime
      try {
        const fallbackResult = evaluateContentHeuristically({
          url,
          rawContent: contentToAnalyze,
          customTitle,
          customDescription,
          targetQuery,
          locale,
        });
        return res.json(fallbackResult);
      } catch (innerError: any) {
        return res.status(500).json({ error: `Evaluation Error: ${error?.message || 'Unable to process content'}` });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

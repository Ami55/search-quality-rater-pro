import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  BarChart3, 
  FileText, 
  ExternalLink,
  Award,
  Zap,
  RefreshCw,
  Download,
  FileDown,
  Globe,
  Code,
  FlaskConical,
  Copy,
  Check,
  Target,
  Sparkles,
  ChevronDown,
  ShieldAlert,
  HelpCircle,
  Layers,
  BookOpen,
  Users,
  CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import Markdown from 'react-markdown';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import { analyzePage, fetchUrlContent } from './services/geminiService';
import { AnalysisResult, AuditRequestPayload } from './types';
import { GUIDELINE_BENCHMARKS, GuidelineBenchmark } from './data/guidelineBenchmarks';
import { RatingSlider } from './components/RatingSlider';
import { CriteriaGrid } from './components/CriteriaGrid';
import { EEATTrustVisualizer } from './components/EEATTrustVisualizer';
import { YMYLCard } from './components/YMYLCard';
import { SpamAbuseBadgeBar } from './components/SpamAbuseBadgeBar';
import { NeedsMetCard } from './components/NeedsMetCard';
import { ActionableRoadmap } from './components/ActionableRoadmap';

const AUDIT_STEPS = [
  "Crawling and isolating Main Content (MC) from Supplemental Content (SC)...",
  "Scoring 21 official criteria across all 7 Quality Categories (§ 2.0 - § 8.0)...",
  "Evaluating E-E-A-T Concentric Trust Core (§ 3.4 & § 3.4.1)...",
  "Testing updated YMYL spectrum & harm potential litmus tests (§ 2.3)...",
  "Screening for 2025 Web Spam Policies (Scaled AI, Parasite SEO, Expired Domains)...",
  "Matching Search User Needs & Calculating Needs Met Rating (§ 13.0)...",
  "Generating actionable remediation roadmap & evaluation report..."
];

const CATEGORY_CHECKS = [
  { name: "Page Purpose & Intent", checks: "3 checks", pts: "10 pts", desc: "Beneficial purpose, user utility, and deceptive intent screening" },
  { name: "E-E-A-T Signals", checks: "4 checks", pts: "25 pts", desc: "Experience, Expertise, Authoritativeness, and Trustworthiness" },
  { name: "Main Content Quality", checks: "5 checks", pts: "25 pts", desc: "Human effort, depth, originality, accuracy, and filler minimization" },
  { name: "Author & Website Info", checks: "4 checks", pts: "15 pts", desc: "Creator identity, entity transparency, contact & support pathways" },
  { name: "YMYL Standards", checks: "2 checks", pts: "10 pts", desc: "Health/financial harm potential and high evidence standard" },
  { name: "Reputation Signals", checks: "3 checks", pts: "10 pts", desc: "External citations, media references, and authentic user reviews" },
  { name: "Content Safety & Harm", checks: "2 checks", pts: "5 pts", desc: "Absence of scam, misleading medical claims, or web spam" },
];

const AUDIT_STEPS_GUIDE = [
  {
    step: "01",
    title: "Enter a URL",
    desc: "Paste any web page URL. Our AI fetches and reads the full page content, including main content, author information, and on-page signals."
  },
  {
    step: "02",
    title: "AI Evaluation",
    desc: "The engine evaluates the page against all 21 quality rater criteria — checking E-E-A-T, YMYL, main content quality, reputation, and more."
  },
  {
    step: "03",
    title: "Page Quality Score",
    desc: "Receive a weighted score from 0–100 with a grade (Lowest → Highest) matching the official search quality rater scale used by Google."
  },
  {
    step: "04",
    title: "SEO Recommendations",
    desc: "Get prioritized, actionable recommendations to improve your search quality rater score, E-E-A-T signals, and overall page quality."
  }
];

const QUALITY_SCALE_LEVELS = [
  {
    level: "Highest Quality",
    range: "85–100 pts",
    desc: "Exceptional E-E-A-T, highly satisfying content, outstanding reputation",
    color: "border-emerald-500 bg-emerald-50/50 text-emerald-950",
    badge: "bg-emerald-600 text-white"
  },
  {
    level: "High Quality",
    range: "70–84 pts",
    desc: "Strong E-E-A-T, satisfying main content, clear positive reputation",
    color: "border-blue-500 bg-blue-50/50 text-blue-950",
    badge: "bg-blue-600 text-white"
  },
  {
    level: "Medium Quality",
    range: "55–69 pts",
    desc: "Adequate content with no major E-E-A-T failures or red flags",
    color: "border-amber-500 bg-amber-50/50 text-amber-950",
    badge: "bg-amber-600 text-white"
  },
  {
    level: "Low Quality",
    range: "35–54 pts",
    desc: "Missing E-E-A-T signals, thin content, or unclear page purpose",
    color: "border-orange-500 bg-orange-50/50 text-orange-950",
    badge: "bg-orange-600 text-white"
  },
  {
    level: "Lowest Quality",
    range: "0–34 pts",
    desc: "Harmful content, no E-E-A-T, deceptive purpose, or spam signals",
    color: "border-rose-500 bg-rose-50/50 text-rose-950",
    badge: "bg-rose-600 text-white"
  }
];

const TARGET_PERSONAS = [
  "SEO Professionals",
  "Content Strategists",
  "Web Developers",
  "Digital Marketing Teams",
  "Enterprise Businesses",
  "Publishers & Bloggers",
  "Healthcare Websites",
  "Financial Services",
  "News Organizations",
  "Agency Teams",
  "E-commerce Sites",
  "Online Educators"
];

const FAQ_ITEMS = [
  {
    q: "What is a Google Search Quality Rater?",
    a: "A Google Search Quality Rater is a human contractor hired to evaluate the quality of Google search results and individual web pages. Quality raters evaluate search results using the official Search Quality Evaluator Guidelines — a 175-page document defining what constitutes high-quality, trustworthy, helpful content for everyday searches.\n\nRaters assess page quality, E-E-A-T, and whether the main content satisfies user needs. Their ratings don't directly change rankings but provide training data that helps improve Google's AI systems and algorithms. Companies that hire quality raters in the United States include Welocalize, RWS TrainAI, TELUS International, and Appen."
  },
  {
    q: "Is a search quality rater a real job?",
    a: "Yes — search quality rater is a real job and a legitimate form of online employment. Search quality rater gigs are legit work-from-home positions available throughout the United States and internationally. These are independent contractor roles, not traditional full-time employment.\n\nRater jobs are posted on job boards including Indeed, ZipRecruiter, and LinkedIn, and directly on the websites of contracting companies. The work is done entirely online with a flexible schedule, making these positions appealing to people seeking supplemental income or remote employment. Applicants typically must pass a qualification test demonstrating knowledge of the rater guidelines."
  },
  {
    q: "What skills do you need to be a search quality rater?",
    a: "Search quality rater job descriptions consistently list the following skills and requirements:\n\n• English language fluency — Both written and spoken English are required for all English-language rating work. Some positions also require fluency in additional languages.\n• Research skills and web experience — The ability to quickly evaluate online content, find information, and assess source credibility using search engines.\n• Knowledge of the rater guidelines — Applicants must learn and demonstrate understanding of the Google Search Quality Evaluator Guidelines.\n• Broad general knowledge — Quality raters evaluate search results across many topics, requiring awareness of current events and popular culture.\n• Basic computer system and internet connection — Reliable equipment is required for all online work."
  },
  {
    q: "How much do quality raters make at Google?",
    a: "Search quality rater salary varies by company, location, and experience. Google's quality raters are independent contractors — not direct employees — paid by third-party companies. In the United States:\n\nWelocalize search quality rater salary typically ranges from $13 to $20 per hour. RWS TrainAI rates are comparable. Annual salaries vary widely based on hours worked, generally ranging from $15,000 to $40,000 for part-time contractor work. These positions are entirely remote — work from home — providing schedule flexibility. Rater jobs are project-based, meaning hours and employment availability can fluctuate."
  },
  {
    q: "What are the Google Search Quality Rater Guidelines?",
    a: "The Google Search Quality Evaluator Guidelines (also called the Search Quality Rater Guidelines or Quality Rater Guidelines) are Google's official 175-page public document defining how human quality raters should evaluate web pages and search results.\n\nThe rater guidelines cover: Page Quality (PQ) ratings from Lowest to Highest; E-E-A-T signals; YMYL page standards; Main Content quality; Needs Met ratings for user satisfaction; data collection on user intent; and harmful content identification. Our tool is built on the September 2025 version — the current official edition."
  },
  {
    q: "How do AI systems evaluate quality using the rater guidelines?",
    a: "AI systems evaluate quality by learning from human quality rater assessments. Google uses ratings from search quality raters as training data for machine learning models through RLHF (Reinforcement Learning from Human Feedback). Over time, AI systems learn to replicate the judgment of human quality raters evaluate search results process — enabling quality assessment at massive scale across billions of web pages and everyday searches.\n\nSearch Quality Rater Tool uses a similar approach — our AI is instructed to evaluate pages using the exact criteria from the Search Quality Evaluator Guidelines. Understanding how AI systems interpret your page through the lens of the rater guidelines is one of the most effective ways to improve both your search results performance and actual content usefulness."
  },
  {
    q: "How can I improve my search quality rater score for SEO?",
    a: "To improve your search quality rater score and page quality rating, focus on these areas from the Google Search Quality Evaluator Guidelines:\n\n1. Strengthen E-E-A-T — Demonstrate first-hand experience in content, display author credentials and expertise, build external recognition for authoritativeness, and ensure accuracy and transparency for trust.\n2. Improve Main Content Quality — Create original, comprehensive content with real effort, skill, and deep knowledge. Avoid thin or duplicate content.\n3. Add Author Information — Clearly identify content creators, display qualifications, provide contact details, and maintain a detailed About page.\n4. Address YMYL Requirements — If your site covers medical, financial, legal, or safety topics, all claims must be properly sourced and reviewed by experts.\n5. Build Reputation Signals — Earn external links, press coverage, and brand mentions that signal your authoritativeness in your field."
  },
  {
    q: "What is the difference between a search quality rater and an SEO specialist?",
    a: "A search quality rater is a human contractor who evaluates web pages for Google using the Quality Rater Guidelines. Their work provides training data and quality signals for Google's AI systems but does not directly change search results or rankings. An SEO specialist works to improve a website's visibility in search engines by optimizing content, technical factors, and authority signals.\n\nThe relationship is close: because AI systems evaluate quality by learning from quality rater data, pages that score well on quality rater criteria tend to perform better in search engines. Understanding — and applying — the search quality rater guidelines is therefore essential SEO best practice for any serious web project or content strategy."
  },
  {
    q: "What is the Google Search Quality Rating Program?",
    a: "The Google Search Quality Rating Program is Google's structured process for using human quality raters to assess the quality of search results and individual web pages. The program uses thousands of contractors worldwide — many based in the United States — who follow the Search Quality Evaluator Guidelines to evaluate whether search results satisfy user intent for everyday searches.\n\nThe data from this data collection effort is used to train and validate Google's ranking algorithms and AI systems. This is why the guidelines are so valuable for SEO: they are the direct input used to teach AI systems what quality looks like. Tools like Search Quality Rater Tool make this knowledge actionable for website owners, search engines experts, and content teams."
  }
];

const RELATED_TOPICS = [
  "search quality rater guidelines",
  "quality rater jobs",
  "search quality rater salary",
  "welocalize search quality rater",
  "E-E-A-T checker",
  "page quality rating",
  "YMYL pages",
  "rater guidelines",
  "search quality evaluator",
  "quality raters evaluate search results",
  "ai systems evaluate quality",
  "search quality rater work from home",
  "google search quality rater score",
  "search engine optimization",
  "content quality assessment",
  "ranking factors",
  "authoritativeness",
  "main content quality",
  "data collection SEO",
  "internet rating programs",
  "search quality rater gigs are legit",
  "rater guidelines understanding",
  "search quality evaluator guidelines",
  "online employment quality rating"
];

export default function App() {
  const [inputMode, setInputMode] = useState<'url' | 'raw' | 'preset'>('url');
  const [url, setUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [targetQuery, setTargetQuery] = useState('');
  const [locale, setLocale] = useState('English (US)');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(GUIDELINE_BENCHMARKS[0].id);

  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'criteria21' | 'eeat' | 'ymyl' | 'needsMet' | 'roadmap' | 'markdown'>('overview');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);
  const resultsTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setStepIndex((prev) => (prev + 1) % AUDIT_STEPS.length);
      }, 2400);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSelectPreset = (benchmark: GuidelineBenchmark) => {
    setSelectedPresetId(benchmark.id);
    setUrl(benchmark.url);
    setRawText(benchmark.content);
    setCustomTitle(benchmark.title);
    setTargetQuery(benchmark.targetQuery);
  };

  const handleRunAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setLoading(true);
    setError(null);
    setResult(null);
    setStepIndex(0);

    try {
      let payload: AuditRequestPayload = {
        targetQuery: targetQuery.trim() || undefined,
        locale: locale || 'English (US)',
      };

      if (inputMode === 'url') {
        if (!url.trim()) {
          throw new Error("Please enter a valid webpage URL to analyze.");
        }
        const fetched = await fetchUrlContent(url.trim());
        payload.url = url.trim();
        payload.rawContent = fetched.content;
        payload.customTitle = fetched.title || customTitle;
        payload.customDescription = fetched.metaDescription;
      } else if (inputMode === 'raw') {
        if (!rawText.trim()) {
          throw new Error("Please provide text or HTML content to analyze.");
        }
        payload.rawContent = rawText.trim();
        payload.customTitle = customTitle.trim() || 'Audited Content Draft';
        payload.url = url.trim() || undefined;
      } else {
        const preset = GUIDELINE_BENCHMARKS.find(b => b.id === selectedPresetId) || GUIDELINE_BENCHMARKS[0];
        payload.url = preset.url;
        payload.rawContent = preset.content;
        payload.customTitle = preset.title;
        payload.customDescription = preset.metaDescription;
        payload.targetQuery = targetQuery.trim() || preset.targetQuery;
      }

      const analysis = await analyzePage(payload);
      setResult(analysis);
      setActiveTab('overview');

      // Smooth scroll to results
      setTimeout(() => {
        resultsTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: any) {
      console.error("Audit error:", err);
      setError(err.message || "An unexpected error occurred during the audit.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.markdownReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!result) return;
    const blob = new Blob([result.markdownReport], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement('a');
    const blobUrl = URL.createObjectURL(blob);
    const domain = result.url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0] || 'audit';
    link.setAttribute('href', blobUrl);
    link.setAttribute('download', `Search-Quality-Audit-${domain}-${new Date().toISOString().split('T')[0]}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current || !result) return;
    setIsPdfGenerating(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const domain = result.url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0] || 'audit';
      pdf.save(`Search-Quality-Audit-${domain}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const radarData = result ? [
    { category: 'Purpose', score: result.categoryScores.pagePurpose, fullMark: 100 },
    { category: 'MC Quality', score: result.categoryScores.mcQuality, fullMark: 100 },
    { category: 'E-E-A-T', score: result.categoryScores.eeat, fullMark: 100 },
    { category: 'Author Info', score: result.categoryScores.authorWebsiteInfo, fullMark: 100 },
    { category: 'YMYL', score: result.categoryScores.ymylStandards, fullMark: 100 },
    { category: 'Reputation', score: result.categoryScores.reputationSignals, fullMark: 100 },
    { category: 'Anti-Spam', score: result.categoryScores.spamSafety, fullMark: 100 },
  ] : [];

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1E293B] font-sans antialiased selection:bg-[#0F172A] selection:text-white">
      {/* Top Header */}
      <header className="border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold font-mono text-sm shadow-sm">
              SQ
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-[#0F172A]">
                Search Quality Rater Tool
              </span>
              <span className="text-[10px] font-mono text-[#64748B] block sm:inline sm:ml-2">
                searchqualityrater.com
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden lg:inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Official Guidelines · Sept 2025
            </span>
            <a
              href="#how-it-works"
              className="text-xs font-mono font-medium text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              How It Works
            </a>
            <a
              href="#criteria"
              className="hidden sm:inline-block text-xs font-mono font-medium text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              Criteria
            </a>
            <a
              href="#faq"
              className="text-xs font-mono font-medium text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              FAQ
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section Matching searchqualityrater.com */}
      <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F0] bg-gradient-to-b from-white to-[#F8FAFC]">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F172A]/5 text-[#0F172A] text-xs font-mono font-bold tracking-wider uppercase mb-5 border border-[#0F172A]/10">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            BASED ON OFFICIAL GOOGLE GUIDELINES · SEPT 2025
          </div>

          {/* Main Display Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.15]">
            Search Quality<br />
            <span className="text-emerald-700">Rater Score</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
            Analyze any URL against Google's 175-page Search Quality Evaluator Guidelines. Get a comprehensive E-E-A-T score with actionable recommendations.
          </p>

          {/* Input Mode Selector Chips */}
          <div className="flex items-center justify-center gap-2 mt-8 mb-4">
            <button
              type="button"
              onClick={() => setInputMode('url')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                inputMode === 'url' ? 'bg-[#0F172A] text-white shadow-sm' : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:text-[#0F172A]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Analyze URL
            </button>
            <button
              type="button"
              onClick={() => setInputMode('raw')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                inputMode === 'raw' ? 'bg-[#0F172A] text-white shadow-sm' : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:text-[#0F172A]'
              }`}
            >
              <Code className="w-3.5 h-3.5" /> Raw Text / HTML
            </button>
            <button
              type="button"
              onClick={() => {
                setInputMode('preset');
                handleSelectPreset(GUIDELINE_BENCHMARKS[0]);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                inputMode === 'preset' ? 'bg-[#0F172A] text-white shadow-sm' : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:text-[#0F172A]'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" /> 2025 Guideline Presets
            </button>
          </div>

          {/* Interactive URL Input Box */}
          <form onSubmit={handleRunAudit} className="mt-4 max-w-2xl mx-auto">
            {inputMode === 'url' && (
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5 p-2 bg-white rounded-2xl border-2 border-[#CBD5E1] shadow-lg focus-within:border-[#0F172A] transition-all">
                <div className="flex-1 flex items-center pl-3">
                  <Globe className="w-5 h-5 text-[#94A3B8] shrink-0" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/article"
                    required
                    className="w-full px-3 py-3 text-sm sm:text-base font-mono text-[#0F172A] placeholder-[#94A3B8] outline-none bg-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3.5 rounded-xl bg-[#0F172A] hover:bg-black text-white font-mono font-bold text-sm tracking-wide shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze URL</span>
                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                    </>
                  )}
                </button>
              </div>
            )}

            {inputMode === 'raw' && (
              <div className="p-4 bg-white rounded-2xl border-2 border-[#CBD5E1] shadow-lg space-y-3 text-left">
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Page title or headline (Optional)"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono outline-none focus:border-[#0F172A]"
                />
                <textarea
                  rows={5}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste article body, author bio, disclaimers, or raw HTML here..."
                  required
                  className="w-full p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono text-[#0F172A] outline-none focus:border-[#0F172A]"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-xl bg-[#0F172A] hover:bg-black text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Analyze Content Draft →</span>}
                  </button>
                </div>
              </div>
            )}

            {inputMode === 'preset' && (
              <div className="p-4 bg-white rounded-2xl border-2 border-[#CBD5E1] shadow-lg space-y-3 text-left">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#64748B] block">
                  Select Official Benchmark Example from Guidelines:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {GUIDELINE_BENCHMARKS.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedPresetId === preset.id
                          ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md'
                          : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#0F172A]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="font-bold opacity-80">{preset.expectedRating} Quality</span>
                        <span className="opacity-60">{preset.clauseRef}</span>
                      </div>
                      <div className="font-bold text-xs line-clamp-1">{preset.name}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-xl bg-[#0F172A] hover:bg-black text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Analyze Selected Benchmark →</span>}
                  </button>
                </div>
              </div>
            )}

            {/* Optional Search Query & Locale context */}
            <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-mono text-[#64748B]">
              <span className="flex items-center gap-1">
                <Search className="w-3.5 h-3.5" /> Target Query:
              </span>
              <input
                type="text"
                value={targetQuery}
                onChange={(e) => setTargetQuery(e.target.value)}
                placeholder="e.g. [symptoms of dehydration] (optional)"
                className="px-2.5 py-1 bg-white border border-[#E2E8F0] rounded-lg text-xs font-mono text-[#0F172A] w-full sm:w-64 outline-none focus:border-[#0F172A]"
              />
            </div>

            {/* Error Message with Retry */}
            {error && (
              <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold font-mono uppercase tracking-wider block">Audit Notice:</span>
                    <p className="mt-0.5">{error}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRunAudit()}
                  disabled={loading}
                  className="px-4 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retry
                </button>
              </div>
            )}
          </form>

          {/* Loading Animation */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 p-6 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm max-w-xl mx-auto"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-emerald-400 flex items-center justify-center mx-auto mb-3 animate-pulse">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#0F172A]">
                  Evaluating Against September 2025 Guidelines
                </h4>
                <p className="text-xs font-mono text-[#64748B] mt-1">
                  {AUDIT_STEPS[stepIndex]}
                </p>
                <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden mt-4">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                    style={{ width: `${((stepIndex + 1) / AUDIT_STEPS.length) * 100}%` }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* "WHAT WE CHECK" Interactive Criteria Breakdown Grid */}
      <section id="criteria" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto scroll-mt-20">
        <div className="text-center mb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#64748B]">
            WHAT WE CHECK
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] mt-1">
            21 Criteria Across 7 Core Quality Categories
          </h2>
          <p className="text-xs font-mono text-[#64748B] mt-1.5">
            21 total criteria · 100 maximum points based on the official guidelines
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {CATEGORY_CHECKS.map((cat, idx) => (
            <div
              key={cat.name}
              className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:border-[#CBD5E1] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#0F172A]">{cat.name}</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#0F172A]/5 text-[#0F172A]">
                    {cat.pts}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 font-semibold block mb-1.5">
                  {cat.checks}
                </span>
                <p className="text-xs text-[#64748B] leading-relaxed">{cat.desc}</p>
              </div>
            </div>
          ))}

          {/* 100 Pts Total Card */}
          <div className="p-4 bg-[#0F172A] text-white rounded-xl shadow-sm flex flex-col justify-center text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
              Total Evaluation Scale
            </span>
            <span className="text-2xl font-bold font-mono mt-0.5">100 Maximum Points</span>
            <span className="text-xs text-white/70 font-mono mt-1">Lowest (0) → Highest (100)</span>
          </div>
        </div>
      </section>

      {/* Live Audit Results View (When Generated) */}
      <div ref={resultsTopRef} />
      {result && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#E2E8F0]">
          <div className="bg-white rounded-2xl border-2 border-[#0F172A]/15 p-6 md:p-8 shadow-md mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Audit Complete
                  </span>
                  <span className="text-xs font-mono text-[#64748B]">
                    {result.guidelineVersion}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#0F172A] mt-1.5">
                  {result.pageTitle}
                </h3>
                <p className="text-xs font-mono text-[#64748B] truncate max-w-xl mt-0.5">
                  {result.url}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="px-3 py-1.5 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] font-mono text-xs font-semibold flex items-center gap-1.5 border border-[#CBD5E1] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Report'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadMarkdown}
                  className="px-3 py-1.5 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] font-mono text-xs font-semibold flex items-center gap-1.5 border border-[#CBD5E1] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.MD</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isPdfGenerating}
                  className="px-4 py-1.5 rounded-lg bg-[#0F172A] hover:bg-black text-white font-mono text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  {isPdfGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            {/* Navigation Tab Pills */}
            <div className="flex overflow-x-auto scrollbar-none py-4 gap-2 border-b border-[#E2E8F0]">
              {[
                { id: 'overview', label: 'Overview & Score', icon: BarChart3 },
                { id: 'criteria21', label: '21 Criteria Grid', icon: ShieldCheck },
                { id: 'eeat', label: 'E-E-A-T Trust Core', icon: Award },
                { id: 'ymyl', label: 'YMYL Standards', icon: ShieldAlert },
                { id: 'needsMet', label: 'Needs Met Intent', icon: Target },
                { id: 'roadmap', label: 'SEO Recommendations', icon: CheckCircle2 },
                { id: 'markdown', label: 'Full Markdown Report', icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#0F172A] text-white shadow-sm'
                        : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : ''}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Container */}
            <div ref={reportRef} className="pt-6 space-y-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Score & Summary Banner */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-8 space-y-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-[#64748B]">
                        Executive Evaluator Finding:
                      </span>
                      <p className="text-sm text-[#334155] leading-relaxed">
                        {result.summary}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0]">
                          Type: {result.pageType}
                        </span>
                        <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0]">
                          Purpose: {result.detectedPurpose}
                        </span>
                      </div>
                    </div>

                    <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0F172A] text-white text-center border border-[#0F172A] shadow-md">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                        Total Page Quality Score
                      </span>
                      <div className="text-5xl font-bold font-mono text-white mt-1">
                        {result.overallScore}
                        <span className="text-lg text-white/50">/100</span>
                      </div>
                      <div className="mt-2 inline-block text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {result.overallRating} Quality
                      </div>
                    </div>
                  </div>

                  {/* Official Guideline PQ Slider */}
                  <RatingSlider score={result.overallScore} rating={result.overallRating} type="PQ" />

                  {/* 2025 Web Spam Screener */}
                  <SpamAbuseBadgeBar checks={result.spamAbuseChecks} />

                  {/* Category Breakdown Radar & Scores */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                    <div className="lg:col-span-6 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-5">
                      <h4 className="font-bold text-sm text-[#0F172A] mb-1">
                        7 Quality Dimensions Radar
                      </h4>
                      <p className="text-xs text-[#64748B] font-mono mb-3">
                        Evaluator weight balance across categories
                      </p>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData}>
                            <PolarGrid stroke="#CBD5E1" />
                            <PolarAngleAxis dataKey="category" tick={{ fill: '#334155', fontSize: 10, fontFamily: 'monospace' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94A3B8" />
                            <Radar name="Quality Score" dataKey="score" stroke="#0F172A" fill="#10B981" fillOpacity={0.4} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="lg:col-span-6 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-5 space-y-3">
                      <h4 className="font-bold text-sm text-[#0F172A]">
                        Category Weight Breakdown
                      </h4>
                      {[
                        { name: 'Page Purpose & Intent (10 pts)', score: result.categoryScores.pagePurpose },
                        { name: 'E-E-A-T Signals (25 pts)', score: result.categoryScores.eeat },
                        { name: 'Main Content Quality (25 pts)', score: result.categoryScores.mcQuality },
                        { name: 'Author & Website Info (15 pts)', score: result.categoryScores.authorWebsiteInfo },
                        { name: 'YMYL Standards (10 pts)', score: result.categoryScores.ymylStandards },
                        { name: 'Reputation Signals (10 pts)', score: result.categoryScores.reputationSignals },
                        { name: 'Content Safety & Harm (5 pts)', score: result.categoryScores.spamSafety },
                      ].map((item) => (
                        <div key={item.name}>
                          <div className="flex justify-between text-xs font-mono mb-1">
                            <span className="font-semibold text-[#334155]">{item.name}</span>
                            <span className="font-bold text-[#0F172A]">{item.score}/100</span>
                          </div>
                          <div className="h-2 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#0F172A] rounded-full transition-all duration-500"
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'criteria21' && (
                <CriteriaGrid criteria={result.criteria21} />
              )}

              {activeTab === 'eeat' && (
                <EEATTrustVisualizer breakdown={result.eeatBreakdown} />
              )}

              {activeTab === 'ymyl' && (
                <YMYLCard ymyl={result.ymylAssessment} />
              )}

              {activeTab === 'needsMet' && result.needsMetAnalysis && (
                <NeedsMetCard needsMet={result.needsMetAnalysis} />
              )}

              {activeTab === 'roadmap' && (
                <ActionableRoadmap items={result.actionableRoadmap} />
              )}

              {activeTab === 'markdown' && (
                <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-6 text-xs font-sans leading-relaxed">
                  <Markdown>{result.markdownReport}</Markdown>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Content Section 1: What Is a Search Quality Rater Tool? */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-[#E2E8F0]">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
          What Is a Search Quality Rater Tool?
        </h2>
        <div className="mt-4 space-y-4 text-sm sm:text-base text-[#475569] leading-relaxed">
          <p>
            <strong>Search Quality Rater Tool</strong> is an automated search quality rater tool built directly on Google's official <em>Search Quality Evaluator Guidelines</em> (September 2025 edition). It allows SEO professionals, content creators, and web teams to evaluate any URL against the same criteria used by human quality raters — giving you a data-driven understanding of your page quality before Google's algorithms and AI systems evaluate quality across your site.
          </p>
          <p>
            Every time someone performs an everyday search, Google relies on a combination of automated algorithms and human quality rater feedback to determine which pages deserve to rank. Quality raters evaluate search results using a structured process defined in the rater guidelines — covering everything from E-E-A-T signals to YMYL content standards. Our tool brings that same evaluation process to any web page in seconds, helping you evaluate and improve your search quality with confidence.
          </p>
        </div>
      </section>

      {/* Content Section 2: Understanding E-E-A-T */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-[#E2E8F0]">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Understanding E-E-A-T in the Quality Rater Guidelines
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#475569]">
            E-E-A-T — Experience, Expertise, Authoritativeness, and Trust — is the central framework that Google's search quality rater guidelines use to assess page quality. These four signals are evaluated across all content types, with Trust carrying the greatest weight.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold font-mono text-lg flex items-center justify-center mb-3">
                E
              </div>
              <h3 className="font-bold text-base text-[#0F172A]">Experience</h3>
              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                Does the content creator demonstrate genuine first-hand experience with the topic? Real-world involvement and personal knowledge are key quality signals the rater guidelines prioritize.
              </p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 font-bold font-mono text-lg flex items-center justify-center mb-3">
                E
              </div>
              <h3 className="font-bold text-base text-[#0F172A]">Expertise</h3>
              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                Does the author demonstrate appropriate topical expertise and skills? Formal credentials matter more for YMYL topics, while everyday content requires demonstrated knowledge and competence.
              </p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 font-bold font-mono text-lg flex items-center justify-center mb-3">
                A
              </div>
              <h3 className="font-bold text-base text-[#0F172A]">Authoritativeness</h3>
              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                Is the site or author recognized as an authoritative source? External signals, search results prominence, and industry reputation all contribute to authoritativeness.
              </p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border-2 border-emerald-500 bg-emerald-50/30 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold font-mono text-lg flex items-center justify-center mb-3">
                T
              </div>
              <h3 className="font-bold text-base text-[#0F172A]">Trust (Core)</h3>
              <p className="text-xs text-[#334155] mt-2 leading-relaxed">
                Does the page demonstrate overall trustworthiness? This is the most critical E-E-A-T signal — covering accuracy, transparency, security, and the absence of deceptive or harmful content across web pages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section 3: How the Search Quality Rater Score Works */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-[#E2E8F0] scroll-mt-20">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-semibold mb-3">
            <span>4-Step Automated Evaluation Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
            How the Search Quality Rater Score Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#475569]">
            Our tool uses advanced Gemini AI models to evaluate web pages across 21 individual criteria drawn directly from Google's official Search Quality Evaluator Guidelines (September 2025). Each criterion is weighted to reflect its importance in the official rater guidelines, producing a total Page Quality (PQ) score out of 100 points — matching the exact rating scale quality raters use (Lowest to Highest).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AUDIT_STEPS_GUIDE.map((step) => (
            <div
              key={step.step}
              className="p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm relative overflow-hidden hover:border-[#0F172A] transition-all"
            >
              <span className="text-3xl font-black font-mono text-[#E2E8F0] absolute top-3 right-4">
                {step.step}
              </span>
              <h3 className="font-bold text-base text-[#0F172A] mt-2">{step.title}</h3>
              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Content Section 4: YMYL Pages Explanation */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-[#E2E8F0]">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
          What Are YMYL Pages and Why Do They Require Higher Page Quality?
        </h2>
        <div className="mt-4 space-y-4 text-sm sm:text-base text-[#475569] leading-relaxed">
          <p>
            <strong>YMYL — "Your Money or Your Life"</strong> — identifies web pages in the Google Search Quality Evaluator Guidelines that can significantly impact a person's health, financial stability, safety, or well-being. YMYL topics include medical and health information, financial and legal advice, safety-critical instructions, and important news.
          </p>
          <p>
            Quality raters apply significantly stricter standards when they evaluate YMYL pages because inaccurate content in these areas can cause real harm to people. Our tool automatically detects YMYL topics and checks whether your claims are properly sourced, meet expert consensus standards, and demonstrate the level of expertise and knowledge the rater guidelines require.
          </p>
        </div>
      </section>

      {/* Content Section 5: Page Quality Rating Scale */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-[#E2E8F0]">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Page Quality Rating Scale: Lowest to Highest
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#475569]">
            The Google Search Quality Evaluator Guidelines define five levels of page quality. Understanding your position on this scale helps you prioritize improvements to your E-E-A-T, search quality, and content strategy:
          </p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {QUALITY_SCALE_LEVELS.map((lvl) => (
            <div
              key={lvl.level}
              className={`p-4 rounded-xl border ${lvl.color} flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${lvl.badge}`}>
                    {lvl.range}
                  </span>
                  <h3 className="font-bold text-sm">{lvl.level}</h3>
                </div>
                <p className="text-xs opacity-85 mt-1">{lvl.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Content Section 6: Who Benefits from a Search Quality Rater Score? */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-[#E2E8F0]">
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Who Benefits from a Search Quality Rater Score?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#475569]">
            Search Quality Rater Tool is used by a wide range of people and online teams who need to understand and improve how Google's quality raters evaluate their web pages and search results:
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto mb-8">
          {TARGET_PERSONAS.map((persona) => (
            <span
              key={persona}
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-mono font-semibold shadow-2xs hover:border-[#CBD5E1] transition-all"
            >
              {persona}
            </span>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-sm text-[#475569] leading-relaxed space-y-3 bg-[#F8FAFC] p-6 rounded-2xl border border-[#E2E8F0]">
          <p>
            Whether you're auditing a single landing page, managing a large web project, or building a content strategy informed by data, understanding how quality raters evaluate your content is one of the most direct inputs available for modern SEO.
          </p>
          <p>
            The search quality rater guidelines provide the clearest signal of what Google — and its AI systems — considers authoritative, trustworthy, and useful. Understanding those criteria is foundational knowledge for anyone working to improve their rankings and search results.
          </p>
        </div>
      </section>

      {/* Content Section 7: Comprehensive FAQ */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-[#E2E8F0] scroll-mt-20">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#64748B]">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1">
            Search Quality Rater Guidelines & Jobs
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#64748B]">
            Common questions regarding quality raters, rater jobs, and how AI systems evaluate quality.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={item.q}
                className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#64748B] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#475569] leading-relaxed border-t border-[#F1F5F9] whitespace-pre-line bg-[#F8FAFC]/50">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Content Section 8: Related Topics Tag Cloud */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-[#E2E8F0]">
        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#64748B] mb-4 text-center">
          Related Search Quality & Rater Guidelines Topics
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {RELATED_TOPICS.map((topic) => (
            <span
              key={topic}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              {topic}
            </span>
          ))}
        </div>
      </section>

      {/* Footer Matching searchqualityrater.com */}
      <footer className="border-t border-[#E2E8F0] bg-white py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="font-bold text-base text-[#0F172A]">
              Search Quality Rater Tool
            </span>
            <span className="text-xs font-mono text-[#64748B]">
              — searchqualityrater.com
            </span>
          </div>

          <p className="text-xs font-mono text-[#64748B]">
            Based on the Google Search Quality Evaluator Guidelines, September 2025 · 21 criteria · 100-point scoring
          </p>

          <p className="text-[11px] text-[#94A3B8] max-w-xl mx-auto pt-2">
            © 2025 Search Quality Rater Tool. Developed by SEO Girl - Ami. All rights reserved. Not affiliated with or endorsed by Google LLC. The Google Search Quality Evaluator Guidelines are published by Google and referenced here for educational and analytical purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}

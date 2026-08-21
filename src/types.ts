export type RatingLevel = 
  | 'Lowest' 
  | 'Lowest+' 
  | 'Low' 
  | 'Low+' 
  | 'Medium' 
  | 'Medium+' 
  | 'High' 
  | 'High+' 
  | 'Highest';

export type CriteriaStatus = 'pass' | 'warning' | 'fail' | 'exemplary';

export interface CriteriaScore {
  id: string;
  name: string;
  category: 
    | 'Page Purpose & Intent'
    | 'Main Content (MC) Quality'
    | 'E-E-A-T & Trust Foundation'
    | 'Author & Website Transparency'
    | 'YMYL Standards'
    | 'Reputation Signals'
    | 'Content Safety & Anti-Spam';
  clause: string;
  score: number;
  rating: RatingLevel;
  status: CriteriaStatus;
  finding: string;
  guidelineInsight: string;
}

export interface EEATDimension {
  score: number;
  evaluation: string;
  keySignals: string[];
}

export interface EEATTrustDimension extends EEATDimension {
  isDealbreaker: boolean;
}

export interface SpamAbuseCheck {
  detected: boolean;
  severity: 'None' | 'Low Risk' | 'Flagged Violation';
  details: string;
  clause: string;
}

export interface ActionableItem {
  priority: 'Critical' | 'High' | 'Medium';
  action: string;
  impact: string;
  guidelineRef: string;
}

export interface NeedsMetAnalysis {
  targetQuery: string;
  locale: string;
  queryIntent: 'Know' | 'Know Simple' | 'Do' | 'Website' | 'Visit-in-Person' | 'Multiple Intents';
  needsMetRating: 'Fully Meets (FullyM)' | 'Highly Meets (HM)' | 'Moderately Meets (MM)' | 'Slightly Meets (SM)' | 'Fails to Meet (FailsM)';
  score: number;
  explanation: string;
  flags: {
    porn: boolean;
    foreignLanguage: boolean;
    didNotLoad: boolean;
    upsettingOffensive: boolean;
    notForEveryone: boolean;
  };
}

export interface AnalysisResult {
  url: string;
  pageTitle: string;
  metaDescription?: string;
  analyzedAt: string;
  guidelineVersion: string;
  overallScore: number;
  overallRating: RatingLevel;
  pageType: string;
  detectedPurpose: string;
  summary: string;
  categoryScores: {
    pagePurpose: number;
    mcQuality: number;
    eeat: number;
    authorWebsiteInfo: number;
    ymylStandards: number;
    reputationSignals: number;
    spamSafety: number;
  };
  criteria21: CriteriaScore[];
  eeatBreakdown: {
    experience: EEATDimension;
    expertise: EEATDimension;
    authoritativeness: EEATDimension;
    trust: EEATTrustDimension;
  };
  ymylAssessment: {
    isYMYL: boolean;
    spectrum: 'Clear YMYL' | 'May be YMYL' | 'Not or Unlikely YMYL';
    topicCategory: 'Health or Safety' | 'Financial Security' | 'Government, Civics & Society' | 'Other' | 'None';
    harmRiskLevel: 'High' | 'Moderate' | 'Low' | 'None';
    explanation: string;
    experienceVsExpertiseRule: string;
    meetsHighStandard: boolean;
  };
  spamAbuseChecks: {
    scaledContentAbuse: SpamAbuseCheck;
    siteReputationAbuse: SpamAbuseCheck;
    expiredDomainAbuse: SpamAbuseCheck;
    fillerAndUxObstruction: SpamAbuseCheck;
    deceptiveDesign: SpamAbuseCheck;
  };
  needsMetAnalysis?: NeedsMetAnalysis;
  actionableRoadmap: ActionableItem[];
  markdownReport: string;
}

export interface AuditRequestPayload {
  url?: string;
  rawContent?: string;
  customTitle?: string;
  customDescription?: string;
  targetQuery?: string;
  locale?: string;
}

export interface Competitor {
  name: string;
  arr_range: string;
  description: string;
}

export type SourceName = "META ADS" | "REDDIT" | "PRODUCT HUNT" | "G2" | "GOOGLE TRENDS";
export type Sentiment = "positive" | "negative" | "mixed";

export interface Source {
  name: SourceName;
  sentiment: Sentiment;
  finding: string;
}

export interface AnalysisResult {
  willingness_to_pay: number;
  willingness_to_pay_explanation: string;
  market_saturation: number;
  market_saturation_explanation: string;
  verdict_explanation: string;
  ads_detected: number;
  price_range: string;
  competitors: Competitor[];
  proof_points: string[];
  reddit_insights: string[];
  sources: Source[];
  sources_analyzed: number;
}

export interface AnalysisRecord {
  id: string;
  saasName: string;
  description: string;
  niche: string;
  date: string;
  result: AnalysisResult;
}

export type Badge = "Go" | "Prudence" | "Stop";

export function getBadge(wtp: number, saturation: number): Badge {
  if (wtp >= 65 && saturation <= 55) return "Go";
  if (wtp < 35 || saturation >= 75) return "Stop";
  return "Prudence";
}

export const BADGE_STYLES: Record<
  Badge,
  { color: string; bg: string; border: string; gradientBg: string }
> = {
  Go: {
    color: "#4ade80",
    bg: "rgba(74,222,128,0.12)",
    border: "rgba(74,222,128,0.35)",
    gradientBg: "rgba(74,222,128,0.08)",
  },
  Prudence: {
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.12)",
    border: "rgba(251,191,36,0.35)",
    gradientBg: "rgba(251,191,36,0.08)",
  },
  Stop: {
    color: "#f87171",
    bg: "rgba(248,113,113,0.12)",
    border: "rgba(248,113,113,0.35)",
    gradientBg: "rgba(248,113,113,0.08)",
  },
};

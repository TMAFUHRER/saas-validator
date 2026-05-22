export interface AnalysisResult {
  willingness_to_pay: number;
  market_saturation: number;
  ads_detected: number;
  price_range: string;
  competitors: string[];
  proof_points: string[];
  reddit_insights: string[];
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

export const BADGE_STYLES: Record<Badge, { color: string; bg: string; border: string; label: string }> = {
  Go: { color: "#4ade80", bg: "rgba(74,222,128,0.12)", border: "rgba(74,222,128,0.35)", label: "Go" },
  Prudence: { color: "#fbbf24", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.35)", label: "Prudence" },
  Stop: { color: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.35)", label: "Stop" },
};

"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface CategoryScore {
  score: number;
  summary: string;
  details: string;
}

interface Analysis {
  market_size: CategoryScore;
  competition: CategoryScore;
  technical_complexity: CategoryScore;
  target_audience: {
    primary: string;
    size: string;
    details: string;
  };
  revenue_potential: CategoryScore & { model: string };
  key_risks: string[];
  opportunities: string[];
  go_to_market: string;
  overall_verdict: {
    score: number;
    recommendation: string;
    summary: string;
  };
}

function ScoreRing({ score, size = 80, invert = false }: { score: number; size?: number; invert?: boolean }) {
  const displayScore = invert ? 11 - score : score;
  const pct = (displayScore - 1) / 9;
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - pct * circumference;
  const color = pct >= 0.7 ? "#22c55e" : pct >= 0.4 ? "#eab308" : "#ef4444";

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={color} strokeWidth={6}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle" dominantBaseline="middle"
        style={{ fill: color, fontSize: size * 0.22, fontWeight: 700, transform: `rotate(90deg)`, transformOrigin: `${size / 2}px ${size / 2}px` }}
      >
        {displayScore}
      </text>
    </svg>
  );
}

function VerdictBadge({ recommendation }: { recommendation: string }) {
  const config: Record<string, { color: string; bg: string; border: string }> = {
    "Strong Go": { color: "#4ade80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.3)" },
    "Proceed with Caution": { color: "#facc15", bg: "rgba(250,204,21,0.1)", border: "rgba(250,204,21,0.3)" },
    "Needs Pivoting": { color: "#fb923c", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.3)" },
    "Avoid": { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)" },
  };
  const style = config[recommendation] ?? config["Proceed with Caution"];
  return (
    <span className="px-3 py-1 rounded-full text-sm font-semibold border" style={{ color: style.color, backgroundColor: style.bg, borderColor: style.border }}>
      {recommendation}
    </span>
  );
}

function AppContent() {
  const searchParams = useSearchParams();
  const prefill = searchParams.get("idea") ?? "";
  const [idea, setIdea] = useState(prefill);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (prefill) setIdea(prefill); }, [prefill]);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!idea.trim() || loading) return;
    setLoading(true);
    setAnalysis(null);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a1a" }}>
      <nav className="sticky top-0 z-50 border-b border-white/5" style={{ backgroundColor: "rgba(10,10,26,0.9)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-semibold text-white text-sm">SaaSValidator</span>
          </Link>
          <span className="text-xs" style={{ color: "#475569" }}>Powered by Claude AI</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-white mb-1">Validate your SaaS idea</h1>
          <p className="text-sm mb-6" style={{ color: "#64748b" }}>Describe your idea in detail for the best analysis.</p>
          <form onSubmit={handleAnalyze}>
            <div className="card-glass rounded-2xl p-1">
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g. A project management SaaS for freelance graphic designers that integrates with Adobe Creative Cloud and handles client invoicing automatically..."
                rows={4}
                className="w-full px-4 pt-3 pb-2 rounded-xl text-white placeholder-slate-600 text-sm resize-none outline-none"
                style={{ backgroundColor: "transparent" }}
                disabled={loading}
              />
              <div className="flex items-center justify-between px-3 pb-2">
                <span className="text-xs" style={{ color: "#475569" }}>
                  {idea.length < 20 ? "Be specific for better results" : `${idea.length} chars`}
                </span>
                <button
                  type="submit"
                  disabled={loading || idea.trim().length < 10}
                  className="btn-primary px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ transform: "none" }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyzing…
                    </span>
                  ) : "Analyze →"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(79,70,229,0.2), rgba(124,58,237,0.2))", border: "1px solid rgba(99,102,241,0.3)" }}>
                <svg className="w-8 h-8 animate-spin" style={{ color: "#818cf8" }} viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Claude is analyzing your idea</p>
                <p className="text-sm mt-1" style={{ color: "#475569" }}>This takes about 10–15 seconds…</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border px-5 py-4 mb-6" style={{ backgroundColor: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)" }}>
            <p className="text-sm font-medium" style={{ color: "#fca5a5" }}>Error: {error}</p>
            {error.includes("ANTHROPIC_API_KEY") && (
              <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>
                Make sure your <code className="font-mono">ANTHROPIC_API_KEY</code> is set in environment secrets.
              </p>
            )}
          </div>
        )}

        {analysis && !loading && (
          <div className="space-y-6">
            {/* Verdict */}
            <div className="card-glass rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="flex-shrink-0">
                <ScoreRing score={analysis.overall_verdict.score} size={90} />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-lg font-bold text-white">Overall Verdict</h2>
                  <VerdictBadge recommendation={analysis.overall_verdict.recommendation} />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{analysis.overall_verdict.summary}</p>
              </div>
            </div>

            {/* Score grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Market Size", data: analysis.market_size, note: "" },
                { label: "Competition", data: analysis.competition, invert: true, note: "lower = less crowded" },
                { label: "Revenue Potential", data: analysis.revenue_potential, note: "" },
                { label: "Tech Complexity", data: analysis.technical_complexity, invert: true, note: "lower = easier to build" },
              ].map(({ label, data, invert, note }) => (
                <div key={label} className="card-glass rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs font-medium" style={{ color: "#64748b" }}>{label}</p>
                      {note && <p className="text-xs" style={{ color: "#334155" }}>{note}</p>}
                    </div>
                    <ScoreRing score={data.score} size={52} invert={invert} />
                  </div>
                  <p className="text-sm font-medium text-white mb-1">{data.summary}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>{data.details}</p>
                </div>
              ))}
            </div>

            {/* Audience + Revenue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card-glass rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Target Audience</h3>
                <div className="space-y-2">
                  <div><span className="text-xs" style={{ color: "#475569" }}>Primary customer</span><p className="text-sm font-medium text-white">{analysis.target_audience.primary}</p></div>
                  <div><span className="text-xs" style={{ color: "#475569" }}>Audience size</span><p className="text-sm font-medium text-white">{analysis.target_audience.size}</p></div>
                  <p className="text-xs leading-relaxed pt-1" style={{ color: "#64748b" }}>{analysis.target_audience.details}</p>
                </div>
              </div>
              <div className="card-glass rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3">Revenue Model</h3>
                <div className="space-y-2">
                  <div><span className="text-xs" style={{ color: "#475569" }}>Suggested model</span><p className="text-sm font-medium text-white">{analysis.revenue_potential.model}</p></div>
                  <p className="text-xs leading-relaxed pt-1" style={{ color: "#64748b" }}>{analysis.revenue_potential.details}</p>
                </div>
              </div>
            </div>

            {/* Risks + Opportunities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card-glass rounded-2xl p-5">
                <h3 className="text-sm font-semibold mb-3" style={{ color: "#fca5a5" }}>Key Risks</h3>
                <ul className="space-y-2">
                  {analysis.key_risks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#94a3b8" }}>
                      <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#f87171" }}>{i + 1}</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-glass rounded-2xl p-5">
                <h3 className="text-sm font-semibold mb-3" style={{ color: "#86efac" }}>Opportunities</h3>
                <ul className="space-y-2">
                  {analysis.opportunities.map((opp, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#94a3b8" }}>
                      <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: "rgba(34,197,94,0.15)", color: "#4ade80" }}>{i + 1}</span>
                      {opp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* GTM */}
            <div className="card-glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-2">Go-to-Market Strategy</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{analysis.go_to_market}</p>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => { setAnalysis(null); setIdea(""); setError(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="text-sm font-medium transition-colors"
                style={{ color: "#6366f1" }}
              >
                ← Analyze another idea
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AppPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0a0a1a" }}>
        <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    }>
      <AppContent />
    </Suspense>
  );
}

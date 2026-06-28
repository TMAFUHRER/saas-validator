"use client";

import { useState, useEffect } from "react";
import { saveAnalysis } from "@/lib/history";
import {
  getBadge,
  BADGE_STYLES,
  type AnalysisResult,
  type Badge,
  type Competitor,
  type Source,
  type Sentiment,
} from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";

function ScoreRing({
  score,
  color,
  size = 120,
}: {
  score: number;
  color: string;
  size?: number;
}) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(100, Math.max(0, score)) / 100);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={9} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={9}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }}
      />
      <text
        x={size / 2} y={size / 2 - 5} textAnchor="middle"
        style={{ fill: color, fontSize: size * 0.26, fontWeight: 800, transform: `rotate(90deg)`, transformOrigin: `${size / 2}px ${size / 2}px` }}
      >
        {score}
      </text>
      <text
        x={size / 2} y={size / 2 + size * 0.16} textAnchor="middle"
        style={{ fill: "rgba(255,255,255,0.3)", fontSize: size * 0.11, transform: `rotate(90deg)`, transformOrigin: `${size / 2}px ${size / 2}px` }}
      >
        /100
      </text>
    </svg>
  );
}

function ScoreCard({
  score, label, sublabel, color, explanation,
}: {
  score: number; label: string; sublabel: string; color: string; explanation?: string;
}) {
  return (
    <div
      className="rounded-2xl border p-5 flex flex-col items-center text-center gap-3"
      style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
    >
      <ScoreRing score={score} color={color} size={110} />
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{sublabel}</p>
      </div>
      {explanation && (
        <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>{explanation}</p>
      )}
    </div>
  );
}

function VerdictBanner({
  badge, explanation, verdictLabel,
}: {
  badge: Badge; explanation: string; verdictLabel: string;
}) {
  const style = BADGE_STYLES[badge];
  const icon = badge === "Go"
    ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    : badge === "Prudence"
    ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z";

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ backgroundColor: style.gradientBg, borderColor: style.border }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: style.bg, border: `1px solid ${style.border}` }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: style.color }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: style.color }} />
          <span className="font-bold text-base" style={{ color: style.color }}>{verdictLabel}</span>
        </div>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{explanation}</p>
    </div>
  );
}

function SectionFlat({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border p-5"
      style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#334155" }}>{title}</p>
      {children}
    </div>
  );
}

function CollapsibleSection({
  title, icon, children, defaultOpen = false,
}: {
  title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span style={{ color: "#6366f1" }}>{icon}</span>
          <span className="font-semibold text-sm text-white">{title}</span>
        </div>
        <svg
          className="w-4 h-4 transition-transform"
          style={{ color: "#475569", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

const SOURCE_COLORS: Record<string, string> = {
  "META ADS": "#818cf8",
  "REDDIT": "#f97316",
  "PRODUCT HUNT": "#ef4444",
  "G2": "#dc2626",
  "GOOGLE TRENDS": "#3b82f6",
};

const SENTIMENT_COLORS: Record<Sentiment, string> = {
  positive: "#22c55e",
  negative: "#f87171",
  mixed: "#94a3b8",
};

function SourceRow({ source }: { source: Source }) {
  const color = SOURCE_COLORS[source.name] ?? "#6366f1";
  const dot = SENTIMENT_COLORS[source.sentiment] ?? "#94a3b8";
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      <span
        className="text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0 mt-0.5"
        style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}30` }}
      >
        {source.name}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{source.finding}</p>
      </div>
      <span
        className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
        style={{ backgroundColor: dot }}
        title={source.sentiment}
      />
    </div>
  );
}

function CompetitorCard({ competitor }: { competitor: Competitor }) {
  return (
    <div
      className="rounded-xl border p-4 mb-3 last:mb-0"
      style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <span className="font-semibold text-sm text-white">{competitor.name}</span>
        {competitor.arr_range && (
          <span className="text-xs font-bold flex-shrink-0" style={{ color: "#4ade80" }}>
            {competitor.arr_range}
          </span>
        )}
      </div>
      <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>{competitor.description}</p>
    </div>
  );
}

function getCompetitorName(c: Competitor | string): string {
  return typeof c === "string" ? c : c.name;
}

export default function AppPage() {
  const { t, lang } = useLanguage();
  const [saasName, setSaasName] = useState("");
  const [description, setDescription] = useState("");
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (result && !saved) {
      saveAnalysis({
        id: Date.now().toString(),
        saasName,
        description,
        niche,
        date: new Date().toISOString(),
        result,
      });
      setSaved(true);
    }
  }, [result, saved, saasName, description, niche]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setSaved(false);

    try {
      const idea = `${t("form.name.label")}: ${saasName}\n${t("form.desc.label")}: ${description}\n${t("form.niche.label")}: ${niche}`;
      const res = await fetch("/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, language: lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de l'analyse");
      setResult(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
    setSaved(false);
  }

  const badge = result ? getBadge(result.willingness_to_pay, result.market_saturation) : null;
  const badgeStyle = badge ? BADGE_STYLES[badge] : null;

  const verdictLabels: Record<"fr" | "en" | "es", Record<"Go" | "Prudence" | "Stop", string>> = {
    fr: { Go: "GO — Fonce !", Prudence: "Prudence — Creuse encore", Stop: "Stop — Trop risqué" },
    en: { Go: "GO — Go for it!", Prudence: "Caution — Dig deeper", Stop: "Stop — Too risky" },
    es: { Go: "¡GO — Adelante!", Prudence: "Prudencia — Investiga más", Stop: "Stop — Demasiado arriesgado" },
  };

  const verdictLabel = badge ? (verdictLabels[lang as "fr" | "en" | "es"] ?? verdictLabels.fr)[badge] : "";

  const competitors = result?.competitors ?? [];

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10" style={{ backgroundColor: "#070814" }}>
      <div className="max-w-2xl mx-auto">

        {/* FORM */}
        {!result && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-white mb-1">{t("form.title")}</h1>
              <p className="text-sm" style={{ color: "#475569" }}>{t("form.subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748b" }}>
                  {t("form.name.label")} <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  value={saasName} onChange={(e) => setSaasName(e.target.value)}
                  placeholder={t("form.name.placeholder")} required disabled={loading}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none border transition-colors"
                  style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", caretColor: "#818cf8" }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748b" }}>
                  {t("form.desc.label")} <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("form.desc.placeholder")} required rows={4} disabled={loading}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none border resize-none transition-colors"
                  style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", caretColor: "#818cf8" }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748b" }}>
                  {t("form.niche.label")} <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  value={niche} onChange={(e) => setNiche(e.target.value)}
                  placeholder={t("form.niche.placeholder")} required disabled={loading}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none border transition-colors"
                  style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", caretColor: "#818cf8" }}
                />
              </div>

              {error && (
                <div
                  className="rounded-xl border px-4 py-3 text-sm"
                  style={{ backgroundColor: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)", color: "#fca5a5" }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !saasName.trim() || !description.trim() || !niche.trim()}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-opacity disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t("form.loading")}
                  </span>
                ) : t("form.submit")}
              </button>
            </form>
          </>
        )}

        {/* RESULTS */}
        {result && badge && badgeStyle && (
          <div className="space-y-5">

            {/* 1. Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-extrabold text-white leading-tight">
                  {t("results.title")} : {saasName}
                </h1>
                <span
                  className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border"
                  style={{ backgroundColor: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.25)", color: "#a5b4fc" }}
                >
                  {niche}
                </span>
              </div>
              <button
                onClick={handleReset}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors"
                style={{ color: "#6366f1", borderColor: "rgba(99,102,241,0.25)", backgroundColor: "rgba(99,102,241,0.08)" }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t("results.newAnalysis")}
              </button>
            </div>

            {/* 2. Verdict Banner */}
            <VerdictBanner
              badge={badge}
              explanation={result.verdict_explanation ?? ""}
              verdictLabel={verdictLabel}
            />

            {/* 3. Score Rings */}
            <div className="grid grid-cols-2 gap-4">
              <ScoreCard
                score={result.willingness_to_pay}
                label={t("results.ring1")}
                sublabel={t("results.ring1sub")}
                color="#22c55e"
                explanation={result.willingness_to_pay_explanation}
              />
              <ScoreCard
                score={result.market_saturation}
                label={t("results.ring2")}
                sublabel={t("results.ring2sub")}
                color="#f97316"
                explanation={result.market_saturation_explanation}
              />
            </div>

            {/* 4. Stat Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-xl border px-4 py-3"
                style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#334155" }}>
                  {t("results.adsLabel")}
                </p>
                <p className="text-2xl font-extrabold text-white">{result.ads_detected}</p>
              </div>
              <div
                className="rounded-xl border px-4 py-3"
                style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#334155" }}>
                  {t("results.price")}
                </p>
                <p className="text-xl font-extrabold text-white">{result.price_range}</p>
              </div>
            </div>

            {/* 5. Paying Competitors Pills */}
            <SectionFlat title={t("results.paidCompetitors")}>
              <div className="flex flex-wrap gap-2">
                {competitors.map((c) => (
                  <span
                    key={getCompetitorName(c)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold border"
                    style={{ backgroundColor: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}
                  >
                    {getCompetitorName(c)}
                  </span>
                ))}
              </div>
            </SectionFlat>

            {/* 6. Proof Points */}
            <SectionFlat title={t("results.proof")}>
              <ul className="space-y-3">
                {result.proof_points.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#22c55e" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{p}</span>
                  </li>
                ))}
              </ul>
            </SectionFlat>

            {/* 7. Main Competitors — collapsible */}
            <CollapsibleSection
              title={`${t("results.mainCompetitors")} (${competitors.length})`}
              defaultOpen
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            >
              {competitors.map((c) =>
                typeof c === "string" ? (
                  <div key={c} className="py-2 text-sm" style={{ color: "#94a3b8" }}>{c}</div>
                ) : (
                  <CompetitorCard key={c.name} competitor={c} />
                )
              )}
            </CollapsibleSection>

            {/* 8. Reddit Insights — collapsible */}
            <CollapsibleSection
              title={`${t("results.reddit")} (${result.reddit_insights.length})`}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
            >
              <ul className="space-y-3">
                {result.reddit_insights.map((ins, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#94a3b8" }}>
                    <span
                      className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#f97316" }}
                    >
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{ins}</span>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>

            {/* 9. Sources — collapsible */}
            <CollapsibleSection
              title={`${t("results.sources")} (${result.sources?.length ?? result.sources_analyzed})`}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            >
              {result.sources && result.sources.length > 0 ? (
                <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  {result.sources.map((s) => (
                    <SourceRow key={s.name} source={s} />
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: "#64748b" }}>
                  {t("results.sourcesText", { n: result.sources_analyzed })}
                </p>
              )}
            </CollapsibleSection>

            {/* Saved indicator */}
            <div className="pt-1 text-right">
              <span className="text-xs" style={{ color: "#1e293b" }}>{t("results.saved")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

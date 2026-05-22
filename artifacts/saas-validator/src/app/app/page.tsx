"use client";

import { useState, useEffect } from "react";
import { saveAnalysis } from "@/lib/history";
import { getBadge, BADGE_STYLES, type AnalysisResult } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";

function ScoreRing({
  score,
  label,
  sublabel,
  color,
  size = 140,
}: {
  score: number;
  label: string;
  sublabel: string;
  color: string;
  size?: number;
}) {
  const r = (size - 20) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(100, Math.max(0, score)) / 100);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }}
        />
        <text
          x={size / 2} y={size / 2 - 6} textAnchor="middle"
          style={{
            fill: color, fontSize: size * 0.24, fontWeight: 800,
            transform: `rotate(90deg)`, transformOrigin: `${size / 2}px ${size / 2}px`,
          }}
        >
          {score}
        </text>
        <text
          x={size / 2} y={size / 2 + size * 0.14} textAnchor="middle"
          style={{
            fill: "rgba(255,255,255,0.35)", fontSize: size * 0.11,
            transform: `rotate(90deg)`, transformOrigin: `${size / 2}px ${size / 2}px`,
          }}
        >
          /100
        </text>
      </svg>
      <div className="text-center">
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{sublabel}</p>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}>
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-5 py-4 text-left">
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

  return (
    <div className="min-h-screen px-6 py-10" style={{ backgroundColor: "#070814" }}>
      <div className="max-w-2xl mx-auto">
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
                  value={saasName}
                  onChange={(e) => setSaasName(e.target.value)}
                  placeholder={t("form.name.placeholder")}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none border transition-colors"
                  style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", caretColor: "#818cf8" }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748b" }}>
                  {t("form.desc.label")} <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("form.desc.placeholder")}
                  required
                  rows={4}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none border resize-none transition-colors"
                  style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", caretColor: "#818cf8" }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748b" }}>
                  {t("form.niche.label")} <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder={t("form.niche.placeholder")}
                  required
                  disabled={loading}
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

        {result && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white">{saasName}</h1>
                <span
                  className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium border"
                  style={{ backgroundColor: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.25)", color: "#a5b4fc" }}
                >
                  {niche}
                </span>
              </div>
              {badge && badgeStyle && (
                <span
                  className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold border"
                  style={{ color: badgeStyle.color, backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border }}
                >
                  {badge}
                </span>
              )}
            </div>

            <div
              className="rounded-2xl border p-6 flex flex-col sm:flex-row items-center justify-around gap-8"
              style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
            >
              <ScoreRing
                score={result.willingness_to_pay}
                label={t("results.ring1")}
                sublabel={t("results.ring1sub")}
                color="#22c55e"
              />
              <div className="hidden sm:block w-px h-20" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
              <ScoreRing
                score={result.market_saturation}
                label={t("results.ring2")}
                sublabel={t("results.ring2sub")}
                color="#f97316"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border px-4 py-3" style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}>
                <p className="text-xs mb-1" style={{ color: "#475569" }}>{t("results.ads")}</p>
                <p className="text-xl font-bold text-white">{result.ads_detected}</p>
              </div>
              <div className="rounded-xl border px-4 py-3" style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}>
                <p className="text-xs mb-1" style={{ color: "#475569" }}>{t("results.price")}</p>
                <p className="text-xl font-bold text-white">{result.price_range}</p>
              </div>
            </div>

            <Section
              title={`${t("results.competitors")} (${result.competitors.length})`}
              defaultOpen
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            >
              <div className="flex flex-wrap gap-2">
                {result.competitors.map((c) => (
                  <span key={c} className="px-2.5 py-1 rounded-lg text-xs font-medium border"
                    style={{ backgroundColor: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}>
                    {c}
                  </span>
                ))}
              </div>
            </Section>

            <Section
              title={t("results.proof")}
              defaultOpen
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              <ul className="space-y-2.5">
                {result.proof_points.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "#94a3b8" }}>
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#22c55e" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </Section>

            <Section
              title={t("results.reddit")}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
            >
              <ul className="space-y-2.5">
                {result.reddit_insights.map((ins, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "#94a3b8" }}>
                    <span className="mt-0.5 flex-shrink-0 text-xs font-bold w-4 h-4 rounded flex items-center justify-center"
                      style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#f97316" }}>
                      {i + 1}
                    </span>
                    {ins}
                  </li>
                ))}
              </ul>
            </Section>

            <Section
              title={`${t("results.sources")} (${result.sources_analyzed})`}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            >
              <p className="text-sm" style={{ color: "#64748b" }}>
                {t("results.sourcesText", { n: result.sources_analyzed })}
              </p>
            </Section>

            <div className="flex items-center justify-between pt-2">
              <button onClick={handleReset} className="text-sm font-medium" style={{ color: "#6366f1" }}>
                {t("results.newAnalysis")}
              </button>
              <span className="text-xs" style={{ color: "#1e293b" }}>{t("results.saved")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { saveAnalysis } from "@/lib/history";
import type { AnalysisResult } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import ResultsView from "@/components/ResultsView";

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

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10" style={{ backgroundColor: "#070814" }}>
      <div className="max-w-2xl mx-auto">

        {/* ── FORM ── */}
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

        {/* ── RESULTS ── */}
        {result && (
          <>
            <ResultsView
              result={result}
              saasName={saasName}
              niche={niche}
              onBack={handleReset}
              backLabel={t("results.newAnalysis")}
            />
            <div className="pt-3 text-right">
              <span className="text-xs" style={{ color: "#1e293b" }}>{t("results.saved")}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getHistory, deleteAnalysis } from "@/lib/history";
import { getBadge, BADGE_STYLES, type AnalysisRecord } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import ResultsView from "@/components/ResultsView";

function MiniRing({ score, color }: { score: number; color: string }) {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(100, Math.max(0, score)) / 100);
  return (
    <svg width={40} height={40} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={20} cy={20} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
      <circle cx={20} cy={20} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      <text x={20} y={20} textAnchor="middle" dominantBaseline="middle"
        style={{ fill: color, fontSize: 10, fontWeight: 700, transform: "rotate(90deg)", transformOrigin: "20px 20px" }}>
        {score}
      </text>
    </svg>
  );
}

function analysesCount(n: number, t: (key: string, vars?: Record<string, string | number>) => string) {
  if (n === 1) return t("history.analyses.one");
  return t("history.analyses.other", { n });
}

export default function HistoriquePage() {
  const { t } = useLanguage();
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<AnalysisRecord | null>(null);

  useEffect(() => {
    setMounted(true);
    setRecords(getHistory());
  }, []);

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    deleteAnalysis(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  if (!mounted) return null;

  /* ── Detail view ── */
  if (selected) {
    return (
      <div className="min-h-screen px-4 sm:px-6 py-10" style={{ backgroundColor: "#070814" }}>
        <div className="max-w-2xl mx-auto">
          <ResultsView
            result={selected.result}
            saasName={selected.saasName}
            niche={selected.niche}
            onBack={() => setSelected(null)}
            backLabel={t("history.backToList")}
          />
        </div>
      </div>
    );
  }

  /* ── List view ── */
  return (
    <div className="min-h-screen px-4 sm:px-6 py-10" style={{ backgroundColor: "#070814" }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white">{t("history.title")}</h1>
            <p className="text-sm mt-0.5" style={{ color: "#475569" }}>
              {analysesCount(records.length, t)}
            </p>
          </div>
          <Link
            href="/app"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
          >
            {t("history.new")}
          </Link>
        </div>

        {records.length === 0 ? (
          <div
            className="rounded-2xl border p-12 text-center"
            style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
          >
            <p className="text-4xl mb-4">📊</p>
            <p className="font-semibold text-white mb-1">{t("history.empty.title")}</p>
            <p className="text-sm mb-6" style={{ color: "#475569" }}>{t("history.empty.desc")}</p>
            <Link
              href="/app"
              className="inline-flex px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
            >
              {t("history.empty.cta")}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => {
              const badge = getBadge(record.result.willingness_to_pay, record.result.market_saturation);
              const badgeStyle = BADGE_STYLES[badge];
              const date = new Date(record.date);
              const dateStr = date.toLocaleDateString(undefined, {
                day: "numeric", month: "short", year: "numeric",
              });

              return (
                <div
                  key={record.id}
                  onClick={() => setSelected(record)}
                  className="rounded-2xl border p-5 flex items-center gap-4 group cursor-pointer transition-colors"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.02)",
                    borderColor: "rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(99,102,241,0.06)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(99,102,241,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = "rgba(255,255,255,0.02)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                  }}
                >
                  {/* Mini rings */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex flex-col items-center gap-0.5">
                      <MiniRing score={record.result.willingness_to_pay} color="#22c55e" />
                      <span className="text-[9px]" style={{ color: "#334155" }}>{t("history.payment")}</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <MiniRing score={record.result.market_saturation} color="#f97316" />
                      <span className="text-[9px]" style={{ color: "#334155" }}>{t("history.saturation")}</span>
                    </div>
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-white text-sm truncate">{record.saasName}</p>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium border flex-shrink-0"
                        style={{ backgroundColor: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}
                      >
                        {record.niche}
                      </span>
                    </div>
                    <p className="text-xs line-clamp-1 mb-1.5" style={{ color: "#475569" }}>{record.description}</p>
                    <p className="text-xs" style={{ color: "#334155" }}>{dateStr}</p>
                  </div>

                  {/* Badge + actions */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold border"
                      style={{ color: badgeStyle.color, backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border }}
                    >
                      {badge}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                        style={{ color: "#6366f1" }}>
                        {t("history.view")}
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                      <button
                        onClick={(e) => handleDelete(e, record.id)}
                        className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "#334155" }}
                      >
                        {t("history.delete")}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

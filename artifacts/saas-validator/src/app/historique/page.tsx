"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getHistory, deleteAnalysis } from "@/lib/history";
import { getBadge, BADGE_STYLES, type AnalysisRecord } from "@/lib/types";

function MiniRing({ score, color }: { score: number; color: string }) {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(100, Math.max(0, score)) / 100);
  return (
    <svg width={40} height={40} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={20} cy={20} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
      <circle
        cx={20} cy={20} r={r} fill="none"
        stroke={color} strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <text
        x={20} y={20} textAnchor="middle" dominantBaseline="middle"
        style={{
          fill: color, fontSize: 10, fontWeight: 700,
          transform: "rotate(90deg)", transformOrigin: "20px 20px",
        }}
      >
        {score}
      </text>
    </svg>
  );
}

export default function HistoriquePage() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRecords(getHistory());
  }, []);

  function handleDelete(id: string) {
    deleteAnalysis(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen px-6 py-10" style={{ backgroundColor: "#070814" }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Historique</h1>
            <p className="text-sm mt-0.5" style={{ color: "#475569" }}>
              {records.length} analyse{records.length !== 1 ? "s" : ""} sauvegardée{records.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/app"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
          >
            + Nouvelle analyse
          </Link>
        </div>

        {records.length === 0 ? (
          <div
            className="rounded-2xl border p-12 text-center"
            style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
          >
            <p className="text-4xl mb-4">📊</p>
            <p className="font-semibold text-white mb-1">Aucune analyse pour l&apos;instant</p>
            <p className="text-sm mb-6" style={{ color: "#475569" }}>
              Lance ta première analyse pour voir les résultats ici.
            </p>
            <Link
              href="/app"
              className="inline-flex px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
            >
              Analyser mon marché →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => {
              const badge = getBadge(record.result.willingness_to_pay, record.result.market_saturation);
              const badgeStyle = BADGE_STYLES[badge];
              const date = new Date(record.date);
              const dateStr = date.toLocaleDateString("fr-FR", {
                day: "numeric", month: "short", year: "numeric",
              });

              return (
                <div
                  key={record.id}
                  className="rounded-2xl border p-5 flex items-center gap-4 group"
                  style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
                >
                  {/* Scores */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex flex-col items-center gap-0.5">
                      <MiniRing score={record.result.willingness_to_pay} color="#22c55e" />
                      <span className="text-[9px]" style={{ color: "#334155" }}>paiement</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <MiniRing score={record.result.market_saturation} color="#f97316" />
                      <span className="text-[9px]" style={{ color: "#334155" }}>saturation</span>
                    </div>
                  </div>

                  {/* Info */}
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
                    <p className="text-xs line-clamp-1 mb-1.5" style={{ color: "#475569" }}>
                      {record.description}
                    </p>
                    <p className="text-xs" style={{ color: "#334155" }}>{dateStr}</p>
                  </div>

                  {/* Badge + actions */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold border"
                      style={{ color: badgeStyle.color, backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border }}
                    >
                      {badgeStyle.label}
                    </span>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "#334155" }}
                    >
                      Supprimer
                    </button>
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

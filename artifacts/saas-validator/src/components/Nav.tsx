"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { LANGS, type Lang } from "@/lib/i18n";

export default function Nav() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();

  const links = [
    { href: "/app", key: "nav.analyze" },
    { href: "/historique", key: "nav.history" },
  ];

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 border-b border-white/5"
      style={{ backgroundColor: "rgba(7,8,20,0.88)", backdropFilter: "blur(14px)" }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-bold text-white text-sm tracking-tight">SaaSValidator</span>
        </Link>

        <div className="flex items-center gap-1">
          {/* Nav links */}
          {links.map(({ href, key }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: active ? "#a5b4fc" : "#64748b",
                  backgroundColor: active ? "rgba(99,102,241,0.1)" : "transparent",
                }}
              >
                {t(key)}
              </Link>
            );
          })}

          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg text-sm font-medium"
            style={{ color: "#475569" }}
          >
            {t("nav.logout")}
          </Link>

          {/* Divider */}
          <div className="mx-2 w-px h-5" style={{ backgroundColor: "rgba(255,255,255,0.07)" }} />

          {/* Language switcher */}
          <div
            className="flex items-center gap-0.5 rounded-lg p-0.5"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {LANGS.map(({ code, flag, label }) => {
              const active = lang === code;
              return (
                <button
                  key={code}
                  onClick={() => setLang(code as Lang)}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: active ? "rgba(99,102,241,0.2)" : "transparent",
                    color: active ? "#a5b4fc" : "#475569",
                    border: active ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
                  }}
                  title={code.toUpperCase()}
                >
                  <span>{flag}</span>
                  <span className="hidden sm:inline">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

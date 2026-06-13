"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { LANGS, type Lang } from "@/lib/i18n";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";

export default function Nav() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  const links = [
    { href: "/app", key: "nav.analyze" },
    { href: "/historique", key: "nav.history" },
  ];

  const userInitial =
    user?.firstName?.[0]?.toUpperCase() ||
    user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ||
    "U";

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 border-b border-white/5"
      style={{ backgroundColor: "rgba(7,8,20,0.92)", backdropFilter: "blur(16px)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
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

        {/* Desktop nav links */}
        {isLoaded && isSignedIn && (
          <div className="hidden sm:flex items-center gap-1 ml-2">
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
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">

          {/* Language switcher — always visible on all screen sizes */}
          <div
            className="flex items-center gap-0.5 rounded-xl p-1"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
          >
            {LANGS.map(({ code, flag, label }) => {
              const active = lang === code;
              return (
                <button
                  key={code}
                  onClick={() => setLang(code as Lang)}
                  className="flex items-center gap-1 rounded-lg transition-all"
                  style={{
                    padding: "5px 8px",
                    backgroundColor: active ? "rgba(99,102,241,0.25)" : "transparent",
                    border: active ? "1px solid rgba(99,102,241,0.4)" : "1px solid transparent",
                  }}
                  title={code.toUpperCase()}
                  aria-label={code.toUpperCase()}
                >
                  <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>{flag}</span>
                  <span
                    className="hidden sm:inline text-xs font-semibold"
                    style={{ color: active ? "#a5b4fc" : "#475569" }}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="w-px h-5 hidden sm:block" style={{ backgroundColor: "rgba(255,255,255,0.07)" }} />

          {/* Auth */}
          {isLoaded ? (
            isSignedIn ? (
              <div className="flex items-center gap-2">
                {/* User avatar */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 select-none"
                  style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
                  title={user?.emailAddresses?.[0]?.emailAddress}
                >
                  {userInitial}
                </div>
                {/* Sign out — desktop only */}
                <button
                  onClick={() => signOut({ redirectUrl: "/" })}
                  className="hidden sm:block px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: "#475569" }}
                >
                  {t("nav.logout")}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/sign-in"
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: "#64748b" }}
                >
                  <span className="hidden sm:inline">{t("nav.logout")}</span>
                </Link>
                <Link
                  href="/sign-up"
                  className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
                >
                  {t("nav.signup")}
                </Link>
              </div>
            )
          ) : (
            <div className="w-7 h-7 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
          )}
        </div>
      </div>

      {/* Mobile nav links — shown below main bar when signed in */}
      {isLoaded && isSignedIn && (
        <div
          className="flex sm:hidden items-center gap-1 px-4 pb-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          {links.map(({ href, key }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className="flex-1 text-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  color: active ? "#a5b4fc" : "#64748b",
                  backgroundColor: active ? "rgba(99,102,241,0.1)" : "transparent",
                }}
              >
                {t(key)}
              </Link>
            );
          })}
          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="flex-1 text-center px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ color: "#334155" }}
          >
            {t("nav.logout")}
          </button>
        </div>
      )}
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { href: "/app", label: "Analyser" },
    { href: "/historique", label: "Historique" },
  ];

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 border-b border-white/5"
      style={{ backgroundColor: "rgba(7,8,20,0.85)", backdropFilter: "blur(14px)" }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-bold text-white text-sm tracking-tight">SaaSValidator</span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ href, label }) => {
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
                {label}
              </Link>
            );
          })}
          <Link
            href="/"
            className="ml-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{ color: "#475569" }}
          >
            Déconnexion
          </Link>
        </div>
      </div>
    </nav>
  );
}

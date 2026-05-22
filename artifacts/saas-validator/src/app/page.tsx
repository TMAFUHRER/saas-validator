import Link from "next/link";

const features = [
  {
    emoji: "💸",
    title: "Des gens paient déjà ?",
    desc: "On détecte si des acheteurs existent dans ton marché grâce aux signaux publicitaires et aux discussions en ligne.",
  },
  {
    emoji: "🔥",
    title: "Saturation du marché",
    desc: "On mesure la concurrence réelle — combien de joueurs actifs, à quel prix, avec quelle intensité.",
  },
  {
    emoji: "💬",
    title: "Insights Reddit & forums",
    desc: "Ce que les vrais utilisateurs disent de ce problème — frustrations, demandes, prix acceptables.",
  },
  {
    emoji: "🏷️",
    title: "Fourchette de prix",
    desc: "Le prix de marché réel pour ton type de SaaS, basé sur les concurrents actifs détectés.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#070814" }}>
      {/* Hero */}
      <section
        className="pt-28 pb-20 px-6 text-center relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 70%), #070814",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-8 border"
            style={{
              backgroundColor: "rgba(99,102,241,0.1)",
              borderColor: "rgba(99,102,241,0.3)",
              color: "#a5b4fc",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: "#818cf8" }}
            />
            Analyse IA · Gratuit
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-5 leading-[1.05]"
            style={{ color: "#f8fafc" }}
          >
            Ton SaaS peut-il{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              se vendre ?
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-10 max-w-xl mx-auto" style={{ color: "#64748b" }}>
            Analyse instantanée de ton marché — découvre si des gens paient déjà pour ton idée avant d&apos;écrire une ligne de code.
          </p>

          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-white"
            style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
          >
            Analyser mon marché
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          <p className="mt-4 text-sm" style={{ color: "#334155" }}>
            Gratuit · Résultats en 30 secondes · Aucune inscription
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold uppercase tracking-widest mb-10" style={{ color: "#334155" }}>
            Ce qu&apos;on analyse pour toi
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-5 rounded-2xl border"
                style={{
                  backgroundColor: "rgba(255,255,255,0.02)",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <div className="text-2xl mb-3">{f.emoji}</div>
                <h3 className="font-semibold text-white mb-1.5">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="py-16 px-6 text-center">
        <div
          className="max-w-lg mx-auto rounded-2xl p-8 border"
          style={{
            backgroundColor: "rgba(99,102,241,0.06)",
            borderColor: "rgba(99,102,241,0.2)",
          }}
        >
          <p className="text-xl font-bold text-white mb-2">Prêt à tester ton idée ?</p>
          <p className="text-sm mb-6" style={{ color: "#64748b" }}>
            Remplis 3 champs. L&apos;IA fait le reste.
          </p>
          <Link
            href="/app"
            className="inline-flex px-6 py-3 rounded-xl font-semibold text-sm text-white"
            style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
          >
            Démarrer l&apos;analyse →
          </Link>
        </div>
      </section>

      <footer className="py-6 text-center border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        <p className="text-xs" style={{ color: "#1e293b" }}>
          © {new Date().getFullYear()} SaaSValidator · Propulsé par Gemini AI
        </p>
      </footer>
    </div>
  );
}

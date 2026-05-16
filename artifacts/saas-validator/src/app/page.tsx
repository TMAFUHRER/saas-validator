import Link from "next/link";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Market Sizing",
    description: "Understand the total addressable market and realistic revenue potential for your idea.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Competition Analysis",
    description: "Discover how saturated your market is and where you can carve out a competitive edge.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Instant Verdict",
    description: "Get a clear go/no-go recommendation with actionable next steps in seconds.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Risk & Opportunities",
    description: "Identify the key risks to avoid and untapped opportunities to exploit.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Revenue Model",
    description: "Get a suggested pricing strategy tailored to your specific SaaS category.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    title: "Go-to-Market Strategy",
    description: "Learn how to reach your first customers and build traction in your target market.",
  },
];

const examples = [
  "A project management tool for freelance designers",
  "An AI-powered code review assistant for small dev teams",
  "A subscription analytics dashboard for e-commerce brands",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a1a" }}>
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5" style={{ backgroundColor: "rgba(10,10,26,0.8)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-semibold text-white">SaaSValidator</span>
          </div>
          <Link
            href="/app"
            className="px-4 py-1.5 rounded-lg text-sm font-medium text-white btn-primary"
          >
            Try it free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-glow pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6 border" style={{ backgroundColor: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Powered by Claude AI
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-none">
            Validate your{" "}
            <span className="gradient-text">SaaS idea</span>
            <br />
            in seconds.
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ color: "#94a3b8" }}>
            Skip months of market research. Get an AI-powered analysis of market size,
            competition, revenue potential, and risks — instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/app"
              className="btn-primary px-8 py-3.5 rounded-xl font-semibold text-white text-base"
            >
              Analyze my idea →
            </Link>
            <span className="text-sm" style={{ color: "#64748b" }}>
              No sign-up required
            </span>
          </div>

          {/* Example pills */}
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            <span className="text-sm mr-1" style={{ color: "#64748b" }}>Try:</span>
            {examples.map((ex) => (
              <Link
                key={ex}
                href={`/app?idea=${encodeURIComponent(ex)}`}
                className="px-3 py-1 rounded-full text-xs border transition-colors hover:border-indigo-500/50"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", color: "#94a3b8" }}
              >
                {ex}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need to validate faster
            </h2>
            <p style={{ color: "#64748b" }}>
              A complete picture of your market opportunity in one report.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="card-glass p-6 rounded-2xl group hover:border-indigo-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(99,102,241,0.15)", color: "#818cf8" }}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card-glass rounded-3xl p-10">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to validate your idea?
            </h2>
            <p className="mb-8" style={{ color: "#64748b" }}>
              Stop guessing. Get a data-driven analysis of your SaaS concept before writing a single line of code.
            </p>
            <Link
              href="/app"
              className="btn-primary inline-block px-8 py-3.5 rounded-xl font-semibold text-white"
            >
              Start validating →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 text-center">
        <p className="text-sm" style={{ color: "#334155" }}>
          © {new Date().getFullYear()} SaaSValidator · Built with Claude AI
        </p>
      </footer>
    </div>
  );
}

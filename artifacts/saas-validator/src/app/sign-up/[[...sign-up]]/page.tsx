import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main
      className="flex min-h-[calc(100dvh-56px)] flex-col items-center justify-center px-4 py-12"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 70%), #070814",
      }}
    >
      <div className="text-center mb-8">
        <div
          className="mx-auto mb-4 w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">SaaSValidator</h1>
        <p className="text-sm mt-1" style={{ color: "#64748b" }}>
          Commencez à valider votre marché SaaS
        </p>
      </div>

      <SignUp />
    </main>
  );
}

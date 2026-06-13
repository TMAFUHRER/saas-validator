import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "@/components/Providers";
import Nav from "@/components/Nav";
import "./globals.css";

const clerkAppearance = {
  variables: {
    colorPrimary: "#4f46e5",
    colorForeground: "#f8fafc",
    colorMutedForeground: "#94a3b8",
    colorDanger: "#ef4444",
    colorBackground: "#0d0f1f",
    colorInput: "#1a1b2e",
    colorInputForeground: "#f1f5f9",
    colorNeutral: "#2a2d4a",
    borderRadius: "0.75rem",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  elements: {
    rootBox: { width: "100%", display: "flex", justifyContent: "center" },
    cardBox: {
      width: "440px",
      maxWidth: "100%",
      borderRadius: "1rem",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
      overflow: "hidden",
    },
    card: {
      backgroundColor: "#0d0f1f",
      boxShadow: "none",
      border: "none",
      borderRadius: "0",
    },
    footer: {
      backgroundColor: "#0d0f1f",
      boxShadow: "none",
      border: "none",
    },
    headerTitle: { color: "#f8fafc", fontSize: "1.5rem", fontWeight: "700" },
    headerSubtitle: { color: "#94a3b8" },
    socialButtonsBlockButtonText: { color: "#e2e8f0" },
    formFieldLabel: { color: "#cbd5e1", fontSize: "0.875rem" },
    footerActionLink: { color: "#818cf8" },
    footerActionText: { color: "#475569" },
    dividerText: { color: "#475569" },
    identityPreviewEditButton: { color: "#818cf8" },
    formFieldSuccessText: { color: "#4ade80" },
    alertText: { color: "#cbd5e1" },
    socialButtonsBlockButton: {
      borderColor: "rgba(255,255,255,0.1)",
      backgroundColor: "rgba(255,255,255,0.04)",
      color: "#e2e8f0",
    },
    formButtonPrimary: {
      background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
      color: "#ffffff",
      fontWeight: "600",
    },
    formFieldInput: {
      backgroundColor: "rgba(255,255,255,0.05)",
      borderColor: "rgba(255,255,255,0.12)",
      color: "#f1f5f9",
    },
    footerAction: { backgroundColor: "transparent" },
    dividerLine: { backgroundColor: "rgba(255,255,255,0.08)" },
    otpCodeFieldInput: {
      backgroundColor: "rgba(255,255,255,0.05)",
      borderColor: "rgba(255,255,255,0.12)",
      color: "#f1f5f9",
    },
    main: { padding: "1.5rem" },
    logoBox: { marginBottom: "0.5rem" },
    alert: { backgroundColor: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.2)" },
  },
};

export const metadata: Metadata = {
  title: "SaaSValidator — Ton SaaS peut-il se vendre ?",
  description:
    "Analyse IA de ton marché SaaS en 30 secondes. Découvre si des gens paient déjà pour ton idée.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ClerkProvider
          publishableKey={process.env.CLERK_PUBLISHABLE_KEY!}
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInFallbackRedirectUrl="/app"
          signUpFallbackRedirectUrl="/app"
          appearance={clerkAppearance}
        >
          <Providers>
            <Nav />
            <div className="pt-14">{children}</div>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}

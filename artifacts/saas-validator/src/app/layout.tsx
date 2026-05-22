import type { Metadata } from "next";
import Providers from "@/components/Providers";
import Nav from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaaSValidator — Ton SaaS peut-il se vendre ?",
  description:
    "Analyse IA de ton marché SaaS en 30 secondes. Découvre si des gens paient déjà pour ton idée.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <Nav />
          <div className="pt-14">{children}</div>
        </Providers>
      </body>
    </html>
  );
}

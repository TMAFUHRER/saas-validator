import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaaSValidator — Validate Your SaaS Idea with AI",
  description:
    "Get an instant AI-powered market analysis of your SaaS idea. Understand market size, competition, revenue potential, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

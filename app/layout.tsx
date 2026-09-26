import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/oswald";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PlanProvider } from "@/context/plan-context";

export const metadata: Metadata = {
  title: { default: "FitLog — Workout Library", template: "%s | FitLog" },
  description:
    "Train with intent. Explore twelve workouts, build today's plan, save your favorite lifts, and log every set.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <PlanProvider>
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <SiteHeader />
          {children}
          <SiteFooter />
        </PlanProvider>
      </body>
    </html>
  );
}

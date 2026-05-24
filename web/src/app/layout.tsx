import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "PrepHQ — The Headquarters of Exam Preparation in Nigeria",
  description:
    "Prepare for JAMB, WAEC, NECO, and Post-UTME with timed mock exams, AI explanations, and performance tracking. Pay once, prep forever.",
  keywords: [
    "JAMB preparation",
    "WAEC past questions",
    "NECO practice",
    "Post-UTME prep",
    "Nigerian exam prep",
    "PrepHQ",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

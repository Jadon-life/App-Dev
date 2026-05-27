import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "CrysLearn — Learn with Clarity. Score with Confidence.",
  description:
    "Where exam success becomes crystal clear. Prepare for JAMB and WAEC with timed mock exams, AI explanations, and performance tracking.",
  keywords: [
    "JAMB preparation",
    "WAEC past questions",
    "Nigerian exam prep",
    "CrysLearn",
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

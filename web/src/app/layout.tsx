import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";

const geist = localFont({ src: "./fonts/GeistVF.woff", variable: "--font-geist", display: "swap" });
const mono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CrysLearn — Learn with Clarity. Score with Confidence.",
  description:
    "Where exam success becomes crystal clear. Prepare for UTME and WAEC with timed mock exams, AI explanations, and performance tracking.",
  keywords: ["UTME preparation", "WAEC past questions", "Nigerian exam prep", "CrysLearn"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          id="cryslearn-theme"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('cryslearn-theme');var d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.dataset.theme=d?'dark':'light';}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${geist.variable} ${mono.variable} min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

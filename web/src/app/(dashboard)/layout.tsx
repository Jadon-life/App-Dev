"use client";

import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/components/dashboard/Sidebar"), { ssr: false });
const ThemeProvider = dynamic(() => import("@/components/theme/ThemeContext").then(m => ({ default: m.ThemeProvider })), { ssr: false });
const ThemeToggle = dynamic(() => import("@/components/theme/ThemeToggle"), { ssr: false });

import { Bell } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex bg-background-light dark:bg-background-dark transition-colors duration-500">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Top bar — clean, no search */}
          <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b border-brand-teal/10 dark:border-brand-frost/[0.06] bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl">
            <h1 className="font-heading font-bold text-xl text-text-primary dark:text-text-dark-primary">
              Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <Bell className="w-5 h-5 text-text-muted dark:text-text-dark-muted cursor-pointer hover:text-brand-surf transition-colors" />
              <ThemeToggle />
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-teal to-brand-purple" />
            </div>
          </header>

          {/* Page content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

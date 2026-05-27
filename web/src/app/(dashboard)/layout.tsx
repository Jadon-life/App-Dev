"use client";

import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/components/dashboard/Sidebar"), { ssr: false });
const ThemeProvider = dynamic(() => import("@/components/theme/ThemeContext").then(m => ({ default: m.ThemeProvider })), { ssr: false });
const ThemeToggle = dynamic(() => import("@/components/theme/ThemeToggle"), { ssr: false });

import { Search, Bell } from "lucide-react";

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
          {/* Top bar */}
          <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b border-brand-teal/10 dark:border-brand-frost/[0.06] bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl">
            <h1 className="font-heading font-bold text-xl text-text-primary dark:text-text-dark-primary">
              Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-btn border border-brand-teal/15 dark:border-brand-frost/10 bg-surface-light dark:bg-surface-dark">
                <Search className="w-4 h-4 text-text-muted dark:text-text-dark-muted" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent text-sm outline-none w-32 text-text-primary dark:text-text-dark-primary placeholder:text-text-muted/50"
                />
              </div>
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

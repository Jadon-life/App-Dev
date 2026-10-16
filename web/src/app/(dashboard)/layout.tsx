"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Sidebar, { navItems } from "@/components/dashboard/Sidebar";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const section = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return (
    <div className="min-h-dvh bg-background-light text-text-primary dark:bg-background-dark dark:text-text-dark-primary">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="flex min-h-dvh">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <header className="flex min-h-20 items-center justify-between gap-3 border-b border-brand-teal/15 px-4 dark:border-brand-frost/15 sm:px-8">
            <div>
              <Link href="/home" className="font-heading text-lg font-semibold md:hidden">
                CrysLearn<span className="text-brand-teal dark:text-brand-frost">.</span>
              </Link>
              <p className="hidden text-xs muted md:block">
                Learn with clarity. Score with confidence.
              </p>
              <p className="mt-1 text-xs font-medium md:text-sm">
                {section?.label ?? "Your study space"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/settings"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-teal/10 font-semibold text-brand-teal dark:bg-brand-frost/15 dark:text-brand-frost"
                aria-label="Your account"
              >
                {(typeof user?.user_metadata?.full_name === "string"
                  ? user.user_metadata.full_name
                  : (user?.email ?? "C")
                )
                  .slice(0, 1)
                  .toUpperCase()}
              </Link>
            </div>
          </header>
          <Sidebar mobile />
          <main
            id="main-content"
            tabIndex={-1}
            className="mx-auto max-w-7xl px-4 py-8 outline-none sm:px-8 lg:py-10"
          >
            {loading ? (
              <div className="py-16" role="status">
                <p className="page-kicker">Your study space</p>
                <p className="page-title">Getting things ready…</p>
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

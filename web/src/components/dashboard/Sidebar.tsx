"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  CalendarDays,
  MessageCircle,
  Settings,
  Users,
  Download,
  ArrowUpRight,
} from "lucide-react";

export const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: BookOpen, label: "My exams", href: "/exams" },
  { icon: FileText, label: "Question library", href: "/past-questions" },
  { icon: CalendarDays, label: "Study planner", href: "/schedule" },
  { icon: MessageCircle, label: "Crystal AI", href: "/chat" },
  { icon: Download, label: "Offline study", href: "/offline" },
  { icon: Users, label: "Parent access", href: "/parent" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const links = navItems.map((item) => {
    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={`sidebar-item ${mobile ? "shrink-0 whitespace-nowrap !px-3 !py-2 text-xs" : ""} ${active ? "active" : ""}`}
      >
        <item.icon
          className={mobile ? "h-4 w-4 shrink-0" : "h-[18px] w-[18px] shrink-0"}
          aria-hidden="true"
        />
        <span>{item.label}</span>
      </Link>
    );
  });
  if (mobile)
    return (
      <nav
        aria-label="Study navigation"
        className="flex gap-1 overflow-x-auto border-b border-brand-teal/15 bg-surface-light px-3 py-2 dark:border-brand-frost/15 dark:bg-surface-dark md:hidden"
      >
        {links}
      </nav>
    );
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-brand-teal/15 bg-surface-light p-5 dark:border-brand-frost/15 dark:bg-surface-dark md:flex">
      <Link
        href="/home"
        className="mb-10 flex min-h-touch items-center gap-3"
        aria-label="CrysLearn home"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-teal font-heading text-xl font-bold text-white dark:bg-brand-frost dark:text-background-dark">
          C<span className="text-xs">.</span>
        </span>
        <span className="font-heading text-lg font-semibold tracking-tight">CrysLearn</span>
      </Link>
      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] muted">
        Your study space
      </p>
      <nav aria-label="Study navigation" className="flex flex-col gap-1 overflow-y-auto">
        {links}
      </nav>
      <div className="mt-auto pt-8">
        <div className="border-t border-brand-teal/15 px-3 pt-5 dark:border-brand-frost/15">
          <p className="font-serif text-lg">Make room for progress.</p>
          <p className="mb-3 mt-2 text-xs leading-5 muted">One focused session at a time.</p>
          <Link
            href="/exams"
            className="inline-flex min-h-touch items-center gap-2 text-xs font-semibold text-brand-teal dark:text-brand-frost"
          >
            Find your next practice <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, FileText, Calendar, Bot, Settings } from "lucide-react";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "My Exams", href: "/exams" },
  { icon: FileText, label: "Past Questions", href: "/past-questions" },
  { icon: Calendar, label: "Study Schedule", href: "/schedule" },
  { icon: Bot, label: "Crystal AI", href: "/chat" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-16 lg:w-56 flex flex-col items-center lg:items-stretch py-6 gap-1 border-r border-brand-teal/10 dark:border-brand-frost/[0.06] bg-surface-light dark:bg-surface-dark">
      {/* Logo — links to landing page */}
      <Link href="/" className="mb-8 px-3 flex items-center gap-2">
        <div className="w-9 h-9 rounded-btn bg-gradient-to-br from-brand-teal to-brand-purple flex items-center justify-center shadow-glow">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        <span className="hidden lg:block font-heading font-bold text-lg text-text-primary dark:text-text-dark-primary">
          CrysLearn
        </span>
      </Link>

      {/* Nav items — all linked to actual routes */}
      <nav className="flex flex-col gap-1 flex-1 w-full px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/exams" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`sidebar-item ${isActive ? "active" : ""}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

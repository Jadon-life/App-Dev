"use client";

import { Home, BookOpen, FileText, Calendar, Bot, Settings } from "lucide-react";

const navItems = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: BookOpen, label: "My Exams", active: false },
  { icon: FileText, label: "Past Questions", active: false },
  { icon: Calendar, label: "Study Schedule", active: false },
  { icon: Bot, label: "Crystal AI", active: false },
  { icon: Settings, label: "Settings", active: false },
];

export default function Sidebar() {
  return (
    <aside className="w-16 lg:w-56 flex flex-col items-center lg:items-stretch py-6 gap-1 border-r border-brand-teal/10 dark:border-brand-frost/[0.06] bg-surface-light dark:bg-surface-dark">
      {/* Logo */}
      <div className="mb-8 px-3 flex items-center gap-2">
        <div className="w-9 h-9 rounded-btn bg-gradient-to-br from-brand-teal to-brand-purple flex items-center justify-center shadow-glow">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        <span className="hidden lg:block font-heading font-bold text-lg text-text-primary dark:text-text-dark-primary">
          CrysLearn
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 flex-1 w-full px-2">
        {navItems.map((item) => (
          <div
            key={item.label}
            className={`sidebar-item ${item.active ? "active" : ""} cursor-pointer`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="hidden lg:block">{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}

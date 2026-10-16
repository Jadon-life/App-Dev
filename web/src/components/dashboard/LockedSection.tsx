"use client";

import { LockKeyhole } from "lucide-react";
import Link from "next/link";

interface LockedSectionProps {
  children: React.ReactNode;
  title?: string;
  locked?: boolean;
}

/** Lock only when the caller has established an actual access requirement. */
export default function LockedSection({ children, title, locked = false }: LockedSectionProps) {
  if (!locked) return <>{children}</>;
  return (
    <section className="dash-card flex flex-col items-start gap-4">
      <LockKeyhole className="text-brand-teal dark:text-brand-surf" size={25} />
      <h2 className="font-heading text-xl font-bold text-text-primary dark:text-text-dark-primary">
        {title || "Your saved progress"}
      </h2>
      <p className="text-sm leading-relaxed text-text-muted dark:text-text-dark-muted">
        Sign in to see the activity saved to your account.
      </p>
      <Link href="/login" className="btn-secondary">
        Sign in
      </Link>
    </section>
  );
}

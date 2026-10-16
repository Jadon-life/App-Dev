import Link from "next/link";
import { BookOpen, Loader2 } from "lucide-react";

export function ExamLoading({ message = "Opening your study space…" }: { message?: string }) {
  return (
    <div
      role="status"
      className="dash-card flex min-h-48 flex-col items-center justify-center gap-3 text-center"
    >
      <Loader2
        aria-hidden="true"
        className="h-6 w-6 animate-spin text-brand-teal motion-reduce:animate-none"
      />
      <p className="text-sm text-text-muted dark:text-text-dark-muted">{message}</p>
    </div>
  );
}
export function ExamMessage({
  title,
  children,
  retry,
  signIn = false,
}: {
  title: string;
  children: React.ReactNode;
  retry?: () => void;
  signIn?: boolean;
}) {
  return (
    <div className="dash-card flex min-h-56 flex-col items-center justify-center gap-3 text-center">
      <BookOpen aria-hidden="true" className="h-7 w-7 text-brand-teal dark:text-brand-aqua" />
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="max-w-lg text-sm leading-relaxed text-text-muted dark:text-text-dark-muted">
        {children}
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        {retry && (
          <button className="btn-primary" onClick={retry}>
            Try again
          </button>
        )}
        <Link
          className={signIn ? "btn-primary" : "btn-secondary"}
          href={signIn ? "/login" : "/exams"}
        >
          {signIn ? "Sign in to continue" : "Explore exams"}
        </Link>
      </div>
    </div>
  );
}

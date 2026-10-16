export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16" role="status" aria-live="polite">
      <p className="page-kicker">CrysLearn</p>
      <p className="text-xl font-medium">Loading your next page…</p>
      <div
        aria-hidden="true"
        className="mt-6 h-1 max-w-sm rounded-full bg-brand-teal/15 dark:bg-brand-frost/15"
      />
    </div>
  );
}

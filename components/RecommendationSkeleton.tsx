export function RecommendationSkeleton() {
  return (
    <article
      className="animate-pulse rounded-xl border border-emerald-100 bg-white p-6 shadow-sm"
      aria-hidden="true"
    >
      <div className="mb-4 flex items-start gap-4">
        <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-3/4 rounded bg-slate-200" />
          <div className="h-4 w-1/2 rounded bg-slate-100" />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-16 rounded bg-slate-100" />
            <div className="h-4 w-20 rounded bg-slate-200" />
          </div>
        ))}
      </div>

      <div className="mb-4 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-slate-100" />
        <div className="h-6 w-20 rounded-full bg-slate-100" />
        <div className="h-6 w-14 rounded-full bg-slate-100" />
      </div>

      <div className="space-y-2 rounded-lg bg-slate-50 px-4 py-3">
        <div className="h-3 w-full rounded bg-slate-200" />
        <div className="h-3 w-5/6 rounded bg-slate-200" />
        <div className="h-3 w-4/6 rounded bg-slate-100" />
      </div>
    </article>
  );
}

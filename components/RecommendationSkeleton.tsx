export function RecommendationSkeleton({ rank }: { rank: number }) {
  return (
    <article
      className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm"
      aria-hidden="true"
    >
      <div className="border-b border-slate-100 bg-emerald-50/40 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 animate-pulse items-center justify-center rounded-xl bg-emerald-200/60 text-sm font-semibold text-emerald-700/50">
            #{rank}
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      </div>

      <div className="animate-pulse px-5 py-4 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-6 w-20 rounded-full bg-slate-100" />
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-slate-50 p-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-12 rounded bg-slate-100" />
              <div className="h-4 w-16 rounded bg-slate-200" />
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-1.5">
          <div className="h-5 w-14 rounded bg-slate-100" />
          <div className="h-5 w-16 rounded bg-slate-100" />
          <div className="h-5 w-12 rounded bg-slate-100" />
        </div>

        <div className="mt-4 space-y-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <div className="h-3 w-full rounded bg-slate-200" />
          <div className="h-3 w-5/6 rounded bg-slate-200" />
          <div className="h-3 w-4/6 rounded bg-slate-100" />
        </div>
      </div>
    </article>
  );
}

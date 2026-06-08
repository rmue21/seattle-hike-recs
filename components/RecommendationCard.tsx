import { formatDifficulty, formatDriveTime } from "@/lib/scoring";
import type { Difficulty, ScoredHike } from "@/lib/types";

interface RecommendationCardProps {
  rank: number;
  result: ScoredHike;
  personalizedExplanation?: string;
}

function difficultyStyles(difficulty: Difficulty): string {
  switch (difficulty) {
    case "easy":
      return "bg-emerald-50 text-emerald-800 ring-emerald-200";
    case "moderate":
      return "bg-amber-50 text-amber-900 ring-amber-200";
    case "hard":
      return "bg-rose-50 text-rose-900 ring-rose-200";
  }
}

export function RecommendationCard({
  rank,
  result,
  personalizedExplanation,
}: RecommendationCardProps) {
  const { hike, whyThisFits } = result;
  const explanation = personalizedExplanation ?? whyThisFits;

  return (
    <article className="overflow-hidden rounded-2xl border border-emerald-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
      <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50/80 to-white px-5 py-4 sm:px-6">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-lg font-bold text-white shadow-sm">
            #{rank}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">
              {hike.name}
            </h3>
            <p className="mt-0.5 text-sm text-slate-600">{hike.location}</p>
            {hike.sourceUrl && (
              <a
                href={hike.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-block text-xs font-medium text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-800 hover:decoration-emerald-500"
              >
                View additional trail information
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 py-4 sm:px-6">
        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${difficultyStyles(hike.difficulty)}`}
          >
            {formatDifficulty(hike.difficulty)}
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200">
            {formatDriveTime(hike.driveTimeMinutesFromSeattle)} drive
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
              hike.dogFriendly
                ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                : "bg-slate-100 text-slate-600 ring-slate-200"
            }`}
          >
            {hike.dogFriendly ? "Dog friendly" : "No dogs"}
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200">
            {hike.permit === "None" ? "No permit" : hike.permit}
          </span>
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-slate-50/80 p-3 text-sm">
          <div>
            <dt className="text-xs text-slate-500">Distance</dt>
            <dd className="mt-0.5 font-semibold text-slate-900">
              {hike.distanceMiles} mi
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Elevation</dt>
            <dd className="mt-0.5 font-semibold text-slate-900">
              {hike.elevationGainFt.toLocaleString()} ft
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Hike time</dt>
            <dd className="mt-0.5 font-semibold text-slate-900">
              ~{hike.estimatedHikeTimeHours} hr
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {hike.sceneryTags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-emerald-50/80 px-2 py-0.5 text-xs text-emerald-800"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-3 text-sm leading-relaxed text-emerald-950">
          <span className="font-semibold text-emerald-900">Why this fits: </span>
          {explanation}
        </p>
      </div>
    </article>
  );
}

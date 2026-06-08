import {
  formatDifficulty,
  formatDriveTime,
} from "@/lib/scoring";
import type { ScoredHike } from "@/lib/types";

interface RecommendationCardProps {
  rank: number;
  result: ScoredHike;
  personalizedExplanation?: string;
}

export function RecommendationCard({
  rank,
  result,
  personalizedExplanation,
}: RecommendationCardProps) {
  const { hike, whyThisFits } = result;
  const explanation = personalizedExplanation ?? whyThisFits;

  return (
    <article className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-lg font-bold text-white">
          #{rank}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-semibold text-slate-900">{hike.name}</h3>
          <p className="text-slate-600">{hike.location}</p>
        </div>
      </div>

      <dl className="mb-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-slate-500">Distance</dt>
          <dd className="font-medium text-slate-900">{hike.distanceMiles} mi</dd>
        </div>
        <div>
          <dt className="text-slate-500">Elevation</dt>
          <dd className="font-medium text-slate-900">
            {hike.elevationGainFt.toLocaleString()} ft
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Hike time</dt>
          <dd className="font-medium text-slate-900">
            ~{hike.estimatedHikeTimeHours} hr
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Drive from Seattle</dt>
          <dd className="font-medium text-slate-900">
            {formatDriveTime(hike.driveTimeMinutesFromSeattle)}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Difficulty</dt>
          <dd className="font-medium text-slate-900">
            {formatDifficulty(hike.difficulty)}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Dogs</dt>
          <dd className="font-medium text-slate-900">
            {hike.dogFriendly ? "Friendly" : "Not allowed"}
          </dd>
        </div>
        <div className="col-span-2 sm:col-span-3">
          <dt className="text-slate-500">Permit / pass</dt>
          <dd className="font-medium text-slate-900">{hike.permit}</dd>
        </div>
      </dl>

      <div className="mb-4 flex flex-wrap gap-2">
        {hike.sceneryTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        <span className="font-semibold">Why this fits: </span>
        {explanation}
      </p>
    </article>
  );
}

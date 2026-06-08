"use client";

import { useState } from "react";
import { RecommendationCard } from "@/components/RecommendationCard";
import { RecommendationSkeleton } from "@/components/RecommendationSkeleton";
import { getTopRecommendations } from "@/lib/scoring";
import type {
  DifficultyPreference,
  DriveTimeOption,
  ExperienceTag,
  PersonalizeResponse,
  ScoredHike,
  TotalTimeOption,
  UserPreferences,
} from "@/lib/types";

const CANDIDATE_COUNT = 6;
const FINAL_COUNT = 3;

const TOTAL_TIME_OPTIONS: { value: TotalTimeOption; label: string }[] = [
  { value: "2-3-hours", label: "2 to 3 hours" },
  { value: "half-day", label: "Half day" },
  { value: "full-day", label: "Full day" },
  { value: "all-day", label: "All day" },
];

const DRIVE_OPTIONS: { value: DriveTimeOption; label: string }[] = [
  { value: "close", label: "Keep it close" },
  { value: "1-hour", label: "Up to 1 hour" },
  { value: "2-hours", label: "Up to 2 hours" },
  { value: "3-hours", label: "Up to 3 hours" },
  { value: "flexible", label: "Flexible for the right hike" },
];

const DIFFICULTY_OPTIONS: { value: DifficultyPreference; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "hard", label: "Hard" },
  { value: "surprise", label: "Surprise me" },
];

const EXPERIENCE_OPTIONS: { value: ExperienceTag; label: string }[] = [
  { value: "forest", label: "Forest" },
  { value: "waterfall", label: "Waterfall" },
  { value: "lake", label: "Lake" },
  { value: "mountain-views", label: "Mountain views" },
  { value: "good-workout", label: "Good workout" },
  { value: "dog-friendly", label: "Dog friendly" },
  { value: "less-crowded", label: "Less crowded" },
];

const defaultPrefs: UserPreferences = {
  totalTime: "half-day",
  maxDrive: "1-hour",
  difficulty: "moderate",
  experienceTags: [],
  additionalNotes: "",
};

interface DisplayRecommendation {
  result: ScoredHike;
  explanation: string;
}

function buildLocalFallback(
  preferences: UserPreferences,
): DisplayRecommendation[] {
  return getTopRecommendations(preferences, FINAL_COUNT).map((result) => ({
    result,
    explanation: result.whyThisFits,
  }));
}

function buildFromAiResponse(
  candidates: ScoredHike[],
  data: PersonalizeResponse,
): DisplayRecommendation[] | null {
  const byId = new Map(candidates.map((c) => [c.hike.id, c]));

  const picks = data.recommendations
    .sort((a, b) => a.rank - b.rank)
    .map((rec) => {
      const result = byId.get(rec.id);
      if (!result) return null;
      return {
        result,
        explanation: rec.explanation,
      };
    });

  if (picks.some((p) => p === null) || picks.length !== FINAL_COUNT) {
    return null;
  }

  return picks as DisplayRecommendation[];
}

export function HikeFinder() {
  const [prefs, setPrefs] = useState<UserPreferences>(defaultPrefs);
  const [recommendations, setRecommendations] = useState<
    DisplayRecommendation[] | null
  >(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usingLocalFallback, setUsingLocalFallback] = useState(false);

  function toggleExperience(tag: ExperienceTag) {
    setPrefs((p) => ({
      ...p,
      experienceTags: p.experienceTags.includes(tag)
        ? p.experienceTags.filter((t) => t !== tag)
        : [...p.experienceTags, tag],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setLoading(true);
    setRecommendations(null);
    setUsingLocalFallback(false);

    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    const candidates = getTopRecommendations(prefs, CANDIDATE_COUNT);

    try {
      const response = await fetch("/api/personalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: prefs, hikes: candidates }),
      });

      if (response.ok) {
        const data = (await response.json()) as PersonalizeResponse;
        const aiResults = buildFromAiResponse(candidates, data);
        if (aiResults) {
          setRecommendations(aiResults);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Fall through to local fallback
    }

    setRecommendations(buildLocalFallback(prefs));
    setUsingLocalFallback(true);
    setLoading(false);
  }

  function handleReset() {
    setPrefs(defaultPrefs);
    setRecommendations(null);
    setSubmitted(false);
    setLoading(false);
    setUsingLocalFallback(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-emerald-900 sm:text-4xl">
          SeattleHikeFinder
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Answer a few questions and get your top 3 Seattle-area hike picks.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <legend className="text-lg font-semibold text-slate-900">
            1. How much total time do you have?
          </legend>
          <div className="mt-4 space-y-2">
            {TOTAL_TIME_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50"
              >
                <input
                  type="radio"
                  name="totalTime"
                  value={opt.value}
                  checked={prefs.totalTime === opt.value}
                  onChange={() =>
                    setPrefs((p) => ({ ...p, totalTime: opt.value }))
                  }
                  className="h-4 w-4 text-emerald-700"
                  disabled={loading}
                />
                <span className="text-slate-800">{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <legend className="text-lg font-semibold text-slate-900">
            2. How far are you willing to drive?
          </legend>
          <div className="mt-4 space-y-2">
            {DRIVE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50"
              >
                <input
                  type="radio"
                  name="maxDrive"
                  value={opt.value}
                  checked={prefs.maxDrive === opt.value}
                  onChange={() =>
                    setPrefs((p) => ({ ...p, maxDrive: opt.value }))
                  }
                  className="h-4 w-4 text-emerald-700"
                  disabled={loading}
                />
                <span className="text-slate-800">{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <legend className="text-lg font-semibold text-slate-900">
            3. How hard do you want the hike to be?
          </legend>
          <div className="mt-4 space-y-2">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50"
              >
                <input
                  type="radio"
                  name="difficulty"
                  value={opt.value}
                  checked={prefs.difficulty === opt.value}
                  onChange={() =>
                    setPrefs((p) => ({ ...p, difficulty: opt.value }))
                  }
                  className="h-4 w-4 text-emerald-700"
                  disabled={loading}
                />
                <span className="text-slate-800">{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <legend className="text-lg font-semibold text-slate-900">
            4. What kind of experience are you looking for?
          </legend>
          <p className="mt-1 text-sm text-slate-500">Select all that apply</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {EXPERIENCE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-2 py-2 hover:bg-slate-50 has-checked:border-emerald-300 has-checked:bg-emerald-50"
              >
                <input
                  type="checkbox"
                  checked={prefs.experienceTags.includes(opt.value)}
                  onChange={() => toggleExperience(opt.value)}
                  className="h-4 w-4 rounded text-emerald-700"
                  disabled={loading}
                />
                <span className="text-slate-800">{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <legend className="text-lg font-semibold text-slate-900">
            5. Anything else I should know?
          </legend>
          <textarea
            value={prefs.additionalNotes}
            onChange={(e) =>
              setPrefs((p) => ({ ...p, additionalNotes: e.target.value }))
            }
            rows={4}
            placeholder="e.g. bringing a dog, need easy on knees, avoid crowds, prefer waterfalls..."
            className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            disabled={loading}
          />
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-700 px-6 py-4 text-lg font-semibold text-white shadow-md transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Finding your hikes…" : "Find my hikes"}
        </button>
      </form>

      {submitted && (
        <section id="results" className="mt-14 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              {loading ? "Finding your best hike matches…" : "Your top 3 hikes"}
            </h2>
            {!loading && (
              <button
                type="button"
                onClick={handleReset}
                className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
              >
                Start over
              </button>
            )}
          </div>

          {loading && (
            <>
              <p className="text-sm text-slate-600" role="status">
                Personalizing your recommendations…
              </p>
              <div className="space-y-6">
                {Array.from({ length: FINAL_COUNT }).map((_, i) => (
                  <RecommendationSkeleton key={i} />
                ))}
              </div>
            </>
          )}

          {!loading && recommendations && (
            <>
              {usingLocalFallback && (
                <p className="text-sm text-slate-500">
                  Showing local recommendations while personalized picks are
                  unavailable.
                </p>
              )}
              <div className="space-y-6">
                {recommendations.map((rec, index) => (
                  <RecommendationCard
                    key={rec.result.hike.id}
                    rank={index + 1}
                    result={rec.result}
                    personalizedExplanation={rec.explanation}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

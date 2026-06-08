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

const radioOptionClass =
  "flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm transition hover:border-slate-300 hover:bg-slate-50 has-checked:border-emerald-400 has-checked:bg-emerald-50 has-checked:shadow-sm has-checked:ring-1 has-checked:ring-emerald-200";

const checkboxOptionClass =
  "flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm transition hover:border-slate-300 hover:bg-slate-50 has-checked:border-emerald-400 has-checked:bg-emerald-50 has-checked:shadow-sm has-checked:ring-1 has-checked:ring-emerald-200";

const fieldsetClass = "border-t border-slate-100 pt-8 pb-6";

const startOverButtonClass =
  "rounded-lg border border-emerald-300 bg-emerald-50/80 px-4 py-2 text-sm font-medium text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2";

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
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">
          Seattle Hike Finder
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Answer a few quick questions and get your top 3 hike picks.
        </p>
        <p className="mx-auto mt-3 max-w-lg text-sm text-slate-500">
          We narrow down the best hikes, then AI helps pick and explain your top matches.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-sm ring-1 ring-slate-900/5 sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Your preferences
          </h2>

        <fieldset className={`mt-6 ${fieldsetClass}`}>
          <legend className="text-base font-semibold text-slate-900">
            1. How much total time do you have?
          </legend>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {TOTAL_TIME_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={radioOptionClass}
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

        <fieldset className={fieldsetClass}>
          <legend className="text-base font-semibold text-slate-900">
            2. How far are you willing to drive?
          </legend>
          <div className="mt-4 grid gap-2.5">
            {DRIVE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={radioOptionClass}
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

        <fieldset className={fieldsetClass}>
          <legend className="text-base font-semibold text-slate-900">
            3. How hard do you want the hike to be?
          </legend>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={radioOptionClass}
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

        <fieldset className={fieldsetClass}>
          <legend className="text-base font-semibold text-slate-900">
            4. What kind of experience are you looking for?
          </legend>
          <p className="mt-1 text-sm text-slate-500">Select all that apply</p>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {EXPERIENCE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={checkboxOptionClass}
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

        <fieldset className={`${fieldsetClass} pb-2`}>
          <legend className="text-base font-semibold text-slate-900">
            5. Anything else I should know?
          </legend>
          <textarea
            value={prefs.additionalNotes}
            onChange={(e) =>
              setPrefs((p) => ({ ...p, additionalNotes: e.target.value }))
            }
            rows={4}
            placeholder="e.g. bringing a dog, need easy on knees, avoid crowds, prefer waterfalls..."
            className="mt-4 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            disabled={loading}
          />
        </fieldset>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-emerald-700 px-6 py-4 text-base font-semibold text-white shadow-md transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:text-lg"
        >
          {loading ? "Finding your hikes…" : "Find my hikes"}
        </button>
      </form>

      {submitted && (
        <section
          id="results"
          className="mt-10 space-y-5 border-t border-slate-200/90 pt-10"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {loading ? "Finding your best hike matches…" : "Your top 3 hikes"}
              </h2>
              {loading && (
                <p className="mt-1 text-sm text-slate-500">
                  Shortlisting candidates, then personalizing your picks.
                </p>
              )}
            </div>
            {!loading && (
              <button
                type="button"
                onClick={handleReset}
                className={startOverButtonClass}
              >
                Start over
              </button>
            )}
          </div>

          {loading && (
            <div className="space-y-5">
              <div
                className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-white/80 px-4 py-3 text-sm text-slate-600"
                role="status"
                aria-live="polite"
              >
                <span className="loading-dots flex gap-1" aria-hidden="true">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                </span>
                Personalizing your recommendations…
              </div>
              <div className="space-y-5">
                {Array.from({ length: FINAL_COUNT }).map((_, i) => (
                  <RecommendationSkeleton key={i} rank={i + 1} />
                ))}
              </div>
            </div>
          )}

          {!loading && recommendations && (
            <>
              {usingLocalFallback && (
                <p className="rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 text-sm text-amber-900/80">
                  Showing local recommendations while personalized picks are
                  unavailable.
                </p>
              )}
              <div className="space-y-5">
                {recommendations.map((rec, index) => (
                  <RecommendationCard
                    key={rec.result.hike.id}
                    rank={index + 1}
                    result={rec.result}
                    personalizedExplanation={rec.explanation}
                  />
                ))}
              </div>
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className={startOverButtonClass}
                >
                  Start over
                </button>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

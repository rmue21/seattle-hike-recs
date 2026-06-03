import { hikes } from "@/data/hikes";
import type {
  Difficulty,
  DifficultyPreference,
  DriveTimeOption,
  ExperienceTag,
  Hike,
  ScoredHike,
  TotalTimeOption,
  UserPreferences,
} from "@/lib/types";

const PARKING_BUFFER_HOURS = 0.25;

function maxTotalHours(option: TotalTimeOption): number {
  const map: Record<TotalTimeOption, number> = {
    "2-3-hours": 3,
    "half-day": 5,
    "full-day": 8,
    "all-day": 12,
  };
  return map[option];
}

function maxDriveMinutes(option: DriveTimeOption): number {
  const map: Record<DriveTimeOption, number> = {
    close: 45,
    "1-hour": 60,
    "2-hours": 120,
    "3-hours": 180,
    flexible: 999,
  };
  return map[option];
}

function oneWayDriveHours(hike: Hike): number {
  return hike.driveTimeMinutesFromSeattle / 60;
}

/** Hike + round-trip drive + parking buffer (drive minutes are one-way). */
function totalTripHours(hike: Hike): number {
  return (
    hike.estimatedHikeTimeHours +
    2 * oneWayDriveHours(hike) +
    PARKING_BUFFER_HOURS
  );
}

function difficultyMatchScore(
  hikeDifficulty: Difficulty,
  preference: DifficultyPreference,
): { score: number; reason: string | null } {
  if (preference === "surprise") {
    return { score: 8, reason: null };
  }
  if (hikeDifficulty === preference) {
    return {
      score: 25,
      reason: `Matches your ${preference} difficulty preference`,
    };
  }
  const order: Difficulty[] = ["easy", "moderate", "hard"];
  const hikeIdx = order.indexOf(hikeDifficulty);
  const prefIdx = order.indexOf(preference);
  const gap = Math.abs(hikeIdx - prefIdx);
  if (gap === 1) {
    return { score: 10, reason: `Close to your preferred ${preference} level` };
  }
  return { score: -15, reason: null };
}

const EXPERIENCE_RULES: Record<
  ExperienceTag,
  (hike: Hike) => { score: number; reason: string | null }
> = {
  forest: (hike) =>
    hike.sceneryTags.includes("forest")
      ? { score: 12, reason: "Forest scenery" }
      : { score: 0, reason: null },
  waterfall: (hike) =>
    hike.sceneryTags.some((t) => t.includes("waterfall") || t === "waterfall")
      ? { score: 14, reason: "Waterfall on the trail" }
      : { score: 0, reason: null },
  lake: (hike) =>
    hike.sceneryTags.includes("lake")
      ? { score: 14, reason: "Lake destination" }
      : { score: 0, reason: null },
  "mountain-views": (hike) =>
    hike.sceneryTags.some((t) =>
      ["mountain-views", "views", "alpine", "bluff"].includes(t),
    )
      ? { score: 14, reason: "Mountain or scenic views" }
      : { score: 0, reason: null },
  "good-workout": (hike) => {
    const workout =
      hike.elevationGainFt >= 1500 ||
      hike.sceneryTags.includes("workout") ||
      hike.difficulty === "hard";
    return workout
      ? { score: 14, reason: "Solid elevation and distance for a workout" }
      : { score: -5, reason: null };
  },
  "dog-friendly": (hike) =>
    hike.dogFriendly
      ? { score: 20, reason: "Dogs allowed on trail" }
      : { score: -25, reason: null },
  "less-crowded": (hike) => {
    if (hike.crowdLevel === "low") {
      return { score: 16, reason: "Typically less crowded" };
    }
    if (hike.crowdLevel === "high") {
      return { score: -12, reason: null };
    }
    return { score: 4, reason: null };
  },
};

function scoreTimeFit(
  hike: Hike,
  maxHours: number,
): { score: number; reason: string | null } {
  const trip = totalTripHours(hike);
  if (trip > maxHours * 1.15) {
    return {
      score: -80,
      reason: null,
    };
  }
  if (trip > maxHours) {
    return {
      score: -40,
      reason: null,
    };
  }
  const fitRatio = 1 - trip / maxHours;
  const score = 30 + fitRatio * 20;
  const roundTripDriveHr = (2 * oneWayDriveHours(hike)).toFixed(1);
  return {
    score,
    reason: `About ${trip.toFixed(1)} hours total (${hike.estimatedHikeTimeHours} hr hike + ~${roundTripDriveHr} hr round-trip drive) fits your ${maxHours}-hour window`,
  };
}

function scoreDriveFit(
  hike: Hike,
  maxDrive: number,
  preference: DriveTimeOption,
): { score: number; reason: string | null } {
  const drive = hike.driveTimeMinutesFromSeattle;
  if (drive > maxDrive) {
    const penalty = preference === "flexible" ? -15 : -50;
    return { score: penalty, reason: null };
  }
  if (preference === "close" && drive <= 30) {
    return {
      score: 18,
      reason: `Only ~${drive} minutes from Seattle`,
    };
  }
  const headroom = 1 - drive / maxDrive;
  return {
    score: 12 + headroom * 10,
    reason:
      drive <= 45
        ? `Short ${drive}-minute drive from Seattle`
        : `Drive (~${drive} min) within your range`,
  };
}

function scoreNotesKeywords(
  hike: Hike,
  notes: string,
): { score: number; reasons: string[] } {
  const text = notes.toLowerCase().trim();
  if (!text) {
    return { score: 0, reasons: [] };
  }

  let score = 0;
  const reasons: string[] = [];

  const rules: { keywords: string[]; test: () => boolean; pts: number; reason: string }[] = [
    {
      keywords: ["dog", "puppy", "leash"],
      test: () => hike.dogFriendly,
      pts: 15,
      reason: "You mentioned dogs; this trail allows them",
    },
    {
      keywords: ["waterfall", "falls"],
      test: () => hike.sceneryTags.some((t) => t.includes("waterfall")),
      pts: 12,
      reason: "Matches your waterfall interest",
    },
    {
      keywords: ["lake", "alpine lake"],
      test: () => hike.sceneryTags.includes("lake"),
      pts: 12,
      reason: "Matches your lake interest",
    },
    {
      keywords: ["view", "views", "scenic", "vista"],
      test: () =>
        hike.sceneryTags.some((t) =>
          ["mountain-views", "views", "alpine", "bluff", "coast"].includes(t),
        ),
      pts: 10,
      reason: "Offers the views you asked for",
    },
    {
      keywords: ["forest", "trees", "woods"],
      test: () => hike.sceneryTags.includes("forest"),
      pts: 8,
      reason: "Forest setting matches your note",
    },
    {
      keywords: ["easy", "gentle", "beginner", "injury", "knee"],
      test: () => hike.difficulty === "easy",
      pts: 12,
      reason: "Easier terrain based on your note",
    },
    {
      keywords: ["hard", "challenge", "tough", "steep"],
      test: () => hike.difficulty === "hard",
      pts: 12,
      reason: "Challenging hike based on your note",
    },
    {
      keywords: ["workout", "fitness", "training", "elevation"],
      test: () => hike.elevationGainFt >= 1500,
      pts: 10,
      reason: "Good elevation for the workout you want",
    },
    {
      keywords: ["close", "nearby", "short drive"],
      test: () => hike.driveTimeMinutesFromSeattle <= 45,
      pts: 10,
      reason: "Keeps the drive short as you requested",
    },
    {
      keywords: ["crowd", "busy", "quiet", "less people"],
      test: () => hike.crowdLevel === "low",
      pts: 12,
      reason: "Tends to be less crowded",
    },
    {
      keywords: ["parking", "pass", "permit", "discover"],
      test: () =>
        hike.permit === "None" ||
        text.includes("discover") ||
        text.includes("forest pass"),
      pts: 5,
      reason: "Permit info noted in your preferences",
    },
    {
      keywords: ["snow", "winter", "icy"],
      test: () =>
        hike.notes.toLowerCase().includes("snow") ||
        hike.difficulty === "easy",
      pts: 8,
      reason: "Consider seasonal access/snow in trail notes",
    },
  ];

  for (const rule of rules) {
    if (rule.keywords.some((k) => text.includes(k)) && rule.test()) {
      score += rule.pts;
      reasons.push(rule.reason);
    } else if (
      rule.keywords.some((k) => text.includes(k)) &&
      !rule.test() &&
      (rule.keywords.includes("dog") || rule.keywords.includes("easy"))
    ) {
      score -= 20;
    }
  }

  return { score, reasons };
}

function buildWhyThisFits(reasons: string[]): string {
  const unique = [...new Set(reasons)].filter(Boolean);
  if (unique.length === 0) {
    return "A solid overall match for your time, drive, and preferences.";
  }
  return unique.slice(0, 3).join(". ") + ".";
}

function scoreHike(hike: Hike, prefs: UserPreferences): ScoredHike {
  const reasons: string[] = [];
  let score = 0;

  const maxHours = maxTotalHours(prefs.totalTime);
  const maxDrive = maxDriveMinutes(prefs.maxDrive);

  const timeFit = scoreTimeFit(hike, maxHours);
  score += timeFit.score;
  if (timeFit.reason) reasons.push(timeFit.reason);

  const driveFit = scoreDriveFit(hike, maxDrive, prefs.maxDrive);
  score += driveFit.score;
  if (driveFit.reason) reasons.push(driveFit.reason);

  const diffFit = difficultyMatchScore(hike.difficulty, prefs.difficulty);
  score += diffFit.score;
  if (diffFit.reason) reasons.push(diffFit.reason);

  for (const tag of prefs.experienceTags) {
    const result = EXPERIENCE_RULES[tag](hike);
    score += result.score;
    if (result.reason) reasons.push(result.reason);
  }

  const notesFit = scoreNotesKeywords(hike, prefs.additionalNotes);
  score += notesFit.score;
  reasons.push(...notesFit.reasons);

  return {
    hike,
    score,
    whyThisFits: buildWhyThisFits(reasons),
  };
}

export function getTopRecommendations(
  prefs: UserPreferences,
  count = 3,
): ScoredHike[] {
  const scored = hikes.map((hike) => scoreHike(hike, prefs));
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

export function formatDifficulty(d: Difficulty): string {
  return d.charAt(0).toUpperCase() + d.slice(1);
}

export function formatDriveTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} hr ${m} min` : `${h} hr`;
}

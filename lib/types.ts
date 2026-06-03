export type Difficulty = "easy" | "moderate" | "hard";

export type CrowdLevel = "low" | "moderate" | "high";

export interface Hike {
  id: string;
  name: string;
  location: string;
  distanceMiles: number;
  elevationGainFt: number;
  estimatedHikeTimeHours: number;
  driveTimeMinutesFromSeattle: number;
  difficulty: Difficulty;
  dogFriendly: boolean;
  permit: string;
  sceneryTags: string[];
  crowdLevel: CrowdLevel;
  notes: string;
  sourceUrl?: string;
}

export type TotalTimeOption =
  | "2-3-hours"
  | "half-day"
  | "full-day"
  | "all-day";

export type DriveTimeOption =
  | "close"
  | "1-hour"
  | "2-hours"
  | "3-hours"
  | "flexible";

export type DifficultyPreference = "easy" | "moderate" | "hard" | "surprise";

export type ExperienceTag =
  | "forest"
  | "waterfall"
  | "lake"
  | "mountain-views"
  | "good-workout"
  | "dog-friendly"
  | "less-crowded";

export interface UserPreferences {
  totalTime: TotalTimeOption;
  maxDrive: DriveTimeOption;
  difficulty: DifficultyPreference;
  experienceTags: ExperienceTag[];
  additionalNotes: string;
}

export interface ScoredHike {
  hike: Hike;
  score: number;
  whyThisFits: string;
}

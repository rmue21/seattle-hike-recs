import OpenAI from "openai";
import { NextResponse } from "next/server";
import type {
  PersonalizeRequest,
  PersonalizeResponse,
  ScoredHike,
} from "@/lib/types";

const MODEL = "gpt-4.1-mini";
const FINAL_COUNT = 3;

const SYSTEM_PROMPT = `You are SeattleHikeFinder's hiking recommendation assistant.

You will receive user preferences and exactly 6 candidate hikes that were pre-filtered by local scoring. Your job is to:
1. Choose the best 3 hikes for this user from ONLY those 6 candidates.
2. Write a short personalized explanation for each chosen hike.

Rules:
- Choose hikes only from the provided candidate list. Do not add, swap in, or mention hikes outside the list.
- Do not change trail facts, including distance, elevation, hike time, drive time, difficulty, dog friendliness, permit, scenery tags, or crowd level.
- Use only the data provided. You may mention tradeoffs such as longer drive, harder difficulty, crowds, or permit needs when supported by the provided data.
- Write 2 to 3 sentences per explanation.
- Mention why each hike fits the user's preferences.
- If the user has more time than the hike requires, say it fits within their available time or mention the approximate time clearly.
- Keep time explanations user-friendly. Do not over-explain the time math unless it helps explain a tradeoff.
- Do not overstate the recommendation. If there is a tradeoff, mention it briefly.
- Avoid saying a hike is a perfect match. Use softer language like "matches several of your preferences," "fits well with what you asked for," or "could be a good fit."
- Use a practical, friendly tone. Avoid marketing language like "perfect," "perfectly," "ideal," "must-do," "unforgettable," or "best ever."
- Do not invent weather, closures, parking availability, snow conditions, safety issues, or any real-time conditions.
- Avoid sounding overly confident about current conditions.

Return JSON only, in this exact shape:
{"recommendations":[{"id":"<hike id>","rank":1,"explanation":"<text>"},{"id":"<hike id>","rank":2,"explanation":"<text>"},{"id":"<hike id>","rank":3,"explanation":"<text>"}]}

Return exactly 3 recommendations with ranks 1, 2, and 3. Use the exact id values from the candidates.`;

function isScoredHike(value: unknown): value is ScoredHike {
  if (!value || typeof value !== "object") return false;
  const row = value as ScoredHike;
  return (
    typeof row.score === "number" &&
    typeof row.whyThisFits === "string" &&
    !!row.hike &&
    typeof row.hike.id === "string"
  );
}

function parseModelJson(
  content: string,
  candidateIds: Set<string>,
): PersonalizeResponse | null {
  try {
    const parsed = JSON.parse(content) as PersonalizeResponse;
    if (!Array.isArray(parsed.recommendations)) return null;
    if (parsed.recommendations.length !== FINAL_COUNT) return null;

    const seenIds = new Set<string>();
    const seenRanks = new Set<number>();

    for (const item of parsed.recommendations) {
      if (
        !item ||
        typeof item.id !== "string" ||
        !candidateIds.has(item.id) ||
        typeof item.rank !== "number" ||
        item.rank < 1 ||
        item.rank > FINAL_COUNT ||
        typeof item.explanation !== "string" ||
        !item.explanation.trim()
      ) {
        return null;
      }
      if (seenIds.has(item.id) || seenRanks.has(item.rank)) return null;
      seenIds.add(item.id);
      seenRanks.add(item.rank);
    }

    if (seenRanks.size !== FINAL_COUNT) return null;

    const recommendations = [...parsed.recommendations]
      .map((item) => ({
        id: item.id,
        rank: item.rank,
        explanation: item.explanation.trim(),
      }))
      .sort((a, b) => a.rank - b.rank);

    return { recommendations };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 },
    );
  }

  let body: PersonalizeRequest;
  try {
    body = (await request.json()) as PersonalizeRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    !body?.preferences ||
    !Array.isArray(body.hikes) ||
    body.hikes.length === 0 ||
    !body.hikes.every(isScoredHike)
  ) {
    return NextResponse.json(
      { error: "preferences and hikes are required" },
      { status: 400 },
    );
  }

  const candidateIds = new Set(body.hikes.map((h) => h.hike.id));
  const userPayload = {
    preferences: body.preferences,
    candidates: body.hikes.map((row, index) => ({
      localRank: index + 1,
      localScore: row.score,
      id: row.hike.id,
      name: row.hike.name,
      location: row.hike.location,
      distanceMiles: row.hike.distanceMiles,
      elevationGainFt: row.hike.elevationGainFt,
      estimatedHikeTimeHours: row.hike.estimatedHikeTimeHours,
      driveTimeMinutesFromSeattle: row.hike.driveTimeMinutesFromSeattle,
      difficulty: row.hike.difficulty,
      dogFriendly: row.hike.dogFriendly,
      permit: row.hike.permit,
      sceneryTags: row.hike.sceneryTags,
      crowdLevel: row.hike.crowdLevel,
      notes: row.hike.notes,
      localWhyThisFits: row.whyThisFits,
    })),
  };

  const openai = new OpenAI({ apiKey });

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: JSON.stringify(userPayload),
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "Empty model response" },
        { status: 502 },
      );
    }

    const result = parseModelJson(content, candidateIds);
    if (!result) {
      return NextResponse.json(
        { error: "Could not parse model response" },
        { status: 502 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("OpenAI personalize error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 502 },
    );
  }
}

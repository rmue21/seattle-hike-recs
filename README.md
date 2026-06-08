# SeattleHikeFinder

SeattleHikeFinder is a prototype that recommends Seattle-area day hikes based on a user’s time, drive distance, desired difficulty, and hiking preferences.

## What it does

Users answer a short form about what kind of hike they want. The app then recommends the top 3 hikes with trail stats, source links, and a personalized explanation for why each hike fits.

## Motivation

Choosing a hike can be overwhelming because there are a lot of factors to compare across different sources: distance, elevation, drive time, difficulty, dog friendliness, crowds, permits, and trail conditions.

This prototype explores how AI can make that decision feel more personalized than a standard filtering app.

## How recommendations work

1. The user submits their hiking preferences.
2. Local scoring ranks the hikes in `data/hikes.ts`.
3. The app creates a shortlist of 6 candidate hikes.
4. OpenAI uses those 6 candidates to choose the final top 3 and write personalized explanations.
5. If the AI call fails, the app falls back to the local top 3 recommendations.

The AI can only choose from the provided candidates. It should not add hikes, change trail facts, or invent current conditions like weather, snow, closures, or parking availability.

## How AI is used

AI is used for the final recommendation and explanation step. The app sends the user’s preferences and 6 locally scored candidate hikes to the OpenAI API using `gpt-4.1-mini`.

The model returns:
- 3 selected hike IDs from the candidate list
- A short explanation for each recommendation

The local dataset remains the source of truth for trail facts.

## Tech stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- OpenAI API
- Local hike dataset

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## OpenAI API key

Create a `.env.local` file in the project root:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

Restart the dev server after adding the key.

If there is no valid API key, the app still works using local fallback recommendations.

## Dataset note

The hike data in `data/hikes.ts` is manually curated for this prototype. Stats like distance, elevation, hike time, drive time, and difficulty are approximate and should be verified before planning a real hike.

Each hike includes a `sourceUrl`, and the recommendation cards link to those sources.

## Future ideas

- Add more hikes and integrate live data sources for trail updates or closures
- Add user profiles with saved preferences
- Track completed hikes
- Include parking passes, dog ownership, hiking pace, and car access
- Support custom start locations, such as a home neighborhood or address
- Add real drive times, maps, weather, and trail conditions
- Improve follow-up interactions with AI

## Development note

Cursor and other GenAI tools were used for coding support. I reviewed and shaped the design, data, recommendation flow, and AI behavior for the class project.

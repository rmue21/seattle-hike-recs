# Start here

**Goal:** Turn Seattle Hike Finder into a polished, public hike recommender that's honest about why it suggests each hike, and feature it in my UX engineering portfolio.

**Now: T01 — Show trail notes on each recommendation card**

**Why it matters:** Every hike has notes like "pets are not allowed" or "can hold snow into early summer," but the card never shows them. Hikers can miss information they need to plan safely.

**First action:** Open `components/RecommendationCard.tsx` and find line 26, where `hike` comes from. Then jot down what a "Good to know" section should say for one hike (for example, Marymere Falls) and how prominent it should be.

**Done when:**
- All three cards show the hike's notes, with or without AI.
- Each card says the stats are approximate and points to the source link.
- It reads well on a phone and with a screen reader.

**Up next:** T02 — Make the AI route trust only server-side data · T03 — Add cost and abuse guardrails

*Last updated 2026-11-17 · Full details and decisions: [BACKLOG.md](BACKLOG.md)*

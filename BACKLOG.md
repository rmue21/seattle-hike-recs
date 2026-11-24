# Seattle Hike Finder — Backlog

Last updated: 2026-11-24

This is the working backlog for turning Seattle Hike Finder from a class prototype into a polished, public app for a UX engineering portfolio. Existing functionality stays working while it improves step by step.

---

## Start here

This is all you need at the start of a session. The rest of the file is the long-term reference.

**Ready for human review: T01** ([PR #8](https://github.com/rmue21/seattle-hike-recs/pull/8)). Before merging, test it locally with your OpenAI key, check whether the AI text repeats the notes, and do a quick screen reader pass. Details are under T01.

**Now: T02 — Make the AI route trust only server-side data** (step 1 of 2: the server side)

**Why it matters:** Once the app is on a public URL, anyone could call `/api/personalize` directly with any text and hike data, and spend your OpenAI credits. This is the first blocker before the test deploy.

**First action:** Pick a length limit for the "Anything else?" notes field (somewhere around 300–500 characters). Then open `app/api/personalize/route.ts` and find where it reads `body.hikes`. That's the client-supplied data we'll stop trusting.

**Done when (step 1):**
- The route accepts only preferences, checks them against the allowed values, and rejects notes over the limit.
- The route picks candidate hikes itself from `data/hikes.ts`.
- A hand-crafted bad request is rejected or safely ignored.

**Step 2 (next session):** Update the form to send only preferences, and show a character counter on the notes field.

**Up next:** T03 — Add cost and abuse guardrails · T04 — Deploy to a public URL

---

## Product focus

This is a UX-focused project. Technical work earns its place by protecting users or unblocking a UX improvement. When two tasks have similar priority, prefer the one that improves the experience for hikers.

| Theme | What it means | Tasks |
|---|---|---|
| **Recommendation transparency** | Users can see why a hike was picked, what tradeoffs it involves, and how reliable the information is | T01, T26 (proposed), T06, T08, T21 |
| **Personalization** | Recommendations reflect where the user starts and what they care about | T11, T15, T13, T19, T23 |
| **Hiking experience** | Planning, safety, and confidence before heading out | T01, T08, T10, T20, T21 |
| **Inclusion** | Everyone can use the app, including keyboard and screen reader users | T05, T07 |
| **Foundations** | Security, deployment, and code health that make the above possible | T02, T03, T04, T09, T14 |
| **Evidence** | Learning what users actually need before building big features | T17, T18 |

---

## How we use this file

**Priorities**

- **P0 — Critical:** Security, deployment blockers, or anything that must be fixed before public release.
- **P1 — High:** Meaningful improvements to the core experience and functionality.
- **P2 — Medium:** Valuable enhancements, technical improvements, or investigations.
- **P3 — Future:** Larger, exploratory features that aren't essential yet.

"Public release" means sharing the link publicly (portfolio, resume, LinkedIn). The app can be deployed to a URL before then for testing, but every P0 task must be done before the link is shared.

**Effort**

- **Small:** Fits in one focused 20–30 minute session.
- **Medium:** About 2–4 sessions. Split into steps before starting.
- **Large:** 5+ sessions. Must be broken into smaller tasks before any work starts.
- **Research:** A time-boxed investigation that ends in a written recommendation, not code.

**Work queue rules**

- Exactly **one** task in Now, and **up to three** in Next.
- When a task moves into Now and is bigger than Small, we split it into session-sized steps first.
- At the end of each session: update the task's status, record any decisions, pick the next task, and rewrite the "Start here" section for it. Add a Done log entry only when a task reaches **Done**.
- **Session check-ins:** Start each session by showing only the current task, why it matters, and the next concrete action, as in "Start here." Show the larger plan only when asked.

**Task status**

Each task moves through these stages in order. A task doesn't skip a stage.

1. **In progress:** Being built.
2. **AI review:** The AI checks its own work before handing it over:
   - Lint, type-check, and build pass.
   - Every "done when" item the AI can test has been tested in every mode it covers (for example, AI and fallback, desktop and mobile, each data source).
   - The diff has been reread for mistakes.
   - Anything the AI can't test (for example, AI mode without a key, or a real screen reader) is listed for you instead of being checked off.
3. **Ready for human review:** The PR is open and describes what changed, what was tested, what wasn't, a checklist of your checks, and how to try it locally. Only items that were actually verified are checked off.
4. **Done:** You've completed your checks and merged the PR. Only then does the task get a Done log entry.

If your checks turn up a problem, the task goes back to In progress.

**Status labels for research findings**

- **Verified:** Checked directly against the primary source (official site, docs, or live data) on the date noted.
- **Secondary:** Comes from a reputable third-party source but hasn't been confirmed at the primary source.
- **Unverified / open:** An assumption or question that still needs research.

---

## Work queue

### Ready for human review

- **T01 — Show trail notes and a "verify before you go" note on each card**: [PR #8](https://github.com/rmue21/seattle-hike-recs/pull/8), waiting on your checks and merge

### Now

- **T02 — Make the AI route trust only server-side data** (P0, Medium; split into two steps)

### Next

1. **T03 — Add cost and abuse guardrails for the AI route** (P0, Small–Medium)
2. **T04 — Deploy to a public URL** (P0, Small)
3. **T05 — Keyboard and screen reader flow** (P0, Medium; can follow the test deploy)

### Later (in rough order)

- T07 — Accessibility and motion polish (P0; must be done before public release)
- T26 — Make it clear how each hike matches your preferences (P1, *proposed; explore UX approaches first*)
- T09 — Unit tests for scoring and API validation (P1; supports T06)
- T06 — Explain when preferences can't all be met (P1)
- T08 — Show total trip time on cards (P1)
- T10 — Add trailhead coordinates and data provenance (P1)
- T11 — Starting location, step 1: preset starting areas (P1)
- T12 — Portfolio-ready presentation (P1)
- R1 follow-ups (Research; can run in parallel as non-coding sessions)

### Milestones

These are rough groupings to keep the big picture visible, not deadlines.

- **M0 — Test deploy:** T01–T04. The app is live on Vercel's default domain for testing, but not promoted.
- **M1 — Public release:** M0 plus T05 and T07. All accessibility fixes are done before the link is promoted.
- **M2 — Portfolio-ready:** T06, T08, T12, T17 (usability study for the case study), and T26 if the exploration leads to a design
- **M3 — Location-aware:** T09, T10, T11, then T15
- **Beyond:** P3 items, chosen based on what the usability study shows

---

## P0 — Critical

### T01 — Show trail notes and a "verify before you go" note on each card

**Effort:** Small · **Status:** Ready for human review ([PR #8](https://github.com/rmue21/seattle-hike-recs/pull/8)); waiting on your checks below and merge

Every hike in `data/hikes.ts` has a `notes` field, but `RecommendationCard` never displays it. Add a "Good to know" section that shows the notes, plus a short line saying the stats are approximate, linking to the source.

- **Why it matters:** The notes hold planning and safety information, for example "pets are not allowed on park trails," "access crosses private land," "can hold snow into early summer," and "check tides." Right now users only see this if the AI happens to mention it, and in fallback mode they never do. A public hiking app shouldn't hide this.
- **Done when:**
  - [x] All three cards show the hike's notes in fallback mode.
  - [ ] All three cards show the hike's notes in AI mode. *(Your check: needs an OpenAI key.)*
  - [x] Each card makes clear that stats are approximate and points to the source link.
  - [x] It looks right at mobile width (checked at 390px).
  - [ ] The section reads naturally with a screen reader. *(Your check: only keyboard focus has been tested so far.)*
- **Your checks before merging:**
  - [ ] Run the branch locally with your key and confirm the cards look right next to a real AI explanation.
  - [ ] Check whether the AI's "Why this fits" now repeats what "Good to know" says. The prompt already sends the notes to the model. If it does repeat, decide whether to adjust the prompt now or log it as a follow-up.
  - [ ] Do a quick VoiceOver or NVDA pass over one card.
- **What we built:**
  - A quiet "Good to know:" paragraph after the scenery tags and before "Why this fits."
  - Below it, one line: "Stats are approximate. Check the latest trail details on wta.org before you go." The site name comes from each hike's source URL.
  - The source link moved there from the card header, and it tells screen reader users it opens in a new tab.
  - Skyline Loop's note was reworded for hikers.
- **AI review (tested by the AI):**
  - Lint, type-check, and build pass.
  - In the browser in fallback mode (no API key) at desktop width and at 390px.
  - The link is reachable by keyboard with a visible focus ring.
  - Cards linking to wta.org, nps.gov (Skyline Loop), and seattle.gov (Seward Park Loop) show the right site name and link.
  - Skyline Loop's reworded note appears correctly on screen.
  - A missing or malformed source URL makes the site-name helper return nothing, so the card shows "Check current conditions before you go." This was checked by running the same URL logic outside the app; no current hike has a missing URL.
- **Not tested by the AI (your checks below):** AI mode and a real screen reader.
- **Follow-up idea:** Notes mix plain descriptions with cautions (no dogs, private land, snow). Highlighting cautions would mean splitting the field in the data; see T10.

### T02 — Make the AI route trust only server-side data

**Effort:** Medium (about 2 sessions) · **Status:** Now

- **Step 1:** Server side. The route accepts and validates only preferences, enforces the notes limit, and scores candidates itself.
- **Step 2:** Client side. The form sends only preferences, and the notes field shows a character counter.

Today the browser runs the scoring and sends six full hike objects to `/api/personalize`. The server then forwards whatever it receives to OpenAI. Instead, the client should send only the user's preferences, and the server should score hikes from its own dataset, validate the input, and return hike IDs plus explanations.

- **Why it matters:** On a public URL, anyone could call the route directly with arbitrary text and hike data and use your OpenAI key at your expense. The notes field currently has no length limit. This also simplifies the client.
- **Done when:**
  - [ ] The route ignores any hike data sent by the client and builds candidates from `data/hikes.ts`.
  - [ ] Preferences are validated against the allowed values; invalid input returns a 400.
  - [ ] `additionalNotes` has a maximum length, enforced on the server and shown in the UI (for example, a character counter).
  - [ ] The local fallback still works with no API key.
  - [ ] A manual test with a crafted request (wrong values, huge notes, injected hike data) is rejected or safely ignored.
- **Dependencies / open questions:** What notes length limit feels right? (A starting point: 300–500 characters.)

### T03 — Add cost and abuse guardrails for the AI route

**Effort:** Small–Medium · **Status:** Next

Add limits so a public deployment can't run up a large OpenAI bill or be hammered by automated traffic.

- **Why it matters:** A portfolio app gets unpredictable traffic. A monthly spending cap and basic rate limiting protect you even if something goes wrong.
- **Done when:**
  - [ ] The app uses a dedicated OpenAI key and project with a monthly budget limit (you set this in the OpenAI dashboard).
  - [ ] The OpenAI call has a response token limit and a request timeout.
  - [ ] `/api/personalize` has per-visitor rate limiting, and the UI falls back gracefully when it's hit.
- **Dependencies / open questions:**
  - *Unverified:* the exact budget and usage-limit controls currently available in the OpenAI dashboard. Check before starting.
  - Rate limiting on serverless hosting usually needs a small external store, because in-memory counters reset per instance. Which store to use (if any) is an open question. A simple in-memory limiter might be acceptable at portfolio traffic levels.

### T04 — Deploy to a public URL

**Effort:** Small · **Status:** Next

Deploy the app with the OpenAI key set as a server-side environment variable, and add the URL to the README and the GitHub repo's homepage field.

- **Why it matters:** A portfolio piece needs a live link. Deploying early also enables testing on real devices and running a usability study (T17).
- **Done when:**
  - [ ] The production URL works on a phone and a desktop browser.
  - [ ] Both the AI path and the fallback path work in production.
  - [ ] No secrets appear in the client bundle.
  - [ ] The README and repo homepage link to the live site.
  - [ ] Pull requests get preview deployments (nice to have).
- **Dependencies / open questions:**
  - Depends on T02 and T03.
  - *Verified (2026-11-17):* Vercel's free Hobby plan is limited to non-commercial personal use ([fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines)), which fits a personal portfolio project.
  - *Decided (2026-11-17):* Host on Vercel using its default domain. A custom domain can come later.
  - This deploy is for testing. The app isn't publicly promoted until T05 and T07 are done.

### T05 — Keyboard and screen reader flow for submit, results, and start over

**Effort:** Medium (about 2 sessions) · **Status:** Next (can follow the test deploy; required before public promotion)

Fix the focus and announcement problems in the main flow:

- The submit button is disabled while loading, so keyboard focus is lost.
- Focus never moves to the results.
- The `aria-live` region is removed when loading finishes, so results aren't announced.
- "Start over" removes the button that was just pressed.
- The notes textarea has no label.

- **Why it matters:** Keyboard and screen reader users can't reliably tell that results have arrived. These map to WCAG criteria (2.4.3 Focus Order, 4.1.3 Status Messages, 3.3.2 Labels or Instructions). For a UX engineering portfolio, this work is part of the story, not just a fix.
- **Done when:**
  - [ ] After submitting, focus lands on the results heading once results load.
  - [ ] Loading and "results ready" are both announced by a screen reader.
  - [ ] "Start over" puts focus back at the start of the form.
  - [ ] The textarea has an accessible label.
  - [ ] A full keyboard-only walkthrough works, as does a screen reader walkthrough (VoiceOver or NVDA).
  - [ ] An automated check (for example, axe DevTools) reports no serious or critical issues.
- **Dependencies / open questions:** None.

### T07 — Accessibility and motion polish

**Effort:** Small · **Status:** Later (can follow the test deploy; required before public promotion)

Moved from P1 to P0 on 2026-11-17, following the decision that all accessibility fixes are done before the app is publicly promoted.

- Respect `prefers-reduced-motion` for smooth scrolling, the loading dots, and the pulsing skeleton.
- Style the radio and checkbox controls properly: `text-emerald-700` has no effect on native radios, so an `accent-*` color is needed.
- Add `focus-visible` styling to the option cards.
- Check color contrast on light gray text (for example, the `text-slate-400` resources heading).

- **Why it matters:** Small details that make the app feel finished and inclusive, and that portfolio reviewers notice.
- **Done when:**
  - [ ] Turning on reduced motion stops scroll animation and pulsing.
  - [ ] Selected controls show the brand color.
  - [ ] Focus is clearly visible on every interactive element.
  - [ ] All text meets WCAG AA contrast.
- **Dependencies / open questions:** None.

---

## P1 — High

### T06 — Explain when preferences can't all be met

**Effort:** Medium · **Status:** Later

Detect conflicting or unsatisfiable preferences in the scoring logic and say so clearly in the UI. Pass the same information to the AI so its explanations acknowledge the tradeoff.

- **Why it matters:** Today the app silently substitutes. Verified example from a local scoring run: choosing "2 to 3 hours" plus "Hard" returns six easy hikes, because no hard hike fits in three hours, and nothing tells the user why. Being honest about tradeoffs builds trust, and it's the most interesting design problem in the backlog.
- **Done when:**
  - [ ] A written list of conflict scenarios exists, for example difficulty vs. time, dog-friendly vs. national parks, and a drive limit that excludes everything matching a selected tag.
  - [ ] Each scenario produces a clear message above the results, in both AI and fallback modes.
  - [ ] The AI prompt receives the detected conflicts and explanations mention them.
  - [ ] Tests cover each scenario (see T09).
- **Dependencies / open questions:**
  - Easier after T09 (tests) and T14 (refactor).
  - Design decision for you: show "closest matches" with an explanation, suggest changing one answer ("Hard hikes here take about 5+ hours. Try Half day?"), or both?

### T26 — Make it clear how each hike matches your preferences

**Effort:** Research first (design exploration), then implementation sized once a direction is chosen · **Status:** Later · ***Proposed; explore approaches before committing to a design***

Help users see which of their preferences a hike meets and which it doesn't. The first step is to compare a few UX approaches, not to build one. A full checklist on every card is one option, not the plan.

- **Why it matters:** Today "Why this fits" is a paragraph, either AI-written or stitched together from scoring reasons. Users can't quickly check whether a hike meets their needs, or check the AI's claims. Making matches and tradeoffs visible could make recommendations more transparent and trustworthy, and it pairs naturally with T06.
- **Approaches to explore** (starting points, not a final list):
  1. **Full checklist:** every preference with met, close, or not met (the original idea).
  2. **Tradeoffs only:** show only what doesn't match, for example "Heads up: Moderate, not the Hard you asked for."
  3. **Highlighted explanation:** keep the "Why this fits" paragraph, but visually mark the parts tied to the user's own answers.
  4. **Expandable detail:** a collapsed "How this matches your answers" section that users can open.
  5. **Comparison view:** a compact side-by-side of the three hikes against the user's preferences.
- **Criteria for comparing them:**
  - How quickly it can be scanned on a phone.
  - Whether it's honest about mismatches.
  - How much visual weight it adds to each card.
  - Accessibility: not color alone, and works with screen readers.
  - Whether it works the same with and without AI.
  - Whether it builds or erodes trust in the AI's explanation.
- **Done when (exploration):**
  - [ ] 2–3 approaches are sketched as low-fidelity mockups, using real examples such as "2 to 3 hours" plus "Hard."
  - [ ] Each is compared against the criteria above.
  - [ ] You pick a direction, or decide not to pursue it.
  - [ ] An implementation task is written with its own definition of done.
- **Dependencies / open questions:**
  - Any approach will need the scoring logic to report results per preference, not just a combined score and reason text. That's a small change in `lib/scoring.ts`, and tests (T09) help.
  - Overlaps with T06: T26 shows tradeoffs per hike, while T06 explains why no hike fully fits. Exploring them together could avoid two competing patterns.
  - The usability study (T17) could test the chosen approach, or compare two of them.

### T08 — Show total trip time on cards

**Effort:** Small · **Status:** Later

Show the estimated total time (hike plus round-trip drive) on each card, using the same calculation as the scoring logic.

- **Why it matters:** Question 1 asks how much total time the user has, but the card shows only hike time and one-way drive time, so users have to do the math themselves.
- **Done when:**
  - [ ] Each card shows total trip time.
  - [ ] It uses the same function as scoring, with no duplicated math.
- **Dependencies / open questions:** None.

### T09 — Unit tests for scoring and API validation

**Effort:** Small–Medium · **Status:** Later

Add a test runner (for example, Vitest) with tests for time fit, drive fit, difficulty matching, experience tags, notes keywords, and the API's response validation. Run lint, build, and tests in GitHub Actions on every PR.

- **Why it matters:** This isn't here because it's easy. T06, T11, and T13 all change the scoring logic, and tests catch regressions and document how scoring works.
- **Done when:**
  - [ ] `npm test` runs and passes.
  - [ ] CI runs lint, build, and tests on pull requests.
- **Dependencies / open questions:** None.

### T10 — Add trailhead coordinates and data provenance to the dataset

**Effort:** Small–Medium · **Status:** Later

Add trailhead latitude/longitude, a `lastVerified` date, and a note on where each field came from to every hike.

- **Why it matters:** This is the foundation for starting locations, accurate drive times, maps, and weather. Recording sources keeps us honest about licensing and accuracy.
- **Done when:**
  - [ ] All hikes have trailhead coordinates and a `lastVerified` date.
  - [ ] Each record names its sources.
  - [ ] The dataset's TypeScript types are updated.
- **Dependencies / open questions:**
  - Use only sources R1 identifies as usable (for example, OpenStreetMap with attribution, or federal datasets).
  - Consider splitting `notes` into a description and a list of cautions, so the card can highlight cautions without styling every note as a warning (from T01).

### T11 — Starting location, step 1: preset starting areas

**Effort:** Medium · **Status:** Later

Let users pick a starting area from a short list (for example, Seattle, Eastside, North Sound, South Sound). Precompute drive times from each area to each trailhead once, store them with the data, and use the chosen area in scoring.

- **Why it matters:** This delivers the "where are you starting from?" goal without per-request API costs, geocoding rate limits, or collecting users' addresses. It's testable, and it shows whether location matters to users before building free-text input (T15).
- **Done when:**
  - [ ] Users can choose a starting area, with Seattle as the default.
  - [ ] Drive times and the "fits your time" logic reflect that area.
  - [ ] Card text no longer says "from Seattle" when another area is chosen.
  - [ ] Tests cover at least two origins.
- **Dependencies / open questions:**
  - Depends on T10, R2, and T09.
  - *Decided (2026-11-17):* Start with preset areas so we can validate the feature sooner. This is a stepping stone: the long-term goal is letting users enter their own city (T15).
  - Which starting areas should be on the list?
  - *Unverified:* whether each routing provider's terms allow storing precomputed drive times (R2).

### T12 — Portfolio-ready presentation

**Effort:** Small · **Status:** Later

- Replace the default Next.js favicon.
- Add Open Graph and social preview metadata and an image.
- Remove the unused starter SVGs in `public/`.
- Update the README with the live link, screenshots, and a short summary of design decisions.

- **Why it matters:** First impressions when the link is shared, and a clear story for portfolio reviewers.
- **Done when:**
  - [ ] Sharing the link shows a proper preview card.
  - [ ] The README includes the live link and screenshots.
- **Dependencies / open questions:** Depends on T04. Do you want a separate long-form case study, or is the README enough?

### T27 — Make the total time options distinct

**Effort:** Small · **Status:** Ready for human review

"Full day" (8 hours) and "All day" (12 hours) read as the same choice. The labels didn't say how long either one was, or that the time includes driving.

- **Decision (2026-11-24):** Keep four options rather than merging. Seven of the 32 hikes need 8 to 12 hours including the drive. Merging at 8 hours would hide them, and merging at 12 would show 10-hour trips to people who wanted 8.
- **Change:** The labels are now "Up to 3 hours," "Half day (up to 5 hours)," "Long day (up to 8 hours)," and "All day (up to 12 hours)." "Long day" was chosen for 8 hours because it reads as shorter than "All day." A hint under the question says "Includes driving there and back," and screen readers read it with the question. The values used by scoring and the AI are unchanged.
- **Done when:**
  - [x] No two options read as the same length of time.
  - [x] Each label shows its upper limit in hours.
  - [x] The form says that the time includes driving.
  - [x] Scoring results are unchanged for every option.
  - [ ] You're happy with the wording (your check).

---

## P2 — Medium

### T13 — Smarter notes keyword matching

**Effort:** Small

Match whole words instead of substrings, handle simple negation for dogs, and remove or fix the odd permit and snow rules.

- **Why it matters:** Verified in a local scoring run: "closed roads" matches "close," "reviews" matches "view," and "not bringing a dog" is treated like "bringing a dog."
- **Done when:**
  - [ ] Those cases behave correctly.
  - [ ] Tests cover them.
- **Dependencies / open questions:** Depends on T09. The AI already reads the notes in the final step, so this mainly improves fallback mode and candidate selection.

### T14 — Refactor the form and share constants

**Effort:** Small–Medium

- Pull the three near-identical radio groups and the checkbox group into a reusable component.
- Merge the identical `radioOptionClass` and `checkboxOptionClass`.
- Define the candidate count (6) and final count (3) in one place shared by client, server, and prompt.
- Stop mutating `data.recommendations` when sorting.

- **Why it matters:** `HikeFinder.tsx` is about 400 lines. A cleaner structure makes T06 and T11 easier and less error-prone.
- **Done when:**
  - [ ] There's no visual or behavior change.
  - [ ] The component is noticeably shorter.
  - [ ] Constants are defined once.
- **Dependencies / open questions:** Best done before T11.

### T15 — Starting location, step 2: type a city or address

**Effort:** Medium

Let users type a starting place. The server geocodes it, then calculates drive times from that point to each trailhead.

- **Why it matters:** This is the full version of the starting-location goal, and your stated long-term direction (decision 2026-11-17). T11 comes first to validate the idea cheaply.
- **Done when:**
  - [ ] Users can enter a place and get results based on it.
  - [ ] Errors and ambiguous places are handled clearly.
  - [ ] Provider attribution is shown.
  - [ ] Results are cached.
- **Dependencies / open questions:**
  - Depends on T11, R2, and T03.
  - If we use OpenStreetMap's public Nominatim geocoder, its [usage policy](https://operations.osmfoundation.org/policies/nominatim/) forbids autocomplete and caps the whole app at 1 request per second. The design would need a "search" button rather than search-as-you-type. Details are in R2.

### T16 — Grow the curated dataset

**Effort:** Medium–Large (split by region)

Expand from 32 hikes to roughly 60–75, using the provenance format from T10. Focus on real gaps, for example South Sound, Kitsap, and hikes that are accessible in winter.

- **Why it matters:** More variety makes recommendations better, especially for unusual combinations of preferences. Quality and accuracy matter more than raw count.
- **Done when:**
  - [ ] The agreed target count is reached.
  - [ ] Every new hike has coordinates, sources, and a `lastVerified` date.
  - [ ] Scoring tests still pass.
- **Dependencies / open questions:**
  - Depends on R1 and T10.
  - *Decided (2026-11-17):* Keep the curated dataset and use open data to supplement it. Revisit how far to expand once the usability study (T17) or feedback (T18) shows what users need.
  - What target size and regions?

### T17 — Lightweight usability study

**Effort:** Research

Run 3–5 short moderated sessions with task scenarios (for example, "find a dog-friendly hike for Saturday morning") and a short survey.

- **Why it matters:** This is evidence for the portfolio case study, and it tests our priorities. For example, do people care more about starting location, maps, or conditions?
- **Done when:**
  - [ ] A test plan exists.
  - [ ] Sessions are run.
  - [ ] Findings are summarized and turned into backlog changes.
- **Dependencies / open questions:** Best after T04. How will you recruit participants?

### T18 — "Was this helpful?" feedback

**Effort:** Small–Medium

Add a lightweight, privacy-respecting feedback signal on recommendations.

- **Why it matters:** Ongoing evidence about recommendation quality after the usability study.
- **Done when:**
  - [ ] Feedback is captured without personal data.
  - [ ] A short privacy note explains it.
- **Dependencies / open questions:** Depends on T04. Which analytics tool, if any?

### T19 — Remember the last answers

**Effort:** Small

Store the last-submitted preferences in the browser (`localStorage`) and offer to reuse them.

- **Why it matters:** This is the smallest useful version of "saved preferences," with no accounts and no server data.
- **Done when:**
  - [ ] Returning visitors see their last answers pre-filled.
  - [ ] There's a clear way to reset.
- **Dependencies / open questions:** None.

---

## P3 — Future

These are intentionally brief. Each will be broken into smaller tasks if and when we pick it up.

### T20 — Map of recommended trailheads

**Effort:** Large

Show the three recommended trailheads on a map, with the list staying the primary, accessible view.

- **Dependencies / open questions:** Depends on T10. Map tiles have their own usage policies and attribution rules (*unverified* for specific providers).

### T21 — Live conditions and alerts

**Effort:** Large

Show relevant, current information near each recommendation. Suggested order:

1. Link out to official condition and alert pages (Small).
2. National Park Service alerts for park hikes.
3. WSDOT mountain pass conditions for pass-area hikes.
4. National Weather Service forecast at the trailhead.

- **Dependencies / open questions:**
  - Depends on R3 and T10.
  - How do we show staleness and avoid implying a trail is safe?

### T22 — Accounts, saved hikes, and completed hikes

**Effort:** Large

- **Dependencies / open questions:** Requires authentication, a database, and a privacy policy. I'd recommend deferring this until the usability study shows demand. T19 covers the lightweight need.

### T23 — Conversational refinement

**Effort:** Large

Let users follow up, for example "something less crowded" or "closer to Tacoma."

- **Dependencies / open questions:** Depends on T02 and T06.

### T24 — Open-data pipeline for a larger dataset

**Effort:** Large

Build hikes from open data: trail and trailhead geometry from OpenStreetMap or government datasets, elevation gain computed from elevation data, and human review.

- **Dependencies / open questions:**
  - Depends on R1.
  - Computing elevation gain from U.S. Geological Survey elevation data is *unverified* and needs its own investigation.

### T25 — Expand beyond Washington

**Effort:** Large

- **Dependencies / open questions:** Depends on T24 or on curating each region by hand. See the expansion notes in R1.

---

## Research and investigations

### R1 — Trail data sources

**Effort:** Research · **Status:** Initial findings below (2026-11-17). Follow-up questions still open.

#### Goal

Find legally usable sources of Washington hiking and trailhead information, understand what each one actually provides, and decide how to grow the dataset before committing to a solution.

#### Headline finding

No source found so far offers ready-made hikes: a named destination with round-trip distance, elevation gain, difficulty, dog rules, and passes. The sites that do (WTA, AllTrails) don't allow reuse without permission. The open sources provide trail segments, trailheads, and management details. Expanding the dataset will therefore be curation work, possibly assisted by open data, rather than simply connecting an API.

#### Data fields we need for recommendations

| Field | Used for | Have today? | Likely legal sources |
|---|---|---|---|
| Name, location/region | Display | Yes | Any |
| Trailhead coordinates | Drive times, maps, weather | No | OSM, RCO trailheads, USFS, NPS, RIDB |
| Round-trip distance | Time fit, difficulty | Yes (manual) | Computed from OSM or agency geometry; agency pages |
| Elevation gain | Difficulty, workout | Yes (manual) | Computed from elevation data (*unverified*); agency pages |
| Estimated hike time | Time fit | Yes (manual) | Derived from distance and gain (a formula we choose) |
| Difficulty | Matching | Yes (manual) | Derived, or editorial judgment |
| Dogs allowed | Filtering | Yes (manual) | Land manager rules; RCO `pets_allowed` (sparse) |
| Pass or permit | Display | Yes (manual) | Land manager; RCO trailhead `parking_permit` |
| Seasonality / snow | Trust, safety | Partly (notes) | RCO `seasonality` (sparse); high point plus editorial notes |
| Scenery features | Matching | Yes (manual) | OSM tags (partial); editorial |
| Crowd level | Matching | Yes (manual) | Editorial only; no open source found |
| Land manager | Linking to official info and alerts | No | RCO `management_agency`, USFS, NPS |
| Source URL, last verified | Trust | URL only | Our own records |

#### Sources evaluated

| Source | Official API or download? | Cost | License / terms | Coverage | Fit | Status |
|---|---|---|---|---|---|---|
| **Washington Trails Association (WTA)** | No official API found | — | Terms limit content to "internal informational purposes"; reproduction requires prior written permission | 4,000+ WA hikes, best match for our needs | Link only, unless permission is granted | Terms **verified**; "no API" means none found |
| **AllTrails** | No public API or developer program found; `robots.txt` blocks `/api/` paths | — | Terms forbid copying, storing, or reproducing content and building tools from it | Worldwide | Not usable | `robots.txt` **verified**; terms clause **secondary** |
| **Hiking Project (onX)** | API shut down | — | Public API deprecated late 2020; onX declines new requests | US | Not usable | **Verified** |
| **WA State Trails Database (RCO)** | Yes, a public ArcGIS feature service and Hub download | Free | Listed as "WA OCIO Category 1 Data: Public Information"; attribution and redistribution terms unclear | Statewide: 22,454 trail segments, 202 trailheads | Good for geometry, land manager, and some attributes | **Verified** (see notes) |
| **USFS National Forest System Trails** | Yes, a download (geodatabase or shapefile) plus a map service | Free | U.S. federal work, generally public domain | National forests, including Mt. Baker-Snoqualmie | Good for trail geometry and names; detail varies by forest | Access **verified**; license **secondary** |
| **NPS Data API** | Yes, a REST API with a free key | Free, 1,000 requests/hour | U.S. federal work | National parks only | Strong for live alerts (T21), fees, and parking | **Verified** |
| **NPS Public Trails dataset** | Yes, a feature service | Free | U.S. federal work, public domain | National parks | Trail geometry in parks | **Secondary** |
| **Recreation.gov RIDB API** | Yes, a REST API with a free key | Free | "Free to anyone"; credit requested ("Data Source: Recreation.gov") | Federal recreation sites, including some trailheads | Possible source for trailhead coordinates and facility details | Terms **verified**; WA trailhead coverage **unverified** |
| **OpenStreetMap (Overpass API or extracts)** | Yes, downloads and a read-only API | Free | ODbL: attribution required; share-alike applies if we publish a derived database | Worldwide, quality varies | Good for geometry, trailheads, and some tags | License **verified**; coverage sampled once |

#### Notes on verified findings

- **WTA:** [Terms of Service](https://www.wta.org/our-work/about/terms-of-service), section 3, limits content use to internal informational purposes and requires prior written permission for anything else. The [press room](https://www.wta.org/news/press-room) says site information and photos are copyrighted. Third-party scrapers exist; we won't use them. Linking to WTA pages, as the app does now, is a different matter from reproducing their content.
- **AllTrails:** `robots.txt` disallows `/api/`, `/api-v4/`, and `/api-v5/`. The terms (updated 2025-12-17) prohibit copying, storing, reproducing, or building software from their products, according to a terms-tracking site. Secondary sources report active enforcement against scraping projects.
- **RCO trails database:** Checked live on 2026-11-17.
  - The public feature service (ArcGIS item `a8e9bf1b77644e9bbff6996a27030f5a`) has a Trails layer with 22,454 segments and a Trailheads layer with only 202 trailheads.
  - The data is organized by segment: Mount Si, for example, appears as several short pieces with blank `pets_allowed` and `seasonality`.
  - How often key fields are filled in across all segments: `pets_allowed` about 14% (3,196), `seasonality` about 17% (3,745), `trail_condition` about 15% (3,295), `informational_url` about 19% (4,158). `hiking_walking` is filled in for about 90%.
  - Useful trailhead fields include `parking_permit`, `restrooms`, `dates_open`, and `information_url`.
- **USFS:** The [FSGeodata Clearinghouse](https://data.fs.usda.gov/geodata/edw/datasets.php?xmlKeyword=trails) offers the National Forest System Trails dataset. Each forest chooses how much detail to publish, from just the route and name up to full allowed-use information.
- **NPS API:** [Free key](https://www.nps.gov/subjects/developer/get-started.htm), a default limit of 1,000 requests per hour, and endpoints including `alerts` (danger, closure, caution, information), `thingstodo`, `parkinglots`, `feespasses`, and `roadevents`.
- **RIDB:** [Recreation.gov's data page](https://www.recreation.gov/use-our-data) says the data is free for anyone, with no need to ask first, and requests a credit link.
- **OpenStreetMap:** Per the [attribution guidelines](https://osmfoundation.org/wiki/Licence/Attribution_Guidelines), showing OSM-derived content on a website requires visible "OpenStreetMap" attribution near the content, linking to openstreetmap.org/copyright. Publishing a modified or combined database triggers share-alike. A single sample query for Rattlesnake Ledge found a hiking route and trail segments tagged with difficulty scale (`sac_scale`) and surface, but no tags for dogs, elevation gain, or time.

#### Open questions

1. Would WTA grant permission for limited use, such as linking plus a few facts per hike, or is there a partnership path? Worth an email; WTA is a nonprofit and this is a non-commercial student project. *Deferred (2026-11-17): open to contacting WTA later, but not an immediate priority.*
2. What attribution and redistribution terms apply to RCO's "Category 1 Public Information" data? Ask RCO or find a published data-use statement.
3. What do the USFS dataset's metadata "use constraints" say, specifically for Mt. Baker-Snoqualmie National Forest data?
4. How many Washington trailheads are actually in RIDB? This needs a free key to check.
5. How complete is OpenStreetMap for all 32 current hikes (trailhead point, named route, tags)? A small, polite one-time check would answer this.
6. Can elevation gain be computed reliably from public U.S. Geological Survey elevation data along a trail line? This is a separate technical spike.
7. Are there county or city open-data trail layers worth adding (for example, King County Parks)?

#### Expanding beyond Washington

- **Scales nationally:** USFS, NPS (API and trails), the Bureau of Land Management's public trails, RIDB, OSM, and the National Weather Service. These would let the same approach work in other states.
- **Washington only:** RCO's database and WSDOT pass conditions. Other states have their own (or no) equivalents.
- **Doesn't scale automatically:** Editorial fields like crowd level, scenery highlights, and difficulty judgments. These need curation or a defensible way to derive them. This, not data access, is the real constraint on expansion.

#### Provisional recommendation

1. **Keep the curated dataset as the source of truth for now**, and add trailhead coordinates and provenance (T10).
2. **Use open data to check and fill in facts**, not to generate hikes automatically:
   - OSM and USFS for geometry and trailheads.
   - RCO for land manager and permit hints.
   - The NPS API for park alerts.
3. **Keep linking to WTA.** Emailing them about permission (open question 1) is deferred. Don't scrape WTA or AllTrails.
4. **Revisit an automated pipeline (T24)** only if the usability study shows users want many more hikes than curation can provide.

*Decided (2026-11-17):* Points 1, 2, and 4 are accepted. Expansion will be revisited once there's evidence about user needs.

#### Possible next research steps (each Small)

- R1a: Draft an email to WTA asking about permitted use. *(Deferred.)*
- R1b: Check OSM coverage for the 32 current hikes.
- R1c: Read the USFS and RCO use-constraint statements.
- R1d: Get an RIDB key and count Washington trailheads.

### R2 — Drive times and geocoding

**Effort:** Research · **Status:** Initial findings (2026-11-17)

#### Goal

Choose how to calculate drive times from a user's starting point (T11, T15), and how to turn typed places into coordinates.

#### Drive-time options

| Provider | Free allowance | Notes | Status |
|---|---|---|---|
| **openrouteservice (HeiGIT)** | Standard plan, free: Matrix 500 requests/day, 40/min | Based on OSM data; the API moved to `api.heigit.org` (the old host is being retired) | Limits **verified** on the HeiGIT plans page; commercial-use permission and host retirement are **secondary** |
| **Mapbox Matrix API** | 100,000 matrix elements/month free | Up to 25 coordinates per request | **Verified** ([pricing](https://www.mapbox.com/pricing), [docs](https://docs.mapbox.com/api/navigation/matrix/)) |
| **Google Routes API** (Compute Route Matrix, Essentials tier) | 10,000 elements/month free, then $5 per 1,000 | Includes traffic-aware options at higher tiers | **Verified** ([pricing](https://developers.google.com/maps/billing-and-pricing/pricing)) |

**Key insight:** With a preset list of starting areas (T11), we only need a one-time calculation, for example 6 areas × 32 hikes = 192 values, which fits any free tier. Free-text input (T15) needs about 1 × (number of hikes) values per search.

**Open questions:**

- Do each provider's terms allow storing precomputed results? Google and Mapbox have caching restrictions that need checking (*unverified*).
- How should we communicate that drive times are typical, not live traffic?
- How do we handle ferry routes (for example, Ebey's Landing) and seasonal road closures (for example, Hurricane Ridge and Mowich Lake roads)?

#### Geocoding (typed place to coordinates)

- **OpenStreetMap Nominatim (public server):** *Verified*, from the [usage policy](https://operations.osmfoundation.org/policies/nominatim/). If we choose it, the policy requires us to:
  - Stay at or below 1 request per second for the whole app, across all users.
  - Never build autocomplete or search-as-you-type on it.
  - Send an identifying User-Agent or Referer.
  - Show attribution and cache results.
  - Be able to switch providers on request.

  It suits a submit-button search at portfolio traffic levels, not autocomplete.
- **Alternatives to evaluate:** openrouteservice geocoding (3,000/day on the free plan, *verified*), plus the geocoding services from Mapbox and Google (pricing and terms *unverified*).

### R3 — Live conditions sources

**Effort:** Research · **Status:** Initial findings (2026-11-17)

| Source | What it offers | Access | Status |
|---|---|---|---|
| **NPS API `alerts`** | Closures, dangers, and cautions for national parks | Free key | **Verified** |
| **WSDOT Traveler Information API** | Mountain pass conditions: road condition, restrictions, weather, temperature | Free access code by email | Access **verified** ([WSDOT API](https://wsdot.wa.gov/traffic/api/)); no reuse license published (**secondary**) |
| **National Weather Service API** | 7-day and hourly forecasts and alerts by coordinates | Free, no key; identifying User-Agent required; two-step points-to-grid lookup | **Verified** ([NWS API](https://www.weather.gov/documentation/services-web-API)) |
| **WTA trip reports** | Recent hiker-reported conditions | No permission | Link only |
| **USFS alerts, avalanche forecasts, snow depth** | Forest closures, avalanche danger, snowpack | Unknown | **Unverified** |

**Open questions:**

- How do we show how fresh the information is, and avoid implying a trail is safe?
- Should conditions affect ranking, or only be displayed?

---

## Decisions log

Product and technical decisions, recorded as they're made.

| Date | Decision | Notes |
|---|---|---|
| 2026-11-17 | Keep the backlog in `BACKLOG.md` at the repo root | Agreed in the first planning session |
| 2026-11-17 | Don't scrape WTA or AllTrails without confirmed permission | Based on R1 findings |
| 2026-11-17 | Deploy for testing before all accessibility fixes, but finish them before publicly promoting the app | T05 and T07 gate public release (M1). T07 moved from P1 to P0 to match. |
| 2026-11-17 | Start with preset starting areas (T11); letting users enter their own city (T15) is the long-term goal | Preset areas validate the feature sooner and more cheaply |
| 2026-11-17 | Keep the curated dataset and supplement it with open data; revisit expansion after evidence about user needs | Affects T16, T24, T25 |
| 2026-11-17 | Contacting WTA about data use is deferred | Open to it later (R1 open question 1, R1a) |
| 2026-11-17 | Host on Vercel with its default domain for now | Custom domain can come later (T04) |
| 2026-11-17 | Keep this a UX-focused project, emphasizing recommendation transparency, personalization, and the hiking experience | See "Product focus"; T26 proposed in response |
| 2026-11-17 | T26 stays proposed; explore several UX approaches before committing to a full checklist on every card | T26 reframed as a design exploration |
| 2026-11-17 | Session check-ins show only the current task, why it matters, and the next action, unless the larger plan is requested | The "Start here" section holds that view. A separate `START_HERE.md` was tried and dropped; everything lives in this one file. |
| 2026-11-24 | T01 design: notes go before "Why this fits," use a quiet neutral style (not warning colors), and the source link moves from the header into one "stats are approximate" line that names the site | Notes mix descriptions and cautions, so warning styling would mislabel many of them |
| 2026-11-24 | Tasks move through In progress, AI review, Ready for human review, and Done. Done means your checks are complete and the PR is merged. | Prompted by T01 being marked done before AI mode and screen reader testing; see "Task status" |
| 2026-11-24 | Reword Skyline Loop's note for hikers instead of the developer-facing "this prototype treats it as hard" | Keeps the honesty about varying difficulty ratings |

## Done log

| Date | What | Link |
|---|---|---|
| 2026-11-17 | Initial codebase review and backlog created | [PR #6](https://github.com/rmue21/seattle-hike-recs/pull/6) |
| 2026-11-17 | Planning session 2: decisions recorded, Start here and Product focus sections added, T07 moved to P0, T26 proposed | [PR #7](https://github.com/rmue21/seattle-hike-recs/pull/7) |
| 2026-11-17 | Planning session 3: "Start here" section rewritten in the short check-in format, T26 reframed as a UX exploration | [PR #7](https://github.com/rmue21/seattle-hike-recs/pull/7) |
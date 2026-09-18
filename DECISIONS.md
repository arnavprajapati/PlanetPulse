# Decisions

## DP1 · The nudge

**Choice:** Encourage, not shame or block. When the weekly target is crossed, the app shows a warning-toned banner ("You're over your weekly target by X kg CO₂e") and continues to let the user log activities — it never blocks input.

**Why:** A carbon tracker is a habit tool, not an enforcement tool. Blocking logging would just push users to stop logging (the opposite of the goal — honest tracking). Shaming language increases app abandonment for behavior-change tools in general. A visible, factual warning keeps the target salient without adding friction or guilt, which is more likely to sustain daily use over weeks.

## DP2 · Absurd input

**Choice:** Accept the entry, calculate it normally, but flag it as `suspicious: true` and return a warning message when the quantity exceeds a generous per-type sanity threshold (e.g. car/bus > 2000 km, flight > 20,000 km, electricity > 2000 kWh, meals > 20 per entry). The UI surfaces the warning inline instead of silently accepting or hard-rejecting.

**Why:** Hard-rejecting risks losing legitimate edge cases (a long-haul flight genuinely can be >10,000 km) and is paternalistic about data the user owns. Silently accepting hides likely typos (e.g. an extra zero) that would badly skew the dashboard. Flagging is the middle ground: the data is preserved and counted (so the dashboard stays truthful to what was logged), but the user is told the entry looks off and can go fix it themselves. Only truly invalid values (zero, negative, non-numeric) are hard-rejected with a 400, since those aren't "absurd but possibly real" — they're just malformed.

## DP3 · The week

**Choice:** A week is an ISO week starting Monday 00:00 (local date), ending Sunday 23:59. Mid-week progress is shown as `current total this week / target`, with a progress bar and a day-of-week label (e.g. "Day 3 of 7") rather than pretending the week is complete.

**Why:** ISO weeks (Monday start) are the least ambiguous convention across regions and avoid the Sunday-vs-Monday confusion common in US vs. international calendars. Showing raw progress against the full target — rather than a pro-rated "expected so far" line — keeps the mental model simple for a hackathon-scope tool: users can see at a glance "here's where I am, here's where I need to stay under," without the app implying a false level of precision about pacing.


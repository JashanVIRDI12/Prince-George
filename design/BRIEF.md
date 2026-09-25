# BRIEF — Prince George Towing, below-hero rebuild

**Status: self-authored under explicit creative delegation.**
The user wrote: "this is a 10k dollar website so create think according to that…
all sections are very pinpoint made very accurately please start recreating
thank you. i believe you." No interview was run. Every answer below is an
authored decision, not a user quotation. The one hard user constraint is
recorded first.

## Hard constraints from the user

1. **The hero does not change.** Markup, copy, imagery, type and entrance
   animation stay exactly as built. Everything below it is replaced.
2. The page must not resemble their previous site. Section-for-section
   re-skinning is a failure condition.
3. Scroll must be the medium, not a decoration on top of a static page.

## The eight topics

1. **Vibe.** Cold, exact, mechanical, warm at the end. References: the lit cab
   of a truck seen from outside in the dark; a marine rescue log; the moment a
   winch line stops being slack.
2. **Journey.** Hero asks the question. Then: you, on the shoulder. What can
   actually go wrong and what happens next. How far the help reaches. The
   things you are quietly worried about. Silence. The tow. Home.
3. **Energy.** Hero is loud (inherited). The page immediately drops to cold and
   quiet, stays low and exact through the middle, goes near-silent, then one
   release. Loud, quiet, quiet, silent, release, settle.
4. **Feeling, stage by stage.** Recorded as the feeling curve below.
5. **The one thing no other site does.** The divider running down the page is a
   tow cable. It is the navigation and the progress readout for the whole page,
   it has real slack that responds to how fast you scroll, and at the peak it
   goes taut and physically drags the stranded half of the page across into the
   other half. The page's structure is resolved by a tow.
6. **Distance from premium-minimal.** Not premium-minimal. The brand is already
   loud. Target family: dense and structural, warmed by a single accent, with
   the volume spent on one moment instead of spread evenly.
7. **One world or distinct scenes.** Neither. Two columns held in tension for
   the whole page. See grammar.
8. **Assets.** Two existing original WebP images and the existing icon set. No
   generation budget assumed; no new photography requested. The page is built
   from type, SVG and colour, with the two photographs used once each.

## Grammar: split stage

From uniqueness.md §2.7. Chosen because the hero headline is already a
two-sided proposition: **BAD DAY? GOOD BACKUP.** The page below is the
resolution of that sentence. Left column is the bad day. Right column is the
backup. The divider between them carries the labels and the progress, and its
position across the page is a readout of how stuck the visitor still is:
it starts at 76% (the bad day owns the screen) and ends at 0% (backup owns
everything).

Why the other seven lost:

- **Filmic one-shot** — the default the skill puts a burden of proof on, and
  there is no footage budget to carry it. It is also what the existing page
  already gestures at.
- **Chaptered editorial** — towing is not long-form. Nobody reads a feature
  while stranded.
- **Live surface** — there is no product surface. The honesty rule forbids
  painting a fake dispatch console, and a real one would be a lie about a
  business with no connected backend.
- **Continuous world** — requires worldflight and a generated world. Wrong
  spend, and the grammar forbids the section boundaries this content needs.
- **Typographic poster** — the brand has real photography and a real place.
  Throwing both away to set big words would be a weaker page, not a purer one.
- **Gallery / catalog** — three services is not a collection, and museum labels
  are the wrong register for an emergency.
- **Rhythmic cutlist** — bans `pin`, which the peak needs, and the pulse it
  produces is the opposite of the calm this business sells.

**The grammar's exception, stated rather than hidden:** split stage forbids a
full-bleed corner-anchored hero. This page has one, because the user fixed it.
The split therefore opens directly beneath the hero and treats it as the title
card that poses the question. This is a declared deviation, not a blend.

## Feeling curve

Written before the acts.

```
1  Recognition   the cold column names where the visitor actually is, in their words
2  Reassurance   each failure is answered across the divider before it can settle
3  Distance      the reach drawn as real geography, the visitor finds themselves on it
4  Doubt         the quiet worries, set small and dense, answered without pitch
5  Held breath   authored silence: one line, a slack cable, nothing else
6  Release       the cable goes taut and the page is pulled into one column
7  Resolve       the single column holds, with one thing to do in it
```

No two adjacent acts share a feeling. Act 5 is **authored silence**, not dead
scroll; the verification pass must not report it as a defect.

## The peak

> the line running down the middle of the page went tight and pulled the whole
> left side across, and suddenly the page was one thing instead of two

It lives in act 6. It gets the largest span on the page by a clear margin, the
silence of act 5 in front of it, and the only photograph below the hero.

## Tell-someone sentence

> It's the site where the seam down the middle is a tow cable, and it hauls the
> page back together.

## Signature move

**The winch line.** A single SVG catenary runs the full height of the page on
the divider. It is not decoration and it is not a kit device:

- Scroll pays it out. Its sag is a real catenary whose control point is
  computed per frame.
- Scroll **velocity** shapes it. Fast scrolling whips slack into the line;
  stopping lets it settle. The page can tell it is being driven.
- Passing each act stamps a marker on the line that stays, so by the close the
  line is a record of the route, and the markers are clickable navigation.
- At the peak the slack resolves to zero, the line goes taut, and the divider
  it has been holding is dragged to the left edge, taking the stranded column
  with it.

Signature move, peak and tell-someone sentence are the same moment, as feel.md
§3 requires.

## Fingerprint gate

The registry at `design/FINGERPRINTS.md` was empty before this build. This is
row 1, so the gate passes with nothing to clear. The row is appended after
shipping, and the columns it fills are what the next build has to avoid.

## Score

| # | Beat | Feeling | Device | Span | Why this one |
|---|---|---|---|---|---|
| 1 | You are here | Recognition | `pin` + divider from `--p` | 1.8 | The split has to be understood as a format before it can carry an argument |
| 2 | What goes wrong | Reassurance | `pin`, states crossing inside the frame | 2.6 | Three problems answered in place reads as competence; three cards read as a brochure |
| 3 | How far it reaches | Distance | `reveal` + pointer, drawn map | 2.2 | A wipe is a change of state, and the state here is "the map now includes you" |
| 4 | What you are worried about | Doubt | `flow` + `in`, short stagger | 1.2 | Administrative content. Compressed on purpose, per feel.md §5 |
| 5 | Silence | Held breath | ground only, no cue | 0.8 | The peak needs something to arrive from |
| 6 | The tow | Release | bespoke: winch + collapse | 3.4 | The peak. Largest span, only photograph, the signature move |
| 7 | Home | Resolve | `pin`, single column, cue holds | 1.4 | The close resolves and holds instead of fading into a footer |

Device families used: pin, reveal, flow/in, pointer, bespoke, parallax (act 6
only). Six families, none twice in a row, no `scrub` at all — there is no
footage, and inventing some would be the expensive fragile thing the skill
warns about. Total: **13.4 viewport-heights**, inside the 8 to 14 budget.

## Palette

The existing page is roughly 80% cream. That flatness is a large part of why it
reads as a template. This page inverts: the ground is night, and light is
something the page earns.

| Token | Value | Role |
|---|---|---|
| `--night` | `#070B18` | Canvas below the hero. Off-black, never `#000` |
| `--deep` | `#0C1428` | Surface, raised panels |
| `--blue` | `#0534C3` | Kept. Brand cobalt, structural |
| `--orange` | `#FF6B2B` | Kept. The single accent: light, warmth, rescue |
| `--bone` | `#E9E5DA` | Ink on night, and the ground of the resolved column |
| `--bone-soft` | `#8D93A6` | Secondary, tinted to the canvas hue, never flat grey |

Two-stop accent is licensed by taste.md because the page hard-cuts between a
night ground and a bone ground and no single stop clears 4.5:1 on both.
`color` is restated wherever the ink token is, so inverted subtrees actually
re-ink.

## Type

Barlow Condensed and DM Sans are kept, because swapping the body face would
change the hero's paragraph rendering and the hero is fixed. Two families, not
three. The distinction from the old page comes from the system, not the faces:
the old page set every section title at one polite size, left-aligned, all
caps. This one uses real scale contrast, optical tracking that tightens as size
grows, and headings that are allowed to be small.

## Honesty constraints carried forward

No invented statistics, so no counters anywhere. No fabricated reviews,
response times, certifications or service history. The coverage map stays an
illustration of routes, not a navigation map. The request flow still prepares a
summary and does not dispatch a truck.

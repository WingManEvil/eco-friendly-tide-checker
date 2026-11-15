# Eco Friendly Tide Checker

A dead-simple tide tool for **Eco Friendly Events Diani**, plus a planner that tells the
crew whether a beach event is actually possible on the tide they've been asked for.

One file. Works offline. No accounts, no adverts, no API keys.

**Live:** https://wingmanevil.github.io/eco-friendly-tide-checker/

### Put it on a phone (no app store, no APK)

1. Open the link above in Chrome (Android) or Safari (iPhone)
2. Android: menu → **Add to Home screen**. iPhone: Share → **Add to Home Screen**

You get a real icon, it opens fullscreen without browser bars, and it updates itself — no
resending files. `manifest.json` gives it the name and icon; `sw.js` keeps a copy on the phone
so it still opens with no signal (after the first visit).

The app has four parts: **Now** (time + which way the water is moving), **Plan a beach event**
(does the tide allow this event, and when do we build), the **tide curve** (drag through the
year), and **Pick a day** (any date in detail).

## Plan a beach event

This is the working part. Enter the client's date and start time, how long setup takes, how long
the event runs, and how long **packing down** takes. The planner answers two questions:

1. **Is it possible?** — green, amber or red, based on where the water sits at the start *and*
   where it will be when the event ends.
2. **When does the crew start?** — the latest sensible build time that still finishes before
   the client's start.

The rule behind it is the one the crew already uses: **you can get onto the beach as the high
tide turns and starts pulling back, and you keep it for roughly one full tide cycle** until the
water returns.

So the planner also shows:

- **Guests leave** / **Crew off beach** — the event end, and the event end plus pack-down
- **Most sand (low)** — the low tide nearest the event, i.e. the best moment of the day
- **Water returns** — the next high tide; nothing should still be standing after this

Pack-down is a real constraint, not decoration: the crew is still on the sand after the guests
go home, and that is when the water catches people. A 4-hour event that ends at 6pm with two
hours of pack-down keeps the crew there until 8pm — if the water returns at 7pm, the planner
marks the whole thing red.

Every warning is written in plain words, e.g. *"By 10:00pm the water is back up to 2.89 m —
practically high tide, right where your guests are standing."*

The small chart inside the verdict shows **36 hours of tide** — a full day before the event and
12 hours after it — with **SETUP** (sand), **EVENT** (green) and **PACK** (grey) shaded, so you
can see at a glance whether the whole job — build, party and pack away — sits on dry sand.
Swipe it left or right to look further out; changing any input re-centres it on the event.

### The thresholds

Every level is compared against **the tide cycle the event sits in** — the low that runs into
the next high — not the whole day. That matters: on 12 Dec the morning high was 3.30 m, so the
evening's 2.75 m high looked harmless by comparison. It is not. An event ending at 2.55 m is
20 cm under the peak, and must fail.

| Check | Green | Amber | Red |
|---|---|---|---|
| Tide at the client's start | ≤ 35% of the rise | 35–65% | > 65% |
| Tide when guests leave | < 65% | 65–85% | ≥ 85% |
| Tide when packing ends | < 82% | 82–92% | ≥ 92% |
| Crew off vs water returning | > 45 min | 20–45 min | < 20 min, or the water arrives first |
| Crew start vs sand available | after the beach opens | — | before it opens |
| Setup finish vs event start | before | — | after the event begins |

Any red makes the whole verdict red. Amber anywhere makes it amber.

## How to open it

Open `index.html` in any browser — drag it onto an open Chrome/Edge window, or press
**Ctrl+O** in the browser and pick the file. It works offline, with no server and no
internet connection.

There is deliberately **no separate `.js` file**: on Windows, double-clicking a `.js` opens
Windows Script Host instead of a browser, which throws a confusing "syntax error". All the
tide data is therefore baked inside `index.html`.

## The top card

One job: tell you what time it is now, and which way the water is moving.

- **Water coming in** (teal, arrow up) → a **high** tide is approaching
- **Water going out** (sand, arrow down) → a **low** tide is approaching

The next tide time sits directly under the words, so there is nothing to work out.

## The tide curve

The red line is **you**, and it never moves. The world slides past it.

An **orange line marked NOW** is the real clock. It cannot be dragged — when you drag into
tonight or next week, the orange line slides away from the red one and shows you where the
actual present moment now sits on the curve.

- Drag **right** → look further ahead
- Drag **left** → look back
- Leave it alone, or press **Back to now**, and it snaps to the present

The graph opens three hours ahead on purpose: if it started exactly on the clock, the red line
and the orange NOW line would sit on top of each other and nothing would look draggable. The
red line carries a grab handle with arrows, and it pulses briefly on load.

The curve is drawn from the KMFRI **hourly** table (24 readings a day, page 25 onwards),
smoothed so it reads as a continuous line. Peaks and troughs are marked from the high/low
table, which is the same source. The vertical scale is fixed at 0–4 m so it never jumps
under your finger while dragging.

Visible window is 36 hours — long enough to see three tide cycles, short enough to read.

## Pick a day

Type a date (or tap **Today** / **Tomorrow**) and the whole app follows it:

- the graph jumps to midday of that date
- the day card below shows that date in detail

The day card lists the **rhythm**: every high and low with its height, and between them the
**half-tide** moment with the water level at that time. Highest and lowest are labelled.

Dragging the graph also updates the day card, so the picker and the graph are always
showing the same moment.

Some dates have only three tides — the booklet prints `--:--` when a high or low falls just
outside that calendar day, and the app says "3 main tides" rather than inventing a fourth.

## Where the numbers come from

Official tide predictions published by **KMFRI** (Kenya Marine & Fisheries Research
Institute) for the **Mombasa** tide gauge — the GLOSS station that has been recording since
1986. Their booklet is generated with T_TIDE from real sea-level observations.

- Source: `kmfri-2026.pdf` → https://www.kmfri.go.ke/tide-predictions
- Heights are metres above **lowest astronomical tide**
- Times are local, **GMT+3**

We chose this over free tide APIs because Open-Meteo's global model was measured at
**42 minutes wrong** for this coast (range −28 to −53 min across 15 events). The official
Kenyan table agreed with a commercial Diani tide site to within 9 minutes on the same day.
Accuracy beats convenience.

### Why Mombasa and not Diani

There is no tide gauge at Diani. Mombasa is the reference station for the whole south coast.
Cross-checked against a commercial Diani tide table, Diani runs **1–9 minutes behind** the
harbour. Close enough for planning a beach day; not exact for a reef passage.

## Refreshing for a new year

KMFRI publish the next year's booklet each December.

```bash
curl -LO "https://www.kmfri.go.ke/themes/custom/kmfri_theme/pdf/tide-predictions/tide-predictions-2027.pdf"
pdftotext -layout tide-predictions-2027.pdf kmfri.txt
python parse_tides.py        # rewrites tides.json + tides.js
```

`parse_tides.py` asserts 365 days parsed and spot-checks the output, so a corrupted
download fails loudly instead of shipping wrong tides.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole app — one file, data included, no build step |
| `tides.json` | The same predictions as JSON, for when this becomes a real backend |
| `parse_tides.py` | PDF → data. Re-run when a new yearly booklet is published |
| `build.py` | Runs the parser, then embeds the logo as a data URI |
| `logo.png` | The logo exactly as published on ecofriendlyeventsdiani.com |
| `logo-dark.png` | The same artwork with the white background removed and the grey-green wordmark recoloured cream, so it reads on the dark UI. Shapes, leaves and letters are unchanged |
| `kmfri-2026.pdf` | The original source document |
| `kmfri.txt` | Text dump of the PDF that the parser reads |

## Known limits

- **2026 only.** After 31 Dec 2026 the app says so plainly instead of guessing.
- Heights follow the official table; surfers may want the hourly curve too (KMFRI publish it
  on pages 25–36 of the booklet).
- No surge or weather. A strong onshore wind shifts real water level by 10–20 cm.

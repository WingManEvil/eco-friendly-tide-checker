# Eco Friendly Tide Checker

A dead-simple tide tool for **Eco Friendly Events Diani**, plus a planner that tells the
crew whether a beach event is actually possible on the tide they've been asked for.

One file. Works offline. No accounts, no adverts, no API keys.

The app has four parts: **Now** (time + which way the water is moving), **Plan a beach event**
(does the tide allow this event, and when do we build), the **tide curve** (drag through the
year), and **Pick a day** (any date in detail).

## Plan a beach event

This is the working part. Enter the client's date and start time, how long setup takes, and how
long the event runs. The planner answers two questions:

1. **Is it possible?** — green, amber or red, based on where the water sits at the start *and*
   where it will be when the event ends.
2. **When does the crew start?** — the latest sensible build time that still finishes before
   the client's start.

The rule behind it is the one the crew already uses: **you can get onto the beach as the high
tide turns and starts pulling back, and you keep it for roughly one full tide cycle** until the
water returns.

So the planner also shows:

- **Most sand (low)** — the low tide nearest the event, i.e. the best moment of the day
- **Water returns** — the next high tide; nothing should still be standing after this

Every warning is written in plain words, e.g. *"By 10:00pm the water is back up to 2.89 m —
practically high tide, right where your guests are standing."*

The small chart inside the verdict draws that day's tide with the **SETUP** and **EVENT**
blocks shaded, so you can see at a glance whether the work sits on dry sand.

### The thresholds

Levels are compared against that day's own low–high range, so "high" means high *for that day*:

| Check | Green | Amber | Red |
|---|---|---|---|
| Water at the client's start | bottom third | middle | top third |
| Water at the event end | below 60% | 60–85% | above 85% |
| Water arrives before the event ends | — | — | always red |
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

- Drag **right** → look further ahead
- Drag **left** → look back
- Leave it alone, or press **Back to now**, and it snaps to the present

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
| `kmfri-2026.pdf` | The original source document |
| `kmfri.txt` | Text dump of the PDF that the parser reads |

## Known limits

- **2026 only.** After 31 Dec 2026 the app says so plainly instead of guessing.
- Heights follow the official table; surfers may want the hourly curve too (KMFRI publish it
  on pages 25–36 of the booklet).
- No surge or weather. A strong onshore wind shifts real water level by 10–20 cm.

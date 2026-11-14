# Diani Tide

A dead-simple high/low tide app for Diani Beach, Kenya.

One screen. Next tide, how long until it, today's four tides, and the week ahead.
No map, no adverts, no 14-day chart, no account.

## How to open it

Open `index.html` in any browser — drag it onto an open Chrome/Edge window, or press
**Ctrl+O** in the browser and pick the file. It works offline, with no server and no
internet connection.

There is deliberately **no separate `.js` file**: on Windows, double-clicking a `.js` opens
Windows Script Host instead of a browser, which throws a confusing "syntax error". All the
tide data is therefore baked inside `index.html`.

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

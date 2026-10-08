# Live & Enjoy · 活在當下

A tiny static web app that shows one quote about enjoying life, in English with a Hong Kong-style Traditional Chinese version. The quote changes every hour, on the hour, in your local time. No backend, no login, no API keys.

## Run it

- **Quickest:** double-click `index.html`. It works from `file://`.
- **Local server:** `python3 -m http.server 8000`, then open <http://localhost:8000>.
- **Tests:** `node test.js` (Node 16+, no dependencies). To check other time zones, run `TZ=America/New_York node test.js`.
- **Preview another time:** add `?now=` to the URL in local time, for example `index.html?now=2026-10-08T19:00` (evening) or `?now=2026-10-08T09:30` (morning). Any minute works; the quote is the one for that hour. The clock keeps ticking from that moment, and a small note in the footer shows that the clock is faked.

## Files

| File | What it does |
| --- | --- |
| `index.html` | Page markup |
| `styles.css` | Mobile-first styles, the 6 time-of-day gradients, focus styles, fade-in |
| `quotes.js` | The quote list (English, Chinese, author, source, real or original) |
| `rotation.js` | Pure hourly slot, theme and selection logic, used by both the browser and Node |
| `app.js` | Renders the quote, the countdown, copy and share, and `?now=` |
| `test.js` | Node tests for the rotation logic and quote data |

## How the rotation works

1. Every hour is one slot in the **viewer's local time**. The quote changes at the top of each hour (09:00, 10:00, 11:00 …).
2. `slotIndex = (days since 2024-01-01) × 24 + local hour`. Days are counted from the local calendar date, so DST changes don't break it. When clocks spring forward, the skipped hour is simply skipped (still a new quote at the next hour). When clocks fall back, the repeated hour keeps the same quote for both passes.
3. The quote list is put into a fixed shuffled order using a seeded Fisher-Yates shuffle (seed `20261008`). The quote shown is `order[slotIndex mod N]`.
4. Everyone in the same time zone sees the same quote in the same hour, and a refresh doesn't change it. Every quote appears once before any repeats, which is a full cycle of N hours (67 quotes means 67 hours, about 2.8 days). So a quote you see now comes back at a different time of day next cycle.
5. The background follows the local hour: night (22:00–04:59), dawn (05:00–07:59), morning (08:00–11:59), afternoon (12:00–15:59), sunset (16:00–18:59) and evening (19:00–21:59).
6. While the page is open, a 1-second timer counts down to the next top of the hour and swaps the quote (and background, when the period changes) as soon as the hour turns.

## Add quotes

1. Add an object at the **end** of the list in `quotes.js`:
   ```js
   { en: "…", zh: "…", author: "Name", authorZh: "中文名", source: "Book (year)", kind: "real" }
   ```
   Use `kind: "original"`, `author: "Live & Enjoy"` and `authorZh: "Live & Enjoy 原創"` for lines you wrote yourself. Use `\n` for line breaks in poems.
2. Only add real quotes whose wording and source you have checked in the original book, poem, film or letter. Many quotes online are misattributed.
3. Run `node test.js`. It also re-runs itself under New York, London and Sydney time to check DST days.

Changing the number of quotes reshuffles the order, so the current quote may change once at that moment. That's expected.

## Host it free

- **GitHub Pages:** push the files to a repo, then go to *Settings → Pages → Deploy from a branch*, choose `main` and `/ (root)`. Your site will be at `https://<user>.github.io/<repo>/`.
- **Netlify Drop:** drag the folder onto <https://app.netlify.com/drop>.
- **Cloudflare Pages** or **Vercel:** import the repo with no build command and `/` as the output directory.

The share button only appears where the browser supports `navigator.share`, which is mostly phones and some desktop browsers. Copy works everywhere. On `file://` it falls back to a legacy copy method.

## Accuracy note

There are 53 attributed quotes, checked against their sources where possible. Translations are credited, and the English versions of the Chinese classics were written for this app. There are also 14 original lines credited to "Live & Enjoy". Please report any wording or attribution errors.

# Live & Enjoy · 活在當下

A tiny static web app that shows one quote about enjoying life, in English with a Hong Kong-style Traditional Chinese version. The quote changes every 6 hours. No backend, no login, no API keys.

## Run it

- **Quickest:** double-click `index.html`. It works from `file://`.
- **Local server:** `python3 -m http.server 8000`, then open <http://localhost:8000>.
- **Tests:** `node test.js` (Node 16+, no dependencies). To check other time zones, run `TZ=America/New_York node test.js`.
- **Preview another time:** add `?now=` to the URL in local time, for example `index.html?now=2026-10-08T19:00` (evening) or `?now=2026-10-08T07:30` (morning). The clock keeps ticking from that moment, and a small note in the footer shows that the clock is faked.

## Files

| File | What it does |
| --- | --- |
| `index.html` | Page markup |
| `styles.css` | Mobile-first styles, the 4 time-of-day gradients, focus styles, fade-in |
| `quotes.js` | The quote list (English, Chinese, author, source, real or original) |
| `rotation.js` | Pure slot and selection logic, used by both the browser and Node |
| `app.js` | Renders the quote, the countdown, copy and share, and `?now=` |
| `test.js` | Node tests for the rotation logic and quote data |

## How the rotation works

1. The day has 4 slots in the **viewer's local time**: 00:00 (night), 06:00 (morning), 12:00 (afternoon) and 18:00 (evening).
2. `slotIndex = (days since 2024-01-01) × 4 + slot of day`. Days are counted from the local calendar date, so DST changes don't break it.
3. The quote list is put into a fixed shuffled order using a seeded Fisher-Yates shuffle (seed `20261008`). The quote shown is `order[slotIndex mod N]`.
4. Everyone in the same time zone sees the same quote in the same slot, and a refresh doesn't change it. Every quote appears once before any repeats, which is a full cycle of N slots (67 quotes means about 16.75 days).
5. While the page is open, a 1-second timer updates the countdown and swaps the quote and background when the slot changes.

## Add quotes

1. Add an object at the **end** of the list in `quotes.js`:
   ```js
   { en: "…", zh: "…", author: "Name", authorZh: "中文名", source: "Book (year)", kind: "real" }
   ```
   Use `kind: "original"`, `author: "Live & Enjoy"` and `authorZh: "Live & Enjoy 原創"` for lines you wrote yourself. Use `\n` for line breaks in poems.
2. Only add real quotes whose wording and source you have checked in the original book, poem, film or letter. Many quotes online are misattributed.
3. Run `node test.js`.

Changing the number of quotes reshuffles the order, so the current quote may change once at that moment. That's expected.

## Host it free

- **GitHub Pages:** push the files to a repo, then go to *Settings → Pages → Deploy from a branch*, choose `main` and `/ (root)`. Your site will be at `https://<user>.github.io/<repo>/`.
- **Netlify Drop:** drag the folder onto <https://app.netlify.com/drop>.
- **Cloudflare Pages** or **Vercel:** import the repo with no build command and `/` as the output directory.

The share button only appears where the browser supports `navigator.share`, which is mostly phones and some desktop browsers. Copy works everywhere. On `file://` it falls back to a legacy copy method.

## Accuracy note

There are 53 attributed quotes, checked against their sources where possible. Translations are credited, and the English versions of the Chinese classics were written for this app. There are also 14 original lines credited to "Live & Enjoy". Please report any wording or attribution errors.
